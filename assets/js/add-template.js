/* =====================================================
   ADD / EDIT TEMPLATE JAVASCRIPT (QUOTA & STORAGE FIXED)
   Jainal Abedin Portfolio
===================================================== */
(() => {
  const KEY = 'jainalTemplates';
  const $ = selector => document.querySelector(selector);
  const form = $('#templateForm');
  const params = new URLSearchParams(window.location.search);
  const editingId = params.get('edit');
  let imageData = '';
  let existing = null;

  const read = () => { try { const list = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(list) ? list : []; } catch { return []; } };
  const idOf = (item, index) => String(item.id || item.templateId || `template-${index}`);
  
  const toast = (message, icon = 'fa-circle-check') => { 
    $('#adminToast').querySelector('i').className = `fa-solid ${icon}`; 
    $('#toastMessage').textContent = message; 
    $('#adminToast').classList.add('show'); 
    setTimeout(() => $('#adminToast').classList.remove('show'), 2500); 
  };

  const updatePreview = () => { 
    const name = $('#templateName').value.trim();
    const category = $('#templateCategory').value; 
    const description = $('#templateDescription').value.trim(); 
    const tags = $('#templateTags').value.split(',').map(value => value.trim()).filter(Boolean); 
    
    $('#previewName').textContent = name || 'Template name'; 
    $('#previewCategory').textContent = category || 'CATEGORY'; 
    $('#previewDescription').textContent = description || 'Your description will appear here.'; 
    $('#previewStatus').textContent = $('#templateStatus').value.toUpperCase(); 
    $('#previewStatus').style.background = $('#templateStatus').value === 'draft' ? 'rgba(146,64,14,.88)' : ''; 
    $('#previewTags').innerHTML = tags.slice(0,3).map(tag => `<span>${tag.replace(/[&<>'"]/g, '')}</span>`).join(''); 
    $('#descriptionCount').textContent = $('#templateDescription').value.length; 
  };

  const showImage = src => { 
    imageData = src || ''; 
    const upload = $('#imageUpload'); 
    $('#imagePreview').src = imageData; 
    $('#cardPreviewImage').src = imageData; 
    upload.classList.toggle('has-image', Boolean(imageData)); 
    $('#cardPreviewImage').parentElement.classList.toggle('has-image', Boolean(imageData)); 
    $('#removeImage').hidden = !imageData; 
  };

  // ইমেজ কম্প্রেস ও সাইজ ছোট করার ফাংশন (QuotaExceededError রোধ করতে)
  function compressImage(base64Str, maxWidth = 600, maxHeight = 600, quality = 0.5) {
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

  $('#templateImage').addEventListener('change', event => { 
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

  $('#removeImage').addEventListener('click', () => { $('#templateImage').value = ''; showImage(''); });

  ['templateName','templateCategory','templateStatus','templateDescription','templateTags'].forEach(id => { 
    $(`#${id}`).addEventListener('input', updatePreview); 
    $(`#${id}`).addEventListener('change', updatePreview); 
  });

  $('#imageUpload').addEventListener('dragover', event => { event.preventDefault(); $('#imageUpload').classList.add('dragover'); });
  $('#imageUpload').addEventListener('dragleave', () => $('#imageUpload').classList.remove('dragover'));
  $('#imageUpload').addEventListener('drop', async event => { 
    event.preventDefault(); 
    $('#imageUpload').classList.remove('dragover'); 
    const file = event.dataTransfer.files[0]; 
    if (!file || !file.type.startsWith('image/')) return toast('Please drop an image file.', 'fa-circle-exclamation'); 
    const reader = new FileReader(); 
    reader.addEventListener('load', async () => {
      const compressed = await compressImage(reader.result);
      showImage(compressed);
    }); 
    reader.readAsDataURL(file); 
  });

  function populateEdit() { 
    if (!editingId) return; 
    const list = read(); 
    const index = list.findIndex((item, i) => idOf(item, i) === editingId); 
    if (index < 0) { 
      toast('Template not found.', 'fa-circle-exclamation'); 
      return; 
    } 
    existing = list[index]; 
    $('#templateName').value = existing.title || existing.name || existing.templateName || ''; 
    const savedCategory = existing.category || existing.type || ''; 
    
    if (savedCategory && ![...$('#templateCategory').options].some(option => option.value === savedCategory)) { 
      const option = document.createElement('option'); 
      option.value = savedCategory; 
      option.textContent = savedCategory; 
      $('#templateCategory').append(option); 
    } 
    
    $('#templateCategory').value = savedCategory; 
    $('#templateStatus').value = String(existing.status || 'published').toLowerCase() === 'draft' ? 'draft' : 'published'; 
    $('#templateDescription').value = existing.description || existing.shortDescription || existing.summary || ''; 
    $('#templateTags').value = Array.isArray(existing.tags) ? existing.tags.join(', ') : (existing.tags || existing.technology || ''); 
    $('#templateUrl').value = existing.url || existing.liveUrl || existing.templateUrl || existing.link || ''; 
    $('#githubUrl').value = existing.githubUrl || existing.github || ''; 
    $('#otherUrl').value = existing.otherUrl || (existing.otherLinks && existing.otherLinks[0]) || ''; 
    
    showImage(existing.image || existing.thumbnail || existing.coverImage || existing.previewImage || ''); 
    $('#pageTitle').innerHTML = 'Edit <span>template</span>'; 
    $('#breadcrumbTitle').textContent = 'Edit Template'; 
    $('#saveButtonText').textContent = 'Update Template'; 
    updatePreview(); 
  }

  form.addEventListener('submit', async event => { 
    event.preventDefault(); 
    if (!form.reportValidity()) return; 
    if (!imageData) return toast('Please add one template image.', 'fa-circle-exclamation'); 
    
    const now = new Date().toISOString(); 
    const newId = typeof globalThis.crypto?.randomUUID === 'function' ? globalThis.crypto.randomUUID() : `template-${Date.now()}`; 
    const titleVal = $('#templateName').value.trim();

    const record = { 
      ...(existing || {}), 
      id: existing?.id || existing?.templateId || editingId || newId, 
      title: titleVal, 
      name: titleVal, 
      category: $('#templateCategory`').value || $('#templateCategory').value, 
      description: $('#templateDescription').value.trim(), 
      image: imageData, 
      tags: $('#templateTags').value.split(',').map(value => value.trim()).filter(Boolean), 
      status: $('#templateStatus').value, 
      url: $('#templateUrl').value.trim(), 
      githubUrl: $('#githubUrl').value.trim(), 
      otherLinks: $('#otherUrl').value.trim() ? [$('#otherUrl').value.trim()] : [], 
      createdAt: existing?.createdAt || now, 
      updatedAt: now 
    }; 

    const list = read(); 
    const index = editingId ? list.findIndex((item, i) => idOf(item, i) === editingId) : -1; 
    
    if (index >= 0) list[index] = record; 
    else list.unshift(record); 
    
    try {
      localStorage.setItem(KEY, JSON.stringify(list)); 
      toast(editingId ? 'Template updated successfully.' : 'Template saved successfully.'); 
      
      setTimeout(() => { 
        window.location.href = 'templates.html'; 
      }, 700); 
    } catch (e) {
      console.error("Storage quota error:", e);
      toast('Storage full! Please use a smaller image file.', 'fa-circle-exclamation');
    }
  });

  function setupSidebar() { 
    const sidebar = $('#adminSidebar'), overlay = $('#sidebarOverlay'), open = () => { sidebar.classList.add('show','open'); overlay.classList.add('show'); }, close = () => { sidebar.classList.remove('show','open'); overlay.classList.remove('show'); }; 
    $('#sidebarToggle')?.addEventListener('click', open); 
    $('#sidebarClose')?.addEventListener('click', close); 
    overlay?.addEventListener('click', close); 
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
