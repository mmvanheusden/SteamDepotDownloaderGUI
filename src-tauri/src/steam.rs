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
    output_directory_name: Option<String>,
    no_mobile_auth: bool,
}


impl SteamDownload {
    /// If a username or password are not provided, the download is considered anonymous
    pub fn is_anonymous(&self) -> bool {
        self.username.is_none() || self.password.is_none()
    }

    pub fn output_path(&self) -> String {
        let base_path = self.output_location.as_deref().unwrap_or(std::path::Path::new("."));
        let mut target_dir = self.output_directory_name.as_deref().unwrap_or(&self.manifest_id);

        if target_dir.len() >= 2 {
            let bytes = target_dir.as_bytes();
            if bytes[0].is_ascii_alphabetic() && bytes[1] == b':' {
                target_dir = &target_dir[2..];
            }
        }

        let normalized = target_dir.replace('\\', "/");
        let mut safe_target = PathBuf::new();
        for comp in std::path::Path::new(&normalized).components() {
            if let std::path::Component::Normal(c) = comp {
                safe_target.push(c);
            }
        }

        if safe_target.as_os_str().is_empty() {
            safe_target.push(&self.manifest_id);
        }

        base_path.join(safe_target).to_string_lossy().into_owned()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_download(
        username: Option<&str>,
        password: Option<&str>,
        output_location: Option<PathBuf>,
        output_directory_name: Option<&str>,
    ) -> SteamDownload {
        SteamDownload {
            username: username.map(|s| s.to_string()),
            password: password.map(|s| s.to_string()),
            app_id: "123".to_string(),
            depot_id: "456".to_string(),
            manifest_id: "789".to_string(),
            output_location,
            output_directory_name: output_directory_name.map(|s| s.to_string()),
            no_mobile_auth: false,
        }
    }

    #[test]
    fn test_is_anonymous() {
        let anon1 = create_download(None, None, None, None);
        assert!(anon1.is_anonymous());

        let anon2 = create_download(Some("user"), None, None, None);
        assert!(anon2.is_anonymous());

        let anon3 = create_download(None, Some("pass"), None, None);
        assert!(anon3.is_anonymous());

        let not_anon = create_download(Some("user"), Some("pass"), None, None);
        assert!(!not_anon.is_anonymous());
    }

    #[test]
    fn test_output_path() {
        let sep = std::path::MAIN_SEPARATOR;

        // Both provided
        let dl1 = create_download(None, None, Some(PathBuf::from("my_dir")), Some("my_out"));
        assert_eq!(dl1.output_path(), format!("my_dir{}my_out", sep));

        // Location provided, name not provided (uses manifest_id)
        let dl2 = create_download(None, None, Some(PathBuf::from("my_dir")), None);
        assert_eq!(dl2.output_path(), format!("my_dir{}789", sep));

        // Location not provided, name provided
        let dl3 = create_download(None, None, None, Some("my_out"));
        assert_eq!(dl3.output_path(), format!(".{}my_out", sep));

        // Neither provided (uses manifest_id)
        let dl4 = create_download(None, None, None, None);
        assert_eq!(dl4.output_path(), format!(".{}789", sep));

        // Absolute path provided (should be stripped)
        let dl5 = create_download(None, None, Some(PathBuf::from("base")), Some("/etc/passwd"));
        assert_eq!(dl5.output_path(), format!("base{}etc{}passwd", sep, sep));

        let dl6 = create_download(None, None, Some(PathBuf::from("base")), Some("C:\\Windows\\System32"));
        assert_eq!(dl6.output_path(), format!("base{}Windows{}System32", sep, sep));

        // Directory traversal provided
        let dl7 = create_download(None, None, Some(PathBuf::from("base")), Some("../../etc"));
        assert_eq!(dl7.output_path(), format!("base{}etc", sep));

        // Mixed slashes
        let dl8 = create_download(None, None, Some(PathBuf::from("base")), Some("some\\mixed/path"));
        assert_eq!(dl8.output_path(), format!("base{}some{}mixed{}path", sep, sep, sep));

        // Empty resulting safe path fallback to manifest_id
        let dl9 = create_download(None, None, Some(PathBuf::from("base")), Some("../.."));
        assert_eq!(dl9.output_path(), format!("base{}789", sep));
    }
}