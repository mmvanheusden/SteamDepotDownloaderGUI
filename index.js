const { app, BrowserWindow } = require('electron')
// TODO: this: https://manu.ninja/simple-electron-gui-wrapper-for-a-command-line-utility/
const createWindow = () => {
    const win = new BrowserWindow({
      autoHideMenuBar: true,
      width: 800,
      height: 600
    })
  
    win.loadFile('index.html')
}
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})