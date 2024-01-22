// Uses a prebuild binary of https://github.com/SteamRE/DepotDownloader
// License can be found at https://github.com/SteamRE/DepotDownloader/blob/master/LICENSE
const {ipcRenderer, shell} = require("electron")
const {
	preDownloadCheck,
	download,
	runCommand,
	removeDir,
	removeFile,
	unzip,
	forceTerminals,
	generateRunScript,
	createCommandWithTerminal,
	platformpath,
	findDotnet
} = require("./utils")
const electron = require("electron")
const {sep} = require("path")

// Initializes the variable that holds the path to the specified download location
let exportedFile = ""
let ready = true
let app_version

const DOTNET_DOWNLOAD_URL = "https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.5.0/depotdownloader-2.5.0.zip" // the url to the depotdownloader zip
const DOTNET_DIR = "depotdownloader" // folder where zip is extracted
const DOTNET_ZIP_FILE = DOTNET_DOWNLOAD_URL.split("/").pop() // the file that is being downloaded.

function submitForm() {
	// Check if the form is filled in and if dotnet is installed
	preDownloadCheck().then(async function () {
		//console.log(terminal[1][0])
		document.getElementById("dotnetwarning").hidden = true
		document.getElementById("dotnetwarning2").hidden = true
		document.getElementById("emptywarning").hidden = true
		console.info("dotnet is installed and the form is filled in. 🙌")
		// create variables for the form values
		const username = document.getElementById("username").value
		const password = document.getElementById("password").value
		const appid = document.getElementById("appid").value
		const depotid = document.getElementById("depotid").value
		const manifestid = document.getElementById("manifestid").value
		const terminal_dropdown = document.getElementById("terminal-dropdown").selectedIndex
		const os_dropdown = document.getElementById("os-dropdown").selectedIndex
		const foldername_element = document.getElementById("folder-name-custom-input")


		// Remove the old depotdownloader directory if there are any
		await removeDir("depotdownloader")

		// Download a prebuild DepotDownloader binary, so it doesn't have to be included in the source code
		await download(DOTNET_DOWNLOAD_URL)

		// Unzip the DepotDownloader binary
		await unzip(DOTNET_ZIP_FILE, DOTNET_DIR)

		// Clean up the old files
		await removeFile(DOTNET_ZIP_FILE)

		// Generate the run script (run.sh for linux, or run.bat for windows).
		await generateRunScript(username, password, appid, depotid, manifestid, foldername_element, exportedFile)

		let terminal
		let os
		if (terminal_dropdown === 11) {
			terminal = "auto"
		} else {
			terminal = terminal_dropdown
		}
		if (os_dropdown === 4) {
			os = "auto"
		} else {
			os = os_dropdown
		}
		let command
		if (process.platform.includes("linux")) {
			// if the OS is linux, run the sh file with the chosen terminal
			command = await createCommandWithTerminal(`sh ${platformpath().replaceAll(" ", "\\ ")}${sep}run.sh`, terminal, os)
		} else if (process.platform.includes("win")) {
			// if the OS is windows, just run the batch file
			command = await createCommandWithTerminal(`"${platformpath()}${sep}run.bat"`, terminal, os)
		} else if (process.platform.includes("darwin")) {
			//macOS
		}

		// Run the final command
		if (document.getElementById("os-dropdown").selectedIndex !== 3) await console.debug("Command issued:\n--------\n" + command)
		await runCommand(command)
	}).catch(function (error) {
		if (error === "noDotnet") {
			// if dotnet is not found, show the dotnet warning
			document.getElementById("dotnetwarning2").hidden = true
			document.getElementById("emptywarning").hidden = true
			document.getElementById("dotnetwarning").hidden = false
		} else if (error === "emptyField") {
			// if a required field is empty, show the empty field warning
			document.getElementById("dotnetwarning2").hidden = true
			document.getElementById("dotnetwarning").hidden = true
			document.getElementById("emptywarning").hidden = false
		}
	})
}

// Combines all buttons that are supposed to open an external URL into one big function.
function openRelevantPage(target) {
	const electron = require("electron")
	const os = process.platform.toString()
	/* eslint-disable indent */
	// why are you not indenting nicely eslint?
	switch (target) {
	case "dotnet":
		document.getElementById("dotnetwarning").hidden = true
		document.getElementById("dotnetwarning2").hidden = false
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
		console.debug("Opened GitHub issues page 🐞")
		void electron.shell.openExternal("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/issues/new")
		break
	case "steamdb":
		console.debug("Opened SteamDB instant search page 🔍")
		void electron.shell.openExternal("https://steamdb.info/instantsearch/")
		break
	case "donate":
		console.debug("Opened donation page 💰")
		void electron.shell.openExternal("https://liberapay.com/barbapapa/")
		break
	case "instructions":
		console.debug("Opened instructions page 📚")
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
 * Fills the values for default os
 * Runs when the app is fully loaded.
 */
function fillDefaultValues() {
	// [0]: Windows, [1]: macOS [2]: Linux [3]: manual
	if (process.platform.toString().includes("linux")) {
		document.getElementById("default-os").innerText = "Linux"
		document.getElementById("down-dotnet").ariaDisabled = "false"
	} else if (process.platform.toString().includes("win")) {
		document.getElementById("default-os").innerText = "Windows"
	} else if (process.platform.toString().includes("darwin")) {
		document.getElementById("default-os").innerText = "macOS"
	}
}


/**
 * Validates the choice of the OS dropdown.
 * If the choice is 2 (Linux), enable the terminal selection dropdown.
 * If the choice is not 2 (Linux), disable the terminal selection dropdown.
 * If the choice is 4 (manual), enable the terminal selection dropdown.
 * If the choice is not 4 (manual), disable the terminal selection dropdown.
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
	document.getElementById("settings-button").disabled = disable
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


	await toggleFormAccessibility(true) // disables the form, while loading
	document.getElementById("loader").hidden = false


	console.debug("🐰🐰🐰🐰")


	await fillDefaultValues() // Set the default values based on OS

	const terminals = await forceTerminals()
	/* forceTerminals() returns two values:
	[bol, list, list]
	1: true/false. if true, there are terminals found. if false none are, or not on linux
	2: a list of available terminals with their associated number in the terminal dropdown index.
	3: a list of available terminals with their associated name in the terminal dropdown.
	 */
	if (terminals[0]) {
		console.log(`${terminals[1].length} terminals found in PATH.`)
		document.getElementById("terminals-found").innerText = `${terminals[1].length.toString()} / ${document.getElementById("terminal-dropdown").length - 1}`
		document.getElementById("default-terminal").innerText = terminals[2][0]

	} else {
		console.log("No terminals found in PATH. Continuing with default values") // when no terminals are found on the system, or when linux is not used.
	}

	await findDotnet().then(() => {
		console.log("dotnet found in PATH/local directory!")
		document.getElementById("dotnet-found").innerText = "Yes"
	}).catch((error) => {
		console.log(error)
		console.log("dotnet not found in PATH!")
		document.getElementById("dotnet-found").innerText = "No"
	})

	await toggleFormAccessibility(false) //enable the form again

	await validateChoice() // updates the 'enabled/disabled' html value of the terminal dropdown.

	console.debug(`DEBUGGING INFORMATION:
--
OS: ${process.platform}
Version: ${app_version}
--
Working directory locating methods:
process.cwd(): ${process.cwd()}
__dirname: ${__dirname}
PORTABLE_EXECUTABLE_DIR: ${process.env.PORTABLE_EXECUTABLE_DIR}
--
platformpath(): ${platformpath()}

`)
	document.getElementById("loader").hidden = true
	ready = false
})

async function downloadDotnetAuto() {
	document.getElementById("down-dotnet").ariaDisabled = "true"
	await download("https://download.visualstudio.microsoft.com/download/pr/5226a5fa-8c0b-474f-b79a-8984ad7c5beb/3113ccbf789c9fd29972835f0f334b7a/dotnet-sdk-8.0.100-linux-x64.tar.gz")
	console.log("Finished downloading dotnet tarball")
	await runCommand(`mkdir -p ${platformpath()}/dotnet`)
	await runCommand(`tar -xvf ${platformpath()}/dotnet-sdk-8.0.100-linux-x64.tar.gz -C dotnet`)
	console.log("Finished extracting dotnet tarball")
	await findDotnet() // to make it use the newly downloaded dotnet
	document.getElementById("down-dotnet").ariaDisabled = "false" // so the button can be pressed again for whatever reason
}

// Add event listeners to the buttons
window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("down-dotnet").addEventListener("click", () => {
		if (document.getElementById("down-dotnet").ariaDisabled === "false") downloadDotnetAuto()
	})
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
		if (document.getElementById("settings-button").disabled === false) {
			// show the modal. This is done by setting the display to block.
			document.getElementById("settings-surrounding").style.display = "block"
		}
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
	document.getElementById("folder-name-appid").addEventListener("click", () => {
		document.getElementById("folder-name-custom").ariaSelected = false
		document.getElementById("folder-name-appid").ariaSelected = true
		document.getElementById("folder-name-custom-input").hidden = true
		document.getElementById("folder-name-custom-input").value = ""
	})
	document.getElementById("folder-name-custom").addEventListener("click", () => {
		document.getElementById("folder-name-appid").ariaSelected = false
		document.getElementById("folder-name-custom").ariaSelected = true
		document.getElementById("folder-name-custom-input").hidden = false
	})
	document.getElementById("version-info").addEventListener("click", () => {
		//todo: update checker
		electron.shell.openExternal(`https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/v${app_version}`)
	})
})

// make sure devtools open in external window.
window.addEventListener("keydown", (e) => {
	if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
		e.preventDefault()
		ipcRenderer.send("open-devtools")
	}
})

ipcRenderer.on("file", (event, file) => {
	console.log("path selected by user: " + file)
	document.getElementById("checkpath").ariaDisabled = false // Makes the check button active
	document.getElementById("checkpath").disabled = false // Makes the check button active
	exportedFile = file.toString()
})

// receive the version from main.js
ipcRenderer.on("version", (event, version) => {
	console.log("version: " + version)
	document.getElementById("version-info").innerText = `v${version}`
	app_version = version.toString()
})
