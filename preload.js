const { ipcRenderer } = require('electron')
const html2canvas = require('html2canvas')
const { jsPDF } = require('jspdf')
const TurndownService = require('turndown')

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
    body.prepend(titleBar)
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
    }
    if (joinLink) {
      joinLink.setAttribute('target', '_self')
    }
    if (previewBanner) {
      previewBanner.style.cssText = 'margin-top: 44px'
    }
    if (previewCloseBtn) {
      previewCloseBtn.style.cssText = 'display: none'
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
  }
  // Chat area of main page
  const results = document.getElementById('b_results')
  if (results) {
    const chatWrapper = document.getElementsByClassName('uds_sydney_wrapper')[0]
    const serp = document.getElementsByTagName('cib-serp')
    if (chatWrapper) {
      chatWrapper.style.cssText = 'margin-top: -76px'
    }
    if (serp) {
      ipcRenderer.send('get-font-size')
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

// New topic
ipcRenderer.on('new-topic', () => {
  try {
    const newTopicBtn = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-action-bar-main')
      .shadowRoot.querySelector('button[class="button-compose"]')
    if (newTopicBtn) {
      newTopicBtn.click()
    }
  } catch (err) {
    console.log(err)
  }
})

// Focus on textarea
ipcRenderer.on('focus-on-textarea', () => {
  try {
    const textarea = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-action-bar-main')
      .shadowRoot.getElementById('searchbox')
    if (textarea) {
      textarea.focus()
    }
  } catch (err) {
    console.log(err)
  }
})

// Stop responding
ipcRenderer.on('stop-responding', () => {
  try {
    const stopBtn = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-action-bar-main')
      .shadowRoot.querySelector('cib-typing-indicator')
      .shadowRoot.getElementById('stop-responding-button')
    if (stopBtn) {
      stopBtn.click()
    }
  } catch (err) {
    console.log(err)
  }
})

// Quick reply
ipcRenderer.on('quick-reply', (event, id) => {
  try {
    const suggestionReplies = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-conversation-main')
      .shadowRoot.querySelector('cib-suggestion-bar')
      .shadowRoot.querySelectorAll('cib-suggestion-item')
    if (suggestionReplies) {
      suggestionReplies[id - 1].shadowRoot.querySelector('button').click()
    }
  } catch (err) {
    console.log(err)
  }
})

// Switch tone
ipcRenderer.on('switch-tone', (event, direction) => {
  try {
    const toneOptions = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-conversation-main')
      .shadowRoot.querySelector('cib-tone-selector')
      .shadowRoot.getElementById('tone-options')
    if (toneOptions) {
      const toneBtns = toneOptions.querySelectorAll('button')
      const selectedBtn = toneOptions.querySelector('button[selected]')
      let index = Array.from(toneBtns).indexOf(selectedBtn)
      switch (direction) {
        case 'right':
          if (index === toneBtns.length - 1) {
            index = 0
          } else {
            index++
          }
          break
        case 'left':
          if (index === 0) {
            index = toneBtns.length - 1
          } else {
            index--
          }
      }
      toneBtns[index].click()
    }
  } catch (err) {
    console.log(err)
  }
})

// Set font size
ipcRenderer.on('set-font-size', (event, size) => {
  try {
    const serp = document.getElementsByTagName('cib-serp')
    if (serp) {
      const conversationMain = document
        .getElementsByTagName('cib-serp')[0]
        .shadowRoot.getElementById('cib-conversation-main')
      conversationMain.style.cssText += `--cib-type-body1-font-size: ${size}px; --cib-type-body1-strong-font-size: ${size}px; --cib-type-body2-font-size: ${size}px; --cib-type-body2-line-height: ${
        size + 6
      }px`
      serp[0].style.cssText += `--cib-type-body2-font-size: ${
        size > 15 ? size + 2 : 16
      }px; --cib-type-body2-line-height: ${size > 15 ? size + 8 : 22}px`
    }
  } catch (err) {
    console.log(err)
  }
})

// Convert from conversation
ipcRenderer.on('export', (event, format, isDarkMode) => {
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
          element.getAttribute('type') === 'host'
        ) {
          return true
        }
        if (
          format === 'md' &&
          (element.classList.contains('label') ||
            element.classList.contains('hidden') ||
            element.classList.contains('expand-button') ||
            element.getAttribute('type') === 'meta')
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
        // Markdown
        if (format === 'md') {
          markdownHandler(doc.getElementById('cib-chat-main'))
        }
      },
    }).then((canvas) => {
      const pngDataURL = canvas.toDataURL('image/png')
      if (format === 'png') {
        // PNG
        ipcRenderer.send('export-data', 'png', pngDataURL)
      } else if (format === 'pdf') {
        // PDF
        pdfHandler(canvas, pngDataURL)
      }
      // Rerender the draggable area
      const titleBar = document.getElementById('titleBar')
      if (titleBar) {
        titleBar.style.top === '1px'
          ? (titleBar.style.top = '0px')
          : (titleBar.style.top = '1px')
      }
    })
  } catch (err) {
    console.log(err)
    ipcRenderer.send('error', 'Unable to export conversation')
  }
})

const pdfHandler = (canvas, pngDataURL) => {
  const pdfWidth = canvas.width / window.devicePixelRatio
  const pdfHeight = canvas.height / window.devicePixelRatio
  const pdf = new jsPDF(pdfWidth > pdfHeight ? 'landscape' : 'portrait', 'pt', [
    pdfWidth,
    pdfHeight,
  ])
  pdf.addImage(pngDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST')
  const pdfDataURL = pdf.output('dataurlstring')
  ipcRenderer.send('export-data', 'pdf', pdfDataURL)
}

const markdownHandler = (element) => {
  const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
  })
  turndownService.addRule('numberLink', {
    filter: 'sup',
    replacement: (content) => {
      return `<sup>[${content}]</sup>`
    },
  })
  turndownService.addRule('textLink', {
    filter: (node) => {
      return node.classList.contains('tooltip-target')
    },
    replacement: (content) => {
      return content
    },
  })
  turndownService.addRule('footerLink', {
    filter: (node) => {
      return node.classList.contains('attribution-item')
    },
    replacement: (content, node) => {
      return `[${content.replace(/^(\d+)(\\.)/, '[$1]')}](${node.getAttribute(
        'href'
      )} "${node.getAttribute('title').replace(/\"/g, '')}")`
    },
  })
  turndownService.addRule('userMessage', {
    filter: (node) => {
      return node.classList.contains('text-message-content')
    },
    replacement: (content) => {
      return `> **${content}**`
    },
  })
  const mdDataURL = Buffer.from(
    turndownService.turndown(element),
    'utf-8'
  ).toString('base64')
  ipcRenderer.send('export-data', 'md', mdDataURL)
}
