const { ipcRenderer } = require('electron')
const html2canvas = require('html2canvas')

window.addEventListener('DOMContentLoaded', () => {
  // Change page title
  document.title = 'BingGPT'
  // Body
  const body = document.body
  if (body) {
    body.style.cssText = 'width: 100%; max-width: 100%; overflow: hidden'
    // Draggable area
    const titleBar = document.createElement('div')
    titleBar.id = 'titleBar'
    titleBar.style.cssText =
      'position: fixed; top: 0px; height: 32px; width: 100%; -webkit-user-select: none; -webkit-app-region: drag; z-index: 50'
    body.insertBefore(titleBar, body.firstChild)
  }
  // Content
  const content = document.getElementById('b_content')
  if (content) {
    // Welcome page
    const signInLink = document.getElementsByClassName('signIn')[0]
    const joinLink = document.getElementsByClassName('joinWaitList')[0]
    const previewBanner = document.getElementById('underside-sydneypro-module')
    const previewCloseBtn = document.getElementById(
      'underside-sydneypromotion-close'
    )
    const forYouContent = document.getElementById('uns_section_standard')
    const discoverContent = document.getElementById('uns_section_fixedbottom')
    if (signInLink) {
      signInLink.setAttribute('target', '_self')
      if (joinLink) {
        joinLink.setAttribute('target', '_self')
      }
    }
    if (previewBanner) {
      previewBanner.style.cssText = 'margin-top: 44px'
      if (previewCloseBtn) {
        previewCloseBtn.style.cssText = 'display: none'
      }
    }
    if (forYouContent) {
      forYouContent.style.cssText = 'display: none'
    }
    if (discoverContent) {
      discoverContent.style.cssText = 'display: none'
    }
    // Header of main page
    const headerWrapper = document.getElementsByClassName('wrapper-unfixed')[0]
    const tabWrapper = document.getElementsByClassName('uds-hdr-wrapper')[0]
    const tabs = document.getElementsByClassName('uds_tab_hdr')[0]
    const insightsTab = document.getElementById('insights')
    if (headerWrapper) {
      headerWrapper.style.cssText = 'height: 64px'
    }
    if (tabWrapper) {
      tabWrapper.style.cssText =
        'height: 64px; display: flex; justify-content: center; align-items: end; -webkit-user-select: none'
    }
    if (tabs) {
      tabs.style.cssText = 'padding-left: 40px'
    }
    if (insightsTab) {
      insightsTab.style.cssText = 'display: none'
    }
    // Error
    if (!previewBanner && !tabs) {
      const errorInfo = document.createElement('p')
      errorInfo.textContent = 'Not Available'
      errorInfo.style.cssText =
        'padding: 64px 32px; text-align: center; font-size: 20px; font-weight: 600; line-height: 26px;'
      content.insertBefore(errorInfo, content.firstChild)
    }
  }
  // Chat area of main page
  const results = document.getElementById('b_results')
  if (results) {
    const chatWrapper = document.getElementsByClassName('uds_sydney_wrapper')[0]
    if (chatWrapper) {
      chatWrapper.style.cssText = 'margin-top: -76px'
    }
  }
  // Compose page
  const composeWrapper = document.getElementsByClassName(
    'uds_coauthor_wrapper'
  )[0]
  const composeMain = document.getElementsByClassName('main')[0]
  const insertBtn = document.getElementById('insert_button')
  const previewText = document.getElementById('preview_text')
  const previewOptions = document.getElementsByClassName('preview-options')[0]
  if (composeWrapper) {
    composeWrapper.style.cssText = 'margin-top: -64px'
  }
  if (composeMain) {
    composeMain.style.cssText =
      'height: calc(100% - 64px); margin-top: 64px; padding: 20px 10px'
  }
  if (insertBtn) {
    insertBtn.style.cssText = 'display: none'
  }
  if (previewText) {
    previewText.style.cssText = 'height: 100%'
  }
  if (previewOptions) {
    previewOptions.style.cssText = 'bottom: 1px'
  }
})

// Convert conversation to image
ipcRenderer.on('export', (event, isDarkMode) => {
  try {
    const chatMain = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-conversation-main')
      .shadowRoot.getElementById('cib-chat-main')
    html2canvas(chatMain, {
      backgroundColor: isDarkMode ? '#2b2b2b' : '#f3f3f3',
      logging: false,
      useCORS: true,
      allowTaint: true,
      ignoreElements: (element) => {
        if (
          element.classList.contains('intro') ||
          element.tagName === 'IFRAME'
        ) {
          return true
        }
      },
      onclone: (doc) => {
        const bodyWidth = doc.body.clientWidth
        const paddingX = bodyWidth > 767 ? '32px' : '16px'
        const paddingBottom = bodyWidth > 767 ? '48px' : '36px'
        const paddingTop =
          chatMain.getElementsByTagName('cib-chat-turn')[0].offsetHeight === 0
            ? '0'
            : bodyWidth > 767
            ? '24px'
            : '18px'
        doc.getElementById(
          'cib-chat-main'
        ).style.cssText = `padding: ${paddingTop} ${paddingX} ${paddingBottom} ${paddingX}`
      },
    }).then(function (canvas) {
      const dataURL = canvas.toDataURL('image/png')
      ipcRenderer.send('export-data', dataURL)
      // Rerender the draggable area
      const titleBar = document.getElementById('titleBar')
      if (titleBar) {
        titleBar.style.top === '1px'
          ? (titleBar.style.top = '0px')
          : (titleBar.style.top = '1px')
      }
    })
  } catch {
    ipcRenderer.send('export-data', '')
  }
})
