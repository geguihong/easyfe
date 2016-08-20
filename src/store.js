var Store = {
    rootUrl: '/Web',
    token: '',
    safeLockPsw: 'jiajiaoyi',
    tmpHeader: [],
    modal: {
        close: true,
        view: '',
        obj: null,
    },
    showModal: function(text,obj) {
        this.modal.close = false;
        this.modal.view = text;
        this.modal.obj = obj;
    },
    getter: function(data,key) {
        switch (key) {
            case 'COMPUTED/EVENTBOOKPAY':
            if (data.vipEvent === undefined) {
                return '';
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
                } else {
                    return data.parentMessage.score;
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
        for(var i=0;i!=arr.length;i++){
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
            case 'detail/discountOrder':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var tmp_money = (str[i].money/100).toFixed(2)+'元';
                var tmp_finishCount = str[i].finishCount === undefined?'无':str[i].finishCount+'次';
                new_str.push(str[i].detail+' | 奖励金额：'+tmp_money
                    +' | 剩余领取次数：'+str[i].count+'次 | 累计完成标准次数：'+tmp_finishCount);
            }
            return new_str.join(';');

            case 'detail/invite':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var tmp_type = ['家长/家教','家教','家长'][str[i].type];
                var tmp_bool = str[i].isRewardGet?'是':'否';
                new_str.push('被邀请人ID：'+str[i]._id+' | 类型：'+tmp_type+' | 编号：'+str[i].userNumber
                    +' | 手机：'+str[i].phone+' | 姓名：'+str[i].name+' | 完成订单数量：'+str[i].finishOrderCount
                    +' | 是否已领取：'+tmp_bool);
            }
            return new_str.join(';');

            case 'detail/course_parent':
            var new_str = [];
            for (var i = 0;i != str.length;i++) {
                var tmp_money = (str[i].money/100).toFixed(2)+' 元';
                var tmp_bool1 = str[i].canGet?'是':'否';
                var tmp_bool2 = str[i].hasGet?'是':'否';
                new_str.push('完成课时时间：'+str[i].time+' 分钟 | 积分发放数量：'+str[i].score+' | 现金券发放金额：'+tmp_money
                    +' | 能否领取：'+tmp_bool1+' | 是否已领取：'+tmp_bool2);
            }
            return new_str.join(';');

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
                return '无';
            } else {
                return (str/100).toFixed(2) + ' 元';
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
            return (str/100).toFixed(2) + ' 元';
            case 'bool':
            return str?'是':'否';
            case 'bool/reverse':
            return str?'否':'是';
            case 'bool/discount':
            return str === 1?'是':'否';
            case 'radio/paylist_type':
            return ['订单','会员活动','充值'][str];
            case 'radio/pay_type':
            return ['余额支付','支付宝支付','微信支付','积分支付'][str];
            case 'radio/checkType':
            return ['未审核','通过','不通过'][str];
            case 'radio/order_type':
            return ['单次预约','特价订单','多次预约'][str];
            case 'radio/user_type':
            return ['家长/家教','家教','家长'][str];
            case 'radio/order_state':
            return ['已预订','待执行','已修改','已完成','已失效'][str];
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
            return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            
            case 'onlydate':
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
            for (var index=0;index!==arrData[i].arr.length;index++) {
                row += '"'+ arrData[i].arr[index] + '",';
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
    userHeader:[[
            {name:'用户ID',from:'_id'},
            {name:'用户编号',from:'userNumber'},
            {name:'姓名',from:'name'},
            {name:'性别',from:'gender',filter:'radio/gender'},
            {name:'生日',from:'birthday',filter:'onlydate'},
            {name:'手机',from:'phone'},
            {name:'身份证号',from:'teacherMessage.idCard'},
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
    commonGet: function(url,self,returnList,keyList) {
        $.ajax({
            url:Store.rootUrl+url+'&token='+Store.token,
            dataType: 'json'
        }).done(function(data, status, jqXHR){
            if(data.result=="success"){
                var list = [];
                if (returnList) {
                    list = data.data.list;
                } else {
                    list = data.data;
                }
                self.postDatas = [];
                for(var i in list){
                    var x = list[i];
                    var item = {
                        arr: [],
                        obj: {},
                    };
                    for(var j in self.header) {
                        var str = Store.getter(x,self.header[j].from);
                        if (str !== undefined ) {
                            if (self.header[j].filter) {
                                str = Store.filter(str,self.header[j].filter);
                            }
                        } else {
                            str = '';
                        }
                        item.arr.push(str);
                    }
                    if (keyList !== undefined) {
                        for (var k in keyList) {
                            item.obj[keyList[k]] = Store.getter(x,keyList[k]);
                        }
                    }
                    self.postDatas.push(item);
                }

                self.loaded = true;
            }else{
                alert('获取数据失败');
            }
            
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时');
        });
    }
};
