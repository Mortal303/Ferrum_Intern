function addOption(res) {
    var select = $("#select_product");
    var options = res.data;
    for (var i = 0; i < options.length; i++) {
        var opt = options[i].productName;
        select.append($('<option>').text(opt).attr('value', opt));
    }
}
function successMsg(msg) {
    $("#msg").append('<span style="color: green;">' + msg.message + "</span>");
}

async function showErr(err) {
    $("#msg").append('<span style="color: red;">' + err.message + "</span>");
}

function clear() {
    $("#msg").html("");
}

function validate() {
    var productName = $('#productName').val();
    var serviceType = $('#serviceType').val();
    var date = $('#date').val();
    var time = $('#time').val();
    var address = $('#address').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var info = $('#info').val();
    if(!info){
        info = '';
    }
    var data = {
        productName:productName,
        serviceType:serviceType,
        date:date,
        time:time,
        address:address,
        email:email,
        phone:phone,
        info:info,
    }
    return data;
}

function registerService() {
    clear();
    var data = validate();
    api.product.registerService(
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

function productList() {
    api.product.list(
        function (res) {
            // console.log(res);
            addOption(res);
        },
        function (err) {
            console.log(err);
        }
    );
}

$(document).ready(function () {
    productList();
});