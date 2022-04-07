function query(e, t, n, r, success, error, showError) {
  showError = typeof showError !== "undefined" ? showError : true;
  var params = {};
  if (t == "GET" && n != undefined) {
    params = $.extend({}, params, n);
    n = undefined;
  }
  return $.ajax({
    url: "/api" + e + "?" + jQuery.param(params),
    async: r,
    method: t,
    data: n != undefined ? JSON.stringify(n) : "",
    dataType: "json",
    contentType: "application/json",
    success: function (msg) {
      success(msg);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (error != undefined) error(jqXHR.responseJSON);
    },
  });
}

function mediaQuery(e, t, n, r, success, error) {
  if (typeof mprogress != "undefined") {
    mprogress.start();
  }
  return $.ajax({
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener(
        "progress",
        function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            $(".ajax-file-loading").css({
              width: percentComplete * 100 + "%",
            });
            if (percentComplete === 1) {
              $(".ajax-file-loading").addClass("hide");
            }
          }
        },
        false
      );
      return xhr;
    },
    url: "/api" + e,
    async: r,
    method: t,
    data: n != undefined ? n : "",
    mimeType: "multipart/form-data",
    processData: false,
    contentType: false,
    success: function (msg) {
      if (typeof mprogress != "undefined") {
        mprogress.end(true);
      }
      success(msg);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (typeof mprogress != "undefined") {
        mprogress.end(true);
      }
      if (error != undefined) error(jqXHR.responseJSON);
    },
  });
}

var api = {
  auth: {
    register: function (data, success, error) {
      return query("/register/", "POST", data, 1, success, error);
    },
    login: function (data, success, error) {
      return query("/login/", "POST", data, 1, success, error);
    },
    forgot: function (data, success, error) {
      return query("/forgot/", "POST", data, 1, success, error);
    },
    verifyAccount: function (token, success, error) {
      return query("/verify-email/" + token, "GET", null, 1, success, error);
    },
    resendLinkEmailVerify: function (data, success, error) {
      return query("/account-verify/", "POST", data, 1, success, error);
    },
    forgotPassword: function (data, success, error) {
      return query("/forgot-password/", "POST", data, 1, success, error);
    },
    resetPassword: function (data, success, error) {
      return query("/reset-password/", "POST", data, 1, success, error);
    },
    editDetails: function (data, success, error) {
      return query("/editDetails/", "POST", data, 1, success, error);
    },
  },
  product: {
    list: function (success, error) {
      return query("/domain/product/list", "GET", null, 1, success, error);
    },
    selectProduct: function (data, success, error) {
      return query("/domain/product/selectProduct", "POST", data, 1, success, error);
    },
    submitDetail: function (data, success, error) {
      return query("/domain/product/submitDetail", "POST", data, 1, success, error);
    },
    upload: function (data, success, error) {
      return mediaQuery("/domain/upload-file", "POST", data, 1, success, error);
    },
    registerProduct: function (data, success, error) {
      return query("/domain/product/registerProduct", "POST", data, 1, success, error);
    },
    productList:  function (success, error) {
      return query("/domain/product/productList", "GET", null, 1, success, error);
    },
    registerService: function (data, success, error) {
      return query("/domain/product/registerService", "POST", data, 1, success, error);
    },
    serviceList:function (success, error) {
      return query("/domain/product/serviceList", "GET", null, 1, success, error);
    },
  },
}