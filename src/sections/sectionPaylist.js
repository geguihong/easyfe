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