//BookMark:全局
var App = Vue.extend({})

//路由
var router = new VueRouter()
router.map({
    '/login': {
        component: PageLogin,
    },
    '/': {
        component: PageHome,
        subRoutes: {
            '/allUser': {
                component: SectionAllUser
            },
            '/parent': {
                component: SectionParent
            },
            '/order/:type_id': {
                component: SectionOrder
            },
            '/sendMessage': {
                component: SectionSendMessage
            },
            '/onlineParams': {
                component: SectionOnlineParams
            },
            '/message': {
                component: SectionMessage
            },
            '/feedback/:type_id': {
                component: SectionFeedback,
            },
            '/teacher/:type_id': {
                component: SectionTeacher,
            },
            '/guidemap': { 
                component: SectionGuideMap,
            },
            '/advertise': {
                component: SectionAdvertise,
            },
            '/createEvent': {
                component: SectionCreateEvent,
            },
            '/VipEvent': {
                component: SectionVipEvent,
            },
            '/VipEventBook': {
                component: SectionVipEventBook,
            },
            '/paylist/:type': {
                component: SectionPaylist,
            },
            '/report/:type_id': {
                component: SectionReport,
            },
            '/withdraw/:type_id': {
                component: SectionWithdraw,
            },
            '/reward/:type': {
                component: SectionReward,
            }
        }
    },
})

router.beforeEach(function (transition) {
  if (transition.to.path !== '/login') {
    if (sessionStorage['token'] === undefined) {
        router.go('/login');
    } else {
        Store.token = sessionStorage['token'];
        transition.next();
    }
  } else {
    transition.next()
  }
})

router.start(App, '#app')