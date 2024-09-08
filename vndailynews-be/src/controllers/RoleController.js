const { Op } = require('sequelize');
const { Role, Permission } = require('../models');
const { setPagination, initPagination } = require('../utils');

const RoleController = {
    async showRoleList(req, res) {
        try {
            // Khởi tạo giá trị phân trang;
            let pagination = initPagination(req);

            let totalPerOnPage = +req.query.limit || 10;
            let roleLength = 0;
            let totalPage = Math.ceil(roleLength / totalPerOnPage);
            let roles = [];

            const user = req.user;
            const includeModelsQuery = [
                {
                    model: Permission,
                    as: 'permission'
                }
            ]
            const defaultOptionsQuery = {
                offset: pagination.currentPage * totalPerOnPage,
                limit: totalPerOnPage,
                attribues: ['id', 'name'],
                include: includeModelsQuery
            }

            //TH người dùng tìm kiếm thì ta sẽ truy vấn các role khớp với giá trị tìm kiếm
            if (req.query.q) {
                const wheresFilter = {
                    [Op.or]: [
                        {
                            ten: {
                                [Op.like]: `${req.query.q}%`
                            }
                        },
                        {
                            '$permission.ten$': {
                                [Op.like]: `${req.query.q}%`
                            }
                        }
                    ]
                }
                roleLength = await Role.count({
                    include: includeModelsQuery,
                    where: wheresFilter
                });
                totalPage = Math.ceil(roleLength / totalPerOnPage);
                roles = await Role.findAll({
                    ...defaultOptionsQuery,
                    where: wheresFilter
                });

            } else {
                // TH người dùng không tìm kiếm hoặc giá trị tìm kiếm rỗng ta lấy ra tất cả vai trò có trong hệ thống;
                roleLength = await Role.count();
                totalPage = Math.ceil(roleLength / totalPerOnPage);
                roles = await Role.findAll({
                    ...defaultOptionsQuery
                });
            }

            // Xử lý change component phân trang
            pagination = setPagination(req);
            return res.render('roles/index.pug', {
                user,
                path: '/roles',
                p: pagination.currentPage,
                fposc: pagination.firstPageOfScope,
                lposc: pagination.lastPageOfScope,
                totalPage,
                totalPerOnPage,
                roles,
                q: req.query.q
            })
        }
        catch (err) {
            res.redirect('/500');
        }
    },
    async showCreateNewRole(req, res) {
        const permissionList = await Permission.findAll();
        const user = req.user;
        res.render('roles/create.pug', {
            user,
            name: '',
            permissionID: -1,
            note: '',
            path: '/roles/create',
            p: 0,
            fposc: 0,
            lposc: 3,
            permissions: permissionList,
        })
    },
    async handleCreateNewRole(req, res) {
        try {
            const permissionList = req.permissionList;
            const role = await Role.create({
                ten: req.body.name,
                quyen_id: req.body.permissionID,
                ghichu: req.body.note
            });
            role.save();
            return res.status(200).render('roles/create.pug', {
                user: req.user,
                name: '',
                note: '',
                permissionID: -1,
                permissions: permissionList,
                path: '/roles/create',
                status: true,
                msg: 'Thêm mới vai trò thành công!',
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
    async showEditRole(req, res) {
        try {
            const user = req.user;
            // Lấy ra thông tin của role cần edit
            const role = await Role.findOne({
                include: [
                    {
                        model: Permission,
                        as: 'permission'
                    }
                ],
                where: {
                    id: req.params.id
                }
            })
            const permissionList = req.permissionList;
            res.render('roles/edit.pug', {
                user,
                path: '/roles',
                id: role.id,
                name: role.ten,
                note: role.ghichu,
                permissionID: role.permission.id,
                permissions: permissionList,
                p: req.query.p,
                fposc: req.query.fposc,
                lposc: req.query.lposc
            })
        } catch (e) {
            res.redirect('/500');
        }
    },
    async handleEditRole(req, res) {
        const permissionList = req.permissionList;
        await Role.update({
            ten: req.body.name,
            quyen_id: req.body.permissionID,
            ghichu: req.body.note
        }, {
            where: {
                id: req.params.id
            }
        });
        return res.status(200).render('roles/edit.pug', {
            user: req.user,
            path: '/roles/edit',
            p: req.query.p,
            fposc: req.query.fposc,
            lposc: req.query.lposc,
            id: +req.params.id,
            name: req.body.name,
            note: req.body.note,
            permissionID: +req.body.permissionID,
            status: true,
            permissions: permissionList,
            msg: 'Cập nhật vai trò thành công!'
        })
    },
}
module.exports = RoleController;