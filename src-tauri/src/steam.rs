use derive_getters::Getters;
use serde::Deserialize;
use std::path::PathBuf;


/// Represents the data required to download a Steam depot.
#[derive(Deserialize, Debug, Getters)]
#[serde(rename_all = "camelCase")]
pub struct SteamDownload {
    username: Option<String>,
    password: Option<String>,
    app_id: String,
    depot_id: String,
    manifest_id: String,
    output_location: Option<PathBuf>,
    output_directory_name: Option<String>
}


impl SteamDownload {
    /// If a username or password are not provided, the download is considered anonymous
    pub fn is_anonymous(&self) -> bool {
        self.username.is_none() || self.password.is_none()
    }

    /// The directory where the download should happen
    pub fn output_path(&self) -> String {
        let sep = std::path::MAIN_SEPARATOR.to_string();
        match (&self.output_location, &self.output_directory_name) {
            (Some(output_dir), Some(dir_name)) => format!("{}{}{}", output_dir.display(), sep, dir_name),
            (Some(output_dir), None) => format!("{}{}{}", output_dir.display(), sep, &self.manifest_id),
            (None, Some(dir_name)) => format!(".{}{}", sep, dir_name),
            (None, None) => format!(".{}{}", sep, &self.manifest_id)
        }
    }
}