var UpdateTeachPrice = Vue.extend({
    props: ['obj'],
    data:function() {
        var tp = this.obj.teachPrice;
        var tmp = {
            form: [],
            teacher_id: this.obj._id
        };

        for (var i = 0; i != tp.length; i++) {
            var addPrice = [tp[i].addPrice===0?'':(tp[i].addPrice/100).toFixed(2)];
            tmp.form.push({
                price: (tp[i].price/100).toFixed(2),
                addPrice: addPrice,
                name: tp[i].course+' '+tp[i].grade,
                id: tp[i]._id,
                vm: '',
            });
        }
        this.patch = new Array(tp.length);

        return tmp;
    },
    template:'<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>家教ID：{{teacher_id}}</li></ol>'+
                                "<form class=\"form-inline\" v-for=\"item in form\" onSubmit=\"return false;\">\n"+
                                    "<label>{{item.name + ' ' + item.price + item.addPrice + ' 元'}}</label><br>\n"+
                                    "<input class=\"form-control\" type=\"text\" v-model=\"item.vm\">"+
                                    "<button class=\"btn btn-default\" v-on:click=\"submit($index,item)\">修改</button>\n"+
                               "</form>\n"+
                         '</div>'+
                    '</div>'+
                '</div>',
    methods:{
        exit: function() {
            Store.modal.closeFn(this.patch);
            Store.closeModal();
        },
        submit: function($index,item) {
            var new_price = item.vm;
            if (new_price === '' || isNaN(new_price)) {
                return;
            }

            if (!confirm('确定要修改单价?')) {
                return;
            }

            submitObj = {};
            
            submitObj._id = item.id;
            submitObj.price = parseInt(new_price*100);
            submitObj.token = Store.token;

            var self = this;
            $.ajax({
                url: Store.rootUrl+'/CoursePrice',
                dataType: 'json',
                data:JSON.stringify(submitObj),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    item.price = (submitObj.price/100).toFixed(2);

                    self.patch[$index] = submitObj.price;
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        }
    }
})
Vue.component('update-teach-price',UpdateTeachPrice);