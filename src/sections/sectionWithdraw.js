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
            {name:'用户手机',from:'user.phone'},
            {name:'正在申请提现金额',from:'withdraw',filter:'money'},
            {name:'支付方式',from:'COMPUTED/PAYWAY'},
            {name:'最后操作时间',from:'updated_at',filter:'date'},
        ];
        tmp.actions = ['查看'];
        tmp.subtitle = ['家教未处理提现','家教已处理提现','家长未处理提现','家长已处理提现'][this.$route.params['type_id']];

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
            Store.commonGet('/Withdraw?type='+type+'&state='+state,this,true);
        }
    },
    template: '<ol class="breadcrumb"><li>我的钱包</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions"></pagination-table></div>'
})