// Two editions on one site. The page says which one it is with
// <html data-edition="futures|stocks|chooser">.
//
// - futures / stocks pages remember the edition last looked at, so the
//   chooser at the site root can mark it. The chooser never redirects on
//   that alone: shared links and search engines keep seeing the chooser.
// - Old links into the former homepage still land on the futures homepage,
//   which is where that content now lives: any link with a section anchor
//   (/#pricing, /#whop, …) and any English link (/?lang=en). The chooser has
//   no anchors of its own, and it is Chinese only.
// - The edition switcher in a page header opens and closes its menu.
(() => {
  const STORAGE_KEY = 'tradereplay-edition'
  const page = document.documentElement.dataset.edition

  if (page === 'chooser') {
    const params = new URLSearchParams(window.location.search)
    if (params.get('lang') === 'en' || window.location.hash.length > 1) {
      window.location.replace(`futures.html${window.location.search}${window.location.hash}`)
      return
    }
  }

  if (page === 'futures' || page === 'stocks') {
    try {
      window.localStorage.setItem(STORAGE_KEY, page)
    } catch {
      // Storage is optional; the chooser simply marks nothing.
    }
  }

  function markLastVisited() {
    let last = null
    try {
      last = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      return
    }
    if (last !== 'futures' && last !== 'stocks') return
    document.querySelector(`[data-edition-card="${last}"]`)?.classList.add('is-last')
  }

  function setupSwitchers() {
    document.querySelectorAll('[data-edition-switch]').forEach((root) => {
      const button = root.querySelector('[data-edition-toggle]')
      const menu = root.querySelector('[data-edition-menu]')
      if (!button || !menu) return

      const setOpen = (open) => {
        menu.hidden = !open
        button.setAttribute('aria-expanded', open ? 'true' : 'false')
      }

      button.addEventListener('click', (event) => {
        event.stopPropagation()
        setOpen(menu.hidden)
      })
      document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) setOpen(false)
      })
      root.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !menu.hidden) {
          setOpen(false)
          button.focus()
        }
      })
    })
  }

  function ready() {
    if (page === 'chooser') markLastVisited()
    setupSwitchers()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
  } else {
    ready()
  }
})()
