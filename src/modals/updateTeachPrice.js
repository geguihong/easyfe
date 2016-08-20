var UpdateTeachPrice = Vue.extend({
    props: ['obj'],
    data:function() {
        var tp = this.obj.teachPrice;
        var tmp = {
            form: [],
            teacher_id: this.obj._id
        };
        for (var i = 0; i != tp.length; i++) {
            var addPrice = tp[i].addPrice===undefined?0:tp[i].addPrice;
            tmp.form.push({
                price: ((tp[i].price+addPrice)/100).toFixed(2) + '元',
                name: tp[i].course+' '+tp[i].grade,
                id: tp[i]._id,
                vm: '',
            });
        }
        return tmp;
    },
    template:'<ol class="breadcrumb"><li>家教ID：{{teacher_id}}</li></ol>'+
    "<form onSubmit=\"return false;\">\n"+
                "<div class=\"form-group\" v-for=\"item in form\">\n"+
                    "<label>{{item.name + ' ' + item.price}}</label><br>\n"+
                    "<input type=\"text\" v-model=\"item.vm\">"+
                    "<button v-on:click=\"submit(item)\">修改</button>\n"+
               "</div>\n"+                   
            "</form>",
    methods:{
        reset: function() {
            
        },
        submit: function(item) {
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
            submitObj.token=Store.token;

            $.ajax({
                url: Store.rootUrl+'/CoursePrice',
                dataType: 'json',
                data:JSON.stringify(submitObj),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    item.price = parseFloat(new_price).toFixed(2) + '元';
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