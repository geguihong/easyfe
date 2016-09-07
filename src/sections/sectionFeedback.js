//route:Feedback
var SectionMessage = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'发送对象',from:'type',filter:'radio/message'},
                {name:'内容',from:'content'},
                {name:'发送时间',from:'created_at',filter:'date'},
        ];
        tmp.actions = [{type:'normal',tag:'查看'}];
        
        this.reload();
        return tmp;
    },
    methods: {
        reload: function() {
            Store.commonGet('/Message?',this);
        }
    },
    template: '<ol class="breadcrumb"><li>消息中心</li><li>历史消息</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" file-name="历史消息"></pagination-table></div>'
})