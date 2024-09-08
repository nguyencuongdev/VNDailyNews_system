
const setPagination = (req) => {
    let currentPage = +req.query.p || 0,
        firstPageOfScope = +req.query.fposc || 0,
        lastPageOfScope = +req.query.lposc || 3;

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
    // TH trang hiện tại là trang cuối cùng
    else if ((currentPage > lastPageOfScope) && (currentPage === totalPage - 1)) {
        lastPageOfScope = totalPage - 1;
        firstPageOfScope = totalPage - 4;
    }

    return {
        currentPage,
        firstPageOfScope,
        lastPageOfScope,
    };
}

const initPagination = (req) => {
    // Khởi tạo giá trị phân trang;
    let currentPage = +req.query.p || 0,
        firstPageOfScope = +req.query.fposc || 0,
        lastPageOfScope = +req.query.lposc || 3;

    return {
        currentPage,
        firstPageOfScope,
        lastPageOfScope,
    }
}

module.exports = {
    setPagination,
    initPagination
}