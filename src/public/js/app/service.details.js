function successMsg(msg) {
    $("#msg").append('<span style="color: green;">' + msg.message + "</span>");
}

async function showErr(err) {
    $("#msg").append('<span style="color: red;">' + err.message + "</span>");
}

function clear() {
    $("#msg").html("");
}

var count = 0;

function resultListData(res){
    count++;
    $('#registeredServices tbody').append(
        '<tr><td>' + count + ' </td><td>' + res.productName + '</td> <td> ' + res.serviceType + '</td><td>' + res.date + '</td><td>' + res.time + '</td><td>' + res.status + '</td><td style="width:200px; max-widh:200px;">' + res.info + '</td></tr>'
    );
}

function reportList() {
    clear();
    api.product.serviceList(
        function (res) {
            // contentLength = res.result.length;
            for (let index = 0; index < res.result.length; index++) {
                const data = res.result[index];
                // console.log(data);
                resultListData(data);
            }
            // if (res) {
            //     setPagination();
            // }
            // window.location = "/login";
        },
        function (error) {
            err = JSON.parse(error);
            showErr(error);
        }
    );
}

$(document).ready(function () {
    reportList();
});
