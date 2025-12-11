(function () {
  const STORAGE_KEY = 'moonshine_layouts_clipboard';

  function parseName(name) {
    return name.match(/[^[\]]+/g) || [];
  }

  function isNumericKey(key) {
    return key !== '' && !Number.isNaN(Number(key));
  }

  function setDeep(target, path, value) {
    let current = target;

    for (let i = 0; i < path.length; i++) {
      const rawKey = path[i];
      const key = isNumericKey(rawKey) ? Number(rawKey) : rawKey;
      const isLast = i === path.length - 1;

      if (isLast) {
        current[key] = value;
        return;
      }

      const nextRaw = path[i + 1];
      const nextIsIndex = isNumericKey(nextRaw);

      if (current[key] === undefined) {
        current[key] = nextIsIndex ? [] : {};
      }

      current = current[key];
    }
  }

  function collectValues(blockEl) {
    const values = {};
    const elements = blockEl.querySelectorAll('input, select, textarea');

    elements.forEach((el) => {
      if (!el.name) return;
      if (el.type === 'file') return;
      if (el.name.endsWith('[_layout]')) return;

      const tokens = parseName(el.name);
      if (tokens.length < 3) return;

      const path = tokens
        .slice(2)
        .flatMap((p) => p.split('.'))
        .map((segment) =>
          typeof segment === 'string' && segment.startsWith('hidden_')
            ? segment.replace(/^hidden_/, '')
            : segment
        );

      let v;
      if (el.type === 'checkbox') {
        v = el.checked ? (el.value !== '' ? el.value : 1) : 0;
      } else if (el.type === 'radio') {
        if (!el.checked) return;
        v = el.value;
      } else if (el.tagName === 'SELECT' && el.multiple) {
        v = Array.from(el.selectedOptions).map((o) => o.value);
      } else {
        v = el.value;
      }

      // If MoonShine rendered multiple hidden_* inputs without indexes, merge into array
      const leafKey = path[path.length - 1];
      if (
        typeof leafKey === 'string' &&
        el.name.includes('[hidden_') &&
        path.length === 1 &&
        Object.prototype.hasOwnProperty.call(values, leafKey)
      ) {
        const existing = values[leafKey];
        values[leafKey] = Array.isArray(existing) ? [...existing, v] : [existing, v];
        return;
      }

      setDeep(values, path, v);
    });

    return values;
  }

  function findRoot(el) {
    return (
      el.closest('[data-layouts-add-route]') ||
      document.querySelector('[data-layouts-add-route]')
    );
  }

  function toast(message, type = 'success') {
    if (window.MoonShine?.toast) {
      window.MoonShine.toast(message, type);
      return;
    }

    console.log(message);
  }

  async function pasteIntoRoot(rootEl, data) {
    const pasteUrl = rootEl.dataset.layoutsPasteRoute;
    const addUrl = rootEl.dataset.layoutsAddRoute;
    const url = pasteUrl || addUrl;
    const column = rootEl.dataset.layoutsColumn;

    if (!url || !column) {
      toast('Paste route missing', 'error');
      return;
    }

    const layoutsCount = {};
    rootEl.querySelectorAll('._layout-value').forEach((l) => {
      const n = l.value;
      layoutsCount[n] = (layoutsCount[n] || 0) + 1;
    });

    const csrf = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
      },
      body: JSON.stringify({
        field: column,
        name: data.name,
        values: data.values,
        counts: layoutsCount,
      }),
      credentials: 'same-origin',
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok || json?.toastType === 'error') {
      toast(json?.message || json?.toast || 'Unable to paste block', 'error');
      return;
    }

    const html = json?.html || json?.htmlData?.[0]?.html;
    if (!html) {
      toast('No block HTML returned', 'error');
      return;
    }

    const temp = document.createElement('div');
    temp.innerHTML = html;

    const blocksContainer = rootEl.querySelector('._layouts-blocks');
    if (!blocksContainer) return;

    while (temp.firstChild) {
      blocksContainer.appendChild(temp.firstChild);
    }

    if (window.MoonShine?.iterable?.reindex) {
      window.MoonShine.iterable.reindex(blocksContainer, '._layouts-block');
    }

    if (window.Alpine?.initTree) {
      window.Alpine.initTree(blocksContainer);
    }

    toast('Block pasted');
  }

  function copyHandler(event) {
    const copyBtn = event.target.closest('._layouts-copy-btn');
    const blockEl = event.target.closest('._layouts-block');
    if (!blockEl) return;

    const layoutName =
      copyBtn?.dataset?.layoutName ||
      blockEl.querySelector('input._layout-value')?.value;
    if (!layoutName) {
      toast('Layout type not found', 'error');
      return;
    }

    const values = collectValues(blockEl);
    const data = { name: layoutName, values };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(JSON.stringify(data)).catch(() => {});
    }

    toast('Block copied');
  }

  async function pasteHandler(event) {
    const rootEl = findRoot(event.target);
    if (!rootEl) return;

    let text = null;

    try {
      text = localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore
    }

    if (!text && navigator?.clipboard?.readText) {
      try {
        text = await navigator.clipboard.readText();
      } catch {
        // ignore
      }
    }

    if (!text) {
      toast('Clipboard is empty', 'error');
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }

    if (!data?.name || typeof data.values !== 'object') {
      toast('Clipboard data is invalid', 'error');
      return;
    }

    await pasteIntoRoot(rootEl, data);
  }

  // Expose for Alpine button click
  window.KjtLayoutsClipboard = {
    copy: copyHandler,
    paste: pasteHandler,
  };

  // Fallback delegation (paste button is outside Alpine scope)
  document.addEventListener('click', (e) => {
    if (e.target.closest('._layouts-paste-btn')) {
      pasteHandler(e);
    }
  });
})();
