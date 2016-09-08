//route:Paylist
var SectionReport = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.actions = [
            {type:'normal',tag:'查看'},
            {type:'toggle',map:{true:'已处理',false:'未处理'},
                arr:[{tag:'已处理',val:true},{tag:'未处理',val:false}],
                related:'isProfessionFinish',
                module:'report'}
        ];
        tmp.header = [
            {name:'订单号',from:'orderNumber'},
            {name:'家教ID',from:'teacher._id'},
            {name:'家教编号',from:'teacher.userNumber'},
            {name:'家教姓名',from:'teacher.name'},
            {name:'家教手机',from:'teacher.phone',stopAuto:true},
            {name:'家长ID',from:'parent._id'},
            {name:'家长编号',from:'parent.userNumber'},
            {name:'家长姓名',from:'parent.name'},
            {name:'家长手机',from:'parent.phone',stopAuto:true},
            {name:'授课时间',from:'teachTime',filter:'reportTeachTime'},
            {name:'授课科目',from:'course'},
            {name:'完成反馈时间',from:'updated_at',filter:'date'},
            {name:'本次情况-专业辅导科目',from:'thisTeachDetail.course'},
            {name:'本次情况-专业辅导年级',from:'thisTeachDetail.grade'},
            {name:'本次情况-阶段',from:'thisTeachDetail.category'},
            {name:'本次情况-教学类型',from:'thisTeachDetail.teachWay',filter:'radio/teach_way'},
            {name:'本次情况-复习模拟卷类型',from:'thisTeachDetail.examPaper'},
            {name:'本次情况-难易程度',from:'thisTeachDetail.easyLevel'},
            {name:'本次情况-年级/一级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/0'},
            {name:'本次情况-大章节/二级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/1'},
            {name:'本次情况-小章节/三级知识点1',from:'thisTeachDetail.knowledge',filter:'knowledge/2'},
            {name:'本次情况-年级/一级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/3'},
            {name:'本次情况-大章节/二级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/4'},
            {name:'本次情况-小章节/三级知识点2',from:'thisTeachDetail.knowledge',filter:'knowledge/5'},
            {name:'本次情况-年级/一级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/6'},
            {name:'本次情况-大章节/二级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/7'},
            {name:'本次情况-小章节/三级知识点3',from:'thisTeachDetail.knowledge',filter:'knowledge/8'},
            {name:'下次情况-专业辅导科目',from:'nextTeachDetail.course'},
            {name:'下次情况-专业辅导年级',from:'nextTeachDetail.grade'},
            {name:'下次情况-阶段',from:'nextTeachDetail.category'},
            {name:'下次情况-教学类型',from:'nextTeachDetail.teachWay',filter:'radio/teach_way'},
            {name:'下次情况-复习模拟卷类型',from:'nextTeachDetail.examPaper'},
            {name:'下次情况-难易程度',from:'nextTeachDetail.easyLevel'},
            {name:'下次情况-年级/一级知识点1',from:'nextTeachDetail.knowledge',filter:'knowledge/0'},
            {name:'下次情况-大章节/二级知识点1',from:'nextTeachDetail.knowledge',filter:'knowledge/1'},
            {name:'下次情况-小章节/三级知识点1',from:'nextTeachDetail.knowledge',filter:'knowledge/2'},
            {name:'下次情况-年级/一级知识点2',from:'nextTeachDetail.knowledge',filter:'knowledge/3'},
            {name:'下次情况-大章节/二级知识点2',from:'nextTeachDetail.knowledge',filter:'knowledge/4'},
            {name:'下次情况-小章节/三级知识点2',from:'nextTeachDetail.knowledge',filter:'knowledge/5'},
            {name:'下次情况-年级/一级知识点3',from:'nextTeachDetail.knowledge',filter:'knowledge/6'},
            {name:'下次情况-大章节/二级知识点3',from:'nextTeachDetail.knowledge',filter:'knowledge/7'},
            {name:'下次情况-小章节/三级知识点3',from:'nextTeachDetail.knowledge',filter:'knowledge/8'},
            {name:'正确率',from:'rightPercent'},
            {name:'学生本次积极性',from:'enthusiasm'},
            {name:'学生本次吸收程度',from:'getLevel'},
            {name:'家教评语',from:'teacherComment'},
            {name:'家长评语',from:'parentComment.content'},
            {name:'是否已处理',from: 'isProfessionFinish',filter:'bool'}
        ];
        
        tmp.subtitle = ['未处理报告','已处理报告'][this.$route.params['type_id']];
        if (tmp.subtitle === '未处理报告') {
            tmp.actions.unshift({type:'normal',tag:'修改专业辅导内容'});
        }

        this.reload(this.$route.params['type_id']);
        return tmp;
    },
    methods: {
        reload: function(type) {
            Store.commonGet('/Order/Report?state='+type,this,false);
        }
    },
    template: '<ol class="breadcrumb"><li>反馈报告</li><li>{{subtitle}}</li></ol>'+
                '<div><pagination-table v-if="loaded" :list="list" :header="header" :actions="actions" :file-name="subtitle"></pagination-table></div>'
})