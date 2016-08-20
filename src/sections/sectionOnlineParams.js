//route:onlineParams
var SectionOnlineParams = Vue.extend({
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
                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
        
        return {
            form: [
                {name:'标题',from:'specialText.line1'},
                {name:'副标题',from:'specialText.line2'},
                {name:'正文',from:'specialText.line3'},
                {name:'底部文字',from:'specialText.bottomText'},
                {name:'侧边栏底部文字',from:'sidebarBottomText',filter:'textarea'}
                ],
            loaded: false,
        }
    },
    template: '<ol class="breadcrumb"><li>在线参数</li><li>修改在线参数</li></ol>'+
                '<div><dirty-form v-if="loaded" :form="form" api="/OnlineParams"></dirty-form></div>',
})