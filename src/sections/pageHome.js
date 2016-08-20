//route:home 
var PageHome = Vue.extend({
    template:"<div class=\"container-fluid\">\n                <div class=\"row\">\n                    <!-- 侧边导航 -->\n                    <div class=\"col-xs-2 sidebar\">\n                        <side-bar></side-bar>\n                    </div>\n\n                    <div class=\"col-xs-10 col-xs-offset-2 main\">\n                        <router-view></router-view>\n                    </div>\n                </div>\n            </div>\n"+
    '<modal></modal>'
})