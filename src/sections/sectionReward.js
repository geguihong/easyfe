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
        var fn,callback;
        switch(this.$route.params['type']) {
            case 'discountOrder':
            api = '/Reward/DiscountOrder';
            fn = function(obj) {
                if (obj === undefined) {
                    return [];
                }
                var nList = [];
                for (var i=0;i!==obj.discount.length;i++) {
                    if(obj.discount[i].count > 0||obj.discount[i].finishCount > 0) {
                        var nObj = $.extend({},obj,true);
                        nObj.discount = obj.discount[i];
                        nList.push(nObj);
                    }
                }
                return nList;
            };
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
            fn = function(obj) {
                if (obj === undefined) {
                    return [];
                }
                var nList = [];
                for (var i=0;i!==obj.invitedUsers.length;i++) {
                    var nObj = $.extend({},obj,true);
                    nObj.invitedUsers = obj.invitedUsers[i];
                    nList.push(nObj);
                }
                return nList;
            };
            callback = function(obj) {
                if (obj.invitedUsers.type === 1) {
                    obj.money = 500;
                } else if (obj.invitedUsers.type === 2) {
                    obj.money = 60000;
                }
            };
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
                {name:'奖励金额',from:'money',filter:'money'},
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
            fn = function(obj) {
                if (obj === undefined) {
                    return [];
                }
                var nList = [];
                for (var i=0;i!==obj.finishCourseTime.length;i++) {
                    if(obj.finishCourseTime[i].canGet === true||obj.finishCourseTime[i].hasGet === true) {
                        var nObj = $.extend({},obj,true);
                        nObj.finishCourseTime = obj.finishCourseTime[i];
                        nList.push(nObj);
                    }
                }
                return nList;
            };
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
        
        this.reload(api,fn,callback);
        return tmp;
    },
    methods: {
        reload: function(api,fn,callback) {
            Store.commonGet(api+'?',this,true,fn,callback);
        }
    },
    template: '<ol class="breadcrumb"><li>任务奖励</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})