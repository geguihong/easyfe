//Bookmark:动作行
var ActionRow = Vue.extend({
    props:['postData','preData','actions'],
    data: function() {
        var updateReportActionIndex = $.inArray('修改专业辅导内容',this.actions);
        if (updateReportActionIndex !== -1) {
            if (this.preData.thisTeachDetail === undefined) {
                this.actions.splice(updateReportActionIndex,1);
            }
        }
        return {};
    },
    template:'<tr><td style="max-width:none;"><a v-for="action in actions" v-on:click="emit(action)">{{action}}</a></td><td title="{{cell}}" v-for="cell in postData" track-by="$index">{{cell}}</td></tr>',
    methods:{
        checkWithdraw: function(id,state) {
            var tmp = {
                token: Store.token,
            };
            tmp['withdrawId'] = id;
            tmp['state'] = state;

            $.ajax({
                url: Store.rootUrl+'/Withdraw',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        checkOrder: function(id,isShow) {            
            var tmp = {
                token: Store.token,
            };
            tmp['orderId'] = id;
            tmp['isShow'] = isShow;
            
            $.ajax({
                url: Store.rootUrl+'/Order/Discount/Check',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        checkTeacher: function(id,checkType) {            
            var tmp = {
                token: Store.token,
            };
            tmp['teacherId'] = id;
            tmp['checkType'] = checkType;
            
            $.ajax({
                url: Store.rootUrl+'/Teacher/Check',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        checkReport: function(id,isProfessionFinish) {            
            var tmp = {
                token: Store.token,
            };
            tmp['_id'] = id;
            tmp['isProfessionFinish'] = isProfessionFinish;
            
            $.ajax({
                url: Store.rootUrl+'/Order/Report',
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    location.reload();
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        emit: function(event){
            switch(event) {
                case '重新审核':
                this.checkTeacher(this.preData._id,0);
                break;
                case '通过':
                this.checkTeacher(this.preData._id,1);
                break;
                case '驳回':
                this.checkTeacher(this.preData._id,2);
                break;
                case '上线':
                this.checkOrder(this.preData._id,true);
                break;
                case '下线':
                this.checkOrder(this.preData._id,false);
                break;
                case '修改推广单价':
                Store.showModal('updateOrder',this.preData);
                break;
                case '确认处理':
                this.checkReport(this.preData._id,1);
                break;
                case '撤回处理':
                this.checkReport(this.preData._id,0);
                break;
                case '确认提现':
                this.checkWithdraw(this.preData._id,1);
                break;
                case '撤回提现':
                this.checkWithdraw(this.preData._id,0);
                break;
                case '修改活动':
                Store.showModal('updateVipEvent',this.preData);
                break;
                case '修改专业辅导内容':
                Store.showModal('updateReport',this.preData);
                break;
                case '修改授课单价':
                Store.showModal('updateTeachPrice',this.preData);
                break;
                case '钱包':
                Store.showModal('wallet',this.preData);
                break;
                case '查看':
                detailList = [];
                for (var i = 0;i != Store.tmpHeader.length;i++) {
                    var type = '';
                    if (Store.tmpHeader[i].filter !== 'img' && Store.tmpHeader[i].filter !== 'teachPrice' && Store.tmpHeader[i].filter !== 'teachTime' && Store.tmpHeader[i].filter !== 'singleBookTime') {
                        type = 'text';
                    } else {
                        type = Store.tmpHeader[i].filter;
                    }

                    var content;
                    if (type === 'teachPrice' || type === 'teachTime' || type === 'singleBookTime') {
                        var arr = this.postData[i].split(';');
                        var new_arr = [];
                        for (var j=0;j!==arr.length;j++) {
                            new_arr.push(arr[j]);
                        }
                        content = new_arr;
                    } else {
                        content = this.postData[i];
                    }

                    detailList.push({
                        type:  type,
                        content: content,
                        name: Store.tmpHeader[i].name,
                    });
                }

                Store.showModal('detail',detailList);
                break;
            }
        }
    }
});
Vue.component('action-row', ActionRow);