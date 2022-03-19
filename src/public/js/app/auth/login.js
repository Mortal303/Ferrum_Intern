function clear() {
    $("#msg").html("");
}

function showErr(err) {
    // console.log(err.message);
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
    if (msg.message != undefined) {
        $("#msg").append('<span style="color: green;">' + msg.message + "</span>");
    }
}


function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function validate() {
    var data = {};
    data.email = $("#email").val();
    data.password = $("#password").val();
    // console.log(data);
    return data;
}


function login() {
    clear();
    var data = validate();
    console.log(data);
    api.auth.login(
        data,
        function (res) {
            clear();
            successMsg(res);
            window.location = "/";
        },
        function (error) {
            clear();
            showErr(error);
        }
    );
}