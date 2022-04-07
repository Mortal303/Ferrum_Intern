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
    var data = {};
    data.city = $('#validationDefault04').val();
    data.state = $('#validationDefault05').val();
    data.pin = $('#validationDefault06').val();
    return data;
}

function editDetails() {
    clear();
	var data = validate();
	api.auth.editDetails({
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
	})
}   