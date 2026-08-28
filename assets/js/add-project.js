/* =====================================================
   ADD / EDIT TEMPLATE JAVASCRIPT (INDEXEDDB POWERED)
   Jainal Abedin Portfolio
===================================================== */
(() => {
  const DB_NAME = 'JainalPortfolioDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'templates';

  const $ = selector => document.querySelector(selector);
  const form = $('#templateForm');
  const params = new URLSearchParams(window.location.search);
  const editingId = params.get('edit');
  let imageData = '';
  let existing = null;

  // IndexedDB ডাটাবেস ওপেন করার ফাংশন
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

  // সব টেমপ্লেট রিড করা
  async function getAllTemplates() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        // যদি IndexedDB খালি থাকে তবে লোকালস্টোরেজ থেকে মাইগ্রেট করা
        if (!req.result || req.result.length === 0) {
          try {
            const ls = JSON.parse(localStorage.getItem('jainalTemplates') || '[]');
            resolve(Array.isArray(ls) ? ls : []);
          } catch {
            resolve([]);
          }
        } else {
          resolve(req.result);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  // টেমপ্লেট সেভ বা আপডেট করা
  async function saveTemplateDB(record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(record);
      tx.oncomplete = () => {
        // লোকালস্টোরেজেও একটি লাইটওয়েট ব্যাকআপ সিঙ্ক রাখা
        try {
          const miniRecord = { ...record };
          if (miniRecord.image && miniRecord.image.length > 50000) {
            miniRecord.image = ''; 
          }
          const ls = JSON.parse(localStorage.getItem('jainalTemplates') || '[]');
          const idx = ls.findIndex(i => String(i.id) === String(record.id));
          if (idx >= 0) ls[idx] = miniRecord;
          else ls.unshift(miniRecord);
          localStorage.setItem('jainalTemplates', JSON.stringify(ls));
        } catch (_) {}
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  const toast = (message, icon = 'fa-circle-check') => {
    const t = $('#adminToast');
    if (!t) return;
    t.querySelector('i').className = `fa-solid ${icon}`;
    $('#toastMessage').textContent = message;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  };

  const updatePreview = () => {
    const name = $('#templateName').value.trim();
    const category = $('#templateCategory').value;
    const description = $('#templateDescription').value.trim();
    const tags = $('#templateTags').value.split(',').map(v => v.trim()).filter(Boolean);

    $('#previewName').textContent = name || 'Template name';
    $('#previewCategory').textContent = category || 'CATEGORY';
    $('#previewDescription').textContent = description || 'Your description will appear here.';
    $('#previewStatus').textContent = $('#templateStatus').value.toUpperCase();
    $('#previewStatus').style.background = $('#templateStatus').value === 'draft' ? 'rgba(146,64,14,.88)' : '';
    $('#previewTags').innerHTML = tags.slice(0, 3).map(tag => `<span>${tag.replace(/[&<>'"]/g, '')}</span>`).join('');
    $('#descriptionCount').textContent = $('#templateDescription').value.length;
  };

  const showImage = src => {
    imageData = src || '';
    const upload = $('#imageUpload');
    if ($('#imagePreview')) $('#imagePreview').src = imageData;
    if ($('#cardPreviewImage')) $('#cardPreviewImage').src = imageData;
    if (upload) upload.classList.toggle('has-image', Boolean(imageData));
    if ($('#cardPreviewImage')) $('#cardPreviewImage').parentElement.classList.toggle('has-image', Boolean(imageData));
    if ($('#removeImage')) $('#removeImage').hidden = !imageData;
  };

  // ইমেজ কম্প্রেস ও রিসাইজ
  function compressImage(base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) {
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

  const fileInput = $('#templateImage');
  if (fileInput) {
    fileInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast('Please select an image file.', 'fa-circle-exclamation');
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const compressed = await compressImage(reader.result);
        showImage(compressed);
      });
      reader.readAsDataURL(file);
    });
  }

  $('#removeImage')?.addEventListener('click', () => {
    if ($('#templateImage')) $('#templateImage').value = '';
    showImage('');
  });

  ['templateName', 'templateCategory', 'templateStatus', 'templateDescription', 'templateTags'].forEach(id => {
    $(`#${id}`)?.addEventListener('input', updatePreview);
    $(`#${id}`)?.addEventListener('change', updatePreview);
  });

  const uploadBox = $('#imageUpload');
  if (uploadBox) {
    uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('dragover'); });
    uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragover'));
    uploadBox.addEventListener('drop', async e => {
      e.preventDefault();
      uploadBox.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return toast('Please drop an image file.', 'fa-circle-exclamation');
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const compressed = await compressImage(reader.result);
        showImage(compressed);
      });
      reader.readAsDataURL(file);
    });
  }

  async function populateEdit() {
    if (!editingId) return;
    const list = await getAllTemplates();
    existing = list.find(item => String(item.id) === String(editingId));
    if (!existing) {
      toast('Template not found.', 'fa-circle-exclamation');
      return;
    }
    $('#templateName').value = existing.title || existing.name || '';
    const savedCategory = existing.category || '';
    if (savedCategory && ![...$('#templateCategory').options].some(o => o.value === savedCategory)) {
      const opt = document.createElement('option');
      opt.value = savedCategory;
      opt.textContent = savedCategory;
      $('#templateCategory').append(opt);
    }
    $('#templateCategory').value = savedCategory;
    $('#templateStatus').value = String(existing.status || 'published').toLowerCase() === 'draft' ? 'draft' : 'published';
    $('#templateDescription').value = existing.description || '';
    $('#templateTags').value = Array.isArray(existing.tags) ? existing.tags.join(', ') : (existing.tags || '');
    $('#templateUrl').value = existing.url || '';
    $('#githubUrl').value = existing.githubUrl || '';
    $('#otherUrl').value = existing.otherUrl || (existing.otherLinks && existing.otherLinks[0]) || '';
    showImage(existing.image || '');
    $('#pageTitle').innerHTML = 'Edit <span>template</span>';
    $('#breadcrumbTitle').textContent = 'Edit Template';
    $('#saveButtonText').textContent = 'Update Template';
    updatePreview();
  }

  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (!imageData) return toast('Please add one template image.', 'fa-circle-exclamation');

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

      const now = new Date().toISOString();
      const titleVal = $('#templateName').value.trim();
      const record = {
        ...(existing || {}),
        id: existing?.id || editingId || `template-${Date.now()}`,
        title: titleVal,
        name: titleVal,
        category: $('#templateCategory').value,
        description: $('#templateDescription').value.trim(),
        image: imageData,
        tags: $('#templateTags').value.split(',').map(v => v.trim()).filter(Boolean),
        status: $('#templateStatus').value,
        url: $('#templateUrl').value.trim(),
        githubUrl: $('#githubUrl').value.trim(),
        otherLinks: $('#otherUrl').value.trim() ? [$('#otherUrl').value.trim()] : [],
        createdAt: existing?.createdAt || now,
        updatedAt: now
      };

      try {
        await saveTemplateDB(record);
        toast(editingId ? 'Template updated successfully.' : 'Template saved successfully.');
        setTimeout(() => {
          window.location.href = 'templates.html';
        }, 700);
      } catch (err) {
        console.error('Save error:', err);
        toast('Database error! Failed to save.', 'fa-circle-exclamation');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Template`;
      }
    });
  }

  function setupSidebar() {
    const sidebar = $('#adminSidebar'), overlay = $('#sidebarOverlay');
    $('#sidebarToggle')?.addEventListener('click', () => { sidebar.classList.add('show', 'open'); overlay.classList.add('show'); });
    $('#sidebarClose')?.addEventListener('click', () => { sidebar.classList.remove('show', 'open'); overlay.classList.remove('show'); });
    overlay?.addEventListener('click', () => { sidebar.classList.remove('show', 'open'); overlay.classList.remove('show'); });
    $('#logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('adminLoggedIn');
      sessionStorage.removeItem('adminLoggedIn');
      window.location.href = 'login.html';
    });
  }

  populateEdit();
  updatePreview();
  setupSidebar();
})();
