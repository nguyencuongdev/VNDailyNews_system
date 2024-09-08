import PhotoSwipe from '/photoswipe/js/photoswipe.js';
export const openPhotoswipe = (eImage) => {
    let src = eImage.getAttribute("src");
    const phtswipe = new PhotoSwipe({
        dataSource: [
            {
                src: src || "",
                width: eImage.clientWidth,
                height: eImage.clientHeight
            }
        ],
        zoom: true,
        arrowNext: false,
        arrowPrev: false,
        wheelToZoom: true
    });
    phtswipe.init();
};

export function updateProgress(uploaded, total) {
    const percentComplete = Math.round((uploaded / total) * 100);
    document.getElementById('progress-bar').style.width = percentComplete + '%';
    document.querySelector('#progress-text span').textContent = percentComplete + '%';
}
