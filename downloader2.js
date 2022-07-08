function submitForm() {
	checkDotnet().then(async function (result) {
		if (!result) {
			console.error("dotnet not found in PATH")
			document.getElementById("dotnetwarning").hidden = false
		} else {
			console.info("dotnet found in PATH")

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


/**
 * Checks if dotnet is installed in the system path
 * @returns {Promise<unknown>} A promise that resolves to true if dotnet is installed, false otherwise
 */
function checkDotnet() {
	//TODO: Windows support
	return new Promise((resolve) => {
		const {exec} = require("child_process")
		const command = "dotnet --version"
		exec(command, function (error) {
			if (error) {
				resolve(false)
			} else {
				resolve(true)
			}
		})
	})
}

/**
 * Download a file from a url, saving it to the current directory (__dirname)
 * @param url The url to download from
 * @returns {Promise<unknown>} A promise that resolves when the download is finished
 */
function download(url) {
	return new Promise((resolve) => {
		const {https} = require("follow-redirects")
		const fs = require("fs")
		const file = fs.createWriteStream(url.split("/").pop().toString())
		const request = https.get(url, function (response) {
			response.pipe(file)
			file.on("finish", function () {
				file.close()
				resolve()
			})
		})
	})
}

/**
 * Removes a file from the current directory
 * @param file The filename to remove
 * @returns {Promise<unknown>} A promise that resolves when the file is removed (or fails)
 */
function removeFile(file) {
	return new Promise((resolve) => {
		const fs = require("fs")
		fs.unlink(file, function (err) {
			if (err) {
				console.error(err)
			}
			resolve()
		})
	})
}

/**
 * Unzip a file to the current directory
 * @param file The file to unzip, preferably a .zip file
 * @param target The target directory to unzip to
 * @returns {Promise<unknown>} A promise that resolves when the unzip is complete (or fails)
 */
function unzip(file, target) {
	//TODO: Windows support
	return new Promise((resolve) => {
		const {exec} = require("child_process")
		const command = "unzip -o " + file + " -d ./" + target + "/"
		exec(command, function (error, stdout, stderr) {
			if (error) {
				console.error("Unzipping failed with error: " + error)
			}
			console.debug(stdout)
			if (stderr) {
				console.error(stderr)
			}
			resolve()
		})
	})
}

/**
 * Hides the alert box and opens the .NET SDK
 * download page respecting the operating system being used
 */
function submitDotnet() {
	const electron = require("electron")
	const os = process.platform.toString()
	document.getElementById("dotnetwarning").hidden = true
	if (os.includes("win")) {
		console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer")
	}
	if (os.includes("linux")) {
		console.debug("Opened .NET download page for " + os.charAt(0).toUpperCase() + os.slice(1))
		electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
	}
	if (os.includes("darwin")) {
		console.debug("Opened .NET download page for" + os)
		//TODO: apple silicon(ARM64) URL
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-macos-x64-installer")
	}
}

/**
 * Creates a command based on the operating system/terminal being selected and the form values
 * @returns {string} The final command to run
 */
const createCommand = () => {
	// The values inputted by the user in the form
	let username = document.forms["theform"]["username"].value
	let password = document.forms["theform"]["password"].value
	let appid = document.forms["theform"]["appid"].value
	let depotid = document.forms["theform"]["depotid"].value
	let manifestid = document.forms["theform"]["manifestid"].value
	let osdropdown = document.getElementById("osdropdown")

	// The final command to run, returned by this function
	if (osdropdown.options[osdropdown.selectedIndex].text.includes("Gnome")) {
		return `gnome-terminal -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Windows")) {
		return `cmd.exe  /k dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("macOS")) {
		// TODO: macOS command
		// something like open -a Terminal.app zsh -c "
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Konsole")) {
		return `konsole --hold -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Xfce")) {
		return `xfce4-terminal -H -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Terminator")) {
		return `terminator -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Print command")) {
		console.log(`\COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL OF CHOICE:\n\ndotnet ${__dirname}/depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`)
		return "ls > /dev/null" //lazy lol
	}
}


/**
 * Runs a command in a separate process, printing errors and debugging info to the console
 * @param command The command to run
 * @returns {Promise<unknown>} A promise that resolves when the command is complete (or fails)
 */
function runCommand(command) {
	return new Promise((resolve) => {
		const {exec} = require("child_process")
		exec(command, function (error, stdout, stderr) {
			if (error) {
				console.debug("Command failed with error: " + error)
			}
			if (stderr) {
				console.error(stderr)
			}
			resolve()
		})
	})
}