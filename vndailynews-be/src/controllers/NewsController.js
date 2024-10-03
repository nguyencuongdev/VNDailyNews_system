const { Tag, News, NewsTag, Category, User } = require('../models');
const { initPagination, setPagination, formatDateTime } = require('../utils');
const { Op } = require('sequelize');

const NewsController = {
    async showNewsList(req, res) {
        try {
            // Khởi tạo giá trị phân trang;
            let pagination = initPagination(req);

            let totalPerOnPage = 10;
            let newsLength = 0;
            let totalPage = 0;
            let newsList = [];

            const whereFilter = {}; //filter theo danh mục của bài đăng
            const wheres = {}; //Chứa các mệnh đề điều kiện query
            const orders = [];// chứa các mệnh đề sắp xếp trong câu lệnh query
            const user = req.user;

            // kiểm tra xem người dùng sắp xếp theo loại gì 
            // có 2 loại là: thời gian và số lượt xem
            switch (req.query.s) {
                case 'timeOld': {
                    // sắp xếp danh sách tin tức có thời gian tạo cũ nhất đến mới nhất;
                    orders.push(['ngaydang', 'ASC'])
                    break;
                }
                case 'seenLarge': {
                    // sắp xếp danh sách tin tức có số lượt xem nhiều nhất đến ít nhất
                    orders.push(['soluotxem', 'DESC'])
                    break;
                }
                case 'seenSmall': {
                    // sắp xếp danh sách tin tức có số lượt xem ít nhất đến nhiều nhất
                    orders.push(['soluotxem', 'ASC'])
                    break;
                }
                default: {
                    // mặc định sắp xếp danh sách tin tức có thời gian cập nhật mới nhất đến cũ nhất.
                    orders.push(['ngaydang', 'DESC'])
                }
            }
            // Nếu người dùng filter danh sách theo thể loại thì thêm một mệnh đề where;
            if (req.query.ft)
                whereFilter['ten'] = {
                    [Op.eq]: req.query.ft
                }


            const defaultOptionsQuery = {
                attributes: [
                    'id',
                    'tieude',
                    'noidungtomtat',
                    'anhdaidien',
                    'soluotxem',
                    "trangthai",
                    "ngaydang",
                    "ngaysua"
                ],
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['id', 'ten'], // chỉ lấy ra id và ten của tag
                        // thông tin của bản ghi có liên kết trong bảng nối sẽ không được kèm khi lấy tag
                        through: {
                            attributes: []
                        },
                        // bao gồm thông tin của danh mục mà tag đó thuộc về
                        include: [
                            {
                                model: Category,
                                as: 'category',
                            }
                        ],
                        where: whereFilter
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'tenhienthi']
                    }
                ],
                order: orders
            }
            const countOptions = {
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        where: whereFilter,
                        required: true, // chỉ đếm những bản ghi có liên kết với tags phù hợp với điều kiện whereFilter
                    }
                ]
            };
            // đối với người dùng là nhà báo thì chỉ lấy ra các bài đăng của nhà báo đó.
            if (user.vaitro_id === 3)
                wheres['nguoidung_id'] = {
                    [Op.eq]: user.id
                }

            //TH người dùng tìm kiếm thì ta sẽ truy vấn các bài đăng có tên tương đối khớp với giá trị tìm kiếm
            if (req.query.q) {
                wheres['tieude'] = {
                    [Op.like]: `%${req.query.q}%`
                }

                // Đếm số lượng bài viết thỏa mãn điều kiện tìm kiếm
                newsLength = await News.count({
                    ...countOptions,
                    where: wheres
                });
                totalPage = Math.ceil(newsLength / totalPerOnPage);
                // Lấy ra các bài viết thỏa mãn giá trị tìm kiếm và xử lý phân trang
                newsList = await News.findAll({
                    ...defaultOptionsQuery,
                    where: wheres,
                    offset: pagination.currentPage * totalPerOnPage,
                    limit: totalPerOnPage,
                });

            } else {
                // TH người dùng không tìm kiếm hoặc giá trị tìm kiếm rỗng ta sẽ lấy ra tất cả các tin tức của người dùng;
                newsLength = await News.count({
                    ...countOptions,
                    where: wheres
                });

                totalPage = Math.ceil(newsLength / totalPerOnPage);
                newsList = await News.findAll({
                    ...defaultOptionsQuery,
                    offset: pagination.currentPage * totalPerOnPage,
                    limit: totalPerOnPage,
                    where: wheres
                });

            }

            const tags = await Tag.findAll();
            pagination = setPagination(req);

            return res.render('news/index.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                path: '/news',
                p: pagination.currentPage,
                fposc: pagination.firstPageOfScope,
                lposc: pagination.lastPageOfScope,
                totalPage,
                totalPerOnPage,
                newsList,
                tags,
                q: req.query.q || '',
                s: req.query.s || 'timeNew',
                ft: req.query.ft || '',
                formatDateTime
            })
        } catch (err) {
            return res.redirect('/500');
        }
    },
    async showNewsCreate(req, res) {
        try {
            const tagList = await Tag.findAll({
                include: {
                    model: Category,
                    as: 'category'
                },
                order: [
                    ['ten', 'ASC']
                ]
            })
            const user = req.user;
            return res.render('news/create.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                title: '',
                summary: '',
                contentDetail: [],
                avatar: null,
                tags: [],
                tagList,
                path: '/news/create',
                p: 0,
                fposc: 0,
                lposc: 3,
            })
        } catch (err) {
            return res.redirect('/500');
        }
    },
    async handleCreateNews(req, res) {
        try {
            const avatar = req.avatar;
            const { title, summary, tags } = req.body;
            const contentDetailNews = req.contentDetailNews || [];
            const user = req.user;

            // tạo một bài đăng mới với data mà client gửi lên
            const news = await News.create({
                tieude: title,
                noidungtomtat: summary,
                noidungchitiet: JSON.stringify(contentDetailNews),
                anhdaidien: avatar,
                soluotxem: 0,
                nguoidung_id: user.id,
                trangthai: true
            })
            news.save();
            const newsTags = tags.split(',');
            // Lưu tất cả thể loại của bài đăng vào trong bảng bằng đăng - thể loại
            for (let i = 0; i < newsTags.length; i++) {
                const tag = await NewsTag.create({
                    baidang_id: news.id,
                    theloai_id: newsTags[i]
                })
                tag.save();
            };

            return res.status(201).json({
                path: '/news/create',
                data: {
                    title,
                    summary,
                    contentDetailNews,
                    avatar,
                    tags,
                    nguoidung_id: user.id,
                    amountSeen: 0
                },
                status: true,
                msg: 'Đăng tải bài đăng thành công!',
            })
        } catch (e) {
            return res.redirect('/500');
        }
    },
    async showEditNews(req, res) {
        try {
            const { id } = req.params;
            const { p, fposc, lposc } = req.query;
            const user = req.user;
            const tagList = await Tag.findAll({
                include: {
                    model: Category,
                    as: 'category'
                },
                order: [
                    ['ten', 'ASC']
                ]
            }); // danh sách các thể loại có trong hệ thống

            const news = await News.findOne({
                include: {
                    model: NewsTag,
                    as: "newstags",
                    attributes: ['id', 'theloai_id']
                },
                where: {
                    id
                }
            })
            const tagsOfNews = [];// danh sách các thể loại của bài đăng;
            news.newstags.forEach(newstag => {
                tagsOfNews.push(newstag.theloai_id);
            });
            const contentDetail = JSON.parse(news.noidungchitiet);
            return res.render('news/edit.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                tagList,
                title: news.tieude,
                summary: news.noidungtomtat,
                contentDetail,
                tags: tagsOfNews,
                avatar: news.anhdaidien,
                path: 'news/edit',
                status: true,
                p, fposc, lposc
            })
        } catch (e) {
            return res.redirect('/500');
        }
    },

    async handleEditNews(req, res) {
        try {
            const avatar = req.avatar;
            const { title, summary } = req.body;
            const contentDetailNews = req.contentDetailNews || [];
            const user = req.user;

            // Cập nhật thông tin của bài đăng với data mà client gửi lên
            await News.update({
                tieude: title,
                noidungtomtat: summary,
                noidungchitiet: JSON.stringify(contentDetailNews),
                anhdaidien: avatar,
            }, {
                where: {
                    id: req.params.id
                }
            })
            const news = await News.findOne({
                where: {
                    id: req.params.id
                }
            })
            const newsTags = req.newsTags;
            // xóa tất cả thể loại cũ của bài đăng trước đó để cập nhật lại;
            await NewsTag.destroy({
                where: {
                    baidang_id: req.params.id
                }
            })
            // Lưu tất cả thể loại của bài đăng vào trong bảng bằng đăng - thể loại
            for (let i = 0; i < newsTags.length; i++) {
                const tag = await NewsTag.create({
                    baidang_id: news.id,
                    theloai_id: newsTags[i]
                })
                tag.save();
            };

            return res.status(200).json({
                status: true,
                data: {
                    ...news
                },
                msg: 'Cập nhật thông tin bài đăng thành công!',
            })
        }
        catch (err) {
            return res.redirect('/500');
        }

    },
    async handleDeleteNews(req, res) {
        try {
            // Gỡ tag này của bài đăng này có liên kết
            await NewsTag.destroy({
                where: {
                    baidang_id: req.body.id
                }
            })

            // Xóa News
            await News.destroy({
                where: {
                    id: req.body.id
                }
            })

            // Xử lý phân trang
            let p = +req.query.p,
                fposc = +req.query.fposc,
                lposc = +req.query.lposc,
                totalPerOnPage = +req.body.totalNewsOnPage;
            if (totalPerOnPage - 1 < 1 && p !== 0) {
                p = p - 1;
            }

            return res.status(200).json({
                message: "Xóa bài đăng thành công!",
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
    },
    async showInforDetailNews(req, res) {
        try {
            const { id } = req.params;
            const { p, fposc, lposc } = req.query;
            const user = req.user;

            // Lấy ra thông tin của bài đăng 
            const news = await News.findOne({
                include: {
                    model: Tag,
                    as: "tags",
                    through: {
                        attributes: []
                    },
                },
                where: {
                    id
                }
            })

            const wheres = {}; // điều kiện query
            if (user.vaitro_id === 3)
                wheres['nguoidung_id'] = user.id;

            const newsOfUsers = await News.findAll({
                include: {
                    model: Tag,
                    as: "tags",
                    through: {
                        attributes: []
                    }
                },
                where: {
                    ...wheres,
                    id: {
                        [Op.ne]: id
                    }
                }
            })

            // kiểm tra xem một trong số bài đăng mà người dùng đăng tải có chung thể loại nào đó hay không vs bài đăng hiện tại;
            const newsSimilars = newsOfUsers.filter(item => {
                return news.tags.some((value) => item.tags.map(tag => tag.id).includes(value.id));
            });

            let random10NewsSimilar = [];
            const idNewsRandowmTemp = [];


            // Giới hạn 10 bài đăng ngẫu nhiên sẽ được trả về cho người dùng
            if (newsSimilars.length > 10) {
                for (let i = 1; i <= 10; i++) {
                    let randomNumber = Math.floor(Math.random() * newsSimilars.length);
                    while (idNewsRandowmTemp.includes(randomNumber)) {
                        randomNumber = Math.floor(Math.random() * newsSimilars.length);
                    }
                    random10NewsSimilar.push(newsSimilars[randomNumber]);
                }
            } else {
                // th số bài đăng tương tự ít hơn 10 ta sẽ trả thẳng danh sách bài đăng tương tự luôn;
                random10NewsSimilar = [...newsSimilars];
            }

            const contentDetail = JSON.parse(news.noidungchitiet);
            return res.render('news/inforDetail.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user,
                id: news.id,
                title: news.tieude,
                summary: news.noidungtomtat,
                contentDetail,
                tags: news.tags,
                avatar: news.anhdaidien,
                trangthai: news.trangthai,
                nguoidung_id: news.nguoidung_id,
                newsSimilars: random10NewsSimilar,
                path: 'news/detail',
                status: true,
                p, fposc, lposc
            })
        } catch (e) {
            return res.redirect('/500');
        }
    },

    async handleUpdateStatusNews(req, res) {
        try {
            const id = req.params.id;
            const status = req.body.status;
            await News.update({
                trangthai: status
            }, {
                where: {
                    id
                }
            })
            return res.status(200).json({
                message: 'Cập nhật trạng thái bài đăng thành công',
                status: true,
                statusCode: 200,
                statusText: 'Ok'
            })
        } catch (e) {
            return res.status(500).json({
                message: 'Cập nhật trạng thái bài đăng thất bại',
                statusCode: 500,
                statusText: 'Server error'
            })
        }
    }
}
module.exports = NewsController;