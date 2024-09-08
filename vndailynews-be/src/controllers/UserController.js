const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { Op } = require('sequelize');

const { User, Role, News } = require('../models');

const UserController = {
    async showUserList(req, res) {
        try {
            // Khởi tạo giá trị phân trang;
            let currentPage = +req.query.p || 0,
                firstPageOfScope = +req.query.fposc || 0,
                lastPageOfScope = +req.query.lposc || 3;
            let totalPerOnPage = 10;
            let userLength = 0;
            let totalPage = Math.ceil(userLength / totalPerOnPage);
            let users = [];

            const user = req.user;
            //TH người dùng tìm kiếm thì ta sẽ truy vấn các user khớp với giá trị tìm kiếm
            if (req.query.q) {
                // Đếm số lượng User thỏa mãn điều kiện search
                userLength = await User.count({
                    include: [
                        {
                            model: Role,
                            as: 'role'
                        }
                    ],
                    where: {
                        [Op.or]: [
                            {
                                tenhienthi: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                taikhoan: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                '$role.ten$': {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                email: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                sdt: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                        ]
                    }
                });
                totalPage = Math.ceil(userLength / totalPerOnPage);
                users = await User.findAll({
                    include: [
                        {
                            model: Role,
                            as: 'role'
                        }
                    ],
                    where: {
                        [Op.or]: [
                            {
                                tenhienthi: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                taikhoan: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                '$role.ten$': {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                email: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                            {
                                sdt: {
                                    [Op.like]: `${req.query.q}%`
                                }
                            },
                        ]
                    },
                    offset: currentPage * totalPerOnPage,
                    limit: totalPerOnPage,
                    order: [
                        ['tenhienthi', 'ASC'],
                        ['taikhoan', 'ASC'],
                        ['email', 'ASC'],
                        ['sdt', 'ASC']
                    ]
                });

            } else {
                // TH người dùng không tìm kiếm hoặc giá trị tìm kiếm rỗng ta sẽ lấy ra tất cả các user trong hệ thống
                userLength = await User.count();
                totalPage = Math.ceil(userLength / totalPerOnPage);
                users = await User.findAll({
                    include: [
                        {
                            model: Role,
                            as: 'role'
                        }
                    ],
                    offset: currentPage * totalPerOnPage,
                    limit: totalPerOnPage,
                    order: [
                        ['tenhienthi', 'ASC'],
                        ['taikhoan', 'ASC'],
                        ['email', 'ASC'],
                        ['sdt', 'ASC']
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

            res.render('users/index.pug', {
                user,
                path: '/users',
                p: currentPage,
                fposc: firstPageOfScope,
                lposc: lastPageOfScope,
                totalPage,
                totalPerOnPage,
                users,
                q: req.query.q
            })
        }
        catch (e) {
            res.redirect('/500');
        }
    },
    async showUserCreate(req, res) {
        const roles = await Role.findAll({
            order: [
                ['ten', 'ASC']
            ]
        })
        const user = req.user;
        res.render('users/create.pug', {
            user,
            inforUserNew: {
                username: '',
                account: '',
                password: '',
                comfirmPassword: '',
                roleID: -1,
                email: '',
                phone: '',
                status: true,
                note: '',
            },
            path: '/users/create',
            p: 0,
            fposc: 0,
            lposc: 3,
            roles
        })
    },
    async handleCreateUser(req, res) {
        try {
            const roles = req.roles;
            const saltRounds = Number(process.env.BCRYPT_SALT);

            let passwordHash = await bcrypt.hash(req.body.password, saltRounds);
            const user = await User.create({
                tenhienthi: req.body.username,
                vaitro_id: req.body.roleID,
                taikhoan: req.body.account,
                matkhau: passwordHash,
                email: req.body.email,
                sdt: req.body.phone,
                trangthai: req.body.status === '1' ? true : false,
                ghichu: req.body.note
            });
            user.save();
            return res.status(201).render('users/create.pug', {
                user: req.user,
                inforUserNew: {
                    username: '',
                    account: '',
                    password: '',
                    comfirmPassword: '',
                    roleID: -1,
                    email: '',
                    phone: '',
                    status: true,
                    note: '',
                },
                roles,
                path: '/users/create',
                status: true,
                msg: 'Thêm mới người dùng thành công!',
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
    async showUserUpdate(req, res) {
        const roles = await Role.findAll({
            order: [
                ['ten', 'ASC']
            ]
        })
        const user = req.user;
        const { p, fposc, lposc } = req.query;
        const { id } = req.params;
        const inforUserEdit = await User.findOne({
            where: {
                id,
            }
        })

        res.render('users/edit.pug', {
            user,
            inforUser: {
                id,
                username: inforUserEdit.tenhienthi,
                account: inforUserEdit.taikhoan,
                passwordnew: '',
                roleID: inforUserEdit.vaitro_id,
                email: inforUserEdit.email,
                phone: inforUserEdit.sdt,
                status: inforUserEdit.trangthai,
                note: inforUserEdit.ghichu
            },
            roles,
            path: '/users/edit',
            p,
            fposc,
            lposc
        })
    },
    async handleUpdateUser(req, res) {
        try {
            const roles = req.roles;
            const id = req.params.id;
            const { p, fposc, lposc } = req.query;
            const { username, password, email, account, phone, roleID, status, note } = req.body;
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('users/edit.pug', {
                    user: req.user,
                    inforUser: {
                        id,
                        username,
                        account,
                        password,
                        roleID: +roleID,
                        email,
                        phone,
                        status,
                        note,
                    },
                    roles,
                    path: '/users/edit',
                    status: false,
                    msg: 'Cập nhật người dùng không thành công!',
                    errors: errorsValidator.array(),
                    p,
                    fposc,
                    lposc
                })
            }
            if (password) {
                const saltRounds = Number(process.env.BCRYPT_SALT);
                let passwordHash = await bcrypt.hash(password, saltRounds);
                await User.update(
                    {
                        tenhienthi: username,
                        email: email,
                        matkhau: passwordHash,
                        sdt: phone,
                        vaitro_id: roleID,
                        trangthai: status,
                        ghichu: note
                    }, {
                    where: {
                        id
                    }
                })
            } else {
                await User.update(
                    {
                        tenhienthi: username,
                        email: email,
                        sdt: phone,
                        vaitro_id: roleID,
                        trangthai: status,
                        ghichu: note
                    }, {
                    where: {
                        id
                    }
                })
            }
            return res.status(403).render('users/edit.pug', {
                user: req.user,
                inforUser: {
                    id,
                    username,
                    account,
                    password,
                    roleID: +roleID,
                    email,
                    phone,
                    status,
                    note
                },
                roles,
                path: '/users/edit',
                status: true,
                msg: 'Cập nhật người dùng thành công!',
                errors: [],
                p,
                fposc,
                lposc
            })
        }
        catch (err) {
            res.redirect('/500')
        }
    },
    async handleDeleteUser(req, res) {
        try {
            const idUser = req.body.id;
            // Gỡ tất cả các bài đăng do user đăng tải.
            await News.destroy({
                where: {
                    nguoidung_id: idUser
                }
            })
            // Xóa user khỏi hệ thống
            await User.destroy({
                where: {
                    id: idUser
                }
            })

            // Xử lý phân trang
            let p = +req.query.p,
                fposc = +req.query.fposc,
                lposc = +req.query.lposc,
                totalPerOnPage = +req.body.totalUserOnPage;
            if (totalPerOnPage - 1 < 1 && p !== 0) {
                p = p - 1;
            }

            return res.status(200).json({
                message: "Xóa người dùng thành công!",
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
module.exports = UserController