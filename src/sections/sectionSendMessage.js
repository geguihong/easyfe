//route:sendMessage
var SectionSendMessage = Vue.extend({
    data: function() {
        return {
            type: '1',
            content: '默认消息',
            submitLock: false,
        }
    },
    template: "<ol class=\"breadcrumb\"><li>消息中心</li><li>发送消息</li></ol>\n                <div>\n                    <form onSubmit=\"return false;\">\n                        <div class=\"form-group\">\n                            <label>发送内容</label><textarea class=\"form-control\" rows=\"3\" v-model=\"content\"></textarea>\n                        </div>\n                        <div class=\"form-group\">\n                            <label>发送对象</label><br />\n                            <label class=\"radio-inline\"><input v-model=\"type\" type=\"radio\" value=\"1\" />家教</label>\n                            <label class=\"radio-inline\"><input v-model=\"type\" type=\"radio\" value=\"2\" />家长</label>\n                            <label class=\"radio-inline\"><input v-model=\"type\" type=\"radio\" value=\"3\" />全部</label>\n                        </div>\n                        <safe-lock text=\"解锁发送按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">提交消息</button></safe-lock>\n                    </form>\n                </div>",
    methods: {
        submit: function () {
            if (this.submitLock) {
                return;
            }

            function trim(str){
　　          return str.replace(/(^\s*)|(\s*$)/g, "");
　　        }

            tmp={};
            tmp.content = trim(this.content);
            tmp.type = this.type;
            tmp.token = Store.token;

            if (tmp.content.length === 0) {
                alert('内容不能为空');
                return;
            }

            this.submitLock = true;
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+'/Message',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('消息发送成功');
                }else{
                    alert('消息发送失败');
                }
                self.submitLock = false;
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
               self.submitLock = false;
            });
        }
    },
})