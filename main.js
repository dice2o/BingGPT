const {
  app,
  shell,
  nativeTheme,
  dialog,
  ipcMain,
  Menu,
  BrowserWindow,
} = require('electron')
const contextMenu = require('electron-context-menu')
const path = require('path')
const fs = require('fs')

if (require('electron-squirrel-startup')) app.quit()

const createWindow = () => {
  // Check color scheme
  const isDarkMode = nativeTheme.shouldUseDarkColors
  // Create window
  const mainWindow = new BrowserWindow({
    title: 'BingGPT',
    backgroundColor: isDarkMode ? '#2b2b2b' : '#f3f3f3',
    icon: 'icon.png',
    width: 601,
    height: 800,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    titleBarOverlay: {
      color: isDarkMode ? '#3b3b3b' : '#ffffff',
      symbolColor: isDarkMode ? '#f3f3f3' : '#2b2b2b',
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
      nodeIntegration: true,
    },
  })
  // Hide main menu (Windows)
  Menu.setApplicationMenu(null)
  // Create context menu
  contextMenu({
    window: mainWindow.webContents,
    showServices: true,
    showSelectAll: false,
    append: (defaultActions, parameters, browserWindow) => [
      {
        label: 'Reload',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          mainWindow.reload()
        },
      },
      {
        label: 'Export',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          mainWindow.webContents.send('export', isDarkMode)
        },
      },
      {
        type: 'separator',
        visible: parameters.selectionText.trim().length === 0,
      },
      {
        label: 'Always on Top',
        type: 'checkbox',
        checked: mainWindow.isAlwaysOnTop() ? true : false,
        visible: parameters.selectionText.trim().length === 0,
        click: () => mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop()),
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
          session
            .clearStorageData({
              storages: ['localstorage', 'cookies'],
            })
            .then(() => {
              mainWindow.reload()
            })
        },
      },
      {
        type: 'separator',
        visible: parameters.selectionText.trim().length === 0,
      },
      {
        label: 'Feedback',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          shell.openExternal('https://github.com/dice2o/BingGPT/issues')
        },
      },
      {
        label: 'BingGPT v0.1.7',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          shell.openExternal('https://github.com/dice2o/BingGPT/releases')
        },
      },
    ],
  })
  // Get language
  const locale = app.getLocale() || 'en-US'
  // Load Bing
  const bingUrl = `https://edgeservices.bing.com/edgediscover/query?&${
    isDarkMode ? 'dark' : 'light'
  }schemeovr=1&FORM=SHORUN&udscs=1&udsnav=1&setlang=${locale}&features=udssydinternal&clientscopes=windowheader,coauthor,chat,&udsframed=1`
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1660.12'
  mainWindow.loadURL(bingUrl, {
    userAgent: userAgent,
  })
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
      mainWindow.loadURL(bingUrl, {
        userAgent: userAgent,
      })
    }
  })
  // Modify Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      let responseHeaders = details.responseHeaders
      const CSP = responseHeaders['content-security-policy']
      if (details.url === bingUrl && CSP) {
        responseHeaders['content-security-policy'] = CSP[0]
          .replace(`require-trusted-types-for 'script'`, '')
          .replace('report-to csp-endpoint', '')
        callback({
          cancel: false,
          responseHeaders,
        })
      } else {
        return callback({ cancel: false })
      }
    }
  )
}

app.whenReady().then(() => {
  // Export conversation as image
  ipcMain.on('export-data', (event, dataURL) => {
    if (dataURL) {
      dialog
        .showSaveDialog(BrowserWindow.getAllWindows()[0], {
          title: 'Export',
          defaultPath: `BingGPT-${Math.floor(Date.now() / 1000)}.png`,
          filters: [{ name: 'Images', extensions: ['png'] }],
        })
        .then((result) => {
          if (!result.canceled) {
            const filePath = result.filePath
            const data = dataURL.replace(/^data:image\/\w+;base64,/, '')
            fs.writeFile(filePath, data, 'base64', (err) => {
              if (err) {
                dialog.showMessageBox({
                  type: 'info',
                  message: 'Error',
                  detail: err,
                })
              }
            })
          }
        })
    } else {
      dialog.showMessageBox({
        type: 'info',
        message: 'Error',
        detail: 'Unable to export conversation',
      })
    }
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
