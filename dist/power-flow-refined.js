var G=globalThis,B=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),bt=new WeakMap,T=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=bt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&bt.set(e,t))}return t}toString(){return this.cssText}},xt=i=>new T(typeof i=="string"?i:i+"",void 0,Z),O=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,n,o)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+i[o+1],i[0]);return new T(e,i,Z)},vt=(i,t)=>{if(B)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),n=G.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=e.cssText,i.appendChild(r)}},J=B?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return xt(e)})(i):i;var{is:ne,defineProperty:ie,getOwnPropertyDescriptor:se,getOwnPropertyNames:oe,getOwnPropertySymbols:ae,getPrototypeOf:le}=Object,F=globalThis,At=F.trustedTypes,ce=At?At.emptyScript:"",de=F.reactiveElementPolyfillSupport,z=(i,t)=>i,Q={toAttribute(i,t){switch(t){case Boolean:i=i?ce:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},wt=(i,t)=>!ne(i,t),Et={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:wt};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Et){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(t,r,e);n!==void 0&&ie(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){let{get:n,set:o}=se(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){let a=n?.call(this);o?.call(this,s),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Et}static _$Ei(){if(this.hasOwnProperty(z("elementProperties")))return;let t=le(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(z("properties"))){let e=this.properties,r=[...oe(e),...ae(e)];for(let n of r)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,n]of e)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let n=this._$Eu(e,r);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let n of r)e.unshift(J(n))}else t!==void 0&&e.push(J(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:Q).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let o=r.getPropertyOptions(n),s=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:Q;this._$Em=n;let a=s.fromAttribute(e,o.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,r,n=!1,o){if(t!==void 0){let s=this.constructor;if(n===!1&&(o=this[t]),r??=s.getPropertyOptions(t),!((r.hasChanged??wt)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:n,wrapped:o},s){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),o!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,o]of r){let{wrapped:s}=o,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[z("elementProperties")]=new Map,b[z("finalized")]=new Map,de?.({ReactiveElement:b}),(F.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,St=i=>i,j=ot.trustedTypes,kt=j?j.createPolicy("lit-html",{createHTML:i=>i}):void 0,Tt="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,Ot="?"+v,he=`<${Ot}>`,S=document,W=()=>S.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",at=Array.isArray,ue=i=>at(i)||typeof i?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Nt=/-->/g,Ct=/>/g,E=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Mt=/'/g,Rt=/"/g,zt=/^(?:script|style|textarea|title)$/i,lt=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),A=lt(1),m=lt(2),Ce=lt(3),k=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Pt=new WeakMap,w=S.createTreeWalker(S,129);function It(i,t){if(!at(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return kt!==void 0?kt.createHTML(t):t}var pe=(i,t)=>{let e=i.length-1,r=[],n,o=t===2?"<svg>":t===3?"<math>":"",s=I;for(let a=0;a<e;a++){let l=i[a],c,h,d=-1,u=0;for(;u<l.length&&(s.lastIndex=u,h=s.exec(l),h!==null);)u=s.lastIndex,s===I?h[1]==="!--"?s=Nt:h[1]!==void 0?s=Ct:h[2]!==void 0?(zt.test(h[2])&&(n=RegExp("</"+h[2],"g")),s=E):h[3]!==void 0&&(s=E):s===E?h[0]===">"?(s=n??I,d=-1):h[1]===void 0?d=-2:(d=s.lastIndex-h[2].length,c=h[1],s=h[3]===void 0?E:h[3]==='"'?Rt:Mt):s===Rt||s===Mt?s=E:s===Nt||s===Ct?s=I:(s=E,n=void 0);let f=s===E&&i[a+1].startsWith("/>")?" ":"";o+=s===I?l+he:d>=0?(r.push(c),l.slice(0,d)+Tt+l.slice(d)+v+f):l+v+(d===-2?a:f)}return[It(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},D=class i{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let o=0,s=0,a=t.length-1,l=this.parts,[c,h]=pe(t,e);if(this.el=i.createElement(c,r),w.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=w.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(Tt)){let u=h[s++],f=n.getAttribute(d).split(v),g=/([.?@])?(.*)/.exec(u);l.push({type:1,index:o,name:g[2],strings:f,ctor:g[1]==="."?rt:g[1]==="?"?nt:g[1]==="@"?it:M}),n.removeAttribute(d)}else d.startsWith(v)&&(l.push({type:6,index:o}),n.removeAttribute(d));if(zt.test(n.tagName)){let d=n.textContent.split(v),u=d.length-1;if(u>0){n.textContent=j?j.emptyScript:"";for(let f=0;f<u;f++)n.append(d[f],W()),w.nextNode(),l.push({type:2,index:++o});n.append(d[u],W())}}}else if(n.nodeType===8)if(n.data===Ot)l.push({type:2,index:o});else{let d=-1;for(;(d=n.data.indexOf(v,d+1))!==-1;)l.push({type:7,index:o}),d+=v.length-1}o++}}static createElement(t,e){let r=S.createElement("template");return r.innerHTML=t,r}};function C(i,t,e=i,r){if(t===k)return t;let n=r!==void 0?e._$Co?.[r]:e._$Cl,o=H(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(i),n._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=n:e._$Cl=n),n!==void 0&&(t=C(i,n._$AS(i,t.values),n,r)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,n=(t?.creationScope??S).importNode(e,!0);w.currentNode=n;let o=w.nextNode(),s=0,a=0,l=r[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new L(o,o.nextSibling,this,t):l.type===1?c=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(c=new st(o,this,t)),this._$AV.push(c),l=r[++a]}s!==l?.index&&(o=w.nextNode(),s++)}return w.currentNode=S,n}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},L=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,n){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),H(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==k&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ue(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=D.createElement(It(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(e);else{let o=new et(n,this),s=o.u(this.options);o.p(e),this.T(s),this._$AH=o}}_$AC(t){let e=Pt.get(t.strings);return e===void 0&&Pt.set(t.strings,e=new D(t)),e}k(t){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,n=0;for(let o of t)n===e.length?e.push(r=new i(this.O(W()),this.O(W()),this,this.options)):r=e[n],r._$AI(o),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=St(t).nextSibling;St(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=p}_$AI(t,e=this,r,n){let o=this.strings,s=!1;if(o===void 0)t=C(this,t,e,0),s=!H(t)||t!==this._$AH&&t!==k,s&&(this._$AH=t);else{let a=t,l,c;for(t=o[0],l=0;l<o.length-1;l++)c=C(this,a[r+l],e,l),c===k&&(c=this._$AH[l]),s||=!H(c)||c!==this._$AH[l],c===p?t=p:t!==p&&(t+=(c??"")+o[l+1]),this._$AH[l]=c}s&&!n&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},rt=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},nt=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},it=class extends M{constructor(t,e,r,n,o){super(t,e,r,n,o),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??p)===k)return;let r=this._$AH,n=t===p&&r!==p||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==p&&(r===p||n);n&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},st=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var fe=ot.litHtmlPolyfillSupport;fe?.(D,L),(ot.litHtmlVersions??=[]).push("3.3.3");var Wt=(i,t,e)=>{let r=e?.renderBefore??t,n=r._$litPart$;if(n===void 0){let o=e?.renderBefore??null;r._$litPart$=n=new L(t.insertBefore(W(),o),o,void 0,e??{})}return n._$AI(i),n};var ct=globalThis,$=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Wt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};$._$litElement$=!0,$.finalized=!0,ct.litElementHydrateSupport?.({LitElement:$});var me=ct.litElementPolyfillSupport;me?.({LitElement:$});(ct.litElementVersions??=[]).push("4.2.2");var dt={solar:{name:"Solar",icon:"mdi:solar-power",max:8e3},grid:{name:"Netz",icon:"mdi:transmission-tower",max:1e4},battery:{name:"Batterie",icon:"mdi:battery",max:5e3},home:{name:"Haus",icon:"mdi:home",max:1e4},extra:{name:"Zusatz",icon:"mdi:flash",max:3e3}},Ht=["classic","ring","lanes","combined"],ge=["solar","grid","battery","home"];function ye(i){if(typeof i!="string")return;let t=i.replace(/^--/,"");return/^[a-z][a-z0-9-]*$/i.test(t)?t:void 0}function Dt(i,t,e,r){let n=dt[t],o=typeof e.max=="number"&&Number.isFinite(e.max)&&e.max>0?e.max:n.max;return{...e,key:i,kind:t,name:e.name||r,icon:e.icon||n.icon,max:o,invert:!!e.invert,color:ye(e.color)}}function Lt(i){let t=[];for(let r of ge){let n=i?.[r];n?.entity&&t.push(Dt(r,r,n,dt[r].name))}if((i?.extras??[]).forEach((r,n)=>{r?.entity&&t.push(Dt(`extra-${n}`,"extra",r,`${dt.extra.name} ${n+1}`))}),t.length===0)throw new Error("Mindestens ein Kreis mit einer Entit\xE4t muss konfiguriert sein (z. B. home.entity).");let e=i.flow_style??"classic";if(!Ht.includes(e))throw new Error(`flow_style muss einer von ${Ht.join(", ")} sein (war: ${String(e)}).`);return{title:i.title,flow_style:e,nodes:t}}function ht(i){let t=i.filter(s=>s.kind!=="extra"),e=i.filter(s=>s.kind==="extra"),r=[];t.forEach((s,a)=>{let l=Math.floor(a/2),c=a%2,h=t.length===1?400/2:c===0?72:328;r.push({key:s.key,cx:h,cy:60+l*130,r:44})});let o=(t.length?60+(Math.ceil(t.length/2)-1)*130+44:0)+20+32+(t.length?16:0);return e.forEach((s,a)=>{let l=Math.floor(a/4),c=Math.min(4,e.length-l*4),h=a%4;r.push({key:s.key,cx:400/2+(h-(c-1)/2)*(400/Math.max(c,2)),cy:(t.length?o:52)+l*90,r:32})}),r}function ut(i){let t=i.filter(r=>r.r===44);if(t.length===0)return{cx:400/2,cy:60};let e=t.map(r=>r.cy);return{cx:400/2,cy:(Math.min(...e)+Math.max(...e))/2}}function pt(i){return i.length===0?60:Math.max(...i.map(t=>t.cy+t.r))+36}var _e=28;function Ut(i,t){let e=i.find(a=>a.key===t),r=i.filter(a=>a.r===44);if(!e||r.length===0)return[];let n=ut(i),o={x:n.cx,y:n.cy};if(e.r===44)return e.cx===n.cx&&e.cy===n.cy?[]:[o,{x:e.cx,y:e.cy}];let s=Math.max(...r.map(a=>a.cy+a.r))+_e;return[o,{x:n.cx,y:s},{x:e.cx,y:s},{x:e.cx,y:e.cy}]}function Gt(i,t){let e=[];for(let r=0;r<i.length-1;r++){let n=i[r+1].x-i[r].x,o=i[r+1].y-i[r].y,s=Math.hypot(n,o)||1;e.push({x:-o/s,y:n/s})}return i.map((r,n)=>{if(n===0)return{x:r.x+e[0].x*t,y:r.y+e[0].y*t};if(n===i.length-1){let u=e[e.length-1];return{x:r.x+u.x*t,y:r.y+u.y*t}}let o=e[n-1],s=e[n],a=o.x+s.x,l=o.y+s.y,c=Math.hypot(a,l)||1,h={x:a/c,y:l/c},d=t/(h.x*o.x+h.y*o.y||1);return{x:r.x+h.x*d,y:r.y+h.y*d}})}function ft(i,t){let e=i.slice(1).map((n,o)=>Math.hypot(n.x-i[o].x,n.y-i[o].y)),r=e.reduce((n,o)=>n+o,0)*t;for(let n=0;n<e.length;n++){if(r<=e[n]||n===e.length-1){let o=e[n]?r/e[n]:0;return{x:i[n].x+(i[n+1].x-i[n].x)*o,y:i[n].y+(i[n+1].y-i[n].y)*o}}r-=e[n]}return i[0]}function Bt(i,t){return!Number.isFinite(i)||!Number.isFinite(t)||t<=0?0:Math.min(1,Math.abs(i)/t)}function V(i,t,e,r){let n=r*Math.PI/180;return{x:i+e*Math.cos(n),y:t+e*Math.sin(n)}}function mt(i,t,e,r){if(!(r>0))return"";let n=Math.min(1,r)*256,o=V(i,t,e,142),s=V(i,t,e,142+n),a=n>180?1:0,l=c=>+c.toFixed(3);return`M ${l(o.x)} ${l(o.y)} A ${e} ${e} 0 ${a} 1 ${l(s.x)} ${l(s.y)}`}function Ft(i,t,e,r,n){let o=Math.min(1,Math.max(0,r)),s=Math.min(1,Math.max(0,n));if(!(s>o))return"";let a=V(i,t,e,142+o*256),l=V(i,t,e,142+s*256),c=(s-o)*256>180?1:0,h=d=>+d.toFixed(3);return`M ${h(a.x)} ${h(a.y)} A ${e} ${e} 0 ${c} 1 ${h(l.x)} ${h(l.y)}`}function X(i,t){return t?.trim().toLowerCase()==="kw"?i*1e3:i}function gt(i,t,e="de"){let r=Math.abs(X(i,t));return r>=1e3?{text:new Intl.NumberFormat(e,{minimumFractionDigits:1,maximumFractionDigits:1}).format(r/1e3),unit:"kW"}:{text:new Intl.NumberFormat(e,{maximumFractionDigits:0}).format(r),unit:"W"}}var $e=10;function yt(i,t){if(!t)return;let e=i[t];if(!e||e.state.trim()==="")return;let r=Number(e.state);if(!Number.isFinite(r))return;let n=e.attributes?.unit_of_measurement;return{value:r,unit:typeof n=="string"?n:void 0}}function jt(i,t){let e=yt(i,t);return e?Math.min(100,Math.max(0,e.value)):void 0}function _t(i,t,e=0){let r=yt(i,t.entity);if(!r)return{available:!1,watts:0,fraction:0,dir:"idle"};let n=X(r.value,r.unit);if(t.kind==="grid"){let h=yt(i,t.export_entity),d=h?X(h.value,h.unit):0;d>0&&(n=-d)}t.invert&&(n=-n),t.kind==="home"&&t.subtract_extras&&(n=Math.max(0,n-e));let o=Math.abs(n)<$e,s="idle",a;if(!o)switch(t.kind){case"solar":s="to-center";break;case"grid":s=n>0?"to-center":"from-center",a=n>0?"import":"export";break;case"battery":s=n>0?"to-center":"from-center",a=n>0?"discharging":"charging";break;default:s="from-center"}let l;t.kind==="battery"?l=jt(i,t.soc_entity):t.kind==="extra"&&t.ring==="soc"&&(l=jt(i,t.ring_entity));let c=l!==void 0?l/100:Bt(n,t.max);return{available:!0,watts:n,unit:r.unit,fraction:c,dir:s,mode:a,soc:l}}function Vt(i,t){let e={solar:0,grid:0,battery:0};i.forEach((n,o)=>{let s=t[o];!s.available||s.dir!=="to-center"||(n.kind==="solar"?e.solar+=Math.abs(s.watts):n.kind==="grid"?e.grid+=Math.abs(s.watts):n.kind==="battery"&&(e.battery+=Math.abs(s.watts)))});let r=e.solar+e.grid+e.battery;if(!(r<=0))return{solar:e.solar/r,grid:e.grid/r,battery:e.battery/r}}function Xt(i,t,e){let r=new Map;return i.forEach((n,o)=>{let s=t[o];if(!s.available||s.dir!=="from-center")return;let a=Math.abs(s.watts);r.set(n.key,{watts:a,solarWatts:a*e.solar,restWatts:a*(1-e.solar),solarShare:e.solar,splitRing:s.soc===void 0})}),r}var Kt=O`
  :host {
    --pf-ring-accent: var(--pf-accent, var(--primary-color));
    --pf-ring-track: var(--pf-border, var(--divider-color));
    --pf-ring-surface: var(--pf-surface, var(--card-background-color));
    --pf-ring-text: var(--pf-text, var(--primary-text-color));
    --pf-ring-text-2: var(--pf-text-secondary, var(--secondary-text-color));
    --pf-ring-disabled: var(--pf-text-disabled, var(--disabled-text-color));
  }
  ha-card {
    padding: 12px 8px 8px;
    overflow: hidden;
  }
  .title {
    padding: 0 12px 4px;
    font-size: 15px;
    font-weight: 600;
    color: var(--pf-ring-text);
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Flusslinien */
  .line {
    fill: none;
    stroke: var(--pf-ring-track);
    stroke-width: 2;
    stroke-linecap: round;
  }
  .flow {
    fill: none;
    stroke: var(--c, var(--pf-ring-accent));
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 1 13;
    animation: flow 1.2s linear infinite;
  }
  .flow.solar {
    stroke: var(--energy-solar-color, var(--pf-ring-accent));
  }
  .lane-label rect {
    fill: var(--pf-ring-surface);
    stroke: var(--pf-ring-track);
    stroke-width: 1;
  }
  .lane-label text {
    fill: var(--energy-solar-color, var(--pf-ring-accent));
    font-size: 11px;
    font-weight: 700;
    text-anchor: start;
  }
  .sun {
    color: var(--energy-solar-color, var(--pf-ring-accent));
    --mdc-icon-size: 12px;
  }
  @keyframes flow {
    to {
      stroke-dashoffset: -14;
    }
  }
  .hub {
    fill: var(--pf-surface-2, var(--ha-card-background, var(--card-background-color)));
    stroke: var(--pf-ring-track);
    stroke-width: 2;
  }

  /* Knoten */
  .node {
    cursor: pointer;
    outline: none;
    --c: var(--pf-ring-accent);
  }
  .node.solar,
  .node-line.solar {
    --c: var(--energy-solar-color, var(--pf-ring-accent));
  }
  .node.grid,
  .node-line.grid {
    --c: var(--energy-grid-consumption-color, var(--pf-ring-accent));
  }
  .node.grid.export,
  .node-line.grid.export {
    --c: var(--energy-grid-return-color, var(--pf-ring-accent));
  }
  .node.battery,
  .node-line.battery {
    --c: var(--energy-battery-in-color, var(--pf-ring-accent));
  }
  .node.battery.discharging,
  .node-line.battery.discharging {
    --c: var(--energy-battery-out-color, var(--pf-ring-accent));
  }
  .node.unavailable,
  .node-line.unavailable {
    --c: var(--pf-ring-disabled);
  }
  .bg {
    fill: var(--pf-ring-surface);
  }
  .track,
  .fill {
    fill: none;
    stroke-linecap: round;
    stroke-width: 6;
  }
  .track {
    stroke: var(--pf-ring-track);
  }
  .fill {
    stroke: var(--c);
    transition: stroke 0.25s;
  }
  .seg.solar {
    stroke: var(--energy-solar-color, var(--pf-ring-accent));
  }
  .seg.battery {
    stroke: var(--energy-battery-out-color, var(--pf-ring-accent));
  }
  .seg.grid {
    stroke: var(--energy-grid-consumption-color, var(--pf-ring-accent));
  }
  .fill.seg {
    stroke-linecap: butt;
  }
  .sub.solar-share {
    text-anchor: start;
    fill: var(--energy-solar-color, var(--pf-ring-text-2));
    font-weight: 600;
  }
  .node.extra .track,
  .node.extra .fill {
    stroke-width: 5;
  }
  .node:hover .track {
    stroke: var(--pf-surface-3, var(--pf-ring-track));
  }
  .node:focus-visible .bg {
    stroke: var(--pf-ring-accent);
    stroke-width: 2;
  }
  .icon {
    color: var(--c);
    --mdc-icon-size: 20px;
  }
  .node.extra .icon {
    --mdc-icon-size: 16px;
  }
  .value {
    fill: var(--pf-ring-text);
    font-size: 18px;
    font-weight: 700;
    text-anchor: middle;
  }
  .node.extra .value {
    font-size: 14px;
  }
  .unit {
    fill: var(--pf-ring-text-2);
    font-size: 11px;
    font-weight: 500;
  }
  .node.unavailable .value {
    fill: var(--pf-ring-disabled);
  }
  .sub {
    fill: var(--pf-ring-text-2);
    font-size: 11px;
    text-anchor: middle;
  }
  .name {
    fill: var(--pf-text-label, var(--pf-ring-text-2));
    font-size: 13px;
    text-anchor: middle;
  }
  .node.extra .name {
    font-size: 11px;
  }

  @media (prefers-reduced-motion: reduce) {
    .flow {
      animation: none;
    }
    .fill {
      transition: none;
    }
  }
`;var xe=16,qt=10;function ve(i){return[i.entity,i.export_entity,i.soc_entity,i.ring_entity].filter(t=>!!t)}function Yt(i,t,e){return m`<foreignObject x=${i} y=${t} width=${e} height=${e}>
    <ha-icon class="sun" .icon=${"mdi:white-balance-sunny"}></ha-icon>
  </foreignObject>`}function Zt(i,t,e){i.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}var R=class extends ${static getConfigElement(){return document.createElement("power-flow-refined-editor")}static getStubConfig(){return{type:"custom:power-flow-refined",solar:{entity:"sensor.evcc_pv_power",max:8e3},battery:{entity:"sensor.evcc_battery_power",soc_entity:"sensor.evcc_battery_soc",max:5e3},home:{entity:"sensor.evcc_home_power",max:1e4}}}setConfig(t){this._config=Lt(t)}getCardSize(){return this._config?Math.ceil(pt(ht(this._config.nodes))/50):4}shouldUpdate(t){if(t.has("_config")||!this._config)return!0;let e=t.get("hass");return!e||!this.hass?!0:this._config.nodes.some(r=>ve(r).some(n=>e.states[n]!==this.hass.states[n]))}_tap(t){let e=t.tap_action?.action??"more-info";if(e!=="none"){if(e==="navigate"&&t.tap_action?.navigation_path){history.pushState(null,"",t.tap_action.navigation_path),Zt(window,"location-changed",{replace:!1});return}Zt(this,"hass-more-info",{entityId:t.entity})}}_renderLine(t,e,r,n,o="de"){let s=Ut(e,t.key);if(s.length<2)return p;let a=f=>f.map((g,x)=>`${x?"L":"M"} ${g.x} ${g.y}`).join(" "),l=r.dir==="to-center"?[...s].reverse():s,c=t.color&&r.available?`--c: var(--${t.color})`:p,h=this._config.flow_style==="lanes"||this._config.flow_style==="combined",d=!!n&&n.solarWatts>=qt,u=!!n&&n.restWatts>=qt;if(h&&n&&r.dir==="from-center"&&(d||u)){let f=d&&u,g=(y,N)=>m`<path class="flow ${y}" d=${a(f?Gt(s,N):s)}></path>`,x=p;if(d){let y=s.length>2?ft([s[1],s[2]],.5):ft(s,.4),N=gt(n.solarWatts,"W",o),U=`${N.text} ${N.unit}`,_=U.length*6.4+28;x=m`<g class="lane-label">
          <rect x=${y.x-_/2} y=${y.y-8} width=${_} height="16" rx="8"></rect>
          ${Yt(y.x-_/2+6,y.y-6,12)}
          <text x=${y.x-_/2+22} y=${y.y+4}>${U}</text>
        </g>`}return m`
        <g class="node-line ${t.kind} ${r.mode??""}" style=${c}>
          <path class="line" d=${a(s)}></path>
          ${d?g("solar",-2):p}
          ${u?g("rest",2):p}
          ${x}
        </g>`}return m`
      <g class="node-line ${t.kind} ${r.mode??""} ${r.available?"":"unavailable"}" style=${c}>
        <path class="line" d=${a(s)}></path>
        ${r.dir!=="idle"?m`<path class="flow" d=${a(l)}></path>`:p}
      </g>`}_renderNode(t,e,r,n,o,s){let{cx:a,cy:l,r:c}=e,h=mt(a,l,c-4,1),d=r.available?mt(a,l,c-4,r.fraction):"",u=r.available?gt(r.watts,"W",n):void 0,f=t.kind==="extra"?16:20,x=(this._config.flow_style==="ring"||this._config.flow_style==="combined")&&!!o&&!!s&&o.splitRing&&r.fraction>0,y=c-4,N=x?[["solar",0,r.fraction*s.solar],["battery",r.fraction*s.solar,r.fraction*(s.solar+s.battery)],["grid",r.fraction*(s.solar+s.battery),r.fraction]]:[],U=["node",t.kind,r.mode??"",r.available?"":"unavailable"].join(" ").replace(/\s+/g," ");return m`
      <g class=${U} style=${t.color&&r.available?`--c: var(--${t.color})`:p} role="button" tabindex="0" aria-label=${t.name}
         @click=${()=>this._tap(t)}
         @keydown=${_=>{(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),this._tap(t))}}>
        <circle class="bg" cx=${a} cy=${l} r=${c}></circle>
        <path class="track" d=${h}></path>
        ${x?N.map(([_,ee,re])=>m`<path class="fill seg ${_}" d=${Ft(a,l,y,ee,re)}></path>`):d?m`<path class="fill" d=${d}></path>`:p}
        <foreignObject x=${a-f/2} y=${l-c*.62} width=${f} height=${f}>
          <ha-icon class="icon" .icon=${t.icon}></ha-icon>
        </foreignObject>
        <text class="value" x=${a} y=${l+(t.kind==="extra"?8:10)}>
          ${u?m`<tspan>${u.text}</tspan><tspan class="unit" dx="3">${u.unit}</tspan>`:m`<tspan>–</tspan>`}
        </text>
        ${r.soc!==void 0?m`<text class="sub" x=${a} y=${l+c-2}>${Math.round(r.soc)} %</text>`:x?m`${Yt(a-19,l+c-13,12)}<text class="sub solar-share" x=${a-5} y=${l+c-2}>${Math.round(s.solar*100)} %</text>`:p}
        <text class="name" x=${a} y=${l+c+(t.kind==="extra"?16:20)}>${t.name}</text>
      </g>`}render(){if(!this._config||!this.hass)return p;let t=this.hass.locale?.language??this.hass.language??"de",e=this._config.nodes,r=ht(e),n=new Map(r.map(u=>[u.key,u])),o=ut(r),s=e.reduce((u,f)=>f.kind==="extra"?u+Math.max(0,_t(this.hass.states,f).watts):u,0),a=e.map(u=>_t(this.hass.states,u,s)),l=pt(r),c=this._config.flow_style==="classic"?void 0:Vt(e,a),h=c?Xt(e,a,c):new Map,d=e.some(u=>u.kind!=="extra");return A`
      <ha-card>
        ${this._config.title?A`<div class="title">${this._config.title}</div>`:p}
        <svg viewBox="0 0 ${400} ${l}" role="group" aria-label=${this._config.title??"Energiefluss"}>
          ${e.map((u,f)=>this._renderLine(u,r,a[f],h.get(u.key),t))}
          ${d&&e.length>1?m`<circle class="hub" cx=${o.cx} cy=${o.cy} r=${xe}></circle>`:p}
          ${e.map((u,f)=>this._renderNode(u,n.get(u.key),a[f],t,h.get(u.key),c))}
        </svg>
      </ha-card>
    `}};R.styles=Kt,R.properties={hass:{attribute:!1},_config:{state:!0}};function K(i){return JSON.parse(JSON.stringify(i))}function q(i,t,e){let r=K(i),n=r;for(let s=0;s<t.length-1;s++){let a=t[s];(typeof n[a]!="object"||n[a]===null)&&(n[a]=typeof t[s+1]=="number"?[]:{}),n=n[a]}let o=t[t.length-1];return e===""||e===void 0||e===null?delete n[o]:n[o]=e,r}function Jt(i){let t=K(i);return t.extras=[...t.extras??[],{entity:""}],t}function Qt(i,t){let e=K(i);return e.extras=(e.extras??[]).filter((r,n)=>n!==t),e}function $t(i,t,e){let r=K(i),n=r.extras??[],o=t+e;return t<0||t>=n.length||o<0||o>=n.length||([n[t],n[o]]=[n[o],n[t]],r.extras=n),r}var te=[{key:"entity",label:"Entit\xE4t (Leistung)",selector:{entity:{}}},{key:"name",label:"Name",selector:{text:{}}},{key:"icon",label:"Icon",selector:{icon:{}}},{key:"color",label:"Farbe (Theme-Variable, z. B. pf-purple)",selector:{text:{}}},{key:"max",label:"Maximum (W) f\xFCr den Ring",selector:{number:{mode:"box",min:1,step:100}}},{key:"invert",label:"Vorzeichen umkehren",selector:{boolean:{}}}],Ae=[{key:"solar",title:"Solar",extra:[]},{key:"grid",title:"Netz",extra:[{key:"export_entity",label:"Entit\xE4t Einspeiseleistung (optional)",selector:{entity:{}}}]},{key:"battery",title:"Batterie",extra:[{key:"soc_entity",label:"Entit\xE4t Ladestand (SoC, f\xFCr den Ring)",selector:{entity:{}}}]},{key:"home",title:"Haus",extra:[{key:"subtract_extras",label:"Leistung der Zusatzkreise abziehen",selector:{boolean:{}}}]}],Ee=[...te,{key:"ring",label:"Ring zeigt",selector:{select:{mode:"dropdown",options:[{value:"power",label:"Leistung"},{value:"soc",label:"Ladestand (SoC)"}]}}},{key:"ring_entity",label:"Entit\xE4t Ladestand (SoC)",selector:{entity:{}},when:i=>i.ring==="soc"}],P=class extends ${setConfig(t){this._config=t}_commit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_field(t,e,r){if(e.when&&!e.when(r))return p;let n=r[e.key];return A`<ha-selector
      .hass=${this.hass}
      .label=${e.label}
      .required=${e.key==="entity"}
      .selector=${e.selector}
      .value=${n}
      @value-changed=${o=>{o.stopPropagation();let s=o.detail.value;this._commit(q(this._config,[...t,e.key],s))}}
    ></ha-selector>`}render(){if(!this._config)return p;let t=this._config,e=t.extras??[];return A`
      <div class="fields" style="margin-bottom: 12px">
        <ha-selector
          .hass=${this.hass}
          .label=${"Titel (optional)"}
          .required=${!1}
          .selector=${{text:{}}}
          .value=${t.title}
          @value-changed=${r=>{r.stopPropagation(),this._commit(q(t,["title"],r.detail.value))}}
        ></ha-selector>
      </div>
      <div class="fields" style="margin-bottom: 12px">
        <ha-selector
          .hass=${this.hass}
          .label=${"Darstellung des Solarflusses"}
          .required=${!1}
          .selector=${{select:{mode:"dropdown",options:[{value:"classic",label:"Klassisch (Linien zum Zentrum)"},{value:"ring",label:"Ring zeigt Solar-Anteil"},{value:"lanes",label:"Solar-Spuren mit Watt"},{value:"combined",label:"Ring und Spuren kombiniert"}]}}}
          .value=${t.flow_style??"classic"}
          @value-changed=${r=>{r.stopPropagation(),this._commit(q(t,["flow_style"],r.detail.value))}}
        ></ha-selector>
      </div>
      ${Ae.map(r=>A`
          <details ?open=${!!t[r.key]?.entity}>
            <summary>${r.title}</summary>
            <div class="fields">
              ${[...te,...r.extra].map(n=>this._field([r.key],n,t[r.key]??{}))}
            </div>
          </details>
        `)}
      <h3>Zusatzkreise</h3>
      ${e.map((r,n)=>A`
          <details open>
            <summary>${r.name||`Zusatzkreis ${n+1}`}</summary>
            <div class="fields">
              ${Ee.map(o=>this._field(["extras",n],o,r))}
              <div class="row">
                <span>
                  <button type="button" @click=${()=>this._commit($t(t,n,-1))} ?disabled=${n===0}>
                    ↑
                  </button>
                  <button
                    type="button"
                    @click=${()=>this._commit($t(t,n,1))}
                    ?disabled=${n===e.length-1}
                  >
                    ↓
                  </button>
                </span>
                <button type="button" @click=${()=>this._commit(Qt(t,n))}>Entfernen</button>
              </div>
            </div>
          </details>
        `)}
      <button class="add" type="button" @click=${()=>this._commit(Jt(t))}>
        + Zusatzkreis hinzufügen
      </button>
    `}};P.properties={hass:{attribute:!1},_config:{state:!0}},P.styles=O`
    :host {
      display: block;
    }
    details {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      margin-bottom: 8px;
      padding: 0 12px;
    }
    summary {
      cursor: pointer;
      padding: 12px 0;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .fields {
      display: grid;
      gap: 6px;
      padding-bottom: 12px;
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
    }
    button {
      background: transparent;
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 10px;
      cursor: pointer;
      font: inherit;
    }
    button:hover {
      border-color: var(--primary-color);
    }
    .add {
      width: 100%;
      margin-top: 4px;
    }
  `;customElements.get("power-flow-refined")||customElements.define("power-flow-refined",R);customElements.get("power-flow-refined-editor")||customElements.define("power-flow-refined-editor",P);var Y=window;Y.customCards=Y.customCards||[];Y.customCards.some(i=>i.type==="power-flow-refined")||Y.customCards.push({type:"power-flow-refined",name:"Power Flow Refined",description:"Energiefluss mit Ringen um Solar, Netz, Batterie, Haus und Zusatzkreise",preview:!1});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
