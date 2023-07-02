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
      joinLink.setAttribute(
        'href',
        'https://www.bing.com/rewards/authcheck?ru=%2Fmsrewards%2Fapi%2Fv1%2Fenroll%3Fpubl%3DBINGIP%26crea%3DMY00IA%26pn%3Dbingcopilotwaitlist%26partnerId%3DBingRewards%26pred%3Dtrue%26wtc%3Dshoreline/discover%26ru%3Dhttps%253a%252f%252fedgeservices.bing.com%252fedgesvc%252furlredirect%253fscenario%253dwaitlist'
      )
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
    const aboutTab = document.getElementById('about')
    const synopsisTab = document.getElementById('synopsis')
    const siteinfoTab = document.getElementById('siteinfo')
    if (headerWrapper) {
      headerWrapper.style.cssText = 'height: 64px'
    }
    if (tabWrapper) {
      tabWrapper.style.cssText = 'height: 64px; -webkit-user-select: none'
    }
    if (tabs) {
      tabs.style.cssText =
        'height: 64px; padding-top: 0; justify-content: center; align-items: end'
      tabs.firstChild.style.cssText = 'margin-left: 19px'
    }
    if (aboutTab) {
      aboutTab.style.cssText = 'display: none'
    }
    if (synopsisTab) {
      synopsisTab.style.cssText = 'display: none'
    }
    if (siteinfoTab) {
      siteinfoTab.style.cssText = 'display: none'
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
      ipcRenderer.send('init-style')
    }
  }
  // Compose page
  /*const composeWrapper = document.getElementsByClassName(
    'uds_coauthor_wrapper'
  )[0]
  const composeMain = document.getElementsByClassName('sidebar')[0]
  const insertBtn = document.getElementById('insert_button')
  const previewText = document.getElementById('preview_text')
  const previewOptions = document.getElementsByClassName('preview-options')[0]
  if (composeWrapper) {
    composeWrapper.style.cssText = 'margin-top: -64px'
  }
  if (composeMain) {
    composeMain.style.cssText = 'height: calc(100% - 64px); margin-top: 64px'
  }
  if (insertBtn) {
    insertBtn.style.cssText = 'display: none'
  }
  if (previewText) {
    previewText.style.cssText = 'height: 100%'
  }
  if (previewOptions) {
    previewOptions.style.cssText = 'bottom: 1px'
  }*/
})

// New topic
ipcRenderer.on('new-topic', () => {
  try {
    const newTopicBtn = document
      .getElementsByTagName('cib-serp')[0]
      .shadowRoot.getElementById('cib-action-bar-main')
      .shadowRoot.querySelector('.button-compose')
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
      .shadowRoot.querySelector('cib-text-input')
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
      .shadowRoot.querySelector('cib-welcome-container')
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
    const serp = document.querySelector('.cib-serp-main')
    const conversationMain = serp.shadowRoot.getElementById(
      'cib-conversation-main'
    )
    conversationMain.style.cssText =
      serp.style.cssText += `--cib-type-body1-font-size: ${size}px; --cib-type-body1-strong-font-size: ${size}px; --cib-type-body2-font-size: ${size}px; --cib-type-body2-line-height: ${
        size + 6
      }px`
  } catch (err) {
    console.log(err)
  }
})

// Set initial style
ipcRenderer.on('set-initial-style', (event) => {
  try {
    const serp = document.querySelector('.cib-serp-main')
    const conversationMain = serp.shadowRoot.getElementById(
      'cib-conversation-main'
    )
    // Center element
    const scroller = conversationMain.shadowRoot.querySelector('.scroller')
    const actionBarMain = serp.shadowRoot.getElementById('cib-action-bar-main')
    scroller.style.cssText += 'justify-content: center'
    actionBarMain.style.cssText += 'max-width: unset'
  } catch (err) {
    console.log(err)
  }
})

// Replace compose page
ipcRenderer.on('replace-compose-page', (event, isDarkMode) => {
  try {
    const composeModule = document.getElementById('underside-coauthor-module')
    composeModule.innerHTML = `<iframe id="coauthor" name="coauthor" frameborder="0" csp="frame-src 'none'; base-uri 'self'; require-trusted-types-for 'script'" data-bm="4" src="https://edgeservices.bing.com/edgesvc/compose?udsframed=1&amp;form=SHORUN&amp;clientscopes=chat,noheader,coauthor,channeldev,&amp;${
      isDarkMode ? 'dark' : 'light'
    }schemeovr=1" style="width: 100%; height: calc(100% - 64px); position: absolute; overflow: hidden"></iframe>`
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
          element.tagName === 'CIB-WELCOME-CONTAINER' ||
          element.tagName === 'CIB-NOTIFICATION-CONTAINER' ||
          element.getAttribute('type') === 'host'
        ) {
          return true
        }
        if (
          format === 'md' &&
          (element.classList.contains('label') ||
            element.classList.contains('hidden') ||
            element.classList.contains('expand-button') ||
            element.getAttribute('type') === 'meta' ||
            element.tagName === 'CIB-TURN-COUNTER' ||
            element.tagName === 'BUTTON')
        ) {
          return true
        }
      },
      onclone: (doc) => {
        const bodyWidth = doc.body.clientWidth
        const paddingX = bodyWidth > 832 ? '32px' : '16px'
        const paddingBottom = '48px'
        const paddingTop = bodyWidth > 832 ? '24px' : '0px'
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
  turndownService.addRule('learnMore', {
    filter: (node) => {
      return node.classList.contains('learn-more')
    },
    replacement: (content, node) => {
      return node.parentNode.querySelector('a[class="attribution-item"]')
        ? content
        : ''
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
    replacement: (content, node) => {
      return `> **${node.firstElementChild.innerHTML}**${
        node.querySelector('img')
          ? `\n> ![](${node.querySelector('img').getAttribute('src')})`
          : ''
      }`
    },
  })
  turndownService.addRule('latex', {
    filter: (node) => {
      return node.classList.contains('katex-block')
    },
    replacement: (content, node) => {
      return `$$${node.querySelector('annotation').innerHTML.trim()}$$\n`
    },
  })
  turndownService.addRule('inlineLatex', {
    filter: (node) => {
      return node.classList.contains('katex')
    },
    replacement: (content, node) => {
      return `$${node.querySelector('annotation').innerHTML.trim()}$`
    },
  })
  const mdDataURL = Buffer.from(
    turndownService.turndown(element),
    'utf-8'
  ).toString('base64')
  ipcRenderer.send('export-data', 'md', mdDataURL)
}
