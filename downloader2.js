function submitForm() {
	const dotnet = require("child_process").spawn("dotnet", ["--version"])
	dotnet.on("error", function (err) {
		console.log("dotnet not found in PATH")
	})
	dotnet.on("exit", function (code) {
		if (code === 0) {
			console.log("dotnet found in PATH")
			// dotnet is found in the PATH, so we can download the latest version of the app
			download("https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_2.4.6/depotdownloader-2.4.6.zip")
			unzip("depotdownloader-2.4.6.zip")
		}
	})


}


// Downloads a file, following redirects
function download(url) {
	const fs = require("fs")
	const {https} = require("follow-redirects")
	const file = fs.createWriteStream((url.split("/").pop()).toString())
	const request = https.get(url, function (response) {
		response.pipe(file)
	}).on("error", function (err) {
		console.error("Error: " + err.message)
	})
}


function unzip(file) {
	if (process.platform === "win32") {
		const fs = require("fs")
		const {spawn} = require("child_process")
		const unzip = spawn("7z", ["x", file])
		unzip.on("error", function (err) {
			console.error("Error: " + err.message)
		})
		unzip.on("exit", function (code) {
			if (code === 0) {
				console.log("Unzipped " + file)
			}
		})
	} else {
		const fs = require("fs")
		const {spawn} = require("child_process")
		console.log(__dirname)
		const unzip = spawn("unzip -o " + __dirname + "/" + file + " -d " + __dirname + "/depotdownloader/")
		unzip.on("error", function (err) {
			console.error("Error: " + err.message)
		})
		unzip.on("exit", function (code) {
			if (code === 0) {
				console.log("Unzipped " + file)
			}
		})
	}
}
