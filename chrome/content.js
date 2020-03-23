chrome.runtime.sendMessage({
	method: 'icon',
	icon: "icon-careful.png"
});

var frames = document.getElementsByTagName("iframe");
if (frames.length > 0) {
	for (var i = 0, max = frames.length; i < max; i++) {
		frames[i].id = "busted";
		frames[i].classList.add("busted");
	}
	chrome.runtime.sendMessage({
		method: 'icon',
		icon: "icon-warning.png"
	});
} else {
	chrome.runtime.sendMessage({
		method: 'icon',
		icon: "icon-safe.png"
	});
}
