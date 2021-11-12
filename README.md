<!--
<img src="https://socialify.git.ci/mmvanheusden/SteamDepotDownloaderGUI/image?description=1&font=Inter&forks=1&issues=1&language=1&owner=1&pattern=Floating%20Cogs&pulls=1&stargazers=1&theme=Light" alt="Banner" width="768"/>
-->


# SteamDepotDownloaderGUI

<p align="center">
  <img src="https://img.shields.io/badge/status-Beta-blue" />
  <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/mmvanheusden/SteamDepotDownloaderGUI/total?color=orange&label=downloads">
  <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/mmvanheusden/SteamDepotDownloaderGUI?color=seagreen&include_prereleases">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/mmvanheusden/SteamDepotDownloaderGUI?color=crimson">
  <a href="https://en.cryptobadges.io/donate/19sE9mHShbag5WiBwZ75nG21BSFZ1UnjpZ"><img src="https://en.cryptobadges.io/badge/small/19sE9mHShbag5WiBwZ75nG21BSFZ1UnjpZ"></a>
  <img alt="Visitor Count" src="https://visitor-badge.glitch.me/badge?page_id=mmvanheusden.SteamDepotDownloaderGUI">
</p>

A simple GUI tool build on top of [**DepotDownloader**][depotdownloader] for downloading older versions of Steam games.

![The Program](https://raw.githubusercontent.com/mmvanheusden/SteamDepotDownloaderGUI/master/src/readme.md/hero.png "The Program")

## What can you do with the program?
You can download older builds(aka manifests) of Steam games and software

## Want an example?
Take a look at [**This**][subnauticawiki] example.

## YouTube Tutorial
<a href="https://www.youtube.com/watch?v=X-tzW5ywCgU">
<img border="0" alt="YouTube Tutorial" src="/src/readme.md/youtube.png" width="768">
</a>

## How use the program?

### step 1:
Download [**.NET Core 5.0**][dotnet] It is required for the program to work properly.
### step 2:
Download and unzip the program. (Download it from the releases tab.)
### step 3:
Run DepotDownloaderGUI.exe.
### step 4:
Start by entering your Steam credentials at "Username" and "Password"
### step 5:
Click on "SteamDB Instant Search".
### step 6:
Search for your game/software of choice and click on it.
### step 7:
Copy the App ID and paste it in the program at "App ID"
### step 8:
Click on "Depots" in the sidebar.
### step 9:
Select the Windows depot (usually something with win64 in the name)
### step 10:
Copy the Depot ID and paste it in the program at "Depot ID"
### step 11:
Click on "Manifests" in the sidebar
### step 12:
Choose a Manifest(build) of choice and copy its ID and paste it in the program at "Manifest ID"
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
