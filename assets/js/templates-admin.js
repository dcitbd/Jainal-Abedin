/* Reads the same localStorage collection used by the public Templates page. */
(() => {
  const STORAGE_KEY = 'jainalTemplates';
  const $ = (selector) => document.querySelector(selector);
  const grid = $('#templatesGrid');
  const empty = $('#emptyTemplates');
  const search = $('#templateSearch');
  const category = $('#categoryFilter');
  const status = $('#statusFilter');
  const clear = $('#clearFilters');
  const result = $('#resultText');
  const modal = $('#previewModal');
  let templates = [];

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const safeUrl = (value = '') => /^(https?:|data:image\/|\.\.\/|\.\/|\/)/i.test(String(value)) ? String(value) : '';
  const normalise = (item, index) => ({
    id: item.id || item.templateId || `template-${index}`,
    title: item.title || item.name || item.templateName || 'Untitled template',
    category: item.category || item.type || 'Uncategorized',
    status: String(item.status || (item.published === false ? 'draft' : 'published')).toLowerCase() === 'draft' ? 'draft' : 'published',
    description: item.description || item.shortDescription || item.summary || 'No description added yet.',
    image: item.image || item.thumbnail || item.coverImage || item.previewImage || '',
    tags: Array.isArray(item.tags) ? item.tags : (Array.isArray(item.technologies) ? item.technologies : String(item.tags || item.technology || '').split(',').map(tag => tag.trim()).filter(Boolean)),
    url: item.url || item.liveUrl || item.templateUrl || item.link || '',
    createdAt: item.createdAt || item.date || ''
  });
  function readTemplates() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(saved) ? saved.map(normalise) : []; } catch { return []; } }
  function updateCategoryOptions() { const selected = category.value; const categories = [...new Set(templates.map(item => item.category).filter(Boolean))].sort(); category.innerHTML = '<option value="">All categories</option>' + categories.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join(''); category.value = categories.includes(selected) ? selected : ''; }
  function filteredTemplates() { const term = search.value.trim().toLowerCase(); return templates.filter(item => (!term || [item.title,item.category,item.description,...item.tags].join(' ').toLowerCase().includes(term)) && (!category.value || item.category === category.value) && (!status.value || item.status === status.value)); }
  function imageMarkup(item) { const src = safeUrl(item.image); return src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)}" onerror="this.remove()">` : '<div class="template-thumb-placeholder"><i class="fa-regular fa-image"></i></div>'; }
  function render() { const list = filteredTemplates(); const active = Boolean(search.value || category.value || status.value); clear.classList.toggle('visible', active); $('#totalTemplates').textContent = templates.length; $('#publishedTemplates').textContent = templates.filter(item => item.status === 'published').length; $('#draftTemplates').textContent = templates.filter(item => item.status === 'draft').length; result.textContent = templates.length ? `${list.length} of ${templates.length} template${templates.length === 1 ? '' : 's'} shown` : 'Your saved template collection'; grid.innerHTML = list.map(item => `<article class="template-card"><div class="template-thumb">${imageMarkup(item)}<span class="template-status ${item.status}">${item.status}</span></div><div class="template-card-body"><div class="template-card-meta"><span>${escapeHtml(item.category)}</span><span>${item.createdAt ? escapeHtml(String(item.createdAt).slice(0,10)) : 'TEMPLATE'}</span></div><h3 title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><div class="template-tags">${item.tags.slice(0,3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div><div class="template-actions"><button class="template-action" type="button" data-action="preview" data-id="${escapeHtml(item.id)}" title="Preview"><i class="fa-regular fa-eye"></i></button><button class="template-action" type="button" data-action="view" data-id="${escapeHtml(item.id)}" title="View public template"><i class="fa-solid fa-arrow-up-right-from-square"></i></button><button class="template-action" type="button" data-action="edit" data-id="${escapeHtml(item.id)}" title="Edit"><i class="fa-regular fa-pen-to-square"></i></button><button class="template-action delete" type="button" data-action="delete" data-id="${escapeHtml(item.id)}" title="Delete"><i class="fa-regular fa-trash-can"></i></button></div></div></article>`).join(''); empty.hidden = list.length > 0; $('#emptyMessage').textContent = templates.length && !list.length ? 'No template matches your current filters.' : 'Add your first template to start building your collection.'; }
  function toast(message, icon = 'fa-circle-check') { $('#adminToast').querySelector('i').className = `fa-solid ${icon}`; $('#toastMessage').textContent = message; $('#adminToast').classList.add('show'); window.setTimeout(() => $('#adminToast').classList.remove('show'), 2800); }
  function find(id) { return templates.find(item => String(item.id) === String(id)); }
  function openPreview(item) { const src = safeUrl(item.image); $('#previewContent').innerHTML = `${src ? `<img class="preview-image" src="${escapeHtml(src)}" alt="${escapeHtml(item.title)}">` : '<div class="preview-image template-thumb-placeholder"><i class="fa-regular fa-image"></i></div>'}<div class="preview-modal-body"><span class="preview-category">${escapeHtml(item.category)} · ${escapeHtml(item.status)}</span><h2 id="previewTitle">${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description)}</p>${item.tags.length ? `<div class="template-tags">${item.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}${safeUrl(item.url) ? `<a class="preview-link" href="${escapeHtml(safeUrl(item.url))}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open live template</a>` : ''}</div>`; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
  function remove(id) { const item = find(id); if (!item || !window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return; const raw = readTemplates(); const retained = raw.filter((entry, index) => String(normalise(entry,index).id) !== String(id)); localStorage.setItem(STORAGE_KEY, JSON.stringify(retained)); templates = readTemplates(); updateCategoryOptions(); render(); toast('Template deleted.'); }
  grid.addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (!button) return; const item = find(button.dataset.id); if (!item) return; if (button.dataset.action === 'preview') openPreview(item); if (button.dataset.action === 'view') { const destination = safeUrl(item.url) || `../assets/pages/templates.html#${encodeURIComponent(item.id)}`; window.open(destination, '_blank', 'noopener'); } if (button.dataset.action === 'edit') window.location.href = `add-template.html?edit=${encodeURIComponent(item.id)}`; if (button.dataset.action === 'delete') remove(item.id); });
  [search, category, status].forEach(input => { input.addEventListener('input', render); input.addEventListener('change', render); });
  clear.addEventListener('click', () => { search.value = ''; category.value = ''; status.value = ''; render(); });
  modal.addEventListener('click', event => { if (event.target.closest('[data-close-modal]')) { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); } });
  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY) { templates = readTemplates(); updateCategoryOptions(); render(); } });
  function setupSidebar() { const sidebar = $('#adminSidebar'), overlay = $('#sidebarOverlay'), open = () => { sidebar.classList.add('show','open'); overlay.classList.add('show'); }, close = () => { sidebar.classList.remove('show','open'); overlay.classList.remove('show'); }; $('#sidebarToggle')?.addEventListener('click',open); $('#sidebarClose')?.addEventListener('click',close); overlay?.addEventListener('click',close); $('#logoutBtn')?.addEventListener('click',() => { localStorage.removeItem('adminLoggedIn'); sessionStorage.removeItem('adminLoggedIn'); window.location.href = 'login.html'; }); }
  templates = readTemplates(); updateCategoryOptions(); render(); setupSidebar();
})();
