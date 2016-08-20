//route:Reward
var SectionReward = Vue.extend({
    data: function() {
        var tmp = {
            loaded: false,
            header: null
        };
        var api = '';
        switch(this.$route.params['type']) {
            case 'discountOrder':
            tmp.header = [
                {name:'副标题',from:'advertise.link'},
            ];
            break;
            case 'invite':
            break;
            case 'course_teacher':
            break;
            case 'course_parent':
            break;
        }
        tmp.loaded = false;
        tmp.header = null;
        
        this.reload();
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/Reward?',this);
        }
    },
    template: '<ol class="breadcrumb"><li>任务奖励</li></ol>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})