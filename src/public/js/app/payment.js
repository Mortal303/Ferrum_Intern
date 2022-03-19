function addOption(res) {
    var select = $("#payment_product");
    var options = res.data;
    for (var i = 0; i < options.length; i++) {
        var opt = options[i].productName;
        select.append($('<option>').text(opt).attr('value', opt));
    }
}

function validate() {
    var data = {};
    data.productName = $('#payment_product').val();
    data.name = $('#typeText').val();
    data.address = $('#typeName').val();
    data.date_time = $('#typeExp').val();
    return data;
}

async function initiatePayment(res) {
    $('#rzp-button1').show();
    console.log(res);
    var options = {
        "key": res.key_id, // Enter the Key ID generated from the Dashboard
        "amount": res.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": res.currency,
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": res.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "callback_url": "http://localhost:3000/success",
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    document.getElementById('rzp-button1').onclick = function (e) {
        rzp1.open();
        e.preventDefault();
    }
}

function selectProduct() {
    var data = validate();
    api.product.selectProduct(
        data,
        function (res) {
            initiatePayment(res.data);
        },
        function (err) {
            console.log(err);
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
    $('#mainPayment').hide();
    $('#rzp-button1').hide();
    $("#payment_product").removeClass('bootstrap-select');
    productList();
});