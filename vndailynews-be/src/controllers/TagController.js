const { Op } = require('sequelize');
const { Tag, Category, NewsTag, News } = require('../models');

const TagController = {
    async showTagList(req, res) {
        try {
            // Khởi tạo giá trị phân trang;
            let currentPage = +req.query.p || 0,
                firstPageOfScope = +req.query.fposc || 0,
                lastPageOfScope = +req.query.lposc || 3;
            let totalPerOnPage = 10;
            let tagLength = 0;
            let totalPage = Math.ceil(tagLength / totalPerOnPage);
            let tags = [];

            const user = req.user;
            //TH người dùng tìm kiếm thì ta sẽ truy vấn các danh mục khớp với giá trị tìm kiếm
            if (req.query.q) {
                // Đếm số lượng tag thỏa mãn điều kiện search
                tagLength = await Tag.count({
                    include: [
                        {
                            model: Category,
                            as: 'category',
                        }
                    ],
                    where: {
                        [Op.or]: [
                            {
                                ten: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                '$category.ten$': {
                                    [Op.like]: `${req.query.q}%`
                                }
                            }
                        ]
                    }
                });
                totalPage = Math.ceil(tagLength / totalPerOnPage);
                // Lấy ra cá tags thỏa mãn giá trị search và xử lý phân trang
                tags = await Tag.findAll({
                    include: [
                        {
                            model: Category,
                            as: 'category',
                        }
                    ],
                    where: {
                        [Op.or]: [
                            {
                                ten: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                '$category.ten$': {
                                    [Op.like]: `${req.query.q}%`
                                }
                            }
                        ]
                    },
                    offset: currentPage * totalPerOnPage,
                    limit: totalPerOnPage
                });
            } else {
                // TH người dùng không tìm kiếm hoặc giá trị tìm kiếm rỗng ta sẽ lấy ra tất cả các thể loại
                tagLength = await Tag.count();
                totalPage = Math.ceil(tagLength / totalPerOnPage);
                tags = await Tag.findAll({
                    offset: currentPage * totalPerOnPage,
                    limit: totalPerOnPage,
                    include: [
                        {
                            model: Category,
                            as: 'category'
                        }
                    ]
                });
            }

            // Xử lý change component phân trang
            // Nếu trang hiện tại lớn hơn chỉ mục của trang cuối cùng trong khoảng trang hiển thị trước đó 
            // set lại khoảng trang
            if ((currentPage > lastPageOfScope) && (currentPage === lastPageOfScope + 1)) {
                lastPageOfScope = lastPageOfScope + 4;
                firstPageOfScope = currentPage;
            }
            // Nếu trang hiện tại nhỏ hơn chỉ mục của trang đầu tiên trong khoảng trang hiển thị trước đó
            // set lại khoảng trang
            else if ((currentPage < firstPageOfScope) && (currentPage === firstPageOfScope - 1)) {
                lastPageOfScope = firstPageOfScope - 1;
                firstPageOfScope = firstPageOfScope - 4;
            }

            else if ((currentPage > lastPageOfScope) && (currentPage === totalPage - 1)) {
                lastPageOfScope = totalPage - 1;
                firstPageOfScope = totalPage - 4;
            }

            res.render('tags/index.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                path: '/tags',
                p: currentPage,
                fposc: firstPageOfScope,
                lposc: lastPageOfScope,
                totalPage,
                totalPerOnPage,
                tags,
                q: req.query.q
            })
        }
        catch (err) {
            res.redirect('/500');
        }
    },
    async showTagCreate(req, res) {
        const category = new Category();
        const categoryList = await category.getCategorys();
        const user = req.user;
        res.render('tags/create.pug', {
            frontEndURL: process.env.FRONTENDURL,
            user,
            name: '',
            categoryID: -1,
            path: '/tags/create',
            p: 0,
            fposc: 0,
            lposc: 3,
            categorys: categoryList,
        })
    },
    async handleCreateTag(req, res) {
        try {
            const categoryList = req.categoryList;
            const tag = await Tag.create({
                ten: req.body.name,
                danhmuc_id: req.body.categoryID,
            });
            tag.save();
            return res.status(200).render('tags/create.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user: req.user,
                name: '',
                categoryID: -1,
                categorys: categoryList,
                path: '/tags/create',
                status: true,
                msg: 'Thêm mới thể loại thành công!',
                errors: [],
                p: 0,
                fposc: 0,
                lposc: 3
            })
        }
        catch (err) {
            res.redirect('/500')
        }
    },
    async showEditTag(req, res) {
        try {
            const user = req.user;
            // Lấy ra thông tin của tag cần edit
            const tag = await Tag.findOne({
                include: [
                    {
                        model: Category,
                        as: 'category'
                    }
                ],
                where: {
                    id: req.params.id
                }
            })
            const categoryList = req.categoryList;
            res.render('tags/edit.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                path: '/tags',
                id: tag.id,
                name: tag.ten,
                categoryID: tag.category.id,
                categorys: categoryList,
                p: req.query.p,
                fposc: req.query.fposc,
                lposc: req.query.lposc
            })
        } catch (e) {
            res.redirect('/500');
        }
    },
    async handleEditTag(req, res) {
        const categoryList = req.categoryList;
        await Tag.update({
            ten: req.body.name,
            danhmuc_id: req.body.categoryID
        }, {
            where: {
                id: req.params.id
            }
        });
        return res.status(200).render('tags/edit.pug', {
            frontEndURL: process.env.FRONTENDURL,
            user: req.user,
            path: '/tags',
            p: req.query.p,
            fposc: req.query.fposc,
            lposc: req.query.lposc,
            id: +req.params.id,
            name: req.body.name,
            categoryID: +req.body.categoryID,
            status: true,
            categorys: categoryList,
            msg: 'Cập nhật thể loại thành công!'
        })
    },
    async handleDeleteTag(req, res) {
        try {
            // lấy ra thông tin của các bài đăng thuộc thể loại để xem có xóa hay không ?
            // danh sách id của bài đăng có thể loại thuộc
            // nếu bài đăng thuộc mỗi thể loại đang xóa thì sẽ tiến hành xóa còn không sẽ chỉ gỡ thể loại khỏi bài đăng đó;
            const newsIDListHasTag = await NewsTag.findAll({
                attributes: ['baidang_id'],
                where: {
                    theloai_id: +req.body.id
                }
            })
            const newsIDListSelect = new Set();
            newsIDListHasTag.forEach((item) => {
                newsIDListSelect.add(item.baidang_id);
            });
            const newsListOfTag = await News.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: Tag,
                        as: "tags",
                        attributes: ['id'],
                        through: {
                            attributes: []
                        }
                    }
                ],
                where: {
                    id: {
                        [Op.in]: Array.from(newsIDListSelect)
                    }
                }
            })
            // Gỡ tag này khởi các bài đăng có liên kết
            await NewsTag.destroy({
                where: {
                    theloai_id: +req.body.id
                }
            })

            // xóa các bài đăng mà chỉ thuộc mỗi thể loại đang xóa.
            for (let i = 0; i < newsListOfTag.length; i++) {
                if (newsListOfTag[i].tags.length === 1) {
                    News.destroy({
                        where: {
                            id: newsListOfTag[i].id
                        }
                    })
                }
            }

            // Xóa tag
            await Tag.destroy({
                where: {
                    id: +req.body.id
                }
            })

            // Xử lý phân trang
            let p = +req.query.p,
                fposc = +req.query.fposc,
                lposc = +req.query.lposc,
                totalPerOnPage = +req.body.totalTagOnPage;
            if (totalPerOnPage - 1 < 1 && p !== 0) {
                p = p - 1;
            }

            return res.status(200).json({
                message: "Xóa danh mục thành công!",
                statusCode: 200,
                statusText: "success",
                p,
                fposc,
                lposc
            })

        } catch (e) {
            return res.status(403).json({
                message: 'Thao tác đã xảy ra lỗi!',
                statusCode: 500,
                statusText: "error server"
            })
        }
    }
}
module.exports = TagController;