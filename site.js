const productShots = {
  system: {
    src: 'assets/app-current-system-workspace-dark.png',
    alt: 'TradeReplay 交易系统工作台，展示入场检查、风险规则、出场规则和禁做条件',
    caption: '把入场、风险、出场与禁做条件放进同一套系统。'
  },
  replay: {
    src: 'assets/app-current-replay-dark.png',
    alt: 'TradeReplay 逐根回放图表与下单面板',
    caption: '在过去行情里重做决定，而不是只看一张结果图。'
  },
  diagnosis: {
    src: 'assets/app-current-stats-dark.png',
    alt: 'TradeReplay 交易统计、风险指标与 AI 诊断',
    caption: '先用确定性指标找问题，再把问题变成行动。'
  }
}

const productImage = document.querySelector('[data-product-image]')
const productCaption = document.querySelector('[data-product-caption]')
const shotButtons = Array.from(document.querySelectorAll('[data-shot]'))

shotButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const shot = productShots[button.dataset.shot]
    if (!shot || !productImage || !productCaption) return

    shotButtons.forEach((candidate) => {
      candidate.setAttribute('aria-selected', String(candidate === button))
    })
    productImage.src = shot.src
    productImage.alt = shot.alt
    productCaption.textContent = shot.caption
  })
})

const menuButton = document.querySelector('[data-menu-toggle]')
const menu = document.querySelector('[data-menu]')

function closeMenu() {
  if (!menuButton || !menu) return
  menuButton.setAttribute('aria-expanded', 'false')
  menu.dataset.open = 'false'
  document.body.classList.remove('menu-open')
}

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const nextOpen = menuButton.getAttribute('aria-expanded') !== 'true'
    menuButton.setAttribute('aria-expanded', String(nextOpen))
    menu.dataset.open = String(nextOpen)
    document.body.classList.toggle('menu-open', nextOpen)
  })

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu)
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu()
  })
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})
