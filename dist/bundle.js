!function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var l="function"==typeof require&&require;if(!u&&l)return l(i,!0);if(a)return a(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var s=n[i]={exports:{}};t[i][0].call(s.exports,function(e){var n=t[i][1][e];return o(n?n:e)},s,s.exports,e,t,n,r)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t,n,r){r.html5Mode(!1),n.when("/",{controller:"moController"}).when("/:language/",{controller:u.HomeController,controllerAs:"home",templateUrl:"../monad/templates/home.html"}).when("/:language/login/",{controller:l.LoginController,controllerAs:"login",templateUrl:"../monad/templates/login.html"}),e.useLoader("$translatePartialLoader",{urlTemplate:"{part}/i18n/{lang}.json"}),e.preferredLanguage("en"),t.addPart("../monad")}Object.defineProperty(n,"__esModule",{value:!0});var a=e("./classes/Monad"),i=e("./controllers/RootController"),u=e("./controllers/HomeController"),l=e("./controllers/LoginController"),c=e("./services/Navigation"),s=e("./services/Authentication"),d=e("./services/Language"),f=e("./helpers/post"),g=r(f),p=e("./directives/angular"),v=r(p),m="monad.core";angular.module(m,["ng","ngRoute","pascalprecht.translate","ngSanitize","ui.bootstrap",v["default"]]).config(["$translateProvider","$translatePartialLoaderProvider","$routeProvider","$locationProvider",o]).run(["$http","$rootScope","$translate","$route","$cacheFactory",function(e,t,n,r,o){g["default"](e),t.$on("$translatePartialLoaderStructureChanged",function(){return n.refresh()}),r.reset=function(){var e=o.info();for(var t in e)"templates"!=t&&o.get(t).removeAll()}}]).controller("moController",i.RootController).service("moNavigation",c.Navigation).service("moAuthentication",s.Authentication).service("moLanguage",d.Language).value("title","Default generic administrator").value("languages",["en","nl"]).value("theme","../monad/default.css"),window.monad=new a.Monad;var h=angular.bootstrap;angular.bootstrap(function(){for(var e=arguments.length,t=Array(e),n=0;e>n;n++)t[n]=arguments[n];window.monad.bootstrap(),h.apply(void 0,t)}),n["default"]=m,t.exports=n["default"]},{"./classes/Monad":2,"./controllers/HomeController":3,"./controllers/LoginController":4,"./controllers/RootController":5,"./directives/angular":6,"./helpers/post":16,"./services/Authentication":17,"./services/Language":18,"./services/Navigation":19}],2:[function(e,t,n){},{}],3:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function a(e){r(this,a),this.dashboard="../monad/templates/dashboard.html"};o.$inject=["$http"],n.HomeController=o},{}],4:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=void 0,i=void 0,u=function(){function e(t,n){r(this,e),a=n,i=t}return o(e,[{key:"attempt",value:function(e){a.login(this.username,this.password).success(function(t){i.path("/"+e+"/")})}}]),e}();u.$inject=["$location","moAuthentication"],n.LoginController=u},{}],5:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=void 0,i=void 0,u=void 0,l=void 0,c=void 0,s=void 0,d=function(){function e(t,n,o,d,f,g,p,v,m,h){var b=this;r(this,e),a=t,i=f,u=g,l=d,c=p,s=angular.extend({resize_enabled:!1,bodyClass:"editable",forcePasteAsPlainText:!0,docType:"<!doctype html>",entities:!1,entities_greek:!1,toolbar:"Full",disableNativeSpellChecker:!0},h),this.title=v,this.loginRequired=this.loginRequired||!0,this.theme=m,g.current(),n.$on("$routeChangeStart",function(){return b.Authentication.read().success(function(e){!b.Authentication.isAuthenticated()&&b.loginRequired&&a.path("/"+(c.current||c.list[0])+"/login/")})}),n.$on("$routeChangeSuccess",function(e,t){t.params.language&&(s.language=t.params.language),c.current||a.path("/"+c.list[0]+"/")})}return o(e,[{key:"Authentication",get:function(){return i}},{key:"Navigation",get:function(){return u}},{key:"language",get:function(){return c.current}},{key:"languages",get:function(){return c.list}},{key:"ckeditor",value:function(){var e=void 0===arguments[0]?{}:arguments[0];return angular.extend({},s,e)}},{key:"logout",value:function(){var e=this;this.Authentication.logout().success(function(){return a.path("/"+e.language+"/login/")})}},{key:"url",value:function(){return a.path()}},{key:"license",value:function(){l.open({template:'\n<div class="modal-header">\n    <h3 class="modal-title">{{\'monad.license\' | translate}}</h3>\n</div>\n<div class="modal-body">\n    <p><strong>{{\'monad.license.note\' | translate}}</strong></p>\n    <p ng-repeat="paragraph in paragraphs">{{paragraph}}</p>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-primary" ng-click="ok()">{{\'monad.license.ok\' | translate}}</button>\n</div>',controller:["$scope","$modalInstance","$http",function(e,t,n){n.get("../monad/LICENSE.txt").success(function(t){e.paragraphs=t.split("\n\n")}),e.ok=t.close}]})}}]),e}();d.$inject=["$location","$rootScope","$translate","$modal","moAuthentication","moNavigation","moLanguage","title","theme","ckeditor"],n.RootController=d},{}],6:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0});var o=e("./list/header/directive"),a=r(o),i=e("./list/table/directive"),u=r(i),l=e("./path"),c=r(l),s=e("./field/directive"),d=r(s),f=e("./update/directive"),g=r(f),p=e("./draggable/directive"),v=r(p),m=e("./list"),h=r(m),b=e("./slug"),y=r(b);angular.module("monad.directives",["ng"]).directive("moList",h["default"]).directive("moListHeader",a["default"]).directive("moListTable",u["default"]).directive("moPath",c["default"]).directive("moField",d["default"]).directive("moUpdate",g["default"]).directive("moDraggable",v["default"]).directive("moSlug",y["default"]),n["default"]="monad.directives",t.exports=n["default"]},{"./draggable/directive":7,"./field/directive":8,"./list":9,"./list/header/directive":10,"./list/table/directive":12,"./path":13,"./slug":14,"./update/directive":15}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=void 0;n["default"]=function(){function e(e,t,n){t.attr("draggable","true"),t.bind("dragstart",function(t){r=e.item,t.originalEvent.dataTransfer.effectAllowed="move",t.originalEvent.dataTransfer.setData("json/custom-object",e.item)}),t.bind("dragenter",function(e){t.addClass("over")}),t.bind("dragover",function(e){return e.originalEvent.preventDefault&&e.originalEvent.preventDefault(),e.originalEvent.dataTransfer.dropEffect="move",!1}),t.bind("dragleave",function(e){t.removeClass("over")}),t.bind("drop",function(t){return t.originalEvent.stopPropagation()&&t.originalEvent.stopPropagation(),r!=e.item&&e.$apply(function(){var t=e.list.indexOf(r),o=e.list.indexOf(e.item),a=n.sort;e.track&&(angular.isArray(e.track)?e.track:[e.track]).map(function(n){e.list[t][n]=e.list[o][n]}),e.list.splice(o,0,e.list.splice(t,1).shift()),e.list.map(function(e,t){e[a]=t})}),!1}),t.bind("dragend",function(e){t.parent().find(".over").removeClass("over")})}return{restrict:"A",scope:{item:"=moDraggable",list:"=",track:"="},link:e}},t.exports=n["default"]},{}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){return{restrict:"E",template:'<div class="form-group">\n    <label>{{label}}</label>\n    <span ng-transclude></span>\n</div>',link:function(e,t,n){t.find("input, textarea, select").addClass("form-control")},scope:{label:"="},transclude:!0}},t.exports=n["default"]},{}],9:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){return{restrict:"EA",scope:{module:"@",columns:"=",path:"@"},controller:["$scope",function(e){}],controllerAs:"list",bindToController:!0}},t.exports=n["default"]},{}],10:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){return{require:"^moList",restrict:"E",templateUrl:"../monad/directives/list/header/template.html",scope:{create:"@"},transclude:!0,link:function(e,t,n,r){e.module=r.module}}},t.exports=n["default"]},{}],11:[function(e,t,n){"use strict"},{}],12:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./controller");n["default"]=function(){return{require:"^moList",restrict:"E",templateUrl:"../monad/directives/list/table/template.html",scope:{rows:"=",total:"@",page:"="},controller:r.Controller,link:function(e,t,n,r){e.columns=r.columns,e.module=r.module,e.path=r.path},bindToController:!0}},t.exports=n["default"]},{"./controller":11}],13:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=["$route","$location","moLanguage",function(e,t,n){function r(e,t,n){for(var r in n)t=t.replace(":"+r,n[r]);e.attr("href","#"+t.replace(/^#/,""))}return{restrict:"A",link:function(o,a,i){var u=e.current?e.current.params:{},l=e.current?e.current.originalPath:t.path().replace(/^\/[a-z]{2}\//,"/:language/"),c=i.moPath||l;if(c){var s=i.arguments?o.$eval(i.arguments):{};s.language=u.language?s.language||u.language:s.language||n.current;for(var d in e.routes){var f=(e.routes[d].controller||"")+"";if(f.toLowerCase()==c.toLowerCase())return r(a,d,s)}return r(a,c,s)}}}}],t.exports=n["default"]},{}],14:[function(e,t,n){"use strict";function r(e){return e?("normalize"in String&&(e=e.normalize("NFKD").replace(/[\u0300-\u036F]/g,"")),e=e.toLowerCase().replace(/\s+/g,"-"),e=e.replace(/[^a-z0-9-]+/g,"-"),e=e.replace(/-{2,}/g,"-"),e=e.replace(/^-/,""),e=e.replace(/-$/,"")):e}Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){return{restrict:"A",require:"ngModel",scope:{source:"=moSlug",target:"=ngModel"},link:function(e,t,n,o){t.attr("pattern","[a-z0-9-]{1,255}"),e.$watch("source",function(t,n){e.target=r(t)}),o.$parsers.unshift(function(e){return e=r(e)}),o.$formatters.unshift(function(e){return o.$setValidity("moSlug",!0),e=r(e)}),t.on("blur keyup change",function(){return e.target=r(t.value())})}}},t.exports=n["default"]},{}],15:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(){return{restrict:"E",templateUrl:"../monad/directives/update/template.html",transclude:!0,scope:{save:"&onSave","delete":"&onDelete",item:"=",module:"@",list:"@"}}},t.exports=n["default"]},{}],16:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(e){function t(e){var n,r,o,a,i,u,l,c="";for(n in e)if(r=e[n],r instanceof Array)for(l=0;l<r.length;++l)i=r[l],o=n+"["+l+"]",u={},u[o]=i,c+=t(u)+"&";else if(r instanceof Object)for(a in r)i=r[a],o=n+"["+a+"]",u={},u[o]=i,c+=t(u)+"&";else c+=void 0!==r&&null!==r?encodeURIComponent(n)+"="+encodeURIComponent(r)+"&":encodeURIComponent(n)+"=&";return c.length?c.substr(0,c.length-1):c}delete e.defaults.headers.common["X-Requested-With"],e.defaults.withCredentials=!0,e.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded;charset=utf-8",e.defaults.transformRequest=[function(e){return angular.isObject(e)&&"[object File]"!==String(e)?t(e):e}]},t.exports=n["default"]},{}],17:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=function(){function e(){r(this,e)}return o(e,[{key:"read",value:function(){throw"Authentication.read must be replaced by your custom implementation."}},{key:"login",value:function(e,t){throw"Authentication.login must be replaced by your custom implementation."}},{key:"logout",value:function(){throw"Authentication.logout must be replaced by your custom implementation."}},{key:"isAuthenticated",value:function(){return!1}}]),e}();n.Authentication=a},{}],18:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=void 0,i=void 0,u=function(){function e(t,n,o){r(this,e),i=t,o.$on("$routeChangeSuccess",function(e,t){t.params.language&&t.params.language!=a&&(a=t.params.language,n.refresh()),n.use(a)})}return o(e,[{key:"current",get:function(){return a},set:function(e){if(-1==i.indexOf(e))throw'Language "'+e+'" is unavailable, sorry.';a=e}},{key:"list",get:function(){return i}}]),e}();u.$inject=["languages","$translate","$rootScope"],n.Language=u},{}],19:[function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a={},i=void 0,u=function(){function e(){var t=void 0===arguments[0]?void 0:arguments[0];r(this,e),t&&(i=t)}return o(e,[{key:"register",value:function(e,t,n){var r=!1;a[e]=a[e]||[],a[e].push({url:t,label:n,selected:r}),this.hasOwnProperty(e)||Object.defineProperty(this,e,{get:function(){return a[e]}})}},{key:"current",value:function(){for(var e in a)a[e].map(function(e){return e.selected="/"!=e.url&&-1!=("#"+i.path()).indexOf(e.url)})}},{key:"select",value:function(){var e=void 0===arguments[0]?{}:arguments[0];for(var t in a)a[t].map(function(e){return e.selected=!1});e.selected=!0}},{key:"main",get:function(){return a.main}}]),e}();u.$inject=["$location"],n.Navigation=u},{}]},{},[1]);