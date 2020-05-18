// blog/detail/~
const like = document.querySelector('#likeBtn');
const dislike = document.querySelector('#dislikeBtn');
const share = document.querySelector('#shareBtn');
const likeCount = document.querySelector('#likeCount');
const dislikeCount = document.querySelector('#dislikeCount');

const metaBlog = document.querySelector('#metaBlog');
const metaBlogger = document.querySelector('#metaBlogger');
const metaShareText = document.querySelector('#metaShareText');

/** State Variables **/
let liked = false; 
let disliked = false;

// Retrieve IDs of the blog and blogger
const blogId = metaBlog.getAttribute('blogId');
const bloggerId = metaBlog.getAttribute('bloggerId');
const shareText = metaShareText.dataset.shareText;

async function postReq(action, isAdd) {
	await axios.post('/blog/action/' + blogId, { action, isAdd });
}

// Add Event Listeners
like.addEventListener('click', async (e) => {
	if (!liked && !disliked) {
		await postReq('like', true);
		liked = true; 
		likeCount.textContent++;
		like.classList.toggle('active');
	}
	else if (!liked && disliked) {
		await postReq('like', true);
		liked = true; 
		likeCount.textContent++;
		like.classList.toggle('active');

		await postReq('dislike', false);
		disliked = false; 
		dislikeCount.textContent--;
		dislike.classList.toggle('active');
	}
	else if (liked && !disliked) {
		await postReq('like', false);
		liked = false; 
		likeCount.textContent--;
		like.classList.toggle('active');
	}
});

dislike.addEventListener('click', async (e) => {
	if (!disliked && !liked) {
		await postReq('dislike', true);
		disliked = true; 
		dislikeCount.textContent++;
		dislike.classList.toggle('active');
	}
	else if (!disliked && liked) {
		await postReq('dislike', true);
		disliked = true; 
		dislikeCount.textContent++;
		dislike.classList.toggle('active');

		await postReq('like', false);
		liked = false; 
		likeCount.textContent--;
		like.classList.toggle('active');
	}
	else if (disliked && !liked) {
		await postReq('dislike', false);
		disliked = false; 
		dislikeCount.textContent--;
		dislike.classList.toggle('active');
	}
});

const copyToClipboard = (text) => {
	const textArea = document.createElement("textarea");

	// Styling to prevent rendering pitfalls
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = '2em';
	textArea.style.height = '2em';
	textArea.style.padding = 0;
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
	textArea.style.background = 'transparent';

	textArea.value = text;

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand('copy');
	
	document.body.removeChild(textArea);
};

share.addEventListener('click', () => {
	copyToClipboard(shareText);
	
	const notice = document.createElement('sup');
	notice.classList.add('text-success');
	notice.innerText = 'Copied to clipboard';

	const container = document.querySelector('.copyNoticeContainer');

	container.appendChild(notice);

	setTimeout(() => {
		container.removeChild(notice);
	}, 1000);
});


















