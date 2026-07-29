function getInitialLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get('lang')
  if (queryLanguage === 'zh' || queryLanguage === 'en') return queryLanguage

  try {
    const savedLanguage = window.localStorage.getItem('tradereplay-language')
    if (savedLanguage === 'zh' || savedLanguage === 'en') return savedLanguage
  } catch {
    // Local storage is optional.
  }

  return window.navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

let currentLanguage = getInitialLanguage()

function setLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'zh'
  const isChinese = currentLanguage === 'zh'
  const suffix = isChinese ? 'Zh' : 'En'

  document.documentElement.lang = isChinese ? 'zh-CN' : 'en'

  document.querySelectorAll('[data-lang-block]').forEach((node) => {
    node.hidden = node.dataset.langBlock !== currentLanguage
  })

  document.querySelectorAll('[data-zh][data-en]').forEach((node) => {
    node.textContent = node.dataset[currentLanguage]
  })

  document.querySelectorAll('[data-href-zh][data-href-en]').forEach((node) => {
    node.href = node.dataset[`href${suffix}`]
  })

  document.querySelectorAll('[data-aria-zh][data-aria-en]').forEach((node) => {
    node.setAttribute('aria-label', node.dataset[`aria${suffix}`])
  })

  const body = document.body
  if (body?.dataset[`title${suffix}`]) document.title = body.dataset[`title${suffix}`]
  const description = document.querySelector('meta[name="description"]')
  if (description && body?.dataset[`description${suffix}`]) {
    description.content = body.dataset[`description${suffix}`]
  }

  const languageSwitch = document.querySelector('[data-language-switch]')
  if (languageSwitch) {
    languageSwitch.textContent = isChinese ? 'EN' : '中文'
    languageSwitch.setAttribute('aria-label', isChinese ? 'Switch to English' : '切换到中文')
  }

  try {
    window.localStorage.setItem('tradereplay-language', currentLanguage)
  } catch {
    // The page remains usable without local storage.
  }
}

document.querySelector('[data-language-switch]')?.addEventListener('click', () => {
  setLanguage(currentLanguage === 'zh' ? 'en' : 'zh')
})

setLanguage(currentLanguage)
