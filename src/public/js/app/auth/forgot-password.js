console.log("Hello");
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
    data.email = $("#email").val();
    return data;
  }
  
  
  function forgotPassword() {
    clear();
    var data = validate();
      api.auth.forgotPassword(
        data,
        function (res) {
          successMsg(res);
        },
        function (error) {
          showErr(error);
        }
      );
  }
  