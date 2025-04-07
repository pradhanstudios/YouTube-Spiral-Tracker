class Video {
    constructor(title, category = "NaN") {
        this.title = title;
        this.category = category;
        this.start_time = Date.now();
        this.end_time = null;
    }

    toString() {
        return `<Video: title="${this.title}", category="${this.category}", start_time="${this.start_time}", end_time=${this.end_time}>`
    }
}

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
                document.getElementById('title').textContent = new Video(results[0].result).toString();
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
        return JSON.parse('"' + category + '"'); 
    } else {
        return null;
    }
}