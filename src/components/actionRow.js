//Bookmark:动作行
var ActionRow = Vue.extend({
    props:['header','preData','actions'],
    data: function() {
        var tmp = {};
        tmp.postData = this.getArray(this.preData);
        return tmp;
    },
    template:'<tr>'+
                '<td style="max-width:none;overflow:visible;" class="dropup">'+
                    '<template v-for="action in actions">'+
                        '<button v-if="action.type===\'normal\'" v-on:click="emit(action)" class="btn btn-primary" style="margin-right:10px;">{{action.tag}}</button>'+
                        '<div style="display:inline-block;width:auto;margin-right: 10px;" class="input-group-btn" v-if="action.type===\'toggle\'">'+
                            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">{{action.map[pre(action.related)]}}<span class="caret"></span></button>'+
                                '<ul class="dropdown-menu">'+
                                    '<li v-for="(index,item) in action.arr" v-on:click="select(action,index)" track-by="$index"><a>{{item.tag}}</a></li>'+
                                '</ul>'+
                        '</div>'+
                        '<button v-if="action.type===\'oneway\'&&!preData.state" v-on:click="emit(action)" class="btn btn-primary" style="margin-right:10px;">{{action.tag}}</button>'+
                    '</template>'+
                '</td>'+
                '<td title="{{cell}}" v-for="cell in postData" track-by="$index">{{cell}}</td></tr>',
    methods:{
        pre: function(key) {
            return Store.getter(this.preData,key);
        },
        getArray: function(obj) {
            return Store.objToArray(this.header,obj);
        },
        select: function(action,index) {
            var newVal = action.arr[index].val;
            if (newVal === Store.getter(this.preData,action.related)) {
                return;
            }

            var tmp = {
                token: Store.token,
            };
            var api;
            switch(action.module) {
                case 'user':
                api = '/blacklist';
                tmp['_id'] = this.preData._id;
                tmp['canUse'] = newVal;
                break;

                case 'teacher':
                api = '/Teacher/Check';
                tmp['teacherId'] = this.preData._id;
                tmp['checkType'] = newVal;
                break;

                case 'order':
                api = '/Order/Discount/Check';
                tmp['orderId'] = this.preData._id;
                tmp['isShow'] = newVal;
                break;

                case 'report':
                api = '/Order/Report';
                tmp['_id'] = this.preData._id;
                tmp['isProfessionFinish'] = newVal;

            }

            var self = this;
            $.ajax({
                url: Store.rootUrl+api,
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                if(data.result=='success'){
                    alert('执行成功！');
                    // 修改 preData 并且重置 postData
                    var patch = Store.setter({},action.related,newVal);
                    $.extend(self.preData,patch);
                    
                    self.postData = self.getArray(self.preData);
                }else{
                    alert('执行失败！');
                }
            }).fail(function(data, status, jqXHR){
               alert('服务器请求超时！');
            });
        },
        emit: function(event){
            switch(event.tag) {
                case '确认提现':
                var tmp = {
                    token: Store.token,
                    withdrawId: this.preData._id,
                    state: 1
                };
                var self = this;
                $.ajax({
                    url: Store.rootUrl+'/Withdraw',
                    dataType: 'json',
                    data:JSON.stringify(tmp),
                    type:'POST',
                    contentType: "application/json; charset=utf-8"
                }).done(function(data, status, jqXHR){
                    if(data.result=='success'){
                        alert('执行成功！');

                        self.preData.state = true;
                        self.postData = self.getArray(self.preData);
                    }else{
                        alert('执行失败！');
                    }
                }).fail(function(data, status, jqXHR){
                   alert('服务器请求超时！');
                });
                break;
                case '修改推广单价':
                Store.showModal('update-order',this.preData,function(patch) {
                    if (patch !== undefined) {
                        this.preData.price = patch;
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '修改活动':
                Store.showModal('update-vip-event',this.preData,function(patch) {
                    for (var key in patch) {
                        this.preData[key] = patch[key];
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '修改专业辅导内容':
                Store.showModal('update-report',this.preData,function(patch) {
                    for (var key in patch) {
                        this.preData.thisTeachDetail[key] = patch[key];
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '修改授课单价':
                Store.showModal('update-teach-price',this.preData,function(patch) {
                    for (var i=0;i!==patch.length;i++) {
                        if (patch[i] !== undefined) {
                            this.preData.teachPrice[i].price = patch[i];
                        }
                    }
                    this.postData = this.getArray(this.preData);
                }.bind(this));
                break;
                case '钱包':
                Store.showModal('wallet',this.preData);
                break;
                case '查看':
                detailList = [];
                for (var i = 0;i != this.header.length;i++) {
                    var type;
                    if (this.header[i].filter === 'img') {
                        type = 'img';
                    } else if (this.header[i].isArray){
                        type = 'array';
                    } else {
                        type = 'text';
                    }

                    var content;
                    if (this.header[i].isArray) {
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
                        name: this.header[i].name,
                    });
                }

                Store.showModal('detail',detailList);
                break;
            }
        }
    }
});
Vue.component('action-row', ActionRow);