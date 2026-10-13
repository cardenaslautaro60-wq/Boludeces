// Ventana de escritorio que abre el juego (el mismo HTML que la versión web)
const { app, BrowserWindow } = require('electron');
const path = require('path');

function crearVentana() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'GTA San Jorge',
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: { contextIsolation: true },
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(crearVentana);
app.on('window-all-closed', () => app.quit());
