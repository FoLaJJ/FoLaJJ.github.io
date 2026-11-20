(() => {
  let routesRequest;
  async function redirect() {
    const { hash } = window.location;
    if (!hash.startsWith('#/')) return;
    const fragment = hash.slice(2);
    const keyText = fragment.split(/[?#]/, 1)[0].replace(/\/$/, '').replace(/\.md$/i, '');
    const query = fragment.includes('?') ? fragment.slice(fragment.indexOf('?') + 1) : '';
    const anchor = new URLSearchParams(query).get('id');
    let key;
    try { key = decodeURIComponent(keyText); } catch { return; }
    if (!key) {
      window.history.replaceState(null, '', '/');
      return;
    }
    routesRequest ||= fetch('/site/legacy-routes.json').then(response => response.ok ? response.json() : {});
    try {
      const routes = await routesRequest;
      if (window.location.hash !== hash) return;
      const target = Object.hasOwn(routes, key) ? routes[key] : '/404.html';
      window.location.replace(target + (anchor ? '#' + encodeURIComponent(anchor) : ''));
    } catch {
      routesRequest = undefined;
    }
  }
  window.addEventListener('hashchange', redirect);
  redirect();
})();
