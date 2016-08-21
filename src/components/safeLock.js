//Bookmark:安全锁
var safeLock = Vue.extend({
    props: ['text'],
    data: function() {
        return {
            safeLock: true,
            safeLockPsw: '',
        };
    },
    template:"<template v-if=\"safeLock\">\n"+
                    "<form class=\"form-inline\" onSubmit=\"return false\">"+
                        "<input class=\"form-control\" placeholder=\"请输入安全码...\" type=\"password\" v-model=\"safeLockPsw\" />\n"+
                        "<button class=\"btn btn-default\" v-on:click=\"unlock()\">{{text}}</button>"+
                    "</form>"+
                    "</template>"+
                    "<template v-if=\"!safeLock\">\n"+
                        "<slot>按钮失效</slot>\n"+
                    "</template>",
    methods:{
        unlock: function() {
            if (this.safeLockPsw === Store.safeLockPsw) {
                this.safeLock = false;
            } else {
                alert('安全码错误！');
            }
        },
    },
});
Vue.component('safe-lock', safeLock);