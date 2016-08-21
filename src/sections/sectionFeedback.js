//route:Feedback
var SectionFeedback = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'反馈ID',from:'_id'},
                {name:'用户类型',from:'user.type',filter:'radio/user_type'},
                {name:'用户ID',from:'user._id'},
                {name:'用户编号',from:'user.userNumber'},
                {name:'用户姓名',from:'user.name'},
                {name:'用户手机',from:'user.phone'},
                {name:'反馈类型',from:'type',filter:'radio/feedback'},
                {name:'反馈内容',from:'content'},
                {name:'提交时间',from:'created_at',filter:'date'},
        ];
        tmp.actions = ['查看'];
        tmp.subtitle = ['所有反馈','需求反馈','应用反馈','投诉反馈'][this.$route.params['type_id']];
        
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/feedback?type='+type,this);
        }
    },
    template: '<ol class="breadcrumb"><li>消息中心</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions"></pagination-table></div>'
})