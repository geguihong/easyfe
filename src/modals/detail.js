var Detail = Vue.extend({
    props: ['obj'],
    template: '<div v-for=\"item in obj\" class=\"bundle\" track-by=\"$index\">'+   
                                '<p class=\"left\"><strong>{{item.name}}</strong></p>'+    
                                '<p class=\"right\" v-if=\"item.type===\'text\'\" >{{item.content}}</p>'+
                                '<img class=\"right\" v-if=\"item.type===\'img\'\" :src=\"item.content\" />'+
                                '<div class=\"right\" v-if=\"item.type===\'array\'\"><p v-for=\"second_item in item.content\">{{second_item}}</p></div>'+
                            '</div>'
})

Vue.component('detail',Detail);