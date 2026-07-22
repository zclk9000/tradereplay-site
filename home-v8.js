const heroShowcase = document.querySelector('[data-hero-showcase]')
const heroFrames = Array.from(document.querySelectorAll('[data-hero-frame]'))
const heroShots = Array.from(document.querySelectorAll('[data-hero-shot]'))
const heroLabel = document.querySelector('[data-hero-label]')

const heroFrameCopy = {
  replay: {
    en: 'Historical replay workspace',
    zh: '历史复盘工作台'
  },
  system: {
    en: 'Trading system workspace',
    zh: '交易系统工作台'
  },
  evidence: {
    en: 'Statistics and diagnosis',
    zh: '统计与交易诊断'
  }
}

let activeHeroFrame = 'replay'
let heroFrameTimer = 0
let heroShowcasePaused = false

function getPageLanguage() {
  return document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

function updateHeroLabel() {
  if (!heroLabel) return
  const language = getPageLanguage()
  heroLabel.textContent = heroFrameCopy[activeHeroFrame]?.[language] || heroFrameCopy.replay[language]
}

function activateHeroFrame(frame) {
  if (!heroFrameCopy[frame]) return
  activeHeroFrame = frame

  heroFrames.forEach((button) => {
    const selected = button.dataset.heroFrame === frame
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-selected', String(selected))
    button.tabIndex = selected ? 0 : -1
  })

  heroShots.forEach((shot) => {
    const selected = shot.dataset.heroShot === frame
    shot.classList.toggle('is-active', selected)
    shot.setAttribute('aria-hidden', String(!selected))
  })

  updateHeroLabel()
}

function advanceHeroFrame() {
  if (heroShowcasePaused || heroFrames.length < 2) return
  const currentIndex = heroFrames.findIndex((button) => button.dataset.heroFrame === activeHeroFrame)
  const nextIndex = (currentIndex + 1) % heroFrames.length
  activateHeroFrame(heroFrames[nextIndex].dataset.heroFrame)
}

function startHeroTimer() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || heroFrames.length < 2) return
  window.clearInterval(heroFrameTimer)
  heroFrameTimer = window.setInterval(advanceHeroFrame, 5800)
}

heroFrames.forEach((button, index) => {
  button.addEventListener('click', () => {
    activateHeroFrame(button.dataset.heroFrame)
    startHeroTimer()
  })

  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + heroFrames.length) % heroFrames.length
    const nextButton = heroFrames[nextIndex]
    activateHeroFrame(nextButton.dataset.heroFrame)
    nextButton.focus()
    startHeroTimer()
  })
})

if (heroShowcase) {
  heroShowcase.addEventListener('pointerenter', () => {
    heroShowcasePaused = true
  })

  heroShowcase.addEventListener('pointerleave', () => {
    heroShowcasePaused = false
  })

  heroShowcase.addEventListener('focusin', () => {
    heroShowcasePaused = true
  })

  heroShowcase.addEventListener('focusout', () => {
    heroShowcasePaused = false
  })
}

const languageToggleV8 = document.querySelector('[data-lang-toggle]')
if (languageToggleV8) languageToggleV8.addEventListener('click', updateHeroLabel)

const v8RevealTargets = Array.from(document.querySelectorAll('.capability-index article, .landing-proof article'))
if (v8RevealTargets.length) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    v8RevealTargets.forEach((target) => target.classList.add('is-visible'))
  } else {
    const v8RevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    v8RevealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`
      v8RevealObserver.observe(target)
    })
  }
}

activateHeroFrame(activeHeroFrame)
startHeroTimer()
