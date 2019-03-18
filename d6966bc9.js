Object.defineProperty(Object.prototype,"getProperty",{value:function(e){if(""===e)return this;let o,t=this,s=e.toString().split("."),a=s.length;for(o=0;o<a;o++){if(void 0===t[s[o]])return;t=t[s[o]]}return t}}),Object.defineProperty(Object.prototype,"setProperty",{value:function(e,o){let t,s=this,a=e.toString().split("."),n=a.length;for(t=0;t<n-1;t++)void 0===s[a[t]]&&(s[a[t]]={}),s=s[a[t]];s[a[n-1]]=o}}),Object.defineProperty(Object.prototype,"deleteProperty",{value:function(e){let o=this,t=e.toString().split(".");t.length>1&&(e=t[t.length-1],o=this.getProperty(t.slice(0,-1).join("."))),void 0!==o&&void 0!==o[e]&&delete o[e]}});var om={prefix:"",checkSidebarMedia:!1,toastDelay:5e3,toastPosition:"bottom right",url:"https://api.om.ua/",resources:{},actions:{get:{method:"GET"},list:{method:"GET",isArray:!0},post:{method:"POST"},put:{method:"PUT"},delete:{method:"DELETE"}},langs:{ru:{signup_in_progress:"Выполняется регистрация...",signin_in_progress:"Выполняется вход...",signin_success:"Вход успешно выполнен от имени",signout_in_progress:"Выполняется выход...",signout_success:"Выход выполнен успешно",saving:"Сохранение...",saved:"Сохранено"}},codes:{0:"Успешно",1:"Внутренняя ошибка",2:"Доступ запрещен",100:"Отсутствует обязательный параметр",200:"Адрес электронной почты уже зарегистрирован",201:"Имя пользователя уже зарегистрировано",300:"Неправильный пароль",400:"Имя пользователя или адрес электронной почты не найден",401:"Сессия не найдена",500:"Некорректный адрес электронной почты",501:"Некорректное имя пользователя",502:"Некорректный пароль",503:"Некорректное имя пользователя или адрес электронной почты",504:"Некорректный идентификатор сессии"},sha:async e=>{let o=new TextEncoder("utf-8").encode(e);return o=await crypto.subtle.digest("sha-512",o),(o=Array.from(new Uint8Array(o))).map(e=>("00"+e.toString(16)).slice(-2)).join("")},random:e=>{let o=new Uint8Array(e||1);return crypto.getRandomValues(o),(o=Array.from(o)).map(e=>("00"+e.toString(16)).slice(-2)).join("")},getLocal:(e,o)=>{e=om.prefix+e;let t=localStorage.getItem(e);return void 0===o||null===o?t:(t=null===t?{}:JSON.parse(t),""===o?t:t.getProperty(o))},setLocal:(e,o,t)=>{e=om.prefix+e;let s=localStorage.getItem(e);void 0!==o&&null!==o?(s=null===s?{}:JSON.parse(s),""===o?s=t:s.setProperty(o,t),localStorage.setItem(e,JSON.stringify(s))):localStorage.setItem(e,t)},removeLocal:(e,o)=>{if(e=om.prefix+e,void 0!==o&&null!==o&&""!==o){let t=localStorage.getItem(e);(t=null===t?{}:JSON.parse(t)).deleteProperty(o),localStorage.setItem(e,JSON.stringify(t))}else localStorage.removeItem(e)},resource:e=>{if(!om.resources[e]){var o;switch(e){case"sessions":case"tokens":o=om.$resource(om.url+e+"/:id",{},om.actions);break;default:o=om.$resource(om.url+e+"/:id",{id:"@id"},om.actions)}om.resources[e]=o}return om.resources[e]},message:(e,o)=>{om.$mdToast.show(om.$mdToast.simple().content(e).hideDelay(void 0!==o?o:om.toastDelay).position(om.toastPosition))},error:e=>{switch(e.data.code){case 403:om.del();break;default:e.config.url.endsWith("/tokens")||om.message(om.codes[e.data.code])}om.$scope.loading=!1},auth:()=>{if(!om.$location.path().startsWith("/auth"))return!1;om.message(om.lang.signin_in_progress,!1);var e=JSON.parse(atob(om.$location.hash()));return om.set(e),om.$location.url(e.url),!0},set:e=>{om.$scope.id=e.id,om.$scope.token=e.token,om.setLocal("id",null,e.id),om.setLocal("token",null,e.token),om.$http.defaults.headers.common["X-Auth-Token"]=e.token},get:()=>{om.$scope.id=om.getLocal("id"),om.$scope.id&&(om.$scope.session=om.getLocal("session"),om.$scope.token=om.getLocal("token"),om.$scope.account=om.getLocal("account",""),om.$http.defaults.headers.common["X-Auth-Token"]=om.$scope.token)},del:()=>{om.$scope.account={},delete om.$scope.id,delete om.$scope.session,delete om.$scope.token,om.removeLocal("id"),om.removeLocal("session"),om.removeLocal("token"),om.removeLocal("account"),delete om.$http.defaults.headers.common["X-Auth-Token"]},getToken:async()=>{if(om.$scope.token)return om.$scope.token;var e={};return om.$scope.session&&(e.session=om.$scope.session),await om.resource("tokens").post(e).$promise.then(e=>{om.set(e)}).catch(om.error),om.$scope.token},getAccount:async()=>{await om.getToken()&&await om.resource("accounts").get({id:om.$scope.id}).$promise.then(e=>{om.$scope.account=e,om.setLocal("account","",{id:e.id,gravatar:e.gravatar})}).catch(async e=>{e.data&&403==e.data.code&&(delete om.$scope.token,await om.getToken())?await om.getAccount():om.error(e)})},config:(e,o,t,s,a)=>{e.defaults.withCredentials=!0,o.html5Mode({enabled:!0,requireBase:!1}),t.disableWarnings(),s.defaultFontSet("FontAwesome").fontSet("fa","FontAwesome"),a.theme("default").primaryPalette("blue",{default:"700"})},init:async(e,o)=>{e.account={},om.$scope=e;var t=om.auth();om.get(),await om.getAccount(),t&&om.message(om.lang.signin_success+" "+(om.$scope.account.firstname||om.$scope.account.username)+" "+om.$scope.account.email),o&&o()},$om:{sidenav:!0,init:(e,o)=>{e.om=om.$om,om.init(e,o)},authHash:()=>btoa(JSON.stringify({origin:location.origin,base:document.getElementsByTagName("base")[0].getAttribute("href"),path:location.pathname})),isGt:()=>om.$mdMedia("gt-xs"),isLockedOpenSidenav:()=>om.$om.sidenav&&om.$mdMedia("gt-md"),route:e=>om.$location.path()==e,toggleSidenav:()=>{om.checkSidebarMedia&&om.$mdMedia("gt-md")?om.$om.sidenav=!om.$om.sidenav:om.$mdSidenav("left").toggle()}}};om.lang=om.langs.ru,angular.module("om",["ngMaterial","ngResource"]).factory("$om",["$http","$location","$mdMedia","$mdSidenav","$mdToast","$resource",(e,o,t,s,a,n)=>(om.$http=e,om.$location=o,om.$mdMedia=t,om.$mdSidenav=s,om.$mdToast=a,om.$resource=n,om.$om)]);var app=angular.module("app",["om","ngRoute"]);app.config(["$httpProvider","$locationProvider","$mdAriaProvider","$mdIconProvider","$mdThemingProvider","$routeProvider",function(t,e,o,i,r,n){om.config(t,e,o,i,r),n.when("/",{templateUrl:"/templates/root.html"}).when("/auth",{templateUrl:"/templates/auth.html"}).otherwise({redirectTo:"/"})}]),app.controller("controller",["$om","$scope",function(t,e){t.init(e),e.input={digits:!0,low:!0,high:!0,special:!1,len:16},e.generate=function(){var t="";e.input.digits&&(t+="0123456789"),e.input.low&&(t+="abcdefghijklmnopqrstuvwxyz"),e.input.high&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZ"),e.input.special&&(t+="()[]{}_=+-*/!|?^@&:;%$,."),e.output=[];let o,i,r,n=t.length;for(r=0;r<8;r++){for(i="";i.length<e.input.len;)o=new Uint8Array(1),crypto.getRandomValues(o),o[0]>n-1||(i+=t[o[0]]);e.output.push(i)}}}]);