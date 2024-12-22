use crate::get_os;
use reqwest;
use std::fs::File;
use std::io::ErrorKind::AlreadyExists;
use std::path::PathBuf;
use std::{fs, io};
use std::{io::Write, path::Path};

pub static DEPOTDOWNLOADER_VERSION: &str = "2.7.4";


/**
See: [`test_get_depotdownloader_url()`]
*/
pub fn get_depotdownloader_url() -> String {
    let arch = match std::env::consts::ARCH {
        "x86_64" => "x64",
        "aarch64" => "arm64",
        "arm" => "arm",
        _ => "x86_64",
    };

    format!("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_{}/DepotDownloader-{}-{}.zip", DEPOTDOWNLOADER_VERSION, get_os(), arch)
}

/// Downloads a file. The file will be saved to the [`filename`] provided.
pub async fn download_file(url: &str, filename: &Path) -> io::Result<()> {
    if filename.exists() {
        println!("DEBUG: Not downloading. File already exists.");
        return Err(io::Error::from(AlreadyExists));
    }

    // Create any missing directories.
    if let Some(p) = filename.parent() {
        if !p.exists() {
            fs::create_dir_all(p)?;
        }
    }

    let mut file = File::create(filename)?;
    let response = reqwest::get(url)
        .await
        .expect("Failed to contact internet.");

    let content = response.bytes().await.unwrap();

    file.write_all(&content)?;
    Ok(())
}

/// Unzips DepotDownloader zips
pub fn unzip(zip_file: &Path, working_dir: &PathBuf) -> io::Result<()> {
    let file = File::open(zip_file)?;
    let mut archive = zip::ZipArchive::new(file)?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let outpath = match file.enclosed_name() {
            Some(path) => working_dir.join(path),
            None => continue,
        };

        println!("Extracted {} from archive.", outpath.display());

        if let Some(p) = outpath.parent() {
            if !p.exists() {
                fs::create_dir_all(p)?;
            }
        }
        let mut outfile = File::create(&outpath)?;
        io::copy(&mut file, &mut outfile)?;

        // Copy over permissions from enclosed file to extracted file on UNIX systems.
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;

            // If the mode `file.unix_mode()` is something (not None), copy it over to the extracted file.
            if let Some(mode) = file.unix_mode() {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(mode))?;
            }

            // Set executable permission.
            if outpath.file_name().unwrap() == "DepotDownloader" {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(0o755))?;
            }
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use reqwest::blocking;

    #[test]
    /// checks if all possible DepotDownloader URLs exist.
    fn test_get_depotdownloader_url() {
        for os in ["windows", "linux", "macos"].iter() {
            for arch in ["x64", "arm64", "arm"].iter() {
                if arch.eq(&"arm") && !os.eq(&"linux") {
                    continue;
                }
                let url = format!("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_{}/DepotDownloader-{}-{}.zip", DEPOTDOWNLOADER_VERSION, os, arch);
                println!("Testing DepotDownloader URL: {}", url);

                assert!(blocking::get(url).unwrap().status().is_success());
            }
        }
    }
}
