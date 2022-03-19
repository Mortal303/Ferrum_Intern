var token;
function successMsg(msg) {
    $("#msg").append('<span style="color: green;">' + msg.message + "</span>");
}

async function showErr(err) {
    $("#msg").append('<span style="color: red;">' + err.message + "</span>");
}

function clear() {
    $("#msg").html("");
}

function resultListData(res){
    $('#registeredProducts').append(
        '<tr><td>' + res.sno + ' </td><td>' + res.productName + '</td> <td> ' + res.barcodeResult + '</td><td><a href="/api/domain/report-download/' + res.token + '">Download Invoice</a></td></tr>'
    );
}


function validate() {
    var formData = new FormData();
    var fileBulk = $("input[name=fileBulk]").prop("files")[0];
    formData.append("bulkFile", fileBulk);
    var file = $("#file")[0].files[0];
    if (file == undefined) {
        showErr({
            message: "Choose File"
        });
    } else {
        var file_name = file.name;
        var ext = file_name.split(".").pop().toUpperCase();
        if (
            ext == "CSV"
        ) {} else {
            showErr({
                message: "Choose only CSV File"
            });
        }
    }
    return formData;
}

function validateData() {
    var sno = $('#sn').val();
    var date = $('#date').val();
    var productname = $('#productname').val();
    var data = {
        sno: sno,
        date: date,
        productname: productname,
        barcodeResults: barcodeResults,
        token:token
    };
    return data;
}

function uploadFile() {
    clear();
    var data = validate();
    api.product.upload(
        data,
        function (res) {
            res = JSON.parse(res);
            token = res.token;
            successMsg(res);
        },
        function (error) {
            var err = JSON.parse(JSON.stringify(error));
            showErr(err);
        }
    );
}

function registerProduct() {
    clear();
    var data = validateData();
    api.product.registerProduct(
        data,
        function (res) {
            res = JSON.parse(JSON.stringify(res));
            successMsg(res);
            // location.reload();
        },
        function (error) {
            var err = JSON.parse(JSON.stringify(error));
            showErr(err);
        }
    );
}

function reportList() {
    clear();
    api.product.productList(
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