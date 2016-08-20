var UpdateOrder = Vue.extend({
    props: ['obj'],
    data: function() {
        return {
            price: this.processPrice(this.obj.price),
            vm: {
                price: '',
            }
        };
    },
    methods: {
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
    template: '<ol class="breadcrumb"><li>修改推广单价</li></ol>'+
                '<p>特价推广单价</p><p>{{price}} 元</p><div><input type="text" v-model="vm.price"><button v-on:click="submit()">修改</button></div>',
})
Vue.component('update-order',UpdateOrder);