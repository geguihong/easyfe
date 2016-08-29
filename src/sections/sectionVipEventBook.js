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