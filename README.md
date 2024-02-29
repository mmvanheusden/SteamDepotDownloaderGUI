
<h1 align="center">SteamDepotDownloaderGUI

<h4 align="center">A graphical wrapper for DepotDownloader, designed to make downloading older versions of Steam games easy. built using <a href="https://www.electronjs.org" target="_blank">Electron</a>.
<br><br>
→<a href="https://www.youtube.com/watch?v=H2COwT5OUOo" target="_blank"><b>Tutorial</b></a> ~ 
<a href="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/tree/steamdeck-dotnet#steamdepotdownloadergui-for-steam-deck" target="_blank"><b>Steam Deck</b></a> ~ 
<a href="https://www.youtube.com/watch?v=ogiDAuH3VdY" target="_blank"><b>Subnautica</b></a>←
</h4>



<p align="center"><a href="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest"><img src="https://img.shields.io/github/downloads/mmvanheusden/SteamDepotDownloaderGUI/total?color=orange&label=downloads" alt="Download count badge"></a><a href="https://img.shields.io/github/last-commit/mmvanheusden/SteamDepotDownloaderGUI?color=crimson"><img src="https://img.shields.io/github/last-commit/mmvanheusden/SteamDepotDownloaderGUI?color=crimson" alt="Last contribution badge"></a><a href="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest"><img src="https://img.shields.io/badge/Download -ffbd03?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABd0lEQVRoge2XwUrDQBCGPz3Ee++2UBSvdsGbeLHeFX0lPQhei+8g2AfwSVREK+LJ1oqHUGjRQ7Z0laRJNtldKPPBwoTM7D9/sks2IAiCsKrsAK/AC7DtSmTd1cTAKbAJtIAzVyIuDURGvOFKxKUBL4iB0IiB0IiB0IiB0IiB0IiB0IiB0IgBoA08Ak+AKpCvdO6AGn416zBwDGyRGLljuQmlc9pAEzipKl6HgVtgpOMGSYOdlLyOvtfQ1yPgpgb9WlDAEPjRYwj0jet+yv0iy80ru8AHiyazxiewF6jHXPJMeG3+CoiBy5J1/5dTlWVzAXwD5yXrAJho4YlFbdqesFnzsa6PLWr/PD0bFPAA3GO/YXN7WMspLpLnktweVvooMTPiKDPLHabmLCtpmYF3I96v3E55Doz4zWaCaxYb6Bno4udNRMCR1pzr92wmagFfZH+UfI0xycHPim5gE2Pg0Lb5OU2SVzgAph6anmqtHhWevCAIgh9+AdLMtu/CZhHJAAAAAElFTkSuQmCC" alt="Download latest release badge"></a><a href="https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2Fmmvanheusden%2Fsteamdepotdownloadergui.json&color=lightblue"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2Fmmvanheusden%2Fsteamdepotdownloadergui.json&color=lightblue" alt="Visitor count badge"></a><a href="https://liberapay.com/barbapapa"><img src="https://img.shields.io/badge/Donate-black?logo=liberapay" alt="Donation badge"></a><a href="https://www.codefactor.io/repository/github/mmvanheusden/steamdepotdownloadergui/badge/master"><img src="https://www.codefactor.io/repository/github/mmvanheusden/steamdepotdownloadergui/badge/master" alt="CodeFactor badge"></a></p>


<p align="center">
  <img alt="Screenshot of the downloader interface" src="screenshot.png"  
     style="max-width: 60%;"/>
</p>

## Features

* **Cross platform**
  - Windows
  - <s>macOS</s> (in development™)
  - Linux
  - [Steam Deck](https://github.com/mmvanheusden/SteamDepotDownloaderGUI/tree/steamdeck-dotnet#steamdepotdownloadergui-for-steam-deck)
* **Cross terminal**
  - Gnome Terminal
  - Konsole
  - xfce4-terminal
  - Terminator
  - Terminology
  - xterm
  - Kitty
  - LXTerminal
  - Tilix
  - Deepin Terminal
  - cool-retro-term
  - Manual: produce a script that can be copy pasted into a terminal of choice
* **Support for anonymous downloads**

## Download

### Windows:
* If you haven't already, install [.NET SDK 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) on your computer.
  Then, download the [latest Windows build](https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest)
### **Linux:**
#### Arch Linux:
* There is an [AUR package](https://aur.archlinux.org/packages/steamdepotdownloadergui-bin) made. this can be installed using `yay -S steamdepotdownloadergui-bin`.
  **This is not maintained by me!!**
#### Other Linux distros:
* **You'll need `unzip`, .NET SDK 6.0.**
* **Ubuntu:**
  
  `sudo apt install unzip dotnet-sdk-6.0`
* **Fedora:**
  
  `sudo dnf install unzip dotnet-sdk-6.0`

  
* There are several options, AppImage, and a `.zip`, for both x64 and arm64.
  
  [Download latest release](https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest)


## How to use

#### Tutorials:
* https://www.youtube.com/watch?v=H2COwT5OUOo How to download older versions of Steam games. rollback steam games tutorial
* https://www.youtube.com/watch?v=ogiDAuH3VdY How to download older versions of Subnautica tutorial
---

**Enter everything you normally would in the DepotDownloader console and select your OS/terminal and click download**


## Credits

This software makes use of the following projects:
- [**DepotDownloader**](https://github.com/SteamRE/DepotDownloader/)
- [Electron](https://www.electronjs.org/)
- [Node.js](https://nodejs.org/)
- [Primer CSS](https://primer.style/css/)
- [follow-redirects](https://github.com/follow-redirects/follow-redirects)
- [Hubut Sans](https://github.com/github/hubot-sans) under [license](https://github.com/github/hubot-sans/blob/05d5ea150c20e6434485db8ffd2277ed18a9e911/LICENSE) 


## Donate

Donations can be made through Liberapay :)

<a href="https://liberapay.com/barbapapa">
    <img src="https://img.shields.io/badge/Donate-black?logo=liberapay&style=for-the-badge"
    alt="Donation badge">
</a>

## On Electron
Computer resources are not an all-you-can-eat buffet. The executables weigh on average 103 MB.  
That's why in the future, this project is fully switching to a [different](https://tauri.app/) (multi-platform) toolset. Nothing will change for the user.

## Contribute

If you would like to contribute to SteamDepotDownloaderGUI, please make sure to follow
the [contributing instructions and guidelines](contributing.md).

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to keep code clean and cross-platform compatible.

![forthebadge](https://forthebadge.com/images/featured/featured-built-with-love.svg)
