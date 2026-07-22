const pageCopy = {
  home: {
    en: {
      title: 'TradeReplay — Practice the decision. Prove the system.',
      description: 'Practice decisions in historical markets, define your trading system, import real trades, and improve with evidence. TradeReplay is local-first desktop software for Mac and Windows.'
    },
    zh: {
      title: 'TradeReplay — 练的是决定，验证的是系统',
      description: '在历史行情中练习决定，写清交易系统，导入真实交易，再用证据持续改进。TradeReplay 是面向 Mac 与 Windows 的本地优先桌面软件。'
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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const motionHero = document.querySelector('[data-motion-hero]')
const marketCanvas = document.querySelector('[data-market-field]')
const parallaxStage = document.querySelector('[data-parallax-stage]')
const pageProgress = document.querySelector('[data-page-progress]')

document.body.classList.add('motion-ready')

function setupMarketField() {
  if (!motionHero || !marketCanvas) return
  const context = marketCanvas.getContext('2d')
  if (!context) return

  let width = 0
  let height = 0
  let frame = 0
  let isVisible = true
  const pointer = { x: 0.68, y: 0.42, active: false }

  function resize() {
    const rect = motionHero.getBoundingClientRect()
    const density = Math.min(window.devicePixelRatio || 1, 1.5)
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    marketCanvas.width = Math.round(width * density)
    marketCanvas.height = Math.round(height * density)
    context.setTransform(density, 0, 0, density, 0, 0)
  }

  function gaussian(value, center, spread) {
    const distance = (value - center) / spread
    return Math.exp(-(distance * distance))
  }

  function routeY(x, time) {
    const firstMove = Math.sin(x * 7.8 + time * 0.7) * 0.045
    const microMove = Math.sin(x * 29 - time * 1.2) * 0.014
    const breakOut = x > 0.58 ? Math.min((x - 0.58) * 0.27, 0.09) : 0
    return 0.43 - firstMove - microMove - breakOut
  }

  function draw(timestamp) {
    if (!isVisible) {
      frame = requestAnimationFrame(draw)
      return
    }

    const time = reduceMotion ? 0 : timestamp * 0.00042
    context.clearRect(0, 0, width, height)
    const spacing = width < 760 ? 15 : 13
    const leftFade = width < 760 ? 0.1 : 0.22

    for (let y = spacing / 2; y < height; y += spacing) {
      const ny = y / height
      for (let x = spacing / 2; x < width; x += spacing) {
        const nx = x / width
        const wave = routeY(nx, time)
        const band = gaussian(ny, wave, 0.12 + Math.sin(nx * 5) * 0.025)
        const lowerBand = gaussian(ny, 0.68 + Math.sin(nx * 8 - time) * 0.075, 0.16)
        const focus = gaussian(nx, pointer.x, pointer.active ? 0.19 : 0.28) * gaussian(ny, pointer.y, pointer.active ? 0.24 : 0.35)
        const landscape = Math.max(
          band * (0.38 + gaussian(nx, 0.72, 0.43)),
          lowerBand * gaussian(nx, 0.72, 0.38) * 0.74,
          focus * 0.7
        )
        const edge = Math.min(1, nx / leftFade) * Math.min(1, (1 - nx) / 0.045)
        const strength = landscape * edge
        if (strength < 0.055) continue

        const drift = reduceMotion ? 0 : Math.sin(nx * 13 + ny * 10 + time * 1.7) * 0.75
        const radius = 0.45 + strength * 3.15
        const hue = 198 + nx * 23 + ny * 8
        context.beginPath()
        context.fillStyle = `hsla(${hue}, 67%, ${58 + (1 - strength) * 18}%, ${0.1 + strength * 0.62})`
        context.arc(x + drift, y - drift * 0.45, radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const routeStart = width < 760 ? 0.08 : 0.31
    const routeEnd = 0.92
    const routeSteps = Math.max(34, Math.floor(width / 15))
    for (let index = 0; index <= routeSteps; index += 1) {
      const progress = index / routeSteps
      const nx = routeStart + (routeEnd - routeStart) * progress
      const y = routeY(nx, time) * height
      const x = nx * width
      const movingIndex = reduceMotion ? 0.74 : (time * 0.17) % 1
      const glow = gaussian(progress, movingIndex, 0.035)
      context.beginPath()
      context.fillStyle = glow > 0.15 ? `rgba(29, 78, 174, ${0.62 + glow * 0.32})` : 'rgba(49, 91, 165, 0.58)'
      context.arc(x, y, 2.4 + glow * 2.8, 0, Math.PI * 2)
      context.fill()
    }

    if (!reduceMotion) frame = requestAnimationFrame(draw)
  }

  motionHero.addEventListener('pointermove', (event) => {
    const rect = motionHero.getBoundingClientRect()
    pointer.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    pointer.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
    pointer.active = true

    if (parallaxStage && window.innerWidth > 760) {
      const x = pointer.x - 0.5
      const y = pointer.y - 0.5
      parallaxStage.style.setProperty('--stage-rx', `${(-y * 3.4).toFixed(2)}deg`)
      parallaxStage.style.setProperty('--stage-ry', `${(x * 4.5).toFixed(2)}deg`)
      parallaxStage.style.setProperty('--stage-x', `${(x * 8).toFixed(1)}px`)
      parallaxStage.style.setProperty('--stage-y', `${(y * 7).toFixed(1)}px`)
    }
  }, { passive: true })

  motionHero.addEventListener('pointerleave', () => {
    pointer.active = false
    if (!parallaxStage) return
    parallaxStage.style.setProperty('--stage-rx', '0deg')
    parallaxStage.style.setProperty('--stage-ry', '0deg')
    parallaxStage.style.setProperty('--stage-x', '0px')
    parallaxStage.style.setProperty('--stage-y', '0px')
  })

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting
  })
  visibilityObserver.observe(motionHero)

  resize()
  window.addEventListener('resize', resize, { passive: true })
  draw(0)
}

function setupScrollMotion() {
  let ticking = false

  function updateScrollState() {
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange))
    document.body.style.setProperty('--page-progress', String(progress))
    document.body.classList.toggle('is-scrolled', window.scrollY > 18)
    ticking = false
  }

  function requestScrollUpdate() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updateScrollState)
  }

  if (pageProgress) {
    updateScrollState()
    window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  }

  const revealTargets = document.querySelectorAll([
    '.landing-section-heading',
    '.evidence-feature',
    '.evidence-card',
    '.difference-heading',
    '.difference-grid article',
    '.landing-workflow-intro',
    '.landing-workflow-list li',
    '.landing-plan',
    '.landing-download-grid',
    '.landing-faq-grid'
  ].join(','))

  revealTargets.forEach((target) => target.setAttribute('data-reveal', ''))

  if (reduceMotion) {
    revealTargets.forEach((target) => target.classList.add('is-visible'))
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
    revealTargets.forEach((target) => revealObserver.observe(target))
  }

  const workflowItems = document.querySelectorAll('.landing-workflow-list li')
  if (workflowItems.length) {
    const workflowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-current', entry.isIntersecting))
    }, { rootMargin: '-38% 0px -42% 0px', threshold: 0 })
    workflowItems.forEach((item) => workflowObserver.observe(item))
  }

  document.querySelectorAll('.difference-grid article').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }, { passive: true })
  })
}

function setupStoryScroll() {
  const storySection = document.querySelector('.landing-product')
  if (!storySection || storyButtons.length < 2 || reduceMotion) return

  let activeIndex = 0
  let ticking = false

  function isDesktopStory() {
    return window.innerWidth > 1020
  }

  function updateStoryFromScroll() {
    ticking = false
    if (!isDesktopStory()) return
    const range = Math.max(1, storySection.offsetHeight - window.innerHeight)
    const progress = Math.min(0.999, Math.max(0, (window.scrollY - storySection.offsetTop) / range))
    const nextIndex = Math.min(storyButtons.length - 1, Math.floor(progress * storyButtons.length))
    if (nextIndex === activeIndex) return
    activeIndex = nextIndex
    activateStory(storyButtons[activeIndex].dataset.story)
  }

  function requestStoryUpdate() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updateStoryFromScroll)
  }

  storyButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      activeIndex = index
      if (!isDesktopStory()) return
      const range = Math.max(1, storySection.offsetHeight - window.innerHeight)
      const targetProgress = index / storyButtons.length + 0.04
      window.scrollTo({
        top: storySection.offsetTop + range * targetProgress,
        behavior: 'smooth'
      })
    })
  })

  window.addEventListener('scroll', requestStoryUpdate, { passive: true })
  window.addEventListener('resize', requestStoryUpdate, { passive: true })
  updateStoryFromScroll()
}

setupMarketField()
setupScrollMotion()
setupStoryScroll()

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

if (storyButtons.length) activateStory(storyButtons[0].dataset.story)
setLanguage(currentLanguage)
