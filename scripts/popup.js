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
                document.getElementById('title').textContent = results[0].result;
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
