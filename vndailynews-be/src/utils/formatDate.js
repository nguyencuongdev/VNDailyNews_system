const formatDate = (date) => {
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    return day + '-' + month + '-' + year
}

const formatDateTime = (dateObject) => {
    let date = dateObject.getDate();
    let month = dateObject.getMonth() + 1;
    let year = dateObject.getFullYear().toString();
    let hour = dateObject.getHours();
    let minute = dateObject.getMinutes();
    let second = dateObject.getSeconds();
    let dateFormated = "";

    dateFormated += date < 10 ? "0" + date + "/" : date + "/";
    dateFormated += month < 10 ? "0" + month + "/" : month + "/";
    dateFormated += year + " ";
    dateFormated += hour < 10 ? "0" + hour + ":" : hour + ":";
    dateFormated += minute < 10 ? "0" + minute + ":" : minute + ":";
    dateFormated += second < 10 ? "0" + second : second;

    return dateFormated;
};


module.exports = {
    formatDate,
    formatDateTime
}

