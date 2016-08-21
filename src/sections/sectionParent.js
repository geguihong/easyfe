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
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions"></pagination-table></div>'
})