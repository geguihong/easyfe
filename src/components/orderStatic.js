//Bookmark:orderStatic
var orderStatic = Vue.extend({
    data: function() {
        return {
            teacher_id: '',
            parent_id: '',
            result: {
                count: '',
                totalTime: '',
            },
        }
    },
    methods: {
        query: function() {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/TeachRecord?teacherId='+this.teacher_id+'&parentId='+this.parent_id+'&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    self.result.count = data.data.count;
                    self.result.totalTime = data.data.totalTime + ' 分钟';
                }else{
                    alert('获取数据失败');
                }
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: "<form onSubmit=\"return false;\">\n"+
    "<div>"+
    "<label style=\"margin-right:20px;\">家长ID</label>"+
    "<input v-model=\"parent_id\" type=\"text\" />"+
    "<label style=\"margin-left:20px;margin-right:20px;\">家教ID</label>"+
    "<input v-model=\"teacher_id\" type=\"text\" />"+
    "<button style=\"margin-left:20px;\" class=\"btn btn-default\" v-on:click=\"query\">提交查询</button>\n"+
    "</div>"+
    "</form>\n"+
    "<p><strong>查询结果</strong></p>"+
    "<p>订单数：{{result.count}}</p>"+
    "<p>订单总时长：{{result.totalTime}}</p>"+
    "<div style=\"height:50px;border-top:2px dotted black;\" ></div>"
})

Vue.component('order-static', orderStatic);