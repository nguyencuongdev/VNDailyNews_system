const { where } = require("sequelize");
const { Category, Tag, News, NewsTag } = require("../../../models");

const { attributes } = require('./NewsController');

const tagController = {
    async getNewsOfTagInCategory(req, res) {
        try {
            const idTag = +req.params.idTag;
            const limit = +req.query.limit || 10;
            const page = +req.query.page || 1;

            const tag = await Tag.findOne({
                include: [
                    {
                        model: Category,
                        as: "category"
                    }
                ],
                where: {
                    id: idTag
                }
            })

            if (!tag) {
                return res.status(404).json({
                    message: "Thể loại không tồn tại!",
                    status: true,
                    statusText: "OK"
                })
            }

            const newsListOfTag = await News.findAll({
                attributes,
                include: [
                    {
                        model: NewsTag,
                        as: "newstags",
                        attributes: [],
                        where: {
                            theloai_id: idTag
                        }
                    }
                ],
                where: {
                    trangthai: 1
                },
                limit: limit,
                offset: (page - 1) * limit,
                orderBy: [['ngaysua', 'DESC']]
            })

            const countNewsOfTag = await News.findAll({
                attributes: ['id', 'tieude', 'trangthai'],
                include: {
                    model: NewsTag,
                    as: "newstags",
                    attributes: ['theloai_id'],
                    where: {
                        theloai_id: idTag
                    }
                },
                where: {
                    trangthai: 1
                },
            })


            return res.status(200).json({
                data: {
                    tag: {
                        id: tag.id,
                        ten: tag.ten
                    },
                    category: {
                        id: tag.category.id,
                        ten: tag.category.ten
                    },
                    newsList: newsListOfTag,
                    toTalPerOnDB: countNewsOfTag.length,
                    totalPerOnPage: limit,
                    currentPage: page
                },
                status: true,
                statusText: "OK"
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Failed',
                massage: 'Server error'
            })
        }
    }
}

module.exports = tagController