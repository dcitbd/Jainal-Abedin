async function getTemplates() {
    return new Promise((resolve) => {
        const req = indexedDB.open('JainalPortfolioDB', 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('templates')) {
                db.createObjectStore('templates', { keyPath: 'id' });
            }
        };
        req.onsuccess = () => {
            const tx = req.result.transaction('templates', 'readonly');
            const store = tx.objectStore('templates');
            const getAll = store.getAll();
            getAll.onsuccess = () => {
                if (getAll.result && getAll.result.length > 0) {
                    resolve(getAll.result);
                } else {
                    try {
                        const ls = JSON.parse(localStorage.getItem('jainalTemplates') || '[]');
                        resolve(Array.isArray(ls) ? ls : []);
                    } catch { resolve([]); }
                }
            };
            getAll.onerror = () => resolve([]);
        };
        req.onerror = () => {
            try {
                const ls = JSON.parse(localStorage.getItem('jainalTemplates') || '[]');
                resolve(Array.isArray(ls) ? ls : []);
            } catch { resolve([]); }
        };
    });
}
