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