//route:order
var SectionOrder = Vue.extend({
    route: {
        canReuse: false
    },
    data: function() { 
        var tmp={};
        tmp.loaded = false;
        tmp.header = [
            {name:'家长ID',from:'parent._id'},
            {name:'家长编号',from:'parent.userNumber'},
            {name:'家长姓名',from:'parent.name'},
            {name:'家长手机',from:'parent.phone'},
            {name:'家教ID',from:'teacher._id'},
            {name:'家教编号',from:'teacher.userNumber'},
            {name:'家教姓名',from:'teacher.name'},
            {name:'家教手机',from:'teacher.phone'},
            {name:'年级',from:'grade'},
            {name:'课程',from:'course'},
            {name:'授课日期',from:'teachTime.date'},
            {name:'授课时段',from:'teachTime.time',filter:'radio/timeArea'},
            {name:'授课时长',from:'time',filter:'min'},
            {name:'单位价格',from:'price',filter:'money'},
            {name:'交通补贴',from:'subsidy',filter:'money'},
            {name:'专业辅导费',from:'professionalTutorPrice',filter:'professionalTutorPrice'},
            {name:'抵减优惠券',from:'coupon.money',filter:'money'},
            {name:'总价',from:'COMPUTED/SUM',filter:'money'},
            {name:'孩子年龄',from:'childAge',filter:'age'},
            {name:'孩子性别',from:'childGender',filter:'radio/gender'},
            {name:'订单号',from:'orderNumber'},
            {name:'订单类型',from:'type',filter:'radio/order_type'},
            {name:'订单状态',from:'state',filter:'radio/order_state'},
            {name:'保险单号',from:'insurance.insuranceNumber'},
            {name:'下单时间',from:'created_at',filter:'date'},
            {name:'最近修改时间',from:'updated_at',filter:'date'},
            {name:'确认时间',from:'sureTime',filter:'date'},
            {name:'取消者',from:'cancelPerson',filter:'radio/cancelPerson'},
            {name:'是否特价订单',from:'type',filter:'bool/discount'},
            {name:'特价推广原始单价',from: 'originalPrice',filter: 'money'}
        ];
        
        tmp.actions = [];
        var url = '';
        var type = this.$route.params['type_id'];
        switch(type) {
            case 'n0':
            case 'n1':
            case 'n2':
            case 'n3':
            case 'n4':
            case 'n5':
            tmp.maintitle = '订单管理';
            break;
            case 'd0':
            case 'd1':
            case 'd2':
            case 'd3':
            tmp.maintitle = '特价推广管理';
            tmp.actions.push('修改推广单价');
            break;
        }
        switch(type) {
            case 'n0':
            url = '/Order?state=-1';
            tmp.subtitle = '所有订单';
            break;
            
            case 'n1':
            url = '/Order?state=0';
            tmp.subtitle = '已预订订单';
            break;
            
            case 'n2':
            url = '/Order?state=1';
            tmp.subtitle = '待执行订单';
            tmp.actions.push('修改专业辅导内容');
            break;
            
            case 'n3':
            url = '/Order?state=2';
            tmp.subtitle = '已修改订单';
            break;
            
            case 'n4':
            url = '/Order?state=3';
            tmp.subtitle = '已完成订单';
            break;
            
            case 'n5':
            url = '/Order?state=4';
            tmp.subtitle = '已失效订单';
            break;
            
            case 'd0':
            url = '/Order/Discount?type=-1';
            tmp.subtitle = '特价推广执行情况';
            break;
            
            case 'd1':
            url = '/Order/Discount?type=0';
            tmp.subtitle = '未审核推广';
            tmp.actions.push('上线');
            break;
            
            case 'd2':
            url = '/Order/Discount?type=1';
            tmp.subtitle = '已上线推广';
            tmp.actions.push('下线');
            break;
            
            case 'd3':
            url = '/Order/Discount?type=2';
            tmp.subtitle = '已下线推广';
            tmp.actions.push('上线');
            break;
        }
        
        this.reload(url);
        return tmp;
    },
    methods: {
        reload: function(url) {
            Store.commonGet(url,this,false,['_id','price','type','thisTeachDetail']);
        }
    },
    template: '<ol class="breadcrumb"><li>{{maintitle}}</li><li>{{subtitle}}</li></ol>'+
                '<order-static></order-static>'+
                '<div><pagination-table v-if="loaded" :post-datas="postDatas" :header="header" :actions="actions"></pagination-table></div>'
})