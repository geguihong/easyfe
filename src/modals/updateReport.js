var UpdateReport = Vue.extend({
    props: ['obj'],
    methods: {
        exit: function() {
            Store.modal.closeFn(this.patch);
            Store.closeModal();
        },
        diff: function(val,header) {
            function equals(a,b) {
                if (a.length !== b.length) {
                    return false;
                } else {
                    for(var i=0,l=a.length;i<l;i++)
                        if(b[i]!==a[i]) 
                            return false;
                }
                return true;
            }

            if (header.filter === 'array') {
                return equals(header.default,val);
            } else {
                return header.default === val;
            }
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

                if(!this.diff(this.models[i],this.form[i])) {
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
                url: Store.rootUrl+'/Update/Order/Report/ThisTeachDetail',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('修改成功');
                    $.extend(self.patch,patch_add);
                    console.log(self.patch);
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
        
        tmp = {
            form: [
                 {name:'订单ID',from:'orderId',default:this.obj._id,filter:'uid'},
                 {name:'教学类型',patch_key:'teachWay',from:'thisTeachDetail.teachWay',default:this.obj.thisTeachDetail.teachWay,filter:'radio/teach_way'},
                 {name:'难易程度',patch_key:'easyLevel',from:'thisTeachDetail.easyLevel',default:this.obj.thisTeachDetail.easyLevel},
                 {name:'专业辅导科目',patch_key:'course',from:'thisTeachDetail.course',default:this.obj.thisTeachDetail.course},
                 {name:'专业辅导年级',patch_key:'grade',from:'thisTeachDetail.grade',default:this.obj.thisTeachDetail.grade},
                 {name:'阶段',patch_key:'category',from:'thisTeachDetail.category',default:this.obj.thisTeachDetail.category},
                 {name:'复习模拟卷类型',patch_key:'examPaper',from:'thisTeachDetail.examPaper',default:this.obj.thisTeachDetail.examPaper},
                 {name:'知识点',patch_key:'knowledge',from:'thisTeachDetail.knowledge',default:this.obj.thisTeachDetail.knowledge,filter:'array'}
                ],
            models: [],
            submitLock: false
        };

        // 一些属性值可能为 undefined
        for(var i=0;i!=tmp.form.length;i++) {
            if (tmp.form[i].filter === 'array') {
                tmp.form[i].default = (tmp.form[i].default!==undefined&&tmp.form[i].default.length !== 0)?tmp.form[i].default:['','','','','','','','',''];
            } else {
                tmp.form[i].default = tmp.form[i].default!==undefined?tmp.form[i].default:'';
            }
        }

        // model 是 default 的克隆
        function clone(arr) {
            var b=[]; 
            for(var i=0,l=arr.length;i<l;i++){
                b.push(arr[i]);
            }
            return b;
        }

        for(var i=0;i!=tmp.form.length;i++){
            if (tmp.form[i].filter === 'array')
                tmp.models.push(clone(tmp.form[i].default));
            else
                tmp.models.push(tmp.form[i].default);
        }

        return tmp;
    },
    template:'<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>修改本次反馈报告</li></ol>'+
                            "<form onSubmit=\"return false;\">\n"+
                                "<div class=\"form-group\" v-for=\"(key1,item) in form\">\n"+
                                    "<label>{{item.name}}</label><span :class=\"{hidden:diff(models[key1],item)}\">*</span>\n"+
                                    "<template v-if=\"item.filter==='uid'\">\n"+
                                        "<p>{{models[key1]}}</p>\n"+
                                    "</template>\n"+
                                    "<template v-if=\"item.filter==='radio/teach_way'\">\n"+
                                        "<br><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"1\" />针对性知识点补习</label><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"2\" />复习模拟卷</label>"+
                                    "</template>\n"+
                                    "<template v-if=\"item.filter==='array'\">\n"+
                                        "<div v-for=\"(key2,value) in models[key1]\" track-by=\"$index\">{{key2 + 1}}：<input type=\"text\" v-model=\"models[key1][key2]\"/></div>\n"+
                                    "</template>\n"+
                                    "<template v-if=\"item.filter===undefined\">\n"+
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
Vue.component('update-report',UpdateReport);