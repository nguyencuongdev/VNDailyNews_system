import { openPhotoswipe, updateProgress } from '/static/js/common.js';

$(document).ready(function () {
    const eTitleNews = $('#content-title');
    const eSummaryContentNews = $('#content-summary');
    const eTagsNews = $('#content-tags');
    const eContentDetail = $('#content_detail')
    const eContentAvatar = $('#content-avatar')

    const btnUploadAvatar = eContentAvatar.find('#avatar-noupload')
    const eContainerShowAvatar = eContentAvatar.find('#avatar-uploaded')

    const btnEditNews = $('#btn-edit-news');
    const eShowAlertSuccess = $('#alert-success');
    const eShowAlertError = $('#alert-error');

    const handleResetFormCreateNews = () => {
        eTitleNews.find('input').val('')
        eSummaryContentNews.find('textarea').val('')
        $('.selectpicker').selectpicker('val', '');
        eContentAvatar.find('input[type="file"]').val(null);
        eContainerShowAvatar.find('img').attr('src', '');
        eContainerShowAvatar.addClass('d-none');
        btnUploadAvatar.removeClass('d-none');
        eContentDetail[0].innerHTML = '';
    }

    const handleEditNews = async (event) => {
        event.preventDefault();
        const eTarget = event.target;
        eTarget.innerText = 'Cập nhật...';
        eTarget.classList.add('locked');
        const eProgressBar = $('#progress-container');
        eProgressBar.removeClass('d-none');
        try {
            const id = paths[paths.length - 2];
            const formData = new FormData();
            const eContentDetailNews = $('.content-detail-item');


            const contentDetailNews = [];
            let checkValidates = [];
            const eMessageContenDetailNews = $('#content_detail-group p.message')[0];

            let arraytItemContentDetail = Object.entries(eContentDetailNews);
            let amountItemContentDetail = arraytItemContentDetail.slice(0, arraytItemContentDetail.length - 2).length;
            let checkContenDetail = handleValidate(eMessageContenDetailNews, amountItemContentDetail, 'Không được để trống nội dung chi tiết!');
            checkValidates.push(checkContenDetail);

            // xử lý formated nội dung chi tiết của trước khi gửi lên server;
            if (checkContenDetail) {
                eContentDetailNews.each((_, element) => {
                    const type = element.getAttribute('data-type');
                    const eMessage = element.querySelector('p.message');
                    switch (type) {
                        case 'title default':
                        case 'title italic':
                        case 'title bold': {
                            let value = element.querySelector('input').value.trim();
                            checkValidates.push(handleValidate(eMessage, value, 'Vui lòng nhập thông tin!'))
                            contentDetailNews.push({
                                type,
                                value
                            })
                            break;
                        }
                        case 'text default':
                        case 'text italic':
                        case 'text bold': {
                            let value = element.querySelector('textarea').value.trim();
                            checkValidates.push(handleValidate(eMessage, value, 'Vui lòng nhập thông tin!'))
                            contentDetailNews.push({
                                type,
                                value
                            })
                            break;
                        }
                        case 'image': {
                            let image = element.querySelector('input[type="file"]').files[0];
                            let name = element.querySelector('.name-image').textContent.trim();
                            let src = element.querySelector('img').getAttribute('src');
                            const eCheckChange = element.querySelector('span.check-change');
                            let isChange = eCheckChange.getAttribute('data-src');
                            (isChange) ? formData.append('contentImages', image) : formData.append('contentImages', null);
                            contentDetailNews.push({
                                type,
                                name,
                                isChange,
                                src
                            })
                            break;
                        }
                        case 'video': {
                            let video = element.querySelector('input[type="file"]').files[0];
                            let name = element.querySelector('.name-image').textContent.trim();
                            let src = element.querySelector('video').getAttribute('src');
                            const eCheckChange = element.querySelector('span.check-change');
                            let isChange = eCheckChange.getAttribute('data-src');
                            (isChange) ? formData.append('contentVideos', video) : formData.append('contentVideos', null);
                            contentDetailNews.push({
                                type,
                                name,
                                isChange,
                                src
                            })
                            break;
                        }
                        case 'audio': {
                            let audio = element.querySelector('input[type="file"]').files[0];
                            let src = element.querySelector('audio').getAttribute('src');
                            const eCheckChange = element.querySelector('span.check-change');
                            let isChange = eCheckChange.getAttribute('data-src');
                            (isChange) ? formData.append('contentAudios', audio) : formData.append('contentAudios', null);
                            contentDetailNews.push({
                                type,
                                isChange,
                                src
                            })
                            break;
                        }
                        case 'richtext': {
                            let value = element.querySelector('.fr-element.fr-view').innerHTML;
                            checkValidates.push(handleValidate(eMessage, value, 'Vui lòng nhập thông tin!'))
                            contentDetailNews.push({
                                type,
                                value,
                            })
                            break;
                        }
                        default: {
                            alert('Nội dung của bài đăng không hợp lệ!');
                        }
                    }
                });
            }
            const titleNews = eTitleNews.find('input').val();
            const summaryNews = eSummaryContentNews.find('textarea').val();
            const tagsNews = eTagsNews.find('select').val();
            let avatarNews = null;
            const echeckChangeAvatar = eContentAvatar.find('span#check-changeAvatar')
            let checkChange = echeckChangeAvatar.attr('data-src');

            const eMessageTitleNews = eTitleNews.find('p.message')[0];
            const eMessageSummaryContentNews = eSummaryContentNews.find('p.message')[0];
            const eMessageTagsNews = eTagsNews.find('p.message')[0];
            const eMessageAvatarNews = eContentAvatar.find('p.message')[0];


            // Xác thực dữ liệu của bài đăng
            checkValidates.push(handleValidate(eMessageTitleNews, titleNews, 'Vui lòng nhập vào tiêu đề bài đăng!'))
            checkValidates.push(handleValidate(eMessageSummaryContentNews, summaryNews, 'Vui lòng nhập nội dung tóm tắt của bài đăng!'))
            checkValidates.push(handleValidate(eMessageTagsNews, tagsNews.length, 'Vui lòng chọn thể loại!'))

            if (checkChange === 'change') {
                avatarNews = eContentAvatar.find('input[type="file"]')[0].files[0]
                checkValidates.push(handleValidate(eMessageAvatarNews, avatarNews, 'Vui lòng tải lên ảnh đại diện!'))
            }

            if (!checkValidates.includes(false)) {
                formData.append('title', titleNews);
                formData.append('summary', summaryNews);
                formData.append('contentDetail', JSON.stringify(contentDetailNews));
                formData.append('tags', tagsNews);
                formData.append('avatar', avatarNews);

                const res = await axios.put(`/news/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: function (progressEvent) {
                        updateProgress(progressEvent.loaded, progressEvent.total)
                    }
                })
                const data = await res.data;
                if (!data.status) {
                    eShowAlertError.removeClass('d-none');
                    setTimeout(() => {
                        eShowAlertError.addClass('d-none');
                    }, 5000)
                    return;
                }
                eShowAlertSuccess.removeClass('d-none');
                setTimeout(() => {
                    eShowAlertSuccess.addClass('d-none');
                }, 5000)
            }
        }
        catch (e) {
            eShowAlertError.removeClass('d-none');
            setTimeout(() => {
                eShowAlertError.addClass('d-none');
            }, 5000)
        }
        finally {
            eTarget.innerText = 'Cập nhật';
            eTarget.classList.remove('locked');
            eProgressBar.addClass('d-none');
            updateProgress(0, 1)
        }
    }

    // cập nhật độ dài số lượng mục nội dung chi tiết của bài đăng;
    let lengtContentDetail = $('#lengthCotentDetail').val();
    countContentDetail = lengtContentDetail;

    // xử lý show froala editor đối với các nội dung richtext trong nội dung chi tiết bài đăng
    const eContentDetailTypeRichtexts = eContentDetail.find('.content-detail-richtext');
    Array.from(eContentDetailTypeRichtexts).forEach((eContent) => {
        let idContentRichText = eContent.getAttribute(('data-target'));
        const eContentValue = eContent.querySelector(`#content-richtext-value${idContentRichText}`);
        let value = eContentValue.innerHTML;
        new FroalaEditor(`#content-richtext${idContentRichText}`, {
            toolbarButtons: configTextEditor.toolbarButtons,
            events: {
                ...configTextEditor.events,
                'initialized': function () {
                    this.html.set(value);
                }
            }
        });

    })

    // Gán sự kiện xử lý cập nhật bài đăng khi click vào button cập nhật.
    btnEditNews.click(handleEditNews)

    const eContentImgInContentDetails = eContentDetail.find('.content-detail-img img');
    eContentImgInContentDetails.each((_, eImg) => {
        eImg.addEventListener('click', () => {
            openPhotoswipe(eImg);
        })
    })
});