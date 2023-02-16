window.addEventListener('DOMContentLoaded', () => {
  // Change page title
  document.title = 'BingGPT'
  // Change style
  // Body
  const body = document.getElementById('bpage')
  if (body) {
    body.style.cssText = 'width: 100%; max-width: 100%; overflow: hidden'
  }
  
  const content = document.getElementById('b_content')
  if (content) {
    // Welcome page
    const signInLink = document.getElementsByClassName('signIn')[0]
    if (signInLink) {
      signInLink.setAttribute('target', '_self')
    }
    const previewBanner = document.getElementById('underside-sydneypro-module')
    if (previewBanner) {
      const titleBar = document.createElement('div')
      titleBar.style.cssText =
        'height: 44px; width: 100%; -webkit-user-select: none; -webkit-app-region: drag'
      content.parentNode.insertBefore(titleBar, content)
    }
    // Header of main page
    const headerWrapper = document.getElementsByClassName('wrapper-unfixed')[0]
    const tabWrapper = document.getElementsByClassName('uds-hdr-wrapper')[0]
    const tab = document.getElementsByClassName('uds_tab_hdr')[0]
    if (headerWrapper) {
      headerWrapper.style.cssText = 'height: 64px'
    }
    if (tabWrapper) {
      tabWrapper.style.cssText =
        'height: 64px; display: flex; justify-content: center; align-items: end; -webkit-user-select: none; -webkit-app-region: drag'
    }
    if (tab) {
      tab.style.cssText = '-webkit-app-region: none'
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
