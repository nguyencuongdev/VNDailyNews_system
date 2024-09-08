const Tag = require('./Tag')
const News = require('./News');
const NewsTag = require('./NewsTag');
const Category = require('./Category');
const Permission = require('./Permission');
const Role = require('./Role');
const User = require('./User');

// định nghĩa tất cả các liên kết của model Role
const defineAssociatesRoleModel = () => {
    // Model Role
    Role.belongsTo(Permission, {
        foreignKey: 'quyen_id',
        as: 'permission'
    });
}

// định nghĩa tất cả các liên kết của model User;
const defineAssociatesUserModel = () => {
    // Model User
    User.belongsTo(Role, {
        foreignKey: 'vaitro_id',
        as: 'role'
    });
    User.hasMany(News, {
        foreignKey: 'nguoidung_id',
        as: 'news'
    });
}

// định nghĩa tất cả các liên kết của model Category;
const defineAssociatesCategoryModel = () => {
    // modal Category
    Category.hasMany(Tag, {
        foreignKey: 'danhmuc_id',
        as: 'tags'
    })
}

// định nghĩa tất cả các liên kết của model Tag;
const defineAssociatesTagModel = () => {
    // Model Tag
    Tag.belongsTo(Category, {
        foreignKey: 'danhmuc_id',
        as: 'category'
    });

    Tag.belongsToMany(News, {
        through: NewsTag,
        foreignKey: 'theloai_id',
        otherKey: 'baidang_id',
        as: 'news'
    });
}

// định nghĩa tất cả các liên kết của model News;
const defineAssociatesNewsModel = () => {
    // Model News
    News.belongsTo(User, {
        foreignKey: 'nguoidung_id',
        as: "user"
    });

    News.hasMany(NewsTag, {
        foreignKey: 'baidang_id',
        as: 'newstags'
    })

    News.belongsToMany(Tag, {
        through: NewsTag,
        foreignKey: 'baidang_id',
        otherKey: 'theloai_id',
        as: 'tags'
    });
}
// định nghĩa tất cả các liên kết của model NewsTag;
const defineAssociatesNewsTagModel = () => {
    // Modal NewsTag
    NewsTag.belongsTo(Category, {
        through: Tag,
        foreignKey: 'theloai_id',
        as: 'category'
    })
    NewsTag.belongsTo(Tag, {
        foreignKey: 'theloai_id',
        as: 'tag'
    })
    NewsTag.belongsTo(News, {
        foreignKey: 'baidang_id',
        as: 'news'
    })
}

const defineAssociateModels = () => {
    defineAssociatesRoleModel();
    defineAssociatesUserModel();
    defineAssociatesCategoryModel()
    defineAssociatesTagModel();
    defineAssociatesNewsModel();
    defineAssociatesNewsTagModel();
}

module.exports = {
    defineAssociateModels
}