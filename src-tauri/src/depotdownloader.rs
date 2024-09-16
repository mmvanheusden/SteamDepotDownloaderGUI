use std::fs::File;
use std::io::ErrorKind::AlreadyExists;
use std::{fs, io};
use std::{io::Write, path::Path};

use reqwest;
use sha256;

pub fn calc_checksum(path: &Path) -> io::Result<String> {
    let bytes = fs::read(path)?;
    let hash = sha256::digest(&bytes);
    Ok(hash)
}

/// Downloads a file. The file will be saved to the [`filename`] provided.
pub async fn download_file(url: &str, filename: &Path) -> io::Result<()> {
    if filename.exists() {
        println!("DEBUG: Not downloading. File already exists.");
        return Err(io::Error::from(AlreadyExists));
    }

    let mut file = File::create(filename)?;
    let response = reqwest::get(url)
        .await
        .expect("Failed to contact internet.");

    let content = response
        .bytes()
        .await
        .expect("Failed to get response content.");

    file.write_all(&content)?;
    Ok(())
}

/// Unzips DepotDownloader zips
pub fn unzip(zip_file: &Path) -> io::Result<()> {
    let file = File::open(zip_file)?;
    let mut archive = zip::ZipArchive::new(file)?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;

        let outpath = match file.enclosed_name() {
            Some(path) => path,
            None => continue
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

            // Set DepotDownloader executable.
            if outpath.display().to_string() == "DepotDownloader" {
                fs::set_permissions(&outpath, fs::Permissions::from_mode(0o755))?; // WTF is an octal?
            }
        }
    }
    Ok(())
}
