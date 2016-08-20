//route:guideMap
var SectionGuideMap = Vue.extend({
    data: function() {
        var self = this;
        $.ajax({
            url:Store.rootUrl+'/OnlineParams?token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                self.guideMap = data.data.guideMap;
                self.qnToken = data.data.qnToken;
                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
        return {
            loaded: false,
            guideMap: [],
            safeLock: true,
            safeLockPsw: '',
        }
    },
    methods: {
        clean: function(index) {
            this.guideMap.splice(index,1);
        },
        add: function(index) {
            this.guideMap.push({image:'',url:''});
        },
        upload: function(e,index) {
            var self = this;
            var file = e.target.files[0];
            var supportedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
            if (file && supportedTypes.indexOf(file.type) >= 0) {
                var oMyForm = new FormData();
                oMyForm.append("token", this.qnToken);
                oMyForm.append("file", file);
                oMyForm.append("key", Date.parse(new Date()));

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://upload.qiniu.com/");
                xhr.onreadystatechange = function(response) {
                    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
                        var blkRet = JSON.parse(xhr.responseText);
                        console && console.log(blkRet);
                        self.guideMap[index].image = 'http://7xrvd4.com1.z0.glb.clouddn.com/'+blkRet.key;
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
            var tmp = {
                token: Store.token,
                data: {
                    guideMap: this.guideMap,
                }
            };
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+'/OnlineParams',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    location.reload();
                    alert('修改成功');
                }else{
                    alert('修改失败');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
            });
        }
    },
    template:"<ol class=\"breadcrumb\"><li>在线参数</li><li>修改轮播图</li></ol>\n"+
                    "<div v-if=\"loaded\">\n"+
                        "<div class=\"guidemap\" v-for=\"ad in guideMap\">\n"+
                            "<a class=\"delete\" href=\"javascript:void(0);\" v-on:click=\"clean($index)\">删除</a>\n"+
                            "<p><strong>预览图</strong></p>\n"+
                            "<img :src=\"ad.image\" alt=\"暂无图片\">\n"+
                            "<input type=\"file\" v-on:change=\"upload($event,$index)\"/>\n"+
                            "<p><strong>广告链接</strong></p>\n"+
                            "<input class=\"form-control\" type=\"text\" v-model=\"ad.link\" />\n"+
                            "<div class=\"action\"></div>\n"+
                        "</div>\n"+
                        "<button class=\"btn btn-default\" v-on:click=\"add()\">添加新广告</button>\n"+
                    "</div>\n"+
                    "<div class=\"creater\">\n"+
                        "<safe-lock text=\"解锁修改按钮\"><button class=\"btn btn-default\" v-on:click=\"submit()\">提交变更</button><span style=\"color:red;\">（注意：所有变更提交之后才生效）</span></safe-lock>\n"+
                    "</div>",
})