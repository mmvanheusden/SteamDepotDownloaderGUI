"use strict"


function submitDotnet() {
	const electron = require("electron")
	const os = require("os")
	document.getElementById("download").disabled = false
	document.getElementById("alert").hidden = true
	document.getElementById("alertbtn").hidden = true
	if (os.platform().includes("win")) {
		console.log("Opened .NET download page for " + os.platform().charAt(0).toUpperCase() + os.platform().slice(1))
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-windows-x64-installer")
	}
	if (os.platform().includes("linux")) {
		console.log("Opened .NET download page for " + os.platform().charAt(0).toUpperCase() + os.platform().slice(1))
		electron.shell.openExternal("https://docs.microsoft.com/en-us/dotnet/core/install/linux")
	}
	if (os.platform().includes("darwin")) {
		console.log("Opened .NET download page for" + os.platform())
		//TODO: apple silicon(ARM64) URL
		electron.shell.openExternal("https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/sdk-6.0.301-macos-x64-installer")
	}

}

function submitForm() {
	const os = require("os")
	const fs = require("fs")
	const path = require("path").dirname(__filename)
	const which = require("which")
	const {http, https} = require("follow-redirects")
	const spawn = require("child_process").spawn
	let username = document.forms["theform"]["username"].value
	let password = document.forms["theform"]["password"].value
	let appid = document.forms["theform"]["appid"].value
	let depotid = document.forms["theform"]["depotid"].value
	let manifestid = document.forms["theform"]["manifestid"].value
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
		console.log("Using Windows!")
		//TODO: windows compat lol
	}
	if (os.platform().includes("linux")) {
		console.log("Using Linux")
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
				try {
					// first check if directory already exists
					if (!fs.existsSync("./depotdownloader")) {
						fs.mkdirSync("./depotdownloader")
						console.log("Directory is created.")
					} else {
						console.log("Directory already exists.")
					}
				} catch (err) {
					console.log(err)
				}
				const file = fs.createWriteStream("./depotdownloader/depotdownloader.zip")
				const request = https.get("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip", function (response) {
					response.pipe(file)
					console.log("Downloaded DepotDownloader binary zip")
				})
				file.on("finish", function () {
					file.close()
					const {exec} = require("child_process")
					console.log("Extracting DepotDownloader binary")

					// The following code has delays in between because async io operations won't work well
					// Cleans up old files (but not the downloaded zip)
					setTimeout(() => {
						exec("file ./depotdownloader/* | grep -vi zip | cut -d: -f1 | tr '\\n' '\\0' | xargs -0 -r rm", (err, stdout, stderr) => {
							if (err) {
								console.error(err)
								return
							}
							if (stderr !== "") {
								console.log(stderr)
							}
						})
					}, 500)
					// Unzips downloaded zip
					setTimeout(() => {
						exec("unzip -o ./depotdownloader/depotdownloader.zip -d ./depotdownloader/", (err, stdout, stderr) => {
							if (err) {
								console.error(err)
								return
							}
							if (stderr !== "") {
								console.log(stderr)
							}
						})
					}, 800)
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
					}, 1200)
				})
				file.on("finish", function () {
					console.log("this should happen")
				})
			}
		})

	}
}
