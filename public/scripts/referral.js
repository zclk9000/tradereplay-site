// Referral rewards: sign in with an email code, then show the lifetime
// member's referral code, tier, balances, payout QR codes and withdrawals.
// Everything talks to the license Worker, which allows this site's origin on
// its sign-in and /v2/referral/* routes only.
(() => {
  const PRODUCTION_API = 'https://license.tradereplay.dev'
  const localPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  // Only a local preview may point the page at another Worker.
  const API = (localPreview && new URLSearchParams(window.location.search).get('api')) || PRODUCTION_API
  const SESSION_KEY = 'tradereplay-referral-session'
  const MAX_QR_SIDE = 1000
  const MAX_UPLOAD_BYTES = 1_400_000

  const $ = (id) => document.getElementById(id)
  const isChinese = () => document.documentElement.lang !== 'en'
  const L = (zh, en) => (isChinese() ? zh : en)

  let session = readSession()
  let pendingSignIn = null
  let summary = null
  const qrUrls = {}

  function readSession() {
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || 'null')
      if (stored && typeof stored.token === 'string' && stored.expiresAt > Date.now()) return stored
    } catch {
      // Session storage is optional; the visitor signs in again.
    }
    return null
  }

  function saveSession(value) {
    session = value
    try {
      if (value) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(value))
      else window.sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // Keep the in-memory session.
    }
  }

  const ERRORS = {
    rate_limited: ['操作太频繁，请稍后再试。', 'Too many attempts. Wait a moment and try again.'],
    invalid_email: ['请输入有效的邮箱地址。', 'Enter a valid email address.'],
    email_delivery_failed: ['邮件发送失败，请稍后再试。', 'The email could not be sent. Try again later.'],
    invalid_code: ['验证码不正确。', 'The code is incorrect.'],
    challenge_expired: ['验证码已过期，请重新发送。', 'The code expired. Send a new one.'],
    challenge_used: ['验证码已使用，请重新发送。', 'The code was already used. Send a new one.'],
    too_many_attempts: ['错误次数太多，请重新发送验证码。', 'Too many wrong attempts. Send a new code.'],
    invalid_verification: ['验证已失效，请重新发送验证码。', 'Verification expired. Send a new code.'],
    verification_used: ['验证已失效，请重新发送验证码。', 'Verification expired. Send a new code.'],
    account_not_found: ['这个邮箱还没有 TradeReplay 账号。请先在软件里用邮箱注册并成为终身会员。', 'This email has no TradeReplay account yet. Register in the app first.'],
    unauthorized: ['登录已过期，请重新登录。', 'Your sign-in expired. Sign in again.'],
    invalid_image: ['请上传 PNG、JPG 或 WebP 格式的收款码图片。', 'Upload the QR code as a PNG, JPG or WebP image.'],
    request_too_large: ['图片太大，请截取只包含收款码的区域。', 'The image is too large. Crop it to the QR code.'],
    payout_qr_missing: ['请先上传这个方式的收款码。', 'Upload a QR code for this method first.'],
    below_minimum: ['可提现金额还没有达到提现门槛。', 'The withdrawable amount is below the minimum.'],
    not_found: ['推荐返利服务暂未开放，请稍后再试。', 'Referral rewards are not available yet. Try again later.'],
    service_unavailable: ['服务暂时不可用，请稍后再试。', 'The service is temporarily unavailable. Try again later.']
  }

  function errorText(code) {
    const pair = ERRORS[code]
    return pair ? L(pair[0], pair[1]) : L('出错了，请稍后再试。', 'Something went wrong. Try again later.') + (code ? ` (${code})` : '')
  }

  class ApiError extends Error {
    constructor(code, status) {
      super(code)
      this.code = code
      this.status = status
    }
  }

  async function call(path, body, { raw, contentType, query = '', binary = false } = {}) {
    const headers = {}
    if (session) headers.authorization = `Bearer ${session.token}`
    headers['content-type'] = raw ? contentType : 'application/json'
    const url = API + path + query
    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: raw ?? JSON.stringify(body ?? {})
      })
    } catch {
      throw new ApiError('network', 0)
    }
    if (binary && response.ok) return response.blob()
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.ok === false) {
      const code = data.error || `http_${response.status}`
      if (response.status === 401 && session) signOut()
      throw new ApiError(code, response.status)
    }
    return data
  }

  function setMessage(id, text, tone) {
    const node = $(id)
    node.textContent = text || ''
    if (tone) node.dataset.tone = tone
    else delete node.dataset.tone
  }

  function yuan(cents) {
    const value = Number(cents || 0) / 100
    return `¥${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
  }

  function date(ms) {
    if (!ms) return '—'
    const d = new Date(ms)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // ── Sign-in ──────────────────────────────────────────────────────────

  function showSignIn() {
    $('signin').hidden = false
    $('dashboard').hidden = true
    $('email-form').hidden = Boolean(pendingSignIn)
    $('code-form').hidden = !pendingSignIn
  }

  $('email-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const email = $('email').value.trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMessage('signin-message', errorText('invalid_email'), 'error')
      return
    }
    const deviceId = `web:${crypto.randomUUID()}`
    $('send-code').disabled = true
    setMessage('signin-message', L('正在发送…', 'Sending…'))
    try {
      const data = await call('/v2/auth/request-code', { email, purpose: 'sign_in', deviceId })
      pendingSignIn = { email, deviceId, challengeId: data.challengeId }
      showSignIn()
      $('otp').value = ''
      $('otp').focus()
      setMessage('signin-message', L(`验证码已发送到 ${email}，请查看收件箱和垃圾邮件。`, `Code sent to ${email}. Check your inbox and spam folder.`), 'ok')
    } catch (error) {
      setMessage('signin-message', errorText(error.code), 'error')
    } finally {
      $('send-code').disabled = false
    }
  })

  $('code-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const code = $('otp').value.replace(/\D/g, '')
    if (!pendingSignIn || code.length !== 6) {
      setMessage('signin-message', L('请输入 6 位验证码。', 'Enter the six-digit code.'), 'error')
      return
    }
    $('verify').disabled = true
    setMessage('signin-message', L('正在登录…', 'Signing in…'))
    try {
      const verified = await call('/v2/auth/verify-code', {
        challengeId: pendingSignIn.challengeId,
        code,
        purpose: 'sign_in',
        deviceId: pendingSignIn.deviceId
      })
      const signedIn = await call('/v2/web/complete', { verificationToken: verified.verificationToken })
      saveSession({ token: signedIn.token, expiresAt: signedIn.expiresAt, email: signedIn.email })
      pendingSignIn = null
      setMessage('signin-message', '')
      await loadDashboard()
    } catch (error) {
      setMessage('signin-message', errorText(error.code), 'error')
    } finally {
      $('verify').disabled = false
    }
  })

  $('change-email').addEventListener('click', () => {
    pendingSignIn = null
    setMessage('signin-message', '')
    showSignIn()
  })

  function signOut() {
    saveSession(null)
    summary = null
    for (const method of Object.keys(qrUrls)) {
      URL.revokeObjectURL(qrUrls[method])
      delete qrUrls[method]
    }
    showSignIn()
  }

  $('sign-out').addEventListener('click', signOut)

  // ── Dashboard ────────────────────────────────────────────────────────

  async function loadDashboard() {
    $('signin').hidden = true
    $('dashboard').hidden = false
    $('account-email').textContent = session.email || ''
    setMessage('dashboard-message', L('正在加载…', 'Loading…'))
    try {
      const data = await call('/v2/referral/summary', {})
      summary = data.referral
      setMessage('dashboard-message', '')
      render()
      await Promise.all(['alipay', 'wechat'].map(loadQr))
    } catch (error) {
      if (error.status === 401) {
        setMessage('signin-message', errorText('unauthorized'), 'error')
        return
      }
      setMessage('dashboard-message', errorText(error.code), 'error')
    }
  }

  function render() {
    if (!summary) return
    const hasCode = Boolean(summary.code)
    $('not-eligible').hidden = hasCode
    $('referral-content').hidden = !hasCode
    if (!hasCode) return

    const disabled = summary.codeStatus === 'disabled'
    $('referral-code').textContent = summary.code
    if (disabled) $('referral-code').dataset.disabled = ''
    else delete $('referral-code').dataset.disabled
    $('code-status').textContent = disabled
      ? L('推荐码已停用，新的朋友无法再使用。已获得的返利不受影响，请联系客服。', 'This code is disabled for new buyers. Rewards already earned stay; contact support.')
      : L(`已成功推荐 ${summary.referralCount} 人`, `${summary.referralCount} referred so far`)
    $('copy-code').disabled = disabled
    $('copy-pitch').disabled = disabled

    $('tiers').replaceChildren(...summary.tiers.map((tier, index) => {
      const next = summary.tiers[index + 1]
      const li = document.createElement('li')
      if (tier.level === summary.tier.level) li.dataset.current = ''
      const reward = document.createElement('strong')
      reward.textContent = yuan(tier.rewardCents)
      const range = document.createElement('span')
      range.textContent = next
        ? L(`第 ${tier.fromCount + 1}–${next.fromCount} 位`, `Referrals ${tier.fromCount + 1}–${next.fromCount}`)
        : L(`第 ${tier.fromCount + 1} 位起`, `From referral ${tier.fromCount + 1}`)
      const label = document.createElement('span')
      label.textContent = L(`等级 ${tier.level} · 每人`, `Level ${tier.level} · each`)
      li.append(label, reward, range)
      return li
    }))
    $('tier-progress').textContent = summary.nextTier
      ? L(`再推荐 ${summary.nextTier.remaining} 人，每人返利升到 ${yuan(summary.nextTier.rewardCents)}`, `${summary.nextTier.remaining} more to earn ${yuan(summary.nextTier.rewardCents)} each`)
      : L('已达到最高等级', 'Top level reached')

    $('amount-holding').textContent = yuan(summary.amounts.holdingCents)
    $('amount-available').textContent = yuan(summary.amounts.availableCents)
    $('amount-requested').textContent = yuan(summary.amounts.requestedCents)
    $('amount-paid').textContent = yuan(summary.amounts.paidCents)
    $('hold-note').textContent = L(`朋友兑换满 ${summary.holdDays} 天后转为可提现`, `Withdrawable ${summary.holdDays} days after redemption`)
    $('payee-name').value = summary.payout.payeeName || ''

    renderWithdraw()
    renderReferrals()
    renderWithdrawals()
  }

  function renderWithdraw() {
    const available = summary.amounts.availableCents
    const methods = { alipay: summary.payout.hasAlipayQr, wechat: summary.payout.hasWechatQr }
    let checked = document.querySelector('input[name="method"]:checked')
    document.querySelectorAll('input[name="method"]').forEach((input) => {
      input.disabled = !methods[input.value]
      input.closest('label').setAttribute('aria-disabled', String(input.disabled))
      if (input.disabled && input.checked) input.checked = false
    })
    checked = document.querySelector('input[name="method"]:checked')
    if (!checked) {
      const first = document.querySelector('input[name="method"]:not(:disabled)')
      if (first) first.checked = true
    }
    const enough = available >= summary.minWithdrawalCents
    const anyQr = methods.alipay || methods.wechat
    $('withdraw-button').textContent = L(`申请提现 ${yuan(available)}`, `Withdraw ${yuan(available)}`)
    $('withdraw-button').disabled = !enough || !anyQr
    $('withdraw-note').textContent = !anyQr
      ? L('先在上方上传收款码', 'Upload a QR code above first')
      : enough
        ? L('提交后人工核对并转账', 'We check and pay by hand')
        : L(`满 ${yuan(summary.minWithdrawalCents)} 可提现`, `Available from ${yuan(summary.minWithdrawalCents)}`)
  }

  function statusBadge(text, tone) {
    const span = document.createElement('span')
    span.className = 'referral-status'
    if (tone) span.dataset.tone = tone
    span.textContent = text
    return span
  }

  function row(cells) {
    const tr = document.createElement('tr')
    for (const cell of cells) {
      const td = document.createElement('td')
      if (cell instanceof Node) td.append(cell)
      else td.textContent = cell
      tr.append(td)
    }
    return tr
  }

  function emptyRow(text, columns) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = columns
    td.className = 'referral-empty'
    td.textContent = text
    tr.append(td)
    return tr
  }

  function renderReferrals() {
    const rows = summary.referrals.map((item) => {
      const status = {
        holding: [L(`冻结中 · ${date(item.availableAt)} 可提现`, `Held until ${date(item.availableAt)}`), 'wait'],
        available: [L('可提现', 'Withdrawable'), 'ok'],
        withdrawn: [L('已提现', 'Withdrawn'), null],
        cancelled: [L('已退款取消', 'Cancelled (refund)'), 'off']
      }[item.status] || [item.status, null]
      const reward = document.createElement('span')
      reward.className = 'referral-amount'
      reward.textContent = yuan(item.rewardCents)
      return row([date(item.createdAt), item.buyer, reward, statusBadge(status[0], status[1])])
    })
    $('referral-rows').replaceChildren(...(rows.length ? rows : [emptyRow(L('还没有推荐记录', 'No referrals yet'), 4)]))
  }

  function renderWithdrawals() {
    const rows = summary.withdrawals.map((item) => {
      const status = {
        requested: [L('处理中', 'Being paid'), 'wait'],
        paid: [L('已到账', 'Paid'), 'ok'],
        rejected: [L('未通过，已退回余额', 'Declined, returned to balance'), 'off']
      }[item.status] || [item.status, null]
      const amount = document.createElement('span')
      amount.className = 'referral-amount'
      amount.textContent = yuan(item.amountCents)
      const badge = statusBadge(status[0], status[1])
      const statusCell = document.createElement('span')
      statusCell.append(badge)
      if (item.note) statusCell.append(` ${item.note}`)
      return row([date(item.requestedAt), amount, item.method === 'wechat' ? L('微信', 'WeChat') : L('支付宝', 'Alipay'), statusCell])
    })
    $('withdrawal-rows').replaceChildren(...(rows.length ? rows : [emptyRow(L('还没有提现记录', 'No withdrawals yet'), 4)]))
  }

  // ── Copy ─────────────────────────────────────────────────────────────

  async function copyText(text, button, doneLabel) {
    const original = button.textContent
    try {
      await navigator.clipboard.writeText(text)
      button.textContent = doneLabel
    } catch {
      window.prompt(L('请手动复制：', 'Copy manually:'), text)
    }
    window.setTimeout(() => { button.textContent = original }, 1600)
  }

  $('copy-code').addEventListener('click', () => {
    if (summary?.code) copyText(summary.code, $('copy-code'), L('已复制', 'Copied'))
  })

  $('copy-pitch').addEventListener('click', () => {
    if (!summary?.code) return
    const pitch = L(
      `我在用 TradeReplay 做行情复盘训练。淘宝搜「TradeReplay」，拍「终身版推荐价」，在软件「账号与授权」兑换时填我的推荐码 ${summary.code}，就能用推荐价买终身版。`,
      `I use TradeReplay for market replay training. Buy the lifetime referral-price voucher of TradeReplay on Taobao and enter my referral code ${summary.code} when you redeem it in the app.`
    )
    copyText(pitch, $('copy-pitch'), L('已复制', 'Copied'))
  })

  // ── Payout details ───────────────────────────────────────────────────

  async function loadQr(method) {
    const has = method === 'alipay' ? summary?.payout.hasAlipayQr : summary?.payout.hasWechatQr
    const frame = document.querySelector(`.referral-qr[data-method="${method}"] img`)
    if (!has) {
      frame.hidden = true
      return
    }
    try {
      const blob = await call('/v2/referral/payout-qr-image', {}, { query: `?method=${method}`, binary: true })
      if (qrUrls[method]) URL.revokeObjectURL(qrUrls[method])
      qrUrls[method] = URL.createObjectURL(blob)
      frame.src = qrUrls[method]
      frame.hidden = false
    } catch {
      frame.hidden = true
    }
  }

  /** Shrink a phone screenshot so the upload stays small; QR codes survive it. */
  async function prepareImage(file) {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_QR_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
    const asBlob = (type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality))
    const png = await asBlob('image/png')
    if (png && png.size <= MAX_UPLOAD_BYTES) return png
    return asBlob('image/jpeg', 0.9)
  }

  document.querySelectorAll('.referral-qr').forEach((tile) => {
    const method = tile.dataset.method
    const input = tile.querySelector('input[type="file"]')
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      input.value = ''
      if (!file) return
      setMessage('dashboard-message', L('正在上传收款码…', 'Uploading the QR code…'))
      try {
        const image = await prepareImage(file)
        if (!image) throw new ApiError('invalid_image', 400)
        await call('/v2/referral/payout-qr', null, { raw: image, contentType: image.type, query: `?method=${method}` })
        summary.payout[method === 'alipay' ? 'hasAlipayQr' : 'hasWechatQr'] = true
        await loadQr(method)
        renderWithdraw()
        setMessage('dashboard-message', L('收款码已保存。', 'QR code saved.'), 'ok')
      } catch (error) {
        setMessage('dashboard-message', errorText(error.code || 'invalid_image'), 'error')
      }
    })
  })

  $('payee-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
      await call('/v2/referral/payout', { payeeName: $('payee-name').value })
      setMessage('dashboard-message', L('收款人姓名已保存。', 'Payee name saved.'), 'ok')
    } catch (error) {
      setMessage('dashboard-message', errorText(error.code), 'error')
    }
  })

  // ── Withdraw ─────────────────────────────────────────────────────────

  $('withdraw-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const method = document.querySelector('input[name="method"]:checked')?.value
    if (!method || !summary) return
    const label = method === 'wechat' ? L('微信', 'WeChat') : L('支付宝', 'Alipay')
    if (!window.confirm(L(`确认把 ${yuan(summary.amounts.availableCents)} 提现到${label}收款码？`, `Withdraw ${yuan(summary.amounts.availableCents)} to your ${label} QR code?`))) return
    $('withdraw-button').disabled = true
    try {
      const result = await call('/v2/referral/withdraw', { method })
      await loadDashboard()
      setMessage('dashboard-message', L(`已提交提现 ${yuan(result.amountCents)}，到账后这里会显示“已到账”。`, `Withdrawal of ${yuan(result.amountCents)} submitted.`), 'ok')
    } catch (error) {
      setMessage('dashboard-message', errorText(error.code), 'error')
      renderWithdraw()
    }
  })

  // Re-render dynamic text when the visitor switches language.
  document.querySelector('[data-language-switch]')?.addEventListener('click', () => {
    window.setTimeout(render, 0)
  })

  if (session) loadDashboard()
  else showSignIn()
})()
