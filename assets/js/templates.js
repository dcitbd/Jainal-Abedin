/* Frontend-only template store shared by the admin pages. */
(function () {
    const KEY = 'jainalPortfolioTemplates';
    const DEFAULTS = [
        { id: 'tpl-agency', name: 'Agency Launch', category: 'Business', status: 'published', description: 'A refined company profile and services showcase.', tags: ['Business', 'Responsive'], preview: '', updatedAt: '2026-08-20T10:00:00.000Z' },
        { id: 'tpl-creative', name: 'Creative Portfolio', category: 'Portfolio', status: 'draft', description: 'A visual-first personal portfolio for designers and creators.', tags: ['Portfolio', 'Dark'], preview: '', updatedAt: '2026-08-18T10:00:00.000Z' }
    ];

    function read() {
        try {
            const records = JSON.parse(localStorage.getItem(KEY));
            return Array.isArray(records) ? records : DEFAULTS;
        } catch (_) { return DEFAULTS; }
    }
    function write(records) { localStorage.setItem(KEY, JSON.stringify(records)); }
    function id() { return 'tpl-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
    function escape(value) {
        const node = document.createElement('span');
        node.textContent = value || '';
        return node.innerHTML;
    }
    function date(value) { return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)); }
    function toast(message, type) {
        let el = document.querySelector('.template-toast');
        if (!el) { el = document.createElement('div'); el.className = 'template-toast'; document.body.appendChild(el); }
        el.className = 'template-toast is-visible ' + (type || 'success');
        el.innerHTML = '<i class="fa-solid fa-' + (type === 'error' ? 'circle-exclamation' : 'circle-check') + '"></i><span>' + escape(message) + '</span>';
        window.clearTimeout(toast.timer); toast.timer = window.setTimeout(() => el.classList.remove('is-visible'), 2800);
    }
    function templateCard(record, compact) {
        const tags = record.tags.slice(0, 3).map(tag => '<span>' + escape(tag) + '</span>').join('');
        return '<article class="template-card" data-id="' + record.id + '"><div class="template-preview">' +
            (record.preview ? '<img src="' + escape(record.preview) + '" alt="' + escape(record.name) + ' preview">' : '<i class="fa-solid fa-wand-magic-sparkles"></i>') +
            '<span class="template-status ' + record.status + '">' + escape(record.status) + '</span></div><div class="template-card-body">' +
            '<div class="template-card-heading"><div><span class="template-category">' + escape(record.category) + '</span><h3>' + escape(record.name) + '</h3></div>' +
            '<button class="icon-action template-menu" aria-label="Template actions"><i class="fa-solid fa-ellipsis"></i></button></div>' +
            (compact ? '' : '<p>' + escape(record.description) + '</p><div class="template-tags">' + tags + '</div>') +
            '<div class="template-card-footer"><small>Updated ' + date(record.updatedAt) + '</small><div class="template-actions"><a href="customer-viewer.html?id=' + record.id + '" title="View"><i class="fa-regular fa-eye"></i></a><a href="add-template.html?id=' + record.id + '" title="Edit"><i class="fa-regular fa-pen-to-square"></i></a><button class="delete-template" title="Delete"><i class="fa-regular fa-trash-can"></i></button></div></div></div></article>';
    }
    function bindDelete(container, after) {
        container.addEventListener('click', event => {
            const button = event.target.closest('.delete-template');
            if (!button) return;
            const card = button.closest('[data-id]');
            const record = read().find(item => item.id === card.dataset.id);
            if (record && window.confirm('Delete “' + record.name + '”? This cannot be undone.')) {
                write(read().filter(item => item.id !== record.id)); toast('Template deleted.'); after();
            }
        });
    }
    window.TemplateStore = { KEY, read, write, id, escape, date, toast, templateCard, bindDelete };
}());
