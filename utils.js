/**
 * Checks if dotnet is installed in the system path
 * @returns {Promise<unknown>} A promise that resolves to true if dotnet is installed, false otherwise
 */
function preDownloadCheck() {
	return new Promise((resolve, reject) => {
		// Check if all fields are filled
		const formInputs = document.forms["theform"]

		let unfilledFields = 0
		for (const input of formInputs) {
			const isInvalid = input.value === "" && input.parentElement.classList.contains("required")
			input.parentElement.classList.toggle("errored", isInvalid) // toggle the 'errored' class depending on if isInvalid is true or false.
			if (isInvalid) unfilledFields++
		}
		if (unfilledFields > 0) {
			reject("emptyField")
			return
		}

		// Check if dotnet is installed, depending on the platform
		if (process.platform.toString().includes("win")) {
			// Windows
			const {exec} = require("child_process")
			const command = "dotnet.exe --version"
			exec(command, function (error) {
				if (error) {
					reject("noDotnet")
				} else {
					resolve(true)
				}
			})
		} else {
			// Others
			// macOS seems to be broken.
			const {exec} = require("child_process")
			const command = "dotnet --version"
			exec(command, function (error) {
				if (error) {
					reject("noDotnet")
				} else {
					resolve(true)
				}
			})
		}
	})
}

/**
 * Download a file from a url, saving it to the current directory (__dirname)
 * @param url The url to download from
 * @returns {Promise<unknown>} A promise that resolves when the download is finished, or rejects if something fails
 */
function download(url) {
	return new Promise((resolve, reject) => {
		const {https} = require("follow-redirects") /* Using follow-redirects to follow redirects */
		const fs = require("fs")
		const path = require("path")
		const file = fs.createWriteStream(platformpath() + path.sep + url.split("/").pop())
		https.get(url, function (response) {
			response.pipe(file)
			file.on("finish", function () {
				file.close()
				resolve()
			})
			file.on("error", function (error) {
				console.error(error)
				reject(error)
			})
		})
	})
}

/**
 * Removes a file from the current directory
 * @param file The filename to remove
 * @returns {Promise<unknown>} A promise that resolves when the file is removed, or rejects if something fails
 */
function removeFile(file) {
	return new Promise((resolve, reject) => {
		const fs = require("fs")
		const path = require("path")
		fs.unlink(platformpath() + path.sep + file, function (error) {
			if (error) {
				reject(error)
				console.error(error)
			} else resolve()
		})
	})
}

/**
 * Removes a directory from the current directory
 * @param dir The directory to remove
 * @returns {Promise<unknown>} A promise that resolves when the directory is removed, or rejects if something fails
 */
function removeDir(dir,) {
	return new Promise((resolve, reject) => {
		const fs = require("fs")
		const path = require("path")
		fs.rm(platformpath() + path.sep + dir, {recursive: true, force: true}, function (error) {
			if (error) {
				reject(error)
				console.error(error)
			} else resolve()
		})
	})
}

/**
 * Unzip a file to the current directory
 * @param file The zip file to unzip.
 * @param target The target directory to unzip to
 * @returns {Promise<unknown>} A promise that resolves when the unzip is complete, or rejects if something fails
 */
function unzip(file, target) {
	const {exec} = require("child_process")
	const path = require("path")

	return new Promise((resolve, reject) => {
		if (process.platform.toString().includes("win")) {
			const command = "powershell.exe -Command Expand-Archive -Path " + platformpath() + path.sep + file + " -Destination " + platformpath() + path.sep + target
			exec(command, function (error) {
				if (error) {
					reject(error)
					console.error(error)
				} else resolve()
			})
		} else {
			const command = "unzip -o " + file + " -d ./" + target + "/"
			exec(command, function (error) {
				if (error) {
					reject(error)
					console.error(error)
				} else resolve()
			})
		}
	})
}

/**
 * Creates a command based on the operating system/terminal being selected and the form values
 * @returns {string} The final command to run
 */
const createCommand = () => {
	// Import path so \ can be put in a string
	const path = require("path")

	// The values inputted by the user in the form
	let username = document.forms["theform"]["username"].value
	let password = document.forms["theform"]["password"].value
	let appid = document.forms["theform"]["appid"].value
	let depotid = document.forms["theform"]["depotid"].value
	let manifestid = document.forms["theform"]["manifestid"].value
	let os = document.getElementById("osdropdown").selectedIndex
	let terminal = document.getElementById("osdropdown2").selectedIndex

	/* OS dropdown choices
	[0] - Windows
	[1] - macOS
	[2] - Linux
	[3] - manual
	 */

	/* Terminal dropdown choices
	[0] - Gnome Terminal
	[1] - KDE Konsole
	[2] - Xfce terminal
	[3] - terminator
	[4] - Terminology
	[5] - xterm
	[6] - Kitty
	[7] - LXTerminal
	[8] - Tilix
	[9] - Deepin Terminal
	[10] - cool-retro-term
	 */

	// if either the username or password fields are empty, anonymous login is used
	let anonymous = username === "" || password === ""

	// allow enormous strings like &$§"&$="§$/"(§NJUIDW>;!%?aQ52V?*['YsDnRy|(+Q 1h6BmnDQp,(Xr&Th _fMMm|*1T5a^HBuJr)EYKdA$~V*9N~74zg3hf9ZH(!HR"§RH§"H(R being used as password
	password = password.replace(/"/g, "\"\"")

	// build the username and password flags into one string, allowing for anonymous login
	let userpass = anonymous ? "" : `-username ${username} -password "${password}"`

	// for some reason exportedFile doesn't have to be imported or exported
	// eslint-disable-next-line no-undef
	const finalPath = (exportedFile + path.sep + appid).replaceAll(" ", "\\ ")
	// The final command to run, returned by this function
	if (os === 0) {
		return `start cmd.exe /k dotnet ${platformpath()}${path.sep}depotdownloader${path.sep}DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16`
	} else if (os === 1) {
		return `osascript -c 'tell application "Terminal" to do script 'dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16'`
	} else if (os === 2) {
		if (terminal === 0) {
			return `gnome-terminal -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16";$SHELL'`
		} else if (terminal === 1) {
			return `konsole --hold -e "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16"`
		} else if (terminal === 2) {
			return `xfce4-terminal -H -e "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16"`
		} else if (terminal === 3) {
			return `terminator -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16";$SHELL'`
		} else if (terminal === 4) {
			return `terminology -H -e "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16"`
		} else if (terminal === 5) {
			return `xterm -hold -T "Downloading Depot..." -e "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16"`
		} else if (terminal === 6) {
			return `kitty --hold sh -c "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16"`
		} else if (terminal === 7) {
			return `lxterminal -e "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16;$SHELL"`
		} else if (terminal === 8) {
			return `tilix -e sh -c "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16;$SHELL"`
		} else if (terminal === 9) {
			return `deepin-terminal -e 'sh -c "dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16;$SHELL"'`
		} else if (terminal === 10) {
			return `cool-retro-term -e sh -c "cd ${platformpath()} && dotnet ./depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}/ -max-servers 50 -max-downloads 16;$SHELL"`
		}
	} else if (os === 3) {
		console.log(`COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL OF CHOICE:\n\ndotnet ${platformpath()}/depotdownloader/DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath} -max-servers 50 -max-downloads 16`)
		return "echo hi"
	}
}

/**
 * Runs a command in a separate process, printing errors and debugging info to the console
 * @param command The command to run
 * @returns {Promise<unknown>} A promise that resolves when the command is complete or rejects if something fails
 */
function runCommand(command) {
	return new Promise((resolve, reject) => {
		const {exec} = require("child_process")
		exec(command, function (error) {
			if (error) {
				const msg = "Running command failed with error:\n" + error
				reject(msg)
			} else resolve()
		})
	})
}

/**
 * Returns the path where the actual program is being run from, depending on the operating system.
 * Because __dirname is inconsistent across operating systems, this function is used to get the correct path.
 *
 * Windows .exe -> process.env.PORTABLE_EXECUTABLE_DIR
 * Linux .appimage -> process.cwd()
 * Linux .zip -> process.cwd()
 * @returns {string} The absolute path
 */
const platformpath = () => {
	if ((__dirname.includes("AppData") || __dirname.includes("Temp")) && process.platform.toString().includes("win")) {
		// Windows portable exe
		return process.env.PORTABLE_EXECUTABLE_DIR
	} else if (/*__dirname.includes("/tmp/") && */process.platform.toString().includes("linux")) {
		// in a .zip, __dirname seems to return a broken path, ending with app.asar.
		// using process.cwd() fixes that, but might not work on all distros as this has been an issue in the past.
		// see commit 894197e75e774f4a17cced00d9862ab3942a8a5a

		// Linux AppImage / .zip
		return process.cwd()
	} /*else {
		return __dirname
	}*/
}

module.exports = {preDownloadCheck, download, createCommand, runCommand, removeDir, removeFile, unzip, platformpath}