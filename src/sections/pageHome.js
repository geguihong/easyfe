//route:home 
var PageHome = Vue.extend({
    template:"<div class=\"container-fluid\">"+
              	"<div class=\"row\">"+
              		"<div class=\"col-xs-2 sidebar\">"+
              			"<side-bar></side-bar>"+
              	    "</div>"+
              	    "<div class=\"col-xs-10 col-xs-offset-2 main\">"+
              	        "<router-view></router-view>"+
              	    "</div>"+
              	"</div>"+
              "</div>"+
    		'<modal></modal>'
})