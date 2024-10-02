const { Category, Tag, NewsTag, News } = require('../models');
const { Op } = require('sequelize');

const CategoryController = {
    async showCategoryList(req, res) {
        try {
            // Khởi tạo giá trị phân trang;
            let currentPage = +req.query.p || 0,
                firstPageOfScope = +req.query.fposc || 0,
                lastPageOfScope = +req.query.lposc || 3;
            let totalPerOnPage = 10;
            let categoryLength = 0;
            let totalPage = Math.ceil(categoryLength / totalPerOnPage);
            let categories = [];

            const user = req.user;
            //TH người dùng tìm kiếm thì ta sẽ truy vấn các danh mục khớp với giá trị tìm kiếm
            if (req.query.q) {
                // Đếm số lượng category thỏa mãn điều kiện search
                categoryLength = await Category.count({
                    where: {
                        ten: req.query.q
                    }
                });
                totalPage = Math.ceil(categoryLength / totalPerOnPage);
                categories = await Category.findAll({
                    where: {
                        ten: req.query.q
                    },
                    offset: currentPage * totalPerOnPage,
                    limit: totalPerOnPage
                });
            } else {
                // TH người dùng không tìm kiếm hoặc giá trị tìm kiếm rỗng ta sẽ lấy ra tất cả các danh mục
                categoryLength = await Category.count();
                totalPage = Math.ceil(categoryLength / totalPerOnPage);
                categories = await Category.findAll({
                    offset: currentPage * totalPerOnPage,
                    limit: totalPerOnPage
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

            res.render('categorys/index.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                path: '/categorys',
                p: currentPage,
                fposc: firstPageOfScope,
                lposc: lastPageOfScope,
                totalPage,
                totalPerOnPage,
                categories,
                q: req.query.q
            })
        }
        catch (e) {
            res.redirect('/500');
        }
    },
    showCreateCategory(req, res) {
        const user = req.user;
        res.render('categorys/create.pug', {
            frontEndURL: process.env.FRONTENDURL,
            user,
            name: '',
            path: '/categorys/create',
            p: 0,
            fposc: 0,
            lposc: 3
        })
    },
    async handleCreateCategory(req, res) {
        try {
            const category = await Category.create({
                ten: req.body.name
            });
            category.save();
            return res.status(200).render('categorys/create.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user: req.user,
                name: '',
                status: true,
                path: '/categorys/create',
                msg: 'Thêm mới danh mục thành công',
                errors: [],
                p: 0,
                fposc: 0,
                lposc: 3
            })
        } catch (e) {
            res.redirect('/500');
        }
    },
    showEditCategory: async function (req, res) {
        try {
            const user = req.user;
            const category = await Category.findOne({
                where: {
                    id: req.params.id
                }
            })
            return res.render('categorys/edit.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                path: '/categorys',
                p: req.query.p,
                fposc: req.query.fposc,
                lposc: req.query.lposc,
                category
            })
        } catch (e) {
            res.redirect('/500');
        }
    },
    handleEditCategory: async function (req, res) {
        await Category.update({ ten: req.body.name }, {
            where: {
                id: req.params.id
            }
        });

        return res.status(200).render('categorys/edit.pug', {
            frontEndURL: process.env.FRONTENDURL,
            user: req.user,
            path: '/categorys',
            p: req.query.p,
            fposc: req.query.fposc,
            lposc: req.query.lposc,
            category: {
                id: req.params.id,
                ten: req.body.name
            },
            status: true,
            msg: 'Cập nhật danh mục thành công!'
        })
    },
    async handleDeleteCategory(req, res) {
        // try {
        //Lấy ra tất cả các tags của danh mục và gỡ tất cả các tags có khỏi các bài đăng có liên kết 
        const tags = await Tag.findAll({
            attributes: ['id'],
            where: {
                danhmuc_id: +req.body.id
            }
        })
        const tagIDList = Array.from(tags).map(tag => tag.id);

        // lấy ra thông tin của các bài đăng nằm thuộc danh mục xóa để check xem có xóa bài đăng không ?
        // danh sách id của bài đăng có thể loại là một trong các thể loại của danh mục xóa
        // nếu bài đăng có các thể loại là các thể loại của danh mục mà không có các thể loại của danh mục khác thì xóa bài đăng đó;
        const newsIDListHasTagInCategory = await NewsTag.findAll({
            attributes: ['baidang_id'],
            where: {
                theloai_id: {
                    [Op.in]: tagIDList
                }
            }
        })
        const newsIDListSelect = new Set();
        newsIDListHasTagInCategory.forEach((item) => {
            newsIDListSelect.add(item.baidang_id);
        });

        const newsListOfCategory = await News.findAll({
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

        // Gỡ tất cả tag của danh mục khỏi các bài đăng có liên kết
        await NewsTag.destroy({
            where: {
                theloai_id: {
                    [Op.in]: tagIDList
                }
            }
        })

        // xóa các bài đăng mà chỉ thuộc mỗi danh mục đang xóa.
        for (let i = 0; i < newsListOfCategory.length; i++) {
            // check xem thể loại của bài đăng có thuộc danh mục nào khác không nếu là true tức không thuộc một danh mục nào khác tiến hành xóa nó!
            let checkTagOfNews = newsListOfCategory[i].tags.every((tag) => tagIDList.includes(tag.id));
            if (checkTagOfNews) {
                News.destroy({
                    where: {
                        id: newsListOfCategory[i].id
                    }
                })
            }
        }

        //Xóa tất cả tag của danh mục
        await Tag.destroy({
            where: {
                danhmuc_id: +req.body.id
            }
        })

        // Xóa danh mục
        await Category.destroy({
            where: {
                id: +req.body.id
            }
        })

        // Xử lý phân trang
        let p = +req.body.p,
            fposc = +req.body.fposc,
            lposc = +req.body.lposc,
            totalPerOnPage = +req.body.totalCategoryOnPage;

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

        // } catch (e) {
        //     res.status(403).json({
        //         message: 'Thao tác đã xảy ra lỗi!',
        //         statusCode: 500,
        //         statusText: "error server"
        //     })
        // }
    }
}
module.exports = CategoryController