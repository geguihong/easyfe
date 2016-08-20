var UpdateVipEvent = Vue.extend({
    props: ['obj'],
    data: function() {
        return {
            form: [
                {name:'活动ID',from:'vipEventId',default:this.obj._id,filter:'uid'},
                {name:'活动标题',from:'title',default:this.obj.title},
                {name:'活动说明',from:'detail',default:this.obj.detail},
                {name:'积分预订',from:'score',default:this.obj.score.toString()},
                {name:'现金预订',from:'money',default:(this.obj.money/100).toFixed(2),submitFilter:'number/100'},
                {name:'最大人数',from:'allowCount',default:this.obj.allowCount.toString()},
                {name:'是否接受预订',from:'isPublish',default:this.obj.isPublish,filter:'bool'},
                ]
        }
    },
    template: '<ol class="breadcrumb"><li>修改会员活动</li></ol>'+
                '<div><dirty-form :form="form" api="/VipEvent/Update" :is-tmp="true"></dirty-form></div>',
})
Vue.component('update-vip-event',UpdateVipEvent);
