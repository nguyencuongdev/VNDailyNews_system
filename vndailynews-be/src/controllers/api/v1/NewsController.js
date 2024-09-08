const { News, Tag, User } = require("../../../models")
const { Op } = require('sequelize');

const attributes = [
    'id',
    'tieude',
    'noidungtomtat',
    'anhdaidien',
    'soluotxem',
    "trangthai",
    "ngaydang",
    "ngaysua"
]

const newsController = {
    // function controller trả về danh sách bài đăng mới nhất
    async getNewsNewList(req, res) {
        try {
            let limit = +req.query.limit || 5;
            const newsList = await News.findAll({
                attributes: attributes,
                limit: limit,
                where: {
                    trangthai: 1,
                },
                order: [['ngaydang', 'DESC']]
            })

            return res.status(200).json({
                data: newsList,
                status: true,
                statusText: 'Thành công'
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                massage: 'Lỗi xảy ra ở phía server'
            })
        }
    },
    // function controller trả về danh sách các bài đăng mới nhất có lượt xem cao nhất
    async getNewsProposeList(req, res) {
        try {
            let currentDate = new Date();
            let firstTimeCurrentDate = currentDate.setHours(0, 0, 0, 0);
            let lastTimeCurrentDate = currentDate.setHours(23, 59, 59, 999);

            let limit = +req.query.limit || 5;
            const newsList = await News.findAll({
                attributes: attributes,
                limit: limit,
                where: {
                    trangthai: 1,
                    ngaydang: {
                        [Op.between]: [firstTimeCurrentDate, lastTimeCurrentDate]
                    },
                    soluotxem: {
                        [Op.gte]: 1
                    }
                },
                order: [['soluotxem', 'DESC'], ['ngaydang', 'DESC']]
            })

            return res.status(200).json({
                data: newsList,
                status: true,
                statusText: 'Thành công'
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                massage: 'Lỗi xảy ra ở phía server'
            })
        }
    },
    async getInforDetailNews(req, res) {
        try {
            let id = +req.params.id;
            const news = await News.findOne({
                attributes: [
                    ...attributes,
                    'noidungchitiet'
                ],
                include: [
                    {
                        attributes: ['id', 'ten'],
                        through: {
                            attributes: []
                        },
                        model: Tag,
                        as: 'tags'
                    },
                    {
                        attributes: ['id', 'tenhienthi'],
                        model: User,
                        as: 'user',
                    }
                ],
                where: {
                    trangthai: 1,
                    id
                }
            })

            if (!news)
                return res.status(404).json({
                    status: true,
                    statusText: 'Thành công',
                    massage: 'Không tìm thấy bài đăng!',
                })

            const tagIdList = Array.isArray(news.tags) ? news.tags.map((tag) => tag.id) : [];
            const newsSimilarList = await News.findAll({
                attributes: attributes,
                include: [
                    {
                        attributes: ['id', 'ten'],
                        model: Tag,
                        as: 'tags',
                        through: {
                            attributes: []
                        },
                        where: {
                            id: {
                                [Op.in]: tagIdList
                            }
                        }
                    }
                ],
                where: {
                    trangthai: 1
                },
                limit: 10,
                order: [['ngaydang', 'DESC']]
            })

            return res.status(200).json({
                data: {
                    inforNews: {
                        id: news.id,
                        tiede: news.tieude,
                        noidungtomtat: news.noidungtomtat,
                        noidungchitiet: news.noidungchitiet,
                        ngaydang: news.ngaydang,
                        ngaysua: news.ngaysua,
                        anhdaidien: news.anhdaidien,
                        soluotxem: news.soluotxem
                    },
                    tags: news.tags,
                    user: news.user,
                    newsSimilarList
                },
                status: true,
                statusText: 'Thành công',
            })

        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                massage: 'Lỗi xảy ra ở phía server!'
            })
        }
    },
    async updateAmountSeenNews(req, res) {
        try {
            const id = +req.params.id;
            const news = await News.findOne({
                where: { id: id },
            })

            if (!news)
                return res.status(404).json({
                    status: true,
                    statusText: 'Thành công',
                    massage: 'Không tìm thấy bài đăng!',
                })

            let amountSeen = news.soluotxem + 1;
            await News.update(
                { soluotxem: amountSeen },
                {
                    where: {
                        id: id
                    }
                }
            )
            return res.status(200).json({
                status: true,
                statusText: "Thành công",
                message: "Cập nhật số lượt xem thành công!"
            })
        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                message: 'Lỗi xảy ra phía server'
            })
        }
    },
    async getNewsListBySearch(req, res) {
        try {
            const searchValue = req.query.searchValue || '';
            const page = +req.query.page;
            const limit = +req.query.limit;

            const news = await News.findAll({
                attributes: attributes,
                where: {
                    trangthai: 1,
                    tieude: {
                        [Op.like]: `%${searchValue}%`
                    }
                },
                offset: (page - 1) * limit,
                limit: limit,
                order: [['ngaydang', 'DESC']]
            })

            return res.status(200).json({
                newsList: news,
                status: true,
                statusText: "Thành công",
            })

        } catch (err) {
            return res.status(500).json({
                status: false,
                statusText: 'Thất bại',
                message: 'Lỗi xảy ra ở phía server'
            })
        }
    }
}

module.exports = {
    newsController,
    attributes
};