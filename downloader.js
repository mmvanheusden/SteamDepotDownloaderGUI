function submitDotnet() {
	const electron = require("electron")
	const os = require("os")
	document.getElementById("download").disabled = false
	document.getElementById("alert").hidden = true
	document.getElementById("alertbtn").hidden = true
	if (os.platform().includes("win")) {
		console.debug("Opened .NET download page for " + os.platform().charAt(0).toUpperCase() + os.platform().slice(1))
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer")
	}
	if (os.platform().includes("linux")) {
		console.debug("Opened .NET download page for " + os.platform().charAt(0).toUpperCase() + os.platform().slice(1))
		electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
	}
	if (os.platform().includes("darwin")) {
		console.debug("Opened .NET download page for" + os.platform())
		//TODO: apple silicon(ARM64) URL
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-macos-x64-installer")
	}
}

function submitForm() {
	// Imports
	const os = require("os")
	const fs = require("fs")
	const path = require("path").dirname(__filename)
	const which = require("which")
	const {https} = require("follow-redirects")
	const {exec} = require("child_process")

	// Variables
	let username = document.forms["theform"]["username"].value
	let password = document.forms["theform"]["password"].value
	let appid = document.forms["theform"]["appid"].value
	let depotid = document.forms["theform"]["depotid"].value
	let manifestid = document.forms["theform"]["manifestid"].value
	let osdropdown = document.getElementById("osdropdown")

	// Debug info
	console.debug(
		"DEBUG INFO\n"
		+ "Username: " + username
		+ "\nPassword: no"
		+ "\nApp ID: " + appid +
		"\nDepot ID: " + depotid
		+ "\nManifest ID: " + manifestid
		+ "\nPlatform: " + os.platform()
		+ "\nPath: " + path
	)

	// OS check
	console.info("Using " + os.platform())


	// Main code
	// Check if dotnet is found in the PATH
	which("dotnet", function (er) {
		// er is returned if no "dotnet" is found on the PATH
		if (er) {
			console.warn("dotnet not found(in system path)")
			document.getElementById("alert").hidden = false
			document.getElementById("alertbtn").hidden = false
			document.getElementById("download").disabled = true

		} else {
			// If dotnet is found, start the download process
			console.log("Found dotnet in system path")

			// Check if directory already exists
			try {

				if (!fs.existsSync("./depotdownloader")) {						// INFO FOR TESTING:
					fs.mkdirSync("./depotdownloader")							// appid: 346900
					console.info("Directory is created.")						// depotid:
				} else {															// linux: 346903
					console.info("Directory already exists.")					// windows: 346901
				}																	// manifestid:
			} catch (err) {															// linux 1203243898820547407
				console.error(err)													// windows: 581051086350795523
			}

			// Download the file
			const file = fs.createWriteStream("./depotdownloader/depotdownloader.zip")
			const request = https.get("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip", function (response) {
				response.pipe(file)
				console.info("Downloaded DepotDownloader binary zip")
			})

			// Once the file is finished downloading, do the rest
			file.on("finish", function () {
				file.close()
				console.info("Extracting DepotDownloader binary")

				// note:  The following code has delays in between because async read/write operations won't work well
				// Clean up leftovers
				setTimeout(() => {
					exec("file ./depotdownloader/* | grep -vi zip | cut -d: -f1 | tr '\\n' '\\0' | xargs -0 -r rm", (err, stdout, stderr) => {
						if (err) {
							console.error(err)
							return
						}
						if (stderr !== "") {
							console.error(stderr)
						}
					})
					console.debug("Removed leftover files")
				}, 100)

				// Unzip downloaded zip
				setTimeout(() => {
					exec("unzip -o ./depotdownloader/depotdownloader.zip -d ./depotdownloader/", (err, stdout, stderr) => {
						if (err) {
							console.error(err)
							return
						}
						if (stderr !== "") {
							console.error(stderr)
						}
					})
					console.debug("Unzipped")
				}, 200)

				// Remove the zip after unzip
				setTimeout(() => {
					exec("rm ./depotdownloader/depotdownloader.zip", (err, stdout, stderr) => {
						if (err) {
							console.error(err)
							return
						}
						if (stderr !== "") {
							console.log(stderr)
						}
					})
					console.debug("Removed leftover zip")
				}, 350)

				// Run the actual depotdownloader process in a terminal
				setTimeout(() => {
					console.info("Finished extracting DepotDownloader binary..")
					console.debug("Starting dotnet process...")

					// The following code creates a variable that will contain the final command that will be executed
					let finalcommand
					if (osdropdown.options[osdropdown.selectedIndex].text.includes("Gnome")) {
						finalcommand = `gnome-terminal -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
					} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Windows")) {
						finalcommand = `cmd.exe  /k dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`
					} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("macOS")) {
						// TODO: macOS command
						// something like open -a Terminal.app zsh -c "
					} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Konsole")) {
						finalcommand = `konsole --hold -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
					} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Xfce")) {
						finalcommand = `xfce4-terminal -H -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
					} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Terminator")) {
						finalcommand = `terminator -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
					} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Print command")) {
						console.log(`\COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL OF CHOICE:\n\ndotnet ${__dirname}/depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`)
						finalcommand = "ls > /dev/null" //lazy lol
					}

					// Execute the final command
					exec(finalcommand)
				}, 400)
			})
		}
	})

}
