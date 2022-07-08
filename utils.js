/**
 * Checks if dotnet is installed in the system path
 * @returns {Promise<unknown>} A promise that resolves to true if dotnet is installed, false otherwise
 */
function checkDotnet() {
	return new Promise((resolve) => {
		if (process.platform.toString().includes("win")) {
			const {exec} = require("child_process")
			const command = "dotnet.exe --version"
			exec(command, function (error) {
				if (error) {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		} else {
			const {exec} = require("child_process")
			const command = "dotnet --version"
			exec(command, function (error) {
				if (error) {
					resolve(false)
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
 * @returns {Promise<unknown>} A promise that resolves when the download is finished
 */
function download(url) {
	return new Promise((resolve) => {
		const {https} = require("follow-redirects")
		const fs = require("fs")
		const file = fs.createWriteStream(url.split("/").pop().toString())
		https.get(url, function (response) {
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
 * Removes a directory from the current directory
 * @param dir The directory to remove
 * @returns {Promise<unknown>} A promise that resolves when the directory is removed (or fails)
 */
function removeDir(dir) {
	return new Promise((resolve) => {
		const fs = require("fs")
		fs.rm(dir, {recursive: true, force: true}, function (err) {
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
	const {exec} = require("child_process")
	return new Promise((resolve) => {
		if (process.platform.toString().includes("win")) {
			const command = "powershell.exe -Command Expand-Archive -Path " + __dirname + "/" + file + " -Destination " + target
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
		} else {
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
		}
	})
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
		return `start cmd.exe /k dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("macOS")) {
		// TODO: macOS command
		// I believe it is something like "open -a Terminal.app zsh -c "
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Konsole")) {
		return `konsole --hold -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Xfce")) {
		return `xfce4-terminal -H -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Terminator")) {
		return `terminator -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
	} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Print command")) {
		console.log(`COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL OF CHOICE:\n\ndotnet ${__dirname}/depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`)
		return "echo hello"
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

module.exports = {checkDotnet, download, createCommand, runCommand, removeDir, removeFile, unzip}