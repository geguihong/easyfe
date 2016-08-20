var UpdateReport = Vue.extend({
    props: ['obj'],
    data: function() {
        return {
            form: [
                 {name:'订单ID',from:'orderId',default:this.obj._id,filter:'uid'},
                 {name:'教学类型',from:'thisTeachDetail.teachWay',default:this.obj.thisTeachDetail.teachWay,filter:'radio/teach_way'},
                 {name:'难易程度',from:'thisTeachDetail.easyLevel',default:this.obj.thisTeachDetail.easyLevel},
                 {name:'专业辅导科目',from:'thisTeachDetail.course',default:this.obj.thisTeachDetail.course},
                 {name:'专业辅导年级',from:'thisTeachDetail.grade',default:this.obj.thisTeachDetail.grade},
                 {name:'阶段',from:'thisTeachDetail.category',default:this.obj.thisTeachDetail.category},
                 {name:'复习模拟卷类型',from:'thisTeachDetail.examPaper',default:this.obj.thisTeachDetail.examPaper},
                 {name:'知识点',from:'thisTeachDetail.knowledge',default:this.obj.thisTeachDetail.knowledge,filter:'array'}
                ]
        }
    },
    template: '<ol class="breadcrumb"><li>修改这次反馈报告</li></ol>'+
                '<div><dirty-form :form="form" api="/Update/Order/Report/ThisTeachDetail" :is-tmp="true" :no-wrapper="true"></dirty-form></div>',
})
Vue.component('update-report',UpdateReport);