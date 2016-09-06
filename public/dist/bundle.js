function clone(arr) {
    var b=[]; 
    for(var i=0,l=arr.length;i<l;i++){
        b.push(arr[i]);
    }
    return b;
}

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

var Store = {
    // api 相关
    rootUrl: '/Web', 
    token: '',
    safeLockPsw: 'jiajiaoyi',

    // 与模态框有关
    modal: {
        close: true,
        view: '',
        obj: undefined,
        closeFn: undefined
    },
    showModal: function(text,obj,fn) {
        this.modal.close = false;
        this.modal.view = text;
        this.modal.obj = obj;
        this.modal.closeFn = fn;
    },
    closeModal: function(result) {
        this.modal.close = true;
        this.modal.view = '';
        this.modal.obj = undefined;
        this.modal.closeFn = undefined;
    },

    // 数据预处理
    getter: function(data,key) {
        switch (key) {
            case 'COMPUTED/ORDERSTATE':
            if (data.state === undefined) {
                return undefined;
            }

            var first = ['已预订','待执行','已修改','已完成','已失效'][data.state];
            var second = '';
            switch(first) {
                case '待执行':
                if (data.isTeacherReport) {
                    second = '(家教完成课程并反馈)';
                } else {
                    second = '(家教未完成课程并反馈)';
                }
                break;
                case '已完成':
                if (data.hadComment) {
                    second = '(家长已评价)';
                } else {
                    second = '(家长未评价)';
                }
                break;
                case '已修改':
                second = '(来自'+['已预订','待执行'][data.modifyOriginOrderState]+')';
                break;
            }
            return first + second;
            case 'COMPUTED/EVENTBOOKPAY':
            if (data.vipEvent === undefined) {
                return undefined;
            }
            if (data.payType === 3) {
                return -data.vipEvent.score+ ' 积分';
            } else {
                return -(data.vipEvent.money/100).toFixed(2) + ' 元';
            }
            case 'COMPUTED/SUM':
                var price = data.price;
                var time = data.time;
                var addPrice = data.addPrice===undefined?0:data.addPrice;
                var professionalTutorPrice = data.professionalTutorPrice===undefined||data.professionalTutorPrice===-1?0:data.professionalTutorPrice;
                var subsidy = data.subsidy===undefined?0:data.subsidy;
                var coupon_money = 0;
                if (data.coupon !== undefined) {
                    if (data.coupon.money !== undefined) {
                        coupon_money = data.coupon.money;
                    }
                }
                var sum = (price + addPrice + professionalTutorPrice) * (time/60) + subsidy - coupon_money;
                if (sum < 0) {
                    sum = 0;
                }
                return sum;
            case 'COMPUTED/SCORE':
                if (data.teacherMessage !== undefined) {
                    return data.teacherMessage.teachScore;
                } else if (data.parentMessage !== undefined){
                    return data.parentMessage.score;
                } else {
                    return undefined;
                }
            case 'COMPUTED/EVENTSTATE':
                if( data.isPublish ) {
                    if (data.bookCount < data.allowCount) {
                        return '接受预订/未订满';
                    } else {
                        return '接受预订/已订满';
                    }
                } else {
                    return '已下线';
                }
            case 'COMPUTED/ORDERCOUNT':
                if (data.teacherMessage !== undefined) {
                    return data.finishOrderCount;
                } else if (data.parentMessage !== undefined) {
                    return data.parentMessage.bookCount;
                } else {
                    return undefined;
                }
            case 'COMPUTED/ORDERTIME':
                if (data.teacherMessage !== undefined) {
                    return data.teacherMessage.teachTime;
                } else if (data.parentMessage !== undefined) {
                    return data.parentMessage.finishCourseTime;
                } else {
                    return undefined;
                }
            case 'COMPUTED/PAYMONEY-PARENT':
                return -data.money;
            case 'COMPUTED/PAYMONEY-TEACHER':
                if (data.buy === 0) {
                    return data.money;
                } else {
                    return -data.money;
                }
        }

        var arr = key.split('.');
        var cur = data;
        for(var i=0;i!==arr.length;i++){
            cur = cur[arr[i]];
            if(cur === undefined||cur === null){
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
            case 'withdraw_way':
            if (str.ali !== undefined) {
                return '支付宝账号：'+str.ali;
            } else if (str.wechat !== undefined) {
                return '微信账号：'+str.wechat;
            } else {
                return '银行：'+str.bank.name+' 银行卡号：'+str.bank.account;
            }
            break;

            case 'reportTeachTime':
            var timeStr = '';
            if (str.time === 'morning') {
                timeStr = '上午';
            } else if (str.time === 'afternoon') {
                timeStr = '下午';
            } else {
                timeStr = '晚上';
            }
            return str.date + ' ' + timeStr;

            case 'professionalTutorPrice':
            if (str === -1) {
                return '0.00';
            } else {
                return (str/100).toFixed(2);
            }

            case 'knowledge/0':
            if (str&&str[0]) {return str[0];} else {return '';}
            case 'knowledge/1':
            if (str&&str[1]) {return str[1];} else {return '';}
            case 'knowledge/2':
            if (str&&str[2]) {return str[2];} else {return '';}
            case 'knowledge/3':
            if (str&&str[3]) {return str[3];} else {return '';}
            case 'knowledge/4':
            if (str&&str[4]) {return str[4];} else {return '';}
            case 'knowledge/5':
            if (str&&str[5]) {return str[5];} else {return '';}
            case 'knowledge/6':
            if (str&&str[6]) {return str[6];} else {return '';}
            case 'knowledge/7':
            if (str&&str[7]) {return str[7];} else {return '';}
            case 'knowledge/8':
            if (str&&str[8]) {return str[8];} else {return '';}

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

                new_str.push(str[i].date+' '+daytime.join('/')+' '+(str[i].isOk?'接受预订':'不接受预订')+(str[i].memo.length>0?' 备注：'+str[i].memo:""));
            }
            return new_str.join(';');

            case 'teachPrice':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var originalPrice = (str[i].price/100).toFixed(2); 
                var addPrice = str[i].addPrice===0?'':'(+'+((str[i].addPrice)/100).toFixed(2)+')';
                new_str.push(str[i].course+' '+str[i].grade+' '+originalPrice+addPrice+' 元');
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

                new_str.push(['周日','周一','周二','周三','周四','周五','周六'][str[i].weekDay]+' '+daytime.join('/')+' '+(str[i].isOk?'接受预订':'不接受预订'));
            }
            return new_str.join(';');

            case 'age':
            return str + ' 岁';
            case 'min':
            return str + ' 分钟';
            case 'score':
            return str.toFixed(1);
            case 'money':
            return (str/100).toFixed(2);
            case 'bool':
            return str?'是':'否';
            case 'bool/reverse':
            return str?'否':'是';
            case 'bool/discount':
            return str === 1?'是':'否';
            case 'radio/paylist_type':
            return ['订单','会员活动','充值','提现','特价推广奖励','邀请奖励'][str];
            case 'radio/pay_type':
            return ['余额支付','支付宝支付','微信支付','积分支付'][str];
            case 'radio/checkType':
            return ['未审核','通过','不通过'][str];
            case 'radio/order_type':
            return ['单次预约','特价订单','多次预约'][str];
            case 'radio/user_type':
            return ['','家教','家长'][str];
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

            case 'radio/teach_way':
            return ['','针对性知识点补习','复习模拟卷'][str];

            case 'date':
            var date = new Date(str);
            return date.Format("yyyy-MM-dd hh:mm:ss");

            case 'onlydate':
            var date = new Date(str);
            return date.Format("yyyy-MM-dd");

            default:
            return str;
        }
    },

    // 用户表格头部信息
    userHeader:[[
            {name:'用户ID',from:'_id'},
            {name:'用户编号',from:'userNumber'},
            {name:'是否冻结',from:'canUse',filter:'bool/reverse'},
            {name:'姓名',from:'name'},
            {name:'性别',from:'gender',filter:'radio/gender'},
            {name:'生日',from:'birthday',filter:'onlydate'},
            {name:'手机',from:'phone',stopAuto:true},
            {name:'身份证号',from:'teacherMessage.idCard',stopAuto:true},
            {name:'家庭地址',from:'position.address'},
            {name:'用户类型',from:'type',filter:'radio/user_type'},
            {name:'用户等级',from:'level'},
            {name:'用户积分',from:'COMPUTED/SCORE'},
            {name:'不良记录',from:'badRecord'},
            {name:'已完成订单数量',from:'COMPUTED/ORDERCOUNT'},
            {name:'已完成订单时间',from:'COMPUTED/ORDERTIME',filter:'min'},
    ],[
            {name:'宝贝性别',from:'parentMessage.childGender',filter:'radio/gender'},
            {name:'宝贝年龄',from:'parentMessage.childAge',filter:'age'},
            {name:'宝贝年级',from:'parentMessage.childGrade'},
    ],[
            {name:'家教专业',from:'teacherMessage.profession'},
            {name:'家教学校',from:'teacherMessage.school'},
            {name:'家教年级',from:'teacherMessage.grade'},
            {name:'最小课程时间',from:'teacherMessage.minCourseTime',filter:'min'},
            {name:'免费交通区间',from:'teacherMessage.freeTrafficTime',filter:'min'},
            {name:'最远交通区间',from:'teacherMessage.maxTrafficTime',filter:'min'},
            {name:'交通补贴',from:'teacherMessage.subsidy',filter:'money'},
            {name:'教过孩子数量',from:'teacherMessage.teachCount'},
            {name:'已授课时间',from:'teacherMessage.hadTeach'},
            {name:'简介',from:'teacherMessage.profile'},
            {name:'综合评分',from:'teacherMessage.score',filter:'score'},
            {name:'专业能力评分',from:'teacherMessage.ability',filter:'score'},
            {name:'宝贝喜爱程度评分',from:'teacherMessage.childAccept',filter:'score'},
            {name:'准时态度评分',from:'teacherMessage.punctualScore',filter:'score'},
            {name:'是否已审核',from:'teacherMessage.checkType',filter:'radio/checkType'},
            {name:'官方认证',from:'teacherMessage.images.official',filter:'img'},
            {name:'身份证照片',from:'teacherMessage.images.idCard',filter:'img'},
            {name:'学生证照片',from:'teacherMessage.images.studentCard',filter:'img'},
            {name:'是否接受预订',from:'teacherMessage.isLock',filter:'bool/reverse'},
            {name:'家教可授课列表',from:'teachPrice',filter:'teachPrice',isArray:true},
            {name:'多次预约时间',from:'teacherMessage.multiBookTime',filter:'teachTime',isArray:true},
            {name:'单次预约时间及备注',from:'teacherMessage.singleBookTime',filter:'singleBookTime',isArray:true},
    ]],

    // 表格数据获取的 api
    commonGet: function(url,self,isReturnList,divide) {
        $.ajax({
            url:Store.rootUrl+url+'&token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                // 列表可能位于list或data里面
                var list = [];
                if (isReturnList) {
                    list = data.data.list;
                } else {
                    list = data.data;
                }

                self.list = [];
                if (divide === undefined) {
                    for(var i in list){
                        self.list.push(list[i]);
                    }
                } else {
                    for(var i in list){
                        var src = list[i][divide];
                        list[i][divide] = undefined;
                        for(var j=0;j!==src.length;j++) {
                            var copy = $.extend({},list[i],true);
                            copy[divide] = src[j];
                            self.list.push(copy);
                        }
                    }
                }

                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
    },

    // 对象转数组
    objToArray: function(header,obj) {
        var arr = [];

        for(var j in header) {
            var str = this.getter(obj,header[j].from);
            if (str !== undefined) {
                if (header[j].filter) {
                    str = this.filter(str,header[j].filter);
                }
            } else {
                str = '';
            }
            arr.push(str);
        }

        return arr;
    }
};

//Bookmark:动作行
var ActionRow = Vue.extend({
    props:['header','preData','actions'],
    data: function() {
        var tmp = {};
        tmp.postData = this.getArray(this.preData);
        return tmp;
    },
    template:'<tr>'+
                '<td style="max-width:none;overflow:visible;" class="dropup">'+
                    '<template v-for="action in actions">'+
                        '<button v-if="action.type===\'normal\'" v-on:click="emit(action)" class="btn btn-primary" style="margin-right:10px;">{{action.tag}}</button>'+
                        '<div style="display:inline-block;width:auto;margin-right: 10px;" class="input-group-btn" v-if="action.type===\'toggle\'">'+
                            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">{{action.map[pre(action.related)]}}<span class="caret"></span></button>'+
                                '<ul class="dropdown-menu">'+
                                    '<li v-for="(index,item) in action.arr" v-on:click="select(action,index)" track-by="$index"><a>{{item.tag}}</a></li>'+
                                '</ul>'+
                        '</div>'+
                        '<button v-if="action.type===\'oneway\'&&!preData.state" v-on:click="emit(action)" class="btn btn-primary" style="margin-right:10px;">{{action.tag}}</button>'+
                    '</template>'+
                '</td>'+
                '<td title="{{cell}}" v-for="cell in postData" track-by="$index">{{cell}}</td></tr>',
    methods:{
        pre: function(key) {
            return Store.getter(this.preData,key);
        },
        getArray: function(obj) {
            return Store.objToArray(this.header,obj);
        },
        select: function(action,index) {
            var newVal = action.arr[index].val;
            if (newVal === Store.getter(this.preData,action.related)) {
                return;
            }

            var tmp = {
                token: Store.token,
            };
            var api;
            switch(action.module) {
                case 'user':
                api = '/blacklist';
                tmp['_id'] = this.preData._id;
                tmp['canUse'] = newVal;
                break;

                case 'teacher':
                api = '/Teacher/Check';
                tmp['teacherId'] = this.preData._id;
                tmp['checkType'] = newVal;
                break;

                case 'order':
                api = '/Order/Discount/Check';
                tmp['orderId'] = this.preData._id;
                tmp['isShow'] = newVal;
                break;

                case 'report':
                api = '/Order/Report';
                tmp['_id'] = this.preData._id;
                tmp['isProfessionFinish'] = newVal;

            }

            var self = this;
            $.ajax({
                url: Store.rootUrl+api,
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    // 修改 preData 并且重置 postData
                    var patch = Store.setter({},action.related,newVal);
                    $.extend(self.preData,patch);
                    
                    self.postData = self.getArray(self.preData);
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        emit: function(event){
            switch(event.tag) {
                case '确认提现':
                var tmp = {
                    token: Store.token,
                    withdrawId: this.preData._id,
                    state: 1
                };
                var self = this;
                $.ajax({
                    url: Store.rootUrl+'/Withdraw',
                    dataType: 'json',
                    data:JSON.stringify(tmp),
                    type:'POST',
                    contentType: "application/json; charset=utf-8"
                }).done(function(data, status, jqXHR){
                    if(data.result=='success'){
                        alert('执行成功！');

                        self.preData.state = true;
                        self.postData = self.getArray(self.preData);
                    }else{
                        alert('执行失败！');
                    }
                }).fail(function(data, status, jqXHR){
                   alert('服务器请求超时！');
                });
                break;
                case '修改推广单价':
                Store.showModal('update-order',this.preData,function(patch) {
                    if (patch !== undefined) {
                        this.preData.price = patch;
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '修改活动':
                Store.showModal('update-vip-event',this.preData,function(patch) {
                    for (var key in patch) {
                        this.preData[key] = patch[key];
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '修改专业辅导内容':
                if (this.preData.thisTeachDetail === undefined) {
                    alert('本次专业辅导情况不存在');
                } else {
                    Store.showModal('update-report',this.preData,function(patch) {
                        for (var key in patch) {
                            this.preData.thisTeachDetail[key] = patch[key];
                        }
                        this.postData = this.getArray(this.preData);
                    }.bind(this));
                }
                break;
                case '修改授课单价':
                Store.showModal('update-teach-price',this.preData,function(patch) {
                    for (var i=0;i!==patch.length;i++) {
                        if (patch[i] !== undefined) {
                            this.preData.teachPrice[i].price = patch[i];
                        }
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '钱包':
                Store.showModal('wallet',this.preData);
                break;
                case '查看':
                detailList = [];
                for (var i = 0;i != this.header.length;i++) {
                    var type;
                    if (this.header[i].filter === 'img') {
                        type = 'img';
                    } else if (this.header[i].isArray){
                        type = 'array';
                    } else {
                        type = 'text';
                    }

                    var content;
                    if (this.header[i].isArray) {
                        var arr = this.postData[i].split(';');
                        var new_arr = [];
                        for (var j=0;j!==arr.length;j++) {
                            new_arr.push(arr[j]);
                        }
                        content = new_arr;
                    } else {
                        content = this.postData[i];
                    }

                    detailList.push({
                        type:  type,
                        content: content,
                        name: this.header[i].name,
                    });
                }

                Store.showModal('detail',detailList);
                break;
            }
        }
    }
});
Vue.component('action-row', ActionRow);
//BookMark:模态框
var Modal = Vue.extend({
    data: function() {
        return Store.modal;
    },
    template:'<div class="window" v-if=\"!close\">'+
                '<component v-if="view.length > 0" :is="view" :obj="obj"></component>'+
            '</div>',
});
Vue.component('modal', Modal);
//Bookmark:orderStatic
var orderStatic = Vue.extend({
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
    template: "<form onSubmit=\"return false;\">\n"+
    "<div>"+
    "<label style=\"margin-right:20px;\">家长ID</label>"+
    "<input v-model=\"parent_id\" type=\"text\" />"+
    "<label style=\"margin-left:20px;margin-right:20px;\">家教ID</label>"+
    "<input v-model=\"teacher_id\" type=\"text\" />"+
    "<button style=\"margin-left:20px;\" class=\"btn btn-default\" v-on:click=\"query\">提交查询</button>\n"+
    "</div>"+
    "</form>\n"+
    "<p><strong>查询结果</strong></p>"+
    "<p>订单数：{{result.count}}</p>"+
    "<p>订单总时长：{{result.totalTime}}</p>"+
    "<div style=\"height:50px;border-top:2px dotted black;\" ></div>"
})

Vue.component('order-static', orderStatic);
//Bookmark:分页表
var PaginationTable = Vue.extend({
    props:['list','header','actions','fileName'],
    data:function() {
        this.datas = [];
        for(var i=0;i!==this.list.length;i++) {
            this.datas.push(this.list[i]);
        }
        tmpPages = this.chunk(this.datas,10);
        return {
            pages: tmpPages,
            currentPage:0,
            keyword: '',
        };
    },
    template: "<form class=\"form-inline\" onSubmit=\"return false\">"+
                "<input type=\"text\" class=\"form-control\" v-model=\"keyword\">"+
                "<button v-on:click=\"search()\" type=\"submit\" class=\"btn btn-default\">搜索</button>"+
                "<div style=\"float:right;\"><safe-lock text=\"解锁导出按钮\"><button v-on:click=\"exportTable()\" type=\"submit\" class=\"btn btn-default\">全部导出</button></safe-lock></div>"+
            "</form>"+
            "<div class=\"table-responsive\">"+
                "<table class=\"table table-hover\" style=\"margin-top:50px;\">"+
                    "<thead><tr><th>操作</th><th v-for=\"cell in header\">{{cell.name}}</th></tr></thead>"+
                    "<tbody><tr is=\"action-row\" v-for=\"item in pages[currentPage]\" :header=\"header\" :pre-data=\"item\" :actions=\"actions\"></tr></tbody>"+
                "</table>"+
            "</div>"+
            "<ul class=\"pagination\"><li v-for=\"page in pages\" v-on:click=\"changePage($index)\" :class=\"{'active':$index===currentPage}\"><a>{{$index+1}}</a></li></ul>",
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
            var header = this.header;
            var arrData = [];
            for (var m = 0; m < this.list.length; m++) {
                arrData.push(Store.objToArray(this.header, this.list[m]));
            }

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
                for (var index=0;index!==arrData[i].length;index++) {
                    if (header[index].stopAuto) {
                        row += '"\''+ arrData[i][index] + '",';
                    } else {
                        row += '"'+ arrData[i][index] + '",';
                    }
                }
                row = row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }

            if (CSV == '') {        
                alert("Invalid data");
                return;
            }   
            
            //文件名
            var fileName = this.fileName;

            //初始化文件
            var uri = 'data:text/csv;charset=gb2312,' + $URL.encode(CSV);
                
            //通过trick方式下载
            var link = document.createElement("a");    
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        search: function() {
            if (this.keyword === '') {
                this.pages = this.chunk(this.datas,10);
                this.currentPage = 0;
                return ;
            }
            
            var nD = [];
            for(var i in this.datas){
                var arr = Store.objToArray(this.header, this.datas[i]);
                for(var j in arr){
                    if(arr[j].toString().indexOf(this.keyword) >= 0){
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
                    "<form class=\"form-inline\" onSubmit=\"return false\">"+
                        "<input class=\"form-control\" placeholder=\"请输入安全码...\" type=\"password\" v-model=\"safeLockPsw\" />\n"+
                        "<button class=\"btn btn-default\" v-on:click=\"unlock()\">{{text}}</button>"+
                    "</form>"+
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
                    name:'已预订订单',
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
                    name:'已失效订单',
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
                    name: '会员活动预订情况',
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
                    name: '家长已处理提现',
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
            },{
                name: '任务奖励',
                state: '-',
                items: [{
                    name: '特价推广奖励',
                    href: '/reward/discountOrder',
                },{
                    name: '邀请注册奖励',
                    href: '/reward/invite',
                },{
                    name: '家教完成课时单价增加奖励',
                    href: '/reward/course_teacher',
                },{
                    name: '家长完成课时现金券奖励',
                    href: '/reward/course_parent',
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
var Detail = Vue.extend({
	methods:{
        exit: function() {
            Store.closeModal();
        }
    },
    props: ['obj'],
    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
    						'<div v-for=\"item in obj\" class=\"bundle\" track-by=\"$index\">'+   
                                '<p class=\"left\"><strong>{{item.name}}</strong></p>'+    
                                '<p class=\"right\" v-if=\"item.type===\'text\'\" >{{item.content}}</p>'+
                                '<img class=\"right\" v-if=\"item.type===\'img\'\" :src=\"item.content\" />'+
                                '<div class=\"right\" v-if=\"item.type===\'array\'\"><p v-for=\"second_item in item.content\">{{second_item}}</p></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
})

Vue.component('detail',Detail);
var UpdateOrder = Vue.extend({
    props: ['obj'],
    data: function() {
        this.patch = undefined;
        return {
            price: this.processPrice(this.obj.price),
            vm: {
                price: '',
            }
        };
    },
    methods: {
        exit: function() {
            Store.modal.closeFn(this.patch);
            Store.closeModal();
        },
        processPrice: function(num) {
            return (num/100).toFixed(2);
        },
        submit: function() {
            if (isNaN(this.vm.price)) {
                return;
            }

            if (!confirm('确定要修改单价?')) {
                return;
            }

            var tmp = {
                token: Store.token,
                orderId: this.obj._id,
                price: parseInt(this.vm.price*100),
            };

            var self = this;
            $.ajax({
                url: Store.rootUrl+'/discountOrder/price',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    self.price = self.processPrice(tmp.price);
                    self.patch = tmp.price;
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
    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>修改推广单价</li></ol>'+
                            '<p>特价推广单价</p><p>{{price}} 元</p><form class="form-inline">'+
                                '<input type="text" v-model="vm.price"><button v-on:click="submit()">修改</button>'+
                            '</form>'+
                        '</div>'+
                    '</div>'+
                '</div>'
})
Vue.component('update-order',UpdateOrder);
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
                    // 重置默认值
                    for (var i=0;i!==self.form.length;i++) {
                        if (self.form[i].filter === 'array') {
                            self.form[i].default = clone(self.models[i]);
                        } else {
                            self.form[i].default = self.models[i];
                        }
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
var UpdateTeachPrice = Vue.extend({
    props: ['obj'],
    data:function() {
        var tp = this.obj.teachPrice;
        var tmp = {
            form: [],
            teacher_id: this.obj._id
        };

        for (var i = 0; i != tp.length; i++) {
            var addPrice = tp[i].addPrice===0?'':'(+'+(tp[i].addPrice/100).toFixed(2)+')';
            tmp.form.push({
                price: (tp[i].price/100).toFixed(2),
                addPrice: addPrice,
                name: tp[i].course+' '+tp[i].grade,
                id: tp[i]._id,
                vm: '',
            });
        }
        this.patch = new Array(tp.length);

        return tmp;
    },
    template:'<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>家教ID：{{teacher_id}}</li></ol>'+
                                "<form class=\"form-inline\" v-for=\"item in form\" onSubmit=\"return false;\">\n"+
                                    "<label>{{item.name + ' ' + item.price + item.addPrice + ' 元'}}</label><br>\n"+
                                    "<input class=\"form-control\" type=\"text\" v-model=\"item.vm\">"+
                                    "<button class=\"btn btn-default\" v-on:click=\"submit($index,item)\">修改</button>\n"+
                               "</form>\n"+
                         '</div>'+
                    '</div>'+
                '</div>',
    methods:{
        exit: function() {
            Store.modal.closeFn(this.patch);
            Store.closeModal();
        },
        submit: function($index,item) {
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
            submitObj.token = Store.token;

            var self = this;
            $.ajax({
                url: Store.rootUrl+'/CoursePrice',
                dataType: 'json',
                data:JSON.stringify(submitObj),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    item.price = (submitObj.price/100).toFixed(2);

                    self.patch[$index] = submitObj.price;
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        }
    }
})
Vue.component('update-teach-price',UpdateTeachPrice);
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

var Wallet = Vue.extend({
    props: ['obj'],
    data: function() {
        var tmp = {
            balance: '',
            haveWithdraw: '',
            withdrawing: '',
            ali: '',
            wechat: '',
            bankName: '',
            bankAccount: '',
            vm: ['','','',''],
            modify: false,
        };
        var apiEndpoint = Store.rootUrl+'/user/wallet?token='+Store.token+'&_id='+this.obj._id;
        $.get({
            url: apiEndpoint,
            dataType: 'json',
        }).done(function(data, status, jqXHR){
            if(data.result=='success'){
                tmp.balance = (data.data.balance/100).toFixed(2) + ' 元';
                tmp.haveWithdraw = (data.data.haveWithdraw/100).toFixed(2) + ' 元';
                tmp.withdrawing = (data.data.withdrawing/100).toFixed(2) + ' 元';
                tmp.ali = data.data.ali;
                tmp.wechat = data.data.wechat;
                tmp.bankName = data.data.bank.name;
                tmp.bankAccount = data.data.bank.account;
            }
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时！');
        });
        return tmp;
    },
    methods: {
        exit: function() {
            Store.closeModal();
        },
        toggle() {
            this.modify = !this.modify;
        },
        submit(index) {
            var newVal = this.vm[index];

            if (!confirm('确定修改?')) {
                return;
            }
            var tmp = {
                token: Store.token,
                _id: this.obj._id,
            };
            switch(index) {
                case 0:
                tmp.ali = newVal;
                break;
                case 1:
                tmp.wechat = newVal;
                break;
                case 2:
                tmp.bank = {};
                tmp.bank.name = newVal;
                tmp.bank.account = this.bankAccount;
                break;
                case 3:
                tmp.bank = {};
                tmp.bank.account = newVal;
                tmp.bank.name = this.bankName;
                break;
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
                    switch(index) {
                        case 0:
                        self.ali = newVal;
                        break;
                        case 1:
                        self.wechat = newVal;
                        break;
                        case 2:
                        self.bankName = newVal;
                        break;
                        case 3:
                        self.bankAccount = newVal;
                        break;
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
                            '<ol class="breadcrumb"><li>钱包信息</li></ol>'+
                                '<p><strong>余额</strong></p><p>{{balance}}</p>'+
                                '<p><strong>已提现金额</strong></p><p>{{haveWithdraw}}</p>'+
                                '<p><strong>正在提现金额</strong></p><p>{{withdrawing}}</p>'+
                                '<a v-on:click="toggle()">开启修改</a>'+
                                '<p><strong>支付宝账户</strong></p><p>{{ali}}</p><form class="form-inline" v-if="modify"><input class="form-control" type="text" v-model="vm[0]"><button class="btn btn-default" v-on:click="submit(0)">修改</button></form>'+
                                '<p><strong>微信支付账户</strong></p><p>{{wechat}}</p><form class="form-inline" v-if="modify"><input class="form-control" type="text" v-model="vm[1]"><button class="btn btn-default" v-on:click="submit(1)">修改</button></form>'+
                                '<p><strong>银行账户</strong></p>'+
                                '<p>银行：{{bankName}}</p>'+
                                '<form class="form-inline" v-if="modify">'+
                                    '<input class="form-control" type="text" v-model="vm[2]">'+
                                    '<button class="btn btn-default" v-on:click="submit(2)">修改</button>'+
                                '</form>'+
                                '<p>卡号：{{bankAccount}}</p>'+
                                '<form class="form-inline" v-if="modify">'+
                                    '<input class="form-control" type="text" v-model="vm[3]">'+
                                    '<button class="btn btn-default" v-on:click="submit(3)">修改</button>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
})

Vue.component('wallet',Wallet);
//route:home 
var PageHome = Vue.extend({
    template:"<div class=\"container-fluid\">"+
              	"<div class=\"row\">"+
              		"<div class=\"col-xs-2 sidebar\">"+
              			"<side-bar></side-bar>"+
              	    "</div>"+
              	    "<div class=\"col-xs-10 col-xs-offset-2 main\">"+
              	        "<router-view></router-view>"+
              	    "</div>"+
              	"</div>"+
              "</div>"+
    		'<modal></modal>'
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
//route:advertise
var SectionAdvertise = Vue.extend({
    data: function() {
        var self = this;
        $.ajax({
            url:Store.rootUrl+'/OnlineParams?token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                self.link = data.data.advertise.link;
                self.image = data.data.advertise.image;
                self.qnToken = data.data.qnToken;
                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
        
        return {
            link: '',
            image: '',
            loaded: false,
        }
    },
    methods: {
        upload: function(e) {
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
                        self.image = 'http://7xrvd4.com1.z0.glb.clouddn.com/'+blkRet.key;
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
                    advertise: {
                        image: this.image,
                        link: this.link
                    }
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
                    alert('修改成功');
                }else{
                    alert('修改失败');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
            });
        }
    },
    template: '<ol class="breadcrumb"><li>在线参数</li><li>修改首页广告</li></ol>'+
                    "<div v-if=\"loaded\">\n"+
                            "<p><strong>预览图</strong></p>\n"+
                            "<img :src=\"image\" alt=\"暂无图片\">\n"+
                            "<input type=\"file\" v-on:change=\"upload($event)\"/>\n"+
                            "<p><strong>广告链接</strong></p>\n"+
                            "<input class=\"form-control\" type=\"text\" v-model=\"link\" />\n"+
                    "</div>\n"+
                    "<div class=\"creater\">\n"+
                        "<safe-lock text=\"解锁修改按钮\"><button class=\"btn btn-default\" v-on:click=\"submit()\">提交变更</button></safe-lock>\n"+
                    "</div>",
})

//route:allUser
var SectionAllUser = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[1]).concat(Store.userHeader[2]);
        tmp.actions = [
            {type:'normal',tag:'查看'},
            {type:'normal',tag:'钱包'},
            {type:'toggle',map:{true:'正常',false:'冻结'},
                arr:[{tag:'正常',val:true},{tag:'冻结',val:false}],
                related:'canUse',
                module:'user'}
        ];
        
        Store.commonGet('/User?type=0',this,false);
        return tmp;
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>所有用户信息</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" file-name="所有用户信息"></pagination-table></div>'
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

            if (!/^[1-9][0-9]*$/.test(this.score)) {
                alert('积分只能为整数');
                return;
            }
            tmp.score = this.score;

            if (trim(this.money).length===0||isNaN(this.money)) {
                alert('金额格式错误');
                return;
            }
            tmp.money = parseInt(this.money * 100);

            if (!/^[1-9][0-9]*$/.test(this.allowCount)) {
                alert('人数上限只能为整数');
                return;
            }
            tmp.allowCount = this.allowCount;

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
//route:Feedback
var SectionFeedback = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'反馈ID',from:'_id'},
                {name:'用户类型',from:'user.type',filter:'radio/user_type'},
                {name:'用户ID',from:'user._id'},
                {name:'用户编号',from:'user.userNumber'},
                {name:'用户姓名',from:'user.name'},
                {name:'用户手机',from:'user.phone',stopAuto:true},
                {name:'反馈类型',from:'type',filter:'radio/feedback'},
                {name:'反馈内容',from:'content'},
                {name:'提交时间',from:'created_at',filter:'date'},
        ];
        tmp.actions = [{type:'normal',tag:'查看'}];
        tmp.subtitle = ['所有反馈','需求反馈','应用反馈','投诉反馈'][this.$route.params['type_id']];
        
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/feedback?type='+type,this);
        }
    },
    template: '<ol class="breadcrumb"><li>消息中心</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
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
//route:onlineParams
var SectionOnlineParams = Vue.extend({
    methods: {
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
                url: Store.rootUrl+'/OnlineParams',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('修改成功');
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
        var self = this;
        $.ajax({
            url:Store.rootUrl+'/OnlineParams?token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                for(var i=0;i!==self.form.length;i++){
                    self.form[i].default = Store.getter(data.data,self.form[i].from);
                    self.models.push(self.form[i].default);
                }
                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
        
        var tmp = {
            api: '',
            form: [
                {name:'标题',from:'specialText.line1',default:''},
                {name:'副标题',from:'specialText.line2',default:''},
                {name:'正文',from:'specialText.line3',default:''},
                {name:'底部文字',from:'specialText.bottomText',default:''},
                {name:'侧边栏底部文字',from:'sidebarBottomText',filter:'textarea',default:''}
                ],
            loaded: false,
            submitLock: false,
            models: []
        };

        return tmp;
    },
    template: '<ol class="breadcrumb"><li>在线参数</li><li>修改在线参数</li></ol>'+
                "<form onSubmit=\"return false;\">\n"+
                "<div class=\"form-group\" v-for=\"(key1,item) in form\">\n"+
                    "<label>{{item.name}}</label><span :class=\"{hidden:(models[key1]===item.default)}\">*</span>\n"+
                    "<template v-if=\"item.filter===undefined\">\n"+
                        "<br><input class=\"form-control\" type=\"text\" v-model=\"models[key1]\"/>\n"+
                    "</template>\n"+
                    "<template v-if=\"item.filter==='textarea'\">\n"+
                        "<textarea class=\"form-control\" rows=\"3\" v-model=\"models[key1]\"></textarea>\n"+
                    "</template>\n"+
               "</div>\n"+                   
                "<safe-lock text=\"解锁修改按钮\"><button class=\"btn btn-default\" v-on:click=\"submit\" :disabled=\"submitLock\">修改</button>\n"+
                "<span>（只改动带*号的数据）</span></safe-lock>\n"+
            "</form>",
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
            {name:'家长ID',from:'parent._id'},
            {name:'家长编号',from:'parent.userNumber'},
            {name:'家长姓名',from:'parent.name'},
            {name:'家长手机',from:'parent.phone',stopAuto:true},
            {name:'家教ID',from:'teacher._id'},
            {name:'家教编号',from:'teacher.userNumber'},
            {name:'家教姓名',from:'teacher.name'},
            {name:'家教手机',from:'teacher.phone',stopAuto:true},
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
            {name:'订单状态',from:'COMPUTED/ORDERSTATE'},
            {name:'保险单号',from:'insurance.insuranceNumber'},
            {name:'下单时间',from:'created_at',filter:'date'},
            {name:'最近修改时间',from:'updated_at',filter:'date'},
            {name:'确认时间',from:'sureTime',filter:'date'},
            {name:'取消者',from:'cancelPerson',filter:'radio/cancelPerson'},
            {name:'是否特价订单',from:'type',filter:'bool/discount'},
            {name:'特价推广原始单价',from: 'originalPrice',filter: 'money'},
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
            tmp.actions.push({type:'normal',tag:'修改推广单价'});
            tmp.header.push({name:'是否已上线',from: 'isShow',filter:'bool'})

            if (type !== 'd0'){
                tmp.actions.push({type:'toggle',map:{true:'已上线',false:'已下线'},
                arr:[{tag:'已上线',val:true},{tag:'已下线',val:false}],
                related:'isShow',
                module:'order'});
            }
            break;
        }
        switch(type) {
            case 'n0':
            url = '/Order?state=-1';
            tmp.subtitle = '所有订单';
            break;
            
            case 'n1':
            url = '/Order?state=0';
            tmp.subtitle = '已预订订单';
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
            tmp.subtitle = '已失效订单';
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
            Store.commonGet(url,this,false);
        }
    },
    template: '<ol class="breadcrumb"><li>{{maintitle}}</li><li>{{subtitle}}</li></ol>'+
                '<order-static></order-static>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})
//route:parent
var SectionParent = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[1]);
        tmp.actions = [
            {type:'normal',tag:'查看'},
            {type:'normal',tag:'钱包'}
        ];
        
        Store.commonGet('/User?type=1',this,false);
        return tmp;
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>家长信息</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" file-name="家长信息"></pagination-table></div>'
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

        tmp.header = [
                {name:'流水类型',from:'buy',filter:'radio/paylist_type'},
                {name:'用户类型',from:'user.type',filter:'radio/user_type'},
                {name:'用户ID',from:'user._id'},
                {name:'用户编号',from:'user.userNumber'},
                {name:'用户姓名',from:'user.name'},
                {name:'用户手机',from:'user.phone',stopAuto:true},
                {name:'交易金额',from:'COMPUTED/PAYMONEY-TEACHER',filter:'money'},
                {name:'交易时间',from:'updated_at',filter:'date'},
                {name:'支付方式',from:'payType',filter:'radio/pay_type'},
                {name:'提现渠道',from:'withdraw.way',filter:'withdraw_way'},
                {name:'会员活动编号',from:'vipEvent.vipEventNumber'},
                {name:'订单号',from:'order.orderNumber'},
                {name:'家长ID',from:'order.parent._id'},
                {name:'家长编号',from:'order.parent.userNumber'},
                {name:'家长姓名',from:'order.parent.name'},
                {name:'家长手机',from:'order.parent.phone',stopAuto:true},
                {name:'家教ID',from:'order.teacher._id'},
                {name:'家教编号',from:'order.teacher.userNumber'},
                {name:'家教姓名',from:'order.teacher.name'},
                {name:'家教手机',from:'order.teacher.phone',stopAuto:true},
                {name:'订单完成时间（学生完成反馈）',from:'order.reportTime',filter:'date'},
                {name:'单位价格',from:'order.price',filter:'money'},
                {name:'交通补贴',from:'order.subsidy',filter:'money'},
                {name:'专业辅导费',from:'order.professionalTutorPrice',filter:'professionalTutorPrice'},
                {name:'抵减优惠券',from:'order.coupon.money',filter:'money'},
            ];

        if (this.$route.params['type'] === 'teacher') {
            tmp.subtitle = '家教流水';
            this.reload(1);
        } else if (this.$route.params['type'] === 'parent') {
            tmp.subtitle = '家长流水';
            tmp.header[6].from = 'COMPUTED/PAYMONEY-PARENT';
            this.reload(2);
        }
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/Paylist?type='+type,this,true);
        }
    },
    template: '<ol class="breadcrumb"><li>消息中心</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})
//route:Paylist
var SectionReport = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.actions = [
            {type:'normal',tag:'查看'},
            {type:'toggle',map:{true:'已处理',false:'未处理'},
                arr:[{tag:'已处理',val:true},{tag:'未处理',val:false}],
                related:'isProfessionFinish',
                module:'report'}
        ];
        tmp.header = [
            {name:'订单号',from:'orderNumber'},
            {name:'家教ID',from:'teacher._id'},
            {name:'家教编号',from:'teacher.userNumber'},
            {name:'家教姓名',from:'teacher.name'},
            {name:'家教手机',from:'teacher.phone',stopAuto:true},
            {name:'家长ID',from:'parent._id'},
            {name:'家长编号',from:'parent.userNumber'},
            {name:'家长姓名',from:'parent.name'},
            {name:'家长手机',from:'parent.phone',stopAuto:true},
            {name:'授课时间',from:'teachTime',filter:'reportTeachTime'},
            {name:'授课科目',from:'course'},
            {name:'完成反馈时间',from:'updated_at',filter:'date'},
            {name:'本次情况-专业辅导科目',from:'thisTeachDetail.course'},
            {name:'本次情况-专业辅导年级',from:'thisTeachDetail.grade'},
            {name:'本次情况-阶段',from:'thisTeachDetail.category'},
            {name:'本次情况-教学类型',from:'thisTeachDetail.teachWay',filter:'radio/teach_way'},
            {name:'本次情况-复习模拟卷类型',from:'thisTeachDetail.examPaper'},
            {name:'本次情况-难易程度',from:'thisTeachDetail.easyLevel'},
            {name:'本次情况-年级/一级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/0'},
            {name:'本次情况-大章节/二级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/1'},
            {name:'本次情况-小章节/三级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/2'},
            {name:'本次情况-年级/一级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/3'},
            {name:'本次情况-大章节/二级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/4'},
            {name:'本次情况-小章节/三级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/5'},
            {name:'本次情况-年级/一级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/6'},
            {name:'本次情况-大章节/二级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/7'},
            {name:'本次情况-小章节/三级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/8'},
            {name:'下次情况-专业辅导科目',from:'nextTeachDetail.course'},
            {name:'下次情况-专业辅导年级',from:'nextTeachDetail.grade'},
            {name:'下次情况-阶段',from:'nextTeachDetail.category'},
            {name:'下次情况-教学类型',from:'nextTeachDetail.teachWay',filter:'radio/teach_way'},
            {name:'下次情况-复习模拟卷类型',from:'nextTeachDetail.examPaper'},
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
            {name:'正确率',from:'rightPercent'},
            {name:'学生本次积极性',from:'enthusiasm'},
            {name:'学生本次吸收程度',from:'getLevel'},
            {name:'是否已处理',from: 'isProfessionFinish',filter:'bool'}
        ];
        
        tmp.subtitle = ['未处理报告','已处理报告'][this.$route.params['type_id']];
        if (tmp.subtitle === '未处理报告') {
            tmp.actions.unshift({type:'normal',tag:'修改专业辅导内容'});
        }

        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/Order/Report?state='+type,this,false);
        }
    },
    template: '<ol class="breadcrumb"><li>反馈报告</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})
//route:Reward
var SectionReward = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() {
        var tmp = {
            loaded: false,
            header: null,
            actions: []
        };
        var api = '';
        var key;
        switch(this.$route.params['type']) {
            case 'discountOrder':
            api = '/Reward/DiscountOrder';
            key = 'discount';
            tmp.subtitle = '特价推广奖励';
            tmp.header = [
                {name:'家教ID',from:'user._id'},
                {name:'家教编号',from:'user.userNumber'},
                {name:'家教姓名',from:'user.name'},
                {name:'家教手机',from:'user.phone',stopAuto:true},
                {name:'奖励描述',from:'discount.detail'},
                {name:'奖励金额',from:'discount.money',filter:'money'},
                {name:'剩余领取次数',from:'discount.count'},
                {name:'累计完成标准次数',from:'discount.finishCount'},
            ];
            break;
            case 'invite':
            api = '/reward/invite';
            key = 'invitedUsers';
            tmp.subtitle = '邀请注册奖励';
            tmp.header = [
                {name:'邀请者类型',from:'invite.type',filter:'radio/user_type'},
                {name:'邀请者ID',from:'invite._id'},
                {name:'邀请者编号',from:'invite.userNumber'},
                {name:'邀请者姓名',from:'invite.name'},
                {name:'邀请者手机',from:'invite.phone',stopAuto:true},
                {name:'被邀请人ID',from:'invitedUsers._id'},
                {name:'被邀请人类型',from:'invitedUsers.type',filter:'radio/user_type'},
                {name:'被邀请人编号',from:'invitedUsers.userNumber'},
                {name:'被邀请人手机',from:'invitedUsers.phone',stopAuto:true},
                {name:'被邀请人姓名',from:'invitedUsers.name'},
                {name:'完成订单数量',from:'invitedUsers.finishOrderCount'},
                {name:'是否已领取',from:'invitedUsers.isRewardGet',filter:'bool'},
            ];
            break;
            case 'course_teacher':
            api = '/reward/course/teacher';
            tmp.subtitle = '家教完成课时单价增加奖励';
            tmp.header = [
                {name:'家教ID',from:'teacher._id'},
                {name:'家教编号',from:'teacher.userNumber'},
                {name:'家教姓名',from:'teacher.name'},
                {name:'家教手机',from:'teacher.phone',stopAuto:true},
                {name:'专业能力评分',from:'teacher.teacherMessage.ability',filter:'score'},
                {name:'宝贝喜爱程度评分',from:'teacher.teacherMessage.childAccept',filter:'score'},
                {name:'准时态度评分',from:'teacher.teacherMessage.punctualScore',filter:'score'},
                {name:'完成课程',from:'course'},
                {name:'原单价',from:'price',filter:'money'},
                {name:'增加单价',from:'addPrice',filter:'money'}
            ];
            break;
            case 'course_parent':
            api = '/reward/course/parent';
            key = 'finishCourseTime';
            tmp.subtitle = '家长完成课时现金券奖励';
            tmp.header = [
                {name:'家长ID',from:'user._id'},
                {name:'家长编号',from:'user.userNumber'},
                {name:'家长姓名',from:'user.name'},
                {name:'家长手机',from:'user.phone',stopAuto:true},
                {name:'总时间',from:'user.parentMessage.finishCourseTime',filter:'min'},
                {name:'完成课时时间',from:'finishCourseTime.time',filter:'min'},
                {name:'积分发放数量',from:'finishCourseTime.score'},
                {name:'现金券发放金额',from:'finishCourseTime.money',filter:'money'},
                {name:'能否领取',from:'finishCourseTime.canGet',filter:'bool'},
                {name:'是否已领取',from:'finishCourseTime.hasGet',filter:'bool'},
            ];
            break;
        }
        
        this.reload(api,key);
        return tmp;
    },
    methods: {
        reload: function(api,key) {
            Store.commonGet(api+'?',this,true,key);
        }
    },
    template: '<ol class="breadcrumb"><li>任务奖励</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
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
            if (this.submitLock) {
                return;
            }

            function trim(str){
　　          return str.replace(/(^\s*)|(\s*$)/g, "");
　　        }

            tmp={};
            tmp.content = trim(this.content);
            tmp.type = this.type;
            tmp.token = Store.token;

            if (tmp.content.length === 0) {
                alert('内容不能为空');
                return;
            }

            this.submitLock = true;
            
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
//route:teacher
var SectionTeacher = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[2]);
        tmp.actions = [
            {type:'normal',tag:'查看'},
            {type:'normal',tag:'钱包'},
            {type:'normal',tag:'修改授课单价'},
            {type:'toggle',map:['未审核','通过','不通过'],
                arr:[{tag:'未审核',val:0},{tag:'通过',val:1},{tag:'不通过',val:2}],
                related:'teacherMessage.checkType',
                module:'teacher'}
        ];
        if (this.$route.params['type_id'] == 'pass'){
            tmp.subtitle = '通过审核的家教';
            this.reload(3);
        } else if (this.$route.params['type_id'] == 'notpass') {
            tmp.subtitle = '没通过审核的家教';
            this.reload(4);
        }　if (this.$route.params['type_id'] == 'unchecked'){
            tmp.subtitle = '未审核家教';
            this.reload(2);
        }
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/User?type='+type,this,false);
        }
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})

//route:Event
var SectionVipEvent = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'活动ID',from:'_id'},
                {name:'活动编号',from:'vipEventNumber'},
                {name:'活动标题',from:'title'},
                {name:'发布时间',from:'created_at',filter:'date'},
                {name:'活动说明',from:'detail'},
                {name:'积分预订',from:'score'},
                {name:'现金预订',from:'money',filter:'money'},
                {name:'最大人数',from:'allowCount'},
                {name:'已预约人数',from:'bookCount'},
                {name:'活动状态',from:'COMPUTED/EVENTSTATE'},
        ];
        tmp.actions = [{type:'normal',tag:'查看'},{type:'normal',tag:'修改活动'}];
        tmp.subtitle = ['所有反馈','需求反馈','应用反馈','投诉反馈'][this.$route.params['type_id']];

        
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/VipEvent?',this);
        }
    },
    template: '<ol class="breadcrumb"><li>会员活动</li><li>会员活动发布情况</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" file-name="会员活动发布情况"></pagination-table></div>'
})
//route:Book
var SectionVipEventBook = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'活动ID',from:'vipEvent._id'},
                {name:'活动编号',from:'vipEvent.vipEventNumber'},
                {name:'活动标题',from:'vipEvent.title'},
                {name:'预约ID',from:'_id'},
                {name:'用户类型',from:'user.type',filter:'radio/user_type'},
                {name:'用户ID',from:'user._id'},
                {name:'用户编号',from:'user.userNumber'},
                {name:'用户姓名',from:'user.name'},
                {name:'用户手机',from:'user.phone',stopAuto:true},
                {name:'下单时间',from:'updated_at',filter:'date'},
                {name:'支付类型',from:'payType',filter:'radio/pay_type'},
                {name:'支付额度',from:'COMPUTED/EVENTBOOKPAY'},
        ];
        this.actions = [];
        this.reload();
        return tmp;
    },
    methods: {
        reload: function() {
            Store.commonGet('/VipEvent/Book?',this,true);
        }
    },
    template: '<ol class="breadcrumb"><li>会员活动</li><li>会员活动预订情况</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" file-name="会员活动预订情况"></pagination-table></div>'
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
            {name:'用户类型',from:'user.type',filter:'radio/user_type'},
            {name:'用户ID',from:'user._id'},
            {name:'用户编号',from:'user.userNumber'},
            {name:'用户姓名',from:'user.name'},
            {name:'用户手机',from:'user.phone',stopAuto:true},
            {name:'正在申请提现金额',from:'withdraw',filter:'money'},
            {name:'提现渠道',from:'way',filter:'withdraw_way'},
            {name:'最后操作时间',from:'updated_at',filter:'date'},
            {name:'是否已处理',from: 'state',filter:'bool'}
        ];
        tmp.actions = [{type:'normal',tag:'查看'}];
        if (this.$route.params['type_id'] === '0'||this.$route.params['type_id'] === '2') {
            tmp.actions.push({type:'oneway',tag:'确认提现'});
        }

        tmp.subtitle = ['家教未处理提现','家教已处理提现','家长未处理提现','家长已处理提现'][this.$route.params['type_id']];

        switch(this.$route.params['type_id']) {
            case '0':
                this.reload(1,0);
                break;
            case '1':
                this.reload(1,1);
                break;
            case '2':
                this.reload(2,0);
                break;
            case '3':
                this.reload(2,1);
                break;
        }
        return tmp;
    },
    methods: {
        reload: function(type,state) {
            Store.commonGet('/Withdraw?type='+type+'&state='+state,this,true);
        }
    },
    template: '<ol class="breadcrumb"><li>我的钱包</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})
//BookMark:全局
var App = Vue.extend({})

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
            '/reward/:type': {
                component: SectionReward,
            }
        }
    },
})

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