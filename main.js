const {app, BrowserWindow, dialog, ipcMain} = require("electron")
const {platformpath} = require("./utils")
require("v8-compile-cache")

let mainWindow
const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		autoHideMenuBar: true,
		resizable: false,
		width: 445,
		height: 650,
		useContentSize: true,
		maximizable: false,
		webPreferences: {
			nodeIntegration: true, contextIsolation: false
		}
	})

	// and load the index.html of the app.
	mainWindow.loadFile("index.html")

	// @formatter:off
	// Open the DevTools for debugging, only if not in production. This is removed for release by the build script (package.sh) because it's unreliable.
	// disable formatting so the line always stays the same so sed can find it
	// eslint-disable-next-line no-undef
	if (!app.isPackaged) mainWindow.webContents.openDevTools({mode: "detach"})
	// @formatter:on
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow()

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

})

// If the page is fully loaded in, send a sign.
app.on("web-contents-created", (event, contents) => {
	contents.on("dom-ready", () => {
		contents.send("ready")
		contents.send("version", app.getVersion()) // send the version to the renderer
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit()
})


ipcMain.on("selectpath", (event) => {
	dialog.showOpenDialog(mainWindow, {
		// Specifying the Directory Selector Property
		properties: ["openDirectory"],
		title: "Select the path where the game will be downloaded",
		defaultPath: platformpath(),
		buttonLabel: "Select"
	}).then(file => {
		//console.debug("Has path selection succeeded: " + ((file.canceled) ? "NO" : "YES; see below")) --- doesn't log to the dev console TODO
		if (!file.canceled) {
			const filepath = file.filePaths[0].toString()
			// console.debug("Path selected is " + filepath)											--- same thing
			event.reply("file", filepath)
		}
	}).catch(err => {
		console.log(err)
	})
})
