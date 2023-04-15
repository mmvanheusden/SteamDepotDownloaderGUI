const {
	preDownloadCheck,
	download,
	createCommand,
	runCommand,
	removeDir,
	removeFile,
	unzip
} = require("./utils")

function submitForm() {
	// Check if the form is filled in and if dotnet is installed
	preDownloadCheck().then(async function () {
		document.getElementById("dotnetwarning").hidden = true
		document.getElementById("emptywarning").hidden = true
		console.info("dotnet found in PATH")

		// Remove the old depotdownloader directory
		await removeDir("depotdownloader")

		// Download the DepotDownloader binary, so it doesn't have to be included in the source code
		await download("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.7/depotdownloader-2.4.7.zip")

		// Unzip the DepotDownloader binary
		await unzip("depotdownloader-2.4.7.zip", "depotdownloader")

		// Clean up the old files
		await removeFile("depotdownloader-2.4.7.zip")

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

function submitDotnet() {
	const electron = require("electron")
	const os = process.platform.toString()
	document.getElementById("dotnetwarning").hidden = true
	if (os.includes("win")) {
		console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
		void electron.shell.openExternal("https://aka.ms/dotnet/6.0/dotnet-sdk-win-x64.exe")
	}
	if (os.includes("linux")) {
		console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
		void electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
	}
	if (os.includes("darwin")) {
		console.debug("Opened .NET download page for" + os)
		//TODO: Apple Silicon(ARM64) URL
		void electron.shell.openExternal("https://aka.ms/dotnet/6.0/dotnet-sdk-osx-x64.pkg")
	}
}

function openGitHubIssues() {
	const electron = require("electron")
	console.debug("Opened GitHub issues page")
	void electron.shell.openExternal("https://github.com/mmvanheusden/SteamDepotDownloaderGUI/issues/new")
}

function openSteamDB() {
	const electron = require("electron")
	console.debug("Opened SteamDB instant search page")
	void electron.shell.openExternal("https://steamdb.info/instantsearch/")
}

function openDonate() {
	const electron = require("electron")
	console.debug("Opened donation page")
	void electron.shell.openExternal("https://liberapay.com/barbapapa/")
}

/* Everything below this line runs when the page is loaded */

// Add event listeners to the buttons
window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("dotnetalertbtn").addEventListener("click", submitDotnet)
	document.getElementById("downloadbtn").addEventListener("click", submitForm)
	document.getElementById("smbtn1").addEventListener("click", openGitHubIssues)
	document.getElementById("smbtn2").addEventListener("click", openSteamDB)
	document.getElementById("smbtn3").addEventListener("click", openDonate)
})