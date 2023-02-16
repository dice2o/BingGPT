const { app, shell, Menu, BrowserWindow } = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')

if (require('electron-squirrel-startup')) app.quit()

const createWindow = () => {
  // Create window
  const mainWindow = new BrowserWindow({
    title: 'BingGPT',
    backgroundColor: '#f3f3f3',
    icon: 'icon.png',
    width: 601,
    height: 800,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    titleBarOverlay: {
      color: '#3b3b3b',
      symbolColor: '#f3f3f3',
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
    },
  })
  // Hide main menu (Windows)
  Menu.setApplicationMenu(null)
  // Create context menu
  contextMenu({
    showServices: true,
    showSelectAll: false,
    prepend: (defaultActions, parameters, browserWindow) => [
      {
        label: 'Refresh',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          mainWindow.reload()
        },
      },
      {
        type: 'separator',
        visible: parameters.selectionText.trim().length === 0,
      },
      {
        label: 'Reset',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          const session = mainWindow.webContents.session
          session.clearStorageData([]).then(() => {
            mainWindow.reload()
          })
        },
      },
    ],
  })
  // Get language
  const locale = app.getLocale() || 'en-US'
  // Load Bing
  const bingUrl = `https://edgeservices.bing.com/edgediscover/query?&darkschemeovr=1&FORM=SHORUN&udscs=1&udsnav=1&setlang=${locale}&features=udssydinternal&clientscopes=windowheader,coauthor,chat,&udsframed=1`
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1660.12'
  mainWindow.loadURL(bingUrl, { userAgent: userAgent })
  // Open links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  // Check if user is logged in successfully
  mainWindow.webContents.on('will-redirect', (event, url) => {
    if (
      url.indexOf('https://edgeservices.bing.com/edgesvc/urlredirect') !== -1
    ) {
      event.preventDefault()
      mainWindow.loadURL(bingUrl, { userAgent: userAgent })
    }
  })
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
