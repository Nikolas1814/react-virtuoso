(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{147:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(159),i=n(160),c=(n(157),n(162)),u=n(156),l=n(163),s=function(){return r.a.createElement(c.b,{style:{width:"100%",height:"400px"},totalCount:100,item:function(e){var t=Object(u.b)(e),n=e+1+". "+t.name;return r.a.createElement(l.d,{even:e%2==0},r.a.createElement(l.a,{style:{color:t.fgColor,backgroundColor:t.bgColor}},t.initials),r.a.createElement(l.e,{title:n},t.longText))},footer:function(){return r.a.createElement("div",{style:{padding:"1rem",textAlign:"center"}},"-- end reached --")}})};t.default=function(){return r.a.createElement(o.a,{sidebar:function(){return r.a.createElement(i.a,{path:"AutoResizing"})}},r.a.createElement("h2",null,"Automatic Resizing"),r.a.createElement("p",null,"The Virtuoso component will automatically handle changes of the items' heights (due to content being resized, images being loaded, etc). You don't have to configure anything additional."),r.a.createElement("p",null,"Resize your browser and scroll the list around – the items reposition correctly without overlap."),r.a.createElement(s,null))}},156:function(e,t,n){"use strict";n.d(t,"b",function(){return c}),n.d(t,"a",function(){return u});n(161),n(74),n(55),n(34),n(164),n(165),n(157);var a=n(166),r=n.n(a),o=n(167),i=[],c=function(e){if(!i[e]){var t=r.a.name.firstName(),n=r.a.name.lastName();i[e]={name:t+" "+n,initials:""+t.substr(0,1)+n.substr(0,1),description:r.a.company.catchPhrase(),bgColor:r.a.commerce.color(),fgColor:r.a.commerce.color(),longText:r.a.lorem.paragraphs(4),avatar:r.a.internet.avatar()}}return i[e]},u=function(e){for(var t=[],n=0;n<e;n++)t.push(c(n));t.sort(function(e,t){return e.name<t.name?-1:e.name>t.name?1:0});var a=Object(o.groupBy)(t,function(e){return e.name[0]});return{users:t,groupCounts:Object.values(a).map(function(e){return e.length}),groups:Object.keys(a)}}}}]);
//# sourceMappingURL=component---src-pages-auto-resizing-js-1eb6cb129eca44ea42cb.js.map