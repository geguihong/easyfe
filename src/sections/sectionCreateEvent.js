//route:CreateEvent
var SectionCreateEvent = Vue.extend({
    data: function() {
        return {
            token: Store.token,
            title: '',
            detail: '',
            score: '',
            money: '',
            isPublish: '0',
            allowCount: '',
            submitLock: false,
        }
    },
    template: '<ol class=\"breadcrumb\"><li>会员活动</li><li>会员活动发布</li></ol>'+
                   '<div>'+
                        '<form onSubmit=\"return false;\">'+
                            '<div class=\"form-group\">'+                         
                                '<label>活动标题</label><input class=\"form-control\" type="text" v-model=\"title\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+                         
                                '<label>活动说明</label><textarea class=\"form-control\" rows=\"3\" v-model=\"detail\"></textarea>'+
                            '</div>'+
                            '<div class=\"form-group\">'+                         
                                '<label>积分预订</label><input class=\"form-control\" type="text" v-model=\"score\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+                         
                                '<label>现金预订</label><input class=\"form-control\" type="text" v-model=\"money\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+                       
                                '<label>活动人数上限</label><input class=\"form-control\" type="text" v-model=\"allowCount\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+
                                '<label>是否接受预订</label><br /><label class=\"radio-inline\"><input v-model=\"isPublish\" type=\"radio\" value=\"1\" />是</label><label class=\"radio-inline\"><input v-model=\"isPublish\" type=\"radio\" value=\"0\" />否</label>'+
                            '</div>'+
                            '<safe-lock text=\"解锁发布按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">发布活动</button></safe-lock>'+
                        '</form>'+
                    '</div>',
    methods: {
        submit: function () {
            if (this.submitLock) {
                return;
            }

            function trim(str){
　　          return str.replace(/(^\s*)|(\s*$)/g, "");
　　        }

            tmp={};
            // 标题
            tmp.title = trim(this.title);
            if (tmp.title.length === 0) {
                alert('标题不能为空');
                return;
            }

            // 说明
            tmp.detail = trim(this.detail);
            if (tmp.detail.length === 0) {
                alert('说明不能为空');
                return;
            }

            function isInteger(obj) {
                return !isNaN(obj) && obj%1 === 0;
            }

            tmp.score = trim(this.score);
            if (tmp.score.length===0||!isInteger(this.score)) {
                alert('积分只能为整数');
                return;
            }

            if (trim(this.money).length===0||isNaN(this.money)) {
                alert('金额格式错误');
                return;
            }
            tmp.money = parseInt(this.money * 100);

            tmp.allowCount = trim(this.allowCount);
            if (tmp.allowCount.length===0||!isInteger(tmp.allowCount)) {
                alert('人数上限只能为整数');
                return;
            }

            // 是否接受预订
            tmp.isPublish = this.isPublish;

            tmp.token = Store.token;
            this.submitLock = true;
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+'/VipEvent',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('活动发布成功');
                }else{
                    alert('活动发布失败');
                }
                self.submitLock = false;
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
               self.submitLock = false;
            });
        }
    },
})