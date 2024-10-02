const { validationResult } = require('express-validator');
const { Tag, News, Category } = require('../models');
const { isLogined, authRole } = require('./auth');
const { createNewSchemaValidate, editNewSchemaValidate, deleteNewsSchemaValidate, updateStatusNewsSchemaValidate } = require('../libs/express_validator');
const { createNewsUploadFileSchema, editNewsUploadFileSchema } = require('../libs/multer');
const { getSrcImage } = require('../utils');


const checkPermission = (req, res, next) => {
    if (![1, 2, 3].includes(req.permission)) {
        return res.status(403).render('404.pug');
    }
    next();
}

const showNewsCreateValidator = [isLogined, authRole, checkPermission]
const createNewsValidator = [isLogined, authRole, checkPermission, createNewsUploadFileSchema,
    ...createNewSchemaValidate, async (req, res, next) => {
        const tagList = await Tag.findAll({
            include: {
                model: Category,
                as: 'category'
            },
            order: [
                ['ten', 'ASC']
            ]
        })
        const contentImages = req.files.contentImages;
        const contentVideos = req.files.contentVideos;
        const contentAudios = req.files.contentAudios;

        const avatar = req.files.avatar;
        let srcAvatar = getSrcImage(avatar[0].location);
        const contentDetailNews = JSON.parse(req.body.contentDetail) || [];
        const contenDetailNewsFormated = [];
        const newsTag = req.body.tags.split(',');

        // xử lý format nội dung chi tiết bài đăng trước khi trả về và trước khi lưu trữ
        for (let i = 0; i < contentDetailNews.length; i++) {
            const content = contentDetailNews[i];
            if (content.type === 'image') {
                let urlImg = getSrcImage(contentImages[0].location);
                contenDetailNewsFormated.push({
                    type: 'image',
                    name: content.name,
                    src: process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + urlImg,
                })
                contentImages.shift();
            }
            else if (content.type === 'video') {
                let urlVideo = getSrcImage(contentVideos[0].location);
                contenDetailNewsFormated.push({
                    type: 'video',
                    name: content.name,
                    src: process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + urlVideo,
                })
                contentVideos.shift();
            } else if (content.type === 'audio') {
                let urlAudio = getSrcImage(contentAudios[0].location);
                let key = contentAudios[0].key;
                contenDetailNewsFormated.push({
                    type: 'audio',
                    src: process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + urlAudio,
                    key: key
                })
                contentAudios.shift();
            }
            else {
                contenDetailNewsFormated.push(content);
            }
        }

        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty()) {
            return res.status(403).json({
                frontEndURL: process.env.FRONTENDURL,
                user: req.user,
                title: req.body.title,
                summary: req.body.summary,
                contentDetail: contenDetailNewsFormated,
                avatar: process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + srcAvatar,
                path: '/news/create',
                tags: newsTag,
                tagList: tagList,
                status: false,
                msg: 'Lỗi: Không thể tạo tin tức mới!',
                errors: errorsValidate.array(),
                p: 0,
                fposc: 0,
                lposc: 3
            })
        }

        req.tagList = tagList
        req.contentDetailNews = contenDetailNewsFormated
        req.avatar = process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + srcAvatar
        next();
    }
]
const eidtNewsValidator = [isLogined, authRole, checkPermission, editNewsUploadFileSchema,
    ...editNewSchemaValidate, async (req, res, next) => {
        const tagList = await Tag.findAll({
            include: {
                model: Category,
                as: 'category'
            },
            order: [
                ['ten', 'ASC']
            ]
        })
        // lấy ra ảnh đại diện cũ của bài đăng.
        // Trong TH người dùng không change ảnh đại diện thì giữ nguyên src của ảnh đại diện;
        const news = await News.findOne({
            attributes: ['anhdaidien'],
            where: {
                id: req.params.id
            }
        })

        const avatar = req.files.avatar;
        let srcAvatar = '';
        srcAvatar = (avatar) ? (process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + getSrcImage(avatar[0].location)) : news.anhdaidien;

        const contentImages = req.files.contentImages;
        const contentVideos = req.files.contentVideos;
        const contentAudios = req.files.contentAudios;
        const contentDetailNews = JSON.parse(req.body.contentDetail) || [];
        const contenDetailNewsFormated = [];

        // xử lý format nội dung chi tiết bài đăng trước khi trả về và trước khi lưu trữ
        for (let i = 0; i < contentDetailNews.length; i++) {
            const content = contentDetailNews[i];
            // Đối với các mục nội dung media của bài đăng, mục nội dung media có change thì src đó sẽ là nguồn mới còn không ta giữ nguyên src của media (Người dùng thay ảnh nội dung phải lấy src liên kết với storage chứ k phải src tempt preview trong trình duyệt);
            if (content.type === 'image') {
                let urlImg = content.src;
                if (content.isChange === 'change') {
                    urlImg = (process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + getSrcImage(contentImages[0].location))
                    contentImages.shift();
                }
                contenDetailNewsFormated.push({
                    type: 'image',
                    name: content.name,
                    src: urlImg,
                })
            } else if (content.type === 'video') {
                let urlVideo = content.src;
                if (content.isChange === 'change') {
                    urlVideo = (process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + getSrcImage(contentVideos[0].location))
                    contentVideos.shift();
                }
                contenDetailNewsFormated.push({
                    type: 'video',
                    name: content.name,
                    src: urlVideo,
                })
            } else if (content.type === 'audio') {
                let urlAudio = content.src;
                let key = content.key || '';
                if (content.isChange === 'change') {
                    urlAudio = (process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + getSrcImage(contentAudios[0].location))
                    key = contentAudios[0].key;
                    contentAudios.shift();
                }
                contenDetailNewsFormated.push({
                    type: 'audio',
                    src: urlAudio,
                    key: key
                })
            } else {
                contenDetailNewsFormated.push(content);
            }
        }

        const newsTags = req.body.tags.split(',');
        const errorsValidate = validationResult(req);

        if (!errorsValidate.isEmpty()) {
            return res.status(403).json({
                frontEndURL: process.env.FRONTENDURL,
                user: req.user,
                title: req.body.title,
                summary: req.body.summary,
                contentDetail: contenDetailNewsFormated,
                avatar: process.env.CLOUDFLARE_R2DEV_SUBDOMAIN + '/' + srcAvatar,
                path: '/news/edit',
                tags: newsTags,
                tagList: tagList,
                status: false,
                msg: 'Lỗi: cập nhật thông tin bài đăng thất bại!',
                errors: errorsValidate.array(),
                p: 0,
                fposc: 0,
                lposc: 3
            })
        }
        req.tagList = tagList
        req.newsTags = newsTags;
        req.contentDetailNews = contenDetailNewsFormated
        req.avatar = srcAvatar
        next();
    }
]

const deleteNewsValidator = [isLogined, authRole, checkPermission,
    ...deleteNewsSchemaValidate, async (req, res, next) => {
        const erorrValidates = validationResult(req);
        if (!erorrValidates.isEmpty()) {
            return res.status(403).json({
                message: 'Id của bài đăng không hợp lệ!',
                statusCode: 403,
                status: false,
                statusText: 'error client'
            })
        }
        next();
    }
]

const updateStatusNewValidator = [isLogined, authRole, (req, res, next) => {
    if (![1, 3].includes(req.permission)) {
        return res.status(403).json({
            message: 'Bạn không có quyền!',
            status: false,
            statusCode: 403,
            statusText: 'error client'
        });
    }
    next();
}, ...updateStatusNewsSchemaValidate,
    async (req, res, next) => {
        const erorrValidates = validationResult(req);
        if (!erorrValidates.isEmpty()) {
            return res.status(400).json({
                message: 'Cập nhật bài đăng thất bại',
                status: false,
                statusCode: 403,
                statusText: 'error client'
            })
        }
        next();
    }]

module.exports = {
    showNewsCreateValidator,
    createNewsValidator,
    eidtNewsValidator,
    deleteNewsValidator,
    updateStatusNewValidator
}