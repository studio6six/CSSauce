document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // --- Override Logic ---
    const overridesList = document.getElementById('saved-overrides-list');
    const activeOverridesList = document.getElementById('active-overrides-list');
    const addCurrentUrlBtn = document.getElementById('add-current-url-btn');
    const editorContainer = document.getElementById('editor-container');
    const urlInput = document.getElementById('url-pattern');
    const cssInput = document.getElementById('custom-css');
    const saveBtn = document.getElementById('save-override-btn');
    const cancelBtn = document.getElementById('cancel-override-btn');

    let isEditing = false;
    let editingId = null;

    loadOverrides();

    addCurrentUrlBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            const url = new URL(currentTab.url);
            // Default to origin to be helpful, or full href
            urlInput.value = url.origin;
            cssInput.value = '';
            showEditor(true);
            isEditing = false;
            editingId = null;
        });
    });

    cancelBtn.addEventListener('click', () => {
        showEditor(false);
    });

    saveBtn.addEventListener('click', () => {
        const urlPattern = urlInput.value.trim();
        const cssContent = cssInput.value.trim();

        if (!urlPattern || !cssContent) {
            alert("Please provide both URL Pattern and CSS.");
            return;
        }

        chrome.storage.sync.get(['overrides'], (result) => {
            let overrides = result.overrides || [];

            if (isEditing && editingId) {
                const index = overrides.findIndex(o => o.id === editingId);
                if (index !== -1) {
                    overrides[index] = { ...overrides[index], url: urlPattern, css: cssContent };
                }
            } else {
                overrides.push({
                    id: Date.now().toString(),
                    url: urlPattern,
                    css: cssContent,
                    enabled: true,
                    createdAt: new Date().toISOString()
                });
            }

            chrome.storage.sync.set({ overrides: overrides }, () => {
                showEditor(false);
                loadOverrides();
                notifyContentScript();
            });
        });
    });

    function showEditor(show) {
        if (show) {
            editorContainer.classList.remove('hidden');
            addCurrentUrlBtn.classList.add('hidden');
        } else {
            editorContainer.classList.add('hidden');
            addCurrentUrlBtn.classList.remove('hidden');
        }
    }

    function loadOverrides() {
        chrome.storage.sync.get(['overrides'], (result) => {
            const overrides = result.overrides || [];
            renderOverridesList(overrides);
            checkActiveOverrides(overrides);
        });
    }

    function renderOverridesList(overrides) {
        overridesList.innerHTML = '';
        if (overrides.length === 0) {
            overridesList.innerHTML = '<li class="empty-state">No overrides configured.</li>';
            return;
        }

        overrides.forEach(override => {
            const li = document.createElement('li');
            li.classList.add('override-item');

            const info = document.createElement('div');
            info.innerHTML = `<div class="override-url" title="${override.url}">${override.url}</div>`;

            const actions = document.createElement('div');
            actions.classList.add('item-actions');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('secondary-btn');
            editBtn.onclick = () => {
                urlInput.value = override.url;
                cssInput.value = override.css;
                editingId = override.id;
                isEditing = true;
                showEditor(true);
            };

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Del';
            delBtn.classList.add('secondary-btn', 'delete-btn');
            delBtn.onclick = () => {
                if (confirm('Delete this override?')) {
                    deleteOverride(override.id);
                }
            };

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);
            li.appendChild(info);
            li.appendChild(actions);
            overridesList.appendChild(li);
        });
    }

    function deleteOverride(id) {
        chrome.storage.sync.get(['overrides'], (result) => {
            const overrides = result.overrides || [];
            const newOverrides = overrides.filter(o => o.id !== id);
            chrome.storage.sync.set({ overrides: newOverrides }, () => {
                loadOverrides();
                notifyContentScript();
            });
        });
    }

    function checkActiveOverrides(overrides) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0]) return;
            const currentUrl = tabs[0].url;

            const activeMatches = overrides.filter(o => {
                // Same logic as content script (simplified)
                try {
                    return o.enabled && (o.url === currentUrl || new RegExp(o.url).test(currentUrl) || currentUrl.includes(o.url));
                } catch {
                    return o.enabled && currentUrl.includes(o.url);
                }
            });

            activeOverridesList.innerHTML = '';
            if (activeMatches.length === 0) {
                activeOverridesList.innerHTML = '<li class="empty-state">No active overrides for this page.</li>';
            } else {
                activeMatches.forEach(match => {
                    const li = document.createElement('li');
                    li.textContent = match.url;
                    activeOverridesList.appendChild(li);
                });
            }
        });
    }

    function notifyContentScript() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "refreshOverrides" });
            }
        });
    }
});