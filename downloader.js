"use strict"


function submitDotnet() {
	const electron = require("electron")
	const os = require("os")
	document.getElementById("download").disabled = false
	document.getElementById("alert").hidden = true
	document.getElementById("alertbtn").hidden = true
	if (os.platform().includes("win")) {
		console.info("Opened .NET download page for " + os.platform().charAt(0).toUpperCase() + os.platform().slice(1))
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer")
	}
	if (os.platform().includes("linux")) {
		console.info("Opened .NET download page for " + os.platform().charAt(0).toUpperCase() + os.platform().slice(1))
		electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
	}
	if (os.platform().includes("darwin")) {
		console.info("Opened .NET download page for" + os.platform())
		//TODO: apple silicon(ARM64) URL
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-macos-x64-installer")
	}

}

function submitForm() {
	const os = require("os")
	const fs = require("fs")
	const path = require("path").dirname(__filename)
	const which = require("which")
	const {https} = require("follow-redirects")

	let username = document.forms["theform"]["username"].value
	let password = document.forms["theform"]["password"].value
	let appid = document.forms["theform"]["appid"].value
	let depotid = document.forms["theform"]["depotid"].value
	let manifestid = document.forms["theform"]["manifestid"].value
	var osdropdown = document.getElementById("osdropdown")
	console.debug("Selected terminal: "+ osdropdown.options[osdropdown.selectedIndex].text)
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
	if (os.platform().includes("win")) {
		console.info("Using Windows!")
		//TODO: windows compat lol
	}
	if (os.platform().includes("linux")) {
		console.info("Using Linux")
	}
	which("dotnet", function (er) {
		// er is returned if no "node" is found on the PATH
		// if it is found, then the absolute path to the exec is returned
		if (er) {
			console.warn("dotnet not found(in system path)")
			document.getElementById("alert").hidden = false
			document.getElementById("alertbtn").hidden = false
			document.getElementById("download").disabled = true

		} else {
			console.log("Found dotnet in system path")
			file.on("finish", function () {
				file.close()
				const {exec} = require("child_process")
				console.info("Extracting DepotDownloader binary")

				// The following code has delays in between because async io operations won't work well
				// Cleans up old files (but not the downloaded zip)
				if (os.platform().includes("win")) {
					setTimeout(() => {
						exec("rmdir ./depotdownloader/", (err, stdout, stderr) => {
							if (err) {
								console.error(err)
								return
							}
							if (stderr !== "") {
								console.error(stderr)
							}
						})
						console.debug("Removed leftover files")
						try {
							// first check if directory already exists
							if (!fs.existsSync("./depotdownloader")) {
								fs.mkdirSync("./depotdownloader")
								console.info("Directory is created.")
							} else {
								console.info("Directory already exists.")
							}
						} catch (err) {
							console.error(err)
						}
						const file = fs.createWriteStream("./depotdownloader/depotdownloader.zip")
						const request = https.get("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip", function (response) {
							response.pipe(file)
							console.info("Downloaded DepotDownloader binary zip")
						})
					}, 100)
					// Unzips downloaded zip
					setTimeout(() => {
						exec("tar -xf ./depotdownloader/depotdownloader.zip -c ./depotdownloader/", (err, stdout, stderr) => {
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
					// Removes the zip after unzip
					setTimeout(() => {
						exec("del ./depotdownloader/depotdownloader.zip", (err, stdout, stderr) => {
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
					setTimeout(() => {
						console.info("Finished extracting DepotDownloader binary..")
						console.debug("Starting dotnet process...")
						var finalcommand
						finalcommand = `cmd.exe  /k dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`

						exec(finalcommand, (err, stdout, stderr) => {
							if (err) {
								console.error(err)

							}
						})
					}, 400)
				} else if (os.platform().includes("linux")) {
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
					// Unzips downloaded zip
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
					// Removes the zip after unzip
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
					setTimeout(() => {
						console.info("Finished extracting DepotDownloader binary..")
						console.debug("Starting dotnet process...")
						var finalcommand
						if (osdropdown.options[osdropdown.selectedIndex].text.includes("Gnome")) {
							finalcommand = `gnome-terminal -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Windows")) {
							finalcommand = `cmd.exe  /k dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("macOS")) {
							//TODO: something like open -a Terminal.app zsh -c "
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Konsole")) {
							// chad konsole
							finalcommand = `konsole --hold -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Xfce")) {
							finalcommand = `xfce4-terminal -H -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Terminator")) {
							finalcommand = `terminator -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Print command")) {
							console.log(`\COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL OF CHOICE:\n\ndotnet ${__dirname}/depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`)
							finalcommand = "ls > /dev/null"
						}

						exec(finalcommand, (err, stdout, stderr) => {
							if (err) {
								console.error(err)

							}
						})
					}, 400)
				} else if (os.platform().includes("macos")) {
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
					// Unzips downloaded zip
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
					// Removes the zip after unzip
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
					setTimeout(() => {
						console.info("Finished extracting DepotDownloader binary..")
						console.debug("Starting dotnet process...")
						var finalcommand
						if (osdropdown.options[osdropdown.selectedIndex].text.includes("Gnome")) {
							finalcommand = `gnome-terminal -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Windows")) {
							finalcommand = `cmd.exe  /k dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("macOS")) {
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Konsole")) {
							// chad konsole
							finalcommand = `konsole --hold -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Xfce")) {
							finalcommand = `xfce4-terminal -H -e "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16"`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Terminator")) {
							finalcommand = `terminator -e 'bash -c "dotnet ./depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16";bash'`
						} else if (osdropdown.options[osdropdown.selectedIndex].text.includes("Print command")) {
							console.log(`\COPY-PASTE THE FOLLOWING INTO YOUR TERMINAL OF CHOICE:\n\ndotnet ${__dirname}/depotdownloader/DepotDownloader.dll -username ${username} -password ${password} -app ${appid} -depot ${depotid} -manifest ${manifestid} -dir ./games/${appid}/ -max-servers 50 -max-downloads 16`)
							finalcommand = "ls > /dev/null"
						}

						exec(finalcommand, (err, stdout, stderr) => {
							if (err) {
								console.error(err)

							}
						})
					}, 400)
				}


			})
		}
	})
}
