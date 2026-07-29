const pageCopy = {
  zh: {
    title: 'TradeReplay — 把盘感练成交易系统',
    description: '把主观判断、结构化条件和公式规则写进同一套系统。让软件处理重复筛选，把时间留给关键判断。'
  },
  en: {
    title: 'TradeReplay — Turn trading instinct into a system.',
    description: 'Combine discretionary judgment, structured conditions and formulas in one system. Let the software handle repetition while you focus on the decisions that matter.'
  }
}

function getPageCopy(language) {
  const languageKey = language === 'zh' ? 'Zh' : 'En'
  return {
    title: document.body?.dataset[`title${languageKey}`] || pageCopy[language].title,
    description: document.body?.dataset[`description${languageKey}`] || pageCopy[language].description
  }
}

const menuButton = document.querySelector('[data-menu-toggle]')
const menu = document.querySelector('[data-menu]')
const header = document.querySelector('[data-header]')
const progressBar = document.querySelector('[data-page-progress]')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const heroDemo = document.querySelector('[data-hero-demo]')
const heroCandleLayer = document.querySelector('[data-hero-candles]')
const heroPriceLine = document.querySelector('[data-hero-price-line]')
const heroStory = document.querySelector('[data-hero-story]')
const heroStoryStage = document.querySelector('[data-hero-story-stage]')
const heroStoryCallouts = Array.from(document.querySelectorAll('[data-hero-story-callout]'))
const heroStoryMedia = window.matchMedia('(min-width: 1180px)')

const heroReplayCandles = [
  [944,1132,1235,1201,1134,1], [958,1166,1228,1195,1200,0], [972,1166,1202,1168,1195,0], [986,1128,1167,1148,1167,0],
  [1000,1113,1164,1123,1149,0], [1014,1017,1152,1090,1126,0], [1028,984,1492,1491,1091,1], [1042,1415,1557,1535,1493,1],
  [1056,1462,1535,1494,1534,0], [1070,1457,1635,1611,1494,1], [1084,1571,1644,1623,1612,1], [1098,1605,1640,1607,1623,0],
  [1112,1589,1624,1608,1606,1], [1126,1522,1624,1532,1607,0], [1140,1490,1533,1502,1532,0], [1154,1484,1523,1496,1501,0],
  [1168,1450,1496,1468,1495,0], [1182,1404,1468,1432,1468,0], [1198,1414,1448,1426,1428,0], [1212,1423,1492,1446,1427,1],
  [1226,1402,1497,1449,1441,1], [1240,1443,1490,1470,1449,1], [1254,1449,1511,1460,1470,0], [1268,1426,1601,1558,1459,1],
  [1282,1496,1583,1497,1558,0], [1296,1485,1523,1497,1499,0], [1310,1412,1517,1417,1498,0], [1324,1371,1436,1390,1419,0],
  [1338,1391,1448,1413,1391,1], [1352,1300,1419,1326,1413,0], [1366,1254,1352,1269,1325,0], [1380,1269,1396,1392,1269,1],
  [1394,1315,1434,1333,1392,0], [1408,1291,1378,1364,1333,1], [1422,1322,1400,1323,1365,0], [1436,1317,1415,1395,1323,1],
  [1450,1374,1437,1434,1395,1], [1466,1401,1467,1467,1435,1], [1480,1378,1514,1391,1467,0], [1494,1346,1414,1393,1389,1],
  [1508,1319,1398,1332,1393,0], [1522,1316,1418,1408,1330,1], [1536,1380,1488,1463,1408,1], [1550,1456,1611,1590,1461,1],
  [1564,1549,1606,1575,1590,0], [1578,1474,1601,1479,1576,0], [1592,1326,1482,1356,1481,0], [1606,1325,1425,1422,1359,1],
  [1620,1366,1468,1453,1422,1], [1634,1435,1505,1485,1454,1], [1648,1457,1509,1502,1486,1], [1662,1489,1550,1499,1503,0],
  [1676,1494,1535,1522,1499,1], [1690,1459,1548,1467,1522,0], [1704,1438,1503,1476,1468,1], [1718,1449,1484,1463,1478,0],
  [1734,1442,1570,1570,1464,1], [1748,1531,1588,1573,1569,1], [1762,1537,1587,1558,1573,0], [1776,1538,1569,1541,1567,0],
  [1790,1530,1545,1543,1540,1], [1804,1518,1552,1533,1544,0], [1818,1501,1553,1534,1535,0], [1832,1485,1576,1518,1536,0],
  [1846,1485,1537,1507,1519,0], [1860,1486,1549,1487,1507,0], [1874,1461,1509,1490,1487,1], [1888,1463,1517,1492,1491,1],
  [1902,1486,1618,1603,1495,1], [1916,1553,1605,1558,1603,0], [1930,1552,1610,1577,1556,1], [1944,1506,1582,1544,1578,0],
  [1958,1512,1561,1531,1542,0], [1972,1510,1541,1536,1530,1], [1986,1511,1548,1526,1533,0], [2002,1502,1545,1515,1527,0],
  [2016,1425,1517,1449,1515,0], [2030,1406,1467,1428,1450,0], [2044,1401,1479,1458,1428,1], [2058,1427,1507,1463,1458,1],
  [2072,1451,1568,1528,1463,1], [2086,1516,1568,1520,1529,0], [2100,1518,1615,1608,1521,1], [2114,1567,1640,1629,1608,1],
  [2128,1608,1695,1646,1631,1], [2142,1575,1644,1606,1644,0], [2156,1535,1605,1571,1605,0], [2170,1503,1583,1573,1571,1],
  [2184,1557,1621,1620,1574,1], [2198,1605,1704,1685,1620,1], [2212,616,1688,702,1688,0], [2226,540,757,541,701,0],
  [2240,454,668,599,542,1]
].map(([x, high, low, open, close, up]) => ({ x, high, low, open, close, up: Boolean(up) }))

function createSvgElement(tagName, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)))
  return element
}

function buildHeroReplayCandles() {
  if (!heroCandleLayer || heroCandleLayer.childElementCount) return

  heroReplayCandles.forEach((candle, index) => {
    const color = candle.up ? '#249888' : '#e93a40'
    const delay = 750 + index * 70
    const group = createSvgElement('g', {
      class: 'hero-demo-candle',
      style: `--bar-delay:${delay}ms`
    })
    const wick = createSvgElement('line', {
      class: 'hero-demo-candle-wick',
      x1: candle.x,
      x2: candle.x,
      y1: candle.high,
      y2: candle.low,
      pathLength: 1,
      stroke: color
    })
    const bodyTop = Math.min(candle.open, candle.close)
    const bodyHeight = Math.max(3, Math.abs(candle.open - candle.close))
    const body = createSvgElement('rect', {
      class: 'hero-demo-candle-body',
      x: candle.x - 5,
      y: bodyTop,
      width: 10,
      height: bodyHeight,
      rx: 0.8,
      fill: color
    })

    group.append(wick, body)
    heroCandleLayer.append(group)
  })
}

buildHeroReplayCandles()

const genericModeCloses = [
  354, 338, 346, 322, 307, 318, 292, 277, 287, 263,
  247, 259, 279, 300, 285, 271, 254, 267, 242, 229,
  238, 218, 202, 211, 225, 198, 183, 193, 176, 165,
  181, 158, 145, 154, 136, 123, 132, 114, 103, 92
]

// Reconstructed from the 4K/60fps manual-check recording. Every four bytes
// store the normalized high, low, open and close of one visible H1 candle.
const checklistReplayPacked = 'vb69vVViXFpaYl1dMF4xXSA2KjGnq6erIzw2JzZDPTY8UFA9SlVMUEZOTExIUUpMSV9MSkRSTkw0V1FOUV9aUVBfVVpOYVNVU2ZlU1tlW2VaZmZbaHJpbmmDeml5fXx6eoeDg4SSjYR7onyNdIZ4fHF7cXhvcm9xWm1abVZkYFpga2tgXmtga1ViVWFSVlJVUFpaUlNfV1pNZWBXX2VkYGdwb2dudnZvcn53e2p3a3dqdG9rYmhjaHaahnZyh3qGbXpvem12bm9tdHNubXhtc2JqY2hjamVjX2dlZHSEg3SDkZCDiKOPkIuTjo+KjoqOd3h3eImRj4p+kn6PfYODfoKYl4OJmo2XfI18jH2Sjn2KnZSOjZ2ZlJmto5mht6qiqru2q6zEsbasvbmxucfHucTKysfHzcrKw9LMyrTEu8S3w7e7tb6+t5SVlJW9wL69vtDJvsXPxsi+yMTEu87IxrzEv8S4wry/t8C9vLnPyb3J5OLJpqemp+H8+uLt/O766fj07vP///OztbO1+/77/fr8/Pv7//789f71/e717vXn8uju6PPy6Onz7PPFxsXG6e/s7Obt6OzJysnK4/Dp5+b7+uj0//76z9DP0PT/9/7u+vf38//79+n86fvi5+Tn5Obm5ens7Onp7uns4efi5+Hl5eLY2djZ4ufm5uXn5+fZ5t7m2uPh3tzi3eHV3tXd1dnY1dXZ2djX39ja2t/c2tvi4tvl7+jo5+7r6OTr5Ovb4tvc5Ojn5Ob59+fv/PL38ff28fL48/bs+Ozz7PLx7O3y7vHu8+/u7fPy7/D08PLt8vHw7///8fz//f/8//79/P/8/ufo5+j0/PT88ffx9fL///L7//7/+P/5/vT79Pnn8uny7PLy7PT/+/bz//P77O3s7fT6+fTt7u3t+P//+e7v7u/v8O/w8PHw8fHx8fHx8vHy8vLy8vLz8vP6/vr+8vj1+PT49vX2+Pj28/Tz9PP08/T0+fT0+v/8+/r8+vzq+Ov43uvi6+Dv4+Lh6+nj4uvk6eDl4+Tx8fHx4OTh49/q6uHo6ujq3Ovd6Nff2d3Z3t7Z3ubj3uLk5OPd493j1d7X3cXYyNjEyMTI'

function decodeChecklistReplayBars() {
  const bytes = Uint8Array.from(atob(checklistReplayPacked), (character) => character.charCodeAt(0))
  const bars = []
  const toChartY = (value) => 88 + value * (292 / 255)
  for (let index = 0; index < bytes.length; index += 4) {
    bars.push({
      high: toChartY(bytes[index]),
      low: toChartY(bytes[index + 1]),
      open: toChartY(bytes[index + 2]),
      close: toChartY(bytes[index + 3])
    })
  }
  return bars
}

const checklistReplayBars = decodeChecklistReplayBars()
const checklistReplayStart = 165

function buildModeReplayChart(candleLayer) {
  if (!candleLayer || candleLayer.childElementCount) return

  const chartKey = candleLayer.dataset.modeCandles
  const xStart = 38
  const bars = chartKey === 'check'
    ? checklistReplayBars
    : genericModeCloses.map((close, index) => {
        const open = index === 0 ? close + 14 : genericModeCloses[index - 1]
        return {
          high: Math.max(86, Math.min(open, close) - (7 + (index * 7) % 9)),
          low: Math.min(378, Math.max(open, close) + (8 + (index * 5) % 10)),
          open,
          close
        }
      })
  const xStep = (646 - xStart) / Math.max(1, bars.length - 1)
  const replayStart = chartKey === 'check' ? checklistReplayStart : 0
  const candleWidth = chartKey === 'check' ? Math.max(1.5, xStep * 0.72) : 8.4

  bars.forEach(({ high, low, open, close }, index) => {
    const x = xStart + index * xStep
    const rising = close < open
    const color = rising ? '#21aa9b' : '#ef454b'
    const group = createSvgElement('g', {
      class: `mode-kline-candle${index < replayStart ? ' is-history' : ''}`,
      style: `--mode-bar-delay:${300 + Math.max(0, index - replayStart) * (chartKey === 'check' ? 112 : 78)}ms`
    })
    const wick = createSvgElement('line', {
      class: 'mode-kline-candle-wick',
      x1: x,
      x2: x,
      y1: high,
      y2: low,
      stroke: color
    })
    const body = createSvgElement('rect', {
      x: x - candleWidth / 2,
      y: Math.min(open, close),
      width: candleWidth,
      height: Math.max(chartKey === 'check' ? 1.4 : 3, Math.abs(close - open)),
      rx: chartKey === 'check' ? 0.3 : 0.8,
      fill: color
    })
    group.append(wick, body)
    candleLayer.append(group)
  })

  function exponentialAverage(period) {
    const alpha = 2 / (period + 1)
    let previous = bars[0].close
    return bars.map((bar, index) => {
      previous = index === 0 ? bar.close : alpha * bar.close + (1 - alpha) * previous
      return previous
    })
  }

  function toPath(values) {
    return values.map((value, index) => (
      `${index === 0 ? 'M' : 'L'}${(xStart + index * xStep).toFixed(2)} ${value.toFixed(2)}`
    )).join(' ')
  }

  const fastPath = document.querySelector(`[data-mode-ma-fast="${chartKey}"]`)
  const slowPath = document.querySelector(`[data-mode-ma-slow="${chartKey}"]`)
  const priceLine = document.querySelector(`[data-mode-price="${chartKey}"]`)
  if (fastPath) fastPath.setAttribute('d', toPath(exponentialAverage(chartKey === 'check' ? 30 : 5)))
  if (slowPath) slowPath.setAttribute('d', toPath(exponentialAverage(chartKey === 'check' ? 55 : 11)))
  if (priceLine) {
    const firstReplayClose = bars[Math.max(0, replayStart - 1)].close
    priceLine.setAttribute('y1', String(firstReplayClose))
    priceLine.setAttribute('y2', String(firstReplayClose))
    priceLine.modeReplayValues = bars.slice(replayStart).map((bar) => bar.close)
  }
}

document.querySelectorAll('[data-mode-candles]').forEach(buildModeReplayChart)

function restartModeReplay(panel) {
  if (!panel || panel.querySelector('[data-mode-video-demo]') || panel.dataset.modePanel !== 'check' || reduceMotion) return
  const priceLine = panel.querySelector('[data-mode-price="check"]')
  if (!priceLine?.modeReplayValues?.length) return

  priceLine.getAnimations().forEach((animation) => animation.cancel())
  const values = priceLine.modeReplayValues
  const baseline = values[0]
  priceLine.animate(
    values.map((value, index) => ({
      offset: index / Math.max(1, values.length - 1),
      transform: `translateY(${value - baseline}px)`
    })),
    { duration: 5000, delay: 300, easing: 'steps(1, end)', fill: 'forwards' }
  )
}

let heroPriceReplayTimer = 0

function setHeroPriceLine(y) {
  if (!heroPriceLine) return
  heroPriceLine.setAttribute('y1', String(y))
  heroPriceLine.setAttribute('y2', String(y))
}

function stopHeroPriceReplay() {
  window.clearTimeout(heroPriceReplayTimer)
  heroPriceReplayTimer = 0
}

function startHeroPriceReplay() {
  if (!heroPriceLine || !heroReplayCandles.length) return

  stopHeroPriceReplay()
  let candleIndex = 0
  setHeroPriceLine(heroReplayCandles[0].open)

  function advancePriceLine() {
    candleIndex += 1
    if (candleIndex >= heroReplayCandles.length) {
      setHeroPriceLine(595)
      return
    }

    setHeroPriceLine(heroReplayCandles[candleIndex].open)
    heroPriceReplayTimer = window.setTimeout(advancePriceLine, 70)
  }

  heroPriceReplayTimer = window.setTimeout(advancePriceLine, 820)
}

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

function closeMenu() {
  if (!menu || !menuButton) return
  menu.dataset.open = 'false'
  menuButton.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('menu-open')
}

function setLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'zh'
  document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en'

  document.querySelectorAll('[data-zh][data-en]').forEach((node) => {
    node.textContent = node.dataset[currentLanguage]
  })

  document.querySelectorAll('[data-aria-zh][data-aria-en]').forEach((node) => {
    node.setAttribute('aria-label', node.dataset[`aria${currentLanguage === 'zh' ? 'Zh' : 'En'}`])
  })

  document.querySelectorAll('[data-alt-zh][data-alt-en]').forEach((node) => {
    node.alt = node.dataset[`alt${currentLanguage === 'zh' ? 'Zh' : 'En'}`]
  })

  document.querySelectorAll('[data-href-zh][data-href-en]').forEach((node) => {
    node.href = node.dataset[`href${currentLanguage === 'zh' ? 'Zh' : 'En'}`]
    const isExternal = node.href.startsWith('http')
    if (isExternal) {
      node.target = '_blank'
      node.rel = 'noopener'
    } else {
      node.removeAttribute('target')
      node.removeAttribute('rel')
    }
  })

  const localizedPageCopy = getPageCopy(currentLanguage)
  document.title = localizedPageCopy.title
  const description = document.querySelector('meta[name="description"]')
  if (description) description.content = localizedPageCopy.description

  try {
    window.localStorage.setItem('tradereplay-language', currentLanguage)
  } catch {
    // The page remains usable without local storage.
  }
}

if (menu && menuButton) {
  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true'
    menuButton.setAttribute('aria-expanded', String(willOpen))
    menu.dataset.open = String(willOpen)
    document.body.classList.toggle('menu-open', willOpen)
  })

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu))
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu()
  }, { passive: true })
}

let heroDemoHasPlayed = false
let heroDemoTimer = 0
let heroDemoInView = false
let heroDemoScrollArmed = false

function playHeroDemo(forceReplay = false) {
  if (!heroDemo || (heroDemoHasPlayed && !forceReplay)) return

  window.clearTimeout(heroDemoTimer)
  stopHeroPriceReplay()
  setHeroPriceLine(595)
  heroDemo.classList.remove('is-playing', 'is-complete')

  if (reduceMotion) {
    heroDemo.classList.add('is-complete')
    heroDemoHasPlayed = true
    return
  }

  // Restart the CSS timeline when the user explicitly replays the demo.
  void heroDemo.offsetWidth
  heroDemo.classList.add('is-playing')
  startHeroPriceReplay()
  heroDemoHasPlayed = true

  heroDemoTimer = window.setTimeout(() => {
    heroDemo.classList.remove('is-playing')
    heroDemo.classList.add('is-complete')
  }, 9800)
}

function maybePlayHeroDemo() {
  if (!heroDemoInView || !heroDemoScrollArmed) return
  playHeroDemo()
}

function updateHeroDemoScrollGate() {
  if (!('IntersectionObserver' in window) && heroDemo) {
    const bounds = heroDemo.getBoundingClientRect()
    const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0)
    heroDemoInView = visibleHeight >= bounds.height * 0.42
  }

  maybePlayHeroDemo()
}

function armHeroDemoFromScrollIntent() {
  heroDemoScrollArmed = true
  maybePlayHeroDemo()
}

if (heroDemo) {
  window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) armHeroDemoFromScrollIntent()
  }, { passive: true })
  window.addEventListener('touchmove', armHeroDemoFromScrollIntent, { passive: true })
  window.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) {
      armHeroDemoFromScrollIntent()
    }
  })

  if (!('IntersectionObserver' in window)) {
    window.addEventListener('scroll', updateHeroDemoScrollGate, { passive: true })
  } else {
    const heroDemoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        heroDemoInView = entry.isIntersecting && entry.intersectionRatio >= 0.42
        maybePlayHeroDemo()
      })
    }, { threshold: [0.42, 0.58] })

    heroDemoObserver.observe(heroDemo)
    window.addEventListener('scroll', updateHeroDemoScrollGate, { passive: true })
  }
}

function setupModeVideo(figure) {
  const video = figure?.querySelector('[data-mode-video]')
  const signal = figure?.querySelector('.mode-video-signal')
  if (!figure || !video) return null

  const triggerTime = Number(figure.dataset.triggerTime || 5.76)
  const trackedSignal = figure.dataset.modeVideoDemo === 'check'
  const signalTrack = trackedSignal ? [
    [5.7, 62.11, 68.704], [5.8, 61.679, 67.963], [5.9, 62.325, 67.037],
    [6, 62.325, 67.037], [6.1, 62.325, 66.852], [6.2, 62.325, 66.852],
    [6.3, 62.002, 66.852], [6.4, 61.679, 66.852], [6.5, 61.679, 66.852],
    [6.6, 61.356, 66.852], [6.7, 61.356, 66.852], [6.8, 61.033, 66.852],
    [6.9, 61.033, 66.852], [7, 60.71, 66.852], [7.1, 60.388, 66.852],
    [7.2, 60.388, 66.852], [7.3, 60.065, 66.852], [7.4, 60.065, 66.852],
    [7.5, 59.742, 66.852], [7.6, 59.419, 66.852], [7.7, 59.419, 66.852],
    [7.8, 59.096, 66.852], [7.9, 58.773, 66.852], [8, 58.773, 66.852],
    [8.1, 58.558, 66.852], [8.2, 58.342, 66.852], [8.3, 58.235, 66.852],
    [8.4, 57.912, 66.852], [8.5, 57.912, 66.852], [8.6, 57.589, 66.852],
    [8.7, 57.589, 66.852], [8.8, 57.266, 66.852], [8.9, 56.943, 66.852],
    [9, 56.943, 66.852], [9.1, 56.62, 66.852], [9.2, 56.62, 66.852],
    [9.3, 56.297, 66.852], [9.4, 56.297, 66.852]
  ] : [[
    triggerTime,
    Number(figure.dataset.signalX || 62.1),
    Number(figure.dataset.signalY || 66.7)
  ]]
  let active = figure.closest('[data-mode-panel]')?.classList.contains('is-active') ?? true
  let frameCallback = 0

  function updateSignalPosition(time) {
    if (!signal) return

    if (signalTrack.length === 1) {
      signal.style.setProperty('--signal-x', `${signalTrack[0][1]}%`)
      signal.style.setProperty('--signal-y', `${signalTrack[0][2]}%`)
      return
    }

    let left = signalTrack[0]
    let right = signalTrack[signalTrack.length - 1]

    for (let index = 1; index < signalTrack.length; index += 1) {
      if (signalTrack[index][0] >= time) {
        left = signalTrack[index - 1]
        right = signalTrack[index]
        break
      }
    }

    const duration = Math.max(0.001, right[0] - left[0])
    const progress = Math.min(1, Math.max(0, (time - left[0]) / duration))
    const x = left[1] + ((right[1] - left[1]) * progress)
    const y = left[2] + ((right[2] - left[2]) * progress)

    signal.style.setProperty('--signal-x', `${x}%`)
    signal.style.setProperty('--signal-y', `${y}%`)
  }

  function renderFrame() {
    const shouldAnnotate = video.currentTime >= triggerTime
    figure.classList.toggle('is-annotated', shouldAnnotate)

    if (shouldAnnotate && signal) updateSignalPosition(video.currentTime)
  }

  function cancelFrameCallback() {
    if (!frameCallback) return
    if ('cancelVideoFrameCallback' in video) {
      video.cancelVideoFrameCallback(frameCallback)
    } else {
      window.cancelAnimationFrame(frameCallback)
    }
    frameCallback = 0
  }

  function watchFrames() {
    cancelFrameCallback()

    const onFrame = () => {
      frameCallback = 0
      renderFrame()
      if (active && !video.paused && !video.ended) watchFrames()
    }

    if ('requestVideoFrameCallback' in video) {
      frameCallback = video.requestVideoFrameCallback(onFrame)
    } else {
      frameCallback = window.requestAnimationFrame(onFrame)
    }
  }

  function resetAnnotations() {
    figure.classList.remove('is-annotated')
    signal?.style.removeProperty('--signal-x')
    signal?.style.removeProperty('--signal-y')
  }

  function activate() {
    active = true
    renderFrame()
  }

  function deactivate() {
    active = false
    video.pause()
    cancelFrameCallback()
  }

  video.addEventListener('loadeddata', () => {
    renderFrame()
  })

  video.addEventListener('play', () => {
    if (active) watchFrames()
  })

  video.addEventListener('pause', cancelFrameCallback)
  video.addEventListener('timeupdate', renderFrame)
  video.addEventListener('seeked', renderFrame)
  video.addEventListener('ended', () => {
    cancelFrameCallback()
    renderFrame()
  })

  resetAnnotations()
  renderFrame()
  return { activate, deactivate }
}

const modeVideoControllers = new Map()
document.querySelectorAll('[data-mode-video-demo]').forEach((figure) => {
  const key = figure.closest('[data-mode-panel]')?.dataset.modePanel
  const controller = setupModeVideo(figure)
  if (key && controller) modeVideoControllers.set(key, controller)
})

function setupTabs({
  buttonSelector,
  panelSelector,
  buttonDataKey,
  panelDataKey,
  autoAdvance = false,
  interval = 7000
}) {
  const buttons = Array.from(document.querySelectorAll(buttonSelector))
  const panels = Array.from(document.querySelectorAll(panelSelector))
  if (!buttons.length || !panels.length) return

  let activeKey = buttons.find((button) => button.classList.contains('is-active'))?.dataset[buttonDataKey] || buttons[0].dataset[buttonDataKey]
  let timer = 0
  let paused = false

  function activate(key) {
    if (!buttons.some((button) => button.dataset[buttonDataKey] === key)) return
    activeKey = key

    buttons.forEach((button) => {
      const selected = button.dataset[buttonDataKey] === key
      button.classList.toggle('is-active', selected)
      button.setAttribute('aria-selected', String(selected))
      button.tabIndex = selected ? 0 : -1
    })

    panels.forEach((panel) => {
      const selected = panel.dataset[panelDataKey] === key
      panel.hidden = !selected
      panel.classList.toggle('is-active', selected)
      if (selected) {
        window.requestAnimationFrame(() => restartModeReplay(panel))
      }
      const videoController = modeVideoControllers.get(panel.dataset[panelDataKey])
      if (selected) videoController?.activate()
      else videoController?.deactivate()
    })
  }

  function advance() {
    if (paused) return
    const currentIndex = buttons.findIndex((button) => button.dataset[buttonDataKey] === activeKey)
    const nextButton = buttons[(currentIndex + 1) % buttons.length]
    activate(nextButton.dataset[buttonDataKey])
  }

  function startTimer() {
    if (!autoAdvance || reduceMotion) return
    window.clearInterval(timer)
    timer = window.setInterval(advance, interval)
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      activate(button.dataset[buttonDataKey])
      startTimer()
    })

    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
      event.preventDefault()
      const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
      const nextIndex = (index + (forward ? 1 : -1) + buttons.length) % buttons.length
      const nextButton = buttons[nextIndex]
      activate(nextButton.dataset[buttonDataKey])
      nextButton.focus()
      startTimer()
    })
  })

  const region = buttons[0].closest('section')
  if (region && autoAdvance) {
    region.addEventListener('pointerenter', () => {
      paused = true
    })
    region.addEventListener('pointerleave', () => {
      paused = false
    })
    region.addEventListener('focusin', () => {
      paused = true
    })
    region.addEventListener('focusout', () => {
      paused = false
    })
  }

  activate(activeKey)
  startTimer()
}

setupTabs({
  buttonSelector: '[data-mode-tab]',
  panelSelector: '[data-mode-panel]',
  buttonDataKey: 'modeTab',
  panelDataKey: 'modePanel',
  autoAdvance: false
})

setupTabs({
  buttonSelector: '[data-cap-tab]',
  panelSelector: '[data-cap-panel]',
  buttonDataKey: 'capTab',
  panelDataKey: 'capPanel'
})

const revealTargets = Array.from(document.querySelectorAll('[data-reveal]'))
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((target) => target.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

  revealTargets.forEach((target, index) => {
    target.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`
    revealObserver.observe(target)
  })
}

let scrollTicking = false
function updateHeroStory() {
  if (!heroStory || !heroStoryStage) return

  const storyIsInteractive = heroStoryMedia.matches && !reduceMotion
  if (!storyIsInteractive) {
    heroStory.dataset.storyStep = '3'
    heroStory.style.removeProperty('--hero-story-progress')
    heroStoryCallouts.forEach((callout) => {
      callout.classList.remove('is-visible', 'is-active')
    })
    return
  }

  const storyBounds = heroStory.getBoundingClientRect()
  const stageHeight = heroStoryStage.getBoundingClientRect().height
  const stickyTop = 76
  const storyStart = window.scrollY + storyBounds.top - stickyTop
  const storyDistance = Math.max(1, heroStory.offsetHeight - stageHeight)
  const progress = Math.min(1, Math.max(0, (window.scrollY - storyStart) / storyDistance))
  const thresholds = [0.08, 0.36, 0.64]
  let activeIndex = -1

  thresholds.forEach((threshold, index) => {
    if (progress >= threshold) activeIndex = index
  })

  heroStory.dataset.storyStep = String(activeIndex + 1)
  heroStory.style.setProperty('--hero-story-progress', progress.toFixed(4))
  heroStoryCallouts.forEach((callout, index) => {
    callout.classList.toggle('is-visible', index <= activeIndex)
    callout.classList.toggle('is-active', index === activeIndex)
  })
}

function updateScrollState() {
  const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange))
  document.body.style.setProperty('--page-progress', String(progress))
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 18)
  updateHeroStory()
  scrollTicking = false
}

function requestScrollUpdate() {
  if (scrollTicking) return
  scrollTicking = true
  window.requestAnimationFrame(updateScrollState)
}

if (progressBar || header || heroStory) {
  updateScrollState()
  window.addEventListener('scroll', requestScrollUpdate, { passive: true })
  window.addEventListener('resize', requestScrollUpdate, { passive: true })
}

if (heroStoryMedia.addEventListener) {
  heroStoryMedia.addEventListener('change', requestScrollUpdate)
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear())
})

setLanguage(currentLanguage)
