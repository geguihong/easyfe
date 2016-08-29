var Wallet = Vue.extend({
    props: ['obj'],
    data: function() {
        var tmp = {
            balance: '',
            haveWithdraw: '',
            withdrawing: '',
            ali: '',
            wechat: '',
            bankName: '',
            bankAccount: '',
            vm: ['','','',''],
            modify: false,
        };
        var apiEndpoint = Store.rootUrl+'/user/wallet?token='+Store.token+'&_id='+this.obj._id;
        $.get({
            url: apiEndpoint,
            dataType: 'json',
        }).done(function(data, status, jqXHR){
            if(data.result=='success'){
                tmp.balance = (data.data.balance/100).toFixed(2) + ' 元';
                tmp.haveWithdraw = (data.data.haveWithdraw/100).toFixed(2) + ' 元';
                tmp.withdrawing = (data.data.withdrawing/100).toFixed(2) + ' 元';
                tmp.ali = data.data.ali;
                tmp.wechat = data.data.wechat;
                tmp.bankName = data.data.bank.name;
                tmp.bankAccount = data.data.bank.account;
            }
        }).fail(function(data, status, jqXHR){
            alert('服务器请求超时！');
        });
        return tmp;
    },
    methods: {
        exit: function() {
            Store.closeModal();
        },
        toggle() {
            this.modify = !this.modify;
        },
        submit(index) {
            var newVal = this.vm[index];

            if (!confirm('确定修改?')) {
                return;
            }
            var tmp = {
                token: Store.token,
                _id: this.obj._id,
            };
            switch(index) {
                case 0:
                tmp.ali = newVal;
                break;
                case 1:
                tmp.wechat = newVal;
                break;
                case 2:
                tmp.bank = {};
                tmp.bank.name = newVal;
                tmp.bank.account = this.bankAccount;
                break;
                case 3:
                tmp.bank = {};
                tmp.bank.account = newVal;
                tmp.bank.name = this.bankName;
                break;
            }

            var self = this;
            $.ajax({
                url: Store.rootUrl+'/user/payway',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    switch(index) {
                        case 0:
                        self.ali = newVal;
                        break;
                        case 1:
                        self.wechat = newVal;
                        break;
                        case 2:
                        self.bankName = newVal;
                        break;
                        case 3:
                        self.bankAccount = newVal;
                        break;
                    }
                }else{
                    alert('修改失败');
                }
                self.submitLock = false;
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时');
               self.submitLock = false;
            });
        },
    },
    template: '<div class=\"modal-dialog\">'+
                    '<div class=\"modal-content\">'+
                        '<div class=\"modal-header\">'+                      
                            '<button type=\"button\" class="close" v-on:click=\"exit()\"><span aria-hidden=\"true\">&times;</span></button>'+ 
                            '<h4>详情</h4>'+
                        '</div>'+
                        '<div class=\"modal-body\">'+
                            '<ol class="breadcrumb"><li>钱包信息</li></ol>'+
                                '<p><strong>余额</strong></p><p>{{balance}}</p>'+
                                '<p><strong>已提现金额</strong></p><p>{{haveWithdraw}}</p>'+
                                '<p><strong>正在提现金额</strong></p><p>{{withdrawing}}</p>'+
                                '<a v-on:click="toggle()">开启修改</a>'+
                                '<p><strong>支付宝账户</strong></p><p>{{ali}}</p><form class="form-inline" v-if="modify"><input class="form-control" type="text" v-model="vm[0]"><button class="btn btn-default" v-on:click="submit(0)">修改</button></form>'+
                                '<p><strong>微信支付账户</strong></p><p>{{wechat}}</p><form class="form-inline" v-if="modify"><input class="form-control" type="text" v-model="vm[1]"><button class="btn btn-default" v-on:click="submit(1)">修改</button></form>'+
                                '<p><strong>银行账户</strong></p>'+
                                '<p>银行：{{bankName}}</p>'+
                                '<form class="form-inline" v-if="modify">'+
                                    '<input class="form-control" type="text" v-model="vm[2]">'+
                                    '<button class="btn btn-default" v-on:click="submit(2)">修改</button>'+
                                '</form>'+
                                '<p>卡号：{{bankAccount}}</p>'+
                                '<form class="form-inline" v-if="modify">'+
                                    '<input class="form-control" type="text" v-model="vm[3]">'+
                                    '<button class="btn btn-default" v-on:click="submit(3)">修改</button>'+
                                '</form>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
})

Vue.component('wallet',Wallet);