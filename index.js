const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  // Build Menu from template
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  
  // Use the menu
  Menu.setApplicationMenu(mainMenu);
});


// Add Window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
}


// Menu Template
const menuTemplate = [
  // Each object represents an individual menu. In this case there will only be one menu.
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Quit',
        // Dynamical set key commands based on Mac or Windows
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// If the app is runing on Mac OS, we push an extra empty object into the menuTemplate array so menu works as a native mac app should
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}