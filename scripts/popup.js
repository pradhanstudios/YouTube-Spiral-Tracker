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
            function: getYouTubeTitle,
        },
        (results) => {
            if (chrome.runtime.lastError) {
                document.getElementById('title').textContent = "Error: " + chrome.runtime.lastError.message;
            } else if (results && results[0] && results[0].result) {
                const r = results[0].results;
                var v = new Video(r);
                var n = new Node(v);
                document.getElementById('title').textContent = n;
            } else {
                document.getElementById('title').textContent = "Title not found.";
            }
        }
    );
});

function getYouTubeTitle() {
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer');
    if (titleElement) {
        return titleElement.textContent.trim();
    } else {
        return null;
    }
}
