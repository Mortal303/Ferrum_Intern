var errors = [];
var successToasts = [];

function showAPIError(errorCode, msg){
    if(errorCode == 500 || errorCode == 401){
        if(msg.errors != undefined){
            clearErrors();
            var count = 0;
            msg.errors.forEach(function(err){
                addError(count++, err);
            });
            showErrors();
        }
    }else if(errorCode == 400){
        if(msg.isJoi){
            clearErrors();
            var count = 0;
            msg.details.forEach(function(detail){
                addError(count++, detail.message);
            });
            showErrors();
        }
    }
}

var showErrors = function(){
    for(var key in errors){
        $('#' + key).addClass('is-invalid');
        addErrorToList(errors[key]);
    }
    launchToast('error');
}

var addErrorToList = function(msg){
    $('#toast-error #errorList').append('<li>'+msg+'</li>');
}

function launchToast(type) {
    successToasts.push(type);
    if(!type || type == 'success'){
        type = '';
    }else if(type == 'error'){
        type = '-error';
    }
    $('#toast'+type).addClass('show');
    $('#toast'+type).show()
    $('html, body').animate({scrollTop:0},500);
    setTimeout(function(){ 
        $('#toast'+type).removeClass('show'); 
        clearErrors(type);
     }, 3000);
}

var clearErrors = function(key){
    if(key){
        successToasts.splice(successToasts.indexOf(key), 1);
        if(successToasts.length == 0)
            $('#showToast').html('');
    }
    $('#toast-error #desc #errorList').html('');
    for(var key in errors){
        $('#' + key).removeClass('is-invalid');
    }
    errors = [];
}

function showError(msg){
    clearErrors();
    if(msg != undefined){
        if(msg.message != undefined){
            addErrorToList(msg.message);
        }else{
            addErrorToList(msg);
        }
    }else{
        addErrorToList('Something went wrong!');                
    }
    launchToast('error');
}

var addError = function(key, msg){
    errors[key] = msg;
}