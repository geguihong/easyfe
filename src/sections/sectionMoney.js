//route:allUser
var SectionMoney = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
            {name:'用户类型',from:'user.type',filter:'radio/user_type'},
            {name:'用户ID',from:'user._id'},
            {name:'用户编号',from:'user.userNumber'},
            {name:'用户姓名',from:'user.name'},
            {name:'用户手机',from:'user.phone',stopAuto:true},
            {name:'已提现',from:'haveWithdraw',filter:'money'},
            {name:'提现中',from:'withdrawing',filter:'money'},
            {name:'余额',from:'balance',filter:'money'},
            {name:'支付宝账户',from:'ali'},
            {name:'微信支付账户',from:'wechat'},
            {name:'银行',from:'bank.name'},
            {name:'银行账户',from:'bank.account'},
        ];
        tmp.actions = [{
            type:'normal',tag:'钱包'
        }];
        
        Store.commonGet('/wallet?',this,false);
        return tmp;
    },
    template: '<ol class="breadcrumb"><li>我的钱包</li><li>钱包信息</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" file-name="钱包信息"></pagination-table></div>'
})