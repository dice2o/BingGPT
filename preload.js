window.addEventListener('DOMContentLoaded', () => {
  // Change page title
  document.title = 'BingGPT'
  // Body
  const body = document.body
  if (body) {
    body.style.cssText = 'width: 100%; max-width: 100%; overflow: hidden'
    // Draggable area
    const titleBar = document.createElement('div')
    titleBar.style.cssText =
      'position: fixed; height: 32px; width: 100%; -webkit-user-select: none; -webkit-app-region: drag; z-index: 50'
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
  const insertBtn = document.getElementById('insert_button')
  const previewText = document.getElementById('preview_text')
  const previewOptions = document.getElementsByClassName('preview-options')[0]
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
