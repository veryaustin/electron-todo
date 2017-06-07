const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  
  // Watch for main window to be closed and quit the app
  mainWindow.on('closed', () => app.quit());

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
  addWindow.loadURL(`file://${__dirname}/add.html`);
  
  // Set addWindow when closed to null so it can be garbage collected. Not necessarily needed in this example as addWindow gets reassigned every time we create a new window
  addWindow.on('closed', () => addWindow = null);
}


// Listen for new added todo
ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

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
        label: 'Clear Todos',
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit',
        // Dynamical set key commands based on Mac or Windows
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
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

// Environment check to display developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools'}
    ]
  });
}