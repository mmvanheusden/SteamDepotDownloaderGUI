<h1 align="center">SteamDepotDownloaderGUI
  
<h4 align="center">A graphical wrapper for DepotDownloader, designed to make downloading older versions of Steam games easy. built using <a href="https://www.electronjs.org" target="_blank">Electron</a>.
<br><br>
→<a href="https://www.youtube.com/watch?v=H2COwT5OUOo" target="_blank"><b>Tutorial</b></a> ~ 
<a href="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/tree/steamdeck-dotnet#steamdepotdownloadergui-for-steam-deck" target="_blank"><b>Steam Deck</b></a> ~ 
  <a href="https://depotdownloader.00pium.net/" target="_blank"><b>Website</b></a>  ~
<a href="https://www.youtube.com/watch?v=ogiDAuH3VdY" target="_blank"><b>Subnautica</b></a>←
</h4>



<p align="center"><a href="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest"><img src="https://img.shields.io/github/downloads/mmvanheusden/SteamDepotDownloaderGUI/total?color=orange&label=downloads" alt="Download count badge"></a><a href="https://img.shields.io/github/last-commit/mmvanheusden/SteamDepotDownloaderGUI?color=crimson"><img src="https://img.shields.io/github/last-commit/mmvanheusden/SteamDepotDownloaderGUI?color=crimson" alt="Last contribution badge"></a><a href="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest"><img src="https://img.shields.io/badge/Download -ffbd03?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABd0lEQVRoge2XwUrDQBCGPz3Ee++2UBSvdsGbeLHeFX0lPQhei+8g2AfwSVREK+LJ1oqHUGjRQ7Z0laRJNtldKPPBwoTM7D9/sks2IAiCsKrsAK/AC7DtSmTd1cTAKbAJtIAzVyIuDURGvOFKxKUBL4iB0IiB0IiB0IiB0IiB0IiB0IiB0IgBoA08Ak+AKpCvdO6AGn416zBwDGyRGLljuQmlc9pAEzipKl6HgVtgpOMGSYOdlLyOvtfQ1yPgpgb9WlDAEPjRYwj0jet+yv0iy80ru8AHiyazxiewF6jHXPJMeG3+CoiBy5J1/5dTlWVzAXwD5yXrAJho4YlFbdqesFnzsa6PLWr/PD0bFPAA3GO/YXN7WMspLpLnktweVvooMTPiKDPLHabmLCtpmYF3I96v3E55Doz4zWaCaxYb6Bno4udNRMCR1pzr92wmagFfZH+UfI0xycHPim5gE2Pg0Lb5OU2SVzgAph6anmqtHhWevCAIgh9+AdLMtu/CZhHJAAAAAElFTkSuQmCC" alt="Download latest release badge"></a><a href="https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2Fmmvanheusden%2Fsteamdepotdownloadergui.json&color=lightblue"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2Fmmvanheusden%2Fsteamdepotdownloadergui.json&color=lightblue" alt="Visitor count badge"></a><a href="https://my.fsf.org/donate"><img src="https://img.shields.io/badge/Donate-%23A42E2B?logo=gnu" alt="Donation badge"></a><a href="https://www.codefactor.io/repository/github/mmvanheusden/steamdepotdownloadergui/badge/master"></p>


<p align="center">
  <img alt="Screenshot of the downloader interface" src="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/assets/50550545/f6ca6558-d4a7-4417-a4c1-e9f5c9435450"  
     style="max-width: 40%;"/>
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

## Rewrite
Computer resources are not an all-you-can-eat buffet. The executables weigh on average 103 MB.  
That's why in the future, this project is fully switching to a different toolset. With a preference to something that uses Rust as its language.
A lighter, more low-level framework would be more suited than Electron.


## Download
> [!NOTE]  
> In the future, SteamDepotDownloaderGUI will use the newer, OS-specific builds of DepotDownloader, which no longer needs .NET to be installed before-hand.

.NET is a confusing system. If you are having trouble try uninstalling every .NET version on your computer, and then downloading the ones provided.

### Windows:
* If you haven't already, install **[.NET SDK 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)** on your computer.
  ![image](https://github.com/mmvanheusden/SteamDepotDownloaderGUI/assets/50550545/a3a73f24-21ec-433b-995a-4709b8b1fb91)

Then, download the [latest Windows build](https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/latest)

### **Linux:**
You'll need .NET SDK, and unzip. Also any of the following terminals (you most likely already have at least one of these):  
`gnome-terminal` / `konsole` / `xfce4-terminal` / `cool-retro-term`😎 / `terminator` /  
`terminology` / `xterm` / `kitty` / `lxterminal` / `tilix` / `deepin-terminal`

#### Arch Linux:
> [!WARNING]
> **I do not have control over the AUR package!!**
* There is an [AUR package](https://aur.archlinux.org/packages/steamdepotdownloadergui-bin) that someone made. this can be installed using `yay -S steamdepotdownloadergui-bin`.  

#### Other Linux distros:
**You'll need `unzip`, and .NET SDK 6.**

* **Debian-based Linux distributions:**  
  `sudo apt install unzip dotnet-sdk-6.0`
* **Fedora:**  
  `sudo dnf install unzip dotnet-sdk-6.0`

There are several options, AppImage, and a `.zip`, for both x64 and arm64.
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
I prefer not to receive any donations. If you want to make me happy open an issue and say thanks ;)  
Please donate to the [Free Software Foundation](https://my.fsf.org/donate) instead.


## Contribute
If you would like to contribute to SteamDepotDownloaderGUI, please make sure to follow
the [contributing instructions and guidelines](contributing.md).  
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.  
Please make sure to keep code clean and cross-platform compatible.



<p align="center">
  <img src="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/assets/50550545/b5649b7f-ea49-45c4-b0cd-5f3788dcd6ca" height="40px">
  <a href="https://00pium.net" target="_blank">
    <img src="https://github.com/mmvanheusden/SteamDepotDownloaderGUI/assets/50550545/83f5f3b2-2bf9-41aa-ab87-880466f785fe" height="40px">
  </a>
</p>
