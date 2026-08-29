/* =====================================================
   ADD / EDIT TEMPLATE SCRIPT
   Jainal Abedin Portfolio
===================================================== */
(() => {
  const DB_NAME = 'JainalPortfolioDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'templates';
  const STORAGE_KEY = 'jainalTemplates';

  const $ = selector => document.querySelector(selector);
  const form = $('#templateForm');
  let imageData = '';

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveTemplateToDB(template) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(template);
      tx.oncomplete = () => {
        try {
          const ls = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const index = ls.findIndex(item => String(item.id) === String(template.id));
          if (index !== -1) {
            ls[index] = template;
          } else {
            ls.unshift(template);
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(ls));
        } catch (e) {
          console.error("LocalStorage error:", e);
        }
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getTemplateById(id) {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) return resolve(req.result);
        try {
          const ls = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          resolve(ls.find(i => String(i.id) === String(id)) || null);
        } catch { resolve(null); }
      };
      req.onerror = () => resolve(null);
    });
  }

  const toast = (message, icon = 'fa-circle-check') => {
    const toastEl = $('#adminToast');
    if (!toastEl) return;
    toastEl.querySelector('i').className = `fa-solid ${icon}`;
    $('#toastMessage').textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
  };

  const showImage = src => {
    imageData = src || '';
    const upload = $('#imageUpload');
    const previewImg = $('#imagePreview');
    const cardImg = $('#cardPreviewImage');
    const previewWrap = $('.preview-image-wrap');
    const removeBtn = $('#removeImage');

    if (previewImg) previewImg.src = imageData;
    if (cardImg) cardImg.src = imageData;
    if (upload) upload.classList.toggle('has-image', Boolean(imageData));
    if (previewWrap) previewWrap.classList.toggle('has-image', Boolean(imageData));
    if (removeBtn) removeBtn.hidden = !imageData;
  };

  function updateLivePreview() {
    const nameVal = $('#templateName')?.value.trim() || 'Template name';
    const catVal = $('#templateCategory')?.value.trim() || 'CATEGORY';
    const descVal = $('#templateDescription')?.value.trim() || 'Your description will appear here.';
    const statusVal = $('#templateStatus')?.value.trim() || 'published';
    const tagsVal = $('#templateTags')?.value || '';

    if ($('#previewName')) $('#previewName').textContent = nameVal;
    if ($('#previewCategory')) $('#previewCategory').textContent = catVal.toUpperCase();
    if ($('#previewDescription')) $('#previewDescription').textContent = descVal;
    if ($('#previewStatus')) $('#previewStatus').textContent = statusVal.toUpperCase();

    if ($('#descriptionCount')) {
      $('#descriptionCount').textContent = $('#templateDescription')?.value.length || 0;
    }

    const tagsContainer = $('#previewTags');
    if (tagsContainer) {
      const tags = tagsVal.split(',').map(t => t.trim()).filter(Boolean);
      tagsContainer.innerHTML = tags.slice(0, 3).map(t => `<span>${t}</span>`).join('');
    }
  }

  function compressImage(base64Str, maxWidth = 800, maxHeight = 800, quality = 0.6) {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = function () {
        let canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  }

  // ইভেন্ট লিসেনার
  $('#templateName')?.addEventListener('input', updateLivePreview);
  $('#templateCategory')?.addEventListener('change', updateLivePreview);
  $('#templateStatus')?.addEventListener('change', updateLivePreview);
  $('#templateDescription')?.addEventListener('input', updateLivePreview);
  $('#templateTags')?.addEventListener('input', updateLivePreview);

  $('#templateImage')?.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      const compressed = await compressImage(reader.result);
      showImage(compressed);
    });
    reader.readAsDataURL(file);
  });

  $('#removeImage')?.addEventListener('click', () => {
    $('#templateImage').value = '';
    showImage('');
  });

  // ফর্ম সাবমিট
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      try {
        const titleVal = $('#templateName').value.trim();
        const templateData = {
          id: editId || `template-${Date.now()}`,
          title: titleVal,
          name: titleVal,
          category: $('#templateCategory').value,
          description: $('#templateDescription').value.trim(),
          image: imageData || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
          tags: $('#templateTags').value.split(',').map(v => v.trim()).filter(Boolean),
          status: $('#templateStatus').value,
          url: $('#templateUrl').value.trim(),
          githubUrl: $('#githubUrl')?.value.trim() || '',
          otherLinks: $('#otherUrl')?.value.trim() ? [$('#otherUrl').value.trim()] : [],
          createdAt: new Date().toISOString()
        };

        await saveTemplateToDB(templateData);

        toast(editId ? 'Template updated successfully!' : 'Template added successfully!');
        setTimeout(() => {
          window.location.href = 'templates.html';
        }, 1000);

      } catch (error) {
        console.error(error);
        toast(`Error: ${error.message}`, 'fa-circle-exclamation');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // এডিট মোড ইনিশিয়ালাইজেশন
  async function loadEditData() {
    if (!editId) return;
    if ($('#pageTitle')) $('#pageTitle').innerHTML = 'Edit <span>Template</span>';
    if ($('#breadcrumbTitle')) $('#breadcrumbTitle').textContent = 'Edit Template';
    if ($('#saveButtonText')) $('#saveButtonText').textContent = 'Update Template';

    const item = await getTemplateById(editId);
    if (!item) return;

    if ($('#templateName')) $('#templateName').value = item.title || item.name || '';
    if ($('#templateCategory')) $('#templateCategory').value = item.category || '';
    if ($('#templateStatus')) $('#templateStatus').value = item.status || 'published';
    if ($('#templateDescription')) $('#templateDescription').value = item.description || '';
    if ($('#templateTags')) $('#templateTags').value = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
    if ($('#templateUrl')) $('#templateUrl').value = item.url || '';
    if ($('#githubUrl')) $('#githubUrl').value = item.githubUrl || '';
    if ($('#otherUrl')) $('#otherUrl').value = (item.otherLinks && item.otherLinks[0]) || '';

    if (item.image) {
      showImage(item.image);
    }
    updateLivePreview();
  }

  // সাইডবার
  const sidebar = $('#adminSidebar'), overlay = $('#sidebarOverlay');
  $('#sidebarToggle')?.addEventListener('click', () => { sidebar?.classList.add('show', 'open'); overlay?.classList.add('show'); });
  $('#sidebarClose')?.addEventListener('click', () => { sidebar?.classList.remove('show', 'open'); overlay?.classList.remove('show'); });
  overlay?.addEventListener('click', () => { sidebar?.classList.remove('show', 'open'); overlay?.classList.remove('show'); });
  $('#logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  });

  loadEditData();
})();
