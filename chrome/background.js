var enabled = enabled || true;
var busted = function() {
	if (enabled) {
		chrome.tabs.insertCSS(null, {
			file: "busted.css"
		});
		chrome.tabs.executeScript(null, {
			file: "content.js"
		});
	}
};

chrome.tabs.onActivated.addListener(function(tab) {
	busted();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {
		busted();
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.method === 'icon') {
		chrome.browserAction.setIcon({
			path: message.icon
		});
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	enabled = !enabled;
	if (!enabled) {
		chrome.browserAction.setIcon({
			path: 'icon-disabled.png'
		});
	} else {
		busted();
	}
});
