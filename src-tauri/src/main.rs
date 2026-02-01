// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod depotdownloader;
mod steam;
mod terminal;

use crate::depotdownloader::{get_depotdownloader_url, DEPOTDOWNLOADER_VERSION};
use crate::terminal::{async_read_from_pty, async_resize_pty, async_write_to_pty};
use portable_pty::{native_pty_system, PtyPair, PtySize};
use std::io::ErrorKind::AlreadyExists;
use std::io::{BufReader, Read, Write};
use std::path::{Path, PathBuf};
use std::sync::{Arc, OnceLock};
use std::time::Duration;
use std::{env, thread};
use tauri::async_runtime::Mutex;
use tauri::{AppHandle, Emitter, Manager, State};

struct AppState {
    pty_pair: Arc<Mutex<PtyPair>>,
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    reader: Arc<Mutex<BufReader<Box<dyn Read + Send>>>>,
}


/// The first terminal found. Used as default terminal.
static WORKING_DIR: OnceLock<PathBuf> = OnceLock::new();

/// This function is called every time the app is reloaded/started. It quickly populates the [`TERMINAL`] variable with a working terminal.
#[tauri::command]
async fn preload_vectum(app: AppHandle) {
    // Only fill these variables once.

    if WORKING_DIR.get().is_none() {
        WORKING_DIR.set(Path::join(&app.path().local_data_dir().unwrap(), "SteamDepotDownloaderGUI")).expect("Failed to configure working directory")
    }
}

#[tauri::command]
async fn start_download(steam_download: steam::SteamDownload, app: AppHandle, state: State<'_, AppState>) -> Result<(), String> {
    // Also change working directory
    // std::env::set_current_dir(&WORKING_DIR.get().unwrap()).unwrap();

    println!("\n-------------------------DEBUG INFO------------------------");
    println!("received these values from frontend:");
    println!("\t- Username: {}", steam_download.username().as_ref().unwrap_or(&String::from("Not provided")));
    // println!("\t- Password: {}", steam_download.password().as_ref().unwrap_or(&String::from("Not provided"))); Don't log in prod lol
    println!("\t- App ID: {}", steam_download.app_id());
    println!("\t- Depot ID: {}", steam_download.depot_id());
    println!("\t- Manifest ID: {}", steam_download.manifest_id());
    println!("\t- Output Path: {}", steam_download.output_path());
    println!("\t- Working directory: {}", &WORKING_DIR.get().unwrap().display());
    println!("----------------------------------------------------------\n");

    /* Build the command and spawn it in our terminal */
    let mut cmd = terminal::create_depotdownloader_command(&steam_download, WORKING_DIR.get().unwrap());

    // add the $TERM env variable so we can use clear and other commands
    #[cfg(target_os = "windows")]
    cmd.env("TERM", "cygwin");
    #[cfg(not(target_os = "windows"))]
    cmd.env("TERM", "xterm-256color");

    let mut child = state
        .pty_pair
        .lock()
        .await
        .slave
        .spawn_command(cmd)
        .map_err(|err| err.to_string())?;

    thread::spawn(move || {
        let status = child.wait().unwrap();
        println!("Command exited with status: {status}");
        app.emit("command-exited", {}).unwrap();
        // exit(status.exit_code() as i32)
    });
    Ok(())
}

/// Downloads the DepotDownloader zip file from the internet based on the OS.
#[tauri::command]
async fn download_depotdownloader() {
    let url = get_depotdownloader_url();

    // Where we store the DepotDownloader zip.
    let zip_filename = format!("DepotDownloader-v{}-{}.zip", DEPOTDOWNLOADER_VERSION, env::consts::OS);
    let depotdownloader_zip = Path::join(WORKING_DIR.get().unwrap(), Path::new(&zip_filename));


    if let Err(e) = depotdownloader::download_file(url.as_str(), depotdownloader_zip.as_path()).await {
        if e.kind() == AlreadyExists {
            println!("DepotDownloader already exists. Skipping download.");
        } else {
            println!("Failed to download DepotDownloader: {}", e);
        }
        return;
    } else {
        println!("Downloaded DepotDownloader for {} to {}", env::consts::OS, depotdownloader_zip.display());
    }

    depotdownloader::unzip(depotdownloader_zip.as_path(), WORKING_DIR.get().unwrap()).unwrap();
    println!("Succesfully extracted DepotDownloader zip.");
}

/// Checks internet connectivity using Google
#[tauri::command]
async fn internet_connection() -> bool {
    let client = reqwest::Client::builder().timeout(Duration::from_secs(5)).build().unwrap();

    client.get("https://connectivitycheck.android.com/generate_204").send().await.is_ok()
}


pub fn get_os() -> &'static str {
    match env::consts::OS {
        "linux" => "linux",
        "macos" => "macos",
        "windows" => "windows",
        _ => "unknown",
    }
}

fn main() {
    // macOS: change dir to documents because upon opening, our current dir by default is "/".
    // todo: Is this still needed ??
/*    if get_os() == "macos" {
        let _ = fix_path_env::fix();
        // let documents_dir = format!(
        //     "{}/Documents/SteamDepotDownloaderGUI",
        //     std::env::var_os("HOME").unwrap().to_str().unwrap()
        // );
        // let documents_dir = Path::new(&documents_dir);
        // // println!("{}", documents_dir.display());

        // std::fs::create_dir_all(documents_dir).unwrap();
        // env::set_current_dir(documents_dir).unwrap();
    }*/

    /* Initialize the pty system */
    let pty_system = native_pty_system();

    let pty_pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .unwrap();

    let reader = pty_pair.master.try_clone_reader().unwrap();
    let writer = pty_pair.master.take_writer().unwrap();

    println!();
    tauri::Builder::default()
        .manage(AppState {
            pty_pair: Arc::new(Mutex::new(pty_pair)),
            writer: Arc::new(Mutex::new(writer)),
            reader: Arc::new(Mutex::new(BufReader::new(reader))),
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            start_download,
            download_depotdownloader,
            internet_connection,
            preload_vectum,
            async_write_to_pty,
            async_read_from_pty,
            async_resize_pty,
        ]).run(tauri::generate_context!())
        .expect("error while running tauri application");
}
