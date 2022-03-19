function clear() {
    $("#msg").html("");
}

function showErr(err) {
    if (err.status) {
        $("#msg").append(
            '<span style="color: red;">' +
            err.message +
            '</span><br><span style="color: red;"> <a class="" href="verify-account">Click here to verify your account</a></span>'
        );
    } else {
        $("#msg").append('<span style="color: red;">' + err.message + "</span>");
    }
}

function successMsg(msg) {
    $("#msg").append('<span style="color: green;">' + msg.message + "</span>");
}

function validate() {
    var data = {};
    data.token = token;
    data.password = $("#password").val();
    data.c_password = $("#c_password").val();
    if (data.password !== data.c_password) {
        var msg = {
            message: "Password does not match"
        }
        showErr(msg);
        return false;
    }
    return data;
}

function showPassword() {
    var x = document.getElementById("password");
    var c = document.getElementById("c_password");
    if (x.type === "password") {
        x.type = "text";
        c.type = "text";
    } else {
        x.type = "password";
        c.type = "password";
    }
}

function resetPassword() {
    clear();
    var data = validate();
    if (data) {
        api.auth.resetPassword(
            data,
            function (res) {
                successMsg(res);
                window.location = "/login";
            },
            function (error) {
                showErr(error);
            }
        );
    }
}