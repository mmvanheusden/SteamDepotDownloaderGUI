#!/usr/bin/env bash
version=`jq '.version' package.json`
version="${version//\"}"
echo "version = ${version}"
mkdir -p ./dist/release-ready
cp ./dist/SteamDepotDownloaderGUI*.exe ./dist/release-ready/SteamDepotDownloaderGUI-windows-"${version}".exe
cp `ls -d1 dist/* | grep -E "SteamDepotDownloaderGUI-[0-9]+\.[0-9]+\.[0-9]+\.AppImage"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-x64.AppImage
cp `ls -d1 dist/* | grep -E "steamdepotdownloadergui-[0-9]+\.[0-9]+\.[0-9]+\.zip"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-x64.zip
cp `ls -d1 dist/* | grep -E "SteamDepotDownloaderGUI-[0-9]+\.[0-9]+\.[0-9]+\-arm64.AppImage"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-arm64.AppImage
cp `ls -d1 dist/* | grep -E "steamdepotdownloadergui-[0-9]+\.[0-9]+\.[0-9]+\-arm64.zip"` ./dist/release-ready/SteamDepotDownloaderGUI-linux-"${version}"-arm64.zip
echo "done!"