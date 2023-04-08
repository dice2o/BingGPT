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
const Store = require('electron-store')
const path = require('path')
const fs = require('fs')

if (require('electron-squirrel-startup')) app.quit()

const configSchema = {
  theme: {
    enum: ['system', 'light', 'dark'],
    default: 'system',
  },
  fontSize: {
    enum: [14, 16, 18, 20],
    default: 14,
  },
  alwaysOnTop: {
    type: 'boolean',
    default: false,
  },
}
const config = new Store({ schema: configSchema, clearInvalidConfig: true })

const createWindow = () => {
  // Get theme settings
  const theme = config.get('theme')
  const isDarkMode =
    theme === 'system'
      ? nativeTheme.shouldUseDarkColors
      : theme === 'dark'
      ? true
      : false
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
  // Get always on top settings
  const alwaysOnTop = config.get('alwaysOnTop')
  mainWindow.setAlwaysOnTop(alwaysOnTop)
  // Get language
  const locale = app.getLocale() || 'en-US'
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
        submenu: [
          {
            label: 'Markdown',
            click() {
              mainWindow.webContents.send('export', 'md', isDarkMode)
            },
          },
          {
            label: 'PNG',
            click() {
              mainWindow.webContents.send('export', 'png', isDarkMode)
            },
          },
          {
            label: 'PDF',
            click() {
              mainWindow.webContents.send('export', 'pdf', isDarkMode)
            },
          },
        ],
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
        click: () => alwaysOnTopHandler(),
      },
      {
        type: 'separator',
        visible: parameters.selectionText.trim().length === 0,
      },
      {
        label: 'Appearance',
        visible: parameters.selectionText.trim().length === 0,
        submenu: [
          {
            label: 'Theme',
            submenu: [
              {
                label: 'System',
                type: 'radio',
                checked: config.get('theme') === 'system',
                click() {
                  themeHandler('system')
                },
              },
              {
                label: 'Light',
                type: 'radio',
                checked: config.get('theme') === 'light',
                click() {
                  themeHandler('light')
                },
              },
              {
                label: 'Dark',
                type: 'radio',
                checked: config.get('theme') === 'dark',
                click() {
                  themeHandler('dark')
                },
              },
            ],
          },
          {
            label: 'Font Size',
            submenu: [
              {
                label: 'Default',
                type: 'radio',
                checked: config.get('fontSize') === 14,
                click() {
                  fontSizeHandler(14)
                },
              },
              {
                label: 'Medium',
                type: 'radio',
                checked: config.get('fontSize') === 16,
                click() {
                  fontSizeHandler(16)
                },
              },
              {
                label: 'Large',
                type: 'radio',
                checked: config.get('fontSize') === 18,
                click() {
                  fontSizeHandler(18)
                },
              },
              {
                label: 'Extra Large',
                type: 'radio',
                checked: config.get('fontSize') === 20,
                click() {
                  fontSizeHandler(20)
                },
              },
            ],
          },
        ],
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
        label: 'BingGPT v0.3.3',
        visible: parameters.selectionText.trim().length === 0,
        click: () => {
          shell.openExternal('https://github.com/dice2o/BingGPT/releases')
        },
      },
    ],
  })
  // Load Bing
  const bingUrl = `https://edgeservices.bing.com/edgediscover/query?&${
    isDarkMode ? 'dark' : 'light'
  }schemeovr=1&FORM=SHORUN&udscs=1&udsnav=1&setlang=${locale}&features=udssydinternal&clientscopes=windowheader,coauthor,chat,&udsframed=1`
  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.0.0'
  mainWindow.loadURL(bingUrl)
  // Open links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  // Login
  mainWindow.webContents.on('will-redirect', (event, url) => {
    if (
      url.indexOf('https://edgeservices.bing.com/edgesvc/urlredirect') !== -1
    ) {
      event.preventDefault()
      // Get cookies
      mainWindow
        .loadURL(bingUrl.replace('edgediscover/query', 'edgesvc/shell'))
        .then(() => {
          setTimeout(() => {
            mainWindow.loadURL(bingUrl)
          }, 3000)
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
  // Modify headers
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      details.requestHeaders['User-Agent'] = userAgent
      details.requestHeaders['X-Forwarded-For'] = '1.1.1.1'
      callback({ requestHeaders: details.requestHeaders, cancel: false })
    }
  )
  // Always on top
  const alwaysOnTopHandler = () => {
    config.set('alwaysOnTop', !mainWindow.isAlwaysOnTop())
    mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop())
  }
  // Theme
  const themeHandler = (newTheme) => {
    config.set('theme', newTheme)
    dialog
      .showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        message: 'Theme Saved',
        detail: 'Do you want to reload BingGPT now?',
      })
      .then((result) => {
        if (result.response === 0) {
          mainWindow.close()
          createWindow()
        }
      })
  }
  // Font size
  const fontSizeHandler = (newSize) => {
    config.set('fontSize', newSize)
    mainWindow.webContents.send('set-font-size', newSize)
  }
  // Shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    const cmdKey = process.platform === 'darwin' ? input.meta : input.control
    if (cmdKey) {
      switch (input.code) {
        case 'KeyN':
          mainWindow.webContents.send('new-topic')
          event.preventDefault()
          break
        case 'KeyR':
          mainWindow.reload()
          event.preventDefault()
          break
        case 'KeyT':
          alwaysOnTopHandler()
          event.preventDefault()
          break
        case 'KeyI':
          mainWindow.webContents.send('focus-on-textarea')
          event.preventDefault()
          break
        case 'KeyS':
          mainWindow.webContents.send('stop-responding')
          event.preventDefault()
          break
        case 'Equal':
          if (
            configSchema.fontSize.enum.indexOf(config.get('fontSize') + 2) !==
            -1
          ) {
            fontSizeHandler(config.get('fontSize') + 2)
            event.preventDefault()
          }
          break
        case 'Minus':
          if (
            configSchema.fontSize.enum.indexOf(config.get('fontSize') - 2) !==
            -1
          ) {
            fontSizeHandler(config.get('fontSize') - 2)
            event.preventDefault()
          }
          break
        case 'Comma':
          mainWindow.webContents.send('switch-tone', 'left')
          event.preventDefault()
          break
        case 'Period':
          mainWindow.webContents.send('switch-tone', 'right')
          event.preventDefault()
          break
        default:
          if (input.code.indexOf('Digit') === 0) {
            const id = input.code.split('Digit')[1]
            mainWindow.webContents.send('quick-reply', Number(id))
            event.preventDefault()
          }
      }
    }
  })
}

app.whenReady().then(() => {
  // Save to file
  ipcMain.on('export-data', (event, format, dataURL) => {
    if (format) {
      const fileName = `BingGPT-${Math.floor(Date.now() / 1000)}.${format}`
      let filters
      switch (format) {
        case 'md':
          filters = [{ name: 'Markdown', extensions: ['md'] }]
          break
        case 'png':
          filters = [{ name: 'Image', extensions: ['png'] }]
          break
        case 'pdf':
          filters = [{ name: 'PDF', extensions: ['pdf'] }]
      }
      dialog
        .showSaveDialog(BrowserWindow.getAllWindows()[0], {
          title: 'Export',
          defaultPath: fileName,
          filters: filters,
        })
        .then((result) => {
          if (!result.canceled) {
            const filePath = result.filePath
            const data = dataURL.replace(/^data:\S+;base64,/, '')
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
    }
  })
  // Get font size settings
  ipcMain.on('get-font-size', () => {
    const fontSize = config.get('fontSize')
    if (fontSize !== 14) {
      setTimeout(() => {
        BrowserWindow.getAllWindows()[0].webContents.send(
          'set-font-size',
          fontSize
        )
      }, 1000)
    }
  })
  // Error message
  ipcMain.on('error', (event, detail) => {
    dialog.showMessageBox({
      type: 'info',
      message: 'Error',
      detail: detail,
    })
  })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
