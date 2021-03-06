window.rootUrl="/Web";

document.getElementById('show-button').addEventListener('click',function(){
    document.getElementById('toggle-panel').setAttribute('style',"display:block;");
});
document.getElementById('hide-button').addEventListener('click',function(){
    document.getElementById('toggle-panel').setAttribute('style',"display:none;");
});

//辅助函数
function getFormJson(form) {
    var o = {};
    var a = form.serializeArray();
    $.each(a, function () {
    if (o[this.name] !== undefined) {
    if (!o[this.name].push) {
    o[this.name] = [o[this.name]];
    }
    o[this.name].push(this.value || '');
    } else {
    o[this.name] = this.value || '';
    }
    });
    return o;
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

$('#invite-button').click(function(){
    var tmp = getFormJson($(this).parent());
    tmp.inviterId = GetRequest()['inviterId'];
    
    $.ajax({
        url: window.rootUrl+'/Invite',
        dataType: 'json',
        data:JSON.stringify(tmp),
        type:'POST',
        contentType: "application/json; charset=utf-8"
    }).done(function(data, status, jqXHR){
        if(data.result=='success'){
            if(tmp.type == 0){
                window.location.href = '/invite_parent_success.html'+'?phone='+tmp.phone;
            }else{
                window.location.href = '/invite_teacher_success.html';
            }
        }else{
            alert('邀请失败！');
        }
    }).fail(function(data, status, jqXHR){
        alert('请求失败！');
    });
});