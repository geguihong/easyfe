//Bookmark:分页表
var PaginationTable = Vue.extend({
    props:['list','header','actions','fileName'],
    data:function() {
        this.datas = [];
        for(var i=0;i!==this.list.length;i++) {
            this.datas.push(this.list[i]);
        }
        tmpPages = this.chunk(this.datas,10);
        return {
            pages: tmpPages,
            currentPage:0,
            keyword: '',
        };
    },
    template: "<form class=\"form-inline\" onSubmit=\"return false\">"+
                "<input type=\"text\" class=\"form-control\" v-model=\"keyword\">"+
                "<button v-on:click=\"search()\" type=\"submit\" class=\"btn btn-default\">搜索</button>"+
                "<div style=\"float:right;\"><safe-lock text=\"解锁导出按钮\"><button v-on:click=\"exportTable()\" type=\"submit\" class=\"btn btn-default\">全部导出</button></safe-lock></div>"+
            "</form>"+
            "<div class=\"table-responsive\">"+
                "<table class=\"table table-hover\" style=\"margin-top:50px;\">"+
                    "<thead><tr><th nowrap>操作</th><th nowrap v-for=\"cell in header\">{{cell.name}}</th></tr></thead>"+
                    "<tbody><tr is=\"action-row\" v-for=\"item in pages[currentPage]\" :header=\"header\" :pre-data=\"item\" :actions=\"actions\"></tr></tbody>"+
                "</table>"+
            "</div>"+
            "<ul class=\"pagination\"><li v-for=\"page in pages\" v-on:click=\"changePage($index)\" :class=\"{'active':$index===currentPage}\"><a>{{$index+1}}</a></li></ul>",
    methods:{
        chunk: function (array, size) {
            var result = [];
            for (var x = 0; x < Math.ceil(array.length / size); x++) {
                var start = x * size;
                var end = start + size;
                result.push(array.slice(start, end));
            }
            return result;
        },
        changePage: function(index) {
            this.currentPage = index;
        },
        exportTable: function() {
            var header = this.header;
            var arrData = [];
            for (var m = 0; m < this.list.length; m++) {
                arrData.push(Store.objToArray(this.header, this.list[m]));
            }

            var CSV = "";
        
            //添加header
            var row = "";
            for (var index in header) {
                row += header[index].name + ',';
            }
            row = row.slice(0, -1);
            CSV += row + '\r\n';
            
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                for (var index=0;index!==arrData[i].length;index++) {
                    if (header[index].stopAuto) {
                        row += '"\''+ arrData[i][index] + '",';
                    } else {
                        row += '"'+ arrData[i][index] + '",';
                    }
                }
                row = row.slice(0, row.length - 1);
                CSV += row + '\r\n';
            }

            if (CSV == '') {        
                alert("Invalid data");
                return;
            }   
            
            //文件名
            var fileName = this.fileName;

            //初始化文件
            var uri = 'data:text/csv;charset=gb2312,' + $URL.encode(CSV);
                
            //通过trick方式下载
            var link = document.createElement("a");    
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        search: function() {
            if (this.keyword === '') {
                this.pages = this.chunk(this.datas,10);
                this.currentPage = 0;
                return ;
            }
            
            var nD = [];
            for(var i in this.datas){
                var arr = Store.objToArray(this.header, this.datas[i]);
                for(var j in arr){
                    if(arr[j].toString().indexOf(this.keyword) >= 0){
                        nD.push(this.datas[i]);
                        break;
                    }
                }
            }

            this.pages = this.chunk(nD,10);
            this.currentPage = 0;
        }
    }
});
Vue.component('pagination-table',PaginationTable);