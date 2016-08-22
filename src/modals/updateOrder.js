var UpdateOrder = Vue.extend({
    props: ['obj'],
    data: function() {
        this.patch = undefined;
        return {
            price: this.processPrice(this.obj.price),
            vm: {
                price: '',
            }
        };
    },
    methods: {
        exit: function() {
            Store.modal.closeFn(this.patch);
            Store.closeModal();
        },
        processPrice: function(num) {
            return (num/100).toFixed(2);
        },
        submit: function() {
            if (isNaN(this.vm.price)) {
                return;
            }

            if (!confirm('确定要修改单价?')) {
                return;
            }

            var tmp = {
                token: Store.token,
                orderId: this.obj._id,
                price: parseInt(this.vm.price*100),
            };

            var self = this;
            $.ajax({
                url: Store.rootUrl+'/discountOrder/price',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    self.price = self.processPrice(tmp.price);
                    self.patch = tmp.price;
                }else{
                    alert('修改失败');
                }
                self.submitLock = false;
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
               self.submitLock = false;
            });
        }
    },
    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>修改推广单价</li></ol>'+
                            '<p>特价推广单价</p><p>{{price}} 元</p><form class="form-inline">'+
                                '<input type="text" v-model="vm.price"><button v-on:click="submit()">修改</button>'+
                            '</form>'+
                        '</div>'+
                    '</div>'+
                '</div>'
})
Vue.component('update-order',UpdateOrder);