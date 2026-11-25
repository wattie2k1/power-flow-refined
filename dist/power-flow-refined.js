var I=globalThis,W=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,j=Symbol(),ut=new WeakMap,C=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==j)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(W&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ut.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ut.set(e,t))}return t}toString(){return this.cssText}},pt=n=>new C(typeof n=="string"?n:n+"",void 0,j),N=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((r,i,s)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[s+1],n[0]);return new C(e,n,j)},ft=(n,t)=>{if(W)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),i=I.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,n.appendChild(r)}},V=W?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return pt(e)})(n):n;var{is:Bt,defineProperty:Ft,getOwnPropertyDescriptor:jt,getOwnPropertyNames:Vt,getOwnPropertySymbols:Gt,getPrototypeOf:Xt}=Object,U=globalThis,mt=U.trustedTypes,Kt=mt?mt.emptyScript:"",qt=U.reactiveElementPolyfillSupport,R=(n,t)=>n,G={toAttribute(n,t){switch(t){case Boolean:n=n?Kt:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},_t=(n,t)=>!Bt(n,t),gt={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:_t};Symbol.metadata??=Symbol("metadata"),U.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=gt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&Ft(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){let{get:i,set:s}=jt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let c=i?.call(this);s?.call(this,o),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gt}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Xt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,r=[...Vt(e),...Gt(e)];for(let i of r)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)e.unshift(V(i))}else t!==void 0&&e.push(V(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ft(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:G).toAttribute(e,r.type);this._$Em=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,e){let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:G;this._$Em=i;let c=o.fromAttribute(e,s.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,r,i=!1,s){if(t!==void 0){let o=this.constructor;if(i===!1&&(s=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??_t)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:s},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),s!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:o}=s,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,s,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};g.elementStyles=[],g.shadowRootOptions={mode:"open"},g[R("elementProperties")]=new Map,g[R("finalized")]=new Map,qt?.({ReactiveElement:g}),(U.reactiveElementVersions??=[]).push("2.1.2");var Q=globalThis,yt=n=>n,L=Q.trustedTypes,$t=L?L.createPolicy("lit-html",{createHTML:n=>n}):void 0,wt="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,St="?"+y,Yt=`<${St}>`,v=document,P=()=>v.createComment(""),T=n=>n===null||typeof n!="object"&&typeof n!="function",tt=Array.isArray,Zt=n=>tt(n)||typeof n?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,bt=/-->/g,xt=/>/g,b=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,At=/"/g,kt=/^(?:script|style|textarea|title)$/i,et=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),$=et(1),_=et(2),fe=et(3),A=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Et=new WeakMap,x=v.createTreeWalker(v,129);function Ct(n,t){if(!tt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(t):t}var Jt=(n,t)=>{let e=n.length-1,r=[],i,s=t===2?"<svg>":t===3?"<math>":"",o=M;for(let c=0;c<e;c++){let a=n[c],h,l,d=-1,f=0;for(;f<a.length&&(o.lastIndex=f,l=o.exec(a),l!==null);)f=o.lastIndex,o===M?l[1]==="!--"?o=bt:l[1]!==void 0?o=xt:l[2]!==void 0?(kt.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=b):l[3]!==void 0&&(o=b):o===b?l[0]===">"?(o=i??M,d=-1):l[1]===void 0?d=-2:(d=o.lastIndex-l[2].length,h=l[1],o=l[3]===void 0?b:l[3]==='"'?At:vt):o===At||o===vt?o=b:o===bt||o===xt?o=M:(o=b,i=void 0);let p=o===b&&n[c+1].startsWith("/>")?" ":"";s+=o===M?a+Yt:d>=0?(r.push(h),a.slice(0,d)+wt+a.slice(d)+y+p):a+y+(d===-2?c:p)}return[Ct(n,s+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},O=class n{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let s=0,o=0,c=t.length-1,a=this.parts,[h,l]=Jt(t,e);if(this.el=n.createElement(h,r),x.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=x.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(wt)){let f=l[o++],p=i.getAttribute(d).split(y),H=/([.?@])?(.*)/.exec(f);a.push({type:1,index:s,name:H[2],strings:p,ctor:H[1]==="."?q:H[1]==="?"?Y:H[1]==="@"?Z:w}),i.removeAttribute(d)}else d.startsWith(y)&&(a.push({type:6,index:s}),i.removeAttribute(d));if(kt.test(i.tagName)){let d=i.textContent.split(y),f=d.length-1;if(f>0){i.textContent=L?L.emptyScript:"";for(let p=0;p<f;p++)i.append(d[p],P()),x.nextNode(),a.push({type:2,index:++s});i.append(d[f],P())}}}else if(i.nodeType===8)if(i.data===St)a.push({type:2,index:s});else{let d=-1;for(;(d=i.data.indexOf(y,d+1))!==-1;)a.push({type:7,index:s}),d+=y.length-1}s++}}static createElement(t,e){let r=v.createElement("template");return r.innerHTML=t,r}};function E(n,t,e=n,r){if(t===A)return t;let i=r!==void 0?e._$Co?.[r]:e._$Cl,s=T(t)?void 0:t._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(n),i._$AT(n,e,r)),r!==void 0?(e._$Co??=[])[r]=i:e._$Cl=i),i!==void 0&&(t=E(n,i._$AS(n,t.values),i,r)),t}var K=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??v).importNode(e,!0);x.currentNode=i;let s=x.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new z(s,s.nextSibling,this,t):a.type===1?h=new a.ctor(s,a.name,a.strings,this,t):a.type===6&&(h=new J(s,this,t)),this._$AV.push(h),a=r[++c]}o!==a?.index&&(s=x.nextNode(),o++)}return x.currentNode=v,i}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},z=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=E(this,t,e),T(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Zt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(v.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=O.createElement(Ct(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{let s=new K(i,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(t){let e=Et.get(t.strings);return e===void 0&&Et.set(t.strings,e=new O(t)),e}k(t){tt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let s of t)i===e.length?e.push(r=new n(this.O(P()),this.O(P()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=yt(t).nextSibling;yt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},w=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,s){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=u}_$AI(t,e=this,r,i){let s=this.strings,o=!1;if(s===void 0)t=E(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==A,o&&(this._$AH=t);else{let c=t,a,h;for(t=s[0],a=0;a<s.length-1;a++)h=E(this,c[r+a],e,a),h===A&&(h=this._$AH[a]),o||=!T(h)||h!==this._$AH[a],h===u?t=u:t!==u&&(t+=(h??"")+s[a+1]),this._$AH[a]=h}o&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},q=class extends w{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},Y=class extends w{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},Z=class extends w{constructor(t,e,r,i,s){super(t,e,r,i,s),this.type=5}_$AI(t,e=this){if((t=E(this,t,e,0)??u)===A)return;let r=this._$AH,i=t===u&&r!==u||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==u&&(r===u||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},J=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){E(this,t)}};var Qt=Q.litHtmlPolyfillSupport;Qt?.(O,z),(Q.litHtmlVersions??=[]).push("3.3.3");var Nt=(n,t,e)=>{let r=e?.renderBefore??t,i=r._$litPart$;if(i===void 0){let s=e?.renderBefore??null;r._$litPart$=i=new z(t.insertBefore(P(),s),s,void 0,e??{})}return i._$AI(n),i};var rt=globalThis,m=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};m._$litElement$=!0,m.finalized=!0,rt.litElementHydrateSupport?.({LitElement:m});var te=rt.litElementPolyfillSupport;te?.({LitElement:m});(rt.litElementVersions??=[]).push("4.2.2");var it={solar:{name:"Solar",icon:"mdi:solar-power",max:8e3},grid:{name:"Netz",icon:"mdi:transmission-tower",max:1e4},battery:{name:"Batterie",icon:"mdi:battery",max:5e3},home:{name:"Haus",icon:"mdi:home",max:1e4},extra:{name:"Zusatz",icon:"mdi:flash",max:3e3}},ee=["solar","grid","battery","home"];function re(n){if(typeof n!="string")return;let t=n.replace(/^--/,"");return/^[a-z][a-z0-9-]*$/i.test(t)?t:void 0}function Rt(n,t,e,r){let i=it[t],s=typeof e.max=="number"&&Number.isFinite(e.max)&&e.max>0?e.max:i.max;return{...e,key:n,kind:t,name:e.name||r,icon:e.icon||i.icon,max:s,invert:!!e.invert,color:re(e.color)}}function Mt(n){let t=[];for(let e of ee){let r=n?.[e];r?.entity&&t.push(Rt(e,e,r,it[e].name))}if((n?.extras??[]).forEach((e,r)=>{e?.entity&&t.push(Rt(`extra-${r}`,"extra",e,`${it.extra.name} ${r+1}`))}),t.length===0)throw new Error("Mindestens ein Kreis mit einer Entit\xE4t muss konfiguriert sein (z. B. home.entity).");return{title:n.title,nodes:t}}function nt(n){let t=n.filter(o=>o.kind!=="extra"),e=n.filter(o=>o.kind==="extra"),r=[];t.forEach((o,c)=>{let a=Math.floor(c/2),h=c%2,l=t.length===1?400/2:h===0?72:328;r.push({key:o.key,cx:l,cy:60+a*130,r:44})});let s=(t.length?60+(Math.ceil(t.length/2)-1)*130+44:0)+20+32+(t.length?16:0);return e.forEach((o,c)=>{let a=Math.floor(c/4),h=Math.min(4,e.length-a*4),l=c%4;r.push({key:o.key,cx:400/2+(l-(h-1)/2)*(400/Math.max(h,2)),cy:(t.length?s:52)+a*90,r:32})}),r}function st(n){let t=n.filter(r=>r.r===44);if(t.length===0)return{cx:400/2,cy:60};let e=t.map(r=>r.cy);return{cx:400/2,cy:(Math.min(...e)+Math.max(...e))/2}}function ot(n){return n.length===0?60:Math.max(...n.map(t=>t.cy+t.r))+36}var ie=28;function Pt(n,t){let e=n.find(c=>c.key===t),r=n.filter(c=>c.r===44);if(!e||r.length===0)return[];let i=st(n),s={x:i.cx,y:i.cy};if(e.r===44)return e.cx===i.cx&&e.cy===i.cy?[]:[s,{x:e.cx,y:e.cy}];let o=Math.max(...r.map(c=>c.cy+c.r))+ie;return[s,{x:i.cx,y:o},{x:e.cx,y:o},{x:e.cx,y:e.cy}]}function Ot(n,t){return!Number.isFinite(n)||!Number.isFinite(t)||t<=0?0:Math.min(1,Math.abs(n)/t)}function Tt(n,t,e,r){let i=r*Math.PI/180;return{x:n+e*Math.cos(i),y:t+e*Math.sin(i)}}function at(n,t,e,r){if(!(r>0))return"";let i=Math.min(1,r)*256,s=Tt(n,t,e,142),o=Tt(n,t,e,142+i),c=i>180?1:0,a=h=>+h.toFixed(3);return`M ${a(s.x)} ${a(s.y)} A ${e} ${e} 0 ${c} 1 ${a(o.x)} ${a(o.y)}`}function D(n,t){return t?.trim().toLowerCase()==="kw"?n*1e3:n}function zt(n,t,e="de"){let r=Math.abs(D(n,t));return r>=1e3?{text:new Intl.NumberFormat(e,{minimumFractionDigits:1,maximumFractionDigits:1}).format(r/1e3),unit:"kW"}:{text:new Intl.NumberFormat(e,{maximumFractionDigits:0}).format(r),unit:"W"}}var ne=10;function ct(n,t){if(!t)return;let e=n[t];if(!e||e.state.trim()==="")return;let r=Number(e.state);if(!Number.isFinite(r))return;let i=e.attributes?.unit_of_measurement;return{value:r,unit:typeof i=="string"?i:void 0}}function Ht(n,t){let e=ct(n,t);return e?Math.min(100,Math.max(0,e.value)):void 0}function lt(n,t,e=0){let r=ct(n,t.entity);if(!r)return{available:!1,watts:0,fraction:0,dir:"idle"};let i=D(r.value,r.unit);if(t.kind==="grid"){let l=ct(n,t.export_entity),d=l?D(l.value,l.unit):0;d>0&&(i=-d)}t.invert&&(i=-i),t.kind==="home"&&t.subtract_extras&&(i=Math.max(0,i-e));let s=Math.abs(i)<ne,o="idle",c;if(!s)switch(t.kind){case"solar":o="to-center";break;case"grid":o=i>0?"to-center":"from-center",c=i>0?"import":"export";break;case"battery":o=i>0?"to-center":"from-center",c=i>0?"discharging":"charging";break;default:o="from-center"}let a;t.kind==="battery"?a=Ht(n,t.soc_entity):t.kind==="extra"&&t.ring==="soc"&&(a=Ht(n,t.ring_entity));let h=a!==void 0?a/100:Ot(i,t.max);return{available:!0,watts:i,unit:r.unit,fraction:h,dir:o,mode:c,soc:a}}var It=N`
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
`;var oe=16;function ae(n){return[n.entity,n.export_entity,n.soc_entity,n.ring_entity].filter(t=>!!t)}function Wt(n,t,e){n.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}var S=class extends m{static getConfigElement(){return document.createElement("power-flow-refined-editor")}static getStubConfig(){return{type:"custom:power-flow-refined",solar:{entity:"sensor.evcc_pv_power",max:8e3},battery:{entity:"sensor.evcc_battery_power",soc_entity:"sensor.evcc_battery_soc",max:5e3},home:{entity:"sensor.evcc_home_power",max:1e4}}}setConfig(t){this._config=Mt(t)}getCardSize(){return this._config?Math.ceil(ot(nt(this._config.nodes))/50):4}shouldUpdate(t){if(t.has("_config")||!this._config)return!0;let e=t.get("hass");return!e||!this.hass?!0:this._config.nodes.some(r=>ae(r).some(i=>e.states[i]!==this.hass.states[i]))}_tap(t){let e=t.tap_action?.action??"more-info";if(e!=="none"){if(e==="navigate"&&t.tap_action?.navigation_path){history.pushState(null,"",t.tap_action.navigation_path),Wt(window,"location-changed",{replace:!1});return}Wt(this,"hass-more-info",{entityId:t.entity})}}_renderLine(t,e,r){let i=Pt(e,t.key);if(i.length<2)return u;let s=a=>a.map((h,l)=>`${l?"L":"M"} ${h.x} ${h.y}`).join(" "),o=r.dir==="to-center"?[...i].reverse():i,c=t.color&&r.available?`--c: var(--${t.color})`:u;return _`
      <g class="node-line ${t.kind} ${r.mode??""} ${r.available?"":"unavailable"}" style=${c}>
        <path class="line" d=${s(i)}></path>
        ${r.dir!=="idle"?_`<path class="flow" d=${s(o)}></path>`:u}
      </g>`}_renderNode(t,e,r,i){let{cx:s,cy:o,r:c}=e,a=at(s,o,c-4,1),h=r.available?at(s,o,c-4,r.fraction):"",l=r.available?zt(r.watts,"W",i):void 0,d=t.kind==="extra"?16:20,f=["node",t.kind,r.mode??"",r.available?"":"unavailable"].join(" ").replace(/\s+/g," ");return _`
      <g class=${f} style=${t.color&&r.available?`--c: var(--${t.color})`:u} role="button" tabindex="0" aria-label=${t.name}
         @click=${()=>this._tap(t)}
         @keydown=${p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),this._tap(t))}}>
        <circle class="bg" cx=${s} cy=${o} r=${c}></circle>
        <path class="track" d=${a}></path>
        ${h?_`<path class="fill" d=${h}></path>`:u}
        <foreignObject x=${s-d/2} y=${o-c*.62} width=${d} height=${d}>
          <ha-icon class="icon" .icon=${t.icon}></ha-icon>
        </foreignObject>
        <text class="value" x=${s} y=${o+(t.kind==="extra"?8:10)}>
          ${l?_`<tspan>${l.text}</tspan><tspan class="unit" dx="3">${l.unit}</tspan>`:_`<tspan>–</tspan>`}
        </text>
        ${r.soc!==void 0?_`<text class="sub" x=${s} y=${o+c-2}>${Math.round(r.soc)} %</text>`:u}
        <text class="name" x=${s} y=${o+c+(t.kind==="extra"?16:20)}>${t.name}</text>
      </g>`}render(){if(!this._config||!this.hass)return u;let t=this.hass.locale?.language??this.hass.language??"de",e=this._config.nodes,r=nt(e),i=new Map(r.map(l=>[l.key,l])),s=st(r),o=e.reduce((l,d)=>d.kind==="extra"?l+Math.max(0,lt(this.hass.states,d).watts):l,0),c=e.map(l=>lt(this.hass.states,l,o)),a=ot(r),h=e.some(l=>l.kind!=="extra");return $`
      <ha-card>
        ${this._config.title?$`<div class="title">${this._config.title}</div>`:u}
        <svg viewBox="0 0 ${400} ${a}" role="group" aria-label=${this._config.title??"Energiefluss"}>
          ${e.map((l,d)=>this._renderLine(l,r,c[d]))}
          ${h&&e.length>1?_`<circle class="hub" cx=${s.cx} cy=${s.cy} r=${oe}></circle>`:u}
          ${e.map((l,d)=>this._renderNode(l,i.get(l.key),c[d],t))}
        </svg>
      </ha-card>
    `}};S.styles=It,S.properties={hass:{attribute:!1},_config:{state:!0}};function B(n){return JSON.parse(JSON.stringify(n))}function dt(n,t,e){let r=B(n),i=r;for(let o=0;o<t.length-1;o++){let c=t[o];(typeof i[c]!="object"||i[c]===null)&&(i[c]=typeof t[o+1]=="number"?[]:{}),i=i[c]}let s=t[t.length-1];return e===""||e===void 0||e===null?delete i[s]:i[s]=e,r}function Ut(n){let t=B(n);return t.extras=[...t.extras??[],{entity:""}],t}function Lt(n,t){let e=B(n);return e.extras=(e.extras??[]).filter((r,i)=>i!==t),e}function ht(n,t,e){let r=B(n),i=r.extras??[],s=t+e;return t<0||t>=i.length||s<0||s>=i.length||([i[t],i[s]]=[i[s],i[t]],r.extras=i),r}var Dt=[{key:"entity",label:"Entit\xE4t (Leistung)",selector:{entity:{}}},{key:"name",label:"Name",selector:{text:{}}},{key:"icon",label:"Icon",selector:{icon:{}}},{key:"color",label:"Farbe (Theme-Variable, z. B. pf-purple)",selector:{text:{}}},{key:"max",label:"Maximum (W) f\xFCr den Ring",selector:{number:{mode:"box",min:1,step:100}}},{key:"invert",label:"Vorzeichen umkehren",selector:{boolean:{}}}],ce=[{key:"solar",title:"Solar",extra:[]},{key:"grid",title:"Netz",extra:[{key:"export_entity",label:"Entit\xE4t Einspeiseleistung (optional)",selector:{entity:{}}}]},{key:"battery",title:"Batterie",extra:[{key:"soc_entity",label:"Entit\xE4t Ladestand (SoC, f\xFCr den Ring)",selector:{entity:{}}}]},{key:"home",title:"Haus",extra:[{key:"subtract_extras",label:"Leistung der Zusatzkreise abziehen",selector:{boolean:{}}}]}],le=[...Dt,{key:"ring",label:"Ring zeigt",selector:{select:{mode:"dropdown",options:[{value:"power",label:"Leistung"},{value:"soc",label:"Ladestand (SoC)"}]}}},{key:"ring_entity",label:"Entit\xE4t Ladestand (SoC)",selector:{entity:{}},when:n=>n.ring==="soc"}],k=class extends m{setConfig(t){this._config=t}_commit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}_field(t,e,r){if(e.when&&!e.when(r))return u;let i=r[e.key];return $`<ha-selector
      .hass=${this.hass}
      .label=${e.label}
      .required=${e.key==="entity"}
      .selector=${e.selector}
      .value=${i}
      @value-changed=${s=>{s.stopPropagation();let o=s.detail.value;this._commit(dt(this._config,[...t,e.key],o))}}
    ></ha-selector>`}render(){if(!this._config)return u;let t=this._config,e=t.extras??[];return $`
      <div class="fields" style="margin-bottom: 12px">
        <ha-selector
          .hass=${this.hass}
          .label=${"Titel (optional)"}
          .required=${!1}
          .selector=${{text:{}}}
          .value=${t.title}
          @value-changed=${r=>{r.stopPropagation(),this._commit(dt(t,["title"],r.detail.value))}}
        ></ha-selector>
      </div>
      ${ce.map(r=>$`
          <details ?open=${!!t[r.key]?.entity}>
            <summary>${r.title}</summary>
            <div class="fields">
              ${[...Dt,...r.extra].map(i=>this._field([r.key],i,t[r.key]??{}))}
            </div>
          </details>
        `)}
      <h3>Zusatzkreise</h3>
      ${e.map((r,i)=>$`
          <details open>
            <summary>${r.name||`Zusatzkreis ${i+1}`}</summary>
            <div class="fields">
              ${le.map(s=>this._field(["extras",i],s,r))}
              <div class="row">
                <span>
                  <button type="button" @click=${()=>this._commit(ht(t,i,-1))} ?disabled=${i===0}>
                    ↑
                  </button>
                  <button
                    type="button"
                    @click=${()=>this._commit(ht(t,i,1))}
                    ?disabled=${i===e.length-1}
                  >
                    ↓
                  </button>
                </span>
                <button type="button" @click=${()=>this._commit(Lt(t,i))}>Entfernen</button>
              </div>
            </div>
          </details>
        `)}
      <button class="add" type="button" @click=${()=>this._commit(Ut(t))}>
        + Zusatzkreis hinzufügen
      </button>
    `}};k.properties={hass:{attribute:!1},_config:{state:!0}},k.styles=N`
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
  `;customElements.get("power-flow-refined")||customElements.define("power-flow-refined",S);customElements.get("power-flow-refined-editor")||customElements.define("power-flow-refined-editor",k);var F=window;F.customCards=F.customCards||[];F.customCards.some(n=>n.type==="power-flow-refined")||F.customCards.push({type:"power-flow-refined",name:"Power Flow Refined",description:"Energiefluss mit Ringen um Solar, Netz, Batterie, Haus und Zusatzkreise",preview:!1});
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
