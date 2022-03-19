function clear() {
    $("#msg").html("");
}

function showErr(err) {
    $("#msg").append('<span style="color: red;">' + err.message + "</span>");
}

function successMsg(msg) {
    $("#msg").append('<span style="color: green;">' + msg.message + "</span>");
}

function validate() {
    var data = {};
    data.email = $("#email").val();
    return data;
}


function resendLinkEmailVerify() {
    clear();
    var data = validate();
    // console.log(data);
    api.auth.resendLinkEmailVerify(
        data,
        function (res) {
            successMsg(res);
        },
        function (error) {
            showErr(error);
        }
    );

}