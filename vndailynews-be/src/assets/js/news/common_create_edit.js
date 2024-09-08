let countContentDetail = 0;// số lượng mục nội dung chi tiết của bài đăng
let fileImgUploadtemp = null;
const typesImgUploaded = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const typesVideoUploaded = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/webm'];
const typesAudioUploaded = ['audio/mpeg'];
let paths = window.location.pathname.split('/');
let lastPath = paths[paths.length - 1];


const handleValidate = (eMessage, value, message) => {
    if (!value) {
        eMessage.innerText = message
        return false;
    }
    eMessage.innerText = ''
    return true;
}

// xóa một mục nội dung chi tiết trong nội dung chi tiết của bài đăng
const handleDeleteContentDetailItem = (e) => {
    const eTarget = e.target;
    let eParent = eTarget.parentElement;
    while (!eParent.classList.contains('content-detail-item')) {
        eParent = eParent.parentElement;
    }
    eParent.remove();
    --countContentDetail;
}
const handleResetFormUploadFileMedia = (type) => {
    const formUpload = type === 'image' ? $('#form-upload-img') : type === 'video' ? $('#form-upload-video') : type === 'audio' ? $('#form-upload-audio') : null;
    const eFileNameUpload = formUpload.find('#fileName')
    eFileNameUpload.val('');
    handleToggleFileMediaUploaded('', type);
}

const handleCloseFormUploadFileMedia = (type) => {
    const formUpload = type === 'image' ? $('#form-upload-img') : type === 'video' ? $('#form-upload-video') : type === 'audio' ? $('#form-upload-audio') : null;
    if (formUpload) {
        const eSubmitUpload = formUpload.find('#form-upload-img #btn-complate-uploadImg');
        const eInputFile = formUpload.find('input[type="file"]')[0];
        formUpload.removeClass('d-flex');
        formUpload.addClass('d-none');
        handleResetFormUploadFileMedia(type);
        eSubmitUpload.off('click');
        fileImgUploadtemp = null;
        const eMessage2 = formUpload.find('#nofile-container p.message')[0]
        eMessage2.innerText = ''
        eInputFile.value = null;
    }
}
// Show hoặc clear hình ảnh trên form upload img
const handleToggleFileMediaUploaded = (src, type) => {
    let eformUpload = null, btnUpload = null, eshowFileMediaInFormUpload = null;
    switch (type) {
        case 'image': {
            eformUpload = $('#form-upload-img');
            btnUpload = eformUpload.find('#nofile-container');
            eshowFileMediaInFormUpload = eformUpload.find('#fileUpload img:last-child');
            break;
        }
        case 'video': {
            eformUpload = $('#form-upload-video');
            btnUpload = eformUpload.find('#nofile-container');
            eshowFileMediaInFormUpload = eformUpload.find('#fileUpload video');
            break;
        }
        case 'audio': {
            eformUpload = $('#form-upload-audio');
            btnUpload = eformUpload.find('#nofile-container');
            eshowFileMediaInFormUpload = eformUpload.find('#fileUpload audio');
            break;
        }
    }
    let eContainerShowFileInFormUpload = eformUpload.find('#fileUpload #file-container') || null;
    if (eformUpload && btnUpload && eshowFileMediaInFormUpload && eContainerShowFileInFormUpload) {
        if (src) {
            btnUpload.addClass('d-none')
            btnUpload.removeClass('d-flex')
            eContainerShowFileInFormUpload.removeClass('d-none')
            eshowFileMediaInFormUpload.attr('src', src)
        } else {
            btnUpload.removeClass('d-none')
            btnUpload.addClass('d-flex')
            eContainerShowFileInFormUpload.addClass('d-none')
            eshowFileMediaInFormUpload.attr('src', '')
        }
    }
}

// xử lý thay đổi mục hình ảnh, video, audio, trong nội dung chi tiết bài đăng
const handleChangeFileMediaUploaded = (e, typeFile) => {
    const eTarget = e.target;
    let eParent = eTarget.parentElement;
    while (!eParent.classList.contains('content-detail-item')) {
        eParent = eParent.parentElement;
    }

    let formUpload = null, eSubmitChange = null, eShowFileUpload = null, eNameFileUpload = null, eInputFileUpload = null, eFile = null; // phần tử show file chưa change;
    switch (typeFile) {
        case 'image': {
            formUpload = $('#form-upload-img')
            eSubmitChange = formUpload.find('#btn-complate-uploadImg');
            eNameFileUpload = formUpload.find('#fileName');
            eShowFileUpload = formUpload.find('#fileUpload img:last-child');
            eInputFileUpload = formUpload.find('input[type="file')[0];
            eFile = eParent.querySelector('img');
            break;
        }
        case 'video': {
            formUpload = $('#form-upload-video')
            eSubmitChange = formUpload.find('#btn-complate-uploadVideo');
            eNameFileUpload = formUpload.find('#fileName');
            eShowFileUpload = formUpload.find('#fileUpload video');
            eInputFileUpload = formUpload.find('input[type="file')[0];
            eFile = eParent.querySelector('video');
            break;
        }
        case 'audio': {
            formUpload = $('#form-upload-audio')
            eSubmitChange = formUpload.find('#btn-complate-uploadAudio');
            eShowFileUpload = formUpload.find('#fileUpload audio');
            eInputFileUpload = formUpload.find('input[type="file')[0];
            eFile = eParent.querySelector('audio');
            break;
        }
    }
    const eNameFile = eParent.querySelector('h5');
    const eInputFileOld = eParent.querySelector('input[type="file"]');
    const eMessage2 = formUpload.find('#nofile-container p.message')[0]

    // hiển thị form upload file (image, video, audio,...)
    formUpload.removeClass('d-none');
    formUpload.addClass('d-flex');
    let nameImgUploaded = eNameFile.innerText
    let src = eFile.getAttribute('src')

    eNameFileUpload && eNameFileUpload.val(nameImgUploaded); // nếu nội dung media cần tên file thì mới show tên trong form upload (audio không cần);
    eShowFileUpload.attr('src', eFile.getAttribute('src'))

    handleToggleFileMediaUploaded(src, typeFile);
    eSubmitChange.off('click');
    eSubmitChange.click((e) => {
        e.preventDefault();
        let checkValidates = [];
        nameImgUploaded = eNameFileUpload ? eNameFileUpload.val() : '';
        checkValidates.push(
            handleValidate(eMessage2, fileImgUploadtemp || eInputFileUpload.files.length >= 0,
                `Vui lòng upload ${typeFile === 'image' ? 'hình ảnh'
                    : typeFile === 'video' ? 'video'
                        : typeFile === 'audio' ? 'audio' : 'file'}`)
        )

        if (checkValidates.includes(false)) {
            return;
        }

        src = eShowFileUpload.attr('src');
        //Cập nhật file mà người dùng đã thay đổi
        eNameFile.textContent = nameImgUploaded;
        eFile.setAttribute('src', src)

        // lưu file mà người dùng upload vào phần tử input file;
        if (fileImgUploadtemp) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(fileImgUploadtemp);
            eInputFileOld.files = dataTransfer.files
            if (lastPath === 'edit') {
                const eCheckChange = eParent.querySelector('span.check-change');
                eCheckChange.setAttribute('data-src', 'change');
            }
        }

        //Đóng form upload img;
        handleCloseFormUploadFileMedia(typeFile);
    })
}

const configTextEditor = {
    placeholderText: 'Nhập vào nội dung...',
    toolbarButtons: {
        moreText: {
            // List of buttons used in the  group.
            buttons: [
                'bold', 'italic',
                'fontFamily', 'fontSize', 'textColor',
                'backgroundColor',
                'subscript', 'superscript',
                'underline', 'strikeThrough',
                'inlineClass', 'inlineStyle', 'clearFormatting'
            ],

            // Alignment of the group in the toolbar.
            align: 'left',

            // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
            buttonsVisible: 5
        },

        moreParagraph: {
            buttons: [
                'alignLeft', 'alignCenter',
                'alignRight', 'alignJustify',
                'formatOL', 'formatUL',
                'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'
            ],
            align: 'left',
            buttonsVisible: 4
        },

        moreRich: {
            buttons: [
                'insertImage',
                'insertTable',
                'insertVideo',
                'insertLink',
                'embedly', 'insertFile',
                'emoticons', 'specialCharacters',
            ],
            align: 'left',
            buttonsVisible: 3
        },

        moreMisc: {
            buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
            align: 'right',
            buttonsVisible: 2
        }
    },
    events: {
        "image.beforeUpload": function (files) {
            const editor = this;
            if (files.length) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target) {
                        var result = e.target.result;
                        editor?.image?.insert(result, null, null, editor?.image?.get());
                    }
                };
                // Đọc hình ảnh dưới dạng base64.
                reader.readAsDataURL(files[0]);
            }
            return false;
        }
    },
    videoInsertButtons: ['videoBack', '|', 'videoByURL', 'videoEmbed'],
    videoUpload: false,
    tableCellStyles: 'word-wrap: break-word; white-space: normal;'
}


$(document).ready(function () {
    $('.selectpicker').selectpicker()
    const eContentAvatar = $('#content-avatar')

    const eContentDetail = $('#content_detail')
    const btnAddImg = $('#btn-add-img')
    const btnAddTitle = $('#btn-add-title')
    const btnAddTitleBold = $('#btn-add-titleBold')
    const btnAddTitleItalic = $('#btn-add-titleItalic')
    const btnAddText = $('#btn-add-text')
    const btnAddTextBold = $('#btn-add-textBold')
    const btnAddTextItalic = $('#btn-add-textItalic')
    const btnAddRichText = $('#btn-add-richText')
    const btnAddVideo = $('#btn-add-video')
    const btnAddAudio = $('#btn-add-audio')

    const formUploadImg = $('#form-upload-img')
    const formUploadVideo = $('#form-upload-video')
    const formUploadAudio = $('#form-upload-audio')

    const btnUploadAvatar = eContentAvatar.find('#avatar-noupload')
    const eContainerShowAvatar = eContentAvatar.find('#avatar-uploaded')
    const eInputImgAvatar = eContentAvatar.find('input[type="file"')
    const btnDeleteAvatr = eContentAvatar.find('#btn-avatar-delete')

    const eInputNameImageUpload = formUploadImg.find('#fileName')
    const btnUploadImg = formUploadImg.find('#nofile-container')
    const eSubmitUploadImg = formUploadImg.find('#btn-complate-uploadImg')
    const eShowImgInFormUploadImg = formUploadImg.find('#fileUpload img:last-child')
    const eContainerShowImgInFormUploadImg = formUploadImg.find('#fileUpload #file-container')
    const btnCloseFormUploadImg = formUploadImg.find('#btn-close-form-uploadImg')
    const btnCancelFormUploadImg = formUploadImg.find('#btn-cancel-form-uploadImg')

    const eInputNameVideoUpload = formUploadVideo.find('#fileName')
    const btnUploadVideo = formUploadVideo.find('#nofile-container')
    const eShowVideoInFormUploadVideo = formUploadVideo.find('#fileUpload video')
    const eChangeVideoInFormUploadVideo = formUploadVideo.find('#btn-change-videoUpload')
    const eSubmitUploadVideo = formUploadVideo.find('#btn-complate-uploadVideo')
    const btnCloseformUploadVideo = formUploadVideo.find('#btn-close-form-uploadVideo')
    const btnCancelformUploadVideo = formUploadVideo.find('#btn-cancel-form-uploadVideo')

    const btnUploadAudio = formUploadAudio.find('#nofile-container')
    const eShowAudioInFormUploadAudio = formUploadAudio.find('#fileUpload audio')
    const eChangeAudioInFormUploadAudio = formUploadAudio.find('#btn-change-audioUpload')
    const eSubmitUploadAudio = formUploadAudio.find('#btn-complate-uploadAudio')
    const btnCloseformUploadAudio = formUploadAudio.find('#bbtn-close-form-uploadAudio')
    const btnCancelFormUploadAudio = formUploadAudio.find('#btn-cancel-form-uploadAudio')

    // xử lý upload hình ảnh avatar của bài đăng;
    const handleUploadAvatar = (event) => {
        const file = event.target.files[0];
        if (file) {
            let size = file.size;
            let type = file.type;
            if ((size < 5 * 1024 * 1024) && typesImgUploaded.includes(type)) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const content = e.target.result
                    btnUploadAvatar.addClass('d-none');
                    eContainerShowAvatar.removeClass('d-none');
                    const eShowImgAvatar = eContainerShowAvatar.find('img');
                    eShowImgAvatar.attr('src', content);
                    if (lastPath === 'edit') {
                        const eCheckChangeAvatar = eContentAvatar.find('#check-changeAvatar')[0];
                        eCheckChangeAvatar.setAttribute('data-src', 'change');
                    }
                };
                reader.onerror = function (e) {
                    event.target.value = null;
                    alert('Lỗi không thể upload hình ảnh!')
                };
                reader.readAsDataURL(file)
            } else {
                event.target.value = null;
                alert('Kích thước hình ảnh quá lớn, hoặc file không đúng định dạng!');
            }
        } else {
            event.target.value = null;
        }
    }


    // gỡ bỏ avatar của bài đăng
    const handleDeleteAvatar = (event) => {
        event.preventDefault();
        event.stopPropagation();
        btnUploadAvatar.removeClass('d-none');
        eContainerShowAvatar.addClass('d-none');
        const eShowImgAvatar = eContainerShowAvatar.find('img');
        eShowImgAvatar.attr('src', '');
        eInputImgAvatar.val(null);
    }

    eInputImgAvatar.change(handleUploadAvatar)
    btnUploadAvatar.click(() => eInputImgAvatar.click())
    eContainerShowAvatar.click(() => eInputImgAvatar.click())
    btnDeleteAvatr.click(handleDeleteAvatar)


    const createControlTitleContent = (type = 'default') => {
        let orderContentNumber = countContentDetail
        const element = $('<div>').addClass('content-detail-item mb-3');
        element.attr('data-target', orderContentNumber);
        element.attr('data-type', type === 'italic' ? 'title italic' : type === 'bold' ? 'title bold' : 'title default');
        element.html(`
                    <input class="form-control rounded-0 content-control ${type === 'italic' ? 'control-italic' : type === 'bold' ? 'control-bold' : ''}" placeholder="Nhập vào tiêu đề của đoạn văn" name="content_${orderContentNumber}"/>
                    <button class="btn-detailItem-delete" id="btn-detailItem-delete" type="button" data-target="${orderContentNumber}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <p class="text-danger my-1 message pl-2"></p>
                `);
        // Gán sự kiện sau khi phần tử được tạo
        element.find('#btn-detailItem-delete').click(handleDeleteContentDetailItem);
        return element;
    };

    // Tạo một mục nội dung chi tiết là một đoạn văn
    const createControlTextContent = (type = 'default') => {
        let orderContentNumber = countContentDetail
        const element = $('<div>').addClass('content-detail-item mb-3')
        element.attr('data-target', orderContentNumber)
        element.attr('data-type', type === 'italic' ? 'text italic' : type === 'bold' ? 'text bold' : 'text default');
        element.html(`
                    <textarea class="form-control rounded-0 content-control ${type === 'italic' ? 'control-italic' : type === 'bold' ? 'control-bold' : ''}" placeholder="Nhập vào một đoạn văn" name="content_${orderContentNumber}"></textarea>
                    <button class="btn-detailItem-delete" type="button" id="btn-detailItem-delete" data-target="${orderContentNumber}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <p class="text-danger my-1 message pl-2"></p>
                `);
        // Gán sự kiện sau khi phần tử được tạo
        element.find('#btn-detailItem-delete').click(handleDeleteContentDetailItem);
        return element;
    }
    // Tạo một mục nội dung chi tiết là một đoạn rich text
    const createRichTextContent = () => {
        let orderContentNumber = countContentDetail
        const element = $('<div>').addClass('content-detail-item mb-3 content-detail-richtext')
        element.attr('data-target', orderContentNumber)
        element.attr('data-type', 'richtext');
        element.html(`
                    <textarea class="form-control rounded-0 content-control" id="content-editor${orderContentNumber}"></textarea>
                    <button class="btn-detailItem-delete" type="button" id="btn-detailItem-delete" data-target="${orderContentNumber}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <p class="text-danger my-1 message pl-2"></p>
                `);
        element.find('#btn-detailItem-delete').click(handleDeleteContentDetailItem);
        return element;
    }

    // Tạo một mục nội dung media trong nội dung chi tiết bài đăng
    const createContentMediaContentDetail = (src, name, type) => {
        let orderContentNumber = countContentDetail
        const element = $('<div>').addClass(`content-detail-item mb-3 content-detail-${type}`)
        element.attr('data-target', orderContentNumber)
        element.attr('data-type', type);
        element.html(`
                    <h5 class="text-center mt-2 content-detail-img-title name-image">
                        ${name}
                    </h5>
                    <button class="btn-detailItem-delete" type="button" id="btn-detailItem-delete-${orderContentNumber}" data-target="${orderContentNumber}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                    <button class="btn-detailItem-edit" type="button" id="btn-detailItem-edit-${orderContentNumber}" 
                    data-target="${orderContentNumber}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                    <input type="file" class="d-none"/>
                `);

        switch (type) {
            case 'image': {
                const eImg = $('<img width="100%" height="auto"/>').attr('src', src).attr('alt', `Hình ảnh ${orderContentNumber}`);
                element.prepend(eImg);
                break;
            }
            case 'video': {
                const eImg = $('<video controls  width="100%" height="auto" />').attr('src', src);
                element.prepend(eImg);
                break;
            }
            case 'audio': {
                const eImg = $('<audio controls width="100%" height="auto" />').attr('src', src);
                element.prepend(eImg);
                break;
            }
        }

        if (lastPath === 'edit') {
            const eCheckChange = $('<span>').addClass('check-change')
            eCheckChange.attr('data-src', "change")
            element.append(eCheckChange)
        }

        // Gán sự kiện xóa,sửa item vào button delete,edit khi item được thêm vào nội dung chi tiết của bài đăng
        element.find(`#btn-detailItem-delete-${orderContentNumber}`).click(handleDeleteContentDetailItem);
        element.find(`#btn-detailItem-edit-${orderContentNumber}`).click((event) => handleChangeFileMediaUploaded(event, type));

        // lưu file mà người dùng upload vào phần tử input file;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(fileImgUploadtemp);
        element.find('input[type="file"]')[0].files = dataTransfer.files;
        // Thêm mục nội dung này vào mục nội dung chi tiết bài đăng;
        eContentDetail.append(element)
    }

    // xử lý upload file media (image, video, audio) về bài đăng
    const handleUploadFileMediaContentDetail = (event, typeFile) => {
        const file = event.target.files[0];
        if (file) {
            let size = file.size;
            let type = file.type;
            let msg = typeFile === 'image' ? 'Hình ảnh' : typeFile === 'video' ? 'Video' : typeFile === 'audio' ? 'Audio' : 'file';
            const conditions =
                typeFile === 'image' ? (size <= 5 * 1024 * 1024) && typesImgUploaded.includes(type)
                    : typeFile === 'video' ? (size <= 250 * 1024 * 1024) && typesVideoUploaded.includes(type)
                        : typeFile === 'audio' ? (size <= 5 * 1024 * 1024) && typesAudioUploaded.includes(type) : false;
            if (conditions) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const content = e.target.result
                    fileImgUploadtemp = file;
                    handleToggleFileMediaUploaded(content, typeFile)
                };
                reader.onerror = function (e) {
                    event.target.value = null;
                    fileImgUploadtemp = null;
                    alert(`Lỗi không thể upload ${msg}!`)
                    handleToggleFileMediaUploaded('', typeFile);
                };
                reader.readAsDataURL(file)
            } else {
                event.target.value = null;
                fileImgUploadtemp = null;
                alert(`Kích thước ${msg} quá lớn, hoặc file không đúng định dạng!`);
                handleToggleFileMediaUploaded('', typeFile);
            }
        } else {
            handleToggleFileMediaUploaded('', typeFile);
            event.target.value = null;
            fileImgUploadtemp = null;
        }
    }

    // xử lý thêm một mục nội dung là hình ảnh vào trong nội dung chi tiết của bài đăng;
    const handleSubmitUploadFileMediaContentDetail = (e, typeFile) => {
        e.preventDefault();
        let checkValidates = [];

        switch (typeFile) {
            case 'image': {
                const eMessage1 = formUploadImg.find('#nofile-container p.message')[0]
                let nameImgUpload = eInputNameImageUpload.val();
                let src = eShowImgInFormUploadImg.attr('src');

                checkValidates.push(handleValidate(eMessage1, fileImgUploadtemp, 'Vui lòng upload hình ảnh!'))

                if (checkValidates.includes(false))
                    return;
                createContentMediaContentDetail(src, nameImgUpload, 'image');
                break;
            }
            case 'video': {
                const eMessage1 = formUploadVideo.find('#nofile-container p.message')[0]
                let nameImgUpload = eInputNameVideoUpload.val();
                let src = eShowVideoInFormUploadVideo.attr('src');
                checkValidates.push(handleValidate(eMessage1, fileImgUploadtemp, 'Vui lòng upload video!'))

                if (checkValidates.includes(false))
                    return;
                createContentMediaContentDetail(src, nameImgUpload, 'video')
                break;
            }
            case 'audio': {
                const eMessage1 = formUploadAudio.find('#nofile-container p.message')[0]
                let src = eShowAudioInFormUploadAudio.attr('src');
                checkValidates.push(handleValidate(eMessage1, fileImgUploadtemp, 'Vui lòng upload audio!'))

                if (checkValidates.includes(false))
                    return;
                createContentMediaContentDetail(src, '', 'audio')
                break;
            }
        }
        handleCloseFormUploadFileMedia(typeFile);
        countContentDetail++;
    }

    // xử lý thêm mới một mục nội dung vào nội dung chi tiết của bài đăng
    const handleAddContentDetail = (name) => {
        switch (name) {
            case 'Image': {
                formUploadImg.removeClass('d-none');
                formUploadImg.addClass('d-flex');
                eSubmitUploadImg.off('click')
                eSubmitUploadImg.click((event) => handleSubmitUploadFileMediaContentDetail(event, 'image'));
                break;
            }
            case 'Title': {
                eContentDetail.append(createControlTitleContent())
                countContentDetail++;
                break;
            }
            case 'Title Italic': {
                eContentDetail.append(createControlTitleContent('italic'))
                countContentDetail++;
                break;
            }
            case 'Title Bold': {
                eContentDetail.append(createControlTitleContent('bold'))
                countContentDetail++;
                break;
            }
            case 'Text': {
                eContentDetail.append(createControlTextContent())
                countContentDetail++;
                break;
            }
            case 'Text Bold': {
                eContentDetail.append(createControlTextContent('bold'))
                countContentDetail++;
                break;
            }
            case 'Text Italic': {
                eContentDetail.append(createControlTextContent('italic'))
                countContentDetail++;
                break;
            }
            case 'Rich Text': {
                eContentDetail.append(createRichTextContent())
                let idEditor = `#content-editor${countContentDetail}`;
                new FroalaEditor(idEditor, configTextEditor, function () {
                    this.html.set('');
                });
                countContentDetail++;
                break;
            }
            case 'Video': {
                formUploadVideo.removeClass('d-none');
                formUploadVideo.addClass('d-flex');
                eSubmitUploadVideo.off('click')
                eSubmitUploadVideo.click((event) => {
                    handleSubmitUploadFileMediaContentDetail(event, 'video');
                })
                countContentDetail++;
                break;
            }
            case 'Audio': {
                formUploadAudio.removeClass('d-none');
                formUploadAudio.addClass('d-flex');
                eSubmitUploadAudio.off('click')
                eSubmitUploadAudio.click((event) => {
                    handleSubmitUploadFileMediaContentDetail(event, 'audio');
                })
                countContentDetail++;
                break;
            }
            default: {
                alert('Thao tác không thể thực hiện!')
            }
        }
    }

    // Gán sự kiện cho các button xử lý thêm mới nội dung chi tiết bài đăng
    btnAddTitle.click(() => handleAddContentDetail('Title'))
    btnAddTitleBold.click(() => handleAddContentDetail('Title Bold'))
    btnAddTitleItalic.click(() => handleAddContentDetail('Title Italic'))
    btnAddText.click(() => handleAddContentDetail('Text'))
    btnAddTextBold.click(() => handleAddContentDetail('Text Bold'))
    btnAddTextItalic.click(() => handleAddContentDetail('Text Italic'))
    btnAddImg.click(() => handleAddContentDetail('Image'))
    btnAddRichText.click(() => handleAddContentDetail('Rich Text'));
    btnAddVideo.click(() => handleAddContentDetail('Video'));
    btnAddAudio.click(() => handleAddContentDetail('Audio'));

    // Gán sự kiện upload image và change img bài đăng khi người dùng click vào ảnh đã upload trước đó.
    eContainerShowImgInFormUploadImg.click(() => {
        const eFileImgUpload = formUploadImg.find('#fileUpload input')
        eFileImgUpload.click();
        eFileImgUpload.change((event) => handleUploadFileMediaContentDetail(event, 'image'))
    })
    btnUploadImg.click(() => {
        const eFileImgUpload = formUploadImg.find('#fileUpload input')
        eFileImgUpload.click();
        eFileImgUpload.change((event) => handleUploadFileMediaContentDetail(event, 'image'))
    })
    // Gán sự kiện upload video và change video bài đăng khi người dùng click vào ảnh đã upload trước đó.
    eChangeVideoInFormUploadVideo.click((event) => {
        event.preventDefault();
        const eFileVideoUpload = formUploadVideo.find('#fileUpload input')
        eFileVideoUpload.click();
        eFileVideoUpload.change((event) => handleUploadFileMediaContentDetail(event, 'video'))
    })
    btnUploadVideo.click(() => {
        const eFileVideoUpload = formUploadVideo.find('#fileUpload input')
        eFileVideoUpload.click();
        eFileVideoUpload.change((event) => handleUploadFileMediaContentDetail(event, 'video'))
    })
    // Gán sự kiện upload audio và change audio bài đăng khi người dùng click vào ảnh đã upload trước đó.
    eChangeAudioInFormUploadAudio.click((event) => {
        event.preventDefault();
        const eFileAudioUpload = formUploadAudio.find('#fileUpload input')
        eFileAudioUpload.click();
        eFileAudioUpload.change((event) => handleUploadFileMediaContentDetail(event, 'audio'))
    })
    btnUploadAudio.click(() => {
        const eFileAudioUpload = formUploadAudio.find('#fileUpload input')
        eFileAudioUpload.click();
        eFileAudioUpload.change((event) => handleUploadFileMediaContentDetail(event, 'audio'))
    })
    // Gán sự kiện đóng form upload file media cho các button trên form
    btnCloseFormUploadImg.click(() => handleCloseFormUploadFileMedia('image'))
    btnCancelFormUploadImg.click(() => handleCloseFormUploadFileMedia('image'))
    btnCloseformUploadVideo.click(() => handleCloseFormUploadFileMedia('video'))
    btnCancelformUploadVideo.click(() => handleCloseFormUploadFileMedia('video'))
    btnCloseformUploadAudio.click(() => handleCloseFormUploadFileMedia('audio'))
    btnCancelFormUploadAudio.click(() => handleCloseFormUploadFileMedia('audio'))

    const eAlert = $('#alert');
    if (eAlert) {
        const eBtnCloseAlert = $('#btn-close');
        eBtnCloseAlert.click(() => {
            eAlert.hide();
        })
    }
});