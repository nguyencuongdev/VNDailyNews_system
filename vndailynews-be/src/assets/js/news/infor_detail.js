import { openPhotoswipe } from '/static/js/common.js';

$(document).ready(function () {
    const contentDetail = $('#content_detail');
    const contentVideosInRichText = contentDetail.find('.fr-video');
    const contentImgInContentDetail = contentDetail.find('img');

    contentVideosInRichText.each((_, contentVideoRT) => {
        contentVideoRT.classList.add('fr-active');
    })

    contentImgInContentDetail.each((_, contentImg) => {
        contentImg.addEventListener('click', () => {
            openPhotoswipe(contentImg);
        })
    })
})