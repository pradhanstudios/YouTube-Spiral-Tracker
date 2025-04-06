chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: getYouTubeTitle
        },
        (results) => {
            if (chrome.runtime.lastError) {
                document.getElementById('title').textContent = "Error: " + chrome.runtime.lastError.message;
            } else if (results && results[0] && results[0].result) {
                document.getElementById('title').textContent = results[0].result;
            } else {
                document.getElementById('title').textContent = "Title not found.";
            }
        }
    );
    
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: getCategory
        },
        (results) => {
            if (chrome.runtime.lastError) {
                document.getElementById('category').textContent = "Error: " + chrome.runtime.lastError.message;
            } else if (results && results[0] && results[0].result) {
                document.getElementById('category').textContent = results[0].result;
            } else {
                document.getElementById('category').textContent = "Category not found.";
            }
        }
    )
});

function getYouTubeTitle() {
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
    if (titleElement) {
        return titleElement.textContent.trim();
    } else {
        return null;
    }
}

function getCategory() {
    const pattern = new RegExp('\"category\"\:\"([^\"]*)\"');
    const category = pattern.exec(document.documentElement.outerHTML)[1];
    if (category) {
        return category; 
    } else {
        return null;
    }
}