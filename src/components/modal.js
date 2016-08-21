//BookMark:模态框
var Modal = Vue.extend({
    data: function() {
        return Store.modal;
    },
    methods: {
        exit: function() {
            Store.closeModal();
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
                            '<component v-if="view.length > 0" :is="view" :obj="obj"></component>'+
                         '</div>'+
                    '</div>'+
                '</div>'+
            '</div>',
});
Vue.component('modal', Modal);