const { alias } = require("react-app-rewire-alias");

module.exports = function override(config) {
  alias({
    "@components": "src/components",
    "@assets": "src/assets",
    "@config": "src/config",
    "@utils": "src/utils",
    "@pages": "src/pages",
    "@services": "src/services",
    // thêm các alias khác nếu cần
  })(config);

  return config;
};
