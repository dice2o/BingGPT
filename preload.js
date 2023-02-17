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
    // Header of main page
    const headerWrapper = document.getElementsByClassName('wrapper-unfixed')[0]
    const tabWrapper = document.getElementsByClassName('uds-hdr-wrapper')[0]
    const insightsTab = document.getElementById('insights')
    if (headerWrapper) {
      headerWrapper.style.cssText = 'height: 64px'
    }
    if (tabWrapper) {
      tabWrapper.style.cssText =
        'height: 64px; display: flex; justify-content: center; align-items: end; -webkit-user-select: none'
    }
    if (insightsTab) {
      insightsTab.style.cssText = 'display: none'
    }
    // Welcome page
    const signInLink = document.getElementsByClassName('signIn')[0]
    const previewBanner = document.getElementById('underside-sydneypro-module')
    const previewCloseBtn = document.getElementById(
      'underside-sydneypromotion-close'
    )
    const msgTitle = document.getElementById('b_uns_main_msg')
    const msgContent = document.getElementsByClassName('b_uns_err_msg_cont')[0]
    if (signInLink) {
      signInLink.setAttribute('target', '_self')
    }
    if (previewBanner) {
      previewBanner.style.cssText = 'margin-top: 44px'
      if (previewCloseBtn) {
        previewCloseBtn.style.cssText = 'display: none'
      }
      if (msgTitle && msgContent) {
        msgTitle.style.cssText = 'display: none'
        msgContent.style.cssText = 'display: none'
      }
    } else if (!headerWrapper && msgTitle && msgContent) {
      msgTitle.innerText = 'Not Available'
      msgTitle.style.cssText = 'margin-top: 44px'
      msgContent.innerText =
        'The new Bing is not available in your area\nTry using VPN and restart the app'
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
})
