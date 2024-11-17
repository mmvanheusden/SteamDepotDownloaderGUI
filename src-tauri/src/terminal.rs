use serde::Serialize;
use tauri_plugin_shell::process::Command;
use std::{env, fs};
use tauri::Wry;
use tauri_plugin_shell::Shell;
use crate::get_os;
use crate::steam::SteamDownload;

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
    Kitty,
    LXTerminal,
    Tilix,
    XTerm,
    CMD,
    Terminal
}


impl Terminal {
    /// Iterates through each terminal
    pub fn iter() -> impl Iterator<Item=Terminal> {
        use self::Terminal::*;

        vec![
            GNOMETerminal, Alacritty, Konsole, GNOMEConsole, Xfce4Terminal, DeepinTerminal, Terminator, Kitty, LXTerminal, Tilix, XTerm, CMD, Terminal
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
        if get_os() == "windows" || get_os() == "macos" {
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
            Terminal::XTerm => "XTerm",
            Terminal::Kitty => "Kitty",
            Terminal::LXTerminal => "LXTerminal",
            Terminal::Tilix => "Tilix",
            Terminal::DeepinTerminal => "Deepin Terminal",
            Terminal::Alacritty => "Alacritty",
            Terminal::CMD => "cmd",
            Terminal::Terminal => "Terminal"
        }
    }


    //region Probing a terminal
    /// Checks if a [`Terminal`] is installed.
    /// **See:** [`get_installed_terminals`]
    pub async fn installed(&self, shell: &Shell<Wry>) -> bool {
        match self {
            Terminal::CMD => get_os() == "windows",
            Terminal::GNOMETerminal => shell.command("gnome-terminal").arg("--version").status().await.is_ok(),
            Terminal::GNOMEConsole => shell.command("kgx").arg("--version").status().await.is_ok(),
            Terminal::Konsole => shell.command("konsole").arg("--version").status().await.is_ok(),
            Terminal::Xfce4Terminal => shell.command("xfce4-terminal").arg("--version").status().await.is_ok(),
            Terminal::Terminator => shell.command("terminator").arg("--version").status().await.is_ok(),
            Terminal::XTerm => shell.command("xterm").arg("-v").status().await.is_ok(),
            Terminal::Kitty => shell.command("kitty").arg("--version").status().await.is_ok(),
            Terminal::LXTerminal => shell.command("lxterminal").arg("--version").status().await.is_ok(),
            Terminal::Tilix => shell.command("tilix").arg("--version").status().await.is_ok(),
            Terminal::DeepinTerminal => shell.command("deepin-terminal").arg("--version").status().await.is_ok(),
            Terminal::Alacritty => shell.command("alacritty").arg("--version").status().await.is_ok(),
            Terminal::Terminal => get_os() == "macos",
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
    | XTerm            | `xterm -hold -T "Downloading depot..." -e /usr/bin/env sh -c  {command}` |
    | Kitty            | `kitty /usr/bin/env sh -c  {command}`                                    |
    | LXTerminal       | `lxterminal -e /usr/bin/env sh -c  {command}`                            |
    | Tilix            | `tilix -e /usr/bin/env sh -c  {command}`                                 |
    | DeepinTerminal   | `deepin-terminal -e /usr/bin/env sh -c  {command}`                       |
    | Alacritty        | `alacritty -e /usr/bin/env sh -c  {command}`                             |
    | Terminal (macOS) | We create a bash script and run that using `open`.                       |

     */
    pub fn create_command(&self, steam_download: &SteamDownload, shell: &Shell<Wry>) -> Command {
        let command = create_depotdownloader_command(steam_download);

        match self {
            Terminal::CMD => {
                    return shell.command("cmd.exe").args(&["/c", "start", "PowerShell.exe", "-NoExit", "-Command"]).args(command);

/*                let mut cmd = std::process::Command::new("cmd.exe");
                cmd.args(&["/c", "start", "PowerShell.exe", "-NoExit", "-Command"]).args(command);

                return cmd*/
            }
            Terminal::GNOMETerminal => {
                shell.command("gnome-terminal")
                    .args(&["--", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::GNOMEConsole => {
                shell.command("kgx")
                    .args(&["-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::Konsole => {
                shell.command("konsole")
                    .args(&["-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::Xfce4Terminal => {
                shell.command("xfce4-terminal")
                    .args(&["-x", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::Terminator => {
                shell.command("terminator")
                    .args(&["-T", "Downloading depot...", "-e"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::XTerm => {
                shell.command("xterm")
                    .args(&["-hold", "-T", "Downloading depot...", "-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::Kitty => {
                shell.command("kitty")
                    .args(&["/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::LXTerminal => {
                shell.command("lxterminal")
                    .args(&["-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::Tilix => {
                shell.command("tilix")
                    .args(&["-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::DeepinTerminal => {
                shell.command("deepin-terminal")
                    .args(&["-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }

            Terminal::Alacritty => {
                shell.command("alacritty")
                    .args(&["-e", "/usr/bin/env", "sh", "-c"])
                    .args(command)
                    .current_dir(env::current_dir().unwrap())
            }
            Terminal::Terminal => {
                // Create a bash script and run that. Not very secure but it makes this easier.
                let download_script = format!("#!/bin/bash\ncd {}\n{}",env::current_dir().unwrap().display(), command[0]);
                // println!("{}", download_script);

                fs::write("./script.sh", download_script).unwrap();

                #[cfg(unix)]
                {
                    use std::os::unix::fs::PermissionsExt;

                    fs::set_permissions("./script.sh", fs::Permissions::from_mode(0o755)).unwrap(); // Won't run without executable permission
                }

                shell.command("/usr/bin/open")
                    .args(&["-a", "Terminal", "./script.sh"])
                    .current_dir(env::current_dir().unwrap())

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
| XTerm          | `xterm -v`                    |
| Kitty          | `kitty --version`             |
| LXTerminal     | `lxterminal --version`        |
| Tilix          | `tilix --version`             |
| DeepinTerminal | `deepin-terminal --version`   |
| Alacritty      | `alacritty --version`         |

 */
pub async fn get_installed_terminals(return_immediately: bool, shell: &Shell<Wry>) -> Vec<Terminal> {
    match get_os() {
        "windows" => { return vec!(Terminal::CMD); }
        "macos" => { return vec!(Terminal::Terminal); }
        _ => {}
    }


    let mut available_terminals: Vec<Terminal> = Vec::new();

    for terminal in Terminal::iter() {
        // Probe terminal. If it doesn't raise an error, it is probably installed.
        if terminal.installed(shell).await {
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