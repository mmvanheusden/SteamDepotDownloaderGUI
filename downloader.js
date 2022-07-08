const {checkDotnet, download, createCommand, runCommand, removeDir, removeFile, unzip} = require("./utils")

function submitForm() {
	checkDotnet().then(async function (result) {
		if (!result) {
			console.error("dotnet not found in PATH")
			document.getElementById("dotnetwarning").hidden = false
		} else {
			console.info("dotnet found in PATH")

			// Remove the old depotdownloader directory
			await removeDir("depotdownloader")

			// Download the DepotDownloader binary, so it doesn't have to be included in the source code
			await download("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip")

			// Unzip the DepotDownloader binary
			await unzip("depotdownloader-2.4.6.zip", "depotdownloader")

			// Clean up the old files
			await removeFile("depotdownloader-2.4.6.zip")

			// Run the final command
			await runCommand(createCommand().toString())
		}
	})
}


function submitDotnet() {
	const electron = require("electron")
	const os = process.platform.toString()
	document.getElementById("dotnetwarning").hidden = true
	if (os.includes("win")) {
		console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
		void electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer")
	}
	if (os.includes("linux")) {
		console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
		void electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
	}
	if (os.includes("darwin")) {
		console.debug("Opened .NET download page for" + os)
		//TODO: apple silicon(ARM64) URL
		void electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-macos-x64-installer")
	}
}


window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("alertbtn").addEventListener("click", submitDotnet)
	document.getElementById("downloadbtn").addEventListener("click", submitForm)
})

