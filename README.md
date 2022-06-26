# SteamDepotDownloaderGUI
### **A rewrite in JavaScript is currently work-in-progress🤞**
<p align="center">
  <img src="https://img.shields.io/badge/status-being_rewritten-blue" />
  <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/mmvanheusden/SteamDepotDownloaderGUI/total?color=orange&label=downloads">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/mmvanheusden/SteamDepotDownloaderGUI?color=crimson">
  <img alt="Visitor Count" src="https://visitor-badge.glitch.me/badge?page_id=mmvanheusden.SteamDepotDownloaderGUI">
</p>

A simple GUI tool build on top of [**DepotDownloader**][depotdownloader] for downloading older versions of Steam games.

![The GUI](https://raw.githubusercontent.com/mmvanheusden/SteamDepotDownloaderGUI/master/src/readme.md/hero.png "The GUI")

## What can you do with the software?
You can download older builds(aka manifests) of Steam games and software

## Want an example?
Take a look at [**This**][subnauticawiki] example.

## YouTube Tutorial

> ⚠️ **This might be outdated**

<a href="https://www.youtube.com/watch?v=X-tzW5ywCgU">
<img border="0" alt="YouTube Tutorial" src="/src/readme.md/youtube.png" width="768">
</a>

## How use the software?

### step 1:
Download [**.NET Core 5.0**][dotnet] It is required for the software to work properly.
### step 2:
Download and unzip the software. (Download it from the releases tab.)
### step 3:
Run DepotDownloaderGUI.exe.
### step 4:
Start by entering your Steam credentials at "Username" and "Password"
### step 5:
Click on "SteamDB Instant Search".
### step 6:
Search for your game/software of choice and click on it.
### step 7:
Copy the App ID and paste it in the software at "App ID"
### step 8:
Click on "Depots" in the sidebar.
### step 9:
Select the Windows depot (usually something with win64 in the name)
### step 10:
Copy the Depot ID and paste it in the software at "Depot ID"
### step 11:
Click on "Manifests" in the sidebar
### step 12:
Choose a Manifest(build) of choice and copy its ID and paste it in the software at "Manifest ID"
### step 13:
If you want a faster download speed, ramp the max servers and max chunks up to some crazy amount!
### step 14:
Click on "Start Download", choose the location and a terminal window will pop up showing the download progress.
### step 15:
Once the download is done, close the terminal and the downloader.
The downloaded game is stored in the specified location
### Enjoy!

## Need help?
Open an issue.


[steamdb]: https://steamdb.info
[depotdownloader]: https://github.com/SteamRE/DepotDownloader
[subnauticawiki]: https://github.com/mmvanheusden/SteamDepotDownloaderGUI/wiki/How-to-Download-older-versions-of-Subnautica
[dotnet]: https://dotnet.microsoft.com/download/dotnet/thank-you/sdk-5.0.402-windows-x64-installer
