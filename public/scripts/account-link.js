// Every page header carries a 登录 link to the referral back office. While
// the visitor is signed in there (on this computer, until the sign-in
// expires or they sign out), the link shows their email instead.
(() => {
  const SESSION_KEY = 'tradereplay-referral-session'
  const originals = new WeakMap()

  function readSession() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
      if (
        stored &&
        typeof stored.token === 'string' &&
        typeof stored.email === 'string' &&
        stored.expiresAt > Date.now()
      ) {
        return stored
      }
    } catch {
      // Storage is optional; the link simply says 登录.
    }
    return null
  }

  function render() {
    const session = readSession()
    const english = document.documentElement.lang === 'en'
    document.querySelectorAll('.account-login-link').forEach((link) => {
      if (!originals.has(link)) {
        originals.set(link, {
          html: link.innerHTML,
          zh: link.getAttribute('data-zh'),
          en: link.getAttribute('data-en')
        })
      }
      const original = originals.get(link)
      if (session) {
        // Language switchers rewrite [data-zh][data-en] text; an email stays.
        link.removeAttribute('data-zh')
        link.removeAttribute('data-en')
        const email = document.createElement('span')
        email.className = 'account-login-email'
        email.textContent = session.email
        // Phones show only the first character; the full email is the title.
        const initial = document.createElement('span')
        initial.className = 'account-login-initial'
        initial.textContent = session.email.charAt(0).toUpperCase()
        link.replaceChildren(email, initial)
        link.classList.add('is-signed-in')
        link.title = session.email
        link.setAttribute('aria-label', (english ? 'Signed in as ' : '已登录 ') + session.email)
      } else if (link.classList.contains('is-signed-in')) {
        link.classList.remove('is-signed-in')
        link.removeAttribute('title')
        link.removeAttribute('aria-label')
        if (original.zh != null && original.en != null) {
          link.setAttribute('data-zh', original.zh)
          link.setAttribute('data-en', original.en)
          link.textContent = english ? original.en : original.zh
        } else {
          link.innerHTML = original.html
        }
      }
    })
  }

  render()
  window.addEventListener('tradereplay-account-change', render)
  window.addEventListener('storage', (event) => {
    if (event.key === SESSION_KEY || event.key === null) render()
  })
})()
