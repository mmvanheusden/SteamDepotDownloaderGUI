// Uses a prebuild binary of https://github.com/SteamRE/DepotDownloader
// License can be found at https://github.com/SteamRE/DepotDownloader/blob/master/LICENSE
const { ipcRenderer, shell} = require("electron")
const {
	preDownloadCheck,
	download,
	createCommand,
	runCommand,
	removeDir,
	removeFile,
	unzip
} = require("./utils")

// Initializes the variable that holds the path to the specified download location
let exportedFile

function submitForm() {
	// Check if the form is filled in and if dotnet is installed
	preDownloadCheck().then(async function () {
		document.getElementById("dotnetwarning").hidden = true
		document.getElementById("emptywarning").hidden = true
		console.info("dotnet found in PATH")

		// Remove the old depotdownloader directory if there are any
		await removeDir("depotdownloader")

		// Download a prebuild DepotDownloader binary, so it doesn't have to be included in the source code
		await download("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.5.0/depotdownloader-2.5.0.zip")

		// Unzip the DepotDownloader binary
		await unzip("depotdownloader-2.5.0.zip", "depotdownloader")

		// Clean up the old files
		await removeFile("depotdownloader-2.5.0.zip")

		// Run the final command
		await runCommand(createCommand())
	}).catch(function (error) {
		if (error === "noDotnet") {
			console.error("Dotnet not found in PATH")
			document.getElementById("emptywarning").hidden = true
			document.getElementById("dotnetwarning").hidden = false
		} else if (error === "emptyField") {
			console.error("Fill in all required fields")
			document.getElementById("dotnetwarning").hidden = true
			document.getElementById("emptywarning").hidden = false
		}
	})
}

// Combines all buttons that are supposed to open an external URL into one big function.
function openRelevantPage(target) {
	const electron = require("electron")
	const os = process.platform.toString()
	switch (target) {
	// why are you not indenting nicely eslint?
	/* eslint-disable indent */
		case "dotnet":
			document.getElementById("dotnetwarning").hidden = true
			if (os.includes("win")) {
				console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
				void electron.shell.openExternal("https://aka.ms/dotnet/6.0/dotnet-sdk-win-x64.exe")
			}
			if (os.includes("linux")) {
				const electron = require("electron")
				console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
				void electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
			}
			if (os.includes("darwin")) {
				console.debug("Opened .NET download page for" + os)
				//TODO: Apple Silicon(ARM64) URL
				void electron.shell.openExternal("https://aka.ms/dotnet/6.0/dotnet-sdk-osx-x64.pkg")
			}
			break
		case "issues":
			console.debug("Opened GitHub issues page")
			void electron.shell.openExternal("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/issues/new")
			break
		case "steamdb":
			console.debug("Opened SteamDB instant search page")
			void electron.shell.openExternal("https://steamdb.info/instantsearch/")
			break
		case "donate":
			console.debug("Opened donation page")
			void electron.shell.openExternal("https://liberapay.com/barbapapa/")
			break
		default:
			return
	}
	/* eslint-enable indent */
}

// Opens the chosen location where the game will be downloaded to
function checkPath() {
	shell.openPath(exportedFile)
}

// If Linux is selected in the dropdown menu, enable the second dropdown so the user can choose their terminal emulator.
function checkSelection() {
	/*
	[0] - Windows
	[1] - macOS
	[2] - Linux
	[3] - manual
	 */
	let docu = document.getElementById("osdropdown")
	let docu2 = document.getElementById("osdropdown2")
	// if the choice = 2, enable the terminal selection dropdown.
	docu2.disabled = docu.selectedIndex !== 2; docu2.selectedIndex = 0
}

// This changes the dropdown selection, based on the platform being used.
ipcRenderer.on("update-value", (e, msg) => {
	const osdropdown = document.getElementById("osdropdown")
	if (msg === "linux") {
		osdropdown.selectedIndex = 2
	} else if (msg === "win") {
		osdropdown.selectedIndex = 0
	} else if (msg === "darwin") {
		osdropdown.selectedIndex = 1
	}
	checkSelection() // force check the selection so the terminal dropdown can be unhidden.
})

// Add event listeners to the buttons
window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("dotnetalertbtn").addEventListener("click", () => openRelevantPage("dotnet"))
	document.getElementById("smbtn1").addEventListener("click", () => openRelevantPage("issues"))
	document.getElementById("smbtn2").addEventListener("click", () => openRelevantPage("steamdb"))
	document.getElementById("smbtn3").addEventListener("click", () => openRelevantPage("donate"))
	document.getElementById("pickpath").addEventListener("click", () => ipcRenderer.send("selectpath"))
	document.getElementById("checkpath").addEventListener("click", checkPath)
	document.getElementById("osdropdown").addEventListener("input", checkSelection)
	document.getElementById("downloadbtn").addEventListener("click", submitForm)
})

ipcRenderer.on("file", (event, file) => {
	console.log("obtained file from main process: " + file)
	document.getElementById("checkpath").ariaDisabled = false // Makes the check button active
	exportedFile = file.toString()
})