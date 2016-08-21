//route:teacher
var SectionTeacher = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[2]);
        tmp.actions = ['查看','钱包','修改授课单价'];
        if (this.$route.params['type_id'] == 'pass'){
            tmp.subtitle = '通过审核的家教';
            tmp.actions.push('重新审核');
            this.reload(3);
        } else if (this.$route.params['type_id'] == 'notpass') {
            tmp.subtitle = '没通过审核的家教';
            tmp.actions.push('重新审核');
            this.reload(4);
        }　if (this.$route.params['type_id'] == 'unchecked'){
            tmp.subtitle = '未审核家教';
            tmp.actions.push('通过','驳回');
            this.reload(2);
        }
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/User?type='+type,this,false);
        }
    },
    template: '<ol class="breadcrumb"><li>用户管理</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions"></pagination-table></div>'
})
