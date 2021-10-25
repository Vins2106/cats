let images = document.getElementById("images");
let offline = document.getElementById("offline");
let loading = document.getElementById("loading");
let options = document.getElementById("opt")
let item = document.getElementById("item");

ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' })

window.onload = () => {

	let isOnline = navigator.onLine;

	if (!isOnline) {
		return offline.style.display = "block";
	}

	fetchImage()

	console.log('[website] loaded!')

	document.body.onscroll = () => {
		if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
	    	fetchImage();
	  	}
	}
}

let currentlyLoading = false;

function fetchImage() {
	let api = 'https://api.thecatapi.com/v1/images/search?limit=20';

	if (currentlyLoading) return;

	currentlyLoading = true;
	setTimeout(() => {
		fetch(api, {
			method: "GET"
		}).then(res => res.json()).then(res => {
			images.appendChild(loading)
			res.map(img => {
				let newImg = document.createElement("img");
				newImg.src = img.url;
				newImg.alt = "Cat img"
				newImg.setAttribute("class", "image");
				images.appendChild(newImg)
				newImg.onclick = () => Opt(img.url)
			});


			images.appendChild(loading)
			currentlyLoading = false;
		})			
	}, 1000)
}

let optDispaly = false;
let lastIndex = "";

function Opt(link = false) {

	if (optDispaly) {
		if (link) {
			if (lastIndex !== link) return; 
		}
		options.classList.add("hidden");
		optDispaly = false;
	} else if (!optDispaly) {
		if (link) {
			item.value = link;
		}
		lastIndex = link;
		options.classList.remove("hidden");
		optDispaly = true;
	}
}

function downloadItem() {
	let item = document.getElementById("item");
	let link = item.value;
	let split = link.split(".");
	let extension = split[split.length - 1];
	download(link, `cat.${extension}`)
}

function openItem() {
	let link = document.getElementById("item");
	window.open(link.value, "_blank")
}

function openImg(url) {
	window.open(url, '_blank')
}