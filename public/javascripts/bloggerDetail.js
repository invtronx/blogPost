// blogger/detail/~

const star = document.querySelector('#starBtn');
const starCount = document.querySelector('#starCount');

const metaBlogger = document.querySelector('#metaBlogger');

const bloggerId = metaBlogger.getAttribute('bloggerId');

/* State Variables */
let isStarred = false;

async function postStarReq(isAdd) {
	await axios.post('/blogger/star/' + bloggerId, { isAdd });
}

star.addEventListener('click', async (e) => {
	star.classList.toggle('active');
	if (isStarred) {
		await postStarReq(false);
		starCount.textContent--;
	}
	else {
		await postStarReq(true);
		starCount.textContent++;
	}
	isStarred = !isStarred;
});
