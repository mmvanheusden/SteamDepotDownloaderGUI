// Uses a prebuild binary of https://github.com/SteamRE/DepotDownloader
// License can be found at https://github.com/SteamRE/DepotDownloader/blob/master/LICENSE
const {ipcRenderer, shell} = require("electron")
const {
	preDownloadCheck, download, createCommand, runCommand, removeDir, removeFile, unzip, forceTerminals
} = require("./utils")

// Initializes the variable that holds the path to the specified download location
let exportedFile
let ready = true


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
		if (document.getElementById("osdropdown").selectedIndex !== 3) await console.debug("Command issued: " + createCommand())
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
	case "instructions":
		console.debug("Opened instructions page")
		void electron.shell.openExternal("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/#how-to-use")
		break
	default:
		return
	}
	/* eslint-enable indent */
}

// Opens the chosen location where the game will be downloaded to
function checkPath() {
	disableForm(false)
	shell.openPath(exportedFile).then(() => {
		console.log("Opened " + exportedFile + " in file explorer.")
	})
}

// If Linux is selected in the dropdown menu, enable the second dropdown so the user can choose their terminal emulator.
function checkSelection() {
	/*
	[0] - Windows
	[1] - macOS
	[2] - Linux
	[3] - manual
	 */
	let os_dropdown = document.getElementById("osdropdown")
	let terminal_dropdown = document.getElementById("osdropdown2")
	// if the choice = 2, enable the terminal selection dropdown.
	if (os_dropdown.selectedIndex === 2) {
		terminal_dropdown.disabled = false
		document.getElementById("osdropdown2label").classList.add("required")
	} else {
		terminal_dropdown.disabled = true
		terminal_dropdown.selectedIndex = 11
		document.getElementById("osdropdown2label").classList.remove("required")
	}
}


function disableForm(disable) {
	document.getElementById("username").disabled = disable
	document.getElementById("theform").disabled = disable
	document.getElementById("password").disabled = disable
	document.getElementById("appid").disabled = disable
	document.getElementById("depotid").disabled = disable
	document.getElementById("manifestid").disabled = disable
	document.getElementById("osdropdown").disabled = disable
	document.getElementById("osdropdown2").disabled = disable
	document.getElementById("pickpath").ariaDisabled = disable
	document.getElementById("pickpath").disabled = disable
	document.getElementById("downloadbtn").ariaDisabled = disable
	document.getElementById("downloadbtn").disabled = disable
	document.getElementById("downloadbtn").classList.replace(((disable) ? "btn-primary" : "btn-disabled"), ((!disable) ? "btn-primary" : "btn-disabled"))

}

// main.js sends a ready message if the page is loaded in. This will be received here.
ipcRenderer.on("ready", async () => {
	if (ready) { // because for some reason this event is triggered twice, make sure it only happens once
		document.getElementById("loader").hidden = false
		await disableForm(true)
		await checkSelection() // force check the selection so the terminal dropdown can be unhidden.
		await (async () => {
			let r = await fetch("https://api.github.com/zen")
			console.debug(await r.text())
		})()
		// process.platform -> 'linux' -> selectedIndex = 2 (Linux)
		// process.platform -> 'win32' -> selectedIndex = 0 (Windows)
		// process.platform -> 'darwin' -> selectedIndex = 1 (macOS)
		const osdropdown = document.getElementById("osdropdown")
		if (process.platform.toString().includes("linux")) {
			osdropdown.selectedIndex = 2
		} else if (process.platform.toString().includes("win")) {
			osdropdown.selectedIndex = 0
		} else if (process.platform.toString().includes("darwin")) {
			osdropdown.selectedIndex = 1
		}
		let terminal_dropdown = document.getElementById("osdropdown2")
		const cmds = await forceTerminals()
		if (cmds.length < 0) {
			console.log("empty")
		} else {
			console.log("not empty" + cmds)
			terminal_dropdown.selectedIndex = cmds[1]
		}
		await disableForm(false)
		document.getElementById("loader").hidden = true
	}
	ready = false
})

// Add event listeners to the buttons
window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("dotnetalertbtn").addEventListener("click", () => openRelevantPage("dotnet"))
	document.getElementById("smbtn1").addEventListener("click", () => openRelevantPage("issues"))
	document.getElementById("smbtn2").addEventListener("click", () => openRelevantPage("steamdb"))
	document.getElementById("smbtn3").addEventListener("click", () => openRelevantPage("donate"))
	document.getElementById("smbtn4").addEventListener("click", () => openRelevantPage("instructions"))
	document.getElementById("pickpath").addEventListener("click", () => {
		if (document.getElementById("pickpath").disabled === false) ipcRenderer.send("selectpath")
	})
	document.getElementById("checkpath").addEventListener("click", checkPath)
	document.getElementById("osdropdown").addEventListener("input", checkSelection)
	document.getElementById("downloadbtn").addEventListener("click", () => {
		if (document.getElementById("downloadbtn").disabled === false) submitForm()
	})
})

ipcRenderer.on("file", (event, file) => {
	console.log("path selected by user: " + file)
	document.getElementById("checkpath").ariaDisabled = false // Makes the check button active
	exportedFile = file.toString()
})