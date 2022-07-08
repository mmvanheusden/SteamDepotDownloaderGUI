function submitForm() {
	const dotnet = require("child_process").spawn("dotnet", ["--version"])
	dotnet.on("error", function (err) {
		console.log("dotnet not found in PATH")
	})
	dotnet.on("exit", async function (code) {
		if (code === 0) {
			console.debug("download pre")
			await download("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip")
			console.debug("download post")
			console.debug("unzip pre")
			await unzip("depotdownloader-2.4.6.zip", "depotdownloader")
			console.debug("unzip post")
		}
	})
}

/**
 * Download a file from a url, saving it to the current directory (__dirname)
 * @param url The url to download from
 * @returns {Promise<unknown>} A promise that resolves when the download is finished
 */
function download(url) {
	return new Promise((resolve, reject) => {
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
 *
 * @param file The file to unzip, preferably a .zip file
 * @param target The target directory to unzip to
 * @returns {Promise<unknown>} A promise that resolves when the unzip is complete (or fails)
 */
function unzip(file, target) {
	return new Promise((resolve, reject) => {
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