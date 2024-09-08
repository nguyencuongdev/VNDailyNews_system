const { Category, Tag, News } = require("../../../models");
const { Op } = require('sequelize');
const { database } = require('../../../utils');

const categoryController = {
    // => trả về danh sách danh mục có trong hệ thống;
    async getCategoryList(req, res) {
        try {
            const categoryList = await Category.findAll({
                include: [
                    {
                        model: Tag,
                        as: "tags",
                        attributes: ['id', 'ten']
                    }
                ],
                order: [['id', 'ASC']]
            })
            return res.status(200).json({
                data: categoryList,
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
    },
    async getNewsListOfCategory(req, res) {
        try {
            const id = +req.params.id;
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 5;

            const fieldsOfNewsQuery = [
                'id',
                'tieude',
                'noidungtomtat',
                'anhdaidien',
                'soluotxem',
                'trangthai',
                'ngaydang',
                'ngaysua'
            ]

            const category = await Category.findOne({
                include: [
                    {
                        model: Tag,
                        attributes: ['id', 'ten'],
                        as: "tags",
                    }
                ],
                where: {
                    id
                }
            })

            if (!category)
                return res.status(404).json({
                    status: true,
                    statusText: 'Thành công',
                    massage: 'Không tìm thấy danh mục!',
                })

            const tagIdsListInCategory = category.tags.map(tag => tag.id);
            const defaultOptionsNewsOfCategoryQuery = {
                attributes: fieldsOfNewsQuery,
                include: [
                    {
                        model: Tag,
                        as: "tags",
                        attributes: ['id', 'ten'],
                        through: {
                            attributes: []
                        },
                        where: {
                            id: {
                                [Op.in]: tagIdsListInCategory
                            }
                        }
                    }
                ],
                limit: 5,
                where: {
                    trangthai: 1,
                }
            }

            const newsNewList = await News.findAll({
                ...defaultOptionsNewsOfCategoryQuery,
                order: [['ngaydang', 'DESC']],
                limit: 5
            })

            const newsMostViewedList = await News.findAll({
                ...defaultOptionsNewsOfCategoryQuery,
                order: [['soluotxem', 'DESC'], ['ngaydang', 'DESC']],
                limit: 10
            })

            const newsByTagListOfCategory = await Tag.findAll({
                attributes: ['id', 'ten'],
                include: [
                    {
                        model: News,
                        as: "news",
                        through: {
                            attributes: []
                        },
                        attributes: fieldsOfNewsQuery,
                        where: {
                            trangthai: 1
                        },
                    }
                ],
                where: {
                    danhmuc_id: id
                },
                offset: (page - 1) * limit,
                limit: limit,
                order: [
                    [{ model: News, as: 'news' }, 'ngaydang', 'DESC']
                ]
            })

            // limit 5
            const limitNewByTagListOfCategory = newsByTagListOfCategory.map(tag => {
                return {
                    id: tag.id,
                    ten: tag.ten,
                    news: tag.news.slice(0, 5)
                }
            })

            return res.status(200).json({
                data: {
                    category: {
                        id: category.id,
                        ten: category.ten
                    },
                    newsNewList,
                    newsMostViewedList,
                    newsByTagListOfCategory: limitNewByTagListOfCategory
                },
                status: true,
                statusText: "success"
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                massage: 'Đã xảy ra lỗi ở phía server'
            })
        }
    }
}

module.exports = categoryController