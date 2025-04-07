class Video {
    constructor(title, category = "NaN") {
        this.title = title;
        this.category = category;
        this.start_time = Date.now();
        this.end_time = null;
    }

    toString() {
        return `<Video: title="${this.title}", category="${this.category}", start_time="${this.start_time}", end_time=${this.end_time}>`;
    }
}

class Node {
    constructor(video = null, next = null, prev = null) {
        this.video = video;
        this.next = next;
        this.prev = prev;
    }

    toString() {
        return `<Node: Video=${this.video}, next=${this.next}, prev=${this.prev}>`;
    }
}

var video = new Video();

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: getYouTubeTitle
        },
        (results) => {
            if (chrome.runtime.lastError) {
                video.title = "Error: " + chrome.runtime.lastError.message;
            } else if (results && results[0] && results[0].result) {
                console.log(results[0].result);
                video.title = results[0].result;
                console.log(video.title);
            } else {
                video.title = "Title not found.";
            }
            console.log(video.title);
        }
    );
    console.log(video.title)
    
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: getCategory
        },
        (results) => {
            if (chrome.runtime.lastError) {
                video.category = "Error: " + chrome.runtime.lastError.message;
            } else if (results && results[0] && results[0].result) {
                video.category = results[0].result;
            } else {
                video.category = "Category not found.";
            }
        }
    )
});

document.getElementById('video').innerText = video.toString();

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