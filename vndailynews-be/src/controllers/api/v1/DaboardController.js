const { Category, News, Tag, NewsTag } = require('../../../models');
const { Op } = require('sequelize');
const { attributes } = require('./NewsController');

const daboardController = {
    // function controller trả về 10 danh mục trong hệ thống và 5 thể loại, 5 bài đăng mới nhất của danh mục đó;
    async getDaboardNewsList(req, res) {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            const data = [];
            // lấy limit: 10 danh mục đầu tiền
            const categorys = await Category.findAll({
                include: [
                    {
                        model: Tag,
                        as: "tags",
                        attributes: ['id', 'ten'],
                        limit: 5,
                    }
                ],
                order: [['id', 'ASC']],
                offset: (page - 1) * limit,
                limit: limit
            });

            const tagIDListInCategory = [];// mảng chứa danh sách id của từng danh mục;
            categorys.forEach(category => {
                let tempIDList = category.tags.map(tag => tag.id)
                tagIDListInCategory.push(tempIDList);
            });

            for (let i = 0; i < tagIDListInCategory.length; i++) {
                const news = await News.findAll({
                    attributes: attributes,
                    include: [
                        {
                            model: NewsTag,
                            as: "newstags",
                            attributes: [],
                            where: {
                                theloai_id: {
                                    [Op.in]: tagIDListInCategory[i]
                                }
                            }
                        }
                    ],
                    where: {
                        trangthai: 1
                    },
                    limit: 5,
                    order: [
                        ['ngaydang', 'DESC'],
                    ]
                })

                data.push({
                    id: categorys[i].id,
                    ten: categorys[i].ten,
                    tags: categorys[i].tags,
                    news: news
                })
            }
            return res.status(200).json({
                data,
                status: 200,
                statusText: "Thành công",
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                massage: 'Lỗi xảy ra phía server'
            })
        }
    }
}

module.exports = daboardController
