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
                    href:'/order/n1',
                },{
                    name:'已预定订单',
                    href:'/order/n2',
                },{
                    name:'待执行订单',
                    href:'/order/n3',
                },{
                    name:'已修改订单',
                    href:'/order/n4',
                },{
                    name:'已完成订单',
                    href:'/order/n5',
                },{
                    name:'已取消订单',
                    href:'/order/n6',
                }]
            },{
                name: '特价推广管理',
                state: '-',
                items: [{
                    name:'特价推广执行情况',
                    href:'/order/d1',
                },{
                    name:'未审核推广',
                    href:'/order/d2',
                },{
                    name:'已上线推广',
                    href:'/order/d3',
                },{
                    name:'已下线推广',
                    href:'/order/d4',
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
                    href:'/feedback/1',
                },{
                    name:'需求消息',
                    href:'/feedback/2',
                },{
                    name:'应用消息',
                    href:'/feedback/3',
                },{
                    name:'投诉消息',
                    href:'/feedback/4',
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
                            <div v-for="item in datas">
                                <p><strong>{{header[$index].name}}</strong></p>
                                <p v-if="header[$index].filter!=='img'">{{(item=='')?'未定义':item}}</p>
                                <img v-if="this.header[$index].filter==='img'" :src="item" />
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
    template:'<tr><td><a v-for="action in actions" v-on:click="emit(action)">{{action}}</a></td><td v-for="cell in postData">{{cell}}</td></tr>',
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
        Store.modal.header = this.header;
        
        var chunk = function (array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        }
        tmpPages = chunk(this.postDatas,10);
        
        return {
            pages: tmpPages,
            currentPage:0,
            keywords: '',
        };
    },
    template: `<form class="form-inline" onSubmit="return false">
                    <div class="form-group">
                        <input type="text" class="form-control" v-model="keywords">
                    </div>
                    <button v-on:click="search" type="submit" class="btn btn-default">搜索</button>
                    <button v-on:click="export" style="float:right;" type="submit" class="btn btn-default">全部导出</button>
                </form>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead><tr><th>操作</th><th v-for="cell in header">{{cell.name}}</th></tr></thead>
                        <tbody><tr is="action-row" v-for="item in pages[currentPage]" :post-data="item" :actions="actions"></tr></tbody>
                    </table>
                </div>
                <ul class="pagination"><li v-for="page in pages" v-on:click="changePage($index)" :class="{'active':$index===currentPage}"><a>{{$index+1}}</a></li></ul>`,
    methods:{
        changePage: function(index) {
            this.currentPage = index;
        },
        export: function() {
            Store.ArrayToCSVConvertor(this.postDatas,this.header);
        },
        search: function() {
            if (this.keywords === '') {
                this.pages = chunk(this.postDatas,10);
                this.currentPage = 0;
                return ;
            } 
            
            var nPD = [];
            for(var i in this.postDatas){
                for(var j in this.postDatas[i]){
                    if(this.keywords.test(this.postDatas[i][j])){
                        nPD.push(this.postDatas[i]);
                        break;
                    }
                }
            }
            this.pages = chunk(nPD,10);
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
            for(var i=0;i!=this.form.length;i++){
                if(this.form[i].default !== this.models[i]) {
                    data = Store.setter(data,this.form[i].from,this.models[i]);
                }
            }
            tmp.token = Store.token;
            tmp.data = data;
            
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
                    window.location.reload(); 
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

//BookMark:全局
var App = Vue.extend({})
var Store = {
    rootUrl: '/Web',
    token: 'c17ce70496d47c18',
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
        if (cur === undefined) {
            return '';
        } else {
            return cur;   
        }
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
            case 'radio/user_type':
            return ['家长/家教','家长','家教'][str];
            case 'radio/gender':
            return ['女','男'][str];
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
    }
};

//route:allUser
var SectionAllUser = Vue.extend({
    data: function() { 
        var self = this;
        $.ajax({
            url:Store.rootUrl+'/User?type=0&token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                for(var i in data.data){
                    var x = data.data[i];
                    var postData = [];
                    for(var j in self.header) {
                        var str = '';
                        if (self.header[j].filter) {
                            str = Store.filter(Store.getter(x,self.header[j].from),self.header[j].filter);
                        } else {
                            str = Store.getter(x,self.header[j].from);
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
        return {
            loaded: false,
            header: [
                {name:'姓名',from:'name'},
                {name:'性别',from:'gender',filter:'radio/gender'},
                {name:'电话',from:'phone'},
                {name:'密码',from:'password'},
                {name:'头像',from:'avatar',filter:'img'},
                {name:'用户类型',from:'type',filter:'radio/user_type'},
                {name:'孩子就读年级',from:'parentMessage.childGrade'},
                
            ],
            postDatas: [],
            actions: ['查看']
        };
    },
    template: `<ol class="breadcrumb"><li>用户管理</li><li>所有用户信息</li></ol>
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

//启动
var router = new VueRouter()
router.map({
    '/allUser': {
        component: SectionAllUser
    },
    '/sendMessage': {
        component: SectionSendMessage
    },
    '/onlineParams': {
        component: SectionOnlineParams
    },
})

router.start(App, '#app')
