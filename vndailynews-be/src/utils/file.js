const { File } = require('@web-std/file');


const getExtentionFile = (fileName) => {
    return fileName.split('.')[1];
}

const getFile = async (src, nameFile = "vndailynews", extentionFile = ".jpg") => {
    const response = await fetch(src);
    const fileBlob = await response.blob();
    const file = new File([fileBlob], nameFile + extentionFile);
    return file;
};

const getSrcImage = (location) => {
    const paths = location.split('/');
    return paths[paths.length - 1];
}

module.exports = {
    getFile,
    getExtentionFile,
    getSrcImage
}