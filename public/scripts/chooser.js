// The chooser's two halves each carry a slowly scrolling candle tape:
// 外汇期货版 in blue and teal, 股票版 in A-share red and green with a few
// 涨停 one-price tops that glow. Hovering a half speeds its tape up and dims
// the other one; the split itself moves in CSS (editions.css).
//
// The tapes are seeded, so every visit draws the same market. They stop
// while the page is off screen or hidden, and with reduced motion they are
// drawn once and stay still.
(() => {
  const split = document.querySelector('[data-split]')
  const canvases = Array.from(document.querySelectorAll('[data-split-tape]'))
  if (!split || !canvases.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function random(seed) {
    let state = seed >>> 0
    return () => {
      state = (state + 0x6d2b79f5) >>> 0
      let t = state
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // Around-the-clock bars: a wandering trend with volatility that clusters.
  function futuresTape(count) {
    const next = random(31)
    const bars = []
    let price = 1085
    let volatility = 0.45
    for (let i = 0; i < count; i += 1) {
      const session = [0.6, 1.15, 1.35][Math.floor((i % 96) / 32)]
      volatility = volatility * 0.9 + (0.25 + next() * 0.7) * 0.1
      const drift = Math.sin(i / 17) * 0.11 + Math.sin(i / 53) * 0.08
      const open = price
      const close = open + drift + (next() - 0.5) * volatility * 2.4 * session
      const high = Math.max(open, close) + next() * volatility * 0.9 * session
      const low = Math.min(open, close) - next() * volatility * 0.9 * session
      bars.push({ open, high, low, close })
      price = close
    }
    return bars
  }

  // Daily A-share bars with the occasional limit-up day that closes at its high.
  function stocksTape(count) {
    const next = random(57)
    const bars = []
    let price = 10
    for (let i = 0; i < count; i += 1) {
      const limitUp = next() < 0.06
      const open = price * (1 + (next() - 0.5) * 0.01)
      const close = limitUp ? price * 1.1 : open * (1 + (next() - 0.48) * 0.05)
      const high = limitUp ? close : Math.max(open, close) * (1 + next() * 0.015)
      const low = Math.min(open, close) * (1 - next() * 0.015)
      bars.push({ open, high, low, close, limitUp })
      price = close
      if (price > 30) price *= 0.85
      if (price < 6) price *= 1.15
    }
    return bars
  }

  const looks = {
    futures: { bars: futuresTape(900), step: 9, up: '#3fd0b5', down: '#4b83f7' },
    stocks: { bars: stocksTape(900), step: 12, up: '#f2555a', down: '#2fbf7a' },
  }
  const tapes = canvases.map((canvas) => ({
    canvas,
    side: canvas.dataset.splitTape,
    look: looks[canvas.dataset.splitTape],
    low: null,
    high: null,
    alpha: 0.55,
  }))

  let hover = ''
  let offset = 0
  let speed = 1
  let last = 0
  let frame = 0
  let onScreen = true

  function draw(tape, settle) {
    const { canvas, look } = tape
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
    }
    const context = canvas.getContext('2d')
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)

    const { bars, step } = look
    const count = Math.ceil(width / step) + 2
    const first = Math.floor(offset / step)
    const shift = offset % step
    const visible = []
    let low = Infinity
    let high = -Infinity
    for (let k = 0; k < count; k += 1) {
      const bar = bars[(first + k) % bars.length]
      visible.push(bar)
      low = Math.min(low, Math.log(bar.low))
      high = Math.max(high, Math.log(bar.high))
    }
    // Ease the price range so the tape does not jump when a tall bar scrolls in.
    tape.low = tape.low === null || settle ? low : tape.low + (low - tape.low) * 0.06
    tape.high = tape.high === null || settle ? high : tape.high + (high - tape.high) * 0.06
    const span = tape.high - tape.low || 1
    const top = height * 0.16
    const bottom = height * 0.9
    const y = (value) => top + (1 - (Math.log(value) - tape.low) / span) * (bottom - top)

    const target = !hover || hover === tape.side ? 0.55 : 0.28
    tape.alpha = settle ? target : tape.alpha + (target - tape.alpha) * 0.08
    context.globalAlpha = tape.alpha

    context.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    context.lineWidth = 1
    for (let k = 0; k < 6; k += 1) {
      const lineY = Math.round(top + (k / 5) * (bottom - top)) + 0.5
      context.beginPath()
      context.moveTo(0, lineY)
      context.lineTo(width, lineY)
      context.stroke()
    }

    const body = step * 0.56
    for (let k = 0; k < count; k += 1) {
      const bar = visible[k]
      const x = k * step - shift
      context.strokeStyle = context.fillStyle = bar.close >= bar.open ? look.up : look.down
      context.beginPath()
      context.moveTo(x, y(bar.high))
      context.lineTo(x, y(bar.low))
      context.stroke()
      const bodyTop = y(Math.max(bar.open, bar.close))
      const bodyBottom = y(Math.min(bar.open, bar.close))
      context.fillRect(x - body / 2, bodyTop, body, Math.max(1.2, bodyBottom - bodyTop))
      if (bar.limitUp) {
        context.save()
        context.shadowColor = 'rgba(242, 85, 90, 0.9)'
        context.shadowBlur = 10
        context.fillRect(x - body / 2, bodyTop - 1, body, 2)
        context.restore()
      }
    }
    context.globalAlpha = 1
  }

  function drawAll(settle) {
    tapes.forEach((tape) => draw(tape, settle))
  }

  function tick(time) {
    const elapsed = Math.min(64, time - (last || time))
    last = time
    speed += ((hover ? 2.2 : 1) - speed) * 0.05
    offset += elapsed * 0.02 * speed
    drawAll(false)
    frame = window.requestAnimationFrame(tick)
  }

  function start() {
    window.cancelAnimationFrame(frame)
    frame = 0
    if (reducedMotion.matches || !onScreen) {
      drawAll(true)
      return
    }
    last = 0
    frame = window.requestAnimationFrame(tick)
  }

  split.addEventListener('pointerover', (event) => {
    if (event.pointerType !== 'mouse') return
    hover = event.target.closest('[data-split-side]')?.dataset.splitSide ?? ''
  })
  split.addEventListener('pointerleave', () => {
    hover = ''
  })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting)
      start()
    }).observe(split)
  }
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (!frame) drawAll(true)
    }).observe(split)
  }
  reducedMotion.addEventListener?.('change', start)

  start()
})()
