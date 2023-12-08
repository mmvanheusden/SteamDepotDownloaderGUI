#!/usr/bin/env bash
set -e
version=`jq '.version' package.json`
version="${version//\"}"
echo "version that will be build is ${version}"
rm -rf ./dist/

# Disable DevTools for release, because it's unreliable
original_line=$(sed -n '/if (!app.isPackaged) mainWindow.webContents.openDevTools({mode: "detach"})/p' main.js)
# original_line has 1 tab too much, so we remove it
original_line="${original_line//	/}"
sed -i 's/if (!app.isPackaged) mainWindow.webContents.openDevTools({mode: "detach"})/\/\/REMOVED FOR RELEASE./g' main.js


npm run build
mkdir -p ./dist/release-ready

cp ./dist/SteamDepotDownloaderGUI*.exe ./dist/release-ready/SteamDepotDownloaderGUI-windows-"${version}".exe
cp `ls -d1 dist/* | grep -E "SteamDepotDownloaderGUI-[0-9]+\.[0-9]+\.[0-9]+\.AppImage"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-x64.AppImage
cp `ls -d1 dist/* | grep -E "steamdepotdownloadergui-[0-9]+\.[0-9]+\.[0-9]+\.zip"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-x64.zip
cp `ls -d1 dist/* | grep -E "SteamDepotDownloaderGUI-[0-9]+\.[0-9]+\.[0-9]+\-arm64.AppImage"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-arm64.AppImage
cp `ls -d1 dist/* | grep -E "steamdepotdownloadergui-[0-9]+\.[0-9]+\.[0-9]+\-arm64.zip"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-arm64.zip
echo "done building!"
echo "reverting changes to main.js"
sed -i "s|\/\/REMOVED FOR RELEASE.|$original_line|g" main.js