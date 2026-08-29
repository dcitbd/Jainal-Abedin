/* =====================================================
   ADMIN TEMPLATES LIST JAVASCRIPT
   Jainal Abedin Portfolio
===================================================== */
(() => {
  const DB_NAME = 'JainalPortfolioDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'templates';
  const STORAGE_KEY = 'jainalTemplates';

  const $ = selector => document.querySelector(selector);
  const grid = $('#templatesGrid');
  const empty = $('#emptyTemplates');
  const search = $('#templateSearch');
  const category = $('#categoryFilter');
  const status = $('#statusFilter');
  const clear = $('#clearFilters');
  const result = $('#resultText');
  const modal = $('#previewModal');
  let templates = [];

  const escapeHtml = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  const safeUrl = (v = '') => /^(https?:|data:image\/|\.\.\/|\.\/|\/)/i.test(String(v)) ? String(v) : '';

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function fetchTemplates() {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = async () => {
        let list = req.result || [];
        if (list.length === 0) {
          try {
            const ls = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (ls.length > 0) {
              list = ls;
              const writeTx = db.transaction(STORE_NAME, 'readwrite');
              list.forEach(item => writeTx.objectStore(STORE_NAME).put(item));
            }
          } catch { list = []; }
        }
        resolve(list.map((item, index) => ({
          id: item.id || `template-${index}`,
          title: item.title || item.name || 'Untitled template',
          category: item.category || 'Uncategorized',
          status: String(item.status || 'published').toLowerCase() === 'draft' ? 'draft' : 'published',
          description: item.description || 'No description added yet.',
          image: item.image || '',
          tags: Array.isArray(item.tags) ? item.tags : String(item.tags || '').split(',').map(t => t.trim()).filter(Boolean),
          url: item.url || '',
          createdAt: item.createdAt || new Date().toISOString()
        })));
      };
      req.onerror = () => resolve([]);
    });
  }

  async function deleteTemplateDB(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => {
        try {
          const ls = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const filtered = ls.filter(i => String(i.id) !== String(id));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        } catch (_) {}
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  function updateCategoryOptions() {
    const selected = category.value;
    const categories = [...new Set(templates.map(i => i.category).filter(Boolean))].sort();
    category.innerHTML = '<option value="">All categories</option>' + categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    category.value = categories.includes(selected) ? selected : '';
  }

  function filteredTemplates() {
    const term = search.value.trim().toLowerCase();
    return templates.filter(item =>
      (!term || [item.title, item.category, item.description, ...item.tags].join(' ').toLowerCase().includes(term)) &&
      (!category.value || item.category.toLowerCase() === category.value.toLowerCase()) &&
      (!status.value || item.status === status.value)
    );
  }

  function imageMarkup(item) {
    const src = safeUrl(item.image);
    return src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)}" onerror="this.remove()">` : '<div class="template-thumb-placeholder"><i class="fa-regular fa-image"></i></div>';
  }

  function render() {
    const list = filteredTemplates();
    clear.classList.toggle('visible', Boolean(search.value || category.value || status.value));
    if ($('#totalTemplates')) $('#totalTemplates').textContent = templates.length;
    if ($('#publishedTemplates')) $('#publishedTemplates').textContent = templates.filter(i => i.status === 'published').length;
    if ($('#draftTemplates')) $('#draftTemplates').textContent = templates.filter(i => i.status === 'draft').length;
    if (result) result.textContent = templates.length ? `${list.length} of ${templates.length} templates shown` : 'Your saved template collection';

    grid.innerHTML = list.map(item => `
      <article class="template-card">
        <div class="template-thumb">${imageMarkup(item)}<span class="template-status ${item.status}">${item.status}</span></div>
        <div class="template-card-body">
          <div class="template-card-meta"><span>${escapeHtml(item.category)}</span><span>${item.createdAt ? escapeHtml(String(item.createdAt).slice(0, 10)) : 'TEMPLATE'}</span></div>
          <h3 title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          <div class="template-tags">${item.tags.slice(0, 3).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
          <div class="template-actions">
            <button class="template-action" type="button" data-action="preview" data-id="${escapeHtml(item.id)}" title="Preview"><i class="fa-regular fa-eye"></i></button>
            <button class="template-action" type="button" data-action="view" data-id="${escapeHtml(item.id)}" title="View"><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
            <button class="template-action" type="button" data-action="edit" data-id="${escapeHtml(item.id)}" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="template-action delete" type="button" data-action="delete" data-id="${escapeHtml(item.id)}" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </article>
    `).join('');

    empty.hidden = list.length > 0;
    if ($('#emptyMessage')) $('#emptyMessage').textContent = templates.length && !list.length ? 'No template matches your current filters.' : 'Add your first template to start building your collection.';
  }

  function toast(message, icon = 'fa-circle-check') {
    const t = $('#adminToast');
    if (!t) return;
    t.querySelector('i').className = `fa-solid ${icon}`;
    $('#toastMessage').textContent = message;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  function openPreview(item) {
    const src = safeUrl(item.image);
    $('#previewContent').innerHTML = `
      ${src ? `<img class="preview-image" src="${escapeHtml(src)}" alt="${escapeHtml(item.title)}">` : '<div class="preview-image template-thumb-placeholder"><i class="fa-regular fa-image"></i></div>'}
      <div class="preview-modal-body">
        <span class="preview-category">${escapeHtml(item.category)} · ${escapeHtml(item.status)}</span>
        <h2 id="previewTitle">${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description)}</p>
        ${item.tags.length ? `<div class="template-tags" style="margin-top:10px;">${item.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        ${safeUrl(item.url) ? `<a class="preview-link" href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open live template</a>` : ''}
      </div>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  grid.addEventListener('click', async event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const item = templates.find(i => String(i.id) === String(button.dataset.id));
    if (!item) return;

    if (button.dataset.action === 'preview') openPreview(item);
    if (button.dataset.action === 'view') {
      const dest = safeUrl(item.url) || `../assets/pages/templates.html`;
      window.open(dest, '_blank', 'noopener');
    }
    if (button.dataset.action === 'edit') window.location.href = `add-template.html?edit=${encodeURIComponent(item.id)}`;
    if (button.dataset.action === 'delete') {
      if (confirm(`Delete “${item.title}”? This cannot be undone.`)) {
        await deleteTemplateDB(item.id);
        templates = await fetchTemplates();
        updateCategoryOptions();
        render();
        toast('Template deleted.');
      }
    }
  });

  [search, category, status].forEach(input => {
    input?.addEventListener('input', render);
    input?.addEventListener('change', render);
  });

  clear?.addEventListener('click', () => {
    search.value = ''; category.value = ''; status.value = '';
    render();
  });

  modal?.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  async function init() {
    templates = await fetchTemplates();
    updateCategoryOptions();
    render();
  }

  function setupSidebar() {
    const sidebar = $('#adminSidebar'), overlay = $('#sidebarOverlay');
    $('#sidebarToggle')?.addEventListener('click', () => { sidebar?.classList.add('show', 'open'); overlay?.classList.add('show'); });
    $('#sidebarClose')?.addEventListener('click', () => { sidebar?.classList.remove('show', 'open'); overlay?.classList.remove('show'); });
    overlay?.addEventListener('click', () => { sidebar?.classList.remove('show', 'open'); overlay?.classList.remove('show'); });
    $('#logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('adminLoggedIn');
      sessionStorage.removeItem('adminLoggedIn');
      window.location.href = 'login.html';
    });
  }

  init();
  setupSidebar();
})();
