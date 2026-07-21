const pageCopy = {
  home: {
    en: {
      title: 'TradeReplay — Build a trading system you can trust',
      description: 'Replay historical markets, test your rules, review real trades, and turn every mistake into evidence. TradeReplay is a local-first desktop practice system for Mac and Windows.'
    },
    zh: {
      title: 'TradeReplay — 练的不是行情，是你的交易系统',
      description: '写清交易规则，在历史行情里反复验证，再用 MT4、MT5 与期货月报检查执行。TradeReplay 支持逐根复盘、交易系统、真实账单和确定性诊断。'
    }
  },
  screenshots: {
    en: {
      title: 'Product screens — TradeReplay',
      description: 'See the real TradeReplay v1.50.20 system, replay, and diagnostic workspaces.'
    },
    zh: {
      title: '产品界面 — TradeReplay',
      description: '查看 TradeReplay v1.50.20 的交易系统、逐根复盘与统计诊断真实界面。'
    }
  }
}

const menuButton = document.querySelector('[data-menu-toggle]')
const menu = document.querySelector('[data-menu]')
const languageButton = document.querySelector('[data-lang-toggle]')
const pageName = document.body.dataset.page || 'home'

let currentLanguage = 'en'

try {
  const savedLanguage = window.localStorage.getItem('tradereplay-language')
  if (savedLanguage === 'zh' || savedLanguage === 'en') currentLanguage = savedLanguage
} catch {
  currentLanguage = 'en'
}

function closeMenu() {
  if (!menuButton || !menu) return
  menuButton.setAttribute('aria-expanded', 'false')
  menu.dataset.open = 'false'
  document.body.classList.remove('menu-open')
}

function setLanguage(language) {
  currentLanguage = language === 'zh' ? 'zh' : 'en'
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en'

  document.querySelectorAll('[data-en][data-zh]').forEach((node) => {
    node.textContent = node.dataset[currentLanguage]
  })

  document.querySelectorAll('[data-aria-en][data-aria-zh]').forEach((node) => {
    node.setAttribute('aria-label', node.dataset[`aria${currentLanguage === 'zh' ? 'Zh' : 'En'}`])
  })

  document.querySelectorAll('[data-alt-en][data-alt-zh]').forEach((node) => {
    node.alt = node.dataset[`alt${currentLanguage === 'zh' ? 'Zh' : 'En'}`]
  })

  document.querySelectorAll('[data-href-en][data-href-zh]').forEach((node) => {
    node.href = node.dataset[`href${currentLanguage === 'zh' ? 'Zh' : 'En'}`]
    if (currentLanguage === 'zh' && node.href.startsWith('http')) {
      node.target = '_blank'
      node.rel = 'noopener'
    } else {
      node.removeAttribute('target')
      node.removeAttribute('rel')
    }
  })

  if (languageButton) {
    languageButton.textContent = currentLanguage === 'en' ? '中文' : 'EN'
    languageButton.setAttribute('aria-label', currentLanguage === 'en' ? '切换到中文' : 'Switch to English')
  }

  const copy = pageCopy[pageName]?.[currentLanguage]
  if (copy) {
    document.title = copy.title
    const description = document.querySelector('meta[name="description"]')
    if (description) description.content = copy.description
  }

  try {
    window.localStorage.setItem('tradereplay-language', currentLanguage)
  } catch {
    // The page remains fully usable when storage is unavailable.
  }
}

if (languageButton) {
  languageButton.addEventListener('click', () => {
    setLanguage(currentLanguage === 'en' ? 'zh' : 'en')
    closeMenu()
  })
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const nextOpen = menuButton.getAttribute('aria-expanded') !== 'true'
    menuButton.setAttribute('aria-expanded', String(nextOpen))
    menu.dataset.open = String(nextOpen)
    document.body.classList.toggle('menu-open', nextOpen)
  })

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu()
  })
}

const storyButtons = Array.from(document.querySelectorAll('[data-story]'))
const storyPanels = Array.from(document.querySelectorAll('[data-story-panel]'))

function activateStory(story) {
  storyButtons.forEach((button) => {
    const selected = button.dataset.story === story
    button.setAttribute('aria-selected', String(selected))
    button.tabIndex = selected ? 0 : -1
  })

  storyPanels.forEach((panel) => {
    const selected = panel.dataset.storyPanel === story
    panel.hidden = !selected
    panel.classList.toggle('is-active', selected)
  })
}

storyButtons.forEach((button, index) => {
  button.addEventListener('click', () => activateStory(button.dataset.story))
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + storyButtons.length) % storyButtons.length
    const nextButton = storyButtons[nextIndex]
    activateStory(nextButton.dataset.story)
    nextButton.focus()
  })
})

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

if (storyButtons.length) activateStory(storyButtons[0].dataset.story)
setLanguage(currentLanguage)
