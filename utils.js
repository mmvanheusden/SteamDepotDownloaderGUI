var defaultTerminal = ""

/**
 * Checks if all required fields are filled and if dotnet is installed in the system path.
 * It returns a promise that resolves to true if dotnet is installed and all required fields are filled, false otherwise.
 *
 * @returns {Promise<unknown>} A promise that resolves to true if dotnet is installed and all required fields are filled, false otherwise.
 *
 * **rejects**:
 * `emptyField` -> One or more required field(s) are not filled in.
 * `noDotnet` -> `dotnet` has not been found in the path.
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

		// Check if dotnet is found, depending on the platform
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
 * Downloads a file from a given URL and saves it to the current directory.
 *
 * @param {string} url - The URL of the file to download.
 * @returns {Promise<void>} A promise that resolves when the download is finished, or rejects if an error occurs.
 *
 * @throws {Error} If an error occurs during the download or file writing process, the promise is rejected with the error.
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
 * Removes a file from the current directory.
 *
 * @param {string} file - The name of the file to be removed.
 * @returns {Promise<void>} A promise that resolves when the file is successfully removed, or rejects if an error occurs.
 *
 * @throws {Error} If an error occurs during the file removal process, the promise is rejected with the error.
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
 * Removes a directory from the current directory.
 *
 * @param {string} dir - The name of the directory to be removed.
 * @returns {Promise<void>} A promise that resolves when the directory is successfully removed, or rejects if an error occurs.
 *
 * @throws {Error} If an error occurs during the directory removal process, the promise is rejected with the error.
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
 * Unzips a file to a specified target directory.
 *
 * @param {string} file - The name of the zip file to be unzipped.
 * @param {string} target - The target directory where the file will be unzipped to.
 * @returns {Promise<void>} A promise that resolves when the unzip operation is complete, or rejects if an error occurs.
 *
 * @throws {Error} If an error occurs during the unzip operation, the promise is rejected with the error.
 */
function unzip(file, target) {
	const {exec} = require("child_process")
	const path = require("path")
	let finalPath = platformpath() + path.sep

	return new Promise((resolve, reject) => {
		if (process.platform.toString().includes("win")) {
			const command = `powershell.exe -Command Expand-Archive -Path '${finalPath + file}' -Destination '${finalPath + target}'`
			exec(command, function (error) {
				if (error) {
					reject(error)
					console.error(error)
				} else resolve()
			})
		} else {
			const command = `unzip -o ${platformpath().replaceAll(" ", "\\ ") + path.sep + file} -d ${platformpath().replaceAll(" ", "\\ ") + path.sep + target}${path.sep}`
			exec(command, function (error) {
				if (error) {
					reject(error)
					console.error(error)
				} else resolve()
			})
		}
	})
}

async function createCommandWithTerminal(command, terminal, os) {
	let cmd = ""

	if (terminal === "auto") {
		terminal = defaultTerminal[0]
	}
	// if os is auto, choose the os for us.
	if (os === "auto") {
		if (process.platform.toString().includes("win")) {
			os = 0
		} else if (process.platform.toString().includes("linux")) {
			os = 2
		}
	} else console.log("OS is manually chosen")
	/* eslint-disable */
	if (os === 0) {
		cmd = `start cmd.exe /k ${command}`
	} else if (os === 1) {
		cmd = `osascript -c 'tell application "Terminal" to do script '${command}'`
	} else if (os === 2) {
		switch (terminal) {
		case 0:
			cmd = `gnome-terminal -e 'bash -c "${command};$SHELL"'`
			break
		case 1:
			cmd = `konsole --hold -e "${command}"`
			break
		case 2:
			cmd = `xfce4-terminal -H -e "${command}"`
			break
		case 3:
			cmd = `terminator -e 'bash -c "${command};$SHELL"'`
			break
		case 4:
			cmd = `terminology -H -e "${command}"`
			break
		case 5:
			cmd = `xterm -hold -T "Downloading Depot..." -e "${command}"`
			break
		case 6:
			cmd = `kitty --hold sh -c "${command}"`
			break
		case 7:
			cmd = `lxterminal -e "${command};$SHELL"`
			break
		case 8:
			cmd = `tilix -e sh -c "${command};$SHELL"`
			break
		case 9:
			cmd = `deepin-terminal -e 'sh -c "${command};$SHELL"'`
			break
		case 10:
			cmd = `cool-retro-term -e sh -c "${command}"`
			break
		default:
			console.log("NO TERMINAL. PANIC.")
		}
	} else if (os === 3) {
		if (process.platform.toString().includes("win")) {
			console.log(`COPY-PASTE THE FOLLOWING INTO THE TERMINAL:\n\n${command}`)
		} else console.log(`COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL:\n\n${command}`)
		cmd = ""
	}

	return cmd
	/* eslint-enable */
}

async function generateRunScript(username, password, appid, depotid, manifestid, folderinput, chosenPath) {
	const path = require("path")
	const fs = require("fs")
	const sep = path.sep
	let foldername = ""

	// allow enormous strings like &$§"&$="§$/"(§NJUIDW>;!%?aQ52V?*['YsDnRy|(+Q 1h6BmnDQp,(Xr& being used as password.
	// NOT TESTED
	password = password.replace(/"/g, "\"\"")

	// if either the username or password fields is empty, anonymous login is used
	let anonymous = username === "" || password === ""


	/* put the username and password flags into one string, allowing for anonymous login.
						if anonymous:  false  true
									   |       |
	 */
	let userpass = anonymous ? "" : `-username ${username} -password "${password}"`

	/* if nothing is inputted by the user in the folder input, it will be defaulted to the appid. else to the value */
	foldername = folderinput.value === "" ? appid : folderinput.value

	/* if the path isn't selected by the user, go for the path the app is located in. else use the path the user chose. */
	chosenPath = chosenPath === "" ? platformpath() : chosenPath

	let finalPath = (chosenPath + path.sep + foldername)
	if (process.platform.includes("win")) {
		if (finalPath.includes(" ")) {
			console.log("path contains spaces. adding quotes")
			finalPath = `"${finalPath}"`
			console.log("Result: " + finalPath)
		}
	} else {
		finalPath = finalPath.replaceAll(" ", "\\ ")
	}

	/* 										/ or \         if nothing is inputted its appid  replaces " " with "\ ", so whitespaces can be in path names.
	finalpath: ((the path the user chose) + (seperator) + (the folder name the user chose)).replaceAll()
	 */


	/* The structure of a DepotDownloader command:
	.NET CLI    Path to the DepotDownloader dll.		Username/pass combination app id		 depot id			manifest id		the dir chosen by user or app path	 controls how much download servers and threads are used. Needs benchmark TODO
	  |						|									|					|				|					|				|											|																				|
	dotnet (path)(sep)depotdownloader(sep)DepotDownloader.dll (userpass)	-app (appid)  -depot (depotid) -manifest (manifestid) -dir (path)(sep)				-max-servers 50 -max-downloads 16
	 */

	if (process.platform.includes("linux")) {
		// if linux, write a bash script.
		let content = `#!/usr/bin/env bash
dotnet ${platformpath().replaceAll(" ", "\\ ")}${sep}depotdownloader${sep}DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}${sep} -max-servers 50 -max-downloads 16
		`
		await fs.writeFileSync(`${platformpath()}${sep}run.sh`, content)
		await fs.chmodSync(`${platformpath()}${sep}run.sh`, "755") // make it executable
		console.log(`Writing:
--------
dotnet ${platformpath().replaceAll(" ", "\\ ")}${sep}depotdownloader${sep}DepotDownloader.dll ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath}${sep} -max-servers 50 -max-downloads 16

to ${platformpath()}${sep}run.sh.
`)
	} else if (process.platform.includes("win")) {
		// if windows, write a batch script
		let content = `dotnet "${platformpath()}${sep}depotdownloader${sep}DepotDownloader.dll" ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath} -max-servers 50 -max-downloads 16`
		await fs.writeFileSync(`${platformpath()}${sep}run.bat`, content)
		console.log(`Writing:
--------
dotnet "${platformpath()}${sep}depotdownloader${sep}DepotDownloader.dll" ${userpass} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ${finalPath} -max-servers 50 -max-downloads 16

to ${platformpath()}${sep}run.bat.
`)
	} else { /* macos */
	}
}

/**
 * Executes a given command in a separate process.
 *
 * @param {string} command - The command to be executed.
 * @returns {Promise<void>} A promise that resolves when the command execution is successful, or rejects if an error occurs.
 *
 * @throws {Error} If an error occurs during the command execution, the promise is rejected with an error message.
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
 * Windows -> Dev env: __dirname, Portable: process.env.PORTABLE_EXECUTABLE_DIR
 * Linux -> process.cwd()
 * @returns {string} The absolute path
 */
const platformpath = () => {
	// On linux, it must return process.cwd(). On windows, it must return process.env.PORTABLE_EXECUTABLE_DIR, but only if the program is running from a portable exe.
	// On linux, __dirname returns the correct path, but on windows, it returns the path to the app.asar file, which is not what we want. Only in dev environment it returns the correct path.

	if (process.platform.includes("win")) {
		if (process.env.PORTABLE_EXECUTABLE_DIR !== undefined) {
			return process.env.PORTABLE_EXECUTABLE_DIR
		} else {
			return __dirname
		}
	} else {
		return process.cwd()
	}
}

/**
 * Checks for the availability of terminal emulators on Linux.
 * It runs the '--version' command on each terminal emulator and checks if the command is successful.
 * If the command is successful, it means the terminal emulator is installed and available.
 * The function returns an array of the indices of the available terminal emulators.
 * If no terminal emulator is available, it returns false.
 * If the operating system is not Linux, it also returns false.
 *
 * @returns {string[]|boolean} An array of the indices of the available terminal emulators, or false if none are available or the OS is not Linux.
 */
const forceTerminals = async () => {
	const commands = [["gnome-terminal", "--version", 0], ["konsole", "--version", 1], ["xfce4-terminal", "--version", 2], ["terminator", "--version", 3], ["terminology", "--version", 4], ["xterm", "-v", 5], ["kitty", "--version", 6], ["lxterminal", "--version", 7], ["tilix", "--version", 8], ["deepin-terminal", "--version", 9], ["cool-retro-term", "--version", 10]]
	let availableTerminals = [] // list of IDs of terminals, corrospending to their index in the dropdown menu
	let availableNames = [] // list of names of found terminals
	if (process.platform === "linux") {
		for (let i = 0; i < commands.length; i++) {
			await runCommand(`${commands[i][0]} ${commands[i][1]}`).then(() => {
				console.log(`Found ${commands[i][0]}`)
				availableTerminals.push(commands[i][2])
				availableNames.push(commands[i][0])
			}).catch(() => {
				console.log(`${commands[i][0]} not found on system.`)
			})
		}
		if (availableTerminals.length > 0) {
			defaultTerminal = availableTerminals
			return [true, availableTerminals, availableNames] // [true, "2,4,7", "twox,fourterm,sevenemulator"] (example)
		} else return false
	} else return false
}

async function findDotnet() {
	// Check if dotnet is found, depending on the platform
	if (process.platform.toString().includes("win")) {
		// Windows
		const {exec} = require("child_process")
		const command = "dotnet.exe --version"
		await exec(command, function (error) {
			return !error
		})
	} else {
		// Others
		// macOS seems to be broken.
		const {exec} = require("child_process")
		const command = "dotnet --version"
		await exec(command, function (error) {
			if (error) {
				exec("./dotnet/dotnet --version", function (error) {
					return !error
				})
			}
		})
	}
}

module.exports = {
	preDownloadCheck,
	download,
	runCommand,
	removeDir,
	removeFile,
	unzip,
	platformpath,
	forceTerminals,
	generateRunScript,
	createCommandWithTerminal,
	findDotnet
}
