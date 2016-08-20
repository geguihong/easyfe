//Bookmark:分页表
var PaginationTable = Vue.extend({
    props:['postDatas','header','actions'],
    data:function() {
        Store.tmpHeader = this.header;

        this.datas = [];
        for(var i=0;i!==this.postDatas.length;i++) {
            this.datas.push(this.postDatas[i]);
        }
        tmpPages = this.chunk(this.datas,10);
        return {
            pages: tmpPages,
            currentPage:0,
            keyword: '',
        };
    },
    template: "<form class=\"form-inline\" onSubmit=\"return false\">\n                    <div class=\"form-group\">\n                        <input type=\"text\" class=\"form-control\" v-model=\"keyword\">\n                    </div>\n                    <button v-on:click=\"search()\" type=\"submit\" class=\"btn btn-default\">搜索</button>\n                    <div style=\"float:right;\"><safe-lock text=\"解锁导出按钮\"><button v-on:click=\"exportTable()\" type=\"submit\" class=\"btn btn-default\">全部导出</button></safe-lock></div>\n                </form>\n                <div class=\"table-responsive\">\n                    <table class=\"table table-hover\">\n                        <thead><tr><th>操作</th><th v-for=\"cell in header\">{{cell.name}}</th></tr></thead>\n                        <tbody><tr is=\"action-row\" v-for=\"item in pages[currentPage]\" :post-data=\"item.arr\" :pre-data=\"item.obj\" :actions=\"actions\"></tr></tbody>\n                    </table>\n                </div>\n                <ul class=\"pagination\"><li v-for=\"page in pages\" v-on:click=\"changePage($index)\" :class=\"{'active':$index===currentPage}\"><a>{{$index+1}}</a></li></ul>",
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
            Store.ArrayToCSVConvertor(this.datas,this.header);
        },
        search: function() {
            if (this.keyword === '') {
                this.pages = this.chunk(this.datas,10);
                this.currentPage = 0;
                return ;
            }
            
            var nD = [];
            for(var i in this.datas){
                for(var j in this.datas[i].arr){
                    if(this.datas[i].arr[j].toString().indexOf(this.keyword) >= 0){
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