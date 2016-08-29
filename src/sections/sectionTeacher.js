//route:teacher
var SectionTeacher = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = Store.userHeader[0].concat(Store.userHeader[2]);
        tmp.actions = [
            {type:'normal',tag:'查看'},
            {type:'normal',tag:'钱包'},
            {type:'normal',tag:'修改授课单价'},
            {type:'toggle',map:['未审核','通过','不通过'],
                arr:[{tag:'未审核',val:0},{tag:'通过',val:1},{tag:'不通过',val:2}],
                related:'teacherMessage.checkType',
                module:'teacher'}
        ];
        if (this.$route.params['type_id'] == 'pass'){
            tmp.subtitle = '通过审核的家教';
            this.reload(3);
        } else if (this.$route.params['type_id'] == 'notpass') {
            tmp.subtitle = '没通过审核的家教';
            this.reload(4);
        }　if (this.$route.params['type_id'] == 'unchecked'){
            tmp.subtitle = '未审核家教';
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
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})
