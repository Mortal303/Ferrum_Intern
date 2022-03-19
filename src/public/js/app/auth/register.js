function clear() {
    $("#msg").html("");
}

function clearMsg() {
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
    // clearErrors();
    var data = {};
    data.firstName = $("#firstName").val();
    data.lastName = $("#lastName").val();
    data.email = $("#email").val();
    data.mobile = $("#phone").val();
    data.password = $("#password").val();
    data.repeatPassword = $("#repeatPassword").val();
    if (data.repeatPassword != data.password) {
        var msg = {
            message: "Password does not match"
        }
        showErr(msg);
        return false;
    }
    return data;
}

function hideModal() {
    preloader.style.visibility = "hidden";
    $("#modalSpinner").removeClass("in");
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").css("padding-right", "");
    $("#modalSpinner").hide();

}

function showPassword() {
    var x = document.getElementById("password");
    var y = document.getElementById("repeatPassword");
    if (x.type === "password") {
        x.type = "text";
        y.type = "text"
    } else {
        x.type = "password";
        y.type = "password";
    }
}

function register() {
    clear();
    var data = validate();
    console.log(data);
    if (data) {
        api.auth.register(
            data,
            function (res) {
                successMsg(res);
                window.location = "/";
            },
            function (error) {
                console.log(error);
                showErr(error);
            }
        );
    } 
}