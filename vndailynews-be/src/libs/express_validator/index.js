const commonSchemaValidate = require("./commonSchema.validator");
const tagSchemaValidator = require('./tagSchema.validator');
const categoryValidtor = require('./categorySchema.validator');
const userValidator = require('./user_management.validator');
const newsValidator = require('./newsSchema.validator');
const roleValidator = require('./roleSchema.validator');
const permissionValidator = require('./permissionSchema.validator');
const authSchemaValidator = require('./auhSchema.validator');

module.exports = {
    ...commonSchemaValidate,
    ...tagSchemaValidator,
    ...categoryValidtor,
    ...userValidator,
    ...newsValidator,
    ...roleValidator,
    ...permissionValidator,
    ...authSchemaValidator
}