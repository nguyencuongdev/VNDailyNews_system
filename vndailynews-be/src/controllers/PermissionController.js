const { Permission } = require('../models');
const { Op } = require('sequelize');
const { initPagination, setPagination } = require('../utils');

const PermissionController = {
    async showPermissionList(req, res) {
        try {
            // Khởi tạo giá trị phân trang;
            let pagination = initPagination(req);
            let totalPerOnPage = req.params.l || 10; //l => limit
            let permissionLength = 0;
            let totalPage = Math.ceil(permissionLength / totalPerOnPage);
            let permissions = [];

            const user = req.user;
            const defaultOptionsQuery = {
                offset: pagination.currentPage * totalPerOnPage,
                limit: totalPerOnPage,
            }

            //TH người dùng tìm kiếm thì ta sẽ truy vấn các danh mục khớp với giá trị tìm kiếm
            if (req.query.q) {
                const wheres = {
                    ten: req.query.q
                }
                // Đếm số lượng danh sách quyền thỏa mãn giá trị search
                permissionLength = await Permission.count({
                    where: wheres
                });
                totalPage = Math.ceil(permissionLength / totalPerOnPage);
                permissions = await Permission.findAll({
                    ...defaultOptionsQuery,
                    where: wheres
                });
            } else {
                // TH người dùng không tìm kiếm hoặc giá trị tìm kiếm rỗng ta sẽ lấy ra tất cả các quyền trong hệ thống
                permissionLength = await Permission.count();
                totalPage = Math.ceil(permissionLength / totalPerOnPage);
                permissions = await Permission.findAll({
                    ...defaultOptionsQuery
                });
            }

            // Xử lý change component phân trang
            pagination = setPagination(req)

            res.render('permissions/index.pug', {
                user,
                path: '/permissions',
                p: pagination.currentPage,
                fposc: pagination.firstPageOfScope,
                lposc: pagination.lastPageOfScope,
                permissions,
                totalPage,
                totalPerOnPage,
                q: req.query.q
            })
        }
        catch (e) {
            res.redirect('/500');
        }
    },
    showCreateNewPermission(req, res) {
        const user = req.user;
        res.render('permissions/create.pug', {
            user,
            name: '',
            note: '',
            path: '/permissions/create',
            p: 0,
            fposc: 0,
            lposc: 3
        })
    },
    async handleCreatePermission(req, res) {
        try {
            const permission = await Permission.create({
                ten: req.body.name,
                ghichu: req.body.note
            });
            permission.save();
            return res.status(200).render('permissions/create.pug', {
                user: req.user,
                name: '',
                note: '',
                status: true,
                path: '/permissions/create',
                msg: 'Thêm mới quyền thành công',
                errors: [],
                p: 0,
                fposc: 0,
                lposc: 3
            })
        } catch (e) {
            res.redirect('/500');
        }
    },
    async showEditPermission(req, res) {
        try {
            const user = req.user;
            const permission = await Permission.findOne({
                attribute: ['id', 'name'],
                where: {
                    id: req.params.id
                }
            })

            return res.render('permissions/edit.pug', {
                user,
                path: '/permissions',
                p: req.query.p,
                id: req.params.id,
                name: permission.ten,
                note: permission.ghichu,
                fposc: req.query.fposc,
                lposc: req.query.lposc,
                permission
            })
        } catch (e) {
            res.redirect('/500');
        }
    },
    async handleEditPermission(req, res) {
        await Permission.update({ ten: req.body.name, ghichu: req.body.note }, {
            where: {
                id: req.params.id
            }
        });

        return res.status(200).render('permissions/edit.pug', {
            user: req.user,
            path: '/permissions',
            p: req.query.p,
            fposc: req.query.fposc,
            lposc: req.query.lposc,
            id: req.params.id,
            name: req.body.name,
            note: req.body.ghichu,
            status: true,
            msg: 'Cập nhật thông tin quyền thành công!'
        })
    },
}
module.exports = PermissionController