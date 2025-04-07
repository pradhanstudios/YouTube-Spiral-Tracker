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
    constructor(video = null, next = null) {
        this.video = video;
        this.next = next;
    }

    toString() {
        return `<Node: Video=${this.video}, next=${this.next}>`;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Add a node to the end of the list
    append(data) {
        const newNode = new Node(data);

        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // Insert a node at a specific index
    insertAt(data, index) {
        if (index < 0 || index > this.size) {
            return console.error("Index out of bounds");
        }

        if (index === 0) {
            const newNode = new Node(data);
            newNode.next = this.head;
            this.head = newNode;
        } else {
            const newNode = new Node(data);
            let current = this.head;
            let previous = null;
            let count = 0;

            while (count < index) {
                previous = current;
                current = current.next;
                count++;
            }
            newNode.next = current;
            previous.next = newNode;
        }
        this.size++;
    }

    // Get the data at a specific index
    getAt(index) {
        if (index < 0 || index >= this.size) {
            return null;
        }
        let current = this.head;
        let count = 0;
        while (count < index) {
            current = current.next;
            count++;
        }
        return current.data;
    }

    // Remove a node from a specific index
    removeAt(index) {
        if (index < 0 || index >= this.size) {
            return console.error("Index out of bounds.");
        }

        if (index === 0) {
            this.head = this.head.next;
        } else {
            let current = this.head;
            let previous = null;
            let count = 0;

            while (count < index) {
                previous = current;
                current = current.next;
                count++;
            }
            previous.next = current.next;
        }
        this.size--;
    }

    // Clear the list
    clear() {
        this.head = null;
        this.size = 0;
    }

    // Print the list data
    printList() {
        let current = this.head;
        let str = "";
        while (current) {
            str += current.data + " ";
            current = current.next;
        }
        console.log(str);
    }

    // toString() {
    //     let current = this.head;
    //     let result = `<LinkedList: size=${this.size}, list=[ `;
    //     while (current) {
    //         result += current;
    //         result += ` `;
    //     }
    //     result += `]>`
    //     console.log("ll, toString(): " + result);
    //     return result;
    // }

    // Get the size of the list
    getSize() {
        return this.size;
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
                const r = results[0].results;
                var v = new Video(r);
                // var n = new Node(v);
                var ll = new LinkedList();
                ll.append(v);
                ll.printList();
                document.getElementById('title').textContent = v;
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
