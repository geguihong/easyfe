//route:Event
var SectionVipEvent = Vue.extend({
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
                {name:'活动ID',from:'_id'},
                {name:'活动编号',from:'vipEventNumber'},
                {name:'活动标题',from:'title'},
                {name:'发布时间',from:'created_at',filter:'date'},
                {name:'活动说明',from:'detail'},
                {name:'积分预订',from:'score'},
                {name:'现金预订',from:'money',filter:'money'},
                {name:'最大人数',from:'allowCount'},
                {name:'已预约人数',from:'bookCount'},
                {name:'活动状态',from:'COMPUTED/EVENTSTATE'},
        ];
        tmp.actions = [{type:'normal',tag:'查看'},{type:'normal',tag:'修改活动'}];
        tmp.subtitle = ['所有反馈','需求反馈','应用反馈','投诉反馈'][this.$route.params['type_id']];

        
        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/VipEvent?',this);
        }
    },
    template: '<ol class="breadcrumb"><li>会员活动</li><li>会员活动发布情况</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions"></pagination-table></div>'
})