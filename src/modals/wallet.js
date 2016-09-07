var Wallet = Vue.extend({
    props: ['obj'],
    data: function() {
        this.patch = {};

        var tmp = {
            form: [
                {name:'支付宝账户',patch_key:'ali',from:'ali',default:this.obj.ali},
                {name:'微信支付账户',patch_key:'wechat',from:'wechat',default:this.obj.wechat},
                {name:'银行',patch_key:'bankName',from:'bank.name',default:this.obj.bank.name},
                {name:'银行卡号',patch_key:'bankAccount',from:'bank.account',default:this.obj.bank.account},
                ],
            models: [],
            submitLock: false
        }

        for(var i=0;i!=tmp.form.length;i++){
            tmp.models.push(tmp.form[i].default);
        }

        return tmp;
    },
    methods: {
        exit: function() {
            Store.closeModal();
        },
        submit() {
            if (!confirm('确定修改?')) {
                return;
            }

            var tmp={};
            var data={};
            var patch_add = {};
            var modified = false;

            for(var i=0;i!=this.form.length;i++){
                if(this.form[i].default !== this.models[i]) {
                    data = Store.setter(data,this.form[i].from,this.models[i]);
                    modified = true;
                    patch_add[this.form[i].patch_key]=this.models[i];
                }
            }
            
            tmp.token = Store.token;
            tmp.data = data;
            
            if (!modified) {
                return;
            }
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+'/user/payway',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('修改成功');
                    $.extend(self.patch,patch_add);
                    
                    // 重置默认值
                    for (var i=0;i!==self.form.length;i++) {
                        self.form[i].default = self.models[i];
                    }
                }else{
                    alert('修改失败');
                }
                self.submitLock = false;
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
               self.submitLock = false;
            });
        },
    },
    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>修改钱包信息</li></ol>'+
                            "<form onSubmit=\"return false;\">\n"+
                                "<div class=\"form-group\" v-for=\"(key1,item) in form\">\n"+
                                    "<label>{{item.name}}</label><span :class=\"{hidden:(models[key1]===item.default)}\">*</span>\n"+
                                    "<template>\n"+
                                        "<br><input class=\"form-control\" type=\"text\" v-model=\"models[key1]\"/>\n"+
                                    "</template>\n"+
                                "</div>\n"+                   
                                "<safe-lock text=\"解锁修改按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">修改</button>\n"+
                                "<span>（只改动带*号的数据）</span></safe-lock>\n"+
                            "</form>"+
                        '</div>'+
                    '</div>'+
                '</div>'
})

Vue.component('wallet',Wallet);