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
                },{
                    name:'订单数查询',
                    href:'/orderStatic'
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
                },{
                    name: '会员活动预定情况',
                    href: '/VipEventBook',
                }]
            },{
                name: '我的钱包',
                state: '-',
                items: [{
                    name: '家教流水',
                    href: '/paylist/teacher',
                },{
                    name: '家长流水',
                    href: '/paylist/parent',
                },{
                    name: '家教未处理提现',
                    href: '/withdraw/0',
                },{
                    name: '家教已处理提现',
                    href: '/withdraw/1',
                },{
                    name: '家长未处理提现',
                    href: '/withdraw/2',
                },{
                    name: '家教已处理提现',
                    href: '/withdraw/3',
                }]
            },{
                name: '反馈报告',
                state: '-',
                items: [{
                    name: '未处理报告',
                    href: '/report/0',
                },{
                    name: '已处理报告',
                    href: '/report/1',
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
                        '<div class=\"modal-body\">'+
                            '<div v-if=\"$index > 0\" v-for=\"item in datas\" class=\"bundle\" track-by=\"$index\">'+   
                                '<p class=\"left\"><strong>{{item.name}}</strong></p>'+    
                                '<p class=\"right\" v-if=\"item.type===\'text\'\" >{{item.content}}</p>'+
                                '<img class=\"right\" v-if=\"item.type===\'img\'\" :src=\"item.content\" />'+
                                '<div class=\"right\" v-if=\"item.type===\'teachPrice\'||item.type===\'singleBookTime\'||item.type===\'teachTime\'\"><p v-for=\"second_item in item.content\">{{second_item}}</p></div>'+
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
        checkWithdraw: function(id,state) {
            var tmp = {
                token: Store.token,
            };
            tmp['withdrawId'] = id;
            tmp['state'] = state;

            $.ajax({
                url: Store.rootUrl+'/Withdraw',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
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
                    alert('执行成功！');
                    location.reload();
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
            tmp['teacherId'] = id;
            tmp['checkType'] = checkType;
            
            $.ajax({
                url: Store.rootUrl+'/Teacher/Check',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        checkReport: function(id,isProfessionFinish) {            
            var tmp = {
                token: Store.token,
            };
            tmp['_id'] = id;
            tmp['isProfessionFinish'] = isProfessionFinish;
            
            $.ajax({
                url: Store.rootUrl+'/Order/Report',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        emit: function(event){
            switch(event) {
                case '重新审核':
                this.checkTeacher(this.postData[0],0);
                break;
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
                case '确认处理':
                this.checkReport(this.postData[0],1);
                break;
                case '撤回处理':
                this.checkReport(this.postData[0],0);
                break;
                case '确认提现':
                this.checkWithdraw(this.postData[0],1);
                break;
                case '撤回提现':
                this.checkWithdraw(this.postData[0],0);
                break;
                case '修改':
                Store.tmpForm = this.preData;
                router.go('/UpdateVipEvent');
                break;
                case '修改授课单价':
                Store.tmpForm = this.preData;
                router.go('/UpdateTeachPrice');
                break;
                case '查看':
                Store.modal.datas = [];
                for (var i = 0;i != Store.modal.header.length;i++) {
                    var type = '';
                    if (Store.modal.header[i].filter !== 'img' && Store.modal.header[i].filter !== 'teachPrice' && Store.modal.header[i].filter !== 'teachTime' && Store.modal.header[i].filter !== 'singleBookTime') {
                        type = 'text';
                    } else {
                        type = Store.modal.header[i].filter;
                    }

                    var content;
                    if (type === 'teachPrice' || type === 'teachTime' || type === 'singleBookTime') {
                        var arr = this.postData[i].split(';');
                        var new_arr = [];
                        for (var j=0;j!==arr.length;j++) {
                            new_arr.push(arr[j]);
                        }
                        content = new_arr;
                    } else {
                        content = this.postData[i];
                    }

                    Store.modal.datas.push({
                        type:  type,
                        content: content,
                        name: Store.modal.header[i].name,
                    });
                }
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
                    "<template v-if=\"item.filter==='number'||item.filter==='number/100'||item.filter===undefined\">\n"+
                        "<br><input class=\"form-control\" type=\"text\" v-model=\"models[$index]\"/>\n"+
                    "</template>\n"+
               "</div>\n"+                   
                "<safe-lock text=\"解锁修改按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">修改</button>\n"+
                "<span>（只改动带*号的数据）</span></safe-lock>\n"+
            "</form>",
    methods:{
        reset: function() {
            for(var i=0;i!=this.form.length;i++){
                this.form[i].default = this.models[i];
            }
        },
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

                if(this.form[i].default !== this.models[i]) {
                    var post;
                    switch(this.form[i].filter) {
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
                    if (self.isTmp) {
                        self.reset();
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
        tmp.actions = ['查看','修改授课单价'];
        if (this.$route.params['type_id'] == 'pass'){
            tmp.subtitle = '通过审核的家教';
            tmp.actions.push('重新审核');
            this.reload(3);
        } else if (this.$route.params['type_id'] == 'notpass') {
            tmp.subtitle = '没通过审核的家教';
            tmp.actions.push('重新审核');
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
            {name:'专业辅导费',from:'professionalTutorPrice',filter:'professionalTutorPrice'},
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

//route:orderStatic
var SectionOrderStatic = Vue.extend({
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
    template: '<ol class="breadcrumb"><li>订单管理</li><li>订单数查询</li></ol>'+
    "<form onSubmit=\"return false;\">\n"+
    "<div class=\"form-group\">\n"+
    "<label>家教ID</label>"+
    "<input class=\"form-control\" v-model=\"teacher_id\" type=\"text\" /></div>"+
    "<div class=\"form-group\">\n"+
    "<label>家长ID</label>"+
    "<input class=\"form-control\" v-model=\"parent_id\" type=\"text\" /></div>"+
    "<button class=\"btn btn-default\" v-on:click=\"query\">提交查询</button>\n"+
    "</form>\n"+
    "<p><strong>查询结果</strong></p>"+
    "<p>订单数：{{result.count}}</p>"+
    "<p>订单总时长：{{result.totalTime}}</p>"
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
                {name:'ID',from:'_id'},
                {name:'反馈类型',from:'type',filter:'radio/feedback'},
                {name:'反馈内容',from:'content'},
                {name:'提交时间',from:'created_at',filter:'date'},
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


//route:WithDraw
var SectionWithdraw = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
            {name:'UID',from:'_id'},
            {name:'用户ID',from:'user._id'},
            {name:'正在申请提现金额',from:'withdraw',filter:'money'},
            {name:'支付方式',from:'COMPUTED/PAYWAY'},
            {name:'最后操作时间',from:'updated_at',filter:'date'},
        ];
        tmp.actions = ['查看'];
        tmp.subtitle = ['家教未处理提现','家教已处理提现','家长未处理提现','家教已处理提现'][this.$route.params['type_id']];

        switch(this.$route.params['type_id']) {
            case '0':
                this.reload(1,0);
                tmp.actions.push('确认提现');
                break;
            case '1':
                this.reload(1,1);
                tmp.actions.push('撤回提现');
                break;
            case '2':
                this.reload(2,0);
                tmp.actions.push('确认提现');
                break;
            case '3':
                this.reload(2,1);
                tmp.actions.push('撤回提现');
                break;
        }
        return tmp;
    },
    methods: {
        reload: function(type,state) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/Withdraw?type='+type+'&state='+state+'&token='+Store.token,
                dataType: 'json'
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    var list = data.data.list;
                    Store.tmpPreDatas = list;
                    self.postDatas = [];
                    for(var i in list){
                        var x = list[i];
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
    template: '<ol class="breadcrumb"><li>我的钱包</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

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
                {name:'现金预订',from:'money',filter:'money'},
                {name:'最大人数',from:'allowCount'},
                {name:'已预约人数',from:'bookCount'},
                {name:'活动状态',from:'COMPUTED/EVENTSTATE'},
        ];
        tmp.actions = ['查看','修改'];
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

//route:Book
var SectionVipEventBook = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'UID',from:'_id'},
                {name:'预约ID',from:'_id'},
                {name:'用户类型',from:'user.type',filter:'radio/user_type'},
                {name:'支付类型',from:'payType',filter:'radio/pay_type'},
                {name:'支付时间',from:'updated_at',filter:'date'}
        ];
        this.reload();
        return tmp;
    },
    methods: {
        reload: function() {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/VipEvent/Book?token='+Store.token,
                dataType: 'json',
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    var list = data.data.list;
                    Store.tmpPreDatas = list;
                    self.postDatas = [];
                    for(var i in list){
                        var x = list[i];
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
    template: '<ol class="breadcrumb"><li>会员活动</li><li>会员活动预定情况</li></ol>'+
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
                {name:'积分预订',from:'score',default:Store.tmpForm.score.toString()},
                {name:'现金预订',from:'money',default:(Store.tmpForm.money/100).toFixed(2),filter:'number/100'},
                {name:'最大人数',from:'allowCount',default:Store.tmpForm.allowCount.toString()},
                {name:'是否接受预定',from:'isPublish',default:Store.tmpForm.isPublish,filter:'bool'},
                ]
        }
    },
    template: '<ol class="breadcrumb"><li>修改</li><li>修改会员活动</li></ol>'+
                '<div><dirty-form :form="form" api="/VipEvent/Update" :is-tmp="true"></dirty-form></div>',
})

//route:Paylist
var SectionPaylist = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.actions = [];

        if (this.$route.params['type'] == 'teacher') {
            tmp.subtitle = '家教流水';
            tmp.header = [
                {name:'UID',from:'_id'},
                {name:'家长ID',from:'order.parent._id'},
                {name:'家长姓名',from:'order.parent.name'},
                {name:'订单号',from:'order._id'},
                {name:'家教ID',from:'order.teacher._id'},
                {name:'家教姓名',from:'order.teacher.name'},
                {name:'订单完成时间（学生完成反馈）',from:'order.reportTime',filter:'date'},
                {name:'总价',from:'money',filter:'money'},
                {name:'付款时间',from:'updated_at',filter:'date'},
                {name:'单位价格',from:'order.price',filter:'money'},
                {name:'交通补贴',from:'order.subsidy',filter:'money'},
                {name:'专业辅导费',from:'order.professionalTutorPrice',filter:'professionalTutorPrice'},
                {name:'抵减优惠券',from:'order.coupon.money',filter:'money'},
                {name:'会员活动编号',from:'vipEvent'},
            ];
            this.reload(1);
        } else if (this.$route.params['type'] == 'parent') {
            tmp.subtitle = '家长流水';
            tmp.header = [
                {name:'UID',from:'_id'},
                {name:'家长ID',from:'order.parent._id'},
                {name:'家长姓名',from:'order.parent.name'},
                {name:'订单号',from:'order._id'},
                {name:'家教ID',from:'order.teacher._id'},
                {name:'家教姓名',from:'order.teacher.name'},
                {name:'订单完成时间（学生完成反馈）',from:'order.reportTime',filter:'date'},
                {name:'付款时间',from:'updated_at',filter:'date'},
                {name:'单位价格',from:'order.price',filter:'money'},
                {name:'交通补贴',from:'order.subsidy',filter:'money'},
                {name:'总价',from:'money',filter:'money'},
                {name:'会员活动编号',from:'vipEvent'},
            ];
            this.reload(2);
        }
        return tmp;
    },
    methods: {
        reload: function(type) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/Paylist?type='+type+'&token='+Store.token,
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data.list;
                    self.postDatas = [];
                    var list = data.data.list;
                    for(var i in list){
                        var x = list[i];
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

//route:Paylist
var SectionReport = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.actions = ['查看'];
        tmp.header = [
            {name:'UID',from:'_id'},
            {name:'订单号',from:'orderNumber'},
            {name:'家教ID',from:'teacher._id'},
            {name:'家教姓名',from:'teacher.name'},
            {name:'家长ID',from:'parent._id'},
            {name:'家长姓名',from:'parent.name'},
            {name:'授课科目',from:'course'},
            {name:'完成反馈时间',from:'updated_at',filter:'date'},

            {name:'上次情况-阶段',from:'thisTeachDetail.category'},
            {name:'上次情况-专业辅导科目',from:'thisTeachDetail.course'},
            {name:'上次情况-专业辅导年级',from:'thisTeachDetail.grade'},
            {name:'上次情况-针对性知识点补习/复习模拟卷',from:'thisTeachDetail.examPaper'},
            {name:'上次情况-难易程度',from:'thisTeachDetail.easyLevel'},
            {name:'上次情况-年级/一级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/0'},
            {name:'上次情况-大章节/二级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/1'},
            {name:'上次情况-小章节/三级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/2'},
            {name:'上次情况-年级/一级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/3'},
            {name:'上次情况-大章节/二级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/4'},
            {name:'上次情况-小章节/三级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/5'},
            {name:'上次情况-年级/一级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/6'},
            {name:'上次情况-大章节/二级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/7'},
            {name:'上次情况-小章节/三级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/8'},

            {name:'下次情况-阶段',from:'nextTeachDetail.category'},
            {name:'下次情况-专业辅导科目',from:'nextTeachDetail.course'},
            {name:'下次情况-专业辅导年级',from:'nextTeachDetail.grade'},
            {name:'下次情况-针对性知识点补习/复习模拟卷',from:'nextTeachDetail.examPaper'},
            {name:'下次情况-难易程度',from:'nextTeachDetail.easyLevel'},
            {name:'下次情况-年级/一级知识点1',from:'nextTeachDetail.knowledge',filter:'knowledge/0'},
            {name:'下次情况-大章节/二级知识点1',from:'nextTeachDetail.knowledge',filter:'knowledge/1'},
            {name:'下次情况-小章节/三级知识点1',from:'nextTeachDetail.knowledge',filter:'knowledge/2'},
            {name:'下次情况-年级/一级知识点2',from:'nextTeachDetail.knowledge',filter:'knowledge/3'},
            {name:'下次情况-大章节/二级知识点2',from:'nextTeachDetail.knowledge',filter:'knowledge/4'},
            {name:'下次情况-小章节/三级知识点2',from:'nextTeachDetail.knowledge',filter:'knowledge/5'},
            {name:'下次情况-年级/一级知识点3',from:'nextTeachDetail.knowledge',filter:'knowledge/6'},
            {name:'下次情况-大章节/二级知识点3',from:'nextTeachDetail.knowledge',filter:'knowledge/7'},
            {name:'下次情况-小章节/三级知识点3',from:'nextTeachDetail.knowledge',filter:'knowledge/8'},
        ];
        
        if (this.$route.params['type_id'] === '0') {
            tmp.actions.push('确认处理');
        } else if (this.$route.params['type_id'] === '1'){
            tmp.actions.push('撤回处理');
        }
        tmp.subtitle = ['已处理报告','未处理报告'][this.$route.params['type_id']];
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            var self = this;
            $.ajax({
                url:Store.rootUrl+'/Order/Report?state='+type+'&token='+Store.token,
            }).done(function(data, status, jqXHR){
                if(data.result=="success"){
                    Store.tmpPreDatas = data.data;
                    self.postDatas = [];
                    var list = data.data;
                    for(var i in list){
                        var x = list[i];
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
    template: '<ol class="breadcrumb"><li>反馈报告</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})

var SectionUpdateTeachPrice = Vue.extend({
    data:function() {
        var tp = Store.tmpForm.teachPrice;
        var tmp = {
            form: [],
            teacher_name: Store.tmpForm.name,
            teacher_id: Store.tmpForm._id
        };
        for (var i = 0; i != tp.length; i++) {
            var addPrice = tp[i].addPrice===undefined?0:tp[i].addPrice;
            tmp.form.push({
                price: ((tp[i].price+addPrice)/100).toFixed(2) + '元',
                name: tp[i].course+' '+tp[i].grade,
                id: tp[i]._id,
                vm: '',
            });
        }
        return tmp;
    },
    template:'<ol class="breadcrumb"><li>家教姓名：{{teacher_name}}</li><li>家教ID：{{teacher_id}}</li><li>修改课程单价</li></ol>'+
    "<form onSubmit=\"return false;\">\n"+
                "<div class=\"form-group\" v-for=\"item in form\">\n"+
                    "<label>{{item.name + ' ' + item.price}}</label>\n"+
                    "<input style=\"margin: 0 20px;\" type=\"text\" v-model=\"item.vm\">"+
                    "<button class=\"btn btn-default\" v-on:click=\"submit(item)\">修改</button>\n"+
               "</div>\n"+                   
            "</form>",
    methods:{
        reset: function() {
            
        },
        submit: function(item) {
            var new_price = item.vm;
            if (new_price === '' || isNaN(new_price)) {
                return;
            }

            if (!confirm('确定要修改单价?')) {
                return;
            }

            submitObj = {};
            
            submitObj._id = item.id;
            submitObj.price = parseInt(new_price*100);
            submitObj.token=Store.token;

            $.ajax({
                url: Store.rootUrl+'/CoursePrice',
                dataType: 'json',
                data:JSON.stringify(submitObj),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    console.log(new_price);
                    item.price = parseFloat(new_price).toFixed(2) + '元';
                    alert('执行成功！');
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        }
    }
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
            '/UpdateTeachPrice': {
                component: SectionUpdateTeachPrice,
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
            },
            '/VipEventBook': {
                component: SectionVipEventBook,
            },
            '/paylist/:type': {
                component: SectionPaylist,
            },
            '/report/:type_id': {
                component: SectionReport,
            },
            '/withdraw/:type_id': {
                component: SectionWithdraw,
            },
            '/orderStatic': {
                component: SectionOrderStatic,
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
    },
    tmpForm: null,
    safeLockPsw: 'jiajiaoyi',
    getter: function(data,key) {
        switch (key) {
            case 'COMPUTED/SUM':
                var price = data.price;
                var time = data.time;
                var addPrice = data.addPrice===undefined?0:data.addPrice;
                var professionalTutorPrice = data.professionalTutorPrice===undefined?0:data.professionalTutorPrice;
                var subsidy = data.subsidy===undefined?0:data.subsidy;
                var coupon_money = 0;
                if (data.coupon !== undefined) {
                    if (data.coupon.money !== undefined) {
                        coupon_money = data.coupon.money;
                    }
                }
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
                    return '';
                } else {
                    return data.parentMessage.bookCount;
                }
            case 'COMPUTED/ORDERTIME':
                if (data.teacherMessage !== undefined) {
                    return data.teacherMessage.teachTime;
                } else {
                    return data.parentMessage.finishCourseTime;
                }
            case 'COMPUTED/PAYWAY':
                if (data.way === undefined) {
                    return '';
                }

                if (data.way.ali !== undefined) {
                    return '支付宝账号：'+data.way.ali;
                } else if (data.way.wechat !== undefined) {
                    return '微信账号：'+data.way.wechat;
                } else {
                    return '银行：'+data.way.bank.name+' 银行卡号：'+data.way.bank.account;
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
            case 'professionalTutorPrice':
            if (str === -1) {
                return '无';
            } else {
                return (str/100).toFixed(2) + ' 元';
            }
            case 'knowledge/0':
            console.log(str);
            if (str) {return str[0];} else {return '';}
            case 'knowledge/1':
            if (str) {return str[1];} else {return '';}
            case 'knowledge/2':
            if (str) {return str[2];} else {return '';}
            case 'knowledge/3':
            if (str) {return str[3];} else {return '';}
            case 'knowledge/4':
            if (str) {return str[4];} else {return '';}
            case 'knowledge/5':
            if (str) {return str[5];} else {return '';}
            case 'knowledge/6':
            if (str) {return str[6];} else {return '';}
            case 'knowledge/7':
            if (str) {return str[7];} else {return '';}
            case 'knowledge/8':
            if (str) {return str[8];} else {return '';}
            case 'singleBookTime':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var daytime = [];
                if (str[i].morning) {
                    daytime.push('上午');
                }
                if (str[i].afternoon) {
                    daytime.push('下午');
                }
                if (str[i].evening) {
                    daytime.push('晚上');
                }

                new_str.push(str[i].date+' '+daytime.join('/')+' '+(str[i].isOk?'接受预定':'不接受预定')+(str[i].memo.length>0?' 备注：'+str[i].memo:""));
            }
            return new_str.join(';');
            case 'teachPrice':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var addPrice = str[i].addPrice===undefined?0:str[i].addPrice;
                new_str.push(str[i].course+' '+str[i].grade+' '+((str[i].price+addPrice)/100).toFixed(2)+'元');
            }
            return new_str.join(';');
            case 'teachTime':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var daytime = [];
                if (str[i].morning) {
                    daytime.push('上午');
                }
                if (str[i].afternoon) {
                    daytime.push('下午');
                }
                if (str[i].evening) {
                    daytime.push('晚上');
                }

                new_str.push(['周日','周一','周二','周三','周四','周五','周六'][str[i].weekDay]+' '+daytime.join('/')+' '+(str[i].isOk?'接受预定':'不接受预定'));
            }
            return new_str.join(';');
            case 'age':
            return str + ' 岁';
            case 'min':
            return str + ' 分钟';
            case 'score':
            return str.toFixed(1);
            case 'money':
            return (str/100).toFixed(2) + ' 元';
            case 'bool':
            return str?'是':'否';
            case 'bool/reverse':
            return str?'否':'是';
            case 'bool/discount':
            return str === 1?'是':'否';
            case 'radio/pay_type':
            return ['余额支付','支付宝支付','微信支付','积分支付'][str];
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
            return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
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
            {name:'用户积分',from:'COMPUTED/SCORE'},
            {name:'已完成订单数量',from:'COMPUTED/ORDERCOUNT'},
            {name:'已完成订单时间',from:'COMPUTED/ORDERTIME',filter:'min'},
            {name:'宝贝性别',from:'parentMessage.childGender',filter:'age'},
            {name:'宝贝年龄',from:'parentMessage.childAge',filter:'age'},
            {name:'宝贝年级',from:'parentMessage.childGrade'},
            {name:'家教学校',from:'teacherMessage.school'},
            {name:'不良记录',from:'teacherMessage.badRecord'},
            {name:'最小课程时间',from:'teacherMessage.minCourseTime',filter:'min'},
            {name:'免费交通区间',from:'teacherMessage.freeTrafficTime',filter:'min'},
            {name:'最远交通区间',from:'teacherMessage.maxTrafficTime',filter:'min'},
            {name:'交通补贴',from:'teacherMessage.subsidy',filter:'money'},
            {name:'教过孩子数量',from:'teacherMessage.teachCount'},
            {name:'已授课时间',from:'teacherMessage.hadTeach'},
            {name:'综合评分',from:'teacherMessage.score',filter:'score'},
            {name:'专业能力评分',from:'teacherMessage.ability',filter:'score'},
            {name:'宝贝喜爱程度评分',from:'teacherMessage.childAccept',filter:'score'},
            {name:'准时态度评分',from:'teacherMessage.punctualScore',filter:'score'},
            {name:'审核状态',from:'teacherMessage.checkType',filter:'radio/checkType'},
            {name:'官方认证',from:'teacherMessage.images.official',filter:'img'},
            {name:'身份证照片',from:'teacherMessage.images.idCard',filter:'img'},
            {name:'学生证照片',from:'teacherMessage.images.studentCard',filter:'img'},
            {name:'是否接受预定',from:'teacherMessage.isLock',filter:'bool/reverse'},
            {name:'家教可授课情况',from:'teachPrice',filter:'teachPrice'},
            {name:'家教可授课时间',from:'teacherMessage.multiBookTime',filter:'teachTime'},
            {name:'单次预约时间及备注',from:'teacherMessage.singleBookTime',filter:'singleBookTime'},
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
