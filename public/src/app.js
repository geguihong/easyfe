//Bookmark:安全锁
var safeLock = Vue.extend({
    props: ['text'],
    data: function() {
        return {
            safeLock: true,
            safeLockPsw: '',
        };
    },
    template:"<template v-if=\"safeLock\">\n"+
                        "<input placeholder=\"请输入安全码...\" type=\"password\" v-model=\"safeLockPsw\" />\n"+
                        "<button class=\"btn btn-default\" v-on:click=\"unlock()\">{{text}}</button>"+
                    "</template>"+
                    "<template v-if=\"!safeLock\">\n"+
                        "<slot>按钮失效</slot>\n"+
                    "</template>",
    methods:{
        unlock: function() {
            if (this.safeLockPsw === Store.safeLockPsw) {
                this.safeLock = false;
            } else {
                alert('安全码错误！');
            }
        },
    },
});
Vue.component('safe-lock', safeLock);

//Bookmark:侧边导航
var SideBar = Vue.extend({
    data: function() {
        return {
            navs:[{
                name: '用户管理',
                state: '-',
                items: [{
                    name:'所有用户信息',
                    href:'/allUser',
                },{
                    name:'家长信息',
                    href:'/parent',
                },{
                    name:'未审核家教信息',
                    href:'/teacher/unchecked',
                },{
                    name:'通过审核的家教',
                    href:'/teacher/pass',
                },{
                    name:'没通过审核的家教',
                    href:'/teacher/notpass'
                }]
            },{
                name: '订单管理',
                state: '-',
                items: [{
                    name:'所有订单',
                    href:'/order/n0',
                },{
                    name:'已预定订单',
                    href:'/order/n1',
                },{
                    name:'待执行订单',
                    href:'/order/n2',
                },{
                    name:'已修改订单',
                    href:'/order/n3',
                },{
                    name:'已完成订单',
                    href:'/order/n4',
                },{
                    name:'已取消订单',
                    href:'/order/n5',
                }]
            },{
                name: '特价推广管理',
                state: '-',
                items: [{
                    name:'特价推广执行情况',
                    href:'/order/d0',
                },{
                    name:'未审核推广',
                    href:'/order/d1',
                },{
                    name:'已上线推广',
                    href:'/order/d2',
                },{
                    name:'已下线推广',
                    href:'/order/d3',
                }]
            },{
                name: '消息中心',
                state: '-',
                items: [{
                    name:'发送消息',
                    href:'/sendMessage',
                },{
                    name:'历史消息',
                    href:'/message',
                },{
                    name:'所有反馈',
                    href:'/feedback/0',
                },{
                    name:'需求反馈',
                    href:'/feedback/1',
                },{
                    name:'应用反馈',
                    href:'/feedback/2',
                },{
                    name:'投诉反馈',
                    href:'/feedback/3',
                }]
            },{
                name: '在线参数',
                state: '-',
                items: [{
                    name:'修改在线参数',
                    href:'/onlineParams'
                },{
                    name:'修改轮播图',
                    href:'/guidemap',
                },{
                    name:'修改首页广告',
                    href:'/advertise'
                }]
            },{
                name: '会员活动',
                state: '-',
                items: [{
                    name: '发布会员活动',
                    href: '/createEvent'
                },{
                    name: '会员活动发布情况',
                    href: '/VipEvent',
                }]
            }]
        }
    },
    template: "<div v-for=\"nav in navs\">\n                    <h4 v-on:click=\"toggle($index)\">{{nav.name}} <span>{{nav.state}}</span></h4>\n                    <ul class=\"nav nav-sidebar\" :class=\"{hidden:nav.state == '+'}\">\n                        <li v-for=\"item in nav.items\" v-link=\"{path:item.href,activeClass:'active'}\"><a>{{item.name}}</a></li>\n                    </ul>\n                </div>",
    methods: {
        toggle: function(index) {
            if(this.navs[index].state=='+'){
                this.navs[index].state='-';
            } else {
                this.navs[index].state='+';
            }
        }
    }
})
Vue.component('side-bar', SideBar);

//BookMark:模态框
var Modal = Vue.extend({
    data: function() {
        return Store.modal;
    },
    template:'<div class=\"modal fade\" id=\"app-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\">'+
                 '<div class=\"modal-dialog\" role=\"document\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                           
                            '<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>'+
                            '<h4 class=\"modal-title\">详情</h4>'+                       
                        '</div>'+
                        '<div class=\"modal-body\" v-if=\"type === \'table\' \">'+
                            '<div class=\"table-responsive\">'+                    
                                '<table class=\"table table-hover\">'+                      
                                    '<thead><tr><th v-for=\"item in header\" track-by=\"$index\">{{item}}</th></tr></thead>'+                        
                                    '<tbody><tr v-for=\"item in datas\" track-by=\"$index\"><td v-for=\"cell in item\" track-by=\"$index\">{{cell}}</td></tr></tbody>'+
                                '</table>'+
                             '</div>'+
                         '</div>'+
                        '<div class=\"modal-body\" v-else>'+
                            '<div v-if=\"$index > 0\" v-for=\"item in datas\" class=\"bundle\" track-by=\"$index\">'+   
                                '<p class=\"left\"><strong>{{header[$index].name}}</strong></p>'+    
                                '<p class=\"right\" v-if=\"header[$index].filter!==\'img\'\" >{{item}}</p>'+
                                '<img class=\"right\" v-if=\"header[$index].filter===\'img\'\" :src=\"item\" />'+
                            '</div>'+
                         '</div>'+
                    '</div>'+
                '</div>'+
            '</div>',
});
Vue.component('modal', Modal);

//Bookmark:动作行
var ActionRow = Vue.extend({
    props:['postData','actions', 'preData'],
    template:'<tr><td><a v-for="action in actions" v-on:click="emit(action)">{{action}}</a></td><td v-if="$index > 0" v-for="cell in postData" track-by="$index">{{cell}}</td></tr>',
    methods:{
        checkOrder: function(id,isShow) {            
            var tmp = {
                token: Store.token,
            };
            tmp['orderId'] = id;
            tmp['isShow'] = isShow;
            
            $.ajax({
                url: Store.rootUrl+'/Order/Discount/Check',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    location.reload();
                    alert('执行成功！');
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        checkTeacher: function(id,checkType) {            
            var tmp = {
                token: Store.token,
            };
            tmp['orderId'] = id;
            tmp['checkType'] = checkType;
            
            $.ajax({
                url: Store.rootUrl+'/Order/Discount/Check',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    location.reload();
                    alert('执行成功！');
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        emit: function(event){
            switch(event) {
                case '通过':
                this.checkTeacher(this.postData[0],1);
                break;
                case '驳回':
                this.checkTeacher(this.postData[0],2);
                break;
                case '上线':
                this.checkOrder(this.postData[0],true);
                break;
                case '下线':
                this.checkOrder(this.postData[0],false);
                break;
                case '预定列表':
                Store.modal.type = 'table';
                Store.modal.header = ['1','2'];
                Store.modal.datas = [[1,2],[1,2]];
                $('#app-modal').modal();
                break;
                case '修改':
                Store.tmpForm = this.preData;
                router.go('/UpdateVipEvent');
                break;
                case '查看':
                Store.modal.type = 'object';
                Store.modal.datas = this.postData;
                $('#app-modal').modal();
                break;
            }
        }
    }
});
Vue.component('action-row', ActionRow);

//Bookmark:分页表
var PaginationTable = Vue.extend({
    props:['postDatas','header','actions'],
    data:function() {
        Store.modal.datas = [];
        Store.modal.header = this.header;

        var datas = [];
        for(var i=0;i!==this.postDatas.length;i++) {
            datas.push({post:this.postDatas[i],trace_id:i});
        }

        tmpPages = this.chunk(datas,10);
        
        return {
            pages: tmpPages,
            currentPage:0,
            keyword: '',
            preDatas: Store.tmpPreDatas,
            datas: datas,
        };
    },
    template: "<form class=\"form-inline\" onSubmit=\"return false\">\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control\" v-model=\"keyword\">\n                    </div>\n                    <button v-on:click=\"search()\" type=\"submit\" class=\"btn btn-default\">搜索</button>\n                    <div style=\"float:right;\"><safe-lock text=\"解锁导出按钮\"><button v-on:click=\"exportTable()\" type=\"submit\" class=\"btn btn-default\">全部导出</button></safe-lock></div>\n                </form>\n                <div class=\"table-responsive\">\n                    <table class=\"table table-hover\">\n                        <thead><tr><th>操作</th><th v-if=\"$index > 0\" v-for=\"cell in header\">{{cell.name}}</th></tr></thead>\n                        <tbody><tr is=\"action-row\" v-for=\"item in pages[currentPage]\" :pre-data=\"preDatas[item.trace_id]\" :post-data=\"item.post\" :actions=\"actions\"></tr></tbody>\n                    </table>\n                </div>\n                <ul class=\"pagination\"><li v-for=\"page in pages\" v-on:click=\"changePage($index)\" :class=\"{'active':$index===currentPage}\"><a>{{$index+1}}</a></li></ul>",
    methods:{
        chunk: function (array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        },
        changePage: function(index) {
            this.currentPage = index;
        },
        exportTable: function() {
            Store.ArrayToCSVConvertor(this.postDatas,this.header);
        },
        search: function() {
            if (this.keyword === '') {
                this.pages = this.chunk(this.datas,10);
                this.currentPage = 0;
                return ;
            } 
            
            var nD = [];
            for(var i in this.datas){
                for(var j in this.datas[i].post){
                    if(this.datas[i].post[j].toString().indexOf(this.keyword) >= 0){
                        nD.push(this.datas[i]);
                        break;
                    }
                }
            }
            this.pages = this.chunk(nD,10);
            this.currentPage = 0;
        }
    }
});
Vue.component('pagination-table',PaginationTable);

//BookMark:脏检查表单
var DirtyForm = Vue.extend({
    props:['form','api','qnToken','isTmp'],
    data:function() {
        var tmp = {models:[],submitLock:false};
        for(var i=0;i!=this.form.length;i++){
            tmp.models.push(this.form[i].default);
        }
        return tmp;
    },
    template:"<form onSubmit=\"return false;\">\n"+
                "<div class=\"form-group\" v-for=\"item in form\">\n"+
                    "<label>{{item.name}}</label><span :class=\"{hidden:(models[$index]===item.default)}\">*</span>\n"+
                    "<template v-if=\"item.filter===undefined\">\n"+
                        "<br><input class=\"form-control\" type=\"text\" v-model=\"models[$index]\"/>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='uid'\">\n"+
                        "<p>{{models[$index]}}</p>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='textarea'\">\n"+
                        "<textarea class=\"form-control\" rows=\"3\" v-model=\"models[$index]\"></textarea>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='img'\">\n"+
                        "<br><img :src=\"models[$index]\" alt=\"暂无图片\">\n"+
                        "<input type=\"file\" v-on:change=\"upload($event,$index)\"/>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='bool'\">\n"+
                        "<br><label class=\"radio-inline\"><input v-model=\"models[$index]\" type=\"radio\" :value=\"true\" />是</label><label class=\"radio-inline\"><input v-model=\"models[$index]\" type=\"radio\" :value=\"false\" />否</label>"+
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
                } else if(this.form[i].default !== this.models[i]) {
                    data = Store.setter(data,this.form[i].from,this.models[i]);
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
                    if (self.isTmp) {
                        router.go('/');
                    } else {
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

//route:home 
var PageHome = Vue.extend({
    template:"<div class=\"container-fluid\">\n                <div class=\"row\">\n                    <!-- 侧边导航 -->\n                    <div class=\"col-xs-2 sidebar\">\n                        <side-bar></side-bar>\n                    </div>\n\n                    <div class=\"col-xs-10 col-xs-offset-2 main\">\n                        <router-view></router-view>\n                    </div>\n                </div>\n            </div>\n            <modal></modal>"
})

//route:login
var PageLogin = Vue.extend({
    data: function() {
        return {
            account: '',
            password: '',
            submitLock: false,
        }
    },
    methods:{
        submit: function() {
            this.submitLock = true;
            var tmp = {
                account: this.account,
                password: $.md5(this.password),
            }
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+'/Manager/Login?account='+tmp.account+'&password='+tmp.password,
                dataType: 'json',
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    sessionStorage['token'] = data.data.token;
                    Store.token = sessionStorage['token'];
                    router.go('/');
                    alert('登录成功');
                }else{
                    alert('登录失败');
                }
                self.submitLock = false;
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
               self.submitLock = false;
            });
        }
    },
    template: "<div class=\"container\">\n                    <form class=\"form-signin\" onsubmit=\"return false;\">\n                        <h2 class=\"form-signin-heading\">请登录</h2>\n                        <label class=\"sr-only\" for=\"inputEmail\">管理员账号</label>\n                        <input v-model=\"account\" class=\"form-control\" id=\"inputEmail\" autofocus=\"\" required=\"\" type=\"text\" placeholder=\"请输入账号...\">\n                        <label class=\"sr-only\" for=\"inputPassword\">密码</label>\n                        <input v-model=\"password\" class=\"form-control\" id=\"inputPassword\" required=\"\" type=\"password\" placeholder=\"请输入密码...\">\n                        <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\" v-on:click=\"submit()\" :disabled=\"submitLock\">登陆</button>\n                    </form>\n                </div>",
})

//route:allUser
var SectionAllUser = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader;
        tmp.actions = ['查看'];
        
        this.reload();
        return tmp;
    },
    methods: {
        reload: function() {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/User?type=0&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                        for(var i in data.data){
                            var x = data.data[i];
                            var postData = [];
                            for(var j in self.header) {
                                var str = Store.getter(x,self.header[j].from);
                                if (str !== undefined ) {
                                    if (self.header[j].filter) {
                                        str = Store.filter(str,self.header[j].filter);
                                    }
                                } else {
                                    str = '';
                                }
                                postData.push(str);
                            }
                            self.postDatas.push(postData);
                        }
                        self.loaded = true;
                }else{
                    alert('获取数据失败');
                }
                
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>所有用户信息</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

//route:parent
var SectionParent = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader;
        tmp.actions = ['查看'];
        
        this.reload();
        return tmp;
    },
    methods: {
        reload: function() {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/User?type=1&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                        for(var i in data.data){
                            var x = data.data[i];
                            var postData = [];
                            for(var j in self.header) {
                                var str = Store.getter(x,self.header[j].from);
                                if (str !== undefined ) {
                                    if (self.header[j].filter) {
                                        str = Store.filter(str,self.header[j].filter);
                                    }
                                } else {
                                    str = '';
                                }
                                postData.push(str);
                            }
                            self.postDatas.push(postData);
                        }
                        self.loaded = true;
                }else{
                    alert('获取数据失败');
                }
                
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>家长信息</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

//route:teacher
var SectionTeacher = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader;
        tmp.actions = ['查看'];
        if (this.$route.params['type_id'] == 'pass'){
            tmp.subtitle = '通过审核的家教';
            this.reload(3);
        } else if (this.$route.params['type_id'] == 'notpass') {
            tmp.subtitle = '没通过审核的家教';
            this.reload(4);
        }　if (this.$route.params['type_id'] == 'unchecked'){
            tmp.subtitle = '未审核家教';
            tmp.actions.push('通过','驳回');
            this.reload(2);
        }
        return tmp;
    },
    methods: {
        reload: function(type) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/User?type='+type+'&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                        for(var i in data.data){
                            var x = data.data[i];
                            var postData = [];
                            for(var j in self.header) {
                                var str = Store.getter(x,self.header[j].from);
                                if (str !== undefined ) {
                                    if (self.header[j].filter) {
                                        str = Store.filter(str,self.header[j].filter);
                                    }
                                } else {
                                    str = '';
                                }
                                postData.push(str);
                            }
                            self.postDatas.push(postData);
                        }
                        self.loaded = true;
                }else{
                    alert('获取数据失败');
                }
                
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

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
            this.submitLock = true;
            tmp={};
            tmp.content = this.content;
            tmp.type = this.type;
            tmp.token = Store.token;
            
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

//route:order
var SectionOrder = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
            {name:'UID',from:'_id'},
            {name:'家长ID',from:'parent._id'},
            {name:'家长手机',from:'parent.phone'},
            {name:'家教ID',from:'teacher._id'},
            {name:'家教手机',from:'teacher.phone'},
            {name:'年级',from:'grade'},
            {name:'课程',from:'course'},
            {name:'授课日期',from:'teachTime.date'},
            {name:'授课时段',from:'teachTime.time',filter:'radio/timeArea'},
            {name:'授课时长',from:'time',filter:'min'},
            {name:'单位价格',from:'price',filter:'money'},
            {name:'交通补贴',from:'subsidy',filter:'money'},
            {name:'专业辅导费',from:'professionalTutorPrice',filter:'money'},
            {name:'抵减优惠券',from:'coupon.money',filter:'money'},
            {name:'总价',from:'COMPUTED/SUM',filter:'money'},
            {name:'孩子年龄',from:'childAge',filter:'age'},
            {name:'孩子性别',from:'childGender',filter:'radio/gender'},
            {name:'订单号',from:'orderNumber'},
            {name:'订单类型',from:'type',filter:'radio/order_type'},
            {name:'订单状态',from:'state',filter:'radio/order_state'},
            {name:'保险单号',from:'insurance.insuranceNumber'},
            {name:'下单时间',from:'created_at',filter:'date'},
            {name:'最近修改时间',from:'updatedAt',filter:'date'},
            {name:'确认时间',from:'sureTime',filter:'date'},
            {name:'取消者',from:'cancelPerson',filter:'radio/cancelPerson'},
            {name:'是否特价订单',from:'type',filter:'bool/discount'},
        ];
        
        tmp.actions = [];
        var url = '';
        var type = this.$route.params['type_id'];
        switch(type) {
            case 'n0':
            case 'n1':
            case 'n2':
            case 'n3':
            case 'n4':
            case 'n5':
            tmp.maintitle = '订单管理';
            break;
            case 'd0':
            case 'd1':
            case 'd2':
            case 'd3':
            tmp.maintitle = '特价推广管理';
            break;
        }
        switch(type) {
            case 'n0':
            url = '/Order?state=-1';
            tmp.subtitle = '所有订单';
            break;
            
            case 'n1':
            url = '/Order?state=0';
            tmp.subtitle = '已预定订单';
            break;
            
            case 'n2':
            url = '/Order?state=1';
            tmp.subtitle = '待执行订单';
            break;
            
            case 'n3':
            url = '/Order?state=2';
            tmp.subtitle = '已修改订单';
            break;
            
            case 'n4':
            url = '/Order?state=3';
            tmp.subtitle = '已完成订单';
            break;
            
            case 'n5':
            url = '/Order?state=4';
            tmp.subtitle = '已取消订单';
            break;
            
            case 'd0':
            url = '/Order/Discount?type=-1';
            tmp.subtitle = '特价推广执行情况';
            break;
            
            case 'd1':
            url = '/Order/Discount?type=0';
            tmp.subtitle = '未审核推广';
            tmp.actions = ['上线'];
            break;
            
            case 'd2':
            url = '/Order/Discount?type=1';
            tmp.subtitle = '已上线推广';
            tmp.actions = ['下线'];
            break;
            
            case 'd3':
            url = '/Order/Discount?type=2';
            tmp.subtitle = '已下线推广';
            tmp.actions = ['上线'];
            break;
        }
        
        this.reload(url);
        return tmp;
    },
    methods: {
        reload: function(url) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+url+'&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                    for(var i in data.data){
                        var x = data.data[i];
                        var postData = [];
                        for(var j in self.header) {
                            var str = Store.getter(x,self.header[j].from);
                            if (str !== undefined ) {
                                if (self.header[j].filter) {
                                    str = Store.filter(str,self.header[j].filter);
                                }
                            } else {
                                str = '';
                            }
                            postData.push(str);
                        }
                        self.postDatas.push(postData);
                    }
                    self.loaded = true;
                }else{
                    alert('获取数据失败');
                }
                
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>{{maintitle}}</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

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

//route:Feedback
var SectionFeedback = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'UID',from:'_id'},
                {name:'ID',from:'TODO'},
                {name:'用户类型',from:'TODO'},
                {name:'姓名',from:'TODO'},
                {name:'手机',from:'TODO'},
                {name:'反馈类型',from:'TODO'},
                {name:'反馈内容',from:'TODO'},
                {name:'提交时间',from:'TODO'},
        ];
        tmp.actions = ['查看'];
        tmp.subtitle = ['所有反馈','需求反馈','应用反馈','投诉反馈'][this.$route.params['type_id']];

        
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/feedback?type='+type+'&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                    for(var i in data.data){
                        var x = data.data[i];
                        var postData = [];
                        for(var j in self.header) {
                            var str = Store.getter(x,self.header[j].from);
                            if (str !== undefined ) {
                                if (self.header[j].filter) {
                                    str = Store.filter(str,self.header[j].filter);
                                }
                            } else {
                                str = '';
                            }
                            postData.push(str);
                        }
                        self.postDatas.push(postData);
                    }
                    self.loaded = true;
                }else{
                    alert('获取数据失败');
                }
                
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>消息中心</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

//route:CreateEvent
var SectionCreateEvent = Vue.extend({
    data: function() {
        return {
            token: Store.token,
            title: '标题',
            detail: '详情',
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
                                '<label>积分预定</label><input class=\"form-control\" type="text" v-model=\"score\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+                         
                                '<label>现金预定</label><input class=\"form-control\" type="text" v-model=\"money\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+                       
                                '<label>活动人数上限</label><input class=\"form-control\" type="text" v-model=\"allowCount\">'+
                            '</div>'+
                            '<div class=\"form-group\">'+
                                '<label>是否接受预定</label><br /><label class=\"radio-inline\"><input v-model=\"isPublish\" type=\"radio\" value=\"1\" />是</label><label class=\"radio-inline\"><input v-model=\"isPublish\" type=\"radio\" value=\"0\" />否</label>'+
                            '</div>'+
                            '<safe-lock text=\"解锁发布按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">发布活动</button></safe-lock>'+
                        '</form>'+
                    '</div>',
    methods: {
        submit: function () {
            this.submitLock = true;
            tmp={};
            tmp.title = this.title;
            tmp.detail = this.detail;
            tmp.score = this.score;
            tmp.money = parseInt(this.money * 100);
            tmp.allowCount = this.allowCount;
            tmp.isPublish = this.isPublish === '1' ?true:false;

            tmp.token = Store.token;
            
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


//route:Event
var SectionVipEvent = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'UID',from:'_id'},
                {name:'活动编号',from:'_id'},
                {name:'活动标题',from:'title'},
                {name:'发布时间',from:'created_at',filter:'date'},
                {name:'活动说明',from:'detail'},
                {name:'积分预订',from:'score'},
                {name:'现金预订',from:'money',filter:'money/100'},
                {name:'最大人数',from:'allowCount'},
                {name:'已预约人数',from:'bookCount'},
                {name:'活动状态',from:'COMPUTED/EVENTSTATE'},
        ];
        tmp.actions = ['查看','预定列表','修改'];
        tmp.subtitle = ['所有反馈','需求反馈','应用反馈','投诉反馈'][this.$route.params['type_id']];

        
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/VipEvent?token='+Store.token,
                dataType: 'json',
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                    for(var i in data.data){
                        var x = data.data[i];
                        var postData = [];
                        for(var j in self.header) {
                            var str = Store.getter(x,self.header[j].from);
                            if (str !== undefined ) {
                                if (self.header[j].filter) {
                                    str = Store.filter(str,self.header[j].filter);
                                }
                            } else {
                                str = '';
                            }
                            postData.push(str);
                        }
                        self.postDatas.push(postData);
                    }
                    self.loaded = true;
                }else{
                    alert('获取数据失败');
                }
                
            }).fail(function(data, status, jqXHR){
                alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>会员活动</li><li>会员活动发布情况</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

//route:UpdateVipEvent
var SectionUpdateVipEvent = Vue.extend({
    data: function() {
        return {
            form: [
                {name:'活动编号',from:'vipEventId',default:Store.tmpForm._id,filter:'uid'},
                {name:'活动标题',from:'title',default:Store.tmpForm.title},
                {name:'活动说明',from:'detail',default:Store.tmpForm.detail},
                {name:'积分预订',from:'score',default:Store.tmpForm.score},
                {name:'现金预订',from:'money',default:Store.tmpForm.money},
                {name:'最大人数',from:'allowCount',default:Store.tmpForm.allowCount},
                {name:'是否接受预定',from:'isPublish',default:Store.tmpForm.isPublish,filter:'bool'},
                ]
        }
    },
    template: '<ol class="breadcrumb"><li>修改</li><li>修改会员活动</li></ol>'+
                '<div><dirty-form :form="form" api="/VipEvent/Update" :is-tmp="true"></dirty-form></div>',
})


//路由
var router = new VueRouter()
router.map({
    '/login': {
        component: PageLogin,
    },
    '/': {
        component: PageHome,
        subRoutes: {
            '/allUser': {
                component: SectionAllUser
            },
            '/parent': {
                component: SectionParent
            },
            '/order/:type_id': {
                component: SectionOrder
            },
            '/sendMessage': {
                component: SectionSendMessage
            },
            '/onlineParams': {
                component: SectionOnlineParams
            },
            '/feedback/:type_id': {
                component: SectionFeedback,
            },
            '/teacher/:type_id': {
                component: SectionTeacher,
            },
            '/guidemap': { 
                component: SectionGuideMap,
            },
            '/advertise': {
                component: SectionAdvertise,
            },
            '/createEvent': {
                component: SectionCreateEvent,
            },
            '/VipEvent': {
                component: SectionVipEvent,
            },
            '/UpdateVipEvent': {
                component: SectionUpdateVipEvent,
            }
        }
    },
})

//BookMark:全局
var App = Vue.extend({})
var Store = {
    rootUrl: '/Web',
    token: '',
    modal: {
        header: [],
        datas: [],
        type: 'object',
    },
    tmpForm: null,
    safeLockPsw: 'jiajiaoyi',
    getter: function(data,key) {
        switch (key) {
            case 'COMPUTED/SUM':
                var price = data.price;
                var addPrice = 0;
                var professionalTutorPrice = data.professionalTutorPrice;
                var subsidy = data.professionalTutorPrice;
                var coupon_money = 0;
                var time = data.time;

                if (data.addPrice !== undefined)
                    addPrice = data.addPrice;
                if (data.coupon !== undefined)
                    coupon_money = data.coupon.money; 
                return (price + addPrice + professionalTutorPrice) * (time/60) + subsidy - coupon_money;
            case 'COMPUTED/SCORE':
                if (data.teacherMessage !== undefined) {
                    return data.teacherMessage.teachScore;
                } else {
                    return data.parentMessage.score;
                }
            case 'COMPUTED/EVENTSTATE':
                if( data.isPublish ) {
                    if (data.bookCount < data.allowCount) {
                        return '接受预定/未订满';
                    } else {
                        return '接受预定/已订满';
                    }
                } else {
                    return '已下线';
                }
            case 'COMPUTED/ORDERCOUNT':
                if (data.teacherMessage !== undefined) {
                    return '!';
                } else {
                    return data.parentMessage.bookCount;
                }
            case 'COMPUTED/ORDERTIME':
                if (data.teacherMessage !== undefined) {
                    return data.teacherMessage.teachTime;
                } else {
                    return data.parentMessage.finishCourseTime;
                }
        }

        var arr = key.split('.');
        var cur = data;
        for(var i=0;i!=arr.length;i++){
            cur = cur[arr[i]];
            if(cur === undefined){
                break;
            }
        }
        
        return cur;   
    },
    setter: function(data,key,value) {
        var arr = key.split(".");
                    
        var cur = data;
        for(var j in arr){
            if( j == arr.length-1){
                cur[arr[j]] = value;
            }else{
                if(cur[arr[j]] == undefined){
                    cur[arr[j]] = {};
                    cur = cur[arr[j]];
                }else{
                    cur = cur[arr[j]];
                }
            }
        }
        
        return data;
    },
    filter: function(str,type) {
        switch(type) {
            case 'age':
            return str + ' 岁';
            case 'min':
            return str + ' 分钟';
            case 'money':
            return str.toFixed(2) + ' 元';
            case 'money/100':
            return (str/100).toFixed(2) + ' 元';
            case 'bool':
            return str?'是':'否';
            case 'bool/discount':
            return str === 1?'是':'否';
            case 'radio/checkType':
            return ['未审核','通过','不通过'][str];
            case 'radio/order_type':
            return ['单次预约','特价订单','多次预约'][str];
            case 'radio/user_type':
            return ['家长/家教','家教','家长'][str];
            case 'radio/order_state':
            return ['已预定','待执行','已修改','已完成','已取消'][str];
            case 'radio/gender':
            return ['女','男'][str];
            case 'radio/feedback':
            return ['','需求','应用','投诉'][str];
            case 'radio/cancelPerson':
            if (str === 'parent') {
                return '家长';
            } else if (str==='teacher') {
                return '家教';
            } else {
                return str;
            }
            case 'radio/timeArea':
            if (str === 'morning') {
                return '上午';
            } else if (str==='afternoon') {
                return '下午';
            } else if (str==='evening'){
                return '晚上';
            } else {
                return str;
            }
            case 'date':
            var date = new Date(str);
            return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
            default :
            return str;
        }
    },
    ArrayToCSVConvertor: function(arrData, header) {
        var CSV = "";
        
        //添加header
        var row = "";
        for (var index in header) {
            row += header[index].name + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
        
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (var index in arrData[i]) {
                row += '"'+arrData[i][index] + '",';
            }
            row = row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }

        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        
        //文件名
        var fileName = "表格";
        
        //初始化文件
        var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(CSV);
            
        
        //通过trick方式下载
        var link = document.createElement("a");    
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    userHeader:[
            {name:'UID',from:'_id'},
            {name:'ID',from:'_id'},
            {name:'姓名',from:'name'},
            {name:'性别',from:'gender',filter:'radio/gender'},
            {name:'生日',from:'birthday',filter:'date'},
            {name:'手机',from:'phone'},
            {name:'身份证号',from:'teacherMessage.idCard'},
            {name:'家庭地址',from:'position.address'},
            {name:'用户类型',from:'type',filter:'radio/user_type'},
            {name:'用户级别',from:'TODO'},
            {name:'用户积分',from:'COMPUTED/SCORE'},
            {name:'不良记录',from:'TODO'},
            {name:'已完成订单数量',from:'COMPUTED/ORDERCOUNT'},
            {name:'已完成订单时间',from:'COMPUTED/ORDERTIME',filter:'min'},
            {name:'宝贝性别',from:'parentMessage.childGender',filter:'age'},
            {name:'宝贝年龄',from:'parentMessage.childAge',filter:'age'},
            {name:'宝贝年级',from:'parentMessage.childGrade'},
            {name:'家教学校',from:'teacherMessage.school'},
            {name:'家教年级',from:'TODO'},
            {name:'支付宝账户',from:'TODO'},
            {name:'微信账户',from:'TODO'},
            {name:'开卡银行',from:'TODO'},
            {name:'银行账号',from:'TODO'},
            {name:'最小课程时间',from:'teacherMessage.minCourseTime',filter:'min'},
            {name:'免费交通区间',from:'teacherMessage.freeTrafficTime',filter:'min'},
            {name:'最远交通区间',from:'teacherMessage.maxTrafficTime',filter:'min'},
            {name:'交通补贴',from:'teacherMessage.subsidy',filter:'money'},
            {name:'教过孩子数量',from:'teacherMessage.teachCount'},
            {name:'已授课时间',from:'teacherMessage.hadTeach'},
            {name:'综合评分',from:'teacherMessage.score'},
            {name:'专业能力评分',from:'teacherMessage.ability'},
            {name:'宝贝喜爱程度评分',from:'teacherMessage.childAccept'},
            {name:'准时态度评分',from:'teacherMessage.punctualScore'},
            {name:'审核状态',from:'teacherMessage.checkType',filter:'radio/checkType'},
            {name:'官方认证',from:'teacherMessage.official',filter:'img'},
            {name:'身份证照片',from:'teacherMessage.images.idCard',filter:'img'},
            {name:'学生证照片',from:'teacherMessage.studentCard',filter:'img'},
            {name:'是否接受预定',from:'teacherMessage.isLock',filter:'bool'},
            {name:'钱包余额',from:'',filter:'money'},
            {name:'累计提款金额',from:'',filter:'money'}
        ],
};

router.beforeEach(function (transition) {
  if (transition.to.path !== '/login') {
    if (sessionStorage['token'] === undefined) {
        router.go('/login');
    } else {
        Store.token = sessionStorage['token'];
        transition.next();
    }
  } else {
    transition.next()
  }
})

router.start(App, '#app')
