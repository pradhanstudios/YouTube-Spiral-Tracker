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

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
        {
            target: { tabId: tabs[0].id },
            function: getMetadata
        },
        (results) => {
            if (chrome.runtime.lastError) {
                document.getElementById('video').textContent = "Error: " + chrome.runtime.lastError.message;
            } else if (results && results[0] && results[0].result) {
                var vid = new Video();
                vid.title = results[0].result[0];
                vid.category = results[0].result[1];
                document.getElementById('video').textContent = vid;
            } else {
                document.getElementById('video').textContent = "Video data not found.";
            }
        }
    );
});

function getMetadata() {
    var title_element = document.querySelector('h1.ytd-video-primary-info-renderer');
    if (title_element) {
        title_element = title_element.textContent.trim();
    } else {
        title_element = null;
    }

    const pattern = new RegExp('\"category\"\:\"([^\"]*)\"');
    var category_element = pattern.exec(document.documentElement.outerHTML)[1];
    if (category_element) {
        category_element = JSON.parse('"' + category_element + '"');
    } else {
        category_element = null;
    }

    return [title_element, category_element];
}

function getYouTubeTitle() {
    const title_element = document.querySelector('h1.ytd-video-primary-info-renderer');
    if (title_element) {
        return title_element.textContent.trim();
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
