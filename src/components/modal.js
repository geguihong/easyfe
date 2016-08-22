//BookMark:模态框
var Modal = Vue.extend({
    data: function() {
        return Store.modal;
    },
    template:'<div class="window" v-if=\"!close\">'+
                '<component v-if="view.length > 0" :is="view" :obj="obj"></component>'+
            '</div>',
});
Vue.component('modal', Modal);