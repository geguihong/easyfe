//route:advertise
var SectionAdvertise = Vue.extend({
    data: function() {
        var self = this;
        $.ajax({
            url:Store.rootUrl+'/OnlineParams?token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                for(var i=0;i!=self.form.length;i++){
                    self.form[i].default = Store.getter(data.data,self.form[i].from);
                }
                self.qnToken = data.data.qnToken;
                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
        
        return {
            form: [
                {name:'广告预览图',from:'advertise.image',filter:'img'},
                {name:'副标题',from:'advertise.link'},
                ],
            loaded: false,
        }
    },
    template: '<ol class="breadcrumb"><li>在线参数</li><li>修改首页广告</li></ol>'+
                '<div><dirty-form v-if="loaded" :form="form" api="/OnlineParams" :qn-token="qnToken"></dirty-form></div>',
})
