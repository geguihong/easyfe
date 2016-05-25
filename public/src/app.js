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
                    name:'已审核家教信息',
                    href:'/teacher/checked',
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
                }]
            }]
        }
    },
    template: `<div v-for="nav in navs">
                    <h4 v-on:click="toggle($index)">{{nav.name}} <span>{{nav.state}}</span></h4>
                    <ul class="nav nav-sidebar" :class="{hidden:nav.state == '+'}">
                        <li v-for="item in nav.items" v-link="{path:item.href,activeClass:'active'}"><a>{{item.name}}</a></li>
                    </ul>
                </div>`,
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
    template:`<div class="modal fade" id="app-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">详情</h4>
                        </div>
                        <div class="modal-body">
                            <div v-for="item in datas" class="bundle" track-by="$index">
                                <p class="left"><strong>{{header[$index].name}}</strong></p>
                                <p class="right" v-if="header[$index].filter!=='img'">{{item}}</p>
                                <img class="right" v-if="header[$index].filter==='img'" :src="item" />
                            </div>   
                        </div>
                    </div>
                </div>
            </div>`,
});
Vue.component('modal', Modal);

//Bookmark:动作行
var ActionRow = Vue.extend({
    props:['postData','actions'],
    template:'<tr><td><a v-for="action in actions" v-on:click="emit(action)">{{action}}</a></td><td v-for="cell in postData" track-by="$index">{{cell}}</td></tr>',
    methods:{
        emit: function(event){
            switch(event) {
                case '审核':
                break;
                case '上线':
                break;
                case '下线':
                break;
                case '查看':
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
        tmpPages = this.chunk(this.postDatas,10);
        
        return {
            pages: tmpPages,
            currentPage:0,
            keyword: '',
        };
    },
    template: `<form class="form-inline" onSubmit="return false">
                    <div class="form-group">
                        <input type="text" class="form-control" v-model="keyword">
                    </div>
                    <button v-on:click="search()" type="submit" class="btn btn-default">搜索</button>
                    <button v-on:click="exportTable()" style="float:right;" type="submit" class="btn btn-default">全部导出</button>
                </form>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead><tr><th>操作</th><th v-for="cell in header">{{cell.name}}</th></tr></thead>
                        <tbody><tr is="action-row" v-for="item in pages[currentPage]" :post-data="item" :actions="actions"></tr></tbody>
                    </table>
                </div>
                <ul class="pagination"><li v-for="page in pages" v-on:click="changePage($index)" :class="{'active':$index===currentPage}"><a>{{$index+1}}</a></li></ul>`,
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
                this.pages = this.chunk(this.postDatas,10);
                this.currentPage = 0;
                return ;
            } 
            
            var nPD = [];
            for(var i in this.postDatas){
                for(var j in this.postDatas[i]){
                    if((this.postDatas[i][j]).toString().indexOf(this.keyword) >= 0){
                        nPD.push(this.postDatas[i]);
                        break;
                    }
                }
            }
            this.pages = this.chunk(nPD,10);
            this.currentPage = 0;
        }
    }
});
Vue.component('pagination-table',PaginationTable);

//BookMark:脏检查表单
var DirtyForm = Vue.extend({
    props:['form','api'],
    data:function() {
        var tmp = {models:[],submitLock:false};
        for(var i=0;i!=this.form.length;i++){
            tmp.models.push(this.form[i].default);
        }
        return tmp;
    },
    template:`<form onSubmit="return false;">
                    <div class="form-group" v-for="item in form">
                        <label>{{item.name}}</label><span :class="{hidden:(models[$index]===item.default)}">*</span>
                        <template v-if="item.filter===undefined">
                            <br><input class="form-control" type="text" v-model="models[$index]"/>
                        </template>
                        <template v-if="item.filter==='textarea'">
                            <textarea class="form-control" rows="3" v-model="models[$index]"></textarea>
                        </template>
                    </div>
                    <button class="btn btn-default" v-on:click="submit" :disabled="submitLock">修改</button>
                    <span>（只改动带*号的数据）</span>
                </form>`,
    methods:{
        submit: function() {
            var tmp={};
            var data={};
            var modified = false;
            for(var i=0;i!=this.form.length;i++){
                if(this.form[i].default !== this.models[i]) {
                    data = Store.setter(data,this.form[i].from,this.models[i]);
                    modified = true;
                }
            }
            tmp.token = Store.token;
            tmp.data = data;
            
            if (!modified) {
                return;
            }
            
            var self = this;
            $.ajax({
                url: Store.rootUrl+self.api,
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
    template:`<div class="container-fluid">
                <div class="row">
                    <!-- 侧边导航 -->
                    <div class="col-xs-2 sidebar">
                        <side-bar></side-bar>
                    </div>

                    <div class="col-xs-10 col-xs-offset-2 main">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
            
            <modal></modal>`
})

//route:login
var PageLogin = Vue.extend({
    data: function() {
        return {
            account: '',
            password: '',
        }
    },
    methods:{
        submit: function() {
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
    template: `<div class="container">
                    <form class="form-signin" onsubmit="return false;">
                        <h2 class="form-signin-heading">请登录</h2>
                        <label class="sr-only" for="inputEmail">管理员账号</label>
                        <input v-model="account" class="form-control" id="inputEmail" autofocus="" required="" type="text" placeholder="请输入账号...">
                        <label class="sr-only" for="inputPassword">密码</label>
                        <input v-model="password" class="form-control" id="inputPassword" required="" type="password" placeholder="请输入密码...">
                        <button class="btn btn-lg btn-primary btn-block" type="submit" v-on:click="submit()">登陆</button>
                    </form>
                </div>`,
})

//route:allUser
var SectionAllUser = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[1],Store.userHeader[2]);
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
    template: `<ol class="breadcrumb"><li>用户管理</li><li>所有用户信息</li></ol>
                <div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>`
})

//route:parent
var SectionParent = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[1]);
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
    template: `<ol class="breadcrumb"><li>用户管理</li><li>家长信息</li></ol>
                <div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>`
})

//route:sendMessage
var SectionSendMessage = Vue.extend({
    data: function() {
        Store.modalData= '1';
        return {
            type: '1',
            content: '默认消息',
            submitLock: false,
        }
    },
    template: `<ol class="breadcrumb"><li>消息中心</li><li>发送消息</li></ol>
                <div>
                    <form onSubmit="return false;">
                        <div class="form-group">
                            <label>发送内容</label><textarea class="form-control" rows="3" v-model="content"></textarea>
                        </div>
                        <div class="form-group">
                            <label>发送对象</label><br />
                            <label class="radio-inline"><input v-model="type" type="radio" value="1" />家教</label>
                            <label class="radio-inline"><input v-model="type" type="radio" value="2" />家长</label>
                            <label class="radio-inline"><input v-model="type" type="radio" value="3" />全部</label>
                        </div>
                        <button class="btn btn-default" v-on:click="submit" :disabled="submitLock">提交消息</button>
                    </form>
                </div>`,
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

//route:feedback
var SectionFeedback = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'反馈类型',from:'type',filter:'radio/feedback'},
                {name:'反馈内容',from:'content'},
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
    template: `<ol class="breadcrumb"><li>消息中心</li><li>{{subtitle}}</li></ol>
                <div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>`
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
            {name:'年级',from:'grade'},
            {name:'课程类型',from:'course'},
            {name:'课程时长',from:'time',filter:'min'},
            {name:'价格',from:'price',filter:'money'},
            {name:'交通补贴',from:'subsidy',filter:'money'},
            {name:'孩子年龄',from:'childAge',filter:'age'},
            {name:'孩子性别',from:'childGender',filter:'radio/gender'},
            {name:'订单类型',from:'type'},
            {name:'订单状态',from:'state',filter:'radio/order_state'},
            {name:'标签',from:'tag'},
            {name:'订单号',from:'orderNumber'},
            {name:'取消者',from:'cancelPerson',filter:'radio/cancelPerson'},
            {name:'是否显示',from:'isShow',filter:'bool'},
            {name:'是否已上线',from:'hadPublish',filter:'bool'},
            {name:'是否有评论',from:'hadComment',filter:'bool'},
            {name:'授课日期',from:'teachTime.date'},
            {name:'授课时段',from:'teachTime.time',filter:'radio/timeArea'},
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
            break;
            
            case 'd2':
            url = '/Order/Discount?type=1';
            tmp.subtitle = '已上线推广';
            break;
            
            case 'd3':
            url = '/Order/Discount?type=2';
            tmp.subtitle = '已下线推广';
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
    template: `<ol class="breadcrumb"><li>{{maintitle}}</li><li>{{subtitle}}</li></ol>
                <div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>`
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
    template: `<ol class="breadcrumb"><li>在线参数</li><li>修改在线参数</li></ol>
                <div><dirty-form v-if="loaded" :form="form" api="/OnlineParams"></dirty-form></div>`,
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
    getter: function(data,key) {
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
            return str + ' 元';
            case 'bool':
            return str?'是':'否';
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
        [
                {name:'姓名',from:'name'},
                {name:'性别',from:'gender',filter:'radio/gender'},
                {name:'电话',from:'phone'},
                {name:'密码',from:'password'},
                {name:'头像',from:'avatar',filter:'img'},
                {name:'生日',from:'birthday',filter:'date'},
                {name:'用户类型',from:'type',filter:'radio/user_type'},
                {name:'地址',from:'position.address'},
                {name:'所在城市',from:'position.city'}
        ],[
                {name:'孩子就读年级',from:'parentMessage.childGrade'},
                {name:'孩子年龄',from:'parentMessage.childAge',filter:'age'},
                {name:'家长参与订单数量',from:'parentMessage.bookCount'},
                {name:'家长评分',from:'parentMessage.score'},
                {name:'家长参与课程时间总计',from:'parentMesage.finishCourseTime'}
        ],[
                {name:'身份证号码',from:'teacherMessage.idCard'},
                {name:'华南理工大学',from:'teacherMessage.school'},
                {name:'专业',from:'teacherMessage.profession'},
                {name:'授课经验（用户设定）',from:'teacherMessage.hadTeach'},
                {name:'授课次数',from:'teacherMessage.teachCount'},
                {name:'最短课程时间',from:'teacherMessage.minCourseTime',filter:'min'},
                {name:'免费交通区间',from:'teacherMessage.freeTrafficTime',filter:'min'},
                {name:'最大交通区间',from:'teacherMessage.maxTrafficTime',filter:'min'},
                {name:'交通补贴',from:'teacherMessage.subsidy',filter:'money'},
                {name:'简介',from:'teacherMessage.profile'},
                {name:'综合评分',from:'teacherMessage.score'},
                {name:'专业能力评分',from:'teacherMessage.ability'},
                {name:'孩子喜欢程度评分',from:'teacherMessage.childAccept'},
                {name:'准时态度评分',from:'teacherMessage.punctualScore'},
                {name:'评论数',from:'teacherMessage.commentCount'},
                {name:'折扣区间',from:'teacherMessage.disCountTime',filter:'min'},
                {name:'已授课时间',from:'teacherMessage.teachTime',filter:'min'},
                {name:'是否锁定',from:'teacherMessage.isLock',filter:'bool'},
                {name:'是否审核',from:'teacherMessage.isCheck',filter:'bool'},
                {name:'身份证照片',from:'teacherMessage.images.idCard',filter:'img'},
                {name:'学生证照片',from:'teacherMessage.studentCard',filter:'img'},
                {name:'官方认证照片',from:'teacherMessage.official',filter:'img'}
        ]
     ]
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
