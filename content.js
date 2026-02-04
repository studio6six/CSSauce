// content.js

function matchUrl(currentUrl, pattern) {
    if (!pattern) return false;
    // Simple wildcard match just for demonstration, or exact match
    // Ideally we support regex or simple glob
    if (pattern === currentUrl) return true;

    // Check if pattern is a regex string
    try {
        const regex = new RegExp(pattern);
        return regex.test(currentUrl);
    } catch (e) {
        // Fallback to simple includes or startsWith if regex fails or is not intended
        return currentUrl.includes(pattern);
    }
}

function applyOverrides() {
    chrome.storage.sync.get(['overrides'], (result) => {
        const overrides = result.overrides || [];
        const currentUrl = window.location.href;

        overrides.forEach(override => {
            if (override.enabled && matchUrl(currentUrl, override.url)) {
                console.log(`[DevOps Toolkit] Applying CSS for ${override.url}`);
                const style = document.createElement('style');
                style.textContent = override.css;
                style.id = `devops-toolkit-${Date.now()}`;
                document.head.appendChild(style);
            }
        });
    });
}

// Run on load
applyOverrides();

// Listen for updates from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "refreshOverrides") {
        // Remove old styles
        const oldStyles = document.querySelectorAll('style[id^="devops-toolkit-"]');
        oldStyles.forEach(s => s.remove());
        // Re-apply
        applyOverrides();
    }
});
