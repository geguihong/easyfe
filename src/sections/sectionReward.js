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
        switch(this.$route.params['type']) {
            case 'discountOrder':
            api = '/Reward/DiscountOrder';
            tmp.header = [
                {name:'家教ID',from:'user._id'},
                {name:'家教编号',from:'user.userNumber'},
                {name:'家教姓名',from:'user.name'},
                {name:'家教手机',from:'user.phone'},
                {name:'奖励详情',from:'discount',filter:'detail/discountOrder',isArray:true}
            ];
            break;
            case 'invite':
            api = '/reward/invite';
            tmp.header = [
                {name:'邀请者类型',from:'invite.type',filter:'radio/user_type'},
                {name:'邀请者ID',from:'invite._id'},
                {name:'邀请者编号',from:'invite.userNumber'},
                {name:'邀请者姓名',from:'invite.name'},
                {name:'邀请者手机',from:'invite.phone'},
                {name:'奖励详情',from:'invitedUsers',filter:'detail/invite',isArray:true}
            ];
            break;
            case 'course_teacher':
            api = '/reward/course/teacher';
            tmp.header = [
                {name:'家教ID',from:'teacher._id'},
                {name:'家教编号',from:'teacher.userNumber'},
                {name:'家教姓名',from:'teacher.name'},
                {name:'家教手机',from:'teacher.phone'},
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
            tmp.header = [
                {name:'家长ID',from:'user._id'},
                {name:'家长编号',from:'user.userNumber'},
                {name:'家长姓名',from:'user.name'},
                {name:'家长手机',from:'user.phone'},
                {name:'完成课程时间',from:'user.parentMessage.finishCourseTime',filter:'min'},
                {name:'奖励详情',from:'finishCourseTime',filter:'detail/course_parent',isArray:true}
            ];
            break;
        }
        
        this.reload(api);
        return tmp;
    },
    methods: {
        reload: function(api) {
            Store.commonGet(api+'?',this,true);
        }
    },
    template: '<ol class="breadcrumb"><li>任务奖励</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions"></pagination-table></div>'
})