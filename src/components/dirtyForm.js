//BookMark:脏检查表单
var DirtyForm = Vue.extend({
    props:['form','api','qnToken','isTmp','noWrapper'],
    data:function() {
        var tmp = {models:[],submitLock:false};
        for(var i=0;i!=this.form.length;i++){
            if (this.form[i].filter === 'array') {
                var model = {
                    oldArr: this.form[i].default,
                    newArr: [],
                };
                for(var j=0;j!==model.oldArr.length;j++) {
                    model.newArr.push(model.oldArr[j]);
                }
                tmp.models.push(model);
            } else {
                tmp.models.push(this.form[i].default);
            }
        }
        return tmp;
    },
    template:"<form onSubmit=\"return false;\">\n"+
                "<div class=\"form-group\" v-for=\"(key1,item) in form\">\n"+
                    "<label>{{item.name}}</label><span v-if=\"item.filter!=='array'\" :class=\"{hidden:(models[key1]===item.default)}\">*</span>\n"+
                    "<template v-if=\"item.filter==='uid'\">\n"+
                        "<p>{{models[key1]}}</p>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='bool'\">\n"+
                        "<br><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"true\" />是</label><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"false\" />否</label>"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='radio/teach_way'\">\n"+
                        "<br><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"1\" />针对性知识点补习</label><label class=\"radio-inline\"><input v-model=\"models[key1]\" type=\"radio\" :value=\"2\" />复习模拟卷</label>"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='textarea'\">\n"+
                        "<textarea class=\"form-control\" rows=\"3\" v-model=\"models[key1]\"></textarea>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='img'\">\n"+
                        "<br><img :src=\"models[key1]\" alt=\"暂无图片\">\n"+
                        "<input type=\"file\" v-on:change=\"upload($event,key1)\"/>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='array'\">\n"+
                        "<div v-for=\"(key2,value) in models[key1].newArr\" track-by=\"$index\">{{key2 + 1}}：<input type=\"text\" v-model=\"models[key1].newArr[key2]\"/></div>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter===undefined\">\n"+
                        "<br><input class=\"form-control\" type=\"text\" v-model=\"models[key1]\"/>\n"+
                    "</template>\n"+
               "</div>\n"+                   
                "<safe-lock text=\"解锁修改按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">修改</button>\n"+
                "<span>（只改动带*号的数据）</span></safe-lock>\n"+
            "</form>",
    methods:{
        upload: function(e,index) {
            var self = this;
            var file = e.target.files[0];
            var supportedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
            if (file && supportedTypes.indexOf(file.type) >= 0) {
                var oMyForm = new FormData();
                oMyForm.append("token", self.qnToken);
                oMyForm.append("file", file);
                oMyForm.append("key", Date.parse(new Date()));

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://upload.qiniu.com/");
                xhr.onreadystatechange = function(response) {
                    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                        var blkRet = JSON.parse(xhr.responseText);
                        console && console.log(blkRet);
                        self.models.$set(index,'http://7xrvd4.com1.z0.glb.clouddn.com/'+blkRet.key);
                    } else if (xhr.status != 200 && xhr.responseText) {
                        console && console.log('上传失败');
                    }
                };
                xhr.send(oMyForm);
            } else {
                alert('文件格式只支持：jpg、jpeg 和 png');
            }
        },
        submit: function() {
            var tmp={};
            var data={};
            var modified = false;
            for(var i=0;i!=this.form.length;i++){
                if(this.form[i].filter === 'uid') {
                    data = Store.setter(data,this.form[i].from,this.models[i]);
                    continue;
                }

                if(this.form[i].filter === 'array') {
                    var arrayModified = false;
                    for (var j=0;j!==this.models[i].newArr.length;j++) {
                        if (this.models[i].newArr[j] !== this.models[i].oldArr[j]) {
                            arrayModified = true;
                            break;
                        }
                    }

                    if(arrayModified) {
                        data = Store.setter(data,this.form[i].from,this.models[i].newArr);
                        modified = true;
                    }
                    continue;
                }

                if(this.form[i].default !== this.models[i]) {
                    var post;
                    switch(this.form[i].submitFilter) {
                        case 'number/100':
                        post = parseInt(this.models[i]*100);
                        break;
                        default:
                        post = this.models[i];
                    }
                    data = Store.setter(data,this.form[i].from,post);
                    modified = true;
                }
            }
            tmp.token = Store.token;
            tmp.data = data;
            
            if (!modified) {
                return;
            }
            
            console.log(tmp);
            var self = this;
            $.ajax({
                url: Store.rootUrl+self.api,
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('修改成功');
                    if (!self.isTmp) {
                        location.reload();
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
    }
})
Vue.component('dirty-form',DirtyForm);