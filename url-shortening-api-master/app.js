const form = document.querySelector('form');
const links = document.querySelector('.generate-link');
const copied = document.querySelector('.copied');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	let inputTag = e.target.querySelector('input');
	let input = inputTag.value;
	console.log(input);
	if (input == '' || input == null) {
		document.querySelector('#error1').style.display = 'inline-block';
		document.querySelector('#error2').style.display = 'none';
		inputTag.value = '';
		inputTag.classList.add('inputerror');
		return;
	}
	const regex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
	if (regex.test(input)) {
		inputTag.classList.remove('inputerror');
		document.querySelector('#error1').style.display = 'none';
		document.querySelector('#error2').style.display = 'none';
		let link = input;
		link = link.trim();
		let hyperlink = link.slice(0, 3);
		console.log(hyperlink);
		if (hyperlink === 'www') {
			link = 'https://' + link.slice(4);
		}
		try {
			const response = await fetch(`https://rel.ink/api/links/?url=${link}`, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({ url: link })
			});
			const json = await response.json();
			console.log(json);
			const shortUrl = 'https://rel.ink/' + json.hashid;
			const longUrl = json.url;
			console.log(shortUrl);
			createListItem(longUrl, shortUrl);
			// generate list
		} catch (error) {
			// generate error
			inputTag.classList.add('inputerror');
			document.querySelector('#error1').style.display = 'none';
			document.querySelector('#error2').style.display = 'inline-block';
		}
		inputTag.value = '';
	} else {
		// generate error
		inputTag.classList.add('inputerror');
		document.querySelector('#error1').style.display = 'none';
		document.querySelector('#error2').style.display = 'inline-block';
		inputTag.value = '';
	}
});

function createListItem(longUrl, shortUrl) {
	let li = document.createElement('li');
	li.innerHTML = `<p>${longUrl}</p> <div class="short"><p>${shortUrl}</p><button class="copy">Copy</button></div>`;
	links.insertBefore(li, links.childNodes[0]);
}

links.addEventListener('click', (e) => {
	let link = e.path[0].previousSibling.textContent;
	let textarea = document.createElement('textarea');
	textarea.value = link;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);
	console.log(copied);
	copied.style.display = 'flex';
	copied.style.justifyContent = 'center';
	copied.style.alignItems = 'center';
	copied.style.top = window.pageYOffset + 'px';
	document.querySelector('body').style.overflow = 'hidden';
	setTimeout(() => {
		document.querySelector('body').style.overflow = 'visible';
		copied.style.display = 'none';
	}, 1000);
});
