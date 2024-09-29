use crate::steam::SteamDownload;
use async_process::Command;
use serde::Serialize;
use std::{env, fs};
use std::fs::File;
use std::os::unix::fs::PermissionsExt;
use crate::get_os;

/// Represents a terminal that can be used to run commands.
/// **Should be in sync with the terminal dropdown in the frontend.**
#[derive(Debug, Serialize, PartialEq)]
pub enum Terminal {
    GNOMETerminal,
    Alacritty,
    Konsole,
    GNOMEConsole,
    Xfce4Terminal,
    DeepinTerminal,
    Terminator,
    Terminology,
    Kitty,
    LXTerminal,
    Tilix,
    CoolRetroTerm,
    XTerm,
    CMD,
    Terminal
}


impl Terminal {
    /// Iterates through each terminal
    pub fn iter() -> impl Iterator<Item=Terminal> {
        use self::Terminal::*;

        vec![
            GNOMETerminal, Alacritty, Konsole, GNOMEConsole, Xfce4Terminal, DeepinTerminal, Terminator, Terminology, Kitty, LXTerminal, Tilix, CoolRetroTerm, XTerm, CMD, Terminal
        ].into_iter()
    }

    /// Get terminal from index in order of the [`Terminal`] enum
    pub fn from_index(index: &u8) -> Option<Terminal> {
        Terminal::iter().nth(*index as usize)
    }

    /// Get the index of a terminal in the order of the [`Terminal`] enum
    /// Returns `None` if the terminal is not found.
    pub fn index(&self) -> Option<u8> {
        Terminal::iter().position(|x| x == *self).map(|x| x as u8)
    }


    /// Get total number of terminals **possible** depending on the OS
    pub fn total() -> u8 {
        if get_os() != "windows" || get_os() == "macos" {
            return 1;
        }

        Terminal::iter().count() as u8 - 1 // -1 because cmd is not available on linux
    }

    /// Get the pretty name of a terminal
    pub fn pretty_name(&self) -> &str {
        match self {
            Terminal::GNOMETerminal => "GNOME Terminal",
            Terminal::GNOMEConsole => "GNOME Console",
            Terminal::Konsole => "Konsole",
            Terminal::Xfce4Terminal => "Xfce Terminal",
            Terminal::Terminator => "Terminator",
            Terminal::Terminology => "Terminology",
            Terminal::XTerm => "XTerm",
            Terminal::Kitty => "Kitty",
            Terminal::LXTerminal => "LXTerminal",
            Terminal::Tilix => "Tilix",
            Terminal::DeepinTerminal => "Deepin Terminal",
            Terminal::CoolRetroTerm => "cool-retro-term",
            Terminal::Alacritty => "Alacritty",
            Terminal::CMD => "cmd",
            Terminal::Terminal => "Terminal"
        }
    }


    //region Probing a terminal
    /// Checks if a [`Terminal`] is installed.
    /// **See:** [`get_installed_terminals`]
    pub async fn installed(&self) -> bool {
        match self {
            Terminal::CMD => { get_os() == "windows" }
            Terminal::GNOMETerminal => {
                let mut cmd = Command::new("gnome-terminal");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::GNOMEConsole => {
                let mut cmd = Command::new("kgx");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Konsole => {
                let mut cmd = Command::new("konsole");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Xfce4Terminal => {
                let mut cmd = Command::new("xfce4-terminal");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Terminator => {
                let mut cmd = Command::new("terminator");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Terminology => {
                let mut cmd = Command::new("terminology");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::XTerm => {
                let mut cmd = Command::new("xterm");
                cmd.arg("-v").output().await.is_ok()
            }
            Terminal::Kitty => {
                let mut cmd = Command::new("kitty");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::LXTerminal => {
                let mut cmd = Command::new("lxterminal");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Tilix => {
                let mut cmd = Command::new("tilix");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::DeepinTerminal => {
                let mut cmd = Command::new("deepin-terminal");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::CoolRetroTerm => {
                let mut cmd = Command::new("cool-retro-term");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Alacritty => {
                let mut cmd = Command::new("alacritty");
                cmd.arg("--version").output().await.is_ok()
            }
            Terminal::Terminal => { get_os() == "macos" }
        }
    }
    //endregion


    //region Running a command in the terminal
    /**
    Returns a [`Command`] that, when executed should open the terminal and run the command.


    ## Commands
    `{command}` = `{command};echo Command finished with code $?;sleep infinity`

    | Terminal         | Command to open terminal                                                 |
    |------------------|--------------------------------------------------------------------------|
    | cmd              | `start cmd.exe /k  {command}`                                            |
    | GNOMETerminal    | `gnome-terminal -- /usr/bin/env sh -c  {command}`                        |
    | GNOMEConsole     | `kgx -e /usr/bin/env sh -c  {command}`                                   |
    | Konsole          | `konsole -e /usr/bin/env sh -c  {command}`                               |
    | Xfce4Terminal    | `xfce4-terminal -x /usr/bin/env sh -c  {command}`                        |
    | Terminator       | `terminator -T "Downloading depot..." -e  {command}`                     |
    | Terminology      | `terminology -e /usr/bin/env sh -c  {command}`                           |
    | XTerm            | `xterm -hold -T "Downloading depot..." -e /usr/bin/env sh -c  {command}` |
    | Kitty            | `kitty /usr/bin/env sh -c  {command}`                                    |
    | LXTerminal       | `lxterminal -e /usr/bin/env sh -c  {command}`                            |
    | Tilix            | `tilix -e /usr/bin/env sh -c  {command}`                                 |
    | DeepinTerminal   | `deepin-terminal -e /usr/bin/env sh -c  {command}`                       |
    | CoolRetroTerm    | `cool-retro-term -e /usr/bin/env sh -c  {command}`                       |
    | Alacritty        | `alacritty -e /usr/bin/env sh -c  {command}`                             |
    | Terminal (macOS) | We create a bash script and run that using `open`.                       |

     */
    pub fn create_command(&self, steam_download: &SteamDownload) -> Command {
        let command = create_depotdownloader_command(steam_download);

        match self {
            Terminal::CMD => {
                let mut cmd = Command::new("cmd.exe");
                cmd.args(&["/c", "start", "PowerShell.exe", "-NoExit", "-Command"]).args(command);
                cmd
            }
            Terminal::GNOMETerminal => {
                let mut cmd = Command::new("gnome-terminal");
                cmd.args([
                    "--",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::GNOMEConsole => {
                let mut cmd = Command::new("kgx");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c"
                ]).args(command);
                cmd
            }
            Terminal::Konsole => {
                let mut cmd = Command::new("konsole");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::Xfce4Terminal => {
                let mut cmd = Command::new("xfce4-terminal");
                cmd.args([
                    "-x",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::Terminator => {
                let mut cmd = Command::new("terminator");
                cmd.args([
                    "-T",
                    "Downloading depot...",
                    "-e",
                ]).args(command);
                cmd
            }
            Terminal::Terminology => {
                let mut cmd = Command::new("terminology");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::XTerm => {
                let mut cmd = Command::new("xterm");
                cmd.args([
                    "-hold",
                    "-T",
                    "Downloading depot...",
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::Kitty => {
                let mut cmd = Command::new("kitty");
                cmd.args([
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::LXTerminal => {
                let mut cmd = Command::new("lxterminal");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::Tilix => {
                let mut cmd = Command::new("tilix");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::DeepinTerminal => {
                let mut cmd = Command::new("deepin-terminal");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::CoolRetroTerm => {
                let mut cmd = Command::new("cool-retro-term");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::Alacritty => {
                let mut cmd = Command::new("alacritty");
                cmd.args([
                    "-e",
                    "/usr/bin/env",
                    "sh",
                    "-c",
                ]).args(command);
                cmd
            }
            Terminal::Terminal => {
                // Create a bash script and run that. Not very secure but it makes this easier.
                let download_script = format!("#!/bin/bash\ncd {}\n{}",env::current_dir().unwrap().display(), command[0]);
                // println!("{}", download_script);

                fs::write("./script.sh", download_script).unwrap();
                fs::set_permissions("./script.sh", fs::Permissions::from_mode(0o755)).unwrap(); // Won't run without executable permission

                let mut cmd = Command::new("/usr/bin/open");
                cmd.args(&["-a", "Terminal", "./script.sh"]);
                cmd
            }
        }
    }
    //endregion
}

/**
Checks if terminals are installed by checking if they respond to commands.

## How it works
Probes a list of popular terminals and checks if they return an error when calling their `--version` or similar command line flag.

## Options
* `return_immediately`: [`bool`]: Return as soon as one terminal is found.

## Returns
A vector containing a list of terminals that should work.

## Commands
| Terminal       | Command to check if installed |
|----------------|-------------------------------|
| cmd            | `cmd /?`                      |
| GNOMETerminal  | `gnome-terminal --version`    |
| GNOMEConsole   | `kgx --version`               |
| Konsole        | `konsole --version`           |
| Xfce4Terminal  | `xfce4-terminal --version`    |
| Terminator     | `terminator --version`        |
| Terminology    | `terminology --version`       |
| XTerm          | `xterm -v`                    |
| Kitty          | `kitty --version`             |
| LXTerminal     | `lxterminal --version`        |
| Tilix          | `tilix --version`             |
| DeepinTerminal | `deepin-terminal --version`   |
| CoolRetroTerm  | `cool-retro-term --version`   |
| Alacritty      | `alacritty --version`         |

 */
pub async fn get_installed_terminals(return_immediately: bool) -> Vec<Terminal> {
    match get_os() {
        "windows" => { return vec!(Terminal::CMD); }
        "macos" => { return vec!(Terminal::Terminal); }
        _ => {}
    }


    let mut available_terminals: Vec<Terminal> = Vec::new();

    for terminal in Terminal::iter() {
        // Probe terminal. If it doesn't raise an error, it is probably installed.
        if terminal.installed().await {
            if return_immediately {
                return vec![terminal];
            }
            available_terminals.push(terminal);
        }
    }

    if available_terminals.is_empty() {
        eprintln!("No terminals were detected. Try installing one.");
    }

    available_terminals
}

/// Creates the DepotDownloader command necessary to download the requested manifest.
fn create_depotdownloader_command(steam_download: &SteamDownload) -> Vec<String> {
    let output_dir = if get_os() == "windows" {
        // In PowerShell, spaces can be escaped with a backtick.
        steam_download.output_path().replace(" ", "` ")
    } else {
        // In bash, spaces can be escaped with a backslash.
        steam_download.output_path().replace(" ", "\\ ")
    };


    if cfg!(not(windows)) {
        if steam_download.is_anonymous() {
            vec![format!(r#"./DepotDownloader -app {} -depot {} -manifest {} -dir {};echo Done!;sleep infinity"#, steam_download.app_id(), steam_download.depot_id(), steam_download.manifest_id(), output_dir)]
        } else {
            vec![format!(r#"./DepotDownloader -username {} -password {} -app {} -depot {} -manifest {} -dir {};echo Done!;sleep infinity"#, steam_download.username().clone().unwrap(), steam_download.password().clone().unwrap(), steam_download.app_id(), steam_download.depot_id(), steam_download.manifest_id(), output_dir)]
        }
    } else {
        if steam_download.is_anonymous() {
            vec![format!(r#".\DepotDownloader.exe -app {} -depot {} -manifest {} -dir {}"#, steam_download.app_id(), steam_download.depot_id(), steam_download.manifest_id(), output_dir)]
        } else {
            vec![format!(r#".\DepotDownloader.exe -username {} -password {} -app {} -depot {} -manifest {} -dir {}"#, steam_download.username().clone().unwrap(), steam_download.password().clone().unwrap(), steam_download.app_id(), steam_download.depot_id(), steam_download.manifest_id(), output_dir)]
        }
    }
}