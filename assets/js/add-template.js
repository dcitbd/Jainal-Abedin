/* =====================================================
   ADD TEMPLATE - DIRECT GITHUB API INTEGRATION
   Jainal Abedin Portfolio
===================================================== */
(() => {
  // আপনার GitHub কনফিগারেশন সেট করুন
  const GITHUB_CONFIG = {
    username: "YOUR_GITHUB_USERNAME", // আপনার GitHub ইউজারনেম
    repo: "YOUR_REPOSITORY_NAME",     // আপনার রিপোজিটরির নাম
    branch: "main",                   // ব্রাঞ্চের নাম (main/master)
    filePath: "templates-data.json",  // JSON ফাইলের পাথ
    token: "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN" // GitHub Fine-grained বা Personal Access Token (repo scope সহ)
  };

  const $ = selector => document.querySelector(selector);
  const form = $('#templateForm');
  let imageData = '';

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
    if ($('#imagePreview')) $('#imagePreview').src = imageData;
    if ($('#cardPreviewImage')) $('#cardPreviewImage').src = imageData;
    if (upload) upload.classList.toggle('has-image', Boolean(imageData));
    if ($('#removeImage')) $('#removeImage').hidden = !imageData;
  };

  // ইমেজ সাইজ অপ্টিমাইজেশন
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

  // ইমেজ সিলেক্ট হ্যান্ডলার
  const fileInput = $('#templateImage');
  if (fileInput) {
    fileInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        const compressed = await compressImage(reader.result);
        showImage(compressed);
      });
      reader.readAsDataURL(file);
    });
  }

  // GitHub থেকে বর্তমান ফাইল ডাটা এবং SHA নিয়ে আসা
  async function getFileFromGitHub() {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}?ref=${GITHUB_CONFIG.branch}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 404) {
      return { content: [], sha: null };
    }

    if (!response.ok) {
      throw new Error(`GitHub Fetch Error: ${response.statusText}`);
    }

    const data = await response.json();
    const decodedContent = decodeURIComponent(escape(atob(data.content)));
    return {
      content: JSON.parse(decodedContent || '[]'),
      sha: data.sha
    };
  }

  // GitHub API দিয়ে নতুন ডাটা কমিট ও পুশ করা
  async function saveToGitHub(newContentList, fileSha) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;
    const stringContent = JSON.stringify(newContentList, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(stringContent)));

    const body = {
      message: `Add new template: ${$('#templateName').value.trim()}`,
      content: encodedContent,
      branch: GITHUB_CONFIG.branch
    };

    if (fileSha) {
      body.sha = fileSha;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to commit to GitHub');
    }

    return await response.json();
  }

  // ফর্ম সাবমিশন
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving to GitHub...`;

      try {
        const { content: currentTemplates, sha } = await getFileFromGitHub();

        const titleVal = $('#templateName').value.trim();
        const newTemplate = {
          id: `template-${Date.now()}`,
          title: titleVal,
          name: titleVal,
          category: $('#templateCategory').value,
          description: $('#templateDescription').value.trim(),
          image: imageData || 'https://via.placeholder.com/600x400',
          tags: $('#templateTags').value.split(',').map(v => v.trim()).filter(Boolean),
          status: $('#templateStatus').value,
          url: $('#templateUrl').value.trim(),
          githubUrl: $('#githubUrl').value.trim(),
          otherLinks: $('#otherUrl').value.trim() ? [$('#otherUrl').value.trim()] : [],
          createdAt: new Date().toISOString()
        };

        currentTemplates.unshift(newTemplate);

        await saveToGitHub(currentTemplates, sha);

        // লোকালস্টোরেজ ক্যাশ ব্যাকআপ
        localStorage.setItem('jainalTemplates', JSON.stringify(currentTemplates));

        toast('Template successfully published to GitHub!');
        setTimeout(() => {
          window.location.href = 'templates.html';
        }, 1200);

      } catch (error) {
        console.error('GitHub Sync Error:', error);
        toast(`Error: ${error.message}`, 'fa-circle-exclamation');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
})();
