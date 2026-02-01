use std::io::BufRead;
use std::path::PathBuf;
use portable_pty::{CommandBuilder, PtySize};
use tauri::State;
use crate::AppState;
use crate::steam::SteamDownload;

#[tauri::command]
pub async fn async_write_to_pty(data: &str, state: State<'_, AppState>) -> Result<(), ()> {
    write!(state.writer.lock().await, "{}", data).map_err(|_| ())
}

#[tauri::command]
pub async fn async_read_from_pty(state: State<'_, AppState>) -> Result<Option<String>, ()> {
    let mut reader = state.reader.lock().await;
    let data = {
        // Read all available text
        let data = reader.fill_buf().map_err(|_| ())?;

        // Send the data to the webview if necessary
        if data.len() > 0 {
            std::str::from_utf8(data)
                .map(|v| Some(v.to_string()))
                .map_err(|_| ())?
        } else {
            None
        }
    };

    if let Some(data) = &data {
        reader.consume(data.len());
    }

    Ok(data)
}

#[tauri::command]
pub async fn async_resize_pty(rows: u16, cols: u16, state: State<'_, AppState>) -> Result<(), ()> {
    state
        .pty_pair
        .lock()
        .await
        .master
        .resize(PtySize {
            rows,
            cols,
            ..Default::default()
        })
        .map_err(|_| ())
}


/// Creates the DepotDownloader command necessary to download the requested manifest.
pub fn create_depotdownloader_command(steam_download: &SteamDownload, cwd: &PathBuf) -> CommandBuilder {
    let depotdownloader_binary = if cfg!(windows) {
        "DepotDownloader.exe"
    } else {
        "DepotDownloader"
    };
    
    let program = cwd.join(depotdownloader_binary);
    let mut command = CommandBuilder::new(program);
    
    command.cwd(cwd);

    if !steam_download.is_anonymous() {
        command.args(["-username", &*steam_download.username().clone().unwrap()]);
        command.args(["-password", &*steam_download.password().clone().unwrap()]);
    }

    command.args(["-app", &*steam_download.app_id()]);
    command.args(["-depot", &*steam_download.depot_id()]);
    command.args(["-manifest", &*steam_download.manifest_id()]);
    command.args(["-dir", &*steam_download.output_path()]);

    command
}
