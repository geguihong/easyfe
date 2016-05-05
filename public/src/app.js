window.tmptoken="";
window.rootUrl="/Web";

//辅助函数
function getFormJson(form) {
    var o = {};
    var a = form.serializeArray();
    $.each(a, function () {
    if (o[this.name] !== undefined) {
    if (!o[this.name].push) {
    o[this.name] = [o[this.name]];
    }
    o[this.name].push(this.value || '');
    } else {
    o[this.name] = this.value || '';
    }
    });
    return o;
}


function App(){
    var tm={};
    tm['user']=[
        {key:'_id',value:'ID'},
        {key:'token',value:'token'},
        {key:'name',value:'姓名'},
        {key:'gender',value:'性别'},
        {key:'birthday',value:'生日'},
        {key:'phone',value:'联系电话'},
        {key:'password',value:'密码'},
        {key:'type',value:'用户类型'},
        {key:'badRecord',value:'不良记录'},
        {key:'avatar',value:'头像'},
        {key:'position',value:'住址'},
        {key:'teacherMessage',value:'家教信息'},
        {key:'parentMessage',value:'家长信息'}
        ];
        
    tm['order']=[
        {key:'_id',value:'ID'},
        {key:'grade',value:'年级'},
        {key:'course',value:'课程类型'},
        {key:'time',value:'授课时长'},
        {key:'price',value:'价格'},
        {key:'subsidy',value:'交通补贴'},
        {key:'childAge',value:'孩子年龄'},
        {key:'childGender',value:'孩子性别'},
        {key:'orderNumber',value:'订单号'},
        {key:'type',value:'订单类型'},
        {key:'state',value:'订单状态'},
        {key:'tag',value:'标签'},
        {key:'teacher',value:'家教ID'},
        {key:'parent',value:'家长ID'},
        {key:'insurance',value:'保险单ID'},
        {key:'sureTime',value:'确认时间'},
        {key:'cancelPerson',value:'取消者'},
        {key:'isShow',value:'是否显示'},
        {key:'hadPublish',value:'是否有Publish'},
        {key:'hadComment',value:'是否有Comment'},
        ];
    
    tm['feedback']=[
        {key:'_id',value:'ID'},
        {key:'type',value:'反馈类型'},
        {key:'content',value:'反馈内容'}
    ];
    
    var mm={};
    mm['all_user']=[
        {key:'_id',value:'ID',type:'text'},
        {key:'token',value:'token',type:'text'},
        {key:'name',value:'姓名',type:'text'},
        {key:'gender',value:'性别',type:'radio',radio:{'0':'女','1':'男'}},
        {key:'birthday',value:'生日',type:'date'},
        {key:'phone',value:'联系电话',type:'text'},
        {key:'password',value:'密码',type:'text'},
        {key:'type',value:'用户类型',type:'text'},
        {key:'badRecord',value:'不良记录',type:'text'},
        {key:'avatar',value:'头像',type:'img'},
        {key:'position',value:'住址',type:'address'}
        ];
        
    mm['parent']=mm['all_user'].concat([
        {key:'parentMessage',value:'家长信息',type:'parentMessage'}
        ]);
    
    mm['teacher']=mm['all_user'].concat([
        {key:'teacherMessage',value:'家教信息',type:'teacherMessage'}
        ]);
    
    mm['order']=[
        {key:'_id',value:'ID',type:'text'},
        {key:'grade',value:'年级',type:'text'},
        {key:'course',value:'课程类型',type:'text'},
        {key:'time',value:'授课时长',type:'text'},
        {key:'price',value:'价格',type:'text'},
        {key:'subsidy',value:'交通补贴',type:'text'},
        {key:'childAge',value:'孩子年龄',type:'text'},
        {key:'childGender',value:'孩子性别',type:'radio',radio:{'0':'女','1':'男'}},
        {key:'orderNumber',value:'订单号',type:'text'},
        {key:'type',value:'订单类型',type:'text'},
        {key:'state',value:'订单状态',type:'text'},
        {key:'tag',value:'标签',type:'text'},
        {key:'teacher',value:'家教ID',type:'text'},
        {key:'parent',value:'家长ID',type:'text'},
        {key:'insurance',value:'保险单ID',type:'text'},
        {key:'sureTime',value:'确认时间',type:'datetime'},
        {key:'cancelPerson',value:'取消者',type:'text'},
        {key:'isShow',value:'是否显示',type:'bool'},
        {key:'hadPublish',value:'是否有Publish',type:'bool'},
        {key:'hadComment',value:'是否有Comment',type:'bool'}
        ];
    
    mm['feedback']=[
        {key:'_id',value:'ID',type:'text'},
        {key:'type',value:'反馈类型',type:'radio',radio:{'1':'需求','2':'应用','3':'投诉'}},
        {key:'content',value:'反馈内容',type:'text'}
        ];
    
    var fm={};
    var fm_parent_part=[
        {key:['parentMessage','_id'],value:'家长-ID'},
        {key:['parentMessage','childGrade'],value:'家长-孩子年级'},
        {key:['parentMessage','childGender'],value:'家长-孩子性别'},
        {key:['parentMessage','bookCount'],value:'家长-订单数量'}
    ];
    var fm_teacher_part=[
        {key:['teacherMessage','_id'],value:'家教-ID'},
        {key:['teacherMessage','idCard'],value:'家教-身份证号'},
        {key:['teacherMessage','profession'],value:'家教-专业'},
        {key:['teacherMessage','freeTrafficTime'],value:'家教-免费交通区间'},
        {key:['teacherMessage','minCourseTime'],value:'家教-最小课程时间'},
        {key:['teacherMessage','hadTeach'],value:'家教-已授课时间'},
        {key:['teacherMessage','subsidy'],value:'家教-交通补贴'},
        {key:['teacherMessage','school'],value:'家教-学校'},
        {key:['teacherMessage','teachCount'],value:'家教-教学个数'},
        {key:['teacherMessage','maxTrafficTime'],value:'家教-最大交通区间'},
        {key:['teacherMessage','profile'],value:'家教-简历'},
        {key:['teacherMessage','score'],value:'家教-评分'},
        {key:['teacherMessage','rewards'],value:'家教-奖励'},
        {key:['teacherMessage','angelPlan','boy'],value:'家教-天使计划-男孩'},
        {key:['teacherMessage','angelPlan','girl'],value:'家教-天使计划-女孩'},
        {key:['teacherMessage','angelPlan','price'],value:'家教-天使计划-价格'},
        {key:['teacherMessage','angelPlan','join'],value:'家教-天使计划-是否参加'},
        {key:['teacherMessage','isLock'],value:'家教-是否已锁定'},
        {key:['teacherMessage','isChecked'],value:'家教-是否已审核'},
        {key:['teacherMessage','ability'],value:'家教-能力评分'},
        {key:['teacherMessage','childAccept'],value:'家教-接受的儿童'},
        {key:['teacherMessage','punctualScore'],value:'家教-准时分数'},
        {key:['teacherMessage','commentCount'],value:'家教-评论数'},
        {key:['teacherMessage','teachTime'],value:'家教-授课总时间'},
        {key:['teacherMessage','images','official'],value:'家教-官方认证'},
        {key:['teacherMessage','images','idCard'],value:'家教-身份证照片'},
        {key:['teacherMessage','images','studentCard'],value:'家教-学生证照片'},  
    ];
    fm['all_user']=[
        {key:'_id',value:'ID'},
        {key:'token',value:'token'},
        {key:'name',value:'姓名'},
        {key:'gender',value:'性别'},
        {key:'birthday',value:'生日'},
        {key:'phone',value:'联系电话'},
        {key:'password',value:'密码'},
        {key:'type',value:'用户类型'},
        {key:'badRecord',value:'不良记录'},
        {key:'avatar',value:'头像'},
        
        {key:['position','address'],value:'住址-地址'},
        {key:['position','city'],value:'住址-城市'},
        {key:['position','longitude'],value:'住址-经度'},
        {key:['position','latitude'],value:'住址-纬度'},
        
        ].concat(fm_parent_part,fm_teacher_part);
    
    fm['parent']=[
        {key:'_id',value:'ID'},
        {key:'token',value:'token'},
        {key:'name',value:'姓名'},
        {key:'gender',value:'性别'},
        {key:'birthday',value:'生日'},
        {key:'phone',value:'联系电话'},
        {key:'password',value:'密码'},
        {key:'type',value:'用户类型'},
        {key:'badRecord',value:'不良记录'},
        {key:'avatar',value:'头像'},
        
        {key:['position','address'],value:'住址-地址'},
        {key:['position','city'],value:'住址-城市'},
        {key:['position','longitude'],value:'住址-经度'},
        {key:['position','latitude'],value:'住址-纬度'},
        
        {key:'teacherMessage',value:'家教信息'}
        ].concat(fm_parent_part);
        
    fm['teacher']=[
        {key:'_id',value:'ID'},
        {key:'token',value:'token'},
        {key:'name',value:'姓名'},
        {key:'gender',value:'性别'},
        {key:'birthday',value:'生日'},
        {key:'phone',value:'联系电话'},
        {key:'password',value:'密码'},
        {key:'type',value:'用户类型'},
        {key:'badRecord',value:'不良记录'},
        {key:'avatar',value:'头像'},
        
        {key:['position','address'],value:'住址-地址'},
        {key:['position','city'],value:'住址-城市'},
        {key:['position','longitude'],value:'住址-经度'},
        {key:['position','latitude'],value:'住址-纬度'},
        
        {key:'parentMessage',value:'家长信息'}
        ].concat(fm_teacher_part);
        
    fm['order']=[
        {key:'_id',value:'ID'},
        {key:'grade',value:'年级'},
        {key:'course',value:'课程类型'},
        {key:'time',value:'授课时长'},
        {key:'price',value:'价格'},
        {key:'subsidy',value:'交通补贴'},
        {key:'childAge',value:'孩子年龄'},
        {key:'childGender',value:'孩子性别'},
        {key:'orderNumber',value:'订单号'},
        {key:'type',value:'订单类型'},
        {key:'state',value:'订单状态'},
        {key:'tag',value:'标签'},
        {key:'teacher',value:'家教ID'},
        {key:'parent',value:'家长ID'},
        {key:'insurance',value:'保险单ID'},
        {key:'sureTime',value:'确认时间'},
        {key:'cancelPerson',value:'取消者'},
        {key:'isShow',value:'是否显示'},
        {key:'hadPublish',value:'是否有Publish'},
        {key:'hadComment',value:'是否有Comment'}
        ];
    fm['feedback']=[
        {key:'_id',value:'ID'},
        {key:'type',value:'反馈类型'},
        {key:'content',value:'反馈内容'}
        ];    
    
    this.route_infos=[
    //用户管理0-3
    {
        bread:['用户管理','所有用户信息'],
        cont:'table',
        url:'/User?type=0',
        func:null,
        table_map:tm['user'],
        modal_map:mm['all_user'],
        fill_map:fm['all_user']
    },{
        bread:['用户管理','家长信息'],
        cont:'table',
        url:'/User?type=1',
        func:null,
        table_map:tm['user'],
        modal_map:mm['parent'],
        fill_map:fm['parent']
    },{
        bread:['用户管理','未审核家教信息'],
        cont:'table',
        url:'/User?type=2',
        func:'审核用户',
        table_map:tm['user'],
        modal_map:mm['teacher'],
        fill_map:fm['teacher']
    },{
        bread:['用户管理','已审核家教信息'],
        cont:'table',
        url:'/User?type=3',
        func:null,
        table_map:tm['user'],
        modal_map:mm['teacher'],
        fill_map:fm['teacher']
    },
    //订单管理4-8
    {
        bread:['订单管理','所有订单'],
        cont:'table',
        url:'/Order?state=-1',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['订单管理','已预定订单'],
        cont:'table',
        url:'/Order?state=0',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['订单管理','待执行订单'],
        cont:'table',
        url:'/Order?state=1',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['订单管理','已修改订单'],
        cont:'table',
        url:'/Order?state=2',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['订单管理','已完成订单'],
        cont:'table',
        url:'/Order?state=3',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['订单管理','已取消订单'],
        cont:'table',
        url:'/Order?state=4',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },
    //特价推广管理9-12
    {
        bread:['特价推广管理','特价推广执行情况'],
        cont:'table',
        url:'/Order/Discount?type=-1',
        func:null,
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['特价推广管理','未审核推广'],
        cont:'table',
        url:'/Order/Discount?type=0',
        func:'推广上线',
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['特价推广管理','已上线推广'],
        cont:'table',
        url:'/Order/Discount?type=1',
        func:'推广下线',
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },{
        bread:['特价推广管理','已下线推广'],
        cont:'table',
        url:'/Order/Discount?type=2',
        func:'推广上线',
        table_map:tm['order'],
        modal_map:mm['order'],
        fill_map:fm['order']
    },
    //消息中心13-17
    {
        bread:['消息中心','发送消息'],
        cont:'sender',
        url:'/Message'
    },{
        bread:['消息中心','所有反馈'],
        cont:'table',
        url:'/Feedback?type=0',
        func:null,
        table_map:tm['feedback'],
        modal_map:mm['feedback'],
        fill_map:fm['feedback']
    },
    {
        bread:['消息中心','需求消息'],
        cont:'table',
        url:'/Feedback?type=1',
        func:null,
        table_map:tm['feedback'],
        modal_map:mm['feedback'],
        fill_map:fm['feedback']
    },{
        bread:['消息中心','应用消息'],
        cont:'table',
        url:'/Feedback?type=2',
        func:null,
        table_map:tm['feedback'],
        modal_map:mm['feedback'],
        fill_map:fm['feedback']
    },{
        bread:['消息中心','投诉消息'],
        cont:'table',
        url:'/Feedback?type=3',
        func:null,
        table_map:tm['feedback'],
        modal_map:mm['feedback'],
        fill_map:fm['feedback']
    },{
        bread:['在线参数管理','查看在线参数'],
        cont:'page',
        url:'/OnlineParams?',
    },{
        bread:['在线参数管理','修改在线参数'],
        cont:'modify',
        url:'/OnlineParams',
        modify_map:[{
            key:'data.specialText.line1',
            name:'标题'
        },{
            key:'data.specialText.line2',
            name:'副标题'
        },{
            key:'data.specialText.line3',
            name:'正文'
        },{
            key:'data.specialText.bottomText',
            name:'底部文字'
        },{
            key:'data.sidebarBottomText',
            name:'侧边栏底部文字'
        }]
    }];
    //>
    this.datas=null;
    this.data=null;
    this.cur_route=null;
    
    this.pos4del=null;
}

App.prototype={
    init_table:function(){
        var dom=_.template('<form class="form-inline" onSubmit="return false">'+
        '<div class="form-group">'+
        '<input type="text" class="form-control" id="table-input">'+
        '</div>'+
        '<button type="submit" class="btn btn-default" id="table-search">搜索</button>'+
        '<button type="submit" class="btn btn-default" id="table-export">全部导出</button>'+
        '</form>'+
        '<div class="table-responsive">'+
        '<table data-class="item" class="table table-hover" id="table-output">'+
        '<thead><tr><% for(var i in map) { %><th><%- map[i].value %></th><% } %></tr></thead>'+
        '<tbody></tbody>'+
        '</table></div><div id="table-page"></div></div>');
        $('#app-cont').html(dom({map:this.cur_route.table_map}));
        this.reload_table();
    },
    reload_table:function(){
        var datas=this.datas;
        var map=this.cur_route.table_map;
        var dom="";
        for(var j in datas) { 
            dom+='<tr data-id="'+j+'" style="display:none;">';
            for(var k in map){
                dom+='<td>';
                if(typeof datas[j][map[k].key] == 'object'){
                    dom+='......';
                }else if(datas[j][map[k].key] == undefined){
                    
                }else{
                    dom+=datas[j][map[k].key];
                }
                dom+='</td>';
            }
            dom+='</tr>';
        }
        $('#table-output tbody').html(dom);
        
        
        var page_count=parseInt((this.datas.length-1)/20)+1;
        //进行分页
        var page_dom='<ul class="pagination">';
        for(var i=0;i!=page_count;i++){
            page_dom+='<li data-id="'+i+'"><a href="#">'+(i+1)+'</a></li>';
        }
        page_dom+='</ul>';
        
        $('#table-page').html(page_dom);
        //选中第一页
        $('#table-page [data-id="0"]').click();
    },
    reload_modal:function(){
        var dom="";
        var cur_map=this.cur_route.modal_map;
        var cur_data=this.data;
        for(var i in cur_map){
            dom+='<p><strong>'+cur_map[i].value+'</strong></p>';
            var tv=cur_data[cur_map[i].key];
            if(tv==undefined){
                dom+="<p>未定义</p>";
            }else{
                
                switch(cur_map[i].type){
                    case 'bool':
                    dom+='<p>'+(tv?'是':'否')+'</p>';
                    break;
                    case 'text':
                    dom+='<p>'+tv+'</p>';
                    break;
                    case 'img':
                    dom+='<img src="'+tv+'" />'
                    break;
                    case 'address':
                    dom+='<p>地址：'+tv.address+'</p>'+'<p>精度：'+tv.longitude+'</p>'+'<p>纬度：'+tv.latitude+'</p>'+'<p>城市：'+tv.city+'</p>';
                    break;
                    case 'radio':
                    dom+='<p>'+cur_map[i].radio[tv]+'</p>';
                    break;
                    case 'date':
                    dom+='<p>'+new Date(tv).toLocaleDateString()+'</p>';
                    break;
                    case 'datetime':
                    dom+='<p>'+new Date(tv).toLocaleString()+'</p>';
                    break;
                    case 'parentMessage':
                    var tmp_radio={
                        '0':'女',
                        '1':'男'
                    };
                    dom+='<p>ID：'+tv._id+'</p>'+
                    '<p>孩子年级：'+tv.childGrade+'</p>'+
                    '<p>孩子性别：'+tmp_radio[tv.childGender]+'</p>'+
                    '<p>订单数量：'+tv.bookCount+'</p>';
                    break;
                    case 'teacherMessage':
                    
                    var tmp_dom="";
                    tmp_dom='<div class="myWrap"><p><strong>ID</strong></p>'+
                    '<p>'+tv._id+'</p>'+
                    '<p><strong>身份证号</strong></p>'+
                    '<p>'+tv.idCard+'</p>'+
                    '<p><strong>专业</strong></p>'+
                    '<p>'+tv.profession+'</p>'+
                    '<p><strong>免费交通区间</strong></p>'+
                    '<p>'+tv.freeTrafficTime+'</p>'+
                    '<p><strong>最小课程时间</strong></p>'+
                    '<p>'+tv.minCourseTime+'</p>'+
                    '<p><strong>已授课时间</strong></p>'+
                    '<p>'+tv.hadTeach+'</p>'+
                    '<p><strong>交通补贴</strong></p>'+
                    '<p>'+tv.subsidy+'</p>'+
                    '<p><strong>学校</strong></p>'+
                    '<p>'+tv.school+'</p>'+
                    '<p><strong>教学个数</strong></p>'+
                    '<p>'+tv.teachCount+'</p>'+
                    '<p><strong>最大交通区间</strong></p>'+
                    '<p>'+tv.maxTrafficTime+'</p>'+
                    '<p><strong>简历</strong></p>'+
                    '<p>'+tv.profile+'</p>'+
                    '<p><strong>评分</strong></p>'+
                    '<p>'+tv.score+'</p>'+
                    '<p><strong>奖励</strong></p>'+
                    '<p>'+tv.rewards+'</p>'+
                    '<p><strong>天使计划</strong></p>'+
                    '<p>男孩：'+tv.angelPlan.boy+'</p>'+
                    '<p>女孩：'+tv.angelPlan.girl+'</p>'+
                    '<p>价格：'+tv.angelPlan.price+'</p>'+
                    '<p>是否参加：'+(tv.angelPlan.join?'是':'否')+'</p>'+
                    '<p><strong>是否已锁定</strong></p>'+
                    '<p>'+(tv.isLock?'是':'否')+'</p>'+
                    '<p><strong>是否已审核</strong></p>'+
                    '<p>'+(tv.isChecked?'是':'否')+'</p>'+
                    '<p><strong>不计入时间</strong></p>'+
                    '<p>'+tv.disCountTime+'</p>'+
                    '<p><strong>能力评分</strong></p>'+
                    '<p>'+tv.ability+'</p>'+
                    '<p><strong>接受的儿童</strong></p>'+
                    '<p>'+tv.childAccept+'</p>'+
                    '<p><strong>准时分数</strong></p>'+
                    '<p>'+tv.punctualScore+'</p>'+
                    '<p><strong>评论数</strong></p>'+
                    '<p>'+tv.commentCount+'</p>'+
                    '<p><strong>授课总时间</strong></p>'+
                    '<p>'+tv.teachTime+'</p>'+
                    '<p><strong>官方认证</strong></p>'+
                    '<img src="'+tv.images.official+'">'+
                    '<p><strong>身份证照片</strong></p>'+
                    '<img src="'+tv.images.idCard+'">'+
                    '<p><strong>学生证照片</strong></p>'+
                    '<img src="'+tv.images.studentCard+'">'+
                    '</div>';
                    dom+=tmp_dom;
                    break;
                }
            }
        }
        $('#app-modal-cont').html(dom);
        
        var formDom="";
        switch(this.cur_route.func){
            case null:
            break;
            case '审核用户':
            formDom='<form onSubmit="return false" data-url="/Teacher/Check"><input type="hidden" name="teacherId" value="'+cur_data._id+'"><br /><button type="submit" class="btn btn-default" data-class="btn-move">审核用户</button></form>';
            break;
            case '推广上线':
            formDom='<form onSubmit="return false" data-url="/Order/Discount/Check"><input type="hidden" name="orderId" value="'+cur_data._id+'"><input type="hidden" name="isShow" value="true"><br /><button type="submit" class="btn btn-default" data-class="btn-move">推广上线</button></form>';
            break;
            case '推广下线':
            formDom='<form onSubmit="return false" data-url="/Order/Discount/Check"><input type="hidden" name="orderId" value="'+cur_data._id+'"><input type="hidden" name="isShow" value="false"><br /><button type="submit" class="btn btn-default" data-class="btn-move">推广下线</button></form>';
        }
        $('#app-modal-cont').append(formDom);
    },
    
    
    
    
    
    
    
    init:function(){
        //app数据源
        var pthis = this;
        
        //@folder
        $('[data-class="folder"] h4').click(function(){
            var tselector= $(this).children('span');
            var cont=tselector.html();
            if(cont=='-'){
                tselector.html('+');
            }else{
                tselector.html('-');
            }
            $(this).parent().children('ul').toggle();
        });
        
        //@item 处理列表项被点击时发生的事情
        $('body').on('click', '[data-class="item"] tbody tr', function() {
            var id = $(this).attr('data-id');
            pthis.data = pthis.datas[id];
            pthis.pos4del = id;

            pthis.reload_modal();
            $('#app-modal').modal();
        });
        
        //@btn-send 处理发送消息事件
        $('body').on('click','[data-class="btn-send"]',function(){
            var $btn = $(this).button('loading');
            
            var tmp=getFormJson($(this).parent());
            tmp.token=window.tmptoken;
            
            var url=$(this).parent().attr('data-url');
            
            $.ajax({
                url: window.rootUrl+url,
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                
                if(data.result=='success'){
                    alert('发送成功');
                }else{
                    alert('发送失败！');
                }
                $btn.button('reset');
            }).fail(function(data, status, jqXHR){
               alert('请求失败！');
               $btn.button('reset');
            });
            
        });
        
        //@btn-move 处理位置转移事件
        $('body').on('click','[data-class="btn-move"]',function(){
            var $btn = $(this).button('loading');
            
            var tmp=getFormJson($(this).parent());
            if(tmp.isShow=="false"){
                tmp.isShow=false;
            }else if(tmp.isShow=="true"){
                tmp.isShow=true;
            }
            
            tmp.token=window.tmptoken;
            
            var url=$(this).parent().attr('data-url');
            
            $.ajax({
                url: window.rootUrl+url,
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                
                if(data.result=='success'){
                    pthis.datas.splice(pthis.pos4del,1);
                    
                    pthis.reload_table();
                    $('#app-modal-cont').html('执行成功，请关闭此窗口');
                }else{
                    alert('执行失败！');
                }
                $btn.button('reset');
            }).fail(function(data, status, jqXHR){
               alert('请求失败！');
               $btn.button('reset');
            });
        });
        
        //@btn-modify
        $('body').on('click','[data-class="btn-modify"]',function(){
            var $btn = $(this).button('loading');
        
            function trim(str){
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }
            var paras = $(this).parent().serializeArray();
            var tmp = {};
            for(var i in paras){
                var ele = paras[i];
                
                if(trim(ele.value).length != 0){
                    var name_arr = ele.name.split(".");
                    
                    var cur = tmp;
                    for(var j in name_arr){
                        if( j == name_arr.length-1){
                            cur[name_arr[j]] = ele.value;
                        }else{
                            if(cur[name_arr[j]] == undefined){
                                cur[name_arr[j]] = {};
                                cur = cur[name_arr[j]];
                            }else{
                                cur = cur[name_arr[j]];
                            }
                        }
                    }
                }
            }
            
            tmp.token=window.tmptoken;
            var url=$(this).parent().attr('data-url');
            
            $.ajax({
                url: window.rootUrl+url,
                dataType: 'json',
                data:JSON.stringify(tmp),
                type:'POST',
                contentType: "application/json; charset=utf-8"
            }).done(function(data, status, jqXHR){
                
                if(data.result=='success'){
                    alert('发送成功');
                }else{
                    alert('发送失败！');
                }
                $btn.button('reset');
            }).fail(function(data, status, jqXHR){
               alert('请求失败！');
               $btn.button('reset');
            });
        });
        
        //#app-nav,#app-cont
        $('#app-nav li').click(function(){
            //菜单选中的样式
            $('#app-nav li').removeClass('active');
            $(this).addClass('active');
            
            var route_info = pthis.route_infos[$(this).attr('data-id')];
            //设置bread
            var compiled=_.template('<% arr.forEach(function(item){ %><li><%- item %></li><% }) %>');
            var dom=compiled( {arr:route_info.bread} );
            $("#app-bread").html(dom);
            
            //设置正文
            $('#app-cont').html('');
            this.data=null;
            this.datas=null;
            this.cur_route=null;
            
            switch(route_info.cont){
                //TABLE
                case 'table':
                $.ajax({
                    url:window.rootUrl+route_info.url+'&token='+window.tmptoken,
                    dataType: 'json'
                    
                }).done(function(data, status, jqXHR){
                    if(data.result=="success"){
                        pthis.datas = data.data;
                        pthis.cur_route = route_info;
                    
                        pthis.init_table();
                    }else{
                        alert('服务器错误!');
                    }
                    
                }).fail(function(data, status, jqXHR){
                    alert('请求失败！');
                });
                break;
                //SENDER
                case 'sender':
                var dom='<form onSubmit="return false" data-url="'+route_info.url+'"><div class="form-group">'+
                '<label>发送内容</label><textarea class="form-control" rows="3" name="content"></textarea></div>'+
                '<div class="form-group"><label>发送对象</label><br /><label class="radio-inline"><input type="radio" name="type" value="1" checked="checked" />家教</label><label class="radio-inline"><input type="radio" name="type" value="2" />家长</label><label class="radio-inline"><input type="radio" name="type" value="3" />全部</label>'+
                '</div><button type="submit" class="btn btn-default" data-class="btn-send">提交消息</button></form>';
                
                $('#app-cont').html(dom);
                break;
                //PAGE
                case 'page':
                $.ajax({
                    url:window.rootUrl+route_info.url+'token='+window.tmptoken,
                    dataType: 'json'
                    
                }).done(function(data, status, jqXHR){
                    if(data.result=="success"){
                        var dom='<p><strong>标题</strong></p>'+
                        '<p>'+data.data.specialText.line1+'</p>'+
                        '<p><strong>副标题</strong></p>'+
                        '<p>'+data.data.specialText.line2+'</p>'+
                        '<p><strong>正文</strong></p>'+
                        '<p>'+data.data.specialText.line3+'</p>'+
                        '<p><strong>底部文字</strong></p>'+
                        '<p>'+data.data.specialText.bottomText+'</p>'+
                        '<p><strong>侧边栏底部文字</strong></p>'+
                        '<p>'+data.data.sidebarBottomText.replace(/\n/g,'<br />')+'</p>';
                
                        $('#app-cont').html(dom);
                    }else{
                        alert('服务器错误!');
                    }
                    
                }).fail(function(data, status, jqXHR){
                    alert('请求失败！');
                });
                break;
                //Modify
                case 'modify':
                var dom='<form onSubmit="return false" data-url="'+route_info.url+'">';
                
                for(var i in route_info.modify_map){
                    var modify_item = route_info.modify_map[i];
                    if(modify_item.name == "侧边栏底部文字"){
                        dom+='<div class="form-group"><label>'+modify_item.name+'</label><textarea rows="3" class="form-control" name="'+modify_item.key+'"></textarea></div>';
                        continue;
                    }
                    dom+='<div class="form-group"><label>'+modify_item.name+'</label><input class="form-control" name="'+modify_item.key+'" type="text" /></div>';
                }
                
                dom+='<button type="submit" class="btn btn-default" data-class="btn-modify">提交修改</button></form>';
                
                $('#app-cont').html(dom);
                break;
            }
        });
        
        /*
            table相关的四个区域
        */
        //>>#table-page
        $('body').on('click','#table-page li',function(){
            var id=$(this).attr('data-id');
            
            $('#table-page li').removeClass('active');
            $(this).addClass('active');
            
            $('#table-output tbody tr').hide();
            for(var i=20*id;i!=20*(id+1);i++){
                if(i>=pthis.datas.length)
                    break;
                else{
                    $('#table-output tbody tr[data-id="'+i+'"]').show();
                }
            }
            
        });
        //>>#table-search
        $('body').on('click','#table-search',function(){
            var input=$('#table-input').val();
            if(input.length==0){
                pthis.reload_table();
            }else{
                $('#table-output tbody tr').hide();
                $('#table-page').html('');
                var patt=new RegExp(input);
                
                for(var i in pthis.datas){
                    for(var j in pthis.datas[i]){
                        if(typeof pthis.datas[i][j]!='object' && patt.test(pthis.datas[i][j])){
                            $('#table-output tbody tr[data-id="'+i+'"]').show();
                            break;
                        }
                    }
                }
            }
        });
        //>>#table-export
        $('body').on('click','#table-export',function(){
            //把json转成固定长度的表格
            var fm = pthis.cur_route.fill_map;
            var new_datas = new Array(pthis.datas.length);
            for(var i in pthis.datas){
                var e = pthis.datas[i];
                var ne = {};
                
                for(var j in fm){
                    var kv=fm[j];
                    var old_value;
                    
                    if(kv.key instanceof Array){
                        if(e[kv.key[0]] != undefined){
                            old_value = e;
                            for(var k in kv.key){
                                old_value = old_value[kv.key[k]];
                            }
                        }else{
                            old_value = undefined;
                        }
                    }else{
                        old_value=e[kv.key];
                    }
                    
                    if(old_value == undefined)
                        ne[kv.value]='';
                    else
                        ne[kv.value]=old_value;
                }
                new_datas[i]=ne;
            }
            
            JSONToCSVConvertor(new_datas, pthis.cur_route.bread[1], true);
        });        
        
        //>>@btn-upload
        // $('body').on('change','[data-class="btn-upload"]',function(){
        //     //input1:文件二进制
        //     var tmp=new FormData();
        //     tmp.append('file',this.files[0]);
            
        //     var pthis=$(this);
        //     //获取token
        //     $.ajax({
        //         type: 'GET',
        //         url: '/Share/OnlineParams',
        //         dataType: 'json'
        //     }).done(function(data, status, jqXHR){
                
        //         //input2:token
        //         tmp.append('token',data.data.token);
        //         //得到token之后进行上传
        //         $.ajax({
        //             type: 'POST',
        //             enctype: 'multipart/form-data',
        //             url: 'http://upload.qiniu.com/',
        //             dataType: 'json',
        //             data:tmp
        //         }).done(function(data, status, jqXHR){
        //             //设置图片链接以及预览
        //             pthis.next().val(data.key);
        //             pthis.prev().attr('src',data.key)
        //         }).fail(function(data, status, jqXHR){
        //             alert('上传失败！');
        //         });
                
        //     }).fail(function(){
        //         alert('上传失败！');
        //     });
        // });
        
        //>>模拟点击第一个菜单
        $('#app-nav [data-id="14"]').click();
    },
    start:function(){
        var pthis=this;
        $('#btn-login').click(function(){
            var $btn = $(this).button('loading');
            
            var tmp=getFormJson($(this).parent());
            tmp.password=$.md5(tmp.password);
            
            var url=$(this).parent().attr('data-url');
            
            $.ajax({
                url: window.rootUrl+'/Manager/Login',
                dataType: 'json',
                data:tmp
            }).done(function(data, status, jqXHR){
                
                if(data.result=='success'){
                    window.tmptoken=data.data.token;
                    pthis.init();
                    $('#app-login').hide();
                    $('#app').show();
                }else{
                    alert('登陆失败！');
                }
                $btn.button('reset');
            }).fail(function(data, status, jqXHR){
               alert('请求失败！');
               $btn.button('reset');
            });
        });
    }
		
}

var app=new App();
app.start();