var UpdateVipEvent = Vue.extend({
    props: ['obj'],
    methods: {
        exit: function() {
            Store.modal.closeFn(this.patch);
            Store.closeModal();
        },
        submit: function() {
            var tmp={};
            var data={};
            var patch_add = {};
            var modified = false;

            for(var i=0;i!=this.form.length;i++){
                if(this.form[i].filter === 'uid') {
                    data = Store.setter(data,this.form[i].from,this.models[i]);
                    continue;
                }

                if(this.form[i].default !== this.models[i]) {
                    // 对金额进行预处理
                    var tval;
                    if (this.form[i].filter === 'money') {
                        if (isNaN(this.models[i])) {
                            return;
                        } else {
                            tval = parseInt(this.models[i]*100);
                        }
                    } else {
                        tval = this.models[i];
                    }

                    data = Store.setter(data,this.form[i].from,tval);
                    modified = true;
                    patch_add[this.form[i].patch_key]=tval;
                }
            }
            
            tmp.token = Store.token;
            tmp.data = data;
            
            if (!modified) {
                return;
            }
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+'/VipEvent/Update',
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
        }
    },
    data: function() {
        this.patch = {};

        var tmp = {
            form: [
                {name:'活动ID',from:'vipEventId',default:this.obj._id,filter:'uid'},
                {name:'活动标题',patch_key:'title',from:'title',default:this.obj.title},
                {name:'活动说明',patch_key:'detail',from:'detail',default:this.obj.detail},
                {name:'积分预订',patch_key:'score',from:'score',default:this.obj.score.toString()},
                {name:'现金预订',patch_key:'money',from:'money',default:(this.obj.money/100).toFixed(2),filter:'money'},
                {name:'最大人数',patch_key:'allowCount',from:'allowCount',default:this.obj.allowCount.toString()},
                {name:'是否接受预订',patch_key:'isPublish',from:'isPublish',default:this.obj.isPublish,filter:'bool'},
                ],
            models: [],
            submitLock: false
        }

        for(var i=0;i!=tmp.form.length;i++){
            tmp.models.push(tmp.form[i].default);
        }

        return tmp;
    },

    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>修改会员活动</li></ol>'+
                            "<form onSubmit=\"return false;\">\n"+
                                "<div class=\"form-group\" v-for=\"(key1,item) in form\">\n"+
                                    "<label>{{item.name}}</label><span v-if=\"item.filter!=='array'\" :class=\"{hidden:(models[key1]===item.default)}\">*</span>\n"+
                                    "<template v-if=\"item.filter==='uid'\">\n"+
                                        "<p>{{models[key1]}}</p>\n"+
                                    "</template>\n"+
                                    "<template v-if=\"item.filter==='bool'\">\n"+
                                        "<br><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"true\" />是</label><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"false\" />否</label>"+
                                    "</template>\n"+
                                    "<template v-if=\"item.filter===undefined||item.filter==='money'\">\n"+
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
Vue.component('update-vip-event',UpdateVipEvent);
