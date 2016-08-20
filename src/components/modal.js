//BookMark:模态框
var Modal = Vue.extend({
    data: function() {
        return Store.modal;
    },
    methods: {
        exit: function() {
            this.close = true;
            this.view = '';
            this.obj = null;
        }
    },
    template:'<div class="window" v-if=\"!close\">'+
                 '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<div v-if=\"view ===\'detail\'\" v-for=\"item in obj\" class=\"bundle\" track-by=\"$index\">'+   
                                '<p class=\"left\"><strong>{{item.name}}</strong></p>'+    
                                '<p class=\"right\" v-if=\"item.type===\'text\'\" >{{item.content}}</p>'+
                                '<img class=\"right\" v-if=\"item.type===\'img\'\" :src=\"item.content\" />'+
                                '<div class=\"right\" v-if=\"item.type===\'teachPrice\'||item.type===\'singleBookTime\'||item.type===\'teachTime\'\"><p v-for=\"second_item in item.content\">{{second_item}}</p></div>'+
                            '</div>'+
                            '<update-teach-price v-if=\"view ===\'updateTeachPrice\'\" :obj="obj"></update-teach-price>'+
                            '<update-vip-event v-if=\"view ===\'updateVipEvent\'\" :obj="obj"></update-vip-event>'+
                            '<wallet v-if=\"view ===\'wallet\'\" :obj="obj"></wallet>'+
                            '<update-order v-if=\"view ===\'updateOrder\'\" :obj="obj"></update-order>'+
                            '<update-report v-if=\"view ===\'updateReport\'\" :obj="obj"></update-report>'+
                         '</div>'+
                    '</div>'+
                '</div>'+
            '</div>',
});
Vue.component('modal', Modal);