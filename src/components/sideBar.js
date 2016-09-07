//Bookmark:侧边导航
var SideBar = Vue.extend({
    data: function() {
        return {
            navs:[{
                name: '用户管理',
                state: '-',
                items: [{
                    name:'所有用户信息',
                    href:'/allUser',
                },{
                    name:'家长信息',
                    href:'/parent',
                },{
                    name:'未审核家教信息',
                    href:'/teacher/unchecked',
                },{
                    name:'通过审核的家教',
                    href:'/teacher/pass',
                },{
                    name:'没通过审核的家教',
                    href:'/teacher/notpass'
                }]
            },{
                name: '订单管理',
                state: '-',
                items: [{
                    name:'所有订单',
                    href:'/order/n0',
                },{
                    name:'已预订订单',
                    href:'/order/n1',
                },{
                    name:'待执行订单',
                    href:'/order/n2',
                },{
                    name:'已修改订单',
                    href:'/order/n3',
                },{
                    name:'已完成订单',
                    href:'/order/n4',
                },{
                    name:'已失效订单',
                    href:'/order/n5',
                }]
            },{
                name: '特价推广管理',
                state: '-',
                items: [{
                    name:'特价推广执行情况',
                    href:'/order/d0',
                },{
                    name:'未审核推广',
                    href:'/order/d1',
                },{
                    name:'已上线推广',
                    href:'/order/d2',
                },{
                    name:'已下线推广',
                    href:'/order/d3',
                }]
            },{
                name: '消息中心',
                state: '-',
                items: [{
                    name:'发送消息',
                    href:'/sendMessage',
                },{
                    name:'历史消息',
                    href:'/message',
                },{
                    name:'所有反馈',
                    href:'/feedback/0',
                },{
                    name:'需求反馈',
                    href:'/feedback/1',
                },{
                    name:'应用反馈',
                    href:'/feedback/2',
                },{
                    name:'投诉反馈',
                    href:'/feedback/3',
                }]
            },{
                name: '在线参数',
                state: '-',
                items: [{
                    name:'修改在线参数',
                    href:'/onlineParams'
                },{
                    name:'修改轮播图',
                    href:'/guidemap',
                },{
                    name:'修改首页广告',
                    href:'/advertise'
                }]
            },{
                name: '会员活动',
                state: '-',
                items: [{
                    name: '发布会员活动',
                    href: '/createEvent'
                },{
                    name: '会员活动发布情况',
                    href: '/VipEvent',
                },{
                    name: '会员活动预订情况',
                    href: '/VipEventBook',
                }]
            },{
                name: '我的钱包',
                state: '-',
                items: [{
                    name: '家教流水',
                    href: '/paylist/teacher',
                },{
                    name: '家长流水',
                    href: '/paylist/parent',
                },{
                    name: '家教未处理提现',
                    href: '/withdraw/0',
                },{
                    name: '家教已处理提现',
                    href: '/withdraw/1',
                },{
                    name: '家长未处理提现',
                    href: '/withdraw/2',
                },{
                    name: '家长已处理提现',
                    href: '/withdraw/3',
                }]
            },{
                name: '反馈报告',
                state: '-',
                items: [{
                    name: '未处理报告',
                    href: '/report/0',
                },{
                    name: '已处理报告',
                    href: '/report/1',
                }]
            },{
                name: '任务奖励',
                state: '-',
                items: [{
                    name: '特价推广奖励',
                    href: '/reward/discountOrder',
                },{
                    name: '邀请注册奖励',
                    href: '/reward/invite',
                },{
                    name: '家教完成课时单价增加奖励',
                    href: '/reward/course_teacher',
                },{
                    name: '家长完成课时现金券奖励',
                    href: '/reward/course_parent',
                }]
            }]
        }
    },
    template: "<div v-for=\"nav in navs\">\n                    <h4 v-on:click=\"toggle($index)\">{{nav.name}} <span>{{nav.state}}</span></h4>\n                    <ul class=\"nav nav-sidebar\" :class=\"{hidden:nav.state == '+'}\">\n                        <li v-for=\"item in nav.items\" v-link=\"{path:item.href,activeClass:'active'}\"><a>{{item.name}}</a></li>\n                    </ul>\n                </div>",
    methods: {
        toggle: function(index) {
            if(this.navs[index].state=='+'){
                this.navs[index].state='-';
            } else {
                this.navs[index].state='+';
            }
        }
    }
})
Vue.component('side-bar', SideBar);