// Uses a prebuild binary of https://github.com/SteamRE/DepotDownloader
// License can be found at https://github.com/SteamRE/DepotDownloader/blob/master/LICENSE
const {ipcRenderer, shell} = require("electron")
const {
	preDownloadCheck, download, createCommand, runCommand, removeDir, removeFile, unzip, forceTerminals
} = require("./utils")

// Initializes the variable that holds the path to the specified download location
let exportedFile
let ready = true
let os

const DOTNET_DOWNLOAD_URL = "https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.5.0/depotdownloader-2.5.0.zip" // the url to the depotdownloader zip
const DOTNET_DIR = "depotdownloader" // folder where zip is extracted
const DOTNET_ZIP_FILE = DOTNET_DOWNLOAD_URL.split("/").pop() // the file that is being downloaded.

function submitForm() {
	///console.log(terminal[1][0])
	// Check if the form is filled in and if dotnet is installed
	preDownloadCheck().then(async function () {
		//console.log(terminal[1][0])
		document.getElementById("dotnetwarning").hidden = true
		document.getElementById("emptywarning").hidden = true
		console.info("dotnet found in PATH")

		// Remove the old depotdownloader directory if there are any
		await removeDir("depotdownloader")

		// Download a prebuild DepotDownloader binary, so it doesn't have to be included in the source code
		await download(DOTNET_DOWNLOAD_URL)
		console.log("downld")

		// Unzip the DepotDownloader binary
		await unzip(DOTNET_ZIP_FILE, DOTNET_DIR)
		console.log("unzip")

		// Clean up the old files
		await removeFile(DOTNET_ZIP_FILE)
		console.log("removeFile")

		// Run the final command

		let terminal
		if (document.getElementById("terminal-dropdown").selectedIndex !== 11) {
			terminal = document.getElementById("terminal-dropdown").selectedIndex
		} else terminal = "default"
		if (document.getElementById("os-dropdown").selectedIndex !== 4) {
			os = document.getElementById("os-dropdown").selectedIndex
		} else os = "default"
		if (document.getElementById("os-dropdown").selectedIndex !== 3) await console.debug("Command issued: " + createCommand(terminal,os))

		await runCommand(createCommand(terminal,os))

		console.log("runCommand")
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
/* eslint-disable indent */
		// why are you not indenting nicely eslint?
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
	toggleFormAccessibility(false)
	shell.openPath(exportedFile).then(() => {
		console.log("Opened " + exportedFile + " in file explorer.")
	})
}

/**
 * Automatically fills The OS dropdown with the OS detected.
 * Runs when the app is fully loaded
 */
function fillDefaultValues() {
	// [0]: Windows, [1]: macOS [2]: Linux [3]: manual
	//const os_dropdown = document.getElementById("os-dropdown")
	if (process.platform.toString().includes("linux")) {
		//os_dropdown.selectedIndex = 2
		document.getElementById("default-os").innerText = "Linux"
	} else if (process.platform.toString().includes("win")) {
		//os_dropdown.selectedIndex = 0
		document.getElementById("default-os").innerText = "Windows"
	} else if (process.platform.toString().includes("darwin")) {
		//os_dropdown.selectedIndex = 1
		document.getElementById("default-os").innerText = "macOS"
	}
}


/**
 * Checks if the selected index = 2 (Linux), and based on that enables or disables the terminal dropdown.
 * Runs when the app is fully loaded,
 * and when the user changes the OS dropdown selection.
 */
function validateChoice() {
	// [0]: Windows, [1]: macOS [2]: Linux [3]: manual
	const os_dropdown = document.getElementById("os-dropdown")
	const terminal_dropdown = document.getElementById("terminal-dropdown")
	// if the choice = 2, enable the terminal selection dropdown.
	if (os_dropdown.selectedIndex === (2 || 3)) {
		terminal_dropdown.disabled = false
	} else {
		terminal_dropdown.disabled = true
		terminal_dropdown.selectedIndex = 11
	}
	if (os_dropdown.selectedIndex === 4) if (process.platform.includes("linux")) terminal_dropdown.disabled = false
}

/**
 * Enable or disable the form.
 * @param disable Enable or disable the form.
 *
 * * true => disable everything
 *
 * * false => enable everything
 */
function toggleFormAccessibility(disable) {
	document.getElementById("username").disabled = disable
	document.getElementById("theform").disabled = disable
	document.getElementById("password").disabled = disable
	document.getElementById("appid").disabled = disable
	document.getElementById("depotid").disabled = disable
	document.getElementById("manifestid").disabled = disable
	document.getElementById("os-dropdown").disabled = disable

	// if the OS dropdown value was 2 (Linux), don't disable the Terminal dropdown.
	document.getElementById("terminal-dropdown").disabled = (((document.getElementById("os-dropdown").selectedIndex !== 2)))

	document.getElementById("pickpath").ariaDisabled = disable
	document.getElementById("pickpath").disabled = disable
	document.getElementById("downloadbtn").ariaDisabled = disable
	document.getElementById("downloadbtn").disabled = disable
	document.getElementById("downloadbtn").classList.replace(((disable) ? "btn-primary" : "btn-disabled"), ((!disable) ? "btn-primary" : "btn-disabled"))
}


function setTheme(theme) {
	document.getElementById("theme-auto").ariaSelected = (theme === "auto").toString()
	document.getElementById("theme-light").ariaSelected = (theme === "light").toString()
	document.getElementById("theme-dark").ariaSelected = (theme === "dark").toString()
}

// main.js sends a ready message if the page is loaded in. This will be received here.
ipcRenderer.on("ready", async () => {

	if (!ready) return

	//let terminal_dropdown = document.getElementById("terminal-dropdown")
	await toggleFormAccessibility(true) // disables the form, while loading
	document.getElementById("loader").hidden = false


	let r = await fetch("https://api.github.com/zen")
	console.debug(await r.text())

	await fillDefaultValues() // Set the default values based on OS

	const terminals = await forceTerminals()
	/* forceTerminals() returns two values:
	[1,2]
	1: true/false. if true, there are terminals found. if false none are, or not on linux
	2: a list of available terminals with their associated number in the terminal dropdown index.
	 */
	if (terminals[0]) {
		console.log(`${terminals[1].length} terminals found in PATH.`)
		document.getElementById("terminals-found").innerText = terminals[1].length.toString()
		document.getElementById("default-terminal").innerText = terminals[2][0]
		//terminal_dropdown.selectedIndex = terminals[1][0] // set the terminal dropdown to the first available terminal found.
		console.log(terminals[1][0])

	} else {
		console.log("No terminals found in PATH. Continuing with default values") // when no terminals are found on the system, or when linux is not used.
	}

	await toggleFormAccessibility(false) //enable the form again

	await validateChoice() // updates the 'enabled/disabled' html value of the terminal dropdown.
	document.getElementById("loader").hidden = true
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
	document.getElementById("checkpath").addEventListener("click", () => {
		if (document.getElementById("checkpath").disabled === false) checkPath()
	})
	document.getElementById("os-dropdown").addEventListener("input", validateChoice)
	document.getElementById("downloadbtn").addEventListener("click", () => {
		if (document.getElementById("downloadbtn").disabled === false) submitForm()
	})
	document.getElementById("settings-button").addEventListener("click", () => {
		console.log("Settings button clicked")

		// show the modal. This is done by setting the display to block.
		document.getElementById("settings-surrounding").style.display = "block"
	})
	document.getElementById("settings-surrounding").addEventListener("click", (event) => {
		if (event.target === document.getElementById("settings-surrounding")) {
			document.getElementById("settings-surrounding").style.display = "none"
		}
	})
	document.getElementById("theme-auto").addEventListener("click", () => {
		setTheme("auto")
		document.getElementById("theme").setAttribute("data-color-mode", "auto")
	})
	document.getElementById("theme-light").addEventListener("click", () => {
		setTheme("light")
		document.getElementById("theme").setAttribute("data-color-mode", "light")
	})
	document.getElementById("theme-dark").addEventListener("click", () => {
		setTheme("dark")
		document.getElementById("theme").setAttribute("data-color-mode", "dark")
	})
})

ipcRenderer.on("file", (event, file) => {
	console.log("path selected by user: " + file)
	document.getElementById("checkpath").ariaDisabled = false // Makes the check button active
	exportedFile = file.toString()
})
