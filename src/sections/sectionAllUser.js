//route:allUser
var SectionAllUser = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[1]).concat(Store.userHeader[2]);
        tmp.actions = ['查看','钱包'];
        
        Store.commonGet('/User?type=0',this,false,['_id']);
        return tmp;
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>所有用户信息</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})