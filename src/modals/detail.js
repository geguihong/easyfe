var Detail = Vue.extend({
	methods:{
        exit: function() {
            Store.closeModal();
        }
    },
    props: ['obj'],
    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
    						'<div v-for=\"item in obj\" class=\"bundle\" track-by=\"$index\">'+   
                                '<p class=\"left\"><strong>{{item.name}}</strong></p>'+    
                                '<p class=\"right\" v-if=\"item.type===\'text\'\" >{{item.content}}</p>'+
                                '<img class=\"right\" v-if=\"item.type===\'img\'\" :src=\"item.content\" />'+
                                '<div class=\"right\" v-if=\"item.type===\'array\'\"><p v-for=\"second_item in item.content\">{{second_item}}</p></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
})

Vue.component('detail',Detail);