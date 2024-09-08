const { upload: multer } = require('../../utils/multer');

const createNewsUploadFileSchema = multer.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'contentImages' },
    { name: 'contentVideos' },
    { name: 'contentAudios' }
])

const editNewsUploadFileSchema = multer.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'contentImages' },
    { name: 'contentVideos' },
    { name: 'contentAudios' }
])

module.exports = {
    createNewsUploadFileSchema,
    editNewsUploadFileSchema
}