const express = require('express');
const { createServer } = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const { database } = require('./utils');
const helmet = require('helmet');
dotenv.config();

const app = express();
const server = createServer(app);

// sử dụng helmet để che dấu các công nghệ sử dụng.
app.use(helmet({
    contentSecurityPolicy: false
}));

// Thiết lập cors
app.use(cors());

// Sử dụng middleware methodOverride để ghi đè http method từ client mà url có query string là _method="PUT|DELETE"
app.use(methodOverride('_method'));

// Sử dụng morgan để ghi log vào folder /logs
// Tạo một stream ghi file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.txt'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(__dirname, 'logs/errors.txt'), { flags: 'a' });
app.use(morgan('dev', {
    skip: function (_, res) { return res.statusCode < 400 },
    stream: accessLogStream
}));
app.use(morgan('dev', {
    skip: function (_, res) { return res.statusCode >= 400 },
    stream: errorLogStream
}));

// Thiết lập app nhận cookie, json, urlencode form gửi lên từ client->server;
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

//Thiết lập template view của app là pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

//Thiết lập folder static của app;
app.use('/static', express.static(path.join(__dirname, './assets')));

//Thiết lập liên kết đến thư mục jquery, popper
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist/')));
app.use('/popperjs', express.static(path.join(__dirname, '../node_modules/popper.js/dist/umd/')));

//Thiết lập liên kết đến thư mục style,js của boostrap
app.use('/bootstrap/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css/')));
app.use('/bootstrap/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js/')));

//Thiết lập liên kết đến thư mục style,js của froala editor
app.use('/froala-editor/css', express.static(path.join(__dirname, '../node_modules/froala-editor/css/')));
app.use('/froala-editor/js', express.static(path.join(__dirname, '../node_modules/froala-editor/js/')));

//Thiết lập liên kết đến thư mục style,js của photoswipe
app.use('/photoswipe/css', express.static(path.join(__dirname, '../node_modules/photoswipe/src/')));
app.use('/photoswipe/js', express.static(path.join(__dirname, '../node_modules/photoswipe/src/js')));

// Thiết lập routes của app;
const Router = require('./routers/router');
const Router_Api = require('./routers/api/router_api');
app.use('/api/v1', Router_Api);
app.use(Router);

const associate = require('./models/associate');
// Kiểm tra kết nối đến CSDL server;
const testConnectionDB = async () => {
    try {
        await database.authenticate();
        console.log('Connection to database server is successful');
        associate.defineAssociateModels();
        database.sync();
    } catch (error) {
        console.error('Error from the database:', error);
    }
}
testConnectionDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, _ => console.log(`server listening on: http://localhost:${PORT}`));