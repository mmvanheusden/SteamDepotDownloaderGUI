// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod depotdownloader;
mod steam;
mod terminal;

use crate::depotdownloader::{get_depotdownloader_url, DEPOTDOWNLOADER_VERSION};
use crate::terminal::Terminal;
use std::env;
use std::io::ErrorKind::AlreadyExists;
use std::path::{Path, PathBuf};
use std::sync::OnceLock;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_shell::ShellExt;


/// The first terminal found. Used as default terminal.
static TERMINAL: OnceLock<Vec<Terminal>> = OnceLock::new(); // We create this variable now, and quickly populate it in preload_vectum(). we then later access the data in start_download()
static WORKING_DIR: OnceLock<PathBuf> = OnceLock::new();

/// This function is called every time the app is reloaded/started. It quickly populates the [`TERMINAL`] variable with a working terminal.
#[tauri::command]
async fn preload_vectum(app: AppHandle) {
    // Only fill these variables once.
    if TERMINAL.get().is_none() {
        TERMINAL.set(terminal::get_installed_terminals(true, app.shell()).await).expect("Failed to set available terminals")
    }

    if WORKING_DIR.get().is_none() {
        WORKING_DIR.set(Path::join(&app.path().local_data_dir().unwrap(), "SteamDepotDownloaderGUI")).expect("Failed to configure working directory")
    }

    // Send the default terminal name to the frontend.
    app.emit(
        "default-terminal",
        Terminal::pretty_name(&TERMINAL.get().unwrap()[0]),
    ).unwrap();
}

#[tauri::command]
async fn start_download(steam_download: steam::SteamDownload, app: AppHandle) {
    let default_terminal = TERMINAL.get().unwrap();
    let shell = app.shell();
    let terminal_to_use = if steam_download.options().terminal().is_none() { default_terminal.first().unwrap() } else { &Terminal::from_index(&steam_download.options().terminal().unwrap()).unwrap() };
    // Also change working directory
    std::env::set_current_dir(&WORKING_DIR.get().unwrap()).unwrap();

    println!("\n-------------------------DEBUG INFO------------------------");
    println!("received these values from frontend:");
    println!("\t- Username: {}", steam_download.username().as_ref().unwrap_or(&String::from("Not provided")));
    // println!("\t- Password: {}", steam_download.password().as_ref().unwrap_or(&String::from("Not provided"))); Don't log in prod lol
    println!("\t- App ID: {}", steam_download.app_id());
    println!("\t- Depot ID: {}", steam_download.depot_id());
    println!("\t- Manifest ID: {}", steam_download.manifest_id());
    println!("\t- Output Path: {}", steam_download.output_path());
    println!("\t- Default terminal: {}", Terminal::pretty_name(&default_terminal[0]));
    println!("\t- Working directory: {}", &WORKING_DIR.get().unwrap().display());
    println!("\t- Terminal command: \n\t  {:?}", terminal_to_use.create_command(&steam_download, shell, &WORKING_DIR.get().unwrap()));
    println!("----------------------------------------------------------\n");


    terminal_to_use.create_command(&steam_download, shell, &WORKING_DIR.get().unwrap()).spawn().ok();
}

/// Downloads the DepotDownloader zip file from the internet based on the OS.
#[tauri::command]
async fn download_depotdownloader() {
    let url = get_depotdownloader_url();

    // Where we store the DepotDownloader zip.
    let zip_filename = format!("DepotDownloader-v{}-{}.zip", DEPOTDOWNLOADER_VERSION, env::consts::OS);
    let depotdownloader_zip = Path::join(&WORKING_DIR.get().unwrap(), Path::new(&zip_filename));


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

    depotdownloader::unzip(depotdownloader_zip.as_path(), &WORKING_DIR.get().unwrap()).unwrap();
    println!("Succesfully extracted DepotDownloader zip.");
}

/// Checks internet connectivity using Google
#[tauri::command]
async fn internet_connection() -> bool {
    let client = reqwest::Client::builder().timeout(Duration::from_secs(5)).build().unwrap();

    client.get("https://connectivitycheck.android.com/generate_204").send().await.is_ok()
}

#[tauri::command]
async fn get_all_terminals(app: AppHandle) {
    let terminals = terminal::get_installed_terminals(false, app.shell()).await;

    terminals.iter().for_each(|terminal| {
        println!("Terminal #{} ({}) is installed!", terminal.index().unwrap(), terminal.pretty_name());

        // Sends: (terminal index aligned with dropdown; total terminals)
        app.emit("working-terminal", (terminal.index(), Terminal::total())).unwrap();
    });
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
    if get_os() == "macos" {
        let _ = fix_path_env::fix(); // todo: does this actually do something useful
        // let documents_dir = format!(
        //     "{}/Documents/SteamDepotDownloaderGUI",
        //     std::env::var_os("HOME").unwrap().to_str().unwrap()
        // );
        // let documents_dir = Path::new(&documents_dir);
        // // println!("{}", documents_dir.display());

        // std::fs::create_dir_all(documents_dir).unwrap();
        // env::set_current_dir(documents_dir).unwrap();
    }

    println!();
    tauri::Builder::default().plugin(tauri_plugin_dialog::init()).plugin(tauri_plugin_shell::init()).invoke_handler(tauri::generate_handler![
            start_download,
            download_depotdownloader,
            internet_connection,
            preload_vectum,
            get_all_terminals
        ]).run(tauri::generate_context!()).expect("error while running tauri application");
}
