(()=>{var Ru=0,Uc=1,Cu=2;var Ur=1,Pu=2,Gs=3,Ki=0,ii=1,Qe=2,Qi=0,Un=1,pn=2,Fc=3,Bc=4,Iu=5;var Qn=100,Lu=101,zu=102,Du=103,Nu=104,Uu=200,Fu=201,Bu=202,ku=203,kc=204,Oc=205,Ou=206,Hu=207,Gu=208,Vu=209,Wu=210,qu=211,Xu=212,Yu=213,$u=214,Pa=0,Ia=1,La=2,Is=3,za=4,Da=5,Na=6,Ua=7,uo=0,Zu=1,Ju=2,Bi=0,Hc=1,Gc=2,Vc=3,Wc=4,qc=5,Xc=6,Yc=7;var $c=300,Fn=301,ts=302,fo=303,po=304,Fr=306,Ls=1e3,Yi=1001,Fa=1002,ke=1003,ju=1004;var Br=1005;var Oe=1006,mo=1007;var Bn=1008;var ci=1009,Zc=1010,Jc=1011,Vs=1012,go=1013,ki=1014,Ei=1015,Si=1016,xo=1017,vo=1018,Ws=1020,jc=35902,Kc=35899,Qc=1021,th=1022,Ai=1023,$i=1026,kn=1027,yo=1028,_o=1029,On=1030,bo=1031;var Mo=1033,kr=33776,Or=33777,Hr=33778,Gr=33779,So=35840,wo=35841,To=35842,Eo=35843,Ao=36196,Ro=37492,Co=37496,Po=37488,Io=37489,Vr=37490,Lo=37491,zo=37808,Do=37809,No=37810,Uo=37811,Fo=37812,Bo=37813,ko=37814,Oo=37815,Ho=37816,Go=37817,Vo=37818,Wo=37819,qo=37820,Xo=37821,Yo=36492,$o=36494,Zo=36495,Jo=36283,jo=36284,Wr=36285,Ko=36286;var pr=2300,Ba=2301,Ra=2302,Rc=2303,Cc=2400,Pc=2401,Ic=2402;var Ku=3200;var Qo=0,Qu=1,mn="",ti="srgb",mr="srgb-linear",gr="linear",ge="srgb";var Ca=7680;var td=519,ed=512,id=513,nd=514,tl=515,sd=516,rd=517,el=518,ad=519,eh=35044,es=35048;var ih="300 es",Ni=2e3,zs=2001;function bf(a){for(let t=a.length-1;t>=0;--t)if(a[t]>=65535)return!0;return!1}function Mf(a){return ArrayBuffer.isView(a)&&!(a instanceof DataView)}function xr(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function od(){let a=xr("canvas");return a.style.display="block",a}var jh={},Ds=null;function vr(...a){let t="THREE."+a.shift();Ds?Ds("log",t,...a):console.log(t,...a)}function ld(a){let t=a[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=a[1];e&&e.isStackTrace?a[0]+=" "+e.getLocation():a[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return a}function Ft(...a){a=ld(a);let t="THREE."+a.shift();if(Ds)Ds("warn",t,...a);else{let e=a[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...a)}}function kt(...a){a=ld(a);let t="THREE."+a.shift();if(Ds)Ds("error",t,...a);else{let e=a[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...a)}}function Jn(...a){let t=a.join(" ");t in jh||(jh[t]=!0,Ft(...a))}function cd(a,t,e){return new Promise(function(i,n){function s(){switch(a.clientWaitSync(t,a.SYNC_FLUSH_COMMANDS_BIT,0)){case a.WAIT_FAILED:n();break;case a.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}var hd={[Pa]:Ia,[La]:Na,[za]:Ua,[Is]:Da,[Ia]:Pa,[Na]:La,[Ua]:za,[Da]:Is},Zi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let n=i[t];if(n!==void 0){let s=n.indexOf(e);s!==-1&&n.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let n=i.slice(0);for(let s=0,r=n.length;s<r;s++)n[s].call(this,t);t.target=null}}},ai=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var nc=Math.PI/180,ka=180/Math.PI;function Tn(){let a=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ai[a&255]+ai[a>>8&255]+ai[a>>16&255]+ai[a>>24&255]+"-"+ai[t&255]+ai[t>>8&255]+"-"+ai[t>>16&15|64]+ai[t>>24&255]+"-"+ai[e&63|128]+ai[e>>8&255]+"-"+ai[e>>16&255]+ai[e>>24&255]+ai[i&255]+ai[i>>8&255]+ai[i>>16&255]+ai[i>>24&255]).toLowerCase()}function ie(a,t,e){return Math.max(t,Math.min(e,a))}function Sf(a,t){return(a%t+t)%t}function sc(a,t,e){return(1-e)*a+e*t}function Xi(a,t){switch(t.constructor){case Float32Array:return a;case Uint32Array:return a/4294967295;case Uint16Array:return a/65535;case Uint8Array:case Uint8ClampedArray:return a/255;case Int32Array:return Math.max(a/2147483647,-1);case Int16Array:return Math.max(a/32767,-1);case Int8Array:return Math.max(a/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function _e(a,t){switch(t.constructor){case Float32Array:return a;case Uint32Array:return Math.round(a*4294967295);case Uint16Array:return Math.round(a*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(a*255);case Int32Array:return Math.round(a*2147483647);case Int16Array:return Math.round(a*32767);case Int8Array:return Math.round(a*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var oh=class oh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ie(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(ie(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),n=Math.sin(e),s=this.x-t.x,r=this.y-t.y;return this.x=s*i-r*n+t.x,this.y=s*n+r*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};oh.prototype.isVector2=!0;var Ht=oh,bi=class{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,s,r,o){let l=i[n+0],c=i[n+1],h=i[n+2],u=i[n+3],d=s[r+0],f=s[r+1],m=s[r+2],x=s[r+3];if(u!==x||l!==d||c!==f||h!==m){let g=l*d+c*f+h*m+u*x;g<0&&(d=-d,f=-f,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){let y=Math.acos(g),M=Math.sin(y);p=Math.sin(p*y)/M,o=Math.sin(o*y)/M,l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+x*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+x*o;let y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,n,s,r){let o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],u=s[r],d=s[r+1],f=s[r+2],m=s[r+3];return t[e]=o*m+h*u+l*f-c*d,t[e+1]=l*m+h*d+c*u-o*f,t[e+2]=c*m+h*f+o*d-l*u,t[e+3]=h*m-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,n=t._y,s=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),u=o(s/2),d=l(i/2),f=l(n/2),m=l(s/2);switch(r){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:Ft("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],n=e[4],s=e[8],r=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=i+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(r-n)*f}else if(i>o&&i>u){let f=2*Math.sqrt(1+i-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(n+r)/f,this._z=(s+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-i-u);this._w=(s-c)/f,this._x=(n+r)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-i-o);this._w=(r-n)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ie(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,n=t._y,s=t._z,r=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+r*o+n*c-s*l,this._y=n*h+r*l+s*o-i*c,this._z=s*h+r*c+i*l-n*o,this._w=r*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,s=t._z,r=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,s=-s,r=-r,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+s*e,this._w=this._w*l+r*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+s*e,this._w=this._w*l+r*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},lh=class lh{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Kh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Kh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*n,this.y=s[1]*e+s[4]*i+s[7]*n,this.z=s[2]*e+s[5]*i+s[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,n=this.z,s=t.elements,r=1/(s[3]*e+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*n+s[12])*r,this.y=(s[1]*e+s[5]*i+s[9]*n+s[13])*r,this.z=(s[2]*e+s[6]*i+s[10]*n+s[14])*r,this}applyQuaternion(t){let e=this.x,i=this.y,n=this.z,s=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*n-o*i),h=2*(o*e-s*n),u=2*(s*i-r*e);return this.x=e+l*c+r*u-o*h,this.y=i+l*h+o*c-s*u,this.z=n+l*u+s*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*n,this.y=s[1]*e+s[5]*i+s[9]*n,this.z=s[2]*e+s[6]*i+s[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ie(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,n=t.y,s=t.z,r=e.x,o=e.y,l=e.z;return this.x=n*l-s*o,this.y=s*r-i*l,this.z=i*o-n*r,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return rc.copy(this).projectOnVector(t),this.sub(rc)}reflect(t){return this.sub(rc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(ie(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};lh.prototype.isVector3=!0;var N=lh,rc=new N,Kh=new bi,ch=class ch{constructor(t,e,i,n,s,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,r,o,l,c)}set(t,e,i,n,s,r,o,l,c){let h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,n=e.elements,s=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],d=i[2],f=i[5],m=i[8],x=n[0],g=n[3],p=n[6],y=n[1],M=n[4],v=n[7],S=n[2],b=n[5],E=n[8];return s[0]=r*x+o*y+l*S,s[3]=r*g+o*M+l*b,s[6]=r*p+o*v+l*E,s[1]=c*x+h*y+u*S,s[4]=c*g+h*M+u*b,s[7]=c*p+h*v+u*E,s[2]=d*x+f*y+m*S,s[5]=d*g+f*M+m*b,s[8]=d*p+f*v+m*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*o*c-i*s*h+i*o*l+n*s*c-n*r*l}invert(){let t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*r-o*c,d=o*l-h*s,f=c*s-r*l,m=e*u+i*d+n*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=u*x,t[1]=(n*c-h*i)*x,t[2]=(o*i-n*r)*x,t[3]=d*x,t[4]=(h*e-n*l)*x,t[5]=(n*s-o*e)*x,t[6]=f*x,t[7]=(i*l-c*e)*x,t[8]=(r*e-i*s)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,s,r,o){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*r+c*o)+r+t,-n*c,n*l,-n*(-c*r+l*o)+o+e,0,0,1),this}scale(t,e){return Jn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ac.makeScale(t,e)),this}rotate(t){return Jn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ac.makeRotation(-t)),this}translate(t,e){return Jn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ac.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};ch.prototype.isMatrix3=!0;var Vt=ch,ac=new Vt,Qh=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tu=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wf(){let a={enabled:!0,workingColorSpace:mr,spaces:{},convert:function(n,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===ge&&(n.r=dn(n.r),n.g=dn(n.g),n.b=dn(n.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===ge&&(n.r=Ps(n.r),n.g=Ps(n.g),n.b=Ps(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===mn?gr:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,r){return n.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,s){return Jn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),a.workingToColorSpace(n,s)},toWorkingColorSpace:function(n,s){return Jn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),a.colorSpaceToWorking(n,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return a.define({[mr]:{primaries:t,whitePoint:i,transfer:gr,toXYZ:Qh,fromXYZ:tu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ti},outputColorSpaceConfig:{drawingBufferColorSpace:ti}},[ti]:{primaries:t,whitePoint:i,transfer:ge,toXYZ:Qh,fromXYZ:tu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ti}}}),a}var ee=wf();function dn(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function Ps(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}var ds,Oa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{ds===void 0&&(ds=xr("canvas")),ds.width=t.width,ds.height=t.height;let n=ds.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=ds}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=xr("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let n=i.getImageData(0,0,t.width,t.height),s=n.data;for(let r=0;r<s.length;r++)s[r]=dn(s[r]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(dn(e[i]/255)*255):e[i]=dn(e[i]);return{data:e,width:t.width,height:t.height}}else return Ft("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Tf=0,Ns=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=Tn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let r=0,o=n.length;r<o;r++)n[r].isDataTexture?s.push(oc(n[r].image)):s.push(oc(n[r]))}else s=oc(n);i.url=s}return e||(t.images[this.uuid]=i),i}};function oc(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?Oa.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:(Ft("Texture: Unable to serialize Texture."),{})}var Ef=0,lc=new N,mi=class a extends Zi{constructor(t=a.DEFAULT_IMAGE,e=a.DEFAULT_MAPPING,i=Yi,n=Yi,s=Oe,r=Bn,o=Ai,l=ci,c=a.DEFAULT_ANISOTROPY,h=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Tn(),this.name="",this.source=new Ns(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(lc).x}get height(){return this.source.getSize(lc).y}get depth(){return this.source.getSize(lc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Ft(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let n=this[e];if(n===void 0){Ft(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$c)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ls:t.x=t.x-Math.floor(t.x);break;case Yi:t.x=t.x<0?0:1;break;case Fa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ls:t.y=t.y-Math.floor(t.y);break;case Yi:t.y=t.y<0?0:1;break;case Fa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};mi.DEFAULT_IMAGE=null;mi.DEFAULT_MAPPING=$c;mi.DEFAULT_ANISOTROPY=1;var hh=class hh{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,n=this.z,s=this.w,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*n+r[12]*s,this.y=r[1]*e+r[5]*i+r[9]*n+r[13]*s,this.z=r[2]*e+r[6]*i+r[10]*n+r[14]*s,this.w=r[3]*e+r[7]*i+r[11]*n+r[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,s,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(c+1)/2,v=(f+1)/2,S=(p+1)/2,b=(h+d)/4,E=(u+x)/4,_=(m+g)/4;return M>v&&M>S?M<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(M),n=b/i,s=E/i):v>S?v<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(v),i=b/n,s=_/n):S<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(S),i=E/s,n=_/s),this.set(i,n,s,e),this}let y=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(u-x)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ie(this.x,t.x,e.x),this.y=ie(this.y,t.y,e.y),this.z=ie(this.z,t.z,e.z),this.w=ie(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ie(this.x,t,e),this.y=ie(this.y,t,e),this.z=ie(this.z,t,e),this.w=ie(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ie(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};hh.prototype.isVector4=!0;var Ce=hh,Ha=class extends Zi{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Oe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ce(0,0,t,e),this.scissorTest=!1,this.viewport=new Ce(0,0,t,e),this.textures=[];let n={width:t,height:e,depth:i.depth},s=new mi(n),r=i.count;for(let o=0;o<r;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Oe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let n=Object.assign({},t.textures[e].image);this.textures[e].source=new Ns(n)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ke=class extends Ha{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},yr=class extends mi{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ke,this.minFilter=ke,this.wrapR=Yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ga=class extends mi{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=ke,this.minFilter=ke,this.wrapR=Yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var ho=class ho{constructor(t,e,i,n,s,r,o,l,c,h,u,d,f,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,r,o,l,c,h,u,d,f,m,x,g)}set(t,e,i,n,s,r,o,l,c,h,u,d,f,m,x,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=n,p[1]=s,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ho().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,n=1/fs.setFromMatrixColumn(t,0).length(),s=1/fs.setFromMatrixColumn(t,1).length(),r=1/fs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*r,e[9]=i[9]*r,e[10]=i[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,n=t.y,s=t.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){let d=r*h,f=r*u,m=o*h,x=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=d-x*c,e[9]=-o*l,e[2]=x-d*c,e[6]=m+f*c,e[10]=r*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,m=c*h,x=c*u;e[0]=d+x*o,e[4]=m*o-f,e[8]=r*c,e[1]=r*u,e[5]=r*h,e[9]=-o,e[2]=f*o-m,e[6]=x+d*o,e[10]=r*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,m=c*h,x=c*u;e[0]=d-x*o,e[4]=-r*u,e[8]=m+f*o,e[1]=f+m*o,e[5]=r*h,e[9]=x-d*o,e[2]=-r*c,e[6]=o,e[10]=r*l}else if(t.order==="ZYX"){let d=r*h,f=r*u,m=o*h,x=o*u;e[0]=l*h,e[4]=m*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-m,e[2]=-c,e[6]=o*l,e[10]=r*l}else if(t.order==="YZX"){let d=r*l,f=r*c,m=o*l,x=o*c;e[0]=l*h,e[4]=x-d*u,e[8]=m*u+f,e[1]=u,e[5]=r*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+m,e[10]=d-x*u}else if(t.order==="XZY"){let d=r*l,f=r*c,m=o*l,x=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=r*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Af,t,Rf)}lookAt(t,e,i){let n=this.elements;return yi.subVectors(t,e),yi.lengthSq()===0&&(yi.z=1),yi.normalize(),_n.crossVectors(i,yi),_n.lengthSq()===0&&(Math.abs(i.z)===1?yi.x+=1e-4:yi.z+=1e-4,yi.normalize(),_n.crossVectors(i,yi)),_n.normalize(),ea.crossVectors(yi,_n),n[0]=_n.x,n[4]=ea.x,n[8]=yi.x,n[1]=_n.y,n[5]=ea.y,n[9]=yi.y,n[2]=_n.z,n[6]=ea.z,n[10]=yi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,n=e.elements,s=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],d=i[9],f=i[13],m=i[2],x=i[6],g=i[10],p=i[14],y=i[3],M=i[7],v=i[11],S=i[15],b=n[0],E=n[4],_=n[8],T=n[12],R=n[1],C=n[5],L=n[9],z=n[13],P=n[2],D=n[6],O=n[10],k=n[14],$=n[3],W=n[7],Y=n[11],j=n[15];return s[0]=r*b+o*R+l*P+c*$,s[4]=r*E+o*C+l*D+c*W,s[8]=r*_+o*L+l*O+c*Y,s[12]=r*T+o*z+l*k+c*j,s[1]=h*b+u*R+d*P+f*$,s[5]=h*E+u*C+d*D+f*W,s[9]=h*_+u*L+d*O+f*Y,s[13]=h*T+u*z+d*k+f*j,s[2]=m*b+x*R+g*P+p*$,s[6]=m*E+x*C+g*D+p*W,s[10]=m*_+x*L+g*O+p*Y,s[14]=m*T+x*z+g*k+p*j,s[3]=y*b+M*R+v*P+S*$,s[7]=y*E+M*C+v*D+S*W,s[11]=y*_+M*L+v*O+S*Y,s[15]=y*T+M*z+v*k+S*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],n=t[8],s=t[12],r=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15],y=l*f-c*d,M=o*f-c*u,v=o*d-l*u,S=r*f-c*h,b=r*d-l*h,E=r*u-o*h;return e*(x*y-g*M+p*v)-i*(m*y-g*S+p*b)+n*(m*M-x*S+p*E)-s*(m*v-x*b+g*E)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],n=t[8],s=t[1],r=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(r*h-o*c)-i*(s*h-o*l)+n*(s*c-r*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],y=e*o-i*r,M=e*l-n*r,v=e*c-s*r,S=i*l-n*o,b=i*c-s*o,E=n*c-s*l,_=h*x-u*m,T=h*g-d*m,R=h*p-f*m,C=u*g-d*x,L=u*p-f*x,z=d*p-f*g,P=y*z-M*L+v*C+S*R-b*T+E*_;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/P;return t[0]=(o*z-l*L+c*C)*D,t[1]=(n*L-i*z-s*C)*D,t[2]=(x*E-g*b+p*S)*D,t[3]=(d*b-u*E-f*S)*D,t[4]=(l*R-r*z-c*T)*D,t[5]=(e*z-n*R+s*T)*D,t[6]=(g*v-m*E-p*M)*D,t[7]=(h*E-d*v+f*M)*D,t[8]=(r*L-o*R+c*_)*D,t[9]=(i*R-e*L-s*_)*D,t[10]=(m*b-x*v+p*y)*D,t[11]=(u*v-h*b-f*y)*D,t[12]=(o*T-r*C-l*_)*D,t[13]=(e*C-i*T+n*_)*D,t[14]=(x*M-m*S-g*y)*D,t[15]=(h*S-u*M+d*y)*D,this}scale(t){let e=this.elements,i=t.x,n=t.y,s=t.z;return e[0]*=i,e[4]*=n,e[8]*=s,e[1]*=i,e[5]*=n,e[9]*=s,e[2]*=i,e[6]*=n,e[10]*=s,e[3]*=i,e[7]*=n,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),n=Math.sin(e),s=1-i,r=t.x,o=t.y,l=t.z,c=s*r,h=s*o;return this.set(c*r+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*r,0,c*l-n*o,h*l+n*r,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,s,r){return this.set(1,i,s,0,t,1,r,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){let n=this.elements,s=e._x,r=e._y,o=e._z,l=e._w,c=s+s,h=r+r,u=o+o,d=s*c,f=s*h,m=s*u,x=r*h,g=r*u,p=o*u,y=l*c,M=l*h,v=l*u,S=i.x,b=i.y,E=i.z;return n[0]=(1-(x+p))*S,n[1]=(f+v)*S,n[2]=(m-M)*S,n[3]=0,n[4]=(f-v)*b,n[5]=(1-(d+p))*b,n[6]=(g+y)*b,n[7]=0,n[8]=(m+M)*E,n[9]=(g-y)*E,n[10]=(1-(d+x))*E,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){let n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),e.identity(),this;let r=fs.set(n[0],n[1],n[2]).length(),o=fs.set(n[4],n[5],n[6]).length(),l=fs.set(n[8],n[9],n[10]).length();s<0&&(r=-r),Ii.copy(this);let c=1/r,h=1/o,u=1/l;return Ii.elements[0]*=c,Ii.elements[1]*=c,Ii.elements[2]*=c,Ii.elements[4]*=h,Ii.elements[5]*=h,Ii.elements[6]*=h,Ii.elements[8]*=u,Ii.elements[9]*=u,Ii.elements[10]*=u,e.setFromRotationMatrix(Ii),i.x=r,i.y=o,i.z=l,this}makePerspective(t,e,i,n,s,r,o=Ni,l=!1){let c=this.elements,h=2*s/(e-t),u=2*s/(i-n),d=(e+t)/(e-t),f=(i+n)/(i-n),m,x;if(l)m=s/(r-s),x=r*s/(r-s);else if(o===Ni)m=-(r+s)/(r-s),x=-2*r*s/(r-s);else if(o===zs)m=-r/(r-s),x=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,n,s,r,o=Ni,l=!1){let c=this.elements,h=2/(e-t),u=2/(i-n),d=-(e+t)/(e-t),f=-(i+n)/(i-n),m,x;if(l)m=1/(r-s),x=r/(r-s);else if(o===Ni)m=-2/(r-s),x=-(r+s)/(r-s);else if(o===zs)m=-1/(r-s),x=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};ho.prototype.isMatrix4=!0;var de=ho,fs=new N,Ii=new de,Af=new N(0,0,0),Rf=new N(1,1,1),_n=new N,ea=new N,yi=new N,eu=new de,iu=new bi,Ui=class a{constructor(t=0,e=0,i=0,n=a.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let n=t.elements,s=n[0],r=n[4],o=n[8],l=n[1],c=n[5],h=n[9],u=n[2],d=n[6],f=n[10];switch(e){case"XYZ":this._y=Math.asin(ie(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(ie(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ie(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ie(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ft("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return eu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(eu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return iu.setFromEuler(this),this.setFromQuaternion(iu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ui.DEFAULT_ORDER="XYZ";var _r=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Cf=0,nu=new N,ps=new bi,an=new de,ia=new N,sr=new N,Pf=new N,If=new bi,su=new N(1,0,0),ru=new N(0,1,0),au=new N(0,0,1),ou={type:"added"},Lf={type:"removed"},ms={type:"childadded",child:null},cc={type:"childremoved",child:null},Xe=class a extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=Tn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=a.DEFAULT_UP.clone();let t=new N,e=new Ui,i=new bi,n=new N(1,1,1);function s(){i.setFromEuler(e,!1)}function r(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new de},normalMatrix:{value:new Vt}}),this.matrix=new de,this.matrixWorld=new de,this.matrixAutoUpdate=a.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=a.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _r,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ps.setFromAxisAngle(t,e),this.quaternion.multiply(ps),this}rotateOnWorldAxis(t,e){return ps.setFromAxisAngle(t,e),this.quaternion.premultiply(ps),this}rotateX(t){return this.rotateOnAxis(su,t)}rotateY(t){return this.rotateOnAxis(ru,t)}rotateZ(t){return this.rotateOnAxis(au,t)}translateOnAxis(t,e){return nu.copy(t).applyQuaternion(this.quaternion),this.position.add(nu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(su,t)}translateY(t){return this.translateOnAxis(ru,t)}translateZ(t){return this.translateOnAxis(au,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ia.copy(t):ia.set(t,e,i);let n=this.parent;this.updateWorldMatrix(!0,!1),sr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(sr,ia,this.up):an.lookAt(ia,sr,this.up),this.quaternion.setFromRotationMatrix(an),n&&(an.extractRotation(n.matrixWorld),ps.setFromRotationMatrix(an),this.quaternion.premultiply(ps.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(kt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ou),ms.child=t,this.dispatchEvent(ms),ms.child=null):kt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Lf),cc.child=t,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),an.multiply(t.parent.matrixWorld)),t.applyMatrix4(an),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ou),ms.child=t,this.dispatchEvent(ms),ms.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){let r=this.children[i].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let n=this.children;for(let s=0,r=n.length;s<r;s++)n[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,t,Pf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sr,If,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,n=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*i-s[8]*n,s[13]+=i-s[1]*e-s[5]*i-s[9]*n,s[14]+=n-s[2]*e-s[6]*i-s[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));n.material=o}else n.material=s(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];n.animations.push(s(t.animations,l))}}if(e){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),u=r(t.shapes),d=r(t.skeletons),f=r(t.animations),m=r(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=n,i;function r(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let n=t.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Xe.DEFAULT_UP=new N(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Qt=class extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}},zf={type:"move"},Us=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,s=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,i),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zf)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Qt;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},ud={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},bn={h:0,s:0,l:0},na={h:0,s:0,l:0};function hc(a,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?a+(t-a)*6*e:e<1/2?t:e<2/3?a+(t-a)*6*(2/3-e):a}var Ct=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ti){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ee.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=ee.workingColorSpace){return this.r=t,this.g=e,this.b=i,ee.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=ee.workingColorSpace){if(t=Sf(t,1),e=ie(e,0,1),i=ie(i,0,1),e===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+e):i+e-i*e,r=2*i-s;this.r=hc(r,s,t+1/3),this.g=hc(r,s,t),this.b=hc(r,s,t-1/3)}return ee.colorSpaceToWorking(this,n),this}setStyle(t,e=ti){function i(s){s!==void 0&&parseFloat(s)<1&&Ft("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,r=n[1],o=n[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:Ft("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=n[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(s,16),e);Ft("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ti){let i=ud[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Ft("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=dn(t.r),this.g=dn(t.g),this.b=dn(t.b),this}copyLinearToSRGB(t){return this.r=Ps(t.r),this.g=Ps(t.g),this.b=Ps(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ti){return ee.workingToColorSpace(oi.copy(this),t),Math.round(ie(oi.r*255,0,255))*65536+Math.round(ie(oi.g*255,0,255))*256+Math.round(ie(oi.b*255,0,255))}getHexString(t=ti){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ee.workingColorSpace){ee.workingToColorSpace(oi.copy(this),e);let i=oi.r,n=oi.g,s=oi.b,r=Math.max(i,n,s),o=Math.min(i,n,s),l,c,h=(o+r)/2;if(o===r)l=0,c=0;else{let u=r-o;switch(c=h<=.5?u/(r+o):u/(2-r-o),r){case i:l=(n-s)/u+(n<s?6:0);break;case n:l=(s-i)/u+2;break;case s:l=(i-n)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ee.workingColorSpace){return ee.workingToColorSpace(oi.copy(this),e),t.r=oi.r,t.g=oi.g,t.b=oi.b,t}getStyle(t=ti){ee.workingToColorSpace(oi.copy(this),t);let e=oi.r,i=oi.g,n=oi.b;return t!==ti?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(bn),this.setHSL(bn.h+t,bn.s+e,bn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(bn),t.getHSL(na);let i=sc(bn.h,na.h,e),n=sc(bn.s,na.s,e),s=sc(bn.l,na.l,e);return this.setHSL(i,n,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,n=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*n,this.g=s[1]*e+s[4]*i+s[7]*n,this.b=s[2]*e+s[5]*i+s[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},oi=new Ct;Ct.NAMES=ud;var br=class a{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new Ct(t),this.near=e,this.far=i}clone(){return new a(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},jn=class extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ui,this.environmentIntensity=1,this.environmentRotation=new Ui,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Li=new N,on=new N,uc=new N,ln=new N,gs=new N,xs=new N,lu=new N,dc=new N,fc=new N,pc=new N,mc=new Ce,gc=new Ce,xc=new Ce,un=class a{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),Li.subVectors(t,e),n.cross(Li);let s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(t,e,i,n,s){Li.subVectors(n,e),on.subVectors(i,e),uc.subVectors(t,e);let r=Li.dot(Li),o=Li.dot(on),l=Li.dot(uc),c=on.dot(on),h=on.dot(uc),u=r*c-o*o;if(u===0)return s.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,m=(r*h-o*l)*d;return s.set(1-f-m,m,f)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,ln)===null?!1:ln.x>=0&&ln.y>=0&&ln.x+ln.y<=1}static getInterpolation(t,e,i,n,s,r,o,l){return this.getBarycoord(t,e,i,n,ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ln.x),l.addScaledVector(r,ln.y),l.addScaledVector(o,ln.z),l)}static getInterpolatedAttribute(t,e,i,n,s,r){return mc.setScalar(0),gc.setScalar(0),xc.setScalar(0),mc.fromBufferAttribute(t,e),gc.fromBufferAttribute(t,i),xc.fromBufferAttribute(t,n),r.setScalar(0),r.addScaledVector(mc,s.x),r.addScaledVector(gc,s.y),r.addScaledVector(xc,s.z),r}static isFrontFacing(t,e,i,n){return Li.subVectors(i,e),on.subVectors(t,e),Li.cross(on).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Li.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Li.cross(on).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return a.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return a.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,s){return a.getInterpolation(t,this.a,this.b,this.c,e,i,n,s)}containsPoint(t){return a.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return a.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,n=this.b,s=this.c,r,o;gs.subVectors(n,i),xs.subVectors(s,i),dc.subVectors(t,i);let l=gs.dot(dc),c=xs.dot(dc);if(l<=0&&c<=0)return e.copy(i);fc.subVectors(t,n);let h=gs.dot(fc),u=xs.dot(fc);if(h>=0&&u<=h)return e.copy(n);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(i).addScaledVector(gs,r);pc.subVectors(t,s);let f=gs.dot(pc),m=xs.dot(pc);if(m>=0&&f<=m)return e.copy(s);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(i).addScaledVector(xs,o);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return lu.subVectors(s,n),o=(u-h)/(u-h+(f-m)),e.copy(n).addScaledVector(lu,o);let p=1/(g+x+d);return r=x*p,o=d*p,e.copy(i).addScaledVector(gs,r).addScaledVector(xs,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ji=class{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(zi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(zi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=zi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let r=0,o=s.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,zi):zi.fromBufferAttribute(s,r),zi.applyMatrix4(t.matrixWorld),this.expandByPoint(zi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),sa.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),sa.copy(i.boundingBox)),sa.applyMatrix4(t.matrixWorld),this.union(sa)}let n=t.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,zi),zi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rr),ra.subVectors(this.max,rr),vs.subVectors(t.a,rr),ys.subVectors(t.b,rr),_s.subVectors(t.c,rr),Mn.subVectors(ys,vs),Sn.subVectors(_s,ys),Xn.subVectors(vs,_s);let e=[0,-Mn.z,Mn.y,0,-Sn.z,Sn.y,0,-Xn.z,Xn.y,Mn.z,0,-Mn.x,Sn.z,0,-Sn.x,Xn.z,0,-Xn.x,-Mn.y,Mn.x,0,-Sn.y,Sn.x,0,-Xn.y,Xn.x,0];return!vc(e,vs,ys,_s,ra)||(e=[1,0,0,0,1,0,0,0,1],!vc(e,vs,ys,_s,ra))?!1:(aa.crossVectors(Mn,Sn),e=[aa.x,aa.y,aa.z],vc(e,vs,ys,_s,ra))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,zi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(zi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(cn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},cn=[new N,new N,new N,new N,new N,new N,new N,new N],zi=new N,sa=new Ji,vs=new N,ys=new N,_s=new N,Mn=new N,Sn=new N,Xn=new N,rr=new N,ra=new N,aa=new N,Yn=new N;function vc(a,t,e,i,n){for(let s=0,r=a.length-3;s<=r;s+=3){Yn.fromArray(a,s);let o=n.x*Math.abs(Yn.x)+n.y*Math.abs(Yn.y)+n.z*Math.abs(Yn.z),l=t.dot(Yn),c=e.dot(Yn),h=i.dot(Yn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Be=new N,oa=new Ht,Df=0,ne=class extends Zi{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Df++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=eh,this.updateRanges=[],this.gpuType=Ei,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)oa.fromBufferAttribute(this,e),oa.applyMatrix3(t),this.setXY(e,oa.x,oa.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix3(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=_e(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Xi(e,this.array)),e}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Xi(e,this.array)),e}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Xi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Xi(e,this.array)),e}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),n=_e(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t*=this.itemSize,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var Mr=class extends ne{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var Sr=class extends ne{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var ce=class extends ne{constructor(t,e,i){super(new Float32Array(t),e,i)}},Nf=new Ji,ar=new N,yc=new N,ji=class{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):Nf.setFromPoints(t).getCenter(i);let n=0;for(let s=0,r=t.length;s<r;s++)n=Math.max(n,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ar.subVectors(t,this.center);let e=ar.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(ar,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(yc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ar.copy(t.center).add(yc)),this.expandByPoint(ar.copy(t.center).sub(yc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Uf=0,Ti=new de,_c=new Xe,bs=new N,_i=new Ji,or=new Ji,je=new N,fe=class a extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=Tn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bf(t)?Sr:Mr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Vt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}let n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Ti.makeRotationFromQuaternion(t),this.applyMatrix4(Ti),this}rotateX(t){return Ti.makeRotationX(t),this.applyMatrix4(Ti),this}rotateY(t){return Ti.makeRotationY(t),this.applyMatrix4(Ti),this}rotateZ(t){return Ti.makeRotationZ(t),this.applyMatrix4(Ti),this}translate(t,e,i){return Ti.makeTranslation(t,e,i),this.applyMatrix4(Ti),this}scale(t,e,i){return Ti.makeScale(t,e,i),this.applyMatrix4(Ti),this}lookAt(t){return _c.lookAt(t),_c.updateMatrix(),this.applyMatrix4(_c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bs).negate(),this.translate(bs.x,bs.y,bs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ce(i,3))}else{let i=Math.min(t.length,e.count);for(let n=0;n<i;n++){let s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&Ft("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){kt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){let s=e[i];_i.setFromBufferAttribute(s),this.morphTargetsRelative?(je.addVectors(this.boundingBox.min,_i.min),this.boundingBox.expandByPoint(je),je.addVectors(this.boundingBox.max,_i.max),this.boundingBox.expandByPoint(je)):(this.boundingBox.expandByPoint(_i.min),this.boundingBox.expandByPoint(_i.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&kt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){kt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){let i=this.boundingSphere.center;if(_i.setFromBufferAttribute(t),e)for(let s=0,r=e.length;s<r;s++){let o=e[s];or.setFromBufferAttribute(o),this.morphTargetsRelative?(je.addVectors(_i.min,or.min),_i.expandByPoint(je),je.addVectors(_i.max,or.max),_i.expandByPoint(je)):(_i.expandByPoint(or.min),_i.expandByPoint(or.max))}_i.getCenter(i);let n=0;for(let s=0,r=t.count;s<r;s++)je.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(je));if(e)for(let s=0,r=e.length;s<r;s++){let o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)je.fromBufferAttribute(o,c),l&&(bs.fromBufferAttribute(t,c),je.add(bs)),n=Math.max(n,i.distanceToSquared(je))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&kt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){kt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,n=e.normal,s=e.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==i.count)&&(r=new ne(new Float32Array(4*i.count),4),this.setAttribute("tangent",r));let o=[],l=[];for(let _=0;_<i.count;_++)o[_]=new N,l[_]=new N;let c=new N,h=new N,u=new N,d=new Ht,f=new Ht,m=new Ht,x=new N,g=new N;function p(_,T,R){c.fromBufferAttribute(i,_),h.fromBufferAttribute(i,T),u.fromBufferAttribute(i,R),d.fromBufferAttribute(s,_),f.fromBufferAttribute(s,T),m.fromBufferAttribute(s,R),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let C=1/(f.x*m.y-m.x*f.y);isFinite(C)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(C),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(C),o[_].add(x),o[T].add(x),o[R].add(x),l[_].add(g),l[T].add(g),l[R].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let _=0,T=y.length;_<T;++_){let R=y[_],C=R.start,L=R.count;for(let z=C,P=C+L;z<P;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}let M=new N,v=new N,S=new N,b=new N;function E(_){S.fromBufferAttribute(n,_),b.copy(S);let T=o[_];M.copy(T),M.sub(S.multiplyScalar(S.dot(T))).normalize(),v.crossVectors(b,T);let C=v.dot(l[_])<0?-1:1;r.setXYZW(_,M.x,M.y,M.z,C)}for(let _=0,T=y.length;_<T;++_){let R=y[_],C=R.start,L=R.count;for(let z=C,P=C+L;z<P;z+=3)E(t.getX(z+0)),E(t.getX(z+1)),E(t.getX(z+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ne(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let n=new N,s=new N,r=new N,o=new N,l=new N,c=new N,h=new N,u=new N;if(t)for(let d=0,f=t.count;d<f;d+=3){let m=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);n.fromBufferAttribute(e,m),s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,g),h.subVectors(r,s),u.subVectors(n,s),h.cross(u),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)n.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),h.subVectors(r,s),u.subVectors(n,s),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)je.fromBufferAttribute(t,e),je.normalize(),t.setXYZ(e,je.x,je.y,je.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new ne(d,h,u)}if(this.index===null)return Ft("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new a,i=this.index.array,n=this.attributes;for(let o in n){let l=n[o],c=t(l,i);e.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,i);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let n={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(n[l]=h,s=!0)}s&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let n=t.attributes;for(let c in n){let h=n[c];this.setAttribute(c,h.clone(e))}let s=t.morphAttributes;for(let c in s){let h=[],u=s[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,h=r.length;c<h;c++){let u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},wr=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=eh,this.updateRanges=[],this.version=0,this.uuid=Tn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,s=this.stride;n<s;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}},pi=new N,Fs=class a{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)pi.fromBufferAttribute(this,e),pi.applyMatrix4(t),this.setXYZ(e,pi.x,pi.y,pi.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)pi.fromBufferAttribute(this,e),pi.applyNormalMatrix(t),this.setXYZ(e,pi.x,pi.y,pi.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)pi.fromBufferAttribute(this,e),pi.transformDirection(t),this.setXYZ(e,pi.x,pi.y,pi.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=Xi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=_e(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=_e(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Xi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Xi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Xi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Xi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),n=_e(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=_e(e,this.array),i=_e(i,this.array),n=_e(n,this.array),s=_e(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=s,this}clone(t){if(t===void 0){vr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[n+s])}return new ne(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new a(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){vr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},bc=new N,Ff=new N,Bf=new Vt,Di=class{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let n=bc.subVectors(i,e).cross(Ff.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let n=t.delta(bc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return i===!0&&(r<0||r>1)?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||Bf.getNormalMatrix(t),n=this.coplanarPoint(bc).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},kf=0,Fi=class extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kf++}),this.uuid=Tn(),this.name="",this.type="Material",this.blending=Un,this.side=Ki,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kc,this.blendDst=Oc,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ct(0,0,0),this.blendAlpha=0,this.depthFunc=Is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=td,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ca,this.stencilZFail=Ca,this.stencilZPass=Ca,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Ft(`Material: parameter '${e}' has value of undefined.`);continue}let n=this[e];if(n===void 0){Ft(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){let r=[];for(let o in s){let l=s[o];delete l.metadata,r.push(l)}return r}if(e){let s=n(t.textures),r=n(t.images);s.length>0&&(i.textures=s),r.length>0&&(i.images=r)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ct().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Di().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ht().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ht().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let n=e.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},fn=class extends Fi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ms,lr=new N,Ss=new N,ws=new N,Ts=new Ht,cr=new Ht,dd=new de,la=new N,hr=new N,ca=new N,cu=new Ht,Mc=new Ht,hu=new Ht,En=class extends Xe{constructor(t=new fn){if(super(),this.isSprite=!0,this.type="Sprite",Ms===void 0){Ms=new fe;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new wr(e,5);Ms.setIndex([0,1,2,0,2,3]),Ms.setAttribute("position",new Fs(i,3,0,!1)),Ms.setAttribute("uv",new Fs(i,2,3,!1))}this.geometry=Ms,this.material=t,this.center=new Ht(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&kt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ss.setFromMatrixScale(this.matrixWorld),dd.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ws.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ss.multiplyScalar(-ws.z);let i=this.material.rotation,n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));let r=this.center;ha(la.set(-.5,-.5,0),ws,r,Ss,n,s),ha(hr.set(.5,-.5,0),ws,r,Ss,n,s),ha(ca.set(.5,.5,0),ws,r,Ss,n,s),cu.set(0,0),Mc.set(1,0),hu.set(1,1);let o=t.ray.intersectTriangle(la,hr,ca,!1,lr);if(o===null&&(ha(hr.set(-.5,.5,0),ws,r,Ss,n,s),Mc.set(0,1),o=t.ray.intersectTriangle(la,ca,hr,!1,lr),o===null))return;let l=t.ray.origin.distanceTo(lr);l<t.near||l>t.far||e.push({distance:l,point:lr.clone(),uv:un.getInterpolation(lr,la,hr,ca,cu,Mc,hu,new Ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function ha(a,t,e,i,n,s){Ts.subVectors(a,e).addScalar(.5).multiply(i),n!==void 0?(cr.x=s*Ts.x-n*Ts.y,cr.y=n*Ts.x+s*Ts.y):cr.copy(Ts),a.copy(t),a.x+=cr.x,a.y+=cr.y,a.applyMatrix4(dd)}var hn=new N,Sc=new N,ua=new N,da=new N,Bs=class{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,hn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=hn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(hn.copy(this.origin).addScaledVector(this.direction,e),hn.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){Sc.copy(t).add(e).multiplyScalar(.5),ua.copy(e).sub(t).normalize(),da.copy(this.origin).sub(Sc);let s=t.distanceTo(e)*.5,r=-this.direction.dot(ua),o=da.dot(this.direction),l=-da.dot(ua),c=da.lengthSq(),h=Math.abs(1-r*r),u,d,f,m;if(h>0)if(u=r*l-o,d=r*o-l,m=s*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,f=u*(u+r*d+2*o)+d*(r*u+d+2*l)+c}else d=s,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d=-s,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-r*s+o)),d=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(u=Math.max(0,-(r*s+o)),d=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+d*(d+2*l)+c);else d=r>0?-s:s,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),n&&n.copy(Sc).addScaledVector(ua,d),f}intersectSphere(t,e){if(t.radius<0)return null;hn.subVectors(t.center,this.origin);let i=hn.dot(this.direction),n=hn.dot(hn)-i*i,s=t.radius*t.radius;if(n>s)return null;let r=Math.sqrt(s-n),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,s,r,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,n=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,n=(t.min.x-d.x)*c),h>=0?(s=(t.min.y-d.y)*h,r=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,r=(t.min.y-d.y)*h),i>r||s>n||((s>i||isNaN(i))&&(i=s),(r<n||isNaN(n))&&(n=r),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,hn)!==null}intersectTriangle(t,e,i,n,s){let r=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=t.x-r.x,d=t.y-r.y,f=t.z-r.z,m=e.x-r.x,x=e.y-r.y,g=e.z-r.z,p=i.x-r.x,y=i.y-r.y,M=i.z-r.z,v=Math.abs(l),S=Math.abs(c),b=Math.abs(h),E,_,T,R,C,L,z,P,D,O,k,$;if(v>=S&&v>=b?(T=l,L=u,D=m,$=p,l>=0?(E=c,_=h,R=d,C=f,z=x,P=g,O=y,k=M):(E=h,_=c,R=f,C=d,z=g,P=x,O=M,k=y)):S>=b?(T=c,L=d,D=x,$=y,c>=0?(E=h,_=l,R=f,C=u,z=g,P=m,O=M,k=p):(E=l,_=h,R=u,C=f,z=m,P=g,O=p,k=M)):(T=h,L=f,D=g,$=M,h>=0?(E=l,_=c,R=u,C=d,z=m,P=x,O=p,k=y):(E=c,_=l,R=d,C=u,z=x,P=m,O=y,k=p)),T===0)return null;let W=E/T,Y=_/T,j=1/T,at=R-W*L,ot=C-Y*L,Gt=z-W*D,Xt=P-Y*D,jt=O-W*$,Z=k-Y*$,tt=jt*Xt-Z*Gt,wt=at*Z-ot*jt,Nt=Gt*ot-Xt*at;if(n){if(tt<0||wt<0||Nt<0)return null}else if((tt<0||wt<0||Nt<0)&&(tt>0||wt>0||Nt>0))return null;let bt=tt+wt+Nt;if(bt===0)return null;let qt=j*(tt*L+wt*D+Nt*$);return(bt>0?qt<0:qt>0)?null:this.at(qt/bt,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},He=class extends Fi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ui,this.combine=uo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},uu=new de,$n=new Bs,fa=new ji,du=new N,pa=new N,ma=new N,ga=new N,wc=new N,xa=new N,fu=new N,va=new N,xt=class extends Xe{constructor(t=new fe,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){let o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){let i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,r=i.morphTargetsRelative;e.fromBufferAttribute(n,t);let o=this.morphTargetInfluences;if(s&&o){xa.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],u=s[l];h!==0&&(wc.fromBufferAttribute(u,t),r?xa.addScaledVector(wc,h):xa.addScaledVector(wc.sub(e),h))}e.add(xa)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fa.copy(i.boundingSphere),fa.applyMatrix4(s),$n.copy(t.ray).recast(t.near),!(fa.containsPoint($n.origin)===!1&&($n.intersectSphere(fa,du)===null||$n.origin.distanceToSquared(du)>(t.far-t.near)**2))&&(uu.copy(s).invert(),$n.copy(t.ray).applyMatrix4(uu),!(i.boundingBox!==null&&$n.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,$n)))}_computeIntersections(t,e,i){let n,s=this.geometry,r=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(r))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=r[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,S=M;v<S;v+=3){let b=o.getX(v),E=o.getX(v+1),_=o.getX(v+2);n=ya(this,p,t,i,c,h,u,b,E,_),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=g.materialIndex,e.push(n))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let y=o.getX(g),M=o.getX(g+1),v=o.getX(g+2);n=ya(this,r,t,i,c,h,u,y,M,v),n&&(n.faceIndex=Math.floor(g/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(r))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=r[g.materialIndex],y=Math.max(g.start,f.start),M=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,S=M;v<S;v+=3){let b=v,E=v+1,_=v+2;n=ya(this,p,t,i,c,h,u,b,E,_),n&&(n.faceIndex=Math.floor(v/3),n.face.materialIndex=g.materialIndex,e.push(n))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let y=g,M=g+1,v=g+2;n=ya(this,r,t,i,c,h,u,y,M,v),n&&(n.faceIndex=Math.floor(g/3),e.push(n))}}}};function Of(a,t,e,i,n,s,r,o){let l;if(t.side===ii?l=i.intersectTriangle(r,s,n,!0,o):l=i.intersectTriangle(n,s,r,t.side===Ki,o),l===null)return null;va.copy(o),va.applyMatrix4(a.matrixWorld);let c=e.ray.origin.distanceTo(va);return c<e.near||c>e.far?null:{distance:c,point:va.clone(),object:a}}function ya(a,t,e,i,n,s,r,o,l,c){a.getVertexPosition(o,pa),a.getVertexPosition(l,ma),a.getVertexPosition(c,ga);let h=Of(a,t,e,i,pa,ma,ga,fu);if(h){let u=new N;un.getBarycoord(fu,pa,ma,ga,u),n&&(h.uv=un.getInterpolatedAttribute(n,o,l,c,u,new Ht)),s&&(h.uv1=un.getInterpolatedAttribute(s,o,l,c,u,new Ht)),r&&(h.normal=un.getInterpolatedAttribute(r,o,l,c,u,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new N,materialIndex:0};un.getNormal(pa,ma,ga,d.normal),h.face=d,h.barycoord=u}return h}var Tr=class extends mi{constructor(t=null,e=1,i=1,n,s,r,o,l,c=ke,h=ke,u,d){super(null,r,o,l,c,h,n,s,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ks=class extends ne{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Es=new de,pu=new de,_a=[],mu=new Ji,Hf=new de,ur=new xt,dr=new ji,An=class extends xt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new ks(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,Hf)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ji),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Es),mu.copy(t.boundingBox).applyMatrix4(Es),this.boundingBox.union(mu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ji),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Es),dr.copy(t.boundingSphere).applyMatrix4(Es),this.boundingSphere.union(dr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,r=t*s+1;for(let o=0;o<i.length;o++)i[o]=n[r+o]}raycast(t,e){let i=this.matrixWorld,n=this.count;if(ur.geometry=this.geometry,ur.material=this.material,ur.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),dr.copy(this.boundingSphere),dr.applyMatrix4(i),t.ray.intersectsSphere(dr)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,Es),pu.multiplyMatrices(i,Es),ur.matrixWorld=pu,ur.raycast(t,_a);for(let r=0,o=_a.length;r<o;r++){let l=_a[r];l.instanceId=s,l.object=this,e.push(l)}_a.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new ks(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Tr(new Float32Array(n*this.count),n,this.count,yo,Ei));let s=this.morphTexture.source.data.data,r=0;for(let c=0;c<i.length;c++)r+=i[c];let o=this.geometry.morphTargetsRelative?1:1-r,l=n*t;return s[l]=o,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Zn=new ji,Gf=new Ht(.5,.5),ba=new N,Os=class{constructor(t=new Di,e=new Di,i=new Di,n=new Di,s=new Di,r=new Di){this.planes=[t,e,i,n,s,r]}set(t,e,i,n,s,r){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(r),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ni,i=!1){let n=this.planes,s=t.elements,r=s[0],o=s[1],l=s[2],c=s[3],h=s[4],u=s[5],d=s[6],f=s[7],m=s[8],x=s[9],g=s[10],p=s[11],y=s[12],M=s[13],v=s[14],S=s[15];if(n[0].setComponents(c-r,f-h,p-m,S-y).normalize(),n[1].setComponents(c+r,f+h,p+m,S+y).normalize(),n[2].setComponents(c+o,f+u,p+x,S+M).normalize(),n[3].setComponents(c-o,f-u,p-x,S-M).normalize(),i)n[4].setComponents(l,d,g,v).normalize(),n[5].setComponents(c-l,f-d,p-g,S-v).normalize();else if(n[4].setComponents(c-l,f-d,p-g,S-v).normalize(),e===Ni)n[5].setComponents(c+l,f+d,p+g,S+v).normalize();else if(e===zs)n[5].setComponents(l,d,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Zn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Zn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Zn)}intersectsSprite(t){Zn.center.set(0,0,0);let e=Gf.distanceTo(t.center);return Zn.radius=.7071067811865476+e,Zn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Zn)}intersectsSphere(t){let e=this.planes,i=t.center,n=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let n=e[i];if(ba.x=n.normal.x>0?t.max.x:t.min.x,ba.y=n.normal.y>0?t.max.y:t.min.y,ba.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(ba)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Hs=class extends Fi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ct(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Va=new N,Wa=new N,gu=new de,fr=new Bs,Ma=new ji,Tc=new N,xu=new N,qa=class extends Xe{constructor(t=new fe,e=new Hs){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[0];for(let n=1,s=e.count;n<s;n++)Va.fromBufferAttribute(e,n-1),Wa.fromBufferAttribute(e,n),i[n]=i[n-1],i[n]+=Va.distanceTo(Wa);t.setAttribute("lineDistance",new ce(i,1))}else Ft("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,n=this.matrixWorld,s=t.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ma.copy(i.boundingSphere),Ma.applyMatrix4(n),Ma.radius+=s,t.ray.intersectsSphere(Ma)===!1)return;gu.copy(n).invert(),fr.copy(t.ray).applyMatrix4(gu);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){let f=Math.max(0,r.start),m=Math.min(h.count,r.start+r.count);for(let x=f,g=m-1;x<g;x+=c){let p=h.getX(x),y=h.getX(x+1),M=Sa(this,t,fr,l,p,y,x);M&&e.push(M)}if(this.isLineLoop){let x=h.getX(m-1),g=h.getX(f),p=Sa(this,t,fr,l,x,g,m-1);p&&e.push(p)}}else{let f=Math.max(0,r.start),m=Math.min(d.count,r.start+r.count);for(let x=f,g=m-1;x<g;x+=c){let p=Sa(this,t,fr,l,x,x+1,x);p&&e.push(p)}if(this.isLineLoop){let x=Sa(this,t,fr,l,m-1,f,m-1);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){let o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Sa(a,t,e,i,n,s,r){let o=a.geometry.attributes.position;if(Va.fromBufferAttribute(o,n),Wa.fromBufferAttribute(o,s),e.distanceSqToSegment(Va,Wa,Tc,xu)>i)return;Tc.applyMatrix4(a.matrixWorld);let c=t.ray.origin.distanceTo(Tc);if(!(c<t.near||c>t.far))return{distance:c,point:xu.clone().applyMatrix4(a.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:a}}var vu=new N,yu=new N,Er=class extends qa{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,i=[];for(let n=0,s=e.count;n<s;n+=2)vu.fromBufferAttribute(e,n),yu.fromBufferAttribute(e,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+vu.distanceTo(yu);t.setAttribute("lineDistance",new ce(i,1))}else Ft("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Rn=class extends Fi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ct(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},_u=new de,Lc=new Bs,wa=new ji,Ta=new N,Cn=class extends Xe{constructor(t=new fe,e=new Rn){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,n=this.matrixWorld,s=t.params.Points.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),wa.copy(i.boundingSphere),wa.applyMatrix4(n),wa.radius+=s,t.ray.intersectsSphere(wa)===!1)return;_u.copy(n).invert(),Lc.copy(t.ray).applyMatrix4(_u);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,u=i.attributes.position;if(c!==null){let d=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let m=d,x=f;m<x;m++){let g=c.getX(m);Ta.fromBufferAttribute(u,g),bu(Ta,g,l,n,t,e,this)}}else{let d=Math.max(0,r.start),f=Math.min(u.count,r.start+r.count);for(let m=d,x=f;m<x;m++)Ta.fromBufferAttribute(u,m),bu(Ta,m,l,n,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=n.length;s<r;s++){let o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function bu(a,t,e,i,n,s,r){let o=Lc.distanceSqToPoint(a);if(o<e){let l=new N;Lc.closestPointToPoint(a,l),l.applyMatrix4(i);let c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:r})}}var Ar=class extends mi{constructor(t=[],e=Fn,i,n,s,r,o,l,c,h){super(t,e,i,n,s,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Kn=class extends mi{constructor(t,e,i,n,s,r,o,l,c){super(t,e,i,n,s,r,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Pn=class extends mi{constructor(t,e,i=ki,n,s,r,o=ke,l=ke,c,h=$i,u=1){if(h!==$i&&h!==kn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,n,s,r,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ns(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Xa=class extends Pn{constructor(t,e=ki,i=Fn,n,s,r=ke,o=ke,l,c=$i){let h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,i,n,s,r,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Rr=class extends mi{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},ve=class a extends fe{constructor(t=1,e=1,i=1,n=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:s,depthSegments:r};let o=this;n=Math.floor(n),s=Math.floor(s),r=Math.floor(r);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,i,e,t,r,s,0),m("z","y","x",1,-1,i,e,-t,r,s,1),m("x","z","y",1,1,t,i,e,n,r,2),m("x","z","y",1,-1,t,i,-e,n,r,3),m("x","y","z",1,-1,t,e,i,n,s,4),m("x","y","z",-1,-1,t,e,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new ce(c,3)),this.setAttribute("normal",new ce(h,3)),this.setAttribute("uv",new ce(u,2));function m(x,g,p,y,M,v,S,b,E,_,T){let R=v/E,C=S/_,L=v/2,z=S/2,P=b/2,D=E+1,O=_+1,k=0,$=0,W=new N;for(let Y=0;Y<O;Y++){let j=Y*C-z;for(let at=0;at<D;at++){let ot=at*R-L;W[x]=ot*y,W[g]=j*M,W[p]=P,c.push(W.x,W.y,W.z),W[x]=0,W[g]=0,W[p]=b>0?1:-1,h.push(W.x,W.y,W.z),u.push(at/E),u.push(1-Y/_),k+=1}}for(let Y=0;Y<_;Y++)for(let j=0;j<E;j++){let at=d+j+D*Y,ot=d+j+D*(Y+1),Gt=d+(j+1)+D*(Y+1),Xt=d+(j+1)+D*Y;l.push(at,ot,Xt),l.push(ot,Gt,Xt),$+=6}o.addGroup(f,$,T),f+=$,d+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new a(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var gi=class a extends fe{constructor(t=1,e=1,i=1,n=32,s=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),s=Math.floor(s);let h=[],u=[],d=[],f=[],m=0,x=[],g=i/2,p=0;y(),r===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new ce(u,3)),this.setAttribute("normal",new ce(d,3)),this.setAttribute("uv",new ce(f,2));function y(){let v=new N,S=new N,b=0,E=(e-t)/i;for(let _=0;_<=s;_++){let T=[],R=_/s,C=R*(e-t)+t;for(let L=0;L<=n;L++){let z=L/n,P=z*l+o,D=Math.sin(P),O=Math.cos(P);S.x=C*D,S.y=-R*i+g,S.z=C*O,u.push(S.x,S.y,S.z),v.set(D,E,O).normalize(),d.push(v.x,v.y,v.z),f.push(z,1-R),T.push(m++)}x.push(T)}for(let _=0;_<n;_++)for(let T=0;T<s;T++){let R=x[T][_],C=x[T+1][_],L=x[T+1][_+1],z=x[T][_+1];(t>0||T!==0)&&(h.push(R,C,z),b+=3),(e>0||T!==s-1)&&(h.push(C,L,z),b+=3)}c.addGroup(p,b,0),p+=b}function M(v){let S=m,b=new Ht,E=new N,_=0,T=v===!0?t:e,R=v===!0?1:-1;for(let L=1;L<=n;L++)u.push(0,g*R,0),d.push(0,R,0),f.push(.5,.5),m++;let C=m;for(let L=0;L<=n;L++){let P=L/n*l+o,D=Math.cos(P),O=Math.sin(P);E.x=T*O,E.y=g*R,E.z=T*D,u.push(E.x,E.y,E.z),d.push(0,R,0),b.x=D*.5+.5,b.y=O*.5*R+.5,f.push(b.x,b.y),m++}for(let L=0;L<n;L++){let z=S+L,P=C+L;v===!0?h.push(P,P+1,z):h.push(P+1,P,z),_+=3}c.addGroup(p,_,v===!0?1:2),p+=_}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new a(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Cr=class a extends gi{constructor(t=1,e=1,i=32,n=1,s=!1,r=0,o=Math.PI*2){super(0,t,e,i,n,s,r,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:r,thetaLength:o}}static fromJSON(t){return new a(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ya=class a extends fe{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};let s=[],r=[];o(n),c(i),h(),this.setAttribute("position",new ce(s,3)),this.setAttribute("normal",new ce(s.slice(),3)),this.setAttribute("uv",new ce(r,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let M=new N,v=new N,S=new N;for(let b=0;b<e.length;b+=3)f(e[b+0],M),f(e[b+1],v),f(e[b+2],S),l(M,v,S,y)}function l(y,M,v,S){let b=S+1,E=[];for(let _=0;_<=b;_++){E[_]=[];let T=y.clone().lerp(v,_/b),R=M.clone().lerp(v,_/b),C=b-_;for(let L=0;L<=C;L++)L===0&&_===b?E[_][L]=T:E[_][L]=T.clone().lerp(R,L/C)}for(let _=0;_<b;_++)for(let T=0;T<2*(b-_)-1;T++){let R=Math.floor(T/2);T%2===0?(d(E[_][R+1]),d(E[_+1][R]),d(E[_][R])):(d(E[_][R+1]),d(E[_+1][R+1]),d(E[_+1][R]))}}function c(y){let M=new N;for(let v=0;v<s.length;v+=3)M.x=s[v+0],M.y=s[v+1],M.z=s[v+2],M.normalize().multiplyScalar(y),s[v+0]=M.x,s[v+1]=M.y,s[v+2]=M.z}function h(){let y=new N;for(let M=0;M<s.length;M+=3){y.x=s[M+0],y.y=s[M+1],y.z=s[M+2];let v=g(y)/2/Math.PI+.5,S=p(y)/Math.PI+.5;r.push(v,1-S)}m(),u()}function u(){for(let y=0;y<r.length;y+=6){let M=r[y+0],v=r[y+2],S=r[y+4],b=Math.max(M,v,S),E=Math.min(M,v,S);b>.9&&E<.1&&(M<.2&&(r[y+0]+=1),v<.2&&(r[y+2]+=1),S<.2&&(r[y+4]+=1))}}function d(y){s.push(y.x,y.y,y.z)}function f(y,M){let v=y*3;M.x=t[v+0],M.y=t[v+1],M.z=t[v+2]}function m(){let y=new N,M=new N,v=new N,S=new N,b=new Ht,E=new Ht,_=new Ht;for(let T=0,R=0;T<s.length;T+=9,R+=6){y.set(s[T+0],s[T+1],s[T+2]),M.set(s[T+3],s[T+4],s[T+5]),v.set(s[T+6],s[T+7],s[T+8]),b.set(r[R+0],r[R+1]),E.set(r[R+2],r[R+3]),_.set(r[R+4],r[R+5]),S.copy(y).add(M).add(v).divideScalar(3);let C=g(S);x(b,R+0,y,C),x(E,R+2,M,C),x(_,R+4,v,C)}}function x(y,M,v,S){S<0&&y.x===1&&(r[M]=y.x-1),v.x===0&&v.z===0&&(r[M]=S/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new a(t.vertices,t.indices,t.radius,t.detail)}};var Pr=class a extends Ya{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new a(t.radius,t.detail)}};var ei=class a extends fe{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};let s=t/2,r=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,u=t/o,d=e/l,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let y=p*d-r;for(let M=0;M<c;M++){let v=M*u-s;m.push(v,-y,0),x.push(0,0,1),g.push(M/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){let M=y+c*p,v=y+c*(p+1),S=y+1+c*(p+1),b=y+1+c*p;f.push(M,v,b),f.push(v,S,b)}this.setIndex(f),this.setAttribute("position",new ce(m,3)),this.setAttribute("normal",new ce(x,3)),this.setAttribute("uv",new ce(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new a(t.width,t.height,t.widthSegments,t.heightSegments)}};var In=class a extends fe{constructor(t=1,e=32,i=16,n=0,s=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:s,thetaStart:r,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(r+o,Math.PI),c=0,h=[],u=new N,d=new N,f=[],m=[],x=[],g=[];for(let p=0;p<=i;p++){let y=[],M=p/i,v=r+M*o,S=t*Math.cos(v),b=Math.sqrt(t*t-S*S),E=0;p===0&&r===0?E=.5/e:p===i&&l===Math.PI&&(E=-.5/e);for(let _=0;_<=e;_++){let T=_/e,R=n+T*s;u.x=-b*Math.cos(R),u.y=S,u.z=b*Math.sin(R),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(T+E,1-M),y.push(c++)}h.push(y)}for(let p=0;p<i;p++)for(let y=0;y<e;y++){let M=h[p][y+1],v=h[p][y],S=h[p+1][y],b=h[p+1][y+1];(p!==0||r>0)&&f.push(M,v,b),(p!==i-1||l<Math.PI)&&f.push(v,S,b)}this.setIndex(f),this.setAttribute("position",new ce(m,3)),this.setAttribute("normal",new ce(x,3)),this.setAttribute("uv",new ce(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new a(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function is(a){let t={};for(let e in a){t[e]={};for(let i in a[e]){let n=a[e][i];if(Mu(n))n.isRenderTargetTexture?(Ft("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if(Mu(n[0])){let s=[];for(let r=0,o=n.length;r<o;r++)s[r]=n[r].clone();t[e][i]=s}else t[e][i]=n.slice();else t[e][i]=n}}return t}function hi(a){let t={};for(let e=0;e<a.length;e++){let i=is(a[e]);for(let n in i)t[n]=i[n]}return t}function Mu(a){return a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)}function Vf(a){let t=[];for(let e=0;e<a.length;e++)t.push(a[e].clone());return t}function nh(a){let t=a.getRenderTarget();return t===null?a.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ee.workingColorSpace}var il={clone:is,merge:hi},Wf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,qf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ie=class extends Fi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wf,this.fragmentShader=qf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=Vf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?e.uniforms[n]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[n]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[n]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[n]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[n]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[n]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[n]={type:"m4",value:r.toArray()}:e.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new Ct().setHex(n.value);break;case"v2":this.uniforms[i].value=new Ht().fromArray(n.value);break;case"v3":this.uniforms[i].value=new N().fromArray(n.value);break;case"v4":this.uniforms[i].value=new Ce().fromArray(n.value);break;case"m3":this.uniforms[i].value=new Vt().fromArray(n.value);break;case"m4":this.uniforms[i].value=new de().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},$a=class extends Ie{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Jt=class extends Fi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ct(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ct(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qo,this.normalScale=new Ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ui,this.combine=uo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Za=class extends Fi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ku,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ja=class extends Fi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function As(a,t){return!a||a.constructor===t?a:typeof t.BYTES_PER_ELEMENT=="number"?new t(a):Array.prototype.slice.call(a)}function Ec(a){return a!==void 0&&a.inTangents!==void 0&&a.outTangents!==void 0}var Ln=class{constructor(t,e,i,n){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,n=e[i],s=e[i-1];i:{t:{let r;e:{n:if(!(t<n)){for(let o=i+2;;){if(n===void 0){if(t<s)break n;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=e[++i],t<n)break t}r=e.length;break e}if(!(t>=s)){let o=e[1];t<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=e[--i-1],t>=s)break t}r=i,i=0;break e}break i}for(;i<r;){let o=i+r>>>1;t<e[o]?r=o:i=o+1}if(n=e[i],s=e[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,t,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=t*n;for(let r=0;r!==n;++r)e[r]=i[s+r];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},ja=class extends Ln{constructor(t,e,i,n){super(t,e,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Cc,endingEnd:Cc}}intervalChanged_(t,e,i){let n=this.parameterPositions,s=t-2,r=t+1,o=n[s],l=n[r];if(o===void 0)switch(this.getSettings_().endingStart){case Pc:s=t,o=2*e-i;break;case Ic:s=n.length-2,o=e+n[s]-n[s+1];break;default:s=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Pc:r=t,l=2*i-e;break;case Ic:r=1,l=i+n[1]-n[0];break;default:r=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=r*h}interpolate_(t,e,i,n){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-e)/(n-e),x=m*m,g=x*m,p=-d*g+2*d*x-d*m,y=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*m+1,M=(-1-f)*g+(1.5+f)*x+.5*m,v=f*g-f*x;for(let S=0;S!==o;++S)s[S]=p*r[h+S]+y*r[c+S]+M*r[l+S]+v*r[u+S];return s}},Ka=class extends Ln{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t,e,i,n){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(i-e)/(n-e),u=1-h;for(let d=0;d!==o;++d)s[d]=r[c+d]*u+r[l+d]*h;return s}},Qa=class extends Ln{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t){return this.copySampleValue_(t-1)}},to=class extends Ln{interpolate_(t,e,i,n){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(i-e)/(n-e),x=1-m;for(let g=0;g!==o;++g)s[g]=r[c+g]*x+r[l+g]*m;return s}let d=o*2,f=t-1;for(let m=0;m!==o;++m){let x=r[c+m],g=r[l+m],p=f*d+m*2,y=u[p],M=u[p+1],v=t*d+m*2,S=h[v],b=h[v+1],E=Yf(i,e,y,S,n);s[m]=fd(E,x,M,b,g)}return s}};function fd(a,t,e,i,n){let s=1-a;return s*s*s*t+3*s*s*a*e+3*s*a*a*i+a*a*a*n}function Xf(a,t,e,i,n){let s=1-a;return 3*s*s*(e-t)+6*s*a*(i-e)+3*a*a*(n-i)}function Yf(a,t,e,i,n){let s=(a-t)/(n-t);for(let r=0;r<8;r++){let o=fd(s,t,e,i,n)-a;if(Math.abs(o)<1e-10)break;let l=Xf(s,t,e,i,n);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}var Mi=class{constructor(t,e,i,n){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=As(e,this.TimeBufferType),this.values=As(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:As(t.times,Array),values:As(t.values,Array)};let n=t.getInterpolation();n!==t.DefaultInterpolation&&(i.interpolation=n),Ec(t.settings)&&(i.settings={inTangents:As(t.settings.inTangents,Array),outTangents:As(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Qa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ka(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ja(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new to(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case pr:e=this.InterpolantFactoryMethodDiscrete;break;case Ba:e=this.InterpolantFactoryMethodLinear;break;case Ra:e=this.InterpolantFactoryMethodSmooth;break;case Rc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ft("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return pr;case this.InterpolantFactoryMethodLinear:return Ba;case this.InterpolantFactoryMethodSmooth:return Ra;case this.InterpolantFactoryMethodBezier:return Rc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,n=e.length;i!==n;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,n=e.length;i!==n;++i)e[i]*=t;Ec(this.settings)&&(Su(this.settings.inTangents,t),Su(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,n=i.length,s=0,r=n-1;for(;s!==n&&i[s]<t;)++s;for(;r!==-1&&i[r]>e;)--r;if(++r,s!==0||r!==n){s>=r&&(r=Math.max(r,1),s=r-1);let o=this.getValueSize();this.times=i.slice(s,r),this.values=this.values.slice(s*o,r*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(kt("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,n=this.values,s=i.length;s===0&&(kt("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==s;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){kt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){kt("KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(n!==void 0&&Mf(n))for(let o=0,l=n.length;o!==l;++o){let c=n[o];if(isNaN(c)){kt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Ra,s=t.length-1,r=1;for(let o=1;o<s;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(n)l=!0;else{let u=o*i,d=u-i,f=u+i;for(let m=0;m!==i;++m){let x=e[u+m];if(x!==e[d+m]||x!==e[f+m]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let u=o*i,d=r*i;for(let f=0;f!==i;++f)e[d+f]=e[u+f]}++r}}if(s>0){t[r]=t[s];for(let o=s*i,l=r*i,c=0;c!==i;++c)e[l+c]=e[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=e.slice(0,r*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,n=new i(this.name,t,e);return n.createInterpolant=this.createInterpolant,Ec(this.settings)&&(n.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),n}};function Su(a,t){for(let e=0,i=a.length;e!==i;e+=2)a[e]*=t}Mi.prototype.ValueTypeName="";Mi.prototype.TimeBufferType=Float32Array;Mi.prototype.ValueBufferType=Float32Array;Mi.prototype.DefaultInterpolation=Ba;var zn=class extends Mi{constructor(t,e,i){super(t,e,i)}};zn.prototype.ValueTypeName="bool";zn.prototype.ValueBufferType=Array;zn.prototype.DefaultInterpolation=pr;zn.prototype.InterpolantFactoryMethodLinear=void 0;zn.prototype.InterpolantFactoryMethodSmooth=void 0;var eo=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}};eo.prototype.ValueTypeName="color";var io=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}};io.prototype.ValueTypeName="number";var no=class extends Ln{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t,e,i,n){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(i-e)/(n-e),c=t*o;for(let h=c+o;c!==h;c+=4)bi.slerpFlat(s,0,r,c-o,r,c,l);return s}},Ir=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}InterpolantFactoryMethodLinear(t){return new no(this.times,this.values,this.getValueSize(),t)}};Ir.prototype.ValueTypeName="quaternion";Ir.prototype.InterpolantFactoryMethodSmooth=void 0;var Dn=class extends Mi{constructor(t,e,i){super(t,e,i)}};Dn.prototype.ValueTypeName="string";Dn.prototype.ValueBufferType=Array;Dn.prototype.DefaultInterpolation=pr;Dn.prototype.InterpolantFactoryMethodLinear=void 0;Dn.prototype.InterpolantFactoryMethodSmooth=void 0;var so=class extends Mi{constructor(t,e,i,n){super(t,e,i,n)}};so.prototype.ValueTypeName="vector";var ro=class{constructor(t,e,i){let n=this,s=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,s===!1&&n.onStart!==void 0&&n.onStart(h,r,o),s=!0},this.itemEnd=function(h){r++,n.onProgress!==void 0&&n.onProgress(h,r,o),r===o&&(s=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},pd=new ro,ao=class{constructor(t){this.manager=t!==void 0?t:pd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(n,s){i.load(t,n,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};ao.DEFAULT_MATERIAL_NAME="__DEFAULT";var Lr=class extends Xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ct(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},zr=class extends Lr{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ct(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Ac=new de,wu=new N,Tu=new N,oo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ht(512,512),this.mapType=ci,this.map=null,this.mapPass=null,this.matrix=new de,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Os,this._frameExtents=new Ht(1,1),this._viewportCount=1,this._viewports=[new Ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;wu.setFromMatrixPosition(t.matrixWorld),e.position.copy(wu),Tu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Tu),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,n){Ac.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(Ac,t.coordinateSystem,t.reversedDepth);let s=this._frameExtents,r=n?n.z/s.x:1,o=n?n.w/s.y:1,l=n?n.x/s.x:0,c=n?n.y/s.y:0;t.coordinateSystem===zs||t.reversedDepth?e.set(.5*r,0,0,.5*r+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*r,0,0,.5*r+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(Ac)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Ea=new N,Aa=new bi,qi=new N,Dr=class extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new de,this.projectionMatrix=new de,this.projectionMatrixInverse=new de,this.coordinateSystem=Ni,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ea,Aa,qi),qi.x===1&&qi.y===1&&qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,Aa,qi.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Ea,Aa,qi),qi.x===1&&qi.y===1&&qi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ea,Aa,qi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},wn=new N,Eu=new Ht,Au=new Ht,li=class extends Dr{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ka*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(nc*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ka*2*Math.atan(Math.tan(nc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(wn.x,wn.y).multiplyScalar(-t/wn.z),wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(wn.x,wn.y).multiplyScalar(-t/wn.z)}getViewSize(t,e){return this.getViewBounds(t,Eu,Au),e.subVectors(Au,Eu)}setViewOffset(t,e,i,n,s,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(nc*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,s=-.5*n,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;s+=r.offsetX*n/l,e-=r.offsetY*i/c,n*=r.width/l,i*=r.height/c}let o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Nn=class extends Dr{constructor(t=-1,e=1,i=1,n=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2,s=i-t,r=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},zc=class extends oo{constructor(){super(new Nn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Nr=class extends Lr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new zc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Rs=-90,Cs=1,lo=class extends Xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new li(Rs,Cs,t,e);n.layers=this.layers,this.add(n);let s=new li(Rs,Cs,t,e);s.layers=this.layers,this.add(s);let r=new li(Rs,Cs,t,e);r.layers=this.layers,this.add(r);let o=new li(Rs,Cs,t,e);o.layers=this.layers,this.add(o);let l=new li(Rs,Cs,t,e);l.layers=this.layers,this.add(l);let c=new li(Rs,Cs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,n,s,r,o,l]=e;for(let c of e)this.remove(c);if(t===Ni)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===zs)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,r,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,s),t.setRenderTarget(i,1,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,2,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,n),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},co=class extends li{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var sh="\\[\\]\\.:\\/",$f=new RegExp("["+sh+"]","g"),rh="[^"+sh+"]",Zf="[^"+sh.replace("\\.","")+"]",Jf=/((?:WC+[\/:])*)/.source.replace("WC",rh),jf=/(WCOD+)?/.source.replace("WCOD",Zf),Kf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",rh),Qf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",rh),tp=new RegExp("^"+Jf+jf+Kf+Qf+"$"),ep=["material","materials","bones","map"],Dc=class{constructor(t,e,i){let n=i||Ae.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,n)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,s=i.length;n!==s;++n)i[n].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Ae=class a{constructor(t,e,i){this.path=e,this.parsedPath=i||a.parseTrackName(e),this.node=a.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new a.Composite(t,e,i):new a(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace($f,"")}static parseTrackName(t){let e=tp.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){let s=i.nodeName.substring(n+1);ep.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(s){for(let r=0;r<s.length;r++){let o=s[r];if(o.name===e||o.uuid===e)return o;let l=i(o.children);if(l)return l}return null},n=i(t.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)t[e++]=i[n]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,n=e.propertyName,s=e.propertyIndex;if(t||(t=a.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ft("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){kt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){kt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){kt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){kt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){kt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){kt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){kt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[n];if(r===void 0){let c=e.nodeName;kt("PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!t.geometry){kt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){kt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ae.Composite=Dc;Ae.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ae.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ae.prototype.GetterByBindingType=[Ae.prototype._getValue_direct,Ae.prototype._getValue_array,Ae.prototype._getValue_arrayElement,Ae.prototype._getValue_toArray];Ae.prototype.SetterByBindingTypeAndVersioning=[[Ae.prototype._setValue_direct,Ae.prototype._setValue_direct_setNeedsUpdate,Ae.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ae.prototype._setValue_array,Ae.prototype._setValue_array_setNeedsUpdate,Ae.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ae.prototype._setValue_arrayElement,Ae.prototype._setValue_arrayElement_setNeedsUpdate,Ae.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ae.prototype._setValue_fromArray,Ae.prototype._setValue_fromArray_setNeedsUpdate,Ae.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var gv=new Float32Array(1);var uh=class uh{constructor(t,e,i,n){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,n){let s=this.elements;return s[0]=t,s[2]=e,s[1]=i,s[3]=n,this}};uh.prototype.isMatrix2=!0;var Nc=uh;function ah(a,t,e,i){let n=ip(i);switch(e){case Qc:return a*t;case yo:return a*t/n.components*n.byteLength;case _o:return a*t/n.components*n.byteLength;case On:return a*t*2/n.components*n.byteLength;case bo:return a*t*2/n.components*n.byteLength;case th:return a*t*3/n.components*n.byteLength;case Ai:return a*t*4/n.components*n.byteLength;case Mo:return a*t*4/n.components*n.byteLength;case kr:case Or:return Math.floor((a+3)/4)*Math.floor((t+3)/4)*8;case Hr:case Gr:return Math.floor((a+3)/4)*Math.floor((t+3)/4)*16;case wo:case Eo:return Math.max(a,16)*Math.max(t,8)/4;case So:case To:return Math.max(a,8)*Math.max(t,8)/2;case Ao:case Ro:case Po:case Io:return Math.floor((a+3)/4)*Math.floor((t+3)/4)*8;case Co:case Vr:case Lo:return Math.floor((a+3)/4)*Math.floor((t+3)/4)*16;case zo:return Math.floor((a+3)/4)*Math.floor((t+3)/4)*16;case Do:return Math.floor((a+4)/5)*Math.floor((t+3)/4)*16;case No:return Math.floor((a+4)/5)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((a+5)/6)*Math.floor((t+4)/5)*16;case Fo:return Math.floor((a+5)/6)*Math.floor((t+5)/6)*16;case Bo:return Math.floor((a+7)/8)*Math.floor((t+4)/5)*16;case ko:return Math.floor((a+7)/8)*Math.floor((t+5)/6)*16;case Oo:return Math.floor((a+7)/8)*Math.floor((t+7)/8)*16;case Ho:return Math.floor((a+9)/10)*Math.floor((t+4)/5)*16;case Go:return Math.floor((a+9)/10)*Math.floor((t+5)/6)*16;case Vo:return Math.floor((a+9)/10)*Math.floor((t+7)/8)*16;case Wo:return Math.floor((a+9)/10)*Math.floor((t+9)/10)*16;case qo:return Math.floor((a+11)/12)*Math.floor((t+9)/10)*16;case Xo:return Math.floor((a+11)/12)*Math.floor((t+11)/12)*16;case Yo:case $o:case Zo:return Math.ceil(a/4)*Math.ceil(t/4)*16;case Jo:case jo:return Math.ceil(a/4)*Math.ceil(t/4)*8;case Wr:case Ko:return Math.ceil(a/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ip(a){switch(a){case ci:case Zc:return{byteLength:1,components:1};case Vs:case Jc:case Si:return{byteLength:2,components:1};case xo:case vo:return{byteLength:2,components:4};case ki:case go:case Ei:return{byteLength:4,components:1};case jc:case Kc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${a}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ft("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Ud(){let a=null,t=!1,e=null,i=null;function n(s,r){i=a.requestAnimationFrame(n),e(s,r)}return{start:function(){t!==!0&&e!==null&&a!==null&&(i=a.requestAnimationFrame(n),t=!0)},stop:function(){a!==null&&a.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){a=s}}}function op(a){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=a.createBuffer();a.bindBuffer(l,d),a.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=a.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=a.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=a.HALF_FLOAT:f=a.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=a.SHORT;else if(c instanceof Uint32Array)f=a.UNSIGNED_INT;else if(c instanceof Int32Array)f=a.INT;else if(c instanceof Int8Array)f=a.BYTE;else if(c instanceof Uint8Array)f=a.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){let h=l.array,u=l.updateRanges;if(a.bindBuffer(c,o),u.length===0)a.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let x=u[f];a.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(a.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:r}}var lp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,up=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,xp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_p=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Cp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Pp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Ip=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Lp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,zp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Np=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Up=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bp="gl_FragColor = linearToOutputTexel( gl_FragColor );",kp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Op=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Hp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$p=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Kp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,t0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,e0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,i0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,n0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,s0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,r0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,a0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,o0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,l0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,c0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,h0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,u0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,d0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,f0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,m0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,g0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,x0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,v0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,y0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,b0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,M0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,S0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,w0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,T0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,E0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,A0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,R0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,C0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,I0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,L0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,z0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,D0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,N0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,U0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,F0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,B0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,k0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,O0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,H0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,G0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,V0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,W0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,q0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,X0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Y0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Z0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,J0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,j0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,K0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Q0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,em=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,im=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,nm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,om=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,lm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,um=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,mm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,gm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ym=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_m=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Em=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Am=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Pm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Im=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,zm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Um=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Fm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,km=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Om=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:lp,alphahash_pars_fragment:cp,alphamap_fragment:hp,alphamap_pars_fragment:up,alphatest_fragment:dp,alphatest_pars_fragment:fp,aomap_fragment:pp,aomap_pars_fragment:mp,batching_pars_vertex:gp,batching_vertex:xp,begin_vertex:vp,beginnormal_vertex:yp,bsdfs:_p,iridescence_fragment:bp,bumpmap_pars_fragment:Mp,clipping_planes_fragment:Sp,clipping_planes_pars_fragment:wp,clipping_planes_pars_vertex:Tp,clipping_planes_vertex:Ep,color_fragment:Ap,color_pars_fragment:Rp,color_pars_vertex:Cp,color_vertex:Pp,common:Ip,cube_uv_reflection_fragment:Lp,defaultnormal_vertex:zp,displacementmap_pars_vertex:Dp,displacementmap_vertex:Np,emissivemap_fragment:Up,emissivemap_pars_fragment:Fp,colorspace_fragment:Bp,colorspace_pars_fragment:kp,envmap_fragment:Op,envmap_common_pars_fragment:Hp,envmap_pars_fragment:Gp,envmap_pars_vertex:Vp,envmap_physical_pars_fragment:t0,envmap_vertex:Wp,fog_vertex:qp,fog_pars_vertex:Xp,fog_fragment:Yp,fog_pars_fragment:$p,gradientmap_pars_fragment:Zp,lightmap_pars_fragment:Jp,lights_lambert_fragment:jp,lights_lambert_pars_fragment:Kp,lights_pars_begin:Qp,lights_toon_fragment:e0,lights_toon_pars_fragment:i0,lights_phong_fragment:n0,lights_phong_pars_fragment:s0,lights_physical_fragment:r0,lights_physical_pars_fragment:a0,lights_fragment_begin:o0,lights_fragment_maps:l0,lights_fragment_end:c0,lightprobes_pars_fragment:h0,logdepthbuf_fragment:u0,logdepthbuf_pars_fragment:d0,logdepthbuf_pars_vertex:f0,logdepthbuf_vertex:p0,map_fragment:m0,map_pars_fragment:g0,map_particle_fragment:x0,map_particle_pars_fragment:v0,metalnessmap_fragment:y0,metalnessmap_pars_fragment:_0,morphinstance_vertex:b0,morphcolor_vertex:M0,morphnormal_vertex:S0,morphtarget_pars_vertex:w0,morphtarget_vertex:T0,normal_fragment_begin:E0,normal_fragment_maps:A0,normal_pars_fragment:R0,normal_pars_vertex:C0,normal_vertex:P0,normalmap_pars_fragment:I0,clearcoat_normal_fragment_begin:L0,clearcoat_normal_fragment_maps:z0,clearcoat_pars_fragment:D0,iridescence_pars_fragment:N0,opaque_fragment:U0,packing:F0,premultiplied_alpha_fragment:B0,project_vertex:k0,dithering_fragment:O0,dithering_pars_fragment:H0,roughnessmap_fragment:G0,roughnessmap_pars_fragment:V0,shadowmap_pars_fragment:W0,shadowmap_pars_vertex:q0,shadowmap_vertex:X0,shadowmask_pars_fragment:Y0,skinbase_vertex:$0,skinning_pars_vertex:Z0,skinning_vertex:J0,skinnormal_vertex:j0,specularmap_fragment:K0,specularmap_pars_fragment:Q0,tonemapping_fragment:tm,tonemapping_pars_fragment:em,transmission_fragment:im,transmission_pars_fragment:nm,uv_pars_fragment:sm,uv_pars_vertex:rm,uv_vertex:am,worldpos_vertex:om,background_vert:lm,background_frag:cm,backgroundCube_vert:hm,backgroundCube_frag:um,cube_vert:dm,cube_frag:fm,depth_vert:pm,depth_frag:mm,distance_vert:gm,distance_frag:xm,equirect_vert:vm,equirect_frag:ym,linedashed_vert:_m,linedashed_frag:bm,meshbasic_vert:Mm,meshbasic_frag:Sm,meshlambert_vert:wm,meshlambert_frag:Tm,meshmatcap_vert:Em,meshmatcap_frag:Am,meshnormal_vert:Rm,meshnormal_frag:Cm,meshphong_vert:Pm,meshphong_frag:Im,meshphysical_vert:Lm,meshphysical_frag:zm,meshtoon_vert:Dm,meshtoon_frag:Nm,points_vert:Um,points_frag:Fm,shadow_vert:Bm,shadow_frag:km,sprite_vert:Om,sprite_frag:Hm},mt={common:{diffuse:{value:new Ct(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ct(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new N},probesMax:{value:new N},probesResolution:{value:new N}},points:{diffuse:{value:new Ct(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Ct(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},en={basic:{uniforms:hi([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:hi([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Ct(0)},envMapIntensity:{value:1}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:hi([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Ct(0)},specular:{value:new Ct(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:hi([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new Ct(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:hi([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new Ct(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:hi([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:hi([mt.points,mt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:hi([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:hi([mt.common,mt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:hi([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:hi([mt.sprite,mt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distance:{uniforms:hi([mt.common,mt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distance_vert,fragmentShader:$t.distance_frag},shadow:{uniforms:hi([mt.lights,mt.fog,{color:{value:new Ct(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};en.physical={uniforms:hi([en.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Ct(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Ct(0)},specularColor:{value:new Ct(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};var nl={r:0,b:0,g:0},Gm=new de,Fd=new Vt;Fd.set(-1,0,0,0,1,0,0,0,1);function Vm(a,t,e,i,n,s){let r=new Ct(0),o=n===!0?0:1,l,c,h=null,u=0,d=null;function f(y){let M=y.isScene===!0?y.background:null;if(M&&M.isTexture){let v=y.backgroundBlurriness>0;M=t.get(M,v)}return M}function m(y){let M=!1,v=f(y);v===null?g(r,o):v&&v.isColor&&(g(v,1),M=!0);let S=a.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,s),(a.autoClear||M)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil))}function x(y,M){let v=f(M);v&&(v.isCubeTexture||v.mapping===Fr)?(c===void 0&&(c=new xt(new ve(1,1,1),new Ie({name:"BackgroundCubeMaterial",uniforms:is(en.backgroundCube.uniforms),vertexShader:en.backgroundCube.vertexShader,fragmentShader:en.backgroundCube.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,b,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Gm.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Fd),c.material.toneMapped=ee.getTransfer(v.colorSpace)!==ge,(h!==v||u!==v.version||d!==a.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=a.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new xt(new ei(2,2),new Ie({name:"BackgroundMaterial",uniforms:is(en.background.uniforms),vertexShader:en.background.vertexShader,fragmentShader:en.background.fragmentShader,side:Ki,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=ee.getTransfer(v.colorSpace)!==ge,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==a.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=a.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,M){y.getRGB(nl,nh(a)),e.buffers.color.setClear(nl.r,nl.g,nl.b,M,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(y,M=1){r.set(y),o=M,g(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(r,o)},render:m,addToRenderList:x,dispose:p}}function Wm(a,t){let e=a.getParameter(a.MAX_VERTEX_ATTRIBS),i={},n=d(null),s=n,r=!1;function o(C,L,z,P,D){let O=!1,k=u(C,P,z,L);s!==k&&(s=k,c(s.object)),O=f(C,P,z,D),O&&m(C,P,z,D),D!==null&&t.update(D,a.ELEMENT_ARRAY_BUFFER),(O||r)&&(r=!1,v(C,L,z,P),D!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function l(){return a.createVertexArray()}function c(C){return a.bindVertexArray(C)}function h(C){return a.deleteVertexArray(C)}function u(C,L,z,P){let D=P.wireframe===!0,O=i[L.id];O===void 0&&(O={},i[L.id]=O);let k=C.isInstancedMesh===!0?C.id:0,$=O[k];$===void 0&&($={},O[k]=$);let W=$[z.id];W===void 0&&(W={},$[z.id]=W);let Y=W[D];return Y===void 0&&(Y=d(l()),W[D]=Y),Y}function d(C){let L=[],z=[],P=[];for(let D=0;D<e;D++)L[D]=0,z[D]=0,P[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:P,object:C,attributes:{},index:null}}function f(C,L,z,P){let D=s.attributes,O=L.attributes,k=0,$=z.getAttributes();for(let W in $)if($[W].location>=0){let j=D[W],at=O[W];if(at===void 0&&(W==="instanceMatrix"&&C.instanceMatrix&&(at=C.instanceMatrix),W==="instanceColor"&&C.instanceColor&&(at=C.instanceColor)),j===void 0||j.attribute!==at||at&&j.data!==at.data)return!0;k++}return s.attributesNum!==k||s.index!==P}function m(C,L,z,P){let D={},O=L.attributes,k=0,$=z.getAttributes();for(let W in $)if($[W].location>=0){let j=O[W];j===void 0&&(W==="instanceMatrix"&&C.instanceMatrix&&(j=C.instanceMatrix),W==="instanceColor"&&C.instanceColor&&(j=C.instanceColor));let at={};at.attribute=j,j&&j.data&&(at.data=j.data),D[W]=at,k++}s.attributes=D,s.attributesNum=k,s.index=P}function x(){let C=s.newAttributes;for(let L=0,z=C.length;L<z;L++)C[L]=0}function g(C){p(C,0)}function p(C,L){let z=s.newAttributes,P=s.enabledAttributes,D=s.attributeDivisors;z[C]=1,P[C]===0&&(a.enableVertexAttribArray(C),P[C]=1),D[C]!==L&&(a.vertexAttribDivisor(C,L),D[C]=L)}function y(){let C=s.newAttributes,L=s.enabledAttributes;for(let z=0,P=L.length;z<P;z++)L[z]!==C[z]&&(a.disableVertexAttribArray(z),L[z]=0)}function M(C,L,z,P,D,O,k){k===!0?a.vertexAttribIPointer(C,L,z,D,O):a.vertexAttribPointer(C,L,z,P,D,O)}function v(C,L,z,P){x();let D=P.attributes,O=z.getAttributes(),k=L.defaultAttributeValues;for(let $ in O){let W=O[$];if(W.location>=0){let Y=D[$];if(Y===void 0&&($==="instanceMatrix"&&C.instanceMatrix&&(Y=C.instanceMatrix),$==="instanceColor"&&C.instanceColor&&(Y=C.instanceColor)),Y!==void 0){let j=Y.normalized,at=Y.itemSize,ot=t.get(Y);if(ot===void 0)continue;let Gt=ot.buffer,Xt=ot.type,jt=ot.bytesPerElement,Z=Xt===a.INT||Xt===a.UNSIGNED_INT||Y.gpuType===go;if(Y.isInterleavedBufferAttribute){let tt=Y.data,wt=tt.stride,Nt=Y.offset;if(tt.isInstancedInterleavedBuffer){for(let bt=0;bt<W.locationSize;bt++)p(W.location+bt,tt.meshPerAttribute);C.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let bt=0;bt<W.locationSize;bt++)g(W.location+bt);a.bindBuffer(a.ARRAY_BUFFER,Gt);for(let bt=0;bt<W.locationSize;bt++)M(W.location+bt,at/W.locationSize,Xt,j,wt*jt,(Nt+at/W.locationSize*bt)*jt,Z)}else{if(Y.isInstancedBufferAttribute){for(let tt=0;tt<W.locationSize;tt++)p(W.location+tt,Y.meshPerAttribute);C.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let tt=0;tt<W.locationSize;tt++)g(W.location+tt);a.bindBuffer(a.ARRAY_BUFFER,Gt);for(let tt=0;tt<W.locationSize;tt++)M(W.location+tt,at/W.locationSize,Xt,j,at*jt,at/W.locationSize*tt*jt,Z)}}else if(k!==void 0){let j=k[$];if(j!==void 0)switch(j.length){case 2:a.vertexAttrib2fv(W.location,j);break;case 3:a.vertexAttrib3fv(W.location,j);break;case 4:a.vertexAttrib4fv(W.location,j);break;default:a.vertexAttrib1fv(W.location,j)}}}}y()}function S(){T();for(let C in i){let L=i[C];for(let z in L){let P=L[z];for(let D in P){let O=P[D];for(let k in O)h(O[k].object),delete O[k];delete P[D]}}delete i[C]}}function b(C){if(i[C.id]===void 0)return;let L=i[C.id];for(let z in L){let P=L[z];for(let D in P){let O=P[D];for(let k in O)h(O[k].object),delete O[k];delete P[D]}}delete i[C.id]}function E(C){for(let L in i){let z=i[L];for(let P in z){let D=z[P];if(D[C.id]===void 0)continue;let O=D[C.id];for(let k in O)h(O[k].object),delete O[k];delete D[C.id]}}}function _(C){for(let L in i){let z=i[L],P=C.isInstancedMesh===!0?C.id:0,D=z[P];if(D!==void 0){for(let O in D){let k=D[O];for(let $ in k)h(k[$].object),delete k[$];delete D[O]}delete z[P],Object.keys(z).length===0&&delete i[L]}}}function T(){R(),r=!0,s!==n&&(s=n,c(s.object))}function R(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:T,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfObject:_,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:g,disableUnusedAttributes:y}}function qm(a,t,e){let i;function n(l){i=l}function s(l,c){a.drawArrays(i,l,c),e.update(c,i,1)}function r(l,c,h){h!==0&&(a.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,i,1)}this.setMode=n,this.render=s,this.renderInstances=r,this.renderMultiDraw=o}function Xm(a,t,e,i){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let E=t.get("EXT_texture_filter_anisotropic");n=a.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){return!(E!==Ai&&i.convert(E)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){let _=E===Si&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(E!==ci&&E!==Ei&&!_&&i.convert(E)!==a.getParameter(a.IMPLEMENTATION_COLOR_READ_TYPE))}function l(E){if(E==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Ft("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&d===!1&&Ft("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),m=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=a.getParameter(a.MAX_TEXTURE_SIZE),g=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),p=a.getParameter(a.MAX_VERTEX_ATTRIBS),y=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),M=a.getParameter(a.MAX_VARYING_VECTORS),v=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),S=a.getParameter(a.MAX_SAMPLES),b=a.getParameter(a.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:M,maxFragmentUniforms:v,maxSamples:S,samples:b}}function Ym(a){let t=this,e=null,i=0,n=!1,s=!1,r=new Di,o=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||i!==0||n;return n=d,i=u.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=a.get(u);if(!n||m===null||m.length===0||s&&!g)s?h(null):c();else{let y=s?0:i,M=y*4,v=p.clippingState||null;l.value=v,v=h(m,d,M,f);for(let S=0;S!==M;++S)v[S]=e[S];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let p=f+x*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let M=0,v=f;M!==x;++M,v+=4)r.copy(u[M]).applyMatrix4(y,o),r.normal.toArray(g,v),g[v+3]=r.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}var Xs=4,$m=6,Zm=20,Jm=256,qr=new Nn,md=new Ct,dh=null,fh=0,ph=0,mh=!1,jm=new N,ns=new N,rl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,n=100,s={}){let{size:r=256,position:o=jm}=s;dh=this._renderer.getRenderTarget(),fh=this._renderer.getActiveCubeFace(),ph=this._renderer.getActiveMipmapLevel(),mh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(dh,fh,ph),this._renderer.xr.enabled=mh,t.scissorTest=!1,qs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Fn||t.mapping===ts?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),dh=this._renderer.getRenderTarget(),fh=this._renderer.getActiveCubeFace(),ph=this._renderer.getActiveMipmapLevel(),mh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Oe,minFilter:Oe,generateMipmaps:!1,type:Si,format:Ai,colorSpace:mr,depthBuffer:!1},n=gd(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gd(t,e,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Km(s)),this._blurMaterial=tg(s,t,e),this._ggxMaterial=Qm(s,t,e)}return n}_compileMaterial(t){let e=new xt(new fe,t);this._renderer.compile(e,qr)}_sceneToCubeUV(t,e,i,n,s){let l=new li(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(md),u.toneMapping=Bi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(n),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new xt(new ve,new He({name:"PMREM.Background",side:ii,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,g=x.material,p=!1,y=t.background;y?y.isColor&&(g.color.copy(y),t.background=null,p=!0):(g.color.copy(md),p=!0);for(let M=0;M<6;M++){let v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[M],s.y,s.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[M]));let S=this._cubeSize;qs(n,v*S,M>2?S:0,S,S),u.setRenderTarget(n),p&&u.render(x,l),u.render(t,l)}u.toneMapping=f,u.autoClear=d,t.background=y}_textureToCubeUV(t,e){let i=this._renderer,n=t.mapping===Fn||t.mapping===ts;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=vd()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xd());let s=n?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=s;let o=s.uniforms;o.envMap.value=t;let l=this._cubeSize;qs(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(r,qr)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let n=this._lodMeshes.length;for(let s=1;s<n;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=i}_applyGGXFilter(t,e,i){let n=this._renderer,s=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[i];o.material=r;let l=r.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:m}=this,x=this._sizeLods[i],g=3*x*(i>m-Xs?i-m+Xs:0),p=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=m-e,qs(s,g,p,3*x,2*x),n.setRenderTarget(s),n.render(o,qr),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=m-i,qs(t,g,p,3*x,2*x),n.setRenderTarget(t),n.render(o,qr)}_blur(t,e,i,n){let s=this._pingPongRenderTarget,r=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(t,s,e,i,r),this._blurPass(s,t,i,i,r)}_blurPass(t,e,i,n,s){let r=this._renderer,o=this._blurMaterial,l=this._lodMeshes[n];l.material=o;let c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let h=this._sizeLods[n],u=3*h*(n>this._lodMax-Xs?n-this._lodMax+Xs:0),d=4*(this._cubeSize-h);qs(e,u,d,3*h,2*h),r.setRenderTarget(e),r.render(l,qr)}};function Km(a){let t=[],e=[],i=a,n=a-Xs+1+$m;for(let s=0;s<n;s++){let r=Math.pow(2,i);t.push(r);let o=1/(r-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,m=new Float32Array(f*d*u),x=new Float32Array(f*d*u);for(let p=0;p<u;p++){let y=p%3*2/3-1,M=p>2?0:-1,v=[y,M,0,y+2/3,M,0,y+2/3,M+1,0,y,M,0,y+2/3,M+1,0,y,M+1,0];m.set(v,f*d*p);for(let S=0;S<d;S++){let b=h[S*2]*2-1,E=h[S*2+1]*2-1;p===0?ns.set(1,E,b):p===1?ns.set(-b,1,-E):p===2?ns.set(-b,E,1):p===3?ns.set(-1,E,-b):p===4?ns.set(-b,-1,E):ns.set(b,E,-1),ns.toArray(x,(p*d+S)*f)}}let g=new fe;g.setAttribute("position",new ne(m,f)),g.setAttribute("outputDirection",new ne(x,f)),e.push(new xt(g,null)),i>Xs&&i--}return{lodMeshes:e,sizeLods:t}}function gd(a,t,e){let i=new Ke(a,t,e);return i.texture.mapping=Fr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function qs(a,t,e,i,n){a.viewport.set(t,e,i,n),a.scissor.set(t,e,i,n)}function Qm(a,t,e){return new Ie({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Jm,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ll(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function tg(a,t,e){return new Ie({name:"SphericalGaussianBlur",defines:{SAMPLES:Zm,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ll(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function xd(){return new Ie({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function vd(){return new Ie({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function ll(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var al=class extends Ke{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new Ar(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new ve(5,5,5),s=new Ie({name:"CubemapFromEquirect",uniforms:is(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ii,blending:Qi});s.uniforms.tEquirect.value=e;let r=new xt(n,s),o=e.minFilter;return e.minFilter===Bn&&(e.minFilter=Oe),new lo(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){let s=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,i,n);t.setRenderTarget(s)}};function eg(a){let t=new WeakMap,e=new WeakMap,i=null;function n(d,f=!1){return d==null?null:f?r(d):s(d)}function s(d){if(d&&d.isTexture){let f=d.mapping;if(f===fo||f===po)if(t.has(d)){let m=t.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let x=new al(m.height);return x.fromEquirectangularTexture(a,d),t.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture){let f=d.mapping,m=f===fo||f===po,x=f===Fn||f===ts;if(m||x){let g=e.get(d),p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return i===null&&(i=new rl(a)),g=m?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,e.set(d,g),g.texture;if(g!==void 0)return g.texture;{let y=d.image;return m&&y&&y.height>0||x&&y&&l(y)?(i===null&&(i=new rl(a)),g=m?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,e.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===fo?d.mapping=Fn:f===po&&(d.mapping=ts),d}function l(d){let f=0,m=6;for(let x=0;x<m;x++)d[x]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:u}}function ig(a){let t={};function e(i){if(t[i]!==void 0)return t[i];let n=a.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let n=e(i);return n===null&&Jn("WebGLRenderer: "+i+" extension not supported."),n}}}function ng(a,t,e,i){let n={},s=new WeakMap;function r(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let m in d.attributes)t.remove(d.attributes[m]);d.removeEventListener("dispose",r),delete n[d.id];let f=s.get(d);f&&(t.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return n[d.id]===!0||(d.addEventListener("dispose",r),n[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)t.update(d[f],a.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,m=u.attributes.position,x=0;if(m===void 0)return;if(f!==null){let y=f.array;x=f.version;for(let M=0,v=y.length;M<v;M+=3){let S=y[M+0],b=y[M+1],E=y[M+2];d.push(S,b,b,E,E,S)}}else{let y=m.array;x=m.version;for(let M=0,v=y.length/3-1;M<v;M+=3){let S=M+0,b=M+1,E=M+2;d.push(S,b,b,E,E,S)}}let g=new(m.count>=65535?Sr:Mr)(d,1);g.version=x;let p=s.get(u);p&&t.remove(p),s.set(u,g)}function h(u){let d=s.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function sg(a,t,e){let i;function n(u){i=u}let s,r;function o(u){s=u.type,r=u.bytesPerElement}function l(u,d){a.drawElements(i,d,s,u*r),e.update(d,i,1)}function c(u,d,f){f!==0&&(a.drawElementsInstanced(i,d,s,u*r,f),e.update(d,i,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,u,0,f);let x=0;for(let g=0;g<f;g++)x+=d[g];e.update(x,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function rg(a){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,r,o){switch(e.calls++,r){case a.TRIANGLES:e.triangles+=o*(s/3);break;case a.LINES:e.lines+=o*(s/2);break;case a.LINE_STRIP:e.lines+=o*(s-1);break;case a.LINE_LOOP:e.lines+=o*s;break;case a.POINTS:e.points+=o*s;break;default:kt("WebGLInfo: Unknown draw mode:",r);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function ag(a,t,e){let i=new WeakMap,n=new Ce;function s(r,o,l){let c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=i.get(o);if(d===void 0||d.count!==u){let T=function(){E.dispose(),i.delete(o),o.removeEventListener("dispose",T)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],M=0;f===!0&&(M=1),m===!0&&(M=2),x===!0&&(M=3);let v=o.attributes.position.count*M,S=1;v>t.maxTextureSize&&(S=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let b=new Float32Array(v*S*4*u),E=new yr(b,v,S,u);E.type=Ei,E.needsUpdate=!0;let _=M*4;for(let R=0;R<u;R++){let C=g[R],L=p[R],z=y[R],P=v*S*4*R;for(let D=0;D<C.count;D++){let O=D*_;f===!0&&(n.fromBufferAttribute(C,D),b[P+O+0]=n.x,b[P+O+1]=n.y,b[P+O+2]=n.z,b[P+O+3]=0),m===!0&&(n.fromBufferAttribute(L,D),b[P+O+4]=n.x,b[P+O+5]=n.y,b[P+O+6]=n.z,b[P+O+7]=0),x===!0&&(n.fromBufferAttribute(z,D),b[P+O+8]=n.x,b[P+O+9]=n.y,b[P+O+10]=n.z,b[P+O+11]=z.itemSize===4?n.w:1)}}d={count:u,texture:E,size:new Ht(v,S)},i.set(o,d),o.addEventListener("dispose",T)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(a,"morphTexture",r.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(a,"morphTargetBaseInfluence",m),l.getUniforms().setValue(a,"morphTargetInfluences",c)}l.getUniforms().setValue(a,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(a,"morphTargetsTextureSize",d.size)}return{update:s}}function og(a,t,e,i,n){let s=new WeakMap;function r(c){let h=n.render.frame,u=c.geometry,d=t.get(c,u);if(s.get(d)!==h&&(t.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,a.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,a.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return d}function o(){s=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:o}}var lg={[Hc]:"LINEAR_TONE_MAPPING",[Gc]:"REINHARD_TONE_MAPPING",[Vc]:"CINEON_TONE_MAPPING",[Wc]:"ACES_FILMIC_TONE_MAPPING",[Xc]:"AGX_TONE_MAPPING",[Yc]:"NEUTRAL_TONE_MAPPING",[qc]:"CUSTOM_TONE_MAPPING"};function cg(a,t,e,i,n,s){let r=new Ke(t,e,{type:a,depthBuffer:n,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new fe;c.setAttribute("position",new ce([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new ce([0,2,0,0,2,0],2));let h=new $a({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new xt(c,h),d=new Nn(-1,1,1,-1,0,1),f=null,m=null,x=!1,g,p=null,y=[],M=!1;this.setSize=function(v,S){r.setSize(v,S),o!==null&&o.setSize(v,S),l!==null&&l.setSize(v,S);for(let b=0;b<y.length;b++){let E=y[b];E.setSize&&E.setSize(v,S)}},this.setEffects=function(v){y=v,M=y.length>0&&y[0].isRenderPass===!0;let S=r.width,b=r.height;y.length>0&&o===null&&(o=new Ke(S,b,{type:Si,depthBuffer:!1,stencilBuffer:!1}),l=new Ke(S,b,{type:Si,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<y.length;E++){let _=y[E];_.setSize&&_.setSize(S,b)}},this.begin=function(v,S){if(x||v.toneMapping===Bi&&y.length===0)return!1;if(p=S,S!==null){let b=S.width,E=S.height;(r.width!==b||r.height!==E)&&this.setSize(b,E)}return M===!1&&v.setRenderTarget(r),g=v.toneMapping,v.toneMapping=Bi,!0},this.hasRenderPass=function(){return M},this.end=function(v,S){v.toneMapping=g,x=!0;let b=r,E=o;for(let _=0;_<y.length;_++){let T=y[_];T.enabled!==!1&&(T.render(v,E,b,S),T.needsSwap!==!1&&(b=E,E=E===o?l:o))}if(f!==v.outputColorSpace||m!==v.toneMapping){f=v.outputColorSpace,m=v.toneMapping,h.defines={},ee.getTransfer(f)===ge&&(h.defines.SRGB_TRANSFER="");let _=lg[m];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,v.setRenderTarget(p),v.render(u,d),p=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Bd=new mi,vh=new Pn(1,1),kd=new yr,Od=new Ga,Hd=new Ar,yd=[],_d=[],bd=new Float32Array(16),Md=new Float32Array(9),Sd=new Float32Array(4);function $s(a,t,e){let i=a[0];if(i<=0||i>0)return a;let n=t*e,s=yd[n];if(s===void 0&&(s=new Float32Array(n),yd[n]=s),t!==0){i.toArray(s,0);for(let r=1,o=0;r!==t;++r)o+=e,a[r].toArray(s,o)}return s}function Ye(a,t){if(a.length!==t.length)return!1;for(let e=0,i=a.length;e<i;e++)if(a[e]!==t[e])return!1;return!0}function $e(a,t){for(let e=0,i=t.length;e<i;e++)a[e]=t[e]}function cl(a,t){let e=_d[t];e===void 0&&(e=new Int32Array(t),_d[t]=e);for(let i=0;i!==t;++i)e[i]=a.allocateTextureUnit();return e}function hg(a,t){let e=this.cache;e[0]!==t&&(a.uniform1f(this.addr,t),e[0]=t)}function ug(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(a.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;a.uniform2fv(this.addr,t),$e(e,t)}}function dg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(a.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(a.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ye(e,t))return;a.uniform3fv(this.addr,t),$e(e,t)}}function fg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(a.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;a.uniform4fv(this.addr,t),$e(e,t)}}function pg(a,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ye(e,t))return;a.uniformMatrix2fv(this.addr,!1,t),$e(e,t)}else{if(Ye(e,i))return;Sd.set(i),a.uniformMatrix2fv(this.addr,!1,Sd),$e(e,i)}}function mg(a,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ye(e,t))return;a.uniformMatrix3fv(this.addr,!1,t),$e(e,t)}else{if(Ye(e,i))return;Md.set(i),a.uniformMatrix3fv(this.addr,!1,Md),$e(e,i)}}function gg(a,t){let e=this.cache,i=t.elements;if(i===void 0){if(Ye(e,t))return;a.uniformMatrix4fv(this.addr,!1,t),$e(e,t)}else{if(Ye(e,i))return;bd.set(i),a.uniformMatrix4fv(this.addr,!1,bd),$e(e,i)}}function xg(a,t){let e=this.cache;e[0]!==t&&(a.uniform1i(this.addr,t),e[0]=t)}function vg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(a.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;a.uniform2iv(this.addr,t),$e(e,t)}}function yg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(a.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;a.uniform3iv(this.addr,t),$e(e,t)}}function _g(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(a.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;a.uniform4iv(this.addr,t),$e(e,t)}}function bg(a,t){let e=this.cache;e[0]!==t&&(a.uniform1ui(this.addr,t),e[0]=t)}function Mg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(a.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;a.uniform2uiv(this.addr,t),$e(e,t)}}function Sg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(a.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;a.uniform3uiv(this.addr,t),$e(e,t)}}function wg(a,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(a.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;a.uniform4uiv(this.addr,t),$e(e,t)}}function Tg(a,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n);let s;this.type===a.SAMPLER_2D_SHADOW?(vh.compareFunction=e.isReversedDepthBuffer()?el:tl,s=vh):s=Bd,e.setTexture2D(t||s,n)}function Eg(a,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||Od,n)}function Ag(a,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||Hd,n)}function Rg(a,t,e){let i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(a.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||kd,n)}function Cg(a){switch(a){case 5126:return hg;case 35664:return ug;case 35665:return dg;case 35666:return fg;case 35674:return pg;case 35675:return mg;case 35676:return gg;case 5124:case 35670:return xg;case 35667:case 35671:return vg;case 35668:case 35672:return yg;case 35669:case 35673:return _g;case 5125:return bg;case 36294:return Mg;case 36295:return Sg;case 36296:return wg;case 35678:case 36198:case 36298:case 36306:case 35682:return Tg;case 35679:case 36299:case 36307:return Eg;case 35680:case 36300:case 36308:case 36293:return Ag;case 36289:case 36303:case 36311:case 36292:return Rg}}function Pg(a,t){a.uniform1fv(this.addr,t)}function Ig(a,t){let e=$s(t,this.size,2);a.uniform2fv(this.addr,e)}function Lg(a,t){let e=$s(t,this.size,3);a.uniform3fv(this.addr,e)}function zg(a,t){let e=$s(t,this.size,4);a.uniform4fv(this.addr,e)}function Dg(a,t){let e=$s(t,this.size,4);a.uniformMatrix2fv(this.addr,!1,e)}function Ng(a,t){let e=$s(t,this.size,9);a.uniformMatrix3fv(this.addr,!1,e)}function Ug(a,t){let e=$s(t,this.size,16);a.uniformMatrix4fv(this.addr,!1,e)}function Fg(a,t){a.uniform1iv(this.addr,t)}function Bg(a,t){a.uniform2iv(this.addr,t)}function kg(a,t){a.uniform3iv(this.addr,t)}function Og(a,t){a.uniform4iv(this.addr,t)}function Hg(a,t){a.uniform1uiv(this.addr,t)}function Gg(a,t){a.uniform2uiv(this.addr,t)}function Vg(a,t){a.uniform3uiv(this.addr,t)}function Wg(a,t){a.uniform4uiv(this.addr,t)}function qg(a,t,e){let i=this.cache,n=t.length,s=cl(e,n);Ye(i,s)||(a.uniform1iv(this.addr,s),$e(i,s));let r;this.type===a.SAMPLER_2D_SHADOW?r=vh:r=Bd;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||r,s[o])}function Xg(a,t,e){let i=this.cache,n=t.length,s=cl(e,n);Ye(i,s)||(a.uniform1iv(this.addr,s),$e(i,s));for(let r=0;r!==n;++r)e.setTexture3D(t[r]||Od,s[r])}function Yg(a,t,e){let i=this.cache,n=t.length,s=cl(e,n);Ye(i,s)||(a.uniform1iv(this.addr,s),$e(i,s));for(let r=0;r!==n;++r)e.setTextureCube(t[r]||Hd,s[r])}function $g(a,t,e){let i=this.cache,n=t.length,s=cl(e,n);Ye(i,s)||(a.uniform1iv(this.addr,s),$e(i,s));for(let r=0;r!==n;++r)e.setTexture2DArray(t[r]||kd,s[r])}function Zg(a){switch(a){case 5126:return Pg;case 35664:return Ig;case 35665:return Lg;case 35666:return zg;case 35674:return Dg;case 35675:return Ng;case 35676:return Ug;case 5124:case 35670:return Fg;case 35667:case 35671:return Bg;case 35668:case 35672:return kg;case 35669:case 35673:return Og;case 5125:return Hg;case 36294:return Gg;case 36295:return Vg;case 36296:return Wg;case 35678:case 36198:case 36298:case 36306:case 35682:return qg;case 35679:case 36299:case 36307:return Xg;case 35680:case 36300:case 36308:case 36293:return Yg;case 36289:case 36303:case 36311:case 36292:return $g}}var yh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Cg(e.type)}},_h=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Zg(e.type)}},bh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let n=this.seq;for(let s=0,r=n.length;s!==r;++s){let o=n[s];o.setValue(t,e[o.id],i)}}},gh=/(\w+)(\])?(\[|\.)?/g;function wd(a,t){a.seq.push(t),a.map[t.id]=t}function Jg(a,t,e){let i=a.name,n=i.length;for(gh.lastIndex=0;;){let s=gh.exec(i),r=gh.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===n){wd(e,c===void 0?new yh(o,a,t):new _h(o,a,t));break}else{let u=e.map[o];u===void 0&&(u=new bh(o),wd(e,u)),e=u}}}var Ys=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){let o=t.getActiveUniform(e,r),l=t.getUniformLocation(e,o.name);Jg(o,l,this)}let n=[],s=[];for(let r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(r):s.push(r);n.length>0&&(this.seq=n.concat(s))}setValue(t,e,i,n){let s=this.map[e];s!==void 0&&s.setValue(t,i,n)}setOptional(t,e,i){let n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let s=0,r=e.length;s!==r;++s){let o=e[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){let i=[];for(let n=0,s=t.length;n!==s;++n){let r=t[n];r.id in e&&i.push(r)}return i}};function Td(a,t,e){let i=a.createShader(t);return a.shaderSource(i,e),a.compileShader(i),i}var jg=37297,Kg=0;function Qg(a,t){let e=a.split(`
`),i=[],n=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let r=n;r<s;r++){let o=r+1;i.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return i.join(`
`)}var Ed=new Vt;function tx(a){ee._getMatrix(Ed,ee.workingColorSpace,a);let t=`mat3( ${Ed.elements.map(e=>e.toFixed(4))} )`;switch(ee.getTransfer(a)){case gr:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return Ft("WebGLProgram: Unsupported color space: ",a),[t,"LinearTransferOETF"]}}function Ad(a,t,e){let i=a.getShaderParameter(t,a.COMPILE_STATUS),s=(a.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Qg(a.getShaderSource(t),o)}else return s}function ex(a,t){let e=tx(t);return[`vec4 ${a}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var ix={[Hc]:"Linear",[Gc]:"Reinhard",[Vc]:"Cineon",[Wc]:"ACESFilmic",[Xc]:"AgX",[Yc]:"Neutral",[qc]:"Custom"};function nx(a,t){let e=ix[t];return e===void 0?(Ft("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+a+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+a+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var sl=new N;function sx(){ee.getLuminanceCoefficients(sl);let a=sl.x.toFixed(4),t=sl.y.toFixed(4),e=sl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${a}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rx(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",a.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Yr).join(`
`)}function ax(a){let t=[];for(let e in a){let i=a[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function ox(a,t){let e={},i=a.getProgramParameter(t,a.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){let s=a.getActiveAttrib(t,n),r=s.name,o=1;s.type===a.FLOAT_MAT2&&(o=2),s.type===a.FLOAT_MAT3&&(o=3),s.type===a.FLOAT_MAT4&&(o=4),e[r]={type:s.type,location:a.getAttribLocation(t,r),locationSize:o}}return e}function Yr(a){return a!==""}function Rd(a,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return a.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Cd(a,t){return a.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var lx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mh(a){return a.replace(lx,hx)}var cx=new Map;function hx(a,t){let e=$t[t];if(e===void 0){let i=cx.get(t);if(i!==void 0)e=$t[i],Ft('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Mh(e)}var ux=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pd(a){return a.replace(ux,dx)}function dx(a,t,e,i){let n="";for(let s=parseInt(t);s<parseInt(e);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function Id(a){let t=`precision ${a.precision} float;
	precision ${a.precision} int;
	precision ${a.precision} sampler2D;
	precision ${a.precision} samplerCube;
	precision ${a.precision} sampler3D;
	precision ${a.precision} sampler2DArray;
	precision ${a.precision} sampler2DShadow;
	precision ${a.precision} samplerCubeShadow;
	precision ${a.precision} sampler2DArrayShadow;
	precision ${a.precision} isampler2D;
	precision ${a.precision} isampler3D;
	precision ${a.precision} isamplerCube;
	precision ${a.precision} isampler2DArray;
	precision ${a.precision} usampler2D;
	precision ${a.precision} usampler3D;
	precision ${a.precision} usamplerCube;
	precision ${a.precision} usampler2DArray;
	`;return a.precision==="highp"?t+=`
#define HIGH_PRECISION`:a.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var fx={[Ur]:"SHADOWMAP_TYPE_PCF",[Gs]:"SHADOWMAP_TYPE_VSM"};function px(a){return fx[a.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var mx={[Fn]:"ENVMAP_TYPE_CUBE",[ts]:"ENVMAP_TYPE_CUBE",[Fr]:"ENVMAP_TYPE_CUBE_UV"};function gx(a){return a.envMap===!1?"ENVMAP_TYPE_CUBE":mx[a.envMapMode]||"ENVMAP_TYPE_CUBE"}var xx={[ts]:"ENVMAP_MODE_REFRACTION"};function vx(a){return a.envMap===!1?"ENVMAP_MODE_REFLECTION":xx[a.envMapMode]||"ENVMAP_MODE_REFLECTION"}var yx={[uo]:"ENVMAP_BLENDING_MULTIPLY",[Zu]:"ENVMAP_BLENDING_MIX",[Ju]:"ENVMAP_BLENDING_ADD"};function _x(a){return a.envMap===!1?"ENVMAP_BLENDING_NONE":yx[a.combine]||"ENVMAP_BLENDING_NONE"}function bx(a){let t=a.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Mx(a,t,e,i){let n=a.getContext(),s=e.defines,r=e.vertexShader,o=e.fragmentShader,l=px(e),c=gx(e),h=vx(e),u=_x(e),d=bx(e),f=rx(e),m=ax(s),x=n.createProgram(),g,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Yr).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Yr).join(`
`),p.length>0&&(p+=`
`)):(g=[Id(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Yr).join(`
`),p=[Id(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Bi?"#define TONE_MAPPING":"",e.toneMapping!==Bi?$t.tonemapping_pars_fragment:"",e.toneMapping!==Bi?nx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,ex("linearToOutputTexel",e.outputColorSpace),sx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Yr).join(`
`)),r=Mh(r),r=Rd(r,e),r=Cd(r,e),o=Mh(o),o=Rd(o,e),o=Cd(o,e),r=Pd(r),o=Pd(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===ih?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ih?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=y+g+r,v=y+p+o,S=Td(n,n.VERTEX_SHADER,M),b=Td(n,n.FRAGMENT_SHADER,v);n.attachShader(x,S),n.attachShader(x,b),e.index0AttributeName!==void 0?n.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(x,0,"position"),n.linkProgram(x);function E(C){if(a.debug.checkShaderErrors){let L=n.getProgramInfoLog(x)||"",z=n.getShaderInfoLog(S)||"",P=n.getShaderInfoLog(b)||"",D=L.trim(),O=z.trim(),k=P.trim(),$=!0,W=!0;if(n.getProgramParameter(x,n.LINK_STATUS)===!1)if($=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(n,x,S,b);else{let Y=Ad(n,S,"vertex"),j=Ad(n,b,"fragment");kt("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(x,n.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+Y+`
`+j)}else D!==""?Ft("WebGLProgram: Program Info Log:",D):(O===""||k==="")&&(W=!1);W&&(C.diagnostics={runnable:$,programLog:D,vertexShader:{log:O,prefix:g},fragmentShader:{log:k,prefix:p}})}n.deleteShader(S),n.deleteShader(b),_=new Ys(n,x),T=ox(n,x)}let _;this.getUniforms=function(){return _===void 0&&E(this),_};let T;this.getAttributes=function(){return T===void 0&&E(this),T};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=n.getProgramParameter(x,jg)),R},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Kg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=S,this.fragmentShader=b,this}var Sx=0,Sh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new wh(t),e.set(t,i)),i}},wh=class{constructor(t){this.id=Sx++,this.code=t,this.usedTimes=0}};function wx(a){return a===On||a===Vr||a===Wr}function Tx(a,t,e,i,n,s){let r=new _r,o=new Sh,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer,d=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(_){return l.add(_),_===0?"uv":`uv${_}`}function x(_,T,R,C,L,z){let P=C.fog,D=L.geometry,O=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,$=t.get(_.envMap||O,k),W=$&&$.mapping===Fr?$.image.height:null,Y=f[_.type];_.precision!==null&&(d=i.getMaxPrecision(_.precision),d!==_.precision&&Ft("WebGLProgram.getParameters:",_.precision,"not supported, using",d,"instead."));let j=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,at=j!==void 0?j.length:0,ot=0;D.morphAttributes.position!==void 0&&(ot=1),D.morphAttributes.normal!==void 0&&(ot=2),D.morphAttributes.color!==void 0&&(ot=3);let Gt,Xt,jt,Z;if(Y){let we=en[Y];Gt=we.vertexShader,Xt=we.fragmentShader}else{Gt=_.vertexShader,Xt=_.fragmentShader;let we=o.getVertexShaderStage(_),pe=o.getFragmentShaderStage(_);o.update(_,we,pe),jt=we.id,Z=pe.id}let tt=a.getRenderTarget(),wt=a.state.buffers.depth.getReversed(),Nt=L.isInstancedMesh===!0,bt=L.isBatchedMesh===!0,qt=!!_.map,ze=!!_.matcap,Zt=!!$,le=!!_.aoMap,Se=!!_.lightMap,te=!!_.bumpMap&&_.wireframe===!1,Re=!!_.normalMap,Je=!!_.displacementMap,xi=!!_.emissiveMap,Pe=!!_.metalnessMap,Ue=!!_.roughnessMap,B=_.anisotropy>0,si=_.clearcoat>0,xe=_.dispersion>0,I=_.retroreflectivity>0,w=_.iridescence>0,H=_.sheen>0,q=_.transmission>0,J=B&&!!_.anisotropyMap,rt=si&&!!_.clearcoatMap,ct=si&&!!_.clearcoatNormalMap,K=si&&!!_.clearcoatRoughnessMap,et=w&&!!_.iridescenceMap,ut=w&&!!_.iridescenceThicknessMap,It=H&&!!_.sheenColorMap,gt=H&&!!_.sheenRoughnessMap,dt=!!_.specularMap,Lt=!!_.specularColorMap,Ut=!!_.specularIntensityMap,Wt=q&&!!_.transmissionMap,F=q&&!!_.thicknessMap,ft=!!_.gradientMap,Q=!!_.alphaMap,pt=_.alphaTest>0,_t=!!_.alphaHash,nt=!!_.extensions,Dt=Bi;_.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Dt=a.toneMapping);let At={shaderID:Y,shaderType:_.type,shaderName:_.name,vertexShader:Gt,fragmentShader:Xt,defines:_.defines,customVertexShaderID:jt,customFragmentShaderID:Z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:d,batching:bt,batchingColor:bt&&L._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&L.instanceColor!==null,instancingMorph:Nt&&L.morphTexture!==null,outputColorSpace:tt===null?a.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:ee.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:qt,matcap:ze,envMap:Zt,envMapMode:Zt&&$.mapping,envMapCubeUVHeight:W,aoMap:le,lightMap:Se,bumpMap:te,normalMap:Re,displacementMap:Je,emissiveMap:xi,normalMapObjectSpace:Re&&_.normalMapType===Qu,normalMapTangentSpace:Re&&_.normalMapType===Qo,packedNormalMap:Re&&_.normalMapType===Qo&&wx(_.normalMap.format),metalnessMap:Pe,roughnessMap:Ue,anisotropy:B,anisotropyMap:J,clearcoat:si,clearcoatMap:rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:K,dispersion:xe,retroreflection:I,iridescence:w,iridescenceMap:et,iridescenceThicknessMap:ut,sheen:H,sheenColorMap:It,sheenRoughnessMap:gt,specularMap:dt,specularColorMap:Lt,specularIntensityMap:Ut,transmission:q,transmissionMap:Wt,thicknessMap:F,gradientMap:ft,opaque:_.transparent===!1&&_.blending===Un&&_.alphaToCoverage===!1,alphaMap:Q,alphaTest:pt,alphaHash:_t,combine:_.combine,mapUv:qt&&m(_.map.channel),aoMapUv:le&&m(_.aoMap.channel),lightMapUv:Se&&m(_.lightMap.channel),bumpMapUv:te&&m(_.bumpMap.channel),normalMapUv:Re&&m(_.normalMap.channel),displacementMapUv:Je&&m(_.displacementMap.channel),emissiveMapUv:xi&&m(_.emissiveMap.channel),metalnessMapUv:Pe&&m(_.metalnessMap.channel),roughnessMapUv:Ue&&m(_.roughnessMap.channel),anisotropyMapUv:J&&m(_.anisotropyMap.channel),clearcoatMapUv:rt&&m(_.clearcoatMap.channel),clearcoatNormalMapUv:ct&&m(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&m(_.clearcoatRoughnessMap.channel),iridescenceMapUv:et&&m(_.iridescenceMap.channel),iridescenceThicknessMapUv:ut&&m(_.iridescenceThicknessMap.channel),sheenColorMapUv:It&&m(_.sheenColorMap.channel),sheenRoughnessMapUv:gt&&m(_.sheenRoughnessMap.channel),specularMapUv:dt&&m(_.specularMap.channel),specularColorMapUv:Lt&&m(_.specularColorMap.channel),specularIntensityMapUv:Ut&&m(_.specularIntensityMap.channel),transmissionMapUv:Wt&&m(_.transmissionMap.channel),thicknessMapUv:F&&m(_.thicknessMap.channel),alphaMapUv:Q&&m(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Re||B),vertexNormals:!!D.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!D.attributes.uv&&(qt||Q),fog:!!P,useFog:_.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&Re===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:wt,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:at,morphTextureStride:ot,numSunLights:T.sun.length,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numSunLightShadows:T.sunShadowMap.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:_.dithering,shadowMapEnabled:a.shadowMap.enabled&&R.length>0,shadowMapType:a.shadowMap.type,toneMapping:Dt,decodeVideoTexture:qt&&_.map.isVideoTexture===!0&&ee.getTransfer(_.map.colorSpace)===ge,decodeVideoTextureEmissive:xi&&_.emissiveMap.isVideoTexture===!0&&ee.getTransfer(_.emissiveMap.colorSpace)===ge,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Qe,flipSided:_.side===ii,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:nt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&_.extensions.multiDraw===!0||bt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return At.vertexUv1s=l.has(1),At.vertexUv2s=l.has(2),At.vertexUv3s=l.has(3),l.clear(),At}function g(_){let T=[];if(_.shaderID?T.push(_.shaderID):(T.push(_.customVertexShaderID),T.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)T.push(R),T.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(T,_),y(T,_),T.push(a.outputColorSpace)),T.push(_.customProgramCacheKey),T.join()}function p(_,T){_.push(T.precision),_.push(T.outputColorSpace),_.push(T.envMapMode),_.push(T.envMapCubeUVHeight),_.push(T.mapUv),_.push(T.alphaMapUv),_.push(T.lightMapUv),_.push(T.aoMapUv),_.push(T.bumpMapUv),_.push(T.normalMapUv),_.push(T.displacementMapUv),_.push(T.emissiveMapUv),_.push(T.metalnessMapUv),_.push(T.roughnessMapUv),_.push(T.anisotropyMapUv),_.push(T.clearcoatMapUv),_.push(T.clearcoatNormalMapUv),_.push(T.clearcoatRoughnessMapUv),_.push(T.iridescenceMapUv),_.push(T.iridescenceThicknessMapUv),_.push(T.sheenColorMapUv),_.push(T.sheenRoughnessMapUv),_.push(T.specularMapUv),_.push(T.specularColorMapUv),_.push(T.specularIntensityMapUv),_.push(T.transmissionMapUv),_.push(T.thicknessMapUv),_.push(T.combine),_.push(T.fogExp2),_.push(T.sizeAttenuation),_.push(T.morphTargetsCount),_.push(T.morphAttributeCount),_.push(T.numSunLights),_.push(T.numDirLights),_.push(T.numPointLights),_.push(T.numSpotLights),_.push(T.numSpotLightMaps),_.push(T.numHemiLights),_.push(T.numRectAreaLights),_.push(T.numSunLightShadows),_.push(T.numDirLightShadows),_.push(T.numPointLightShadows),_.push(T.numSpotLightShadows),_.push(T.numSpotLightShadowsWithMaps),_.push(T.numLightProbes),_.push(T.shadowMapType),_.push(T.toneMapping),_.push(T.numClippingPlanes),_.push(T.numClipIntersection),_.push(T.depthPacking)}function y(_,T){r.disableAll(),T.instancing&&r.enable(0),T.instancingColor&&r.enable(1),T.instancingMorph&&r.enable(2),T.matcap&&r.enable(3),T.envMap&&r.enable(4),T.normalMapObjectSpace&&r.enable(5),T.normalMapTangentSpace&&r.enable(6),T.clearcoat&&r.enable(7),T.iridescence&&r.enable(8),T.alphaTest&&r.enable(9),T.vertexColors&&r.enable(10),T.vertexAlphas&&r.enable(11),T.vertexUv1s&&r.enable(12),T.vertexUv2s&&r.enable(13),T.vertexUv3s&&r.enable(14),T.vertexTangents&&r.enable(15),T.anisotropy&&r.enable(16),T.alphaHash&&r.enable(17),T.batching&&r.enable(18),T.dispersion&&r.enable(19),T.retroreflection&&r.enable(24),T.batchingColor&&r.enable(20),T.gradientMap&&r.enable(21),T.packedNormalMap&&r.enable(22),T.vertexNormals&&r.enable(23),_.push(r.mask),r.disableAll(),T.fog&&r.enable(0),T.useFog&&r.enable(1),T.flatShading&&r.enable(2),T.logarithmicDepthBuffer&&r.enable(3),T.reversedDepthBuffer&&r.enable(4),T.skinning&&r.enable(5),T.morphTargets&&r.enable(6),T.morphNormals&&r.enable(7),T.morphColors&&r.enable(8),T.premultipliedAlpha&&r.enable(9),T.shadowMapEnabled&&r.enable(10),T.doubleSided&&r.enable(11),T.flipSided&&r.enable(12),T.useDepthPacking&&r.enable(13),T.dithering&&r.enable(14),T.transmission&&r.enable(15),T.sheen&&r.enable(16),T.opaque&&r.enable(17),T.pointsUvs&&r.enable(18),T.decodeVideoTexture&&r.enable(19),T.decodeVideoTextureEmissive&&r.enable(20),T.alphaToCoverage&&r.enable(21),T.numLightProbeGrids>0&&r.enable(22),T.hasPositionAttribute&&r.enable(23),_.push(r.mask)}function M(_){let T=f[_.type],R;if(T){let C=en[T];R=il.clone(C.uniforms)}else R=_.uniforms;return R}function v(_,T){let R=h.get(T);return R!==void 0?++R.usedTimes:(R=new Mx(a,T,_,n),c.push(R),h.set(T,R)),R}function S(_){if(--_.usedTimes===0){let T=c.indexOf(_);c[T]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){o.remove(_)}function E(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:M,acquireProgram:v,releaseProgram:S,releaseShaderCache:b,programs:c,dispose:E}}function Ex(){let a=new WeakMap;function t(r){return a.has(r)}function e(r){let o=a.get(r);return o===void 0&&(o={},a.set(r,o)),o}function i(r){a.delete(r)}function n(r,o,l){a.get(r)[o]=l}function s(){a=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:s}}function Ax(a,t){return a.groupOrder!==t.groupOrder?a.groupOrder-t.groupOrder:a.renderOrder!==t.renderOrder?a.renderOrder-t.renderOrder:a.material.id!==t.material.id?a.material.id-t.material.id:a.materialVariant!==t.materialVariant?a.materialVariant-t.materialVariant:a.z!==t.z?a.z-t.z:a.id-t.id}function Ld(a,t){return a.groupOrder!==t.groupOrder?a.groupOrder-t.groupOrder:a.renderOrder!==t.renderOrder?a.renderOrder-t.renderOrder:a.z!==t.z?t.z-a.z:a.id-t.id}function zd(){let a=[],t=0,e=[],i=[],n=[];function s(){t=0,e.length=0,i.length=0,n.length=0}function r(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,x,g,p){let y=a[t];return y===void 0?(y={id:d.id,object:d,geometry:f,material:m,materialVariant:r(d),groupOrder:x,renderOrder:d.renderOrder,z:g,group:p},a[t]=y):(y.id=d.id,y.object=d,y.geometry=f,y.material=m,y.materialVariant=r(d),y.groupOrder=x,y.renderOrder=d.renderOrder,y.z=g,y.group=p),t++,y}function l(d,f,m,x,g,p,y){y.reversedDepth===!0&&(g=-g);let M=o(d,f,m,x,g,p);m.transmission>0?i.push(M):m.transparent===!0?n.push(M):e.push(M)}function c(d,f,m,x,g,p){let y=o(d,f,m,x,g,p);m.transmission>0?i.unshift(y):m.transparent===!0?n.unshift(y):e.unshift(y)}function h(d,f){e.length>1&&e.sort(d||Ax),i.length>1&&i.sort(f||Ld),n.length>1&&n.sort(f||Ld)}function u(){for(let d=t,f=a.length;d<f;d++){let m=a[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:n,init:s,push:l,unshift:c,finish:u,sort:h}}function Rx(){let a=new WeakMap;function t(i,n){let s=a.get(i),r;return s===void 0?(r=new zd,a.set(i,[r])):n>=s.length?(r=new zd,s.push(r)):r=s[n],r}function e(){a=new WeakMap}return{get:t,dispose:e}}function Cx(){let a={};return{get:function(t){if(a[t.id]!==void 0)return a[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new N,color:new Ct};break;case"SpotLight":e={position:new N,direction:new N,color:new Ct,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Ct,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Ct,groundColor:new Ct};break;case"RectAreaLight":e={color:new Ct,position:new N,halfWidth:new N,halfHeight:new N};break}return a[t.id]=e,e}}}function Px(){let a={};return{get:function(t){if(a[t.id]!==void 0)return a[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[t.id]=e,e}}}var Ix=0;function Lx(a,t){return(t.castShadow?2:0)-(a.castShadow?2:0)+(t.map?1:0)-(a.map?1:0)}function zx(a){let t=new Cx,e=Px(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new N);let n=new N,s=new de,r=new de;function o(c){let h=0,u=0,d=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,y=0,M=0,v=0,S=0,b=0,E=0,_=0,T=0,R=0;c.sort(Lx);for(let L=0,z=c.length;L<z;L++){let P=c[L],D=P.color,O=P.intensity,k=P.distance,$=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===On?$=P.shadow.map.texture:$=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=D.r*O,u+=D.g*O,d+=D.b*O;else if(P.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(P.sh.coefficients[W],O);R++}else if(P.isSunLight){let W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Y=P.shadow,j=e.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),i.sunShadow[m]=j,i.sunShadowMap[m]=$;let at=Y.getViewportCount();for(let ot=0;ot<at;ot++)i.sunShadowMatrix[x+ot]=Y.getMatrix(ot),i.sunShadowCascade[x+ot]=Y._cascadeData[ot];x+=at,m++}i.sun[f]=W,f++}else if(P.isDirectionalLight){let W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let Y=P.shadow,j=e.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,i.directionalShadow[g]=j,i.directionalShadowMap[g]=$,i.directionalShadowMatrix[g]=P.shadow.matrix,S++}i.directional[g]=W,g++}else if(P.isSpotLight){let W=t.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(D).multiplyScalar(O),W.distance=k,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,i.spot[y]=W;let Y=P.shadow;if(P.map&&(i.spotLightMap[_]=P.map,_++,Y.updateMatrices(P),P.castShadow&&T++),i.spotLightMatrix[y]=Y.matrix,P.castShadow){let j=e.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,i.spotShadow[y]=j,i.spotShadowMap[y]=$,E++}y++}else if(P.isRectAreaLight){let W=t.get(P);W.color.copy(D).multiplyScalar(O),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),i.rectArea[M]=W,M++}else if(P.isPointLight){let W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){let Y=P.shadow,j=e.get(P);j.shadowIntensity=Y.intensity,j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,j.shadowCameraNear=Y.camera.near,j.shadowCameraFar=Y.camera.far,i.pointShadow[p]=j,i.pointShadowMap[p]=$,i.pointShadowMatrix[p]=P.shadow.matrix,b++}i.point[p]=W,p++}else if(P.isHemisphereLight){let W=t.get(P);W.skyColor.copy(P.color).multiplyScalar(O),W.groundColor.copy(P.groundColor).multiplyScalar(O),i.hemi[v]=W,v++}}M>0&&(a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=mt.LTC_FLOAT_1,i.rectAreaLTC2=mt.LTC_FLOAT_2):(i.rectAreaLTC1=mt.LTC_HALF_1,i.rectAreaLTC2=mt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;let C=i.hash;(C.sunLength!==f||C.directionalLength!==g||C.pointLength!==p||C.spotLength!==y||C.rectAreaLength!==M||C.hemiLength!==v||C.numSunShadows!==m||C.numDirectionalShadows!==S||C.numPointShadows!==b||C.numSpotShadows!==E||C.numSpotMaps!==_||C.numLightProbes!==R)&&(i.sun.length=f,i.directional.length=g,i.spot.length=y,i.rectArea.length=M,i.point.length=p,i.hemi.length=v,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=E,i.spotShadowMap.length=E,i.spotLightMatrix.length=E+_-T,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,C.sunLength=f,C.directionalLength=g,C.pointLength=p,C.spotLength=y,C.rectAreaLength=M,C.hemiLength=v,C.numSunShadows=m,C.numDirectionalShadows=S,C.numPointShadows=b,C.numSpotShadows=E,C.numSpotMaps=_,C.numLightProbes=R,i.version=Ix++)}function l(c,h){let u=0,d=0,f=0,m=0,x=0,g=0,p=h.matrixWorldInverse;for(let y=0,M=c.length;y<M;y++){let v=c[y];if(v.isSunLight){let S=i.sun[u];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(p),u++}else if(v.isDirectionalLight){let S=i.directional[d];S.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(n),S.direction.transformDirection(p),d++}else if(v.isSpotLight){let S=i.spot[m];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(v.matrixWorld),n.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(n),S.direction.transformDirection(p),m++}else if(v.isRectAreaLight){let S=i.rectArea[x];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),r.identity(),s.copy(v.matrixWorld),s.premultiply(p),r.extractRotation(s),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(r),S.halfHeight.applyMatrix4(r),x++}else if(v.isPointLight){let S=i.point[f];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let S=i.hemi[g];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function Dd(a){let t=new zx(a),e=[],i=[],n=[];function s(d){u.camera=d,e.length=0,i.length=0,n.length=0}function r(d){e.push(d)}function o(d){i.push(d)}function l(d){n.push(d)}function c(){t.setup(e)}function h(d){t.setupView(e,d)}let u={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:l}}function Dx(a){let t=new WeakMap;function e(n,s=0){let r=t.get(n),o;return r===void 0?(o=new Dd(a),t.set(n,[o])):s>=r.length?(o=new Dd(a),r.push(o)):o=r[s],o}function i(){t=new WeakMap}return{get:e,dispose:i}}var Nx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ux=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Fx=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],Bx=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],Nd=new de,Xr=new N,xh=new N;function kx(a,t,e){let i=new Os,n=new Ht,s=new Ht,r=new Ce,o=new Za,l=new Ja,c={},h=e.maxTextureSize,u={[Ki]:ii,[ii]:Ki,[Qe]:Qe},d=new Ie({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:Nx,fragmentShader:Ux}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new fe;m.setAttribute("position",new ne(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new xt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ur;let p=this.type;this.render=function(b,E,_){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===Pu&&(Ft("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ur);let T=a.getRenderTarget(),R=a.getActiveCubeFace(),C=a.getActiveMipmapLevel(),L=a.state;L.setBlending(Qi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let z=p!==this.type;z&&E.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(D=>D.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,D=b.length;P<D;P++){let O=b[P],k=O.shadow;if(k===void 0){Ft("WebGLShadowMap:",O,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;n.copy(k.mapSize);let $=k.getFrameExtents();n.multiply($),s.copy(k.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/$.x),n.x=s.x*$.x,k.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/$.y),n.y=s.y*$.y,k.mapSize.y=s.y));let W=a.state.buffers.depth.getReversed();if(k.camera._reversedDepth=W,k.map===null||z===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Gs){if(O.isPointLight){Ft("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Ke(n.x,n.y,{format:On,type:Si,minFilter:Oe,magFilter:Oe,generateMipmaps:!1}),k.map.texture.name=O.name+".shadowMap",k.map.depthTexture=new Pn(n.x,n.y,Ei),k.map.depthTexture.name=O.name+".shadowMapDepth",k.map.depthTexture.format=$i,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=ke,k.map.depthTexture.magFilter=ke}else O.isPointLight?(k.map=new al(n.x),k.map.depthTexture=new Xa(n.x,ki)):(k.map=new Ke(n.x,n.y),k.map.depthTexture=new Pn(n.x,n.y,ki)),k.map.depthTexture.name=O.name+".shadowMap",k.map.depthTexture.format=$i,this.type===Ur?(k.map.depthTexture.compareFunction=W?el:tl,k.map.depthTexture.minFilter=Oe,k.map.depthTexture.magFilter=Oe):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=ke,k.map.depthTexture.magFilter=ke);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==n.x||k.map.height!==n.y)&&k.map.setSize(n.x,n.y);let Y=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();O.isPointLight!==!0&&k.updateMatrices(O,_);for(let j=0;j<Y;j++){let at=k.getCamera(j);if(O.isPointLight){let ot=k.camera,Gt=k.matrix,Xt=O.distance||ot.far;Xt!==ot.far&&(ot.far=Xt,ot.updateProjectionMatrix()),Xr.setFromMatrixPosition(O.matrixWorld),ot.position.copy(Xr),xh.copy(ot.position),xh.add(Fx[j]),ot.up.copy(Bx[j]),ot.lookAt(xh),ot.updateMatrixWorld(),Gt.makeTranslation(-Xr.x,-Xr.y,-Xr.z),Nd.multiplyMatrices(ot.projectionMatrix,ot.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Nd,ot.coordinateSystem,ot.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)a.setRenderTarget(k.map,j),a.clear();else{j===0&&(a.setRenderTarget(k.map),a.clear());let ot=k.getViewport(j);r.set(s.x*ot.x,s.y*ot.y,s.x*ot.z,s.y*ot.w),L.viewport(r)}i=k.getFrustum(j),v(E,_,at,O,this.type)}k.isPointLightShadow!==!0&&this.type===Gs&&y(k,_),k.needsUpdate=!1}p=this.type,g.needsUpdate=!1,a.setRenderTarget(T,R,C)};function y(b,E){let _=t.update(x);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new Ke(n.x,n.y,{format:On,type:Si}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,a.setRenderTarget(b.mapPass),a.clear(),a.renderBufferDirect(E,null,_,d,x,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,a.setRenderTarget(b.map),a.clear(),a.renderBufferDirect(E,null,_,f,x,null)}function M(b,E,_,T){let R=null,C=_.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)R=C;else if(R=_.isPointLight===!0?l:o,a.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let L=R.uuid,z=E.uuid,P=c[L];P===void 0&&(P={},c[L]=P);let D=P[z];D===void 0&&(D=R.clone(),P[z]=D,E.addEventListener("dispose",S)),R=D}if(R.visible=E.visible,R.wireframe=E.wireframe,T===Gs?R.side=E.shadowSide!==null?E.shadowSide:E.side:R.side=E.shadowSide!==null?E.shadowSide:u[E.side],R.alphaMap=E.alphaMap,R.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,R.map=E.map,R.clipShadows=E.clipShadows,R.clippingPlanes=E.clippingPlanes,R.clipIntersection=E.clipIntersection,R.displacementMap=E.displacementMap,R.displacementScale=E.displacementScale,R.displacementBias=E.displacementBias,R.wireframeLinewidth=E.wireframeLinewidth,R.linewidth=E.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let L=a.properties.get(R);L.light=_}return R}function v(b,E,_,T,R){if(b.visible===!1)return;if(b.layers.test(E.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&R===Gs)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,b.matrixWorld);let z=t.update(b),P=b.material;if(Array.isArray(P)){let D=z.groups;for(let O=0,k=D.length;O<k;O++){let $=D[O],W=P[$.materialIndex];if(W&&W.visible){let Y=M(b,W,T,R);b.onBeforeShadow(a,b,E,_,z,Y,$),a.renderBufferDirect(_,null,z,Y,b,$),b.onAfterShadow(a,b,E,_,z,Y,$)}}}else if(P.visible){let D=M(b,P,T,R);b.onBeforeShadow(a,b,E,_,z,D,null),a.renderBufferDirect(_,null,z,D,b,null),b.onAfterShadow(a,b,E,_,z,D,null)}}let L=b.children;for(let z=0,P=L.length;z<P;z++)v(L[z],E,_,T,R)}function S(b){b.target.removeEventListener("dispose",S);for(let _ in c){let T=c[_],R=b.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function Ox(a,t){function e(){let F=!1,ft=new Ce,Q=null,pt=new Ce(0,0,0,0);return{setMask:function(_t){Q!==_t&&!F&&(a.colorMask(_t,_t,_t,_t),Q=_t)},setLocked:function(_t){F=_t},setClear:function(_t,nt,Dt,At,we){we===!0&&(_t*=At,nt*=At,Dt*=At),ft.set(_t,nt,Dt,At),pt.equals(ft)===!1&&(a.clearColor(_t,nt,Dt,At),pt.copy(ft))},reset:function(){F=!1,Q=null,pt.set(-1,0,0,0)}}}function i(){let F=!1,ft=!1,Q=null,pt=null,_t=null;return{setReversed:function(nt){if(ft!==nt){let Dt=t.get("EXT_clip_control");nt?Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.ZERO_TO_ONE_EXT):Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.NEGATIVE_ONE_TO_ONE_EXT),ft=nt;let At=_t;_t=null,this.setClear(At)}},getReversed:function(){return ft},setTest:function(nt){nt?tt(a.DEPTH_TEST):wt(a.DEPTH_TEST)},setMask:function(nt){Q!==nt&&!F&&(a.depthMask(nt),Q=nt)},setFunc:function(nt){if(ft&&(nt=hd[nt]),pt!==nt){switch(nt){case Pa:a.depthFunc(a.NEVER);break;case Ia:a.depthFunc(a.ALWAYS);break;case La:a.depthFunc(a.LESS);break;case Is:a.depthFunc(a.LEQUAL);break;case za:a.depthFunc(a.EQUAL);break;case Da:a.depthFunc(a.GEQUAL);break;case Na:a.depthFunc(a.GREATER);break;case Ua:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}pt=nt}},setLocked:function(nt){F=nt},setClear:function(nt){_t!==nt&&(_t=nt,ft&&(nt=1-nt),a.clearDepth(nt))},reset:function(){F=!1,Q=null,pt=null,_t=null,ft=!1}}}function n(){let F=!1,ft=null,Q=null,pt=null,_t=null,nt=null,Dt=null,At=null,we=null;return{setTest:function(pe){F||(pe?tt(a.STENCIL_TEST):wt(a.STENCIL_TEST))},setMask:function(pe){ft!==pe&&!F&&(a.stencilMask(pe),ft=pe)},setFunc:function(pe,Pi,Vi){(Q!==pe||pt!==Pi||_t!==Vi)&&(a.stencilFunc(pe,Pi,Vi),Q=pe,pt=Pi,_t=Vi)},setOp:function(pe,Pi,Vi){(nt!==pe||Dt!==Pi||At!==Vi)&&(a.stencilOp(pe,Pi,Vi),nt=pe,Dt=Pi,At=Vi)},setLocked:function(pe){F=pe},setClear:function(pe){we!==pe&&(a.clearStencil(pe),we=pe)},reset:function(){F=!1,ft=null,Q=null,pt=null,_t=null,nt=null,Dt=null,At=null,we=null}}}let s=new e,r=new i,o=new n,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],x=null,g=!1,p=null,y=null,M=null,v=null,S=null,b=null,E=null,_=new Ct(0,0,0),T=0,R=!1,C=null,L=null,z=null,P=null,D=null,O=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,$=0,W=a.getParameter(a.VERSION);W.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(W)[1]),k=$>=1):W.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),k=$>=2);let Y=null,j={},at=a.getParameter(a.SCISSOR_BOX),ot=a.getParameter(a.VIEWPORT),Gt=new Ce().fromArray(at),Xt=new Ce().fromArray(ot);function jt(F,ft,Q,pt){let _t=new Uint8Array(4),nt=a.createTexture();a.bindTexture(F,nt),a.texParameteri(F,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(F,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let Dt=0;Dt<Q;Dt++)F===a.TEXTURE_3D||F===a.TEXTURE_2D_ARRAY?a.texImage3D(ft,0,a.RGBA,1,1,pt,0,a.RGBA,a.UNSIGNED_BYTE,_t):a.texImage2D(ft+Dt,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,_t);return nt}let Z={};Z[a.TEXTURE_2D]=jt(a.TEXTURE_2D,a.TEXTURE_2D,1),Z[a.TEXTURE_CUBE_MAP]=jt(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[a.TEXTURE_2D_ARRAY]=jt(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),Z[a.TEXTURE_3D]=jt(a.TEXTURE_3D,a.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),tt(a.DEPTH_TEST),r.setFunc(Is),te(!1),Re(Uc),tt(a.CULL_FACE),le(Qi);function tt(F){h[F]!==!0&&(a.enable(F),h[F]=!0)}function wt(F){h[F]!==!1&&(a.disable(F),h[F]=!1)}function Nt(F,ft){return d[F]!==ft?(a.bindFramebuffer(F,ft),d[F]=ft,F===a.DRAW_FRAMEBUFFER&&(d[a.FRAMEBUFFER]=ft),F===a.FRAMEBUFFER&&(d[a.DRAW_FRAMEBUFFER]=ft),!0):!1}function bt(F,ft){let Q=m,pt=!1;if(F){Q=f.get(ft),Q===void 0&&(Q=[],f.set(ft,Q));let _t=F.textures;if(Q.length!==_t.length||Q[0]!==a.COLOR_ATTACHMENT0){for(let nt=0,Dt=_t.length;nt<Dt;nt++)Q[nt]=a.COLOR_ATTACHMENT0+nt;Q.length=_t.length,pt=!0}}else Q[0]!==a.BACK&&(Q[0]=a.BACK,pt=!0);pt&&a.drawBuffers(Q)}function qt(F){return x!==F?(a.useProgram(F),x=F,!0):!1}let ze={[Qn]:a.FUNC_ADD,[Lu]:a.FUNC_SUBTRACT,[zu]:a.FUNC_REVERSE_SUBTRACT};ze[Du]=a.MIN,ze[Nu]=a.MAX;let Zt={[Uu]:a.ZERO,[Fu]:a.ONE,[Bu]:a.SRC_COLOR,[kc]:a.SRC_ALPHA,[Wu]:a.SRC_ALPHA_SATURATE,[Gu]:a.DST_COLOR,[Ou]:a.DST_ALPHA,[ku]:a.ONE_MINUS_SRC_COLOR,[Oc]:a.ONE_MINUS_SRC_ALPHA,[Vu]:a.ONE_MINUS_DST_COLOR,[Hu]:a.ONE_MINUS_DST_ALPHA,[qu]:a.CONSTANT_COLOR,[Xu]:a.ONE_MINUS_CONSTANT_COLOR,[Yu]:a.CONSTANT_ALPHA,[$u]:a.ONE_MINUS_CONSTANT_ALPHA};function le(F,ft,Q,pt,_t,nt,Dt,At,we,pe){if(F===Qi){g===!0&&(wt(a.BLEND),g=!1);return}if(g===!1&&(tt(a.BLEND),g=!0),F!==Iu){if(F!==p||pe!==R){if((y!==Qn||S!==Qn)&&(a.blendEquation(a.FUNC_ADD),y=Qn,S=Qn),pe)switch(F){case Un:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case pn:a.blendFunc(a.ONE,a.ONE);break;case Fc:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case Bc:a.blendFuncSeparate(a.DST_COLOR,a.ONE_MINUS_SRC_ALPHA,a.ZERO,a.ONE);break;default:kt("WebGLState: Invalid blending: ",F);break}else switch(F){case Un:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case pn:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE,a.ONE,a.ONE);break;case Fc:kt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Bc:kt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:kt("WebGLState: Invalid blending: ",F);break}M=null,v=null,b=null,E=null,_.set(0,0,0),T=0,p=F,R=pe}return}_t=_t||ft,nt=nt||Q,Dt=Dt||pt,(ft!==y||_t!==S)&&(a.blendEquationSeparate(ze[ft],ze[_t]),y=ft,S=_t),(Q!==M||pt!==v||nt!==b||Dt!==E)&&(a.blendFuncSeparate(Zt[Q],Zt[pt],Zt[nt],Zt[Dt]),M=Q,v=pt,b=nt,E=Dt),(At.equals(_)===!1||we!==T)&&(a.blendColor(At.r,At.g,At.b,we),_.copy(At),T=we),p=F,R=!1}function Se(F,ft){F.side===Qe?wt(a.CULL_FACE):tt(a.CULL_FACE);let Q=F.side===ii;ft&&(Q=!Q),te(Q),F.blending===Un&&F.transparent===!1?le(Qi):le(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),r.setFunc(F.depthFunc),r.setTest(F.depthTest),r.setMask(F.depthWrite),s.setMask(F.colorWrite);let pt=F.stencilWrite;o.setTest(pt),pt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),xi(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?tt(a.SAMPLE_ALPHA_TO_COVERAGE):wt(a.SAMPLE_ALPHA_TO_COVERAGE)}function te(F){C!==F&&(F?a.frontFace(a.CW):a.frontFace(a.CCW),C=F)}function Re(F){F!==Ru?(tt(a.CULL_FACE),F!==L&&(F===Uc?a.cullFace(a.BACK):F===Cu?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):wt(a.CULL_FACE),L=F}function Je(F){F!==z&&(k&&a.lineWidth(F),z=F)}function xi(F,ft,Q){F?(tt(a.POLYGON_OFFSET_FILL),(P!==ft||D!==Q)&&(P=ft,D=Q,r.getReversed()&&(ft=-ft),a.polygonOffset(ft,Q))):wt(a.POLYGON_OFFSET_FILL)}function Pe(F){F?tt(a.SCISSOR_TEST):wt(a.SCISSOR_TEST)}function Ue(F){F===void 0&&(F=a.TEXTURE0+O-1),Y!==F&&(a.activeTexture(F),Y=F)}function B(F,ft,Q){Q===void 0&&(Y===null?Q=a.TEXTURE0+O-1:Q=Y);let pt=j[Q];pt===void 0&&(pt={type:void 0,texture:void 0},j[Q]=pt),(pt.type!==F||pt.texture!==ft)&&(Y!==Q&&(a.activeTexture(Q),Y=Q),a.bindTexture(F,ft||Z[F]),pt.type=F,pt.texture=ft)}function si(){let F=j[Y];F!==void 0&&F.type!==void 0&&(a.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function xe(){try{a.compressedTexImage2D(...arguments)}catch(F){kt("WebGLState:",F)}}function I(){try{a.compressedTexImage3D(...arguments)}catch(F){kt("WebGLState:",F)}}function w(){try{a.texSubImage2D(...arguments)}catch(F){kt("WebGLState:",F)}}function H(){try{a.texSubImage3D(...arguments)}catch(F){kt("WebGLState:",F)}}function q(){try{a.compressedTexSubImage2D(...arguments)}catch(F){kt("WebGLState:",F)}}function J(){try{a.compressedTexSubImage3D(...arguments)}catch(F){kt("WebGLState:",F)}}function rt(){try{a.texStorage2D(...arguments)}catch(F){kt("WebGLState:",F)}}function ct(){try{a.texStorage3D(...arguments)}catch(F){kt("WebGLState:",F)}}function K(){try{a.texImage2D(...arguments)}catch(F){kt("WebGLState:",F)}}function et(){try{a.texImage3D(...arguments)}catch(F){kt("WebGLState:",F)}}function ut(F){return u[F]!==void 0?u[F]:a.getParameter(F)}function It(F,ft){u[F]!==ft&&(a.pixelStorei(F,ft),u[F]=ft)}function gt(F){Gt.equals(F)===!1&&(a.scissor(F.x,F.y,F.z,F.w),Gt.copy(F))}function dt(F){Xt.equals(F)===!1&&(a.viewport(F.x,F.y,F.z,F.w),Xt.copy(F))}function Lt(F,ft){let Q=c.get(ft);Q===void 0&&(Q=new WeakMap,c.set(ft,Q));let pt=Q.get(F);pt===void 0&&(pt=a.getUniformBlockIndex(ft,F.name),Q.set(F,pt))}function Ut(F,ft){let pt=c.get(ft).get(F);l.get(ft)!==pt&&(a.uniformBlockBinding(ft,pt,F.__bindingPointIndex),l.set(ft,pt))}function Wt(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),r.setReversed(!1),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),a.pixelStorei(a.PACK_ALIGNMENT,4),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,!1),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,a.BROWSER_DEFAULT_WEBGL),a.pixelStorei(a.PACK_ROW_LENGTH,0),a.pixelStorei(a.PACK_SKIP_PIXELS,0),a.pixelStorei(a.PACK_SKIP_ROWS,0),a.pixelStorei(a.UNPACK_ROW_LENGTH,0),a.pixelStorei(a.UNPACK_IMAGE_HEIGHT,0),a.pixelStorei(a.UNPACK_SKIP_PIXELS,0),a.pixelStorei(a.UNPACK_SKIP_ROWS,0),a.pixelStorei(a.UNPACK_SKIP_IMAGES,0),h={},u={},Y=null,j={},d={},f=new WeakMap,m=[],x=null,g=!1,p=null,y=null,M=null,v=null,S=null,b=null,E=null,_=new Ct(0,0,0),T=0,R=!1,C=null,L=null,z=null,P=null,D=null,Gt.set(0,0,a.canvas.width,a.canvas.height),Xt.set(0,0,a.canvas.width,a.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:tt,disable:wt,bindFramebuffer:Nt,drawBuffers:bt,useProgram:qt,setBlending:le,setMaterial:Se,setFlipSided:te,setCullFace:Re,setLineWidth:Je,setPolygonOffset:xi,setScissorTest:Pe,activeTexture:Ue,bindTexture:B,unbindTexture:si,compressedTexImage2D:xe,compressedTexImage3D:I,texImage2D:K,texImage3D:et,pixelStorei:It,getParameter:ut,updateUBOMapping:Lt,uniformBlockBinding:Ut,texStorage2D:rt,texStorage3D:ct,texSubImage2D:w,texSubImage3D:H,compressedTexSubImage2D:q,compressedTexSubImage3D:J,scissor:gt,viewport:dt,reset:Wt}}function Hx(a,t,e,i,n,s,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ht,h=new WeakMap,u=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(I,w){return m?new OffscreenCanvas(I,w):xr("canvas")}function g(I,w,H){let q=1,J=xe(I);if((J.width>H||J.height>H)&&(q=H/Math.max(J.width,J.height)),q<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let rt=Math.floor(q*J.width),ct=Math.floor(q*J.height);d===void 0&&(d=x(rt,ct));let K=w?x(rt,ct):d;return K.width=rt,K.height=ct,K.getContext("2d").drawImage(I,0,0,rt,ct),Ft("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+rt+"x"+ct+")."),K}else return"data"in I&&Ft("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),I;return I}function p(I){return I.generateMipmaps}function y(I){a.generateMipmap(I)}function M(I){return I.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?a.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?a.TEXTURE_2D_ARRAY:a.TEXTURE_2D}function v(I,w,H,q,J,rt=!1){if(I!==null){if(a[I]!==void 0)return a[I];Ft("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ct;q&&(ct=t.get("EXT_texture_norm16"),ct||Ft("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=w;if(w===a.RED&&(H===a.FLOAT&&(K=a.R32F),H===a.HALF_FLOAT&&(K=a.R16F),H===a.UNSIGNED_BYTE&&(K=a.R8),H===a.UNSIGNED_SHORT&&ct&&(K=ct.R16_EXT),H===a.SHORT&&ct&&(K=ct.R16_SNORM_EXT)),w===a.RED_INTEGER&&(H===a.UNSIGNED_BYTE&&(K=a.R8UI),H===a.UNSIGNED_SHORT&&(K=a.R16UI),H===a.UNSIGNED_INT&&(K=a.R32UI),H===a.BYTE&&(K=a.R8I),H===a.SHORT&&(K=a.R16I),H===a.INT&&(K=a.R32I)),w===a.RG&&(H===a.FLOAT&&(K=a.RG32F),H===a.HALF_FLOAT&&(K=a.RG16F),H===a.UNSIGNED_BYTE&&(K=a.RG8),H===a.UNSIGNED_SHORT&&ct&&(K=ct.RG16_EXT),H===a.SHORT&&ct&&(K=ct.RG16_SNORM_EXT)),w===a.RG_INTEGER&&(H===a.UNSIGNED_BYTE&&(K=a.RG8UI),H===a.UNSIGNED_SHORT&&(K=a.RG16UI),H===a.UNSIGNED_INT&&(K=a.RG32UI),H===a.BYTE&&(K=a.RG8I),H===a.SHORT&&(K=a.RG16I),H===a.INT&&(K=a.RG32I)),w===a.RGB_INTEGER&&(H===a.UNSIGNED_BYTE&&(K=a.RGB8UI),H===a.UNSIGNED_SHORT&&(K=a.RGB16UI),H===a.UNSIGNED_INT&&(K=a.RGB32UI),H===a.BYTE&&(K=a.RGB8I),H===a.SHORT&&(K=a.RGB16I),H===a.INT&&(K=a.RGB32I)),w===a.RGBA_INTEGER&&(H===a.UNSIGNED_BYTE&&(K=a.RGBA8UI),H===a.UNSIGNED_SHORT&&(K=a.RGBA16UI),H===a.UNSIGNED_INT&&(K=a.RGBA32UI),H===a.BYTE&&(K=a.RGBA8I),H===a.SHORT&&(K=a.RGBA16I),H===a.INT&&(K=a.RGBA32I)),w===a.RGB&&(H===a.UNSIGNED_SHORT&&ct&&(K=ct.RGB16_EXT),H===a.SHORT&&ct&&(K=ct.RGB16_SNORM_EXT),H===a.UNSIGNED_INT_5_9_9_9_REV&&(K=a.RGB9_E5),H===a.UNSIGNED_INT_10F_11F_11F_REV&&(K=a.R11F_G11F_B10F)),w===a.RGBA){let et=rt?gr:ee.getTransfer(J);H===a.FLOAT&&(K=a.RGBA32F),H===a.HALF_FLOAT&&(K=a.RGBA16F),H===a.UNSIGNED_BYTE&&(K=et===ge?a.SRGB8_ALPHA8:a.RGBA8),H===a.UNSIGNED_SHORT&&ct&&(K=ct.RGBA16_EXT),H===a.SHORT&&ct&&(K=ct.RGBA16_SNORM_EXT),H===a.UNSIGNED_SHORT_4_4_4_4&&(K=a.RGBA4),H===a.UNSIGNED_SHORT_5_5_5_1&&(K=a.RGB5_A1)}return(K===a.R16F||K===a.R32F||K===a.RG16F||K===a.RG32F||K===a.RGBA16F||K===a.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function S(I,w){let H;return I?w===null||w===ki||w===Ws?H=a.DEPTH24_STENCIL8:w===Ei?H=a.DEPTH32F_STENCIL8:w===Vs&&(H=a.DEPTH24_STENCIL8,Ft("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===ki||w===Ws?H=a.DEPTH_COMPONENT24:w===Ei?H=a.DEPTH_COMPONENT32F:w===Vs&&(H=a.DEPTH_COMPONENT16),H}function b(I,w){return p(I)===!0||I.isFramebufferTexture&&I.minFilter!==ke&&I.minFilter!==Oe?Math.log2(Math.max(w.width,w.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?w.mipmaps.length:1}function E(I){let w=I.target;w.removeEventListener("dispose",E),T(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&u.delete(w)}function _(I){let w=I.target;w.removeEventListener("dispose",_),C(w)}function T(I){let w=i.get(I);if(w.__webglInit===void 0)return;let H=I.source,q=f.get(H);if(q){let J=q[w.__cacheKey];J.usedTimes--,J.usedTimes===0&&R(I),Object.keys(q).length===0&&f.delete(H)}i.remove(I)}function R(I){let w=i.get(I);a.deleteTexture(w.__webglTexture);let H=I.source,q=f.get(H);delete q[w.__cacheKey],r.memory.textures--}function C(I){let w=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(w.__webglFramebuffer[q]))for(let J=0;J<w.__webglFramebuffer[q].length;J++)a.deleteFramebuffer(w.__webglFramebuffer[q][J]);else a.deleteFramebuffer(w.__webglFramebuffer[q]);w.__webglDepthbuffer&&a.deleteRenderbuffer(w.__webglDepthbuffer[q])}else{if(Array.isArray(w.__webglFramebuffer))for(let q=0;q<w.__webglFramebuffer.length;q++)a.deleteFramebuffer(w.__webglFramebuffer[q]);else a.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&a.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&a.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let q=0;q<w.__webglColorRenderbuffer.length;q++)w.__webglColorRenderbuffer[q]&&a.deleteRenderbuffer(w.__webglColorRenderbuffer[q]);w.__webglDepthRenderbuffer&&a.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let H=I.textures;for(let q=0,J=H.length;q<J;q++){let rt=i.get(H[q]);rt.__webglTexture&&(a.deleteTexture(rt.__webglTexture),r.memory.textures--),i.remove(H[q])}i.remove(I)}let L=0;function z(){L=0}function P(){return L}function D(I){L=I}function O(){let I=L;return I>=n.maxTextures&&Ft("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+n.maxTextures),L+=1,I}function k(I){let w=[];return w.push(I.wrapS),w.push(I.wrapT),w.push(I.wrapR||0),w.push(I.magFilter),w.push(I.minFilter),w.push(I.anisotropy),w.push(I.internalFormat),w.push(I.format),w.push(I.type),w.push(I.generateMipmaps),w.push(I.premultiplyAlpha),w.push(I.flipY),w.push(I.unpackAlignment),w.push(I.colorSpace),w.join()}function $(I,w){let H=i.get(I);if(I.isVideoTexture&&B(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&H.__version!==I.version){let q=I.image;if(q===null)Ft("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Ft("WebGLRenderer: Texture marked for update but image is incomplete");else{wt(H,I,w);return}}else I.isExternalTexture&&(H.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(a.TEXTURE_2D,H.__webglTexture,a.TEXTURE0+w)}function W(I,w){let H=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&H.__version!==I.version){wt(H,I,w);return}else I.isExternalTexture&&(H.__webglTexture=I.sourceTexture?I.sourceTexture:null);e.bindTexture(a.TEXTURE_2D_ARRAY,H.__webglTexture,a.TEXTURE0+w)}function Y(I,w){let H=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&H.__version!==I.version){wt(H,I,w);return}e.bindTexture(a.TEXTURE_3D,H.__webglTexture,a.TEXTURE0+w)}function j(I,w){let H=i.get(I);if(I.isCubeDepthTexture!==!0&&I.version>0&&H.__version!==I.version){Nt(H,I,w);return}e.bindTexture(a.TEXTURE_CUBE_MAP,H.__webglTexture,a.TEXTURE0+w)}let at={[Ls]:a.REPEAT,[Yi]:a.CLAMP_TO_EDGE,[Fa]:a.MIRRORED_REPEAT},ot={[ke]:a.NEAREST,[ju]:a.NEAREST_MIPMAP_NEAREST,[Br]:a.NEAREST_MIPMAP_LINEAR,[Oe]:a.LINEAR,[mo]:a.LINEAR_MIPMAP_NEAREST,[Bn]:a.LINEAR_MIPMAP_LINEAR},Gt={[ed]:a.NEVER,[ad]:a.ALWAYS,[id]:a.LESS,[tl]:a.LEQUAL,[nd]:a.EQUAL,[el]:a.GEQUAL,[sd]:a.GREATER,[rd]:a.NOTEQUAL};function Xt(I,w){if(w.type===Ei&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Oe||w.magFilter===mo||w.magFilter===Br||w.magFilter===Bn||w.minFilter===Oe||w.minFilter===mo||w.minFilter===Br||w.minFilter===Bn)&&Ft("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),a.texParameteri(I,a.TEXTURE_WRAP_S,at[w.wrapS]),a.texParameteri(I,a.TEXTURE_WRAP_T,at[w.wrapT]),(I===a.TEXTURE_3D||I===a.TEXTURE_2D_ARRAY)&&a.texParameteri(I,a.TEXTURE_WRAP_R,at[w.wrapR]),a.texParameteri(I,a.TEXTURE_MAG_FILTER,ot[w.magFilter]),a.texParameteri(I,a.TEXTURE_MIN_FILTER,ot[w.minFilter]),w.compareFunction&&(a.texParameteri(I,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(I,a.TEXTURE_COMPARE_FUNC,Gt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===ke||w.minFilter!==Br&&w.minFilter!==Bn||w.type===Ei&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");a.texParameterf(I,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,n.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function jt(I,w){let H=!1;I.__webglInit===void 0&&(I.__webglInit=!0,w.addEventListener("dispose",E));let q=w.source,J=f.get(q);J===void 0&&(J={},f.set(q,J));let rt=k(w);if(rt!==I.__cacheKey){J[rt]===void 0&&(J[rt]={texture:a.createTexture(),usedTimes:0},r.memory.textures++,H=!0),J[rt].usedTimes++;let ct=J[I.__cacheKey];ct!==void 0&&(J[I.__cacheKey].usedTimes--,ct.usedTimes===0&&R(w)),I.__cacheKey=rt,I.__webglTexture=J[rt].texture}return H}function Z(I,w,H){return Math.floor(Math.floor(I/H)/w)}function tt(I,w,H,q){let rt=I.updateRanges;if(rt.length===0)e.texSubImage2D(a.TEXTURE_2D,0,0,0,w.width,w.height,H,q,w.data);else{rt.sort((It,gt)=>It.start-gt.start);let ct=0;for(let It=1;It<rt.length;It++){let gt=rt[ct],dt=rt[It],Lt=gt.start+gt.count,Ut=Z(dt.start,w.width,4),Wt=Z(gt.start,w.width,4);dt.start<=Lt+1&&Ut===Wt&&Z(dt.start+dt.count-1,w.width,4)===Ut?gt.count=Math.max(gt.count,dt.start+dt.count-gt.start):(++ct,rt[ct]=dt)}rt.length=ct+1;let K=e.getParameter(a.UNPACK_ROW_LENGTH),et=e.getParameter(a.UNPACK_SKIP_PIXELS),ut=e.getParameter(a.UNPACK_SKIP_ROWS);e.pixelStorei(a.UNPACK_ROW_LENGTH,w.width);for(let It=0,gt=rt.length;It<gt;It++){let dt=rt[It],Lt=Math.floor(dt.start/4),Ut=Math.ceil(dt.count/4),Wt=Lt%w.width,F=Math.floor(Lt/w.width),ft=Ut,Q=1;e.pixelStorei(a.UNPACK_SKIP_PIXELS,Wt),e.pixelStorei(a.UNPACK_SKIP_ROWS,F),e.texSubImage2D(a.TEXTURE_2D,0,Wt,F,ft,Q,H,q,w.data)}I.clearUpdateRanges(),e.pixelStorei(a.UNPACK_ROW_LENGTH,K),e.pixelStorei(a.UNPACK_SKIP_PIXELS,et),e.pixelStorei(a.UNPACK_SKIP_ROWS,ut)}}function wt(I,w,H){let q=a.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(q=a.TEXTURE_2D_ARRAY),w.isData3DTexture&&(q=a.TEXTURE_3D);let J=jt(I,w),rt=w.source;e.bindTexture(q,I.__webglTexture,a.TEXTURE0+H);let ct=i.get(rt);if(rt.version!==ct.__version||J===!0){if(e.activeTexture(a.TEXTURE0+H),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){let Q=ee.getPrimaries(ee.workingColorSpace),pt=w.colorSpace===mn?null:ee.getPrimaries(w.colorSpace),_t=w.colorSpace===mn||Q===pt?a.NONE:a.BROWSER_DEFAULT_WEBGL;e.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t)}e.pixelStorei(a.UNPACK_ALIGNMENT,w.unpackAlignment);let et=g(w.image,!1,n.maxTextureSize);et=si(w,et);let ut=s.convert(w.format,w.colorSpace),It=s.convert(w.type),gt=v(w.internalFormat,ut,It,w.normalized,w.colorSpace,w.isVideoTexture);Xt(q,w);let dt,Lt=w.mipmaps,Ut=w.isVideoTexture!==!0,Wt=ct.__version===void 0||J===!0,F=rt.dataReady,ft=b(w,et);if(w.isDepthTexture)gt=S(w.format===kn,w.type),Wt&&(Ut?e.texStorage2D(a.TEXTURE_2D,1,gt,et.width,et.height):e.texImage2D(a.TEXTURE_2D,0,gt,et.width,et.height,0,ut,It,null));else if(w.isDataTexture)if(Lt.length>0){Ut&&Wt&&e.texStorage2D(a.TEXTURE_2D,ft,gt,Lt[0].width,Lt[0].height);for(let Q=0,pt=Lt.length;Q<pt;Q++)dt=Lt[Q],Ut?F&&e.texSubImage2D(a.TEXTURE_2D,Q,0,0,dt.width,dt.height,ut,It,dt.data):e.texImage2D(a.TEXTURE_2D,Q,gt,dt.width,dt.height,0,ut,It,dt.data);w.generateMipmaps=!1}else Ut?(Wt&&e.texStorage2D(a.TEXTURE_2D,ft,gt,et.width,et.height),F&&tt(w,et,ut,It)):e.texImage2D(a.TEXTURE_2D,0,gt,et.width,et.height,0,ut,It,et.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ut&&Wt&&e.texStorage3D(a.TEXTURE_2D_ARRAY,ft,gt,Lt[0].width,Lt[0].height,et.depth);for(let Q=0,pt=Lt.length;Q<pt;Q++)if(dt=Lt[Q],w.format!==Ai)if(ut!==null)if(Ut){if(F)if(w.layerUpdates.size>0){let _t=ah(dt.width,dt.height,w.format,w.type);for(let nt of w.layerUpdates){let Dt=dt.data.subarray(nt*_t/dt.data.BYTES_PER_ELEMENT,(nt+1)*_t/dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,Q,0,0,nt,dt.width,dt.height,1,ut,Dt)}}else e.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,Q,0,0,0,dt.width,dt.height,et.depth,ut,dt.data)}else e.compressedTexImage3D(a.TEXTURE_2D_ARRAY,Q,gt,dt.width,dt.height,et.depth,0,dt.data,0,0);else Ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ut?F&&e.texSubImage3D(a.TEXTURE_2D_ARRAY,Q,0,0,0,dt.width,dt.height,et.depth,ut,It,dt.data):e.texImage3D(a.TEXTURE_2D_ARRAY,Q,gt,dt.width,dt.height,et.depth,0,ut,It,dt.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{Ut&&Wt&&e.texStorage2D(a.TEXTURE_2D,ft,gt,Lt[0].width,Lt[0].height);for(let Q=0,pt=Lt.length;Q<pt;Q++)dt=Lt[Q],w.format!==Ai?ut!==null?Ut?F&&e.compressedTexSubImage2D(a.TEXTURE_2D,Q,0,0,dt.width,dt.height,ut,dt.data):e.compressedTexImage2D(a.TEXTURE_2D,Q,gt,dt.width,dt.height,0,dt.data):Ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ut?F&&e.texSubImage2D(a.TEXTURE_2D,Q,0,0,dt.width,dt.height,ut,It,dt.data):e.texImage2D(a.TEXTURE_2D,Q,gt,dt.width,dt.height,0,ut,It,dt.data)}else if(w.isDataArrayTexture)if(Ut){if(Wt&&e.texStorage3D(a.TEXTURE_2D_ARRAY,ft,gt,et.width,et.height,et.depth),F)if(w.layerUpdates.size>0){let Q=ah(et.width,et.height,w.format,w.type);for(let pt of w.layerUpdates){let _t=et.data.subarray(pt*Q/et.data.BYTES_PER_ELEMENT,(pt+1)*Q/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,pt,et.width,et.height,1,ut,It,_t)}w.clearLayerUpdates()}else e.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,ut,It,et.data)}else e.texImage3D(a.TEXTURE_2D_ARRAY,0,gt,et.width,et.height,et.depth,0,ut,It,et.data);else if(w.isData3DTexture)Ut?(Wt&&e.texStorage3D(a.TEXTURE_3D,ft,gt,et.width,et.height,et.depth),F&&e.texSubImage3D(a.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,ut,It,et.data)):e.texImage3D(a.TEXTURE_3D,0,gt,et.width,et.height,et.depth,0,ut,It,et.data);else if(w.isFramebufferTexture){if(Wt)if(Ut)e.texStorage2D(a.TEXTURE_2D,ft,gt,et.width,et.height);else{let Q=et.width,pt=et.height;for(let _t=0;_t<ft;_t++)e.texImage2D(a.TEXTURE_2D,_t,gt,Q,pt,0,ut,It,null),Q>>=1,pt>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in a){let Q=a.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),et.parentNode!==Q){Q.appendChild(et),u.add(w),Q.onpaint=pt=>{let _t=pt.changedElements;for(let nt of u)_t.includes(nt.image)&&(nt.needsUpdate=!0)},Q.requestPaint();return}if(a.texElementImage2D.length===3)a.texElementImage2D(a.TEXTURE_2D,a.RGBA8,et);else{let _t=a.RGBA,nt=a.RGBA,Dt=a.UNSIGNED_BYTE;a.texElementImage2D(a.TEXTURE_2D,0,_t,nt,Dt,et)}a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE)}}else if(Lt.length>0){if(Ut&&Wt){let Q=xe(Lt[0]);e.texStorage2D(a.TEXTURE_2D,ft,gt,Q.width,Q.height)}for(let Q=0,pt=Lt.length;Q<pt;Q++)dt=Lt[Q],Ut?F&&e.texSubImage2D(a.TEXTURE_2D,Q,0,0,ut,It,dt):e.texImage2D(a.TEXTURE_2D,Q,gt,ut,It,dt);w.generateMipmaps=!1}else if(Ut){if(Wt){let Q=xe(et);e.texStorage2D(a.TEXTURE_2D,ft,gt,Q.width,Q.height)}F&&e.texSubImage2D(a.TEXTURE_2D,0,0,0,ut,It,et)}else e.texImage2D(a.TEXTURE_2D,0,gt,ut,It,et);p(w)&&y(q),ct.__version=rt.version,w.onUpdate&&w.onUpdate(w)}I.__version=w.version}function Nt(I,w,H){if(w.image.length!==6)return;let q=jt(I,w),J=w.source;e.bindTexture(a.TEXTURE_CUBE_MAP,I.__webglTexture,a.TEXTURE0+H);let rt=i.get(J);if(J.version!==rt.__version||q===!0){e.activeTexture(a.TEXTURE0+H);let ct=ee.getPrimaries(ee.workingColorSpace),K=w.colorSpace===mn?null:ee.getPrimaries(w.colorSpace),et=w.colorSpace===mn||ct===K?a.NONE:a.BROWSER_DEFAULT_WEBGL;e.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(a.UNPACK_ALIGNMENT,w.unpackAlignment),e.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);let ut=w.isCompressedTexture||w.image[0].isCompressedTexture,It=w.image[0]&&w.image[0].isDataTexture,gt=[];for(let nt=0;nt<6;nt++)!ut&&!It?gt[nt]=g(w.image[nt],!0,n.maxCubemapSize):gt[nt]=It?w.image[nt].image:w.image[nt],gt[nt]=si(w,gt[nt]);let dt=gt[0],Lt=s.convert(w.format,w.colorSpace),Ut=s.convert(w.type),Wt=v(w.internalFormat,Lt,Ut,w.normalized,w.colorSpace),F=w.isVideoTexture!==!0,ft=rt.__version===void 0||q===!0,Q=J.dataReady,pt=b(w,dt);Xt(a.TEXTURE_CUBE_MAP,w);let _t;if(ut){F&&ft&&e.texStorage2D(a.TEXTURE_CUBE_MAP,pt,Wt,dt.width,dt.height);for(let nt=0;nt<6;nt++){_t=gt[nt].mipmaps;for(let Dt=0;Dt<_t.length;Dt++){let At=_t[Dt];w.format!==Ai?Lt!==null?F?Q&&e.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt,0,0,At.width,At.height,Lt,At.data):e.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt,Wt,At.width,At.height,0,At.data):Ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?Q&&e.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt,0,0,At.width,At.height,Lt,Ut,At.data):e.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt,Wt,At.width,At.height,0,Lt,Ut,At.data)}}}else{if(_t=w.mipmaps,F&&ft){_t.length>0&&pt++;let nt=xe(gt[0]);e.texStorage2D(a.TEXTURE_CUBE_MAP,pt,Wt,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(It){F?Q&&e.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,gt[nt].width,gt[nt].height,Lt,Ut,gt[nt].data):e.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Wt,gt[nt].width,gt[nt].height,0,Lt,Ut,gt[nt].data);for(let Dt=0;Dt<_t.length;Dt++){let we=_t[Dt].image[nt].image;F?Q&&e.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt+1,0,0,we.width,we.height,Lt,Ut,we.data):e.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt+1,Wt,we.width,we.height,0,Lt,Ut,we.data)}}else{F?Q&&e.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Lt,Ut,gt[nt]):e.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Wt,Lt,Ut,gt[nt]);for(let Dt=0;Dt<_t.length;Dt++){let At=_t[Dt];F?Q&&e.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt+1,0,0,Lt,Ut,At.image[nt]):e.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Dt+1,Wt,Lt,Ut,At.image[nt])}}}p(w)&&y(a.TEXTURE_CUBE_MAP),rt.__version=J.version,w.onUpdate&&w.onUpdate(w)}I.__version=w.version}function bt(I,w,H,q,J,rt){let ct=s.convert(H.format,H.colorSpace),K=s.convert(H.type),et=v(H.internalFormat,ct,K,H.normalized,H.colorSpace),ut=i.get(w),It=i.get(H);if(It.__renderTarget=w,!ut.__hasExternalTextures){let gt=Math.max(1,w.width>>rt),dt=Math.max(1,w.height>>rt);J===a.TEXTURE_3D||J===a.TEXTURE_2D_ARRAY?e.texImage3D(J,rt,et,gt,dt,w.depth,0,ct,K,null):e.texImage2D(J,rt,et,gt,dt,0,ct,K,null)}e.bindFramebuffer(a.FRAMEBUFFER,I),Ue(w)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,q,J,It.__webglTexture,0,Pe(w)):(J===a.TEXTURE_2D||J>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,q,J,It.__webglTexture,rt),e.bindFramebuffer(a.FRAMEBUFFER,null)}function qt(I,w,H){if(a.bindRenderbuffer(a.RENDERBUFFER,I),w.depthBuffer){let q=w.depthTexture,J=q&&q.isDepthTexture?q.type:null,rt=S(w.stencilBuffer,J),ct=w.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;Ue(w)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Pe(w),rt,w.width,w.height):H?a.renderbufferStorageMultisample(a.RENDERBUFFER,Pe(w),rt,w.width,w.height):a.renderbufferStorage(a.RENDERBUFFER,rt,w.width,w.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,ct,a.RENDERBUFFER,I)}else{let q=w.textures;for(let J=0;J<q.length;J++){let rt=q[J],ct=s.convert(rt.format,rt.colorSpace),K=s.convert(rt.type),et=v(rt.internalFormat,ct,K,rt.normalized,rt.colorSpace);Ue(w)?o.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,Pe(w),et,w.width,w.height):H?a.renderbufferStorageMultisample(a.RENDERBUFFER,Pe(w),et,w.width,w.height):a.renderbufferStorage(a.RENDERBUFFER,et,w.width,w.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function ze(I,w,H){let q=w.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(a.FRAMEBUFFER,I),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let J=i.get(w.depthTexture);if(J.__renderTarget=w,(!J.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),q){if(J.__webglInit===void 0&&(J.__webglInit=!0,w.depthTexture.addEventListener("dispose",E)),J.__webglTexture===void 0){J.__webglTexture=a.createTexture(),e.bindTexture(a.TEXTURE_CUBE_MAP,J.__webglTexture),Xt(a.TEXTURE_CUBE_MAP,w.depthTexture);let ut=s.convert(w.depthTexture.format),It=s.convert(w.depthTexture.type),gt;w.depthTexture.format===$i?gt=a.DEPTH_COMPONENT24:w.depthTexture.format===kn&&(gt=a.DEPTH24_STENCIL8);for(let dt=0;dt<6;dt++)a.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,gt,w.width,w.height,0,ut,It,null)}}else $(w.depthTexture,0);let rt=J.__webglTexture,ct=Pe(w),K=q?a.TEXTURE_CUBE_MAP_POSITIVE_X+H:a.TEXTURE_2D,et=w.depthTexture.format===kn?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;if(w.depthTexture.format===$i)Ue(w)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,et,K,rt,0,ct):a.framebufferTexture2D(a.FRAMEBUFFER,et,K,rt,0);else if(w.depthTexture.format===kn)Ue(w)?o.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,et,K,rt,0,ct):a.framebufferTexture2D(a.FRAMEBUFFER,et,K,rt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Zt(I){let w=i.get(I),H=I.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==I.depthTexture){let q=I.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),q){let J=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,q.removeEventListener("dispose",J)};q.addEventListener("dispose",J),w.__depthDisposeCallback=J}w.__boundDepthTexture=q}if(I.depthTexture&&!w.__autoAllocateDepthBuffer)if(H)for(let q=0;q<6;q++)ze(w.__webglFramebuffer[q],I,q);else{let q=I.texture.mipmaps;q&&q.length>0?ze(w.__webglFramebuffer[0],I,0):ze(w.__webglFramebuffer,I,0)}else if(H){w.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(a.FRAMEBUFFER,w.__webglFramebuffer[q]),w.__webglDepthbuffer[q]===void 0)w.__webglDepthbuffer[q]=a.createRenderbuffer(),qt(w.__webglDepthbuffer[q],I,!1);else{let J=I.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,rt=w.__webglDepthbuffer[q];a.bindRenderbuffer(a.RENDERBUFFER,rt),a.framebufferRenderbuffer(a.FRAMEBUFFER,J,a.RENDERBUFFER,rt)}}else{let q=I.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(a.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(a.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=a.createRenderbuffer(),qt(w.__webglDepthbuffer,I,!1);else{let J=I.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,rt=w.__webglDepthbuffer;a.bindRenderbuffer(a.RENDERBUFFER,rt),a.framebufferRenderbuffer(a.FRAMEBUFFER,J,a.RENDERBUFFER,rt)}}e.bindFramebuffer(a.FRAMEBUFFER,null)}function le(I,w,H){let q=i.get(I);w!==void 0&&bt(q.__webglFramebuffer,I,I.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),H!==void 0&&Zt(I)}function Se(I){let w=I.texture,H=i.get(I),q=i.get(w);I.addEventListener("dispose",_);let J=I.textures,rt=I.isWebGLCubeRenderTarget===!0,ct=J.length>1;if(ct||(q.__webglTexture===void 0&&(q.__webglTexture=a.createTexture()),q.__version=w.version,r.memory.textures++),rt){H.__webglFramebuffer=[];for(let K=0;K<6;K++)if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer[K]=[];for(let et=0;et<w.mipmaps.length;et++)H.__webglFramebuffer[K][et]=a.createFramebuffer()}else H.__webglFramebuffer[K]=a.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer=[];for(let K=0;K<w.mipmaps.length;K++)H.__webglFramebuffer[K]=a.createFramebuffer()}else H.__webglFramebuffer=a.createFramebuffer();if(ct)for(let K=0,et=J.length;K<et;K++){let ut=i.get(J[K]);ut.__webglTexture===void 0&&(ut.__webglTexture=a.createTexture(),r.memory.textures++)}if(I.samples>0&&Ue(I)===!1){H.__webglMultisampledFramebuffer=a.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(a.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let K=0;K<J.length;K++){let et=J[K];H.__webglColorRenderbuffer[K]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,H.__webglColorRenderbuffer[K]);let ut=s.convert(et.format,et.colorSpace),It=s.convert(et.type),gt=v(et.internalFormat,ut,It,et.normalized,et.colorSpace,I.isXRRenderTarget===!0),dt=Pe(I);a.renderbufferStorageMultisample(a.RENDERBUFFER,dt,gt,I.width,I.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+K,a.RENDERBUFFER,H.__webglColorRenderbuffer[K])}a.bindRenderbuffer(a.RENDERBUFFER,null),I.depthBuffer&&(H.__webglDepthRenderbuffer=a.createRenderbuffer(),qt(H.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(a.FRAMEBUFFER,null)}}if(rt){e.bindTexture(a.TEXTURE_CUBE_MAP,q.__webglTexture),Xt(a.TEXTURE_CUBE_MAP,w);for(let K=0;K<6;K++)if(w.mipmaps&&w.mipmaps.length>0)for(let et=0;et<w.mipmaps.length;et++)bt(H.__webglFramebuffer[K][et],I,w,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+K,et);else bt(H.__webglFramebuffer[K],I,w,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);p(w)&&y(a.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){for(let K=0,et=J.length;K<et;K++){let ut=J[K],It=i.get(ut),gt=a.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(gt=I.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),e.bindTexture(gt,It.__webglTexture),Xt(gt,ut),bt(H.__webglFramebuffer,I,ut,a.COLOR_ATTACHMENT0+K,gt,0),p(ut)&&y(gt)}e.unbindTexture()}else{let K=a.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(K=I.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY),e.bindTexture(K,q.__webglTexture),Xt(K,w),w.mipmaps&&w.mipmaps.length>0)for(let et=0;et<w.mipmaps.length;et++)bt(H.__webglFramebuffer[et],I,w,a.COLOR_ATTACHMENT0,K,et);else bt(H.__webglFramebuffer,I,w,a.COLOR_ATTACHMENT0,K,0);p(w)&&y(K),e.unbindTexture()}I.depthBuffer&&Zt(I)}function te(I){let w=I.textures;for(let H=0,q=w.length;H<q;H++){let J=w[H];if(p(J)){let rt=M(I),ct=i.get(J).__webglTexture;e.bindTexture(rt,ct),y(rt),e.unbindTexture()}}}let Re=[],Je=[];function xi(I){if(I.samples>0){if(Ue(I)===!1){let w=I.textures,H=I.width,q=I.height,J=a.COLOR_BUFFER_BIT,rt=I.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,ct=i.get(I),K=w.length>1;if(K)for(let ut=0;ut<w.length;ut++)e.bindFramebuffer(a.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ut,a.RENDERBUFFER,null),e.bindFramebuffer(a.FRAMEBUFFER,ct.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+ut,a.TEXTURE_2D,null,0);e.bindFramebuffer(a.READ_FRAMEBUFFER,ct.__webglMultisampledFramebuffer);let et=I.texture.mipmaps;et&&et.length>0?e.bindFramebuffer(a.DRAW_FRAMEBUFFER,ct.__webglFramebuffer[0]):e.bindFramebuffer(a.DRAW_FRAMEBUFFER,ct.__webglFramebuffer);for(let ut=0;ut<w.length;ut++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(J|=a.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(J|=a.STENCIL_BUFFER_BIT)),K){a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,ct.__webglColorRenderbuffer[ut]);let It=i.get(w[ut]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,It,0)}a.blitFramebuffer(0,0,H,q,0,0,H,q,J,a.NEAREST),l===!0&&(Re.length=0,Je.length=0,Re.push(a.COLOR_ATTACHMENT0+ut),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&(Re.push(rt),Je.push(rt),a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,Je)),a.invalidateFramebuffer(a.READ_FRAMEBUFFER,Re))}if(e.bindFramebuffer(a.READ_FRAMEBUFFER,null),e.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),K)for(let ut=0;ut<w.length;ut++){e.bindFramebuffer(a.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ut,a.RENDERBUFFER,ct.__webglColorRenderbuffer[ut]);let It=i.get(w[ut]).__webglTexture;e.bindFramebuffer(a.FRAMEBUFFER,ct.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+ut,a.TEXTURE_2D,It,0)}e.bindFramebuffer(a.DRAW_FRAMEBUFFER,ct.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let w=I.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT;a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[w])}}}function Pe(I){return Math.min(n.maxSamples,I.samples)}function Ue(I){let w=i.get(I);return I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function B(I){let w=r.render.frame;h.get(I)!==w&&(h.set(I,w),I.update())}function si(I,w){let H=I.colorSpace,q=I.format,J=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||H!==mr&&H!==mn&&(ee.getTransfer(H)===ge?(q!==Ai||J!==ci)&&Ft("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):kt("WebGLTextures: Unsupported texture color space:",H)),w}function xe(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=z,this.getTextureUnits=P,this.setTextureUnits=D,this.setTexture2D=$,this.setTexture2DArray=W,this.setTexture3D=Y,this.setTextureCube=j,this.rebindTextures=le,this.setupRenderTarget=Se,this.updateRenderTargetMipmap=te,this.updateMultisampleRenderTarget=xi,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Ue,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Gx(a,t){function e(i,n=mn){let s,r=ee.getTransfer(n);if(i===ci)return a.UNSIGNED_BYTE;if(i===xo)return a.UNSIGNED_SHORT_4_4_4_4;if(i===vo)return a.UNSIGNED_SHORT_5_5_5_1;if(i===jc)return a.UNSIGNED_INT_5_9_9_9_REV;if(i===Kc)return a.UNSIGNED_INT_10F_11F_11F_REV;if(i===Zc)return a.BYTE;if(i===Jc)return a.SHORT;if(i===Vs)return a.UNSIGNED_SHORT;if(i===go)return a.INT;if(i===ki)return a.UNSIGNED_INT;if(i===Ei)return a.FLOAT;if(i===Si)return a.HALF_FLOAT;if(i===Qc)return a.ALPHA;if(i===th)return a.RGB;if(i===Ai)return a.RGBA;if(i===$i)return a.DEPTH_COMPONENT;if(i===kn)return a.DEPTH_STENCIL;if(i===yo)return a.RED;if(i===_o)return a.RED_INTEGER;if(i===On)return a.RG;if(i===bo)return a.RG_INTEGER;if(i===Mo)return a.RGBA_INTEGER;if(i===kr||i===Or||i===Hr||i===Gr)if(r===ge)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===kr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Or)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Gr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===kr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Or)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Hr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Gr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===So||i===wo||i===To||i===Eo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===So)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===wo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===To)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Eo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ao||i===Ro||i===Co||i===Po||i===Io||i===Vr||i===Lo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ao||i===Ro)return r===ge?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Co)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Po)return s.COMPRESSED_R11_EAC;if(i===Io)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Vr)return s.COMPRESSED_RG11_EAC;if(i===Lo)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===zo||i===Do||i===No||i===Uo||i===Fo||i===Bo||i===ko||i===Oo||i===Ho||i===Go||i===Vo||i===Wo||i===qo||i===Xo)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===zo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Do)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===No)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Uo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Fo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Bo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ko)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Oo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ho)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Go)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Vo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Wo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===qo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xo)return r===ge?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Yo||i===$o||i===Zo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Yo)return r===ge?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===$o)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Zo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Jo||i===jo||i===Wr||i===Ko)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Jo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===jo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ko)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ws?a.UNSIGNED_INT_24_8:a[i]!==void 0?a[i]:null}return{convert:e}}var Vx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Wx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Th=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new Rr(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new Ie({vertexShader:Vx,fragmentShader:Wx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new xt(new ei(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Eh=class extends Zi{constructor(t,e){super();let i=this,n=null,s=1,r=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new Th,p={},y=e.getContextAttributes(),M=null,v=null,S=[],b=[],E=new Ht,_=null,T=null,R=new li;R.viewport=new Ce;let C=new li;C.viewport=new Ce;let L=[R,C],z=new co,P=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let tt=S[Z];return tt===void 0&&(tt=new Us,S[Z]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Z){let tt=S[Z];return tt===void 0&&(tt=new Us,S[Z]=tt),tt.getGripSpace()},this.getHand=function(Z){let tt=S[Z];return tt===void 0&&(tt=new Us,S[Z]=tt),tt.getHandSpace()};function O(Z){let tt=b.indexOf(Z.inputSource);if(tt===-1)return;let wt=S[tt];wt!==void 0&&(wt.update(Z.inputSource,Z.frame,c||r),wt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function k(){n.removeEventListener("select",O),n.removeEventListener("selectstart",O),n.removeEventListener("selectend",O),n.removeEventListener("squeeze",O),n.removeEventListener("squeezestart",O),n.removeEventListener("squeezeend",O),n.removeEventListener("end",k),n.removeEventListener("inputsourceschange",$);for(let Z=0;Z<S.length;Z++){let tt=b[Z];tt!==null&&(b[Z]=null,S[Z].disconnect(tt))}P=null,D=null,g.reset();for(let Z in p)delete p[Z];if(t.setRenderTarget(M),f=null,d=null,u=null,n=null,v=null,jt.stop(),i.isPresenting=!1,t.setPixelRatio(_),t.setSize(E.width,E.height,!1),T!==null){let Z=T.camera;Z.fov=T.fov,Z.zoom=T.zoom,Z.updateProjectionMatrix(),T=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,i.isPresenting===!0&&Ft("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,i.isPresenting===!0&&Ft("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(n,e)),u},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(Z){if(n=Z,n!==null){if(M=t.getRenderTarget(),n.addEventListener("select",O),n.addEventListener("selectstart",O),n.addEventListener("selectend",O),n.addEventListener("squeeze",O),n.addEventListener("squeezestart",O),n.addEventListener("squeezeend",O),n.addEventListener("end",k),n.addEventListener("inputsourceschange",$),y.xrCompatible!==!0&&await e.makeXRCompatible(),_=t.getPixelRatio(),t.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let wt=null,Nt=null,bt=null;y.depth&&(bt=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,wt=y.stencil?kn:$i,Nt=y.stencil?Ws:ki);let qt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:s};u=this.getBinding(),d=u.createProjectionLayer(qt),n.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new Ke(d.textureWidth,d.textureHeight,{format:Ai,type:ci,depthTexture:new Pn(d.textureWidth,d.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,wt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let wt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(n,e,wt),n.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Ke(f.framebufferWidth,f.framebufferHeight,{format:Ai,type:ci,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await n.requestReferenceSpace(o),jt.setContext(n),jt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function $(Z){for(let tt=0;tt<Z.removed.length;tt++){let wt=Z.removed[tt],Nt=b.indexOf(wt);Nt>=0&&(b[Nt]=null,S[Nt].disconnect(wt))}for(let tt=0;tt<Z.added.length;tt++){let wt=Z.added[tt],Nt=b.indexOf(wt);if(Nt===-1){for(let qt=0;qt<S.length;qt++)if(qt>=b.length){b.push(wt),Nt=qt;break}else if(b[qt]===null){b[qt]=wt,Nt=qt;break}if(Nt===-1)break}let bt=S[Nt];bt&&bt.connect(wt)}}let W=new N,Y=new N;function j(Z,tt,wt){W.setFromMatrixPosition(tt.matrixWorld),Y.setFromMatrixPosition(wt.matrixWorld);let Nt=W.distanceTo(Y),bt=tt.projectionMatrix.elements,qt=wt.projectionMatrix.elements,ze=bt[14]/(bt[10]-1),Zt=bt[14]/(bt[10]+1),le=(bt[9]+1)/bt[5],Se=(bt[9]-1)/bt[5],te=(bt[8]-1)/bt[0],Re=(qt[8]+1)/qt[0],Je=ze*te,xi=ze*Re,Pe=Nt/(-te+Re),Ue=Pe*-te;if(tt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ue),Z.translateZ(Pe),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),bt[10]===-1)Z.projectionMatrix.copy(tt.projectionMatrix),Z.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let B=ze+Pe,si=Zt+Pe,xe=Je-Ue,I=xi+(Nt-Ue),w=le*Zt/si*B,H=Se*Zt/si*B;Z.projectionMatrix.makePerspective(xe,I,w,H,B,si),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function at(Z,tt){tt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(tt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(n===null)return;let tt=Z.near,wt=Z.far;g.texture!==null&&(g.depthNear>0&&(tt=g.depthNear),g.depthFar>0&&(wt=g.depthFar)),z.near=C.near=R.near=tt,z.far=C.far=R.far=wt,(P!==z.near||D!==z.far)&&(n.updateRenderState({depthNear:z.near,depthFar:z.far}),P=z.near,D=z.far),z.layers.mask=Z.layers.mask|6,R.layers.mask=z.layers.mask&-5,C.layers.mask=z.layers.mask&-3;let Nt=Z.parent,bt=z.cameras;at(z,Nt);for(let qt=0;qt<bt.length;qt++)at(bt[qt],Nt);bt.length===2?j(z,R,C):z.projectionMatrix.copy(R.projectionMatrix),T===null&&Z.isPerspectiveCamera&&(T={camera:Z,fov:Z.fov,zoom:Z.zoom}),ot(Z,z,Nt)};function ot(Z,tt,wt){wt===null?Z.matrix.copy(tt.matrixWorld):(Z.matrix.copy(wt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(tt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(tt.projectionMatrix),Z.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ka*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(z)},this.getCameraTexture=function(Z){return p[Z]};let Gt=null;function Xt(Z,tt){if(h=tt.getViewerPose(c||r),m=tt,h!==null){let wt=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Nt=!1;wt.length!==z.cameras.length&&(z.cameras.length=0,Nt=!0);for(let Zt=0;Zt<wt.length;Zt++){let le=wt[Zt],Se=null;if(f!==null)Se=f.getViewport(le);else{let Re=u.getViewSubImage(d,le);Se=Re.viewport,Zt===0&&(t.setRenderTargetTextures(v,Re.colorTexture,Re.depthStencilTexture),t.setRenderTarget(v))}let te=L[Zt];te===void 0&&(te=new li,te.layers.enable(Zt),te.viewport=new Ce,L[Zt]=te),te.matrix.fromArray(le.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(le.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(Se.x,Se.y,Se.width,Se.height),Zt===0&&(z.matrix.copy(te.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Nt===!0&&z.cameras.push(te)}let bt=n.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&x){u=i.getBinding();let Zt=u.getDepthInformation(wt[0]);Zt&&Zt.isValid&&Zt.texture&&g.init(Zt,n.renderState)}if(bt&&bt.includes("camera-access")&&x){t.state.unbindTexture(),u=i.getBinding();for(let Zt=0;Zt<wt.length;Zt++){let le=wt[Zt].camera;if(le){let Se=p[le];Se||(Se=new Rr,p[le]=Se);let te=u.getCameraImage(le);Se.sourceTexture=te}}}}for(let wt=0;wt<S.length;wt++){let Nt=b[wt],bt=S[wt];Nt!==null&&bt!==void 0&&bt.update(Nt,tt,c||r)}Gt&&Gt(Z,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),m=null}let jt=new Ud;jt.setAnimationLoop(Xt),this.setAnimationLoop=function(Z){Gt=Z},this.dispose=function(){}}},qx=new de,Gd=new Vt;Gd.set(-1,0,0,0,1,0,0,0,1);function Xx(a,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,nh(a)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function n(g,p,y,M,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(g,p):p.isMeshLambertMaterial?(s(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(g,p),u(g,p)):p.isMeshPhongMaterial?(s(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),x(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(r(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,y,M):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===ii&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===ii&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let y=t.get(p),M=y.envMap,v=y.envMapRotation;M&&(g.envMap.value=M,g.envMapRotation.value.setFromMatrix4(qx.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Gd),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function r(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,M){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=M*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ii&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let y=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Yx(a,t,e,i){let n={},s={},r=[],o=a.getParameter(a.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){let b=S.program;i.uniformBlockBinding(v,b)}function c(v,S){let b=n[v.id];b===void 0&&(g(v),b=h(v),n[v.id]=b,v.addEventListener("dispose",y));let E=S.program;i.updateUBOMapping(v,E);let _=t.render.frame;s[v.id]!==_&&(d(v),s[v.id]=_)}function h(v){let S=u();v.__bindingPointIndex=S;let b=a.createBuffer(),E=v.__size,_=v.usage;return a.bindBuffer(a.UNIFORM_BUFFER,b),a.bufferData(a.UNIFORM_BUFFER,E,_),a.bindBuffer(a.UNIFORM_BUFFER,null),a.bindBufferBase(a.UNIFORM_BUFFER,S,b),b}function u(){for(let v=0;v<o;v++)if(r.indexOf(v)===-1)return r.push(v),v;return kt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let S=n[v.id],b=v.uniforms,E=v.__cache;a.bindBuffer(a.UNIFORM_BUFFER,S);for(let _=0,T=b.length;_<T;_++){let R=b[_];if(Array.isArray(R))for(let C=0,L=R.length;C<L;C++)f(R[C],_,C,E);else f(R,_,0,E)}a.bindBuffer(a.UNIFORM_BUFFER,null)}function f(v,S,b,E){if(x(v,S,b,E)===!0){let _=v.__offset,T=v.value;if(Array.isArray(T)){let R=0;for(let C=0;C<T.length;C++){let L=T[C],z=p(L);m(L,v.__data,R),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(R+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(T,v.__data,0);a.bufferSubData(a.UNIFORM_BUFFER,_,v.__data)}}function m(v,S,b){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,b)}function x(v,S,b,E){let _=v.value,T=S+"_"+b;if(E[T]===void 0)return typeof _=="number"||typeof _=="boolean"?E[T]=_:ArrayBuffer.isView(_)?E[T]=_.slice():E[T]=_.clone(),!0;{let R=E[T];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return E[T]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function g(v){let S=v.uniforms,b=0,E=16;for(let T=0,R=S.length;T<R;T++){let C=Array.isArray(S[T])?S[T]:[S[T]];for(let L=0,z=C.length;L<z;L++){let P=C[L],D=Array.isArray(P.value)?P.value:[P.value];for(let O=0,k=D.length;O<k;O++){let $=D[O],W=p($),Y=b%E,j=Y%W.boundary,at=Y+j;b+=j,at!==0&&E-at<W.storage&&(b+=E-at),P.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=b,b+=W.storage}}}let _=b%E;return _>0&&(b+=E-_),v.__size=b,v.__cache={},this}function p(v){let S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?Ft("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):Ft("WebGLRenderer: Unsupported uniform value type.",v),S}function y(v){let S=v.target;S.removeEventListener("dispose",y);let b=r.indexOf(S.__bindingPointIndex);r.splice(b,1),a.deleteBuffer(n[S.id]),delete n[S.id],delete s[S.id]}function M(){for(let v in n)a.deleteBuffer(n[v]);r=[],n={},s={}}return{bind:l,update:c,dispose:M}}var $x=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),tn=null;function Zx(){return tn===null&&(tn=new Tr($x,16,16,On,Si),tn.name="DFG_LUT",tn.minFilter=Oe,tn.magFilter=Oe,tn.wrapS=Yi,tn.wrapT=Yi,tn.generateMipmaps=!1,tn.needsUpdate=!0),tn}var ol=class{constructor(t={}){let{canvas:e=od(),context:i=null,depth:n=!0,stencil:s=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=ci}=t;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;let x=f,g=new Set([Mo,bo,_o]),p=new Set([ci,ki,Vs,Ws,xo,vo]),y=new Uint32Array(4),M=new Int32Array(4),v=new N,S=null,b=null,E=[],_=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,C=!1,L=null,z=null,P=null,D=null;this._outputColorSpace=ti;let O=0,k=0,$=null,W=-1,Y=null,j=new Ce,at=new Ce,ot=null,Gt=new Ct(0),Xt=0,jt=e.width,Z=e.height,tt=1,wt=null,Nt=null,bt=new Ce(0,0,jt,Z),qt=new Ce(0,0,jt,Z),ze=!1,Zt=new Os,le=!1,Se=!1,te=new de,Re=new N,Je=new Ce,xi={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Pe=!1;function Ue(){return $===null?tt:1}let B=i;function si(A,U){return e.getContext(A,U)}let xe,I,w,H,q,J,rt,ct,K,et,ut,It,gt,dt,Lt,Ut,Wt,F,ft,Q,pt,_t,nt;try{let A={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",we,!1),e.addEventListener("webglcontextrestored",pe,!1),e.addEventListener("webglcontextcreationerror",Pi,!1),B===null){let U="webgl2";if(B=si(U,A),B===null)throw si(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Dt()}catch(A){throw e.removeEventListener("webglcontextlost",we,!1),e.removeEventListener("webglcontextrestored",pe,!1),e.removeEventListener("webglcontextcreationerror",Pi,!1),kt("WebGLRenderer: "+A.message),A}function Dt(){xe=new ig(B),xe.init(),pt=new Gx(B,xe),I=new Xm(B,xe,t,pt),w=new Ox(B,xe),I.reversedDepthBuffer&&d&&w.buffers.depth.setReversed(!0),z=B.createFramebuffer(),P=B.createFramebuffer(),D=B.createFramebuffer(),H=new rg(B),q=new Ex,J=new Hx(B,xe,w,q,I,pt,H),rt=new eg(R),ct=new op(B),_t=new Wm(B,ct),K=new ng(B,ct,H,_t),et=new og(B,K,ct,_t,H),F=new ag(B,I,J),Lt=new Ym(q),ut=new Tx(R,rt,xe,I,_t,Lt),It=new Xx(R,q),gt=new Rx,dt=new Dx(xe),Wt=new Vm(R,rt,w,et,m,l),Ut=new kx(R,et,I),nt=new Yx(B,H,I,w),ft=new qm(B,xe,H),Q=new sg(B,xe,H),H.programs=ut.programs,R.capabilities=I,R.extensions=xe,R.properties=q,R.renderLists=gt,R.shadowMap=Ut,R.state=w,R.info=H}x!==ci&&(T=new cg(x,e.width,e.height,o,n,s));let At=new Eh(R,B);this.xr=At,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let A=xe.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=xe.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(A){A!==void 0&&(tt=A,this.setSize(jt,Z,!1))},this.getSize=function(A){return A.set(jt,Z)},this.setSize=function(A,U,X=!0){if(At.isPresenting){Ft("WebGLRenderer: Can't change size while VR device is presenting.");return}jt=A,Z=U,e.width=Math.floor(A*tt),e.height=Math.floor(U*tt),X===!0&&(e.style.width=A+"px",e.style.height=U+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,A,U)},this.getDrawingBufferSize=function(A){return A.set(jt*tt,Z*tt).floor()},this.setDrawingBufferSize=function(A,U,X){jt=A,Z=U,tt=X,e.width=Math.floor(A*X),e.height=Math.floor(U*X),this.setViewport(0,0,A,U)},this.setEffects=function(A){if(x===ci){kt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let U=0;U<A.length;U++)if(A[U].isOutputPass===!0){Ft("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(j)},this.getViewport=function(A){return A.copy(bt)},this.setViewport=function(A,U,X,G){A.isVector4?bt.set(A.x,A.y,A.z,A.w):bt.set(A,U,X,G),w.viewport(j.copy(bt).multiplyScalar(tt).round())},this.getScissor=function(A){return A.copy(qt)},this.setScissor=function(A,U,X,G){A.isVector4?qt.set(A.x,A.y,A.z,A.w):qt.set(A,U,X,G),w.scissor(at.copy(qt).multiplyScalar(tt).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(A){w.setScissorTest(ze=A)},this.setOpaqueSort=function(A){wt=A},this.setTransparentSort=function(A){Nt=A},this.getClearColor=function(A){return A.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor(...arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha(...arguments)},this.clear=function(A=!0,U=!0,X=!0){let G=0;if(A){let V=!1;if($!==null){let yt=$.texture.format;V=g.has(yt)}if(V){let yt=$.texture.type,St=p.has(yt),vt=Wt.getClearColor(),Tt=Wt.getClearAlpha(),Rt=vt.r,Yt=vt.g,Kt=vt.b;St?(y[0]=Rt,y[1]=Yt,y[2]=Kt,y[3]=Tt,B.clearBufferuiv(B.COLOR,0,y)):(M[0]=Rt,M[1]=Yt,M[2]=Kt,M[3]=Tt,B.clearBufferiv(B.COLOR,0,M))}else G|=B.COLOR_BUFFER_BIT}U&&(G|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(G|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&B.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),L=A},this.dispose=function(){e.removeEventListener("webglcontextlost",we,!1),e.removeEventListener("webglcontextrestored",pe,!1),e.removeEventListener("webglcontextcreationerror",Pi,!1),Wt.dispose(),gt.dispose(),dt.dispose(),q.dispose(),rt.dispose(),et.dispose(),_t.dispose(),nt.dispose(),ut.dispose(),At.dispose(),At.removeEventListener("sessionstart",Gh),At.removeEventListener("sessionend",Vh),qn.stop()};function we(A){A.preventDefault(),vr("WebGLRenderer: Context Lost."),C=!0}function pe(){vr("WebGLRenderer: Context Restored."),C=!1;let A=H.autoReset,U=Ut.enabled,X=Ut.autoUpdate,G=Ut.needsUpdate,V=Ut.type;Dt(),H.autoReset=A,Ut.enabled=U,Ut.autoUpdate=X,Ut.needsUpdate=G,Ut.type=V}function Pi(A){kt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Vi(A){let U=A.target;U.removeEventListener("dispose",Vi),pf(U)}function pf(A){mf(A),q.remove(A)}function mf(A){let U=q.get(A).programs;U!==void 0&&(U.forEach(function(X){ut.releaseProgram(X)}),A.isShaderMaterial&&ut.releaseShaderCache(A))}this.renderBufferDirect=function(A,U,X,G,V,yt){U===null&&(U=xi);let St=V.isMesh&&V.matrixWorld.determinantAffine()<0,vt=vf(A,U,X,G,V);w.setMaterial(G,St);let Tt=X.index,Rt=1;if(G.wireframe===!0){if(Tt=K.getWireframeAttribute(X),Tt===void 0)return;Rt=2}let Yt=X.drawRange,Kt=X.attributes.position,Et=Yt.start*Rt,me=(Yt.start+Yt.count)*Rt;yt!==null&&(Et=Math.max(Et,yt.start*Rt),me=Math.min(me,(yt.start+yt.count)*Rt)),Tt!==null?(Et=Math.max(Et,0),me=Math.min(me,Tt.count)):Kt!=null&&(Et=Math.max(Et,0),me=Math.min(me,Kt.count));let Fe=me-Et;if(Fe<0||Fe===1/0)return;_t.setup(V,G,vt,X,Tt);let Ee,Me=ft;if(Tt!==null&&(Ee=ct.get(Tt),Me=Q,Me.setIndex(Ee)),V.isMesh)G.wireframe===!0?(w.setLineWidth(G.wireframeLinewidth*Ue()),Me.setMode(B.LINES)):Me.setMode(B.TRIANGLES);else if(V.isLine){let ri=G.linewidth;ri===void 0&&(ri=1),w.setLineWidth(ri*Ue()),V.isLineSegments?Me.setMode(B.LINES):V.isLineLoop?Me.setMode(B.LINE_LOOP):Me.setMode(B.LINE_STRIP)}else V.isPoints?Me.setMode(B.POINTS):V.isSprite&&Me.setMode(B.TRIANGLES);if(V.isBatchedMesh)if(xe.get("WEBGL_multi_draw"))Me.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let ri=V._multiDrawStarts,Mt=V._multiDrawCounts,fi=V._multiDrawCount,re=Tt?ct.get(Tt).bytesPerElement:1,wi=q.get(G).currentProgram.getUniforms();for(let Wi=0;Wi<fi;Wi++)wi.setValue(B,"_gl_DrawID",Wi),Me.render(ri[Wi]/re,Mt[Wi])}else if(V.isInstancedMesh)Me.renderInstances(Et,Fe,V.count);else if(X.isInstancedBufferGeometry){let ri=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Mt=Math.min(X.instanceCount,ri);Me.renderInstances(Et,Fe,Mt)}else Me.render(Et,Fe)};function Hh(A,U,X,G){L!==null&&A.isNodeMaterial&&L.setObject(G,A),le===!0&&Lt.setState(A,X,!1),A.transparent===!0&&A.side===Qe&&A.forceSinglePass===!1?(A.side=ii,A.needsUpdate=!0,ta(A,U,G),A.side=Ki,A.needsUpdate=!0,ta(A,U,G),A.side=Qe):ta(A,U,G)}this.compile=function(A,U,X=null){X===null&&(X=A),L!==null&&L.renderStart(A,U,X),b=dt.get(X),b.init(U),_.push(b),X.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),A!==X&&A.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),b.setupLights(),L!==null&&L.updateLights(b.state.lightsArray),Se=this.localClippingEnabled,le=Lt.init(this.clippingPlanes,Se),le===!0&&Lt.setGlobalState(this.clippingPlanes,U),L!==null&&Ut.render(b.state.shadowsArray,X,U);let G=new Set;return A.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let yt=V.material;if(yt)if(Array.isArray(yt))for(let St=0;St<yt.length;St++){let vt=yt[St];Hh(vt,X,U,V),G.add(vt)}else Hh(yt,X,U,V),G.add(yt)}),b=_.pop(),L!==null&&L.renderEnd(),G},this.compileAsync=function(A,U,X=null){let G=this.compile(A,U,X);return new Promise(V=>{function yt(){if(G.forEach(function(St){let Tt=q.get(St).currentProgram;(Tt===void 0||Tt.isReady())&&G.delete(St)}),G.size===0){V(A);return}setTimeout(yt,10)}xe.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let ec=null;function gf(A){ec&&ec(A)}function Gh(){qn.stop()}function Vh(){qn.start()}let qn=new Ud;qn.setAnimationLoop(gf),typeof self<"u"&&qn.setContext(self),this.setAnimationLoop=function(A){ec=A,At.setAnimationLoop(A),A===null?qn.stop():qn.start()},At.addEventListener("sessionstart",Gh),At.addEventListener("sessionend",Vh),this.render=function(A,U){if(U!==void 0&&U.isCamera!==!0){kt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;L!==null&&L.renderStart(A,U);let X=At.enabled===!0&&At.isPresenting===!0,G=T!==null&&($===null||X)&&T.begin(R,$);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),At.enabled===!0&&At.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(At.cameraAutoUpdate===!0&&At.updateCamera(U),U=At.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,U,$),b=dt.get(A,_.length),b.init(U),b.state.textureUnits=J.getTextureUnits(),_.push(b),te.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Zt.setFromProjectionMatrix(te,Ni,U.reversedDepth),Se=this.localClippingEnabled,le=Lt.init(this.clippingPlanes,Se),S=gt.get(A,E.length),S.init(),E.push(S),At.enabled===!0&&At.isPresenting===!0){let St=R.xr.getDepthSensingMesh();St!==null&&ic(St,U,-1/0,R.sortObjects)}ic(A,U,0,R.sortObjects),S.finish(),L!==null&&L.updateLights(b.state.lightsArray),R.sortObjects===!0&&S.sort(wt,Nt),Pe=At.enabled===!1||At.isPresenting===!1||At.hasDepthSensing()===!1,Pe&&Wt.addToRenderList(S,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),le===!0&&Lt.beginShadows();let V=b.state.shadowsArray;if(Ut.render(V,A,U),le===!0&&Lt.endShadows(),(G&&T.hasRenderPass())===!1){let St=S.opaque,vt=S.transmissive;if(b.setupLights(),U.isArrayCamera){let Tt=U.cameras;if(vt.length>0)for(let Rt=0,Yt=Tt.length;Rt<Yt;Rt++){let Kt=Tt[Rt];qh(St,vt,A,Kt)}Pe&&Wt.render(A);for(let Rt=0,Yt=Tt.length;Rt<Yt;Rt++){let Kt=Tt[Rt];Wh(S,A,Kt,Kt.viewport)}}else vt.length>0&&qh(St,vt,A,U),Pe&&Wt.render(A),Wh(S,A,U)}$!==null&&k===0&&(J.updateMultisampleRenderTarget($),J.updateRenderTargetMipmap($)),G&&T.end(R),A.isScene===!0&&A.onAfterRender(R,A,U),_t.resetDefaultState(),W=-1,Y=null,_.pop(),_.length>0?(b=_[_.length-1],J.setTextureUnits(b.state.textureUnits),le===!0&&Lt.setGlobalState(R.clippingPlanes,b.state.camera)):b=null,E.pop(),E.length>0?S=E[E.length-1]:S=null,L!==null&&L.renderEnd()};function ic(A,U,X,G){if(A.visible===!1)return;if(A.layers.test(U.layers)){if(A.isGroup)X=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(U);else if(A.isLightProbeGrid)b.pushLightProbeGrid(A);else if(A.isLight)b.pushLight(A),A.castShadow&&b.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(Zt)){G&&Je.setFromMatrixPosition(A.matrixWorld).applyMatrix4(te);let St=et.update(A),vt=A.material;vt.visible&&S.push(A,St,vt,X,Je.z,null,U)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(Zt))){let St=et.update(A),vt=A.material;if(G&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Je.copy(A.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Je.copy(St.boundingSphere.center)),Je.applyMatrix4(A.matrixWorld).applyMatrix4(te)),Array.isArray(vt)){let Tt=St.groups;for(let Rt=0,Yt=Tt.length;Rt<Yt;Rt++){let Kt=Tt[Rt],Et=vt[Kt.materialIndex];Et&&Et.visible&&S.push(A,St,Et,X,Je.z,Kt,U)}}else vt.visible&&S.push(A,St,vt,X,Je.z,null,U)}}let yt=A.children;for(let St=0,vt=yt.length;St<vt;St++)ic(yt[St],U,X,G)}function Wh(A,U,X,G){let{opaque:V,transmissive:yt,transparent:St}=A;b.setupLightsView(X),le===!0&&Lt.setGlobalState(R.clippingPlanes,X),G&&w.viewport(j.copy(G)),V.length>0&&Qr(V,U,X),yt.length>0&&Qr(yt,U,X),St.length>0&&Qr(St,U,X),w.buffers.depth.setTest(!0),w.buffers.depth.setMask(!0),w.buffers.color.setMask(!0),w.setPolygonOffset(!1)}function qh(A,U,X,G){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){let Et=xe.has("EXT_color_buffer_half_float")||xe.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new Ke(1,1,{generateMipmaps:!0,type:Et?Si:ci,minFilter:Bn,samples:Math.max(4,I.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ee.workingColorSpace})}let yt=b.state.transmissionRenderTarget[G.id],St=G.viewport||j;yt.setSize(St.z*R.transmissionResolutionScale,St.w*R.transmissionResolutionScale);let vt=R.getRenderTarget(),Tt=R.getActiveCubeFace(),Rt=R.getActiveMipmapLevel();R.setRenderTarget(yt),R.getClearColor(Gt),Xt=R.getClearAlpha(),Xt<1&&R.setClearColor(16777215,.5),R.clear(),Pe&&Wt.render(X);let Yt=R.toneMapping;R.toneMapping=Bi;let Kt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),le===!0&&Lt.setGlobalState(R.clippingPlanes,G),Qr(A,X,G),J.updateMultisampleRenderTarget(yt),J.updateRenderTargetMipmap(yt),xe.has("WEBGL_multisampled_render_to_texture")===!1){let Et=!1;for(let me=0,Fe=U.length;me<Fe;me++){let Ee=U[me],{object:Me,geometry:ri,material:Mt,group:fi}=Ee;if(Mt.side===Qe&&Me.layers.test(G.layers)){let re=Mt.side;Mt.side=ii,Mt.needsUpdate=!0,Xh(Me,X,G,ri,Mt,fi),Mt.side=re,Mt.needsUpdate=!0,Et=!0}}Et===!0&&(J.updateMultisampleRenderTarget(yt),J.updateRenderTargetMipmap(yt))}R.setRenderTarget(vt,Tt,Rt),R.setClearColor(Gt,Xt),Kt!==void 0&&(G.viewport=Kt),R.toneMapping=Yt}function Qr(A,U,X){let G=U.isScene===!0?U.overrideMaterial:null;for(let V=0,yt=A.length;V<yt;V++){let St=A[V],{object:vt,geometry:Tt,group:Rt}=St,Yt=St.material;Yt.allowOverride===!0&&G!==null&&(Yt=G),vt.layers.test(X.layers)&&Xh(vt,U,X,Tt,Yt,Rt)}}function Xh(A,U,X,G,V,yt){L!==null&&V.isNodeMaterial&&L.setObject(A,V),A.onBeforeRender(R,U,X,G,V,yt),A.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),V.onBeforeRender(R,U,X,G,A,yt),V.transparent===!0&&V.side===Qe&&V.forceSinglePass===!1?(V.side=ii,V.needsUpdate=!0,R.renderBufferDirect(X,U,G,V,A,yt),V.side=Ki,V.needsUpdate=!0,R.renderBufferDirect(X,U,G,V,A,yt),V.side=Qe):R.renderBufferDirect(X,U,G,V,A,yt),A.onAfterRender(R,U,X,G,V,yt)}function ta(A,U,X){U.isScene!==!0&&(U=xi);let G=q.get(A),V=b.state.lights,yt=b.state.shadowsArray,St=V.state.version,vt=ut.getParameters(A,V.state,yt,U,X,b.state.lightProbeGridArray),Tt=ut.getProgramCacheKey(vt),Rt=G.programs;G.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let Yt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;G.envMap=rt.get(A.envMap||G.environment,Yt),G.envMapRotation=G.environment!==null&&A.envMap===null?U.environmentRotation:A.envMapRotation,Rt===void 0&&(A.addEventListener("dispose",Vi),Rt=new Map,G.programs=Rt);let Kt=Rt.get(Tt);if(Kt!==void 0){if(G.currentProgram===Kt&&G.lightsStateVersion===St)return $h(A,vt),Kt}else vt.uniforms=ut.getUniforms(A),L!==null&&A.isNodeMaterial&&L.build(A,X,vt),A.onBeforeCompile(vt,R),Kt=ut.acquireProgram(vt,Tt),Rt.set(Tt,Kt),G.uniforms=vt.uniforms;let Et=G.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Et.clippingPlanes=Lt.uniform),$h(A,vt),G.needsLights=_f(A),G.lightsStateVersion=St,G.needsLights&&(Et.ambientLightColor.value=V.state.ambient,Et.lightProbe.value=V.state.probe,Et.sunLights.value=V.state.sun,Et.sunLightShadows.value=V.state.sunShadow,Et.directionalLights.value=V.state.directional,Et.directionalLightShadows.value=V.state.directionalShadow,Et.spotLights.value=V.state.spot,Et.spotLightShadows.value=V.state.spotShadow,Et.rectAreaLights.value=V.state.rectArea,Et.ltc_1.value=V.state.rectAreaLTC1,Et.ltc_2.value=V.state.rectAreaLTC2,Et.pointLights.value=V.state.point,Et.pointLightShadows.value=V.state.pointShadow,Et.hemisphereLights.value=V.state.hemi,Et.sunShadowMatrix.value=V.state.sunShadowMatrix,Et.sunShadowCascade.value=V.state.sunShadowCascade,Et.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Et.spotLightMatrix.value=V.state.spotLightMatrix,Et.spotLightMap.value=V.state.spotLightMap,Et.pointShadowMatrix.value=V.state.pointShadowMatrix),G.lightProbeGrid=b.state.lightProbeGridArray.length>0,G.currentProgram=Kt,G.uniformsList=null,Kt}function Yh(A){if(A.uniformsList===null){let U=A.currentProgram.getUniforms();A.uniformsList=Ys.seqWithValue(U.seq,A.uniforms)}return A.uniformsList}function $h(A,U){let X=q.get(A);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function xf(A,U){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;v.setFromMatrixPosition(U.matrixWorld);for(let X=0,G=A.length;X<G;X++){let V=A[X];if(V.texture!==null&&V.boundingBox.containsPoint(v))return V}return null}function vf(A,U,X,G,V){U.isScene!==!0&&(U=xi),J.resetTextureUnits();let yt=U.fog,St=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,vt=$===null?R.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:ee.workingColorSpace,Tt=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Rt=rt.get(G.envMap||St,Tt),Yt=G.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Kt=!!X.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Et=!!X.morphAttributes.position,me=!!X.morphAttributes.normal,Fe=!!X.morphAttributes.color,Ee=Bi;G.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Ee=R.toneMapping);let Me=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ri=Me!==void 0?Me.length:0,Mt=q.get(G),fi=b.state.lights;if(le===!0&&(Se===!0||A!==Y)){let Te=A===Y&&G.id===W;Lt.setState(G,A,Te)}let re=!1;G.version===Mt.__version?(Mt.needsLights&&Mt.lightsStateVersion!==fi.state.version||Mt.outputColorSpace!==vt||V.isBatchedMesh&&Mt.batching===!1||!V.isBatchedMesh&&Mt.batching===!0||V.isBatchedMesh&&Mt.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Mt.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Mt.instancing===!1||!V.isInstancedMesh&&Mt.instancing===!0||V.isSkinnedMesh&&Mt.skinning===!1||!V.isSkinnedMesh&&Mt.skinning===!0||V.isInstancedMesh&&Mt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Mt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Mt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Mt.instancingMorph===!1&&V.morphTexture!==null||Mt.envMap!==Rt||G.fog===!0&&Mt.fog!==yt||Mt.numClippingPlanes!==void 0&&(Mt.numClippingPlanes!==Lt.numPlanes||Mt.numIntersection!==Lt.numIntersection)||Mt.vertexAlphas!==Yt||Mt.vertexTangents!==Kt||Mt.morphTargets!==Et||Mt.morphNormals!==me||Mt.morphColors!==Fe||Mt.toneMapping!==Ee||Mt.morphTargetsCount!==ri||!!Mt.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(re=!0):(re=!0,Mt.__version=G.version);let wi=Mt.currentProgram;re===!0&&(wi=ta(G,U,V),L&&G.isNodeMaterial&&L.onUpdateProgram(G,wi,Mt));let Wi=!1,xn=!1,hs=!1,ye=wi.getUniforms(),De=Mt.uniforms;if(w.useProgram(wi.program)&&(Wi=!0,xn=!0,hs=!0),G.id!==W&&(W=G.id,xn=!0),Mt.needsLights){let Te=xf(b.state.lightProbeGridArray,V);Mt.lightProbeGrid!==Te&&(Mt.lightProbeGrid=Te,xn=!0)}if(Wi||Y!==A){w.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ye.setValue(B,"projectionMatrix",A.projectionMatrix),ye.setValue(B,"viewMatrix",A.matrixWorldInverse);let yn=ye.map.cameraPosition;yn!==void 0&&yn.setValue(B,Re.setFromMatrixPosition(A.matrixWorld)),I.logarithmicDepthBuffer&&ye.setValue(B,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ye.setValue(B,"isOrthographic",A.isOrthographicCamera===!0),Y!==A&&(Y=A,xn=!0,hs=!0)}if(Mt.needsLights&&(fi.state.sunShadowMap.length>0&&ye.setValue(B,"sunShadowMap",fi.state.sunShadowMap,J),fi.state.directionalShadowMap.length>0&&ye.setValue(B,"directionalShadowMap",fi.state.directionalShadowMap,J),fi.state.spotShadowMap.length>0&&ye.setValue(B,"spotShadowMap",fi.state.spotShadowMap,J),fi.state.pointShadowMap.length>0&&ye.setValue(B,"pointShadowMap",fi.state.pointShadowMap,J)),V.isSkinnedMesh){ye.setOptional(B,V,"bindMatrix"),ye.setOptional(B,V,"bindMatrixInverse");let Te=V.skeleton;Te&&(Te.boneTexture===null&&Te.computeBoneTexture(),ye.setValue(B,"boneTexture",Te.boneTexture,J))}V.isBatchedMesh&&(ye.setOptional(B,V,"batchingTexture"),ye.setValue(B,"batchingTexture",V._matricesTexture,J),ye.setOptional(B,V,"batchingIdTexture"),ye.setValue(B,"batchingIdTexture",V._indirectTexture,J),ye.setOptional(B,V,"batchingColorTexture"),V._colorsTexture!==null&&ye.setValue(B,"batchingColorTexture",V._colorsTexture,J));let vn=X.morphAttributes;if((vn.position!==void 0||vn.normal!==void 0||vn.color!==void 0)&&F.update(V,X,wi),(xn||Mt.receiveShadow!==V.receiveShadow)&&(Mt.receiveShadow=V.receiveShadow,ye.setValue(B,"receiveShadow",V.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(De.envMapIntensity.value=U.environmentIntensity),De.dfgLUT!==void 0&&(De.dfgLUT.value=Zx()),xn){if(ye.setValue(B,"toneMappingExposure",R.toneMappingExposure),Mt.needsLights&&yf(De,hs),yt&&G.fog===!0&&It.refreshFogUniforms(De,yt),It.refreshMaterialUniforms(De,G,tt,Z,b.state.transmissionRenderTarget[A.id]),Mt.needsLights&&Mt.lightProbeGrid){let Te=Mt.lightProbeGrid;De.probesSH.value=Te.texture,De.probesMin.value.copy(Te.boundingBox.min),De.probesMax.value.copy(Te.boundingBox.max),De.probesResolution.value.copy(Te.resolution)}Ys.upload(B,Yh(Mt),De,J)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Ys.upload(B,Yh(Mt),De,J),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ye.setValue(B,"center",V.center),ye.setValue(B,"modelViewMatrix",V.modelViewMatrix),ye.setValue(B,"normalMatrix",V.normalMatrix),ye.setValue(B,"modelMatrix",V.matrixWorld),G.uniformsGroups!==void 0){let Te=G.uniformsGroups;for(let yn=0,us=Te.length;yn<us;yn++){let Jh=Te[yn];nt.update(Jh,wi),nt.bind(Jh,wi)}}return wi}function yf(A,U){A.ambientLightColor.needsUpdate=U,A.lightProbe.needsUpdate=U,A.sunLights.needsUpdate=U,A.sunLightShadows.needsUpdate=U,A.directionalLights.needsUpdate=U,A.directionalLightShadows.needsUpdate=U,A.pointLights.needsUpdate=U,A.pointLightShadows.needsUpdate=U,A.spotLights.needsUpdate=U,A.spotLightShadows.needsUpdate=U,A.rectAreaLights.needsUpdate=U,A.hemisphereLights.needsUpdate=U}function _f(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return $},this.setRenderTargetTextures=function(A,U,X){let G=q.get(A);G.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),q.get(A.texture).__webglTexture=U,q.get(A.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:X,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,U){let X=q.get(A);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(A,U=0,X=0){$=A,O=U,k=X;let G=null,V=!1,yt=!1;if(A){let vt=q.get(A);if(vt.__useDefaultFramebuffer!==void 0){w.bindFramebuffer(B.FRAMEBUFFER,vt.__webglFramebuffer),j.copy(A.viewport),at.copy(A.scissor),ot=A.scissorTest,w.viewport(j),w.scissor(at),w.setScissorTest(ot),W=-1;return}else if(vt.__webglFramebuffer===void 0)J.setupRenderTarget(A);else if(vt.__hasExternalTextures)J.rebindTextures(A,q.get(A.texture).__webglTexture,q.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Yt=A.depthTexture;if(vt.__boundDepthTexture!==Yt){if(Yt!==null&&q.has(Yt)&&(A.width!==Yt.image.width||A.height!==Yt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(A)}}let Tt=A.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(yt=!0);let Rt=q.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Rt[U])?G=Rt[U][X]:G=Rt[U],V=!0):A.samples>0&&J.useMultisampledRTT(A)===!1?G=q.get(A).__webglMultisampledFramebuffer:Array.isArray(Rt)?G=Rt[X]:G=Rt,j.copy(A.viewport),at.copy(A.scissor),ot=A.scissorTest}else j.copy(bt).multiplyScalar(tt).floor(),at.copy(qt).multiplyScalar(tt).floor(),ot=ze;if(X!==0&&(G=z),w.bindFramebuffer(B.FRAMEBUFFER,G)&&w.drawBuffers(A,G),w.viewport(j),w.scissor(at),w.setScissorTest(ot),V){let vt=q.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,vt.__webglTexture,X)}else if(yt){let vt=U;for(let Tt=0;Tt<A.textures.length;Tt++){let Rt=q.get(A.textures[Tt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Tt,Rt.__webglTexture,X,vt)}}else if(A!==null&&X!==0){let vt=q.get(A.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,vt.__webglTexture,X)}W=-1};function Zh(A){let U=q.get(A);return(U.__readFormat!==A.format||U.__readType!==A.type)&&(U.__readFormat=A.format,U.__readType=A.type,U.__formatReadable=I.textureFormatReadable(A.format),U.__typeReadable=I.textureTypeReadable(A.type)),U}this.readRenderTargetPixels=function(A,U,X,G,V,yt,St,vt=0){if(!(A&&A.isWebGLRenderTarget)){kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=q.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&St!==void 0&&(Tt=Tt[St]),Tt){w.bindFramebuffer(B.FRAMEBUFFER,Tt);try{let Rt=A.textures[vt],Yt=Rt.format,Kt=Rt.type;A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+vt);let Et=Zh(Rt);if(Et.__formatReadable===!1){kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Et.__typeReadable===!1){kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=A.width-G&&X>=0&&X<=A.height-V&&B.readPixels(U,X,G,V,pt.convert(Yt),pt.convert(Kt),yt)}finally{let Rt=$!==null?q.get($).__webglFramebuffer:null;w.bindFramebuffer(B.FRAMEBUFFER,Rt)}}},this.readRenderTargetPixelsAsync=async function(A,U,X,G,V,yt,St,vt=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=q.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&St!==void 0&&(Tt=Tt[St]),Tt)if(U>=0&&U<=A.width-G&&X>=0&&X<=A.height-V){w.bindFramebuffer(B.FRAMEBUFFER,Tt);let Rt=A.textures[vt],Yt=Rt.format,Kt=Rt.type;A.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+vt);let Et=Zh(Rt);if(Et.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Et.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let me=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,me),B.bufferData(B.PIXEL_PACK_BUFFER,yt.byteLength,B.STREAM_READ),B.readPixels(U,X,G,V,pt.convert(Yt),pt.convert(Kt),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let Fe=$!==null?q.get($).__webglFramebuffer:null;w.bindFramebuffer(B.FRAMEBUFFER,Fe);let Ee=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await cd(B,Ee,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,me),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,yt),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(me),B.deleteSync(Ee),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,U=null,X=0){let G=Math.pow(2,-X),V=Math.floor(A.image.width*G),yt=Math.floor(A.image.height*G),St=U!==null?U.x:0,vt=U!==null?U.y:0;J.setTexture2D(A,0),B.copyTexSubImage2D(B.TEXTURE_2D,X,0,0,St,vt,V,yt),w.unbindTexture()},this.copyTextureToTexture=function(A,U,X=null,G=null,V=0,yt=0){let St,vt,Tt,Rt,Yt,Kt,Et,me,Fe,Ee=A.isCompressedTexture?A.mipmaps[yt]:A.image;if(X!==null)St=X.max.x-X.min.x,vt=X.max.y-X.min.y,Tt=X.isBox3?X.max.z-X.min.z:1,Rt=X.min.x,Yt=X.min.y,Kt=X.isBox3?X.min.z:0;else{let De=Math.pow(2,-V);St=Math.floor(Ee.width*De),vt=Math.floor(Ee.height*De),A.isDataArrayTexture?Tt=Ee.depth:A.isData3DTexture?Tt=Math.floor(Ee.depth*De):Tt=1,Rt=0,Yt=0,Kt=0}G!==null?(Et=G.x,me=G.y,Fe=G.z):(Et=0,me=0,Fe=0);let Me=pt.convert(U.format),ri=pt.convert(U.type),Mt;U.isData3DTexture?(J.setTexture3D(U,0),Mt=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(J.setTexture2DArray(U,0),Mt=B.TEXTURE_2D_ARRAY):(J.setTexture2D(U,0),Mt=B.TEXTURE_2D),w.activeTexture(B.TEXTURE0),w.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),w.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),w.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);let fi=w.getParameter(B.UNPACK_ROW_LENGTH),re=w.getParameter(B.UNPACK_IMAGE_HEIGHT),wi=w.getParameter(B.UNPACK_SKIP_PIXELS),Wi=w.getParameter(B.UNPACK_SKIP_ROWS),xn=w.getParameter(B.UNPACK_SKIP_IMAGES);w.pixelStorei(B.UNPACK_ROW_LENGTH,Ee.width),w.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Ee.height),w.pixelStorei(B.UNPACK_SKIP_PIXELS,Rt),w.pixelStorei(B.UNPACK_SKIP_ROWS,Yt),w.pixelStorei(B.UNPACK_SKIP_IMAGES,Kt);let hs=A.isDataArrayTexture||A.isData3DTexture,ye=U.isDataArrayTexture||U.isData3DTexture;if(A.isDepthTexture){let De=q.get(A),vn=q.get(U),Te=q.get(De.__renderTarget),yn=q.get(vn.__renderTarget);w.bindFramebuffer(B.READ_FRAMEBUFFER,Te.__webglFramebuffer),w.bindFramebuffer(B.DRAW_FRAMEBUFFER,yn.__webglFramebuffer);for(let us=0;us<Tt;us++)hs&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,q.get(A).__webglTexture,V,Kt+us),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,q.get(U).__webglTexture,yt,Fe+us)),B.blitFramebuffer(Rt,Yt,St,vt,Et,me,St,vt,B.DEPTH_BUFFER_BIT,B.NEAREST);w.bindFramebuffer(B.READ_FRAMEBUFFER,null),w.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(V!==0||A.isRenderTargetTexture||q.has(A)){let De=q.get(A),vn=q.get(U);w.bindFramebuffer(B.READ_FRAMEBUFFER,P),w.bindFramebuffer(B.DRAW_FRAMEBUFFER,D);for(let Te=0;Te<Tt;Te++)hs?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,De.__webglTexture,V,Kt+Te):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,De.__webglTexture,V),ye?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,vn.__webglTexture,yt,Fe+Te):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,vn.__webglTexture,yt),V!==0?B.blitFramebuffer(Rt,Yt,St,vt,Et,me,St,vt,B.COLOR_BUFFER_BIT,B.NEAREST):ye?B.copyTexSubImage3D(Mt,yt,Et,me,Fe+Te,Rt,Yt,St,vt):B.copyTexSubImage2D(Mt,yt,Et,me,Rt,Yt,St,vt);w.bindFramebuffer(B.READ_FRAMEBUFFER,null),w.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else ye?A.isDataTexture||A.isData3DTexture?B.texSubImage3D(Mt,yt,Et,me,Fe,St,vt,Tt,Me,ri,Ee.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(Mt,yt,Et,me,Fe,St,vt,Tt,Me,Ee.data):B.texSubImage3D(Mt,yt,Et,me,Fe,St,vt,Tt,Me,ri,Ee):A.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,yt,Et,me,St,vt,Me,ri,Ee.data):A.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,yt,Et,me,Ee.width,Ee.height,Me,Ee.data):B.texSubImage2D(B.TEXTURE_2D,yt,Et,me,St,vt,Me,ri,Ee);w.pixelStorei(B.UNPACK_ROW_LENGTH,fi),w.pixelStorei(B.UNPACK_IMAGE_HEIGHT,re),w.pixelStorei(B.UNPACK_SKIP_PIXELS,wi),w.pixelStorei(B.UNPACK_SKIP_ROWS,Wi),w.pixelStorei(B.UNPACK_SKIP_IMAGES,xn),yt===0&&U.generateMipmaps&&B.generateMipmap(Mt),w.unbindTexture()},this.initRenderTarget=function(A){q.get(A).__webglFramebuffer===void 0&&J.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?J.setTextureCube(A,0):A.isData3DTexture?J.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?J.setTexture2DArray(A,0):J.setTexture2D(A,0),w.unbindTexture()},this.resetState=function(){O=0,k=0,$=null,w.reset(),_t.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ee._getDrawingBufferColorSpace(t),e.unpackColorSpace=ee._getUnpackColorSpace()}};var Ot={minX:-1500,maxX:1150,minZ:-1800,maxZ:1750};var Vd=[[-1800,520],[-1650,485],[-1500,455],[-1300,445],[-1100,458],[-900,468],[-700,476],[-560,482],[-460,440],[-300,432],[-160,462],[0,480],[200,486],[330,505],[400,575],[520,585],[600,525],[750,470],[900,420],[1050,365],[1150,325],[1300,310],[1420,335],[1500,430],[1560,570],[1620,630],[1700,575],[1750,540]],Hn=[{id:"centro",name:"Centro",type:"centro",x0:-10,z0:-110,px:82,pz:82,cols:5,rows:5,sw:12,ext:{E:45}},{id:"pietrobelli",name:"Barrio Pietrobelli",type:"barrio",x0:-440,z0:-80,px:80,pz:74.5,cols:5,rows:4,sw:10,skip:{S:!0},ext:{E:30}},{id:"juan23",name:"Barrio Juan XXIII",type:"barrio",x0:-760,z0:-80,px:64,pz:74.5,cols:5,rows:4,sw:9,skip:{S:!0,E:!0}},{id:"nuevejulio",name:"Barrio 9 de Julio",type:"barrio",x0:-440,z0:218,px:80,pz:70,cols:5,rows:4,sw:10,skip:{N:!0},ext:{E:30}},{id:"treintaoct",name:"Barrio 30 de Octubre",type:"barrio",x0:-760,z0:218,px:64,pz:70,cols:5,rows:4,sw:9,skip:{N:!0,E:!0}},{id:"industrial",name:"Barrio Industrial",type:"industrial",x0:-10,z0:560,px:82,pz:80,cols:3,rows:3,sw:12,ext:{E:62,N:260}},{id:"pueyrredon",name:"Barrio Pueyrred\xF3n",type:"barrio",x0:-440,z0:560,px:80,pz:80,cols:5,rows:3,sw:10,ext:{E:30,N:62}},{id:"km3",name:"Km 3",type:"km",x0:80,z0:-900,px:70,pz:70,cols:4,rows:4,sw:10,ext:{E:50}},{id:"km5",name:"Km 5",type:"km",x0:80,z0:-1150,px:70,pz:70,cols:4,rows:3,sw:10,ext:{E:50,S:40}},{id:"km8",name:"Km 8",type:"barrio",x0:80,z0:-1450,px:70,pz:70,cols:4,rows:4,sw:10,ext:{E:50,S:20}},{id:"caleta",name:"Caleta C\xF3rdova",type:"km",x0:260,z0:-1740,px:60,pz:60,cols:2,rows:2,sw:9,ext:{E:40}},{id:"rada",name:"Rada Tilly",type:"rada",x0:20,z0:1100,px:62,pz:66,cols:4,rows:5,sw:10}],Wd=[{id:"ruta3",name:"Ruta 3",kind:"ruta",width:14,pts:[[420,-1800],[412,-1600],[405,-1400],[402,-1150],[408,-900],[412,-640],[400,-470],[392,-300],[415,-185],[445,-130],[445,320],[405,346],[295,346],[295,560],[300,830],[150,950],[-120,1100],[-220,1750]]},{id:"ruta26",name:"Ruta 26",kind:"ruta",width:13,pts:[[-10,218],[-440,218],[-760,218],[-840,214],[-905,204],[-1e3,190],[-1200,175],[-1500,160]]},{id:"polonia",name:"Av. Polonia",kind:"avenida",width:12,pts:[[-10,-110],[-80,-250],[-70,-460],[0,-600],[80,-660]]},{id:"chenque",name:"Subida al Chenque",kind:"calle",width:9,pts:[[72,-110],[45,-165],[125,-205],[60,-255],[135,-295],[165,-355],[190,-370]]},{id:"pampa",name:"Camino a Pampa del Castillo",kind:"ruta",width:11,pts:[[80,-760],[-300,-760],[-650,-720],[-900,-650],[-1050,-600]]},{id:"aeropuerto",name:"Acceso Aeropuerto",kind:"avenida",width:12,pts:[[80,-1310],[-300,-1310],[-360,-1310]]},{id:"accesorada",name:"Acceso Rada Tilly",kind:"avenida",width:12,pts:[[100,978],[144,1100]]},{id:"marques",name:"Camino a Punta del Marqu\xE9s",kind:"calle",width:9,pts:[[268,1430],[330,1478],[420,1535],[490,1575],[560,1600]]},{id:"puerto1",name:"Puerto",kind:"calle",width:11,pts:[[295,390],[560,390]]},{id:"puerto2",name:"Puerto",kind:"calle",width:11,pts:[[295,480],[585,480]]},{id:"puerto3",name:"Puerto",kind:"calle",width:10,pts:[[430,390],[430,480]]},{id:"muelle1",name:"Muelle de Ultramar",kind:"muelle",width:12,pts:[[560,390],[730,390]]},{id:"muelle2",name:"Muelle Pesquero",kind:"muelle",width:10,pts:[[585,480],[700,480]]},{id:"picada",name:"Picada Principal",kind:"tierra",width:9,pts:[[-1050,-1600],[-1080,-1e3],[-1050,-600],[-1e3,-200],[-1e3,190],[-1060,600],[-1e3,1e3],[-1100,1600]]},{id:"eolico",name:"Acceso Parque E\xF3lico",kind:"tierra",width:8,pts:[[-1e3,-200],[-900,-310],[-860,-450]]},{id:"picada2",name:"Picada Norte",kind:"tierra",width:8,pts:[[-1080,-1e3],[-1320,-1060]]},{id:"picada3",name:"Picada Sur",kind:"tierra",width:8,pts:[[-1060,600],[-1330,660]]},{id:"picada4",name:"Picada Este",kind:"tierra",width:8,pts:[[-1e3,1e3],[-1300,1080]]}],ss=[{x0:555,x1:740,z0:380,z1:400,h:2.6,name:"muelle1"},{x0:575,x1:710,z0:471,z1:489,h:2.6,name:"muelle2"},{x0:468,x1:560,z0:134,z1:146,h:2.4,name:"muelleCostanera"}],Zs=[{x0:-30,x1:470,z0:-125,z1:320,h:a=>4+(470-a)*.018,edge:45},{x0:280,x1:600,z0:330,z1:575,h:()=>3.2,edge:30},{x0:-990,x1:-330,z0:-1420,z1:-1270,h:()=>36,edge:60},{x0:10,x1:290,z0:1085,z1:1445,h:(a,t)=>3.5+(290-a)*.04+(t-1085)*.004,edge:40},{x0:-30,x1:290,z0:540,z1:820,h:a=>6+(290-a)*.03,edge:40}],qd=[{name:"Muelle",rect:[460,740,370,495]},{name:"Puerto",rect:[285,600,330,575]},{name:"Centro",rect:[-20,470,-125,320]},{name:"Cerro Chenque",ellipse:[150,-360,200,270]},{name:"Restinga Al\xED",rect:[415,530,-640,-440]},{name:"Km 3",rect:[40,480,-930,-600]},{name:"Km 5",rect:[40,480,-1160,-930]},{name:"Km 8",rect:[40,480,-1470,-1160]},{name:"Caleta C\xF3rdova",rect:[230,560,-1800,-1580]},{name:"Aeropuerto",rect:[-1e3,-300,-1460,-1250]},{name:"Barrio Pietrobelli",rect:[-450,-15,-95,214]},{name:"Barrio Juan XXIII",rect:[-775,-440,-95,214]},{name:"Barrio 9 de Julio",rect:[-450,-15,214,505]},{name:"Barrio 30 de Octubre",rect:[-775,-440,214,505]},{name:"Barrio Industrial",rect:[-15,300,505,830]},{name:"Barrio Pueyrred\xF3n",rect:[-450,-15,505,830]},{name:"Punta del Marqu\xE9s",rect:[340,720,1450,1750]},{name:"Rada Tilly",rect:[-20,360,1060,1460]},{name:"Parque E\xF3lico",rect:[-1e3,-780,-520,-150]},{name:"Pampa del Castillo",rect:[-1500,-840,-1800,1750]},{name:"Loma de Rada Tilly",rect:[-300,500,830,1060]}],Bt={semaforo:{x:236,z:54,name:"Sem\xE1foro de San Mart\xEDn y Rivadavia"},casaAbuela:{x:-118,z:100,name:"Casa de la Abuela"},garagePetroca:{x:-118,z:128,name:"Garage del Petroca"},madriguera:{x:-240,z:323,name:"La Madriguera"},hospital:{x:31,z:45,name:"Hospital Regional"},comisaria:{x:113,z:-38,name:"Comisar\xEDa Primera"},chori:{x:458,z:60,name:"El Chori del Viento"},pizzeria:{x:195,z:146,name:"Pizzer\xEDa La Tuerca"},armeria:{x:31,z:136,name:"Armer\xEDa La Patag\xF3nica"},chapa:{x:113,z:632,name:"Chapa y Pintura Don Tito"},gimnasio:{x:31,z:632,name:"Gimnasio M\xFAsculo Patag\xF3nico"},terminal:{x:359,z:218,name:"Terminal de \xD3mnibus"},catedral:{x:277,z:13,name:"Catedral San Juan Bosco"},torreCrudo:{x:359,z:13,name:"Torre Crudo"},museo:{x:185,z:-725,name:"Museo del Petr\xF3leo"},depositoCrudo:{x:20,z:-700,name:"Dep\xF3sito de Don Crudo"},yacimiento:{x:-1160,z:-900,name:"Campamento Pampa del Castillo"},mansionChetos:{x:237,z:1397,name:"La Mansi\xF3n de los Chetos"},loberia:{x:575,z:1620,name:"Lober\xEDa de Punta del Marqu\xE9s"},anomala:{x:31,z:259,name:"La An\xF3mala"},casino:{x:462,z:205,name:"Casino del Golfo"},antenas:{x:185,z:-380,name:"Antenas del Chenque"},remiseria:{x:318,z:177,name:"Remiser\xEDa El Viento"}},hl=[[150,-330],[-60,-300],[430,-520],[300,-760],[-120,-1e3],[200,-1400],[330,-1700],[-600,-1330],[-930,-380],[-1250,-1e3],[-1200,100],[-1250,700],[-980,1300],[-640,440],[-600,-60],[-330,700],[230,900],[320,1250],[520,1640],[650,400],[500,-80],[120,780],[-300,-700],[470,480]],Js=[{x:330,z:520,rot:Math.PI/2,len:14,h:3.5,w:7},{x:-700,z:330,rot:Math.PI,len:12,h:3,w:6},{x:250,z:1250,rot:0,len:14,h:3.2,w:7},{x:-1020,z:-300,rot:Math.PI,len:16,h:4,w:7},{x:235,z:-840,rot:-Math.PI/2,len:12,h:3,w:6},{x:-300,z:-1305,rot:-Math.PI/2,len:16,h:4.5,w:8}],Xd=[{x0:-1450,x1:-870,z0:-1700,z1:1700,n:70},{x0:-300,x1:60,z0:-1e3,z1:-780,n:10},{x0:-200,x1:30,z0:-1450,z1:-1100,n:8},{x0:250,x1:380,z0:-560,z1:-470,n:3},{x0:-840,x1:-780,z0:-100,z1:500,n:6},{x0:-300,x1:200,z0:840,z1:1040,n:8},{x0:-700,x1:-470,z0:520,z1:820,n:5}],ul=[[-900,-470],[-880,-420],[-925,-380],[-905,-330],[-950,-280],[-930,-230],[-960,-180],[-870,-520]],js={hospital:{x:31,z:50,rot:Math.PI},comisaria:{x:113,z:-40,rot:Math.PI},casa:{x:-110,z:100,rot:Math.PI/2}};var lt=(a,t,e)=>a<t?t:a>e?e:a,ht=(a,t,e)=>a+(t-a)*e,ui=(a,t,e)=>{let i=lt((e-a)/(t-a),0,1);return i*i*(3-2*i)},Yd=Math.PI*2;function fl(a){for(;a>Math.PI;)a-=Yd;for(;a<-Math.PI;)a+=Yd;return a}var pl=(a,t)=>fl(t-a);function $r(a,t,e){let i=pl(a,t);return Math.abs(i)<=e?t:a+Math.sign(i)*e}var Zr=(a,t,e)=>a<t?Math.min(a+e,t):Math.max(a-e,t),Jx=(a,t,e,i)=>{let n=a-e,s=t-i;return n*n+s*s},zt=(a,t,e,i)=>Math.sqrt(Jx(a,t,e,i));function jx(a){return function(){a|=0,a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Oi=class{constructor(t=1){this.r=jx(t)}next(){return this.r()}range(t,e){return t+(e-t)*this.r()}int(t,e){return Math.floor(this.range(t,e+1))}pick(t){return t[Math.floor(this.r()*t.length)]}chance(t){return this.r()<t}sign(){return this.r()<.5?-1:1}},st=(a=0,t=1)=>a+(t-a)*Math.random();var ae=a=>a[Math.floor(Math.random()*a.length)],he=a=>Math.random()<a;function dl(a,t){let e=a*374761393+t*668265263|0;return e=(e^e>>>13)*1274126177,e=e^e>>>16,(e>>>0)/4294967296}function Gn(a,t){let e=Math.floor(a),i=Math.floor(t),n=a-e,s=t-i,r=n*n*(3-2*n),o=s*s*(3-2*s),l=dl(e,i),c=dl(e+1,i),h=dl(e,i+1),u=dl(e+1,i+1);return ht(ht(l,c,r),ht(h,u,r),o)}function ml(a,t,e=4){let i=0,n=.5,s=1,r=0;for(let o=0;o<e;o++)i+=n*Gn(a*s,t*s),r+=n,n*=.5,s*=2.03;return i/r}function Vn(a,t,e,i,n,s){let r=n-e,o=s-i,l=r*r+o*o,c=l>0?((a-e)*r+(t-i)*o)/l:0;c=lt(c,0,1);let h=e+r*c,u=i+o*c;return{d:Math.hypot(a-h,t-u),t:c,x:h,z:u}}function gl(a,t,e,i,n,s,r,o){let l=e-a,c=i-t,h=r-n,u=o-s,d=l*u-c*h;if(Math.abs(d)<1e-9)return null;let f=n-a,m=s-t,x=(f*u-m*h)/d,g=(f*c-m*l)/d;return x<-1e-6||x>1+1e-6||g<-1e-6||g>1+1e-6?null:{t:x,u:g,x:a+l*x,z:t+c*x}}function $d(a,t){let e=a.length;if(t<=a[0][0])return a[0][1];if(t>=a[e-1][0])return a[e-1][1];let i=0;for(;i<e-2&&a[i+1][0]<t;)i++;let n=a[Math.max(0,i-1)][1],s=a[i][1],r=a[i+1][1],o=a[Math.min(e-1,i+2)][1],l=(t-a[i][0])/(a[i+1][0]-a[i][0]),c=l*l,h=c*l;return .5*(2*s+(-n+r)*l+(2*n-5*s+4*r-o)*c+(-n+3*s-3*r+o)*h)}function Jr(a){let t=Math.max(0,Math.floor(Math.abs(a))).toString().padStart(8,"0");return(a<0?"-$":"$")+t}function jr(a){try{return window.localStorage.getItem(a)}catch{return null}}function xl(a,t){try{return window.localStorage.setItem(a,t),!0}catch{return!1}}var be=class{constructor(){this.pos=[],this.nrm=[],this.uv=[],this.col=[]}get count(){return this.pos.length/3}tri(t,e,i,n,s,r,o,l){this.pos.push(...t,...e,...i),this.nrm.push(...n,...n,...n),this.uv.push(...s,...r,...o),this.col.push(...l,...l,...l)}quad(t,e,i,n,s,r,o,l,c){let h=e[0]-t[0],u=e[1]-t[1],d=e[2]-t[2],f=n[0]-t[0],m=n[1]-t[1],x=n[2]-t[2],g=u*x-d*m,p=d*f-h*x,y=h*m-u*f,M=Math.hypot(g,p,y)||1,v=[g/M,p/M,y/M];this.tri(t,e,i,v,s,r,o,c),this.tri(t,i,n,v,s,o,l,c)}walls(t,e,i,n,s,r,o,l=4,c=3,h=0,u=0){let d=(r-s)/c,f=h,m=h+d,x=(e-t)/l,g=(n-i)/l;this.quad([t,s,n],[e,s,n],[e,r,n],[t,r,n],[u,f],[u+x,f],[u+x,m],[u,m],o),this.quad([e,s,i],[t,s,i],[t,r,i],[e,r,i],[u,f],[u+x,f],[u+x,m],[u,m],o),this.quad([e,s,n],[e,s,i],[e,r,i],[e,r,n],[u,f],[u+g,f],[u+g,m],[u,m],o),this.quad([t,s,i],[t,s,n],[t,r,n],[t,r,i],[u,f],[u+g,f],[u+g,m],[u,m],o)}top(t,e,i,n,s,r,o=4){this.quad([t,s,n],[e,s,n],[e,s,i],[t,s,i],[t/o,n/o],[e/o,n/o],[e/o,i/o],[t/o,i/o],r)}box(t,e,i,n,s,r,o,l=4,c=3){this.walls(t,e,s,r,i,n,o,l,c),this.top(t,e,s,r,n,o,l),this.quad([t,i,s],[e,i,s],[e,i,r],[t,i,r],[0,0],[1,0],[1,1],[0,1],o)}gable(t,e,i,n,s,r,o,l=!0,c=.4){t-=c,e+=c,i-=c,n+=c;let h=3;if(l){let u=(i+n)/2,d=s+r;this.quad([t,s,n],[e,s,n],[e,d,u],[t,d,u],[t/h,0],[e/h,0],[e/h,1.5],[t/h,1.5],o),this.quad([e,s,i],[t,s,i],[t,d,u],[e,d,u],[e/h,0],[t/h,0],[t/h,1.5],[e/h,1.5],o),this.tri([t+c,s,i+c],[t+c,s,n-c],[t+c,d,u],[-1,0,0],[0,0],[1,0],[.5,.5],o),this.tri([e-c,s,n-c],[e-c,s,i+c],[e-c,d,u],[1,0,0],[0,0],[1,0],[.5,.5],o)}else{let u=(t+e)/2,d=s+r;this.quad([e,s,n],[e,s,i],[u,d,i],[u,d,n],[n/h,0],[i/h,0],[i/h,1.5],[n/h,1.5],o),this.quad([t,s,i],[t,s,n],[u,d,n],[u,d,i],[i/h,0],[n/h,0],[n/h,1.5],[i/h,1.5],o),this.tri([t+c,s,n-c],[e-c,s,n-c],[u,d,n-c],[0,0,1],[0,0],[1,0],[.5,.5],o),this.tri([e-c,s,i+c],[t+c,s,i+c],[u,d,i+c],[0,0,-1],[0,0],[1,0],[.5,.5],o)}}cylinder(t,e,i,n,s,r,o=12,l=!0){for(let c=0;c<o;c++){let h=c/o*Math.PI*2,u=(c+1)/o*Math.PI*2,d=[t+Math.cos(h)*i,n,e+Math.sin(h)*i],f=[t+Math.cos(u)*i,n,e+Math.sin(u)*i],m=[t+Math.cos(u)*i,s,e+Math.sin(u)*i],x=[t+Math.cos(h)*i,s,e+Math.sin(h)*i],g=(h+u)/2,p=[Math.cos(g),0,Math.sin(g)];this.tri(d,m,f,p,[c/o,0],[(c+1)/o,1],[(c+1)/o,0],r),this.tri(d,x,m,p,[c/o,0],[c/o,1],[(c+1)/o,1],r),l&&this.tri([t,s,e],m,x,[0,1,0],[.5,.5],[0,0],[1,0],r)}}toGeometry(){let t=new fe;return t.setAttribute("position",new ce(this.pos,3)),t.setAttribute("normal",new ce(this.nrm,3)),t.setAttribute("uv",new ce(this.uv,2)),t.setAttribute("color",new ce(this.col,3)),t.computeBoundingSphere(),t}},vl=class{constructor(t=256){this.size=t,this.map=new Map}get(t,e,i){let n=`${Math.floor(t/this.size)},${Math.floor(e/this.size)},${i}`,s=this.map.get(n);return s||(s={mat:i,gb:new be},this.map.set(n,s)),s.gb}build(t,e){for(let{mat:i,gb:n}of this.map.values()){if(!n.count)continue;let s=new xt(n.toGeometry(),t[i]);s.matrixAutoUpdate=!1,e.add(s)}}},Ks=a=>a<=.04045?a/12.92:Math.pow((a+.055)/1.055,2.4);function it(a){return[Ks((a>>16&255)/255),Ks((a>>8&255)/255),Ks((a&255)/255)]}function Zd(a,t,e){return[Ks(a),Ks(t),Ks(e)]}var vi=10;function nn(a){return $d(Vd,a)+5*Math.sin(a*.021)+3*Math.sin(a*.057)}function Kx(a,t,e){let i=e.edge,n=ui(e.x0-i,e.x0,a)*(1-ui(e.x1,e.x1+i,a)),s=ui(e.z0-i,e.z0,t)*(1-ui(e.z1,e.z1+i,t));return n*s}function Qx(a){return-860+55*Math.sin(a*.0042)+28*Math.sin(a*.0113+1.3)}function Jd(a,t){let i=nn(t)-a,n=3+Math.max(0,i-60)*.031,s=Qx(t);n+=52*ui(s+55,s-55,a),n+=(ml(a*.0035+11,t*.0035-7,4)-.5)*16*1,n+=(Gn(a*.02,t*.02)-.5)*2.2;{let o=(a-150)/175,l=(t+360)/235,c=Math.sqrt(o*o+l*l),h=1-ui(.52,1.06,c),u=(ml(a*.03,t*.03,3)-.5)*18*ui(.45,.75,c)*(1-ui(.95,1.2,c));n+=h*84+u*h}n+=26*Math.exp(-((a+330)**2/(2*190**2)+(t+1e3)**2/(2*230**2))),n+=20*Math.exp(-((a+150)**2/(2*120**2)+(t+700)**2/(2*110**2))),n+=30*Math.exp(-((a-120)**2/(2*330**2)+(t-1e3)**2/(2*70**2)));{let o=(a-500)/170,l=(t-1605)/105,c=Math.sqrt(o*o+l*l);n+=38*(1-ui(.55,1,c))}for(let o of Zs){let l=Kx(a,t,o);l>0&&(n=ht(n,o.h(a,t),l))}if(i<90){let o=i>=0?i*.055:Math.max(-16,i*.09),l=ui(-5,90,i);n=ht(o,n,l)}return n}var yl=class{constructor(){this.nx=Math.round((Ot.maxX-Ot.minX)/vi)+1,this.nz=Math.round((Ot.maxZ-Ot.minZ)/vi)+1,this.h=new Float32Array(this.nx*this.nz);for(let t=0;t<this.nz;t++){let e=Ot.minZ+t*vi;for(let i=0;i<this.nx;i++){let n=Ot.minX+i*vi;this.h[t*this.nx+i]=Jd(n,e)}}this.ramps=[]}gridH(t,e){return t=lt(t,0,this.nx-1),e=lt(e,0,this.nz-1),this.h[e*this.nx+t]}heightAt(t,e){let i=(t-Ot.minX)/vi,n=(e-Ot.minZ)/vi,s=Math.floor(i),r=Math.floor(n);if(s<0||r<0||s>=this.nx-1||r>=this.nz-1)return Jd(lt(t,Ot.minX,Ot.maxX),lt(e,Ot.minZ,Ot.maxZ));let o=i-s,l=n-r,c=this.h[r*this.nx+s],h=this.h[r*this.nx+s+1],u=this.h[(r+1)*this.nx+s],d=this.h[(r+1)*this.nx+s+1];return o+l<=1?c+(h-c)*o+(u-c)*l:d+(u-d)*(1-o)+(h-d)*(1-l)}groundAt(t,e){let i=this.heightAt(t,e);for(let n=0;n<ss.length;n++){let s=ss[n];t>=s.x0&&t<=s.x1&&e>=s.z0&&e<=s.z1&&s.h>i&&(i=s.h)}for(let n=0;n<this.ramps.length;n++){let s=this.ramps[n],r=t-s.x,o=e-s.z;if(r*r+o*o>s.rad2)continue;let l=r*s.fx+o*s.fz,c=r*s.fz-o*s.fx;if(Math.abs(c)<=s.w/2&&l>=-s.len/2&&l<=s.len/2){let h=(l+s.len/2)/s.len,u=s.base+s.h*h;u>i&&(i=u)}}return i}normalAt(t,e,i=new N){let s=this.heightAt(t-1.5,e),r=this.heightAt(t+1.5,e),o=this.heightAt(t,e-1.5),l=this.heightAt(t,e+1.5);return i.set(s-r,2*1.5,o-l).normalize(),i}isWater(t,e){return this.groundAt(t,e)<-.6}buildRamps(){this.ramps=[];for(let t of Js){let e=this.heightAt(t.x,t.z);this.ramps.push({...t,base:e,fx:Math.sin(t.rot),fz:Math.cos(t.rot),rad2:(t.len*.5+t.w)**2})}}flattenRoads(t){let e=this.nx,i=new Float32Array(this.h.length),n=new Float32Array(this.h.length);for(let s of t){let r=s.width/2+7,o=Math.min(s.ax,s.bx)-r,l=Math.max(s.ax,s.bx)+r,c=Math.min(s.az,s.bz)-r,h=Math.max(s.az,s.bz)+r,u=Math.max(0,Math.floor((o-Ot.minX)/vi)),d=Math.min(e-1,Math.ceil((l-Ot.minX)/vi)),f=Math.max(0,Math.floor((c-Ot.minZ)/vi)),m=Math.min(this.nz-1,Math.ceil((h-Ot.minZ)/vi));for(let x=f;x<=m;x++){let g=Ot.minZ+x*vi;for(let p=u;p<=d;p++){let y=Ot.minX+p*vi,M=Vn(y,g,s.ax,s.az,s.bx,s.bz);if(M.d>r)continue;let v=1-ui(s.width/2+1,r,M.d);if(v<=0)continue;let S=ht(s.ha,s.hb,M.t),b=x*e+p;i[b]+=S*v,n[b]+=v}}}for(let s=0;s<this.h.length;s++)if(n[s]>0){let r=Math.min(1,n[s]),o=i[s]/n[s];this.h[s]=ht(this.h[s],o,r)}}colorFor(t,e,i,n,s){let r=ml(t*.012,e*.012,3),o=Gn(t*.08,e*.08),l,c,h,d=nn(e)-t;if(i<.3)l=.52,c=.47,h=.36;else if(d<70&&i<5){let f=o*.15;l=.72+f,c=.66+f,h=.52+f}else if(n<.8){let f=r*.14,m=Math.sin(i*.9+r*3)*.5+.5;l=ht(.62,.78,m)+f,c=ht(.54,.7,m)+f,h=ht(.44,.58,m)+f}else if(s){let f=o*.08;l=.52+f,c=.49+f,h=.43+f}else{let f=ui(.35,.65,r);l=ht(.68,.58,f),c=ht(.59,.55,f),h=ht(.41,.39,f);let m=(o-.5)*.08;l+=m,c+=m,h+=m*.5,n<.9&&(l+=.06,c+=.03)}return Zd(lt(l,0,1),lt(c,0,1),lt(h,0,1))}buildMesh(t){let e=new Qt,i=6,n=8,s=Math.ceil((this.nx-1)/i),r=Math.ceil((this.nz-1)/n),o=new Jt({vertexColors:!0}),l=new N;for(let c=0;c<n;c++)for(let h=0;h<i;h++){let u=h*s,d=Math.min(this.nx-1,u+s),f=c*r,m=Math.min(this.nz-1,f+r);if(d<=u||m<=f)continue;let x=d-u+1,g=m-f+1,p=new Float32Array(x*g*3),y=new Float32Array(x*g*3),M=0,v=!0;for(let _=f;_<=m;_++)for(let T=u;T<=d;T++){let R=Ot.minX+T*vi,C=Ot.minZ+_*vi,L=this.h[_*this.nx+T];L>-6&&(v=!1),p[M]=R,p[M+1]=L,p[M+2]=C,this.normalAt(R,C,l);let z=this.colorFor(R,C,L,l.y,t(R,C));y[M]=z[0],y[M+1]=z[1],y[M+2]=z[2],M+=3}if(v)continue;let S=[];for(let _=0;_<g-1;_++)for(let T=0;T<x-1;T++){let R=_*x+T,C=R+1,L=R+x,z=L+1;S.push(R,L,C,C,L,z)}let b=new fe;b.setAttribute("position",new ne(p,3)),b.setAttribute("color",new ne(y,3)),b.setIndex(S),b.computeVertexNormals(),b.computeBoundingSphere();let E=new xt(b,o);E.matrixAutoUpdate=!1,e.add(E)}return e}};function jd(a){let t=new Qt,e=il.merge([mt.fog,{uTime:{value:0},uDeep:{value:new Ct(1915466)},uShallow:{value:new Ct(4157304)},uSky:{value:new Ct(10466500)},uLight:{value:1}}]),i=new Ie({uniforms:e,fog:!0,vertexShader:`
      attribute float depth;
      varying float vDepth;
      varying vec3 vWorld;
      uniform float uTime;
      #include <fog_pars_vertex>
      void main(){
        vDepth = depth;
        vec3 p = position;
        float w = sin(p.x*0.05 + uTime*1.3)*0.18 + sin(p.z*0.07 - uTime*1.1)*0.14;
        p.y += w * clamp(depth*0.4, 0.0, 1.0);
        vWorld = p;
        vec4 mvPosition = modelViewMatrix * vec4(p,1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSky; uniform float uLight;
      varying float vDepth; varying vec3 vWorld;
      #include <fog_pars_fragment>
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      void main(){
        float d = clamp(vDepth/10.0, 0.0, 1.0);
        vec3 c = mix(uShallow, uDeep, d);
        float n = noise(vWorld.xz*0.08 + vec2(uTime*0.25, uTime*0.18)) * 0.6 + noise(vWorld.xz*0.25 - vec2(uTime*0.4, 0.0))*0.4;
        c = mix(c, uSky, n*0.22);
        float crest = smoothstep(0.72, 0.9, n);
        c += crest*0.12;
        float foam = (1.0 - smoothstep(0.0, 1.6, vDepth)) * (0.55 + 0.45*sin(uTime*2.0 + vWorld.x*0.3 + vWorld.z*0.2));
        c = mix(c, vec3(0.92,0.94,0.95), clamp(foam,0.0,1.0)*0.8);
        gl_FragColor = vec4(c*uLight, 1.0);
        #include <fog_fragment>
      }`}),n=12,s=[];for(let p=Ot.minZ-200;p<=Ot.maxZ+200;p+=n)s.push(p);let r=p=>nn(lt(p,Ot.minZ,Ot.maxZ))-60,o=Ot.maxX+250,l=Math.ceil((o-200)/n)+1,c=[],h=[],u=[];for(let p=0;p<s.length;p++){let y=s[p],M=Math.min(r(y),380);for(let v=0;v<l;v++){let S=ht(M,o,v/(l-1));c.push(S,0,y);let b=a.heightAt(lt(S,Ot.minX,Ot.maxX),lt(y,Ot.minZ,Ot.maxZ));h.push(S>Ot.maxX?16:-b)}}for(let p=0;p<s.length-1;p++)for(let y=0;y<l-1;y++){let M=p*l+y,v=M+1,S=M+l,b=S+1;u.push(M,S,v,v,S,b)}let d=new fe;d.setAttribute("position",new ce(c,3)),d.setAttribute("depth",new ce(h,1)),d.setIndex(u),d.computeBoundingSphere();let f=new xt(d,i);t.add(f);let m=new ei(8e3,12e3,1,1);m.rotateX(-Math.PI/2);let x=new Float32Array(m.attributes.position.count).fill(20);m.setAttribute("depth",new ne(x,1));let g=new xt(m,i);return g.position.set(o+4e3-2,-.05,0),t.add(g),t.userData.material=i,t}var _l=class a{constructor(){this.nodes=[],this.edges=[],this.build()}static gridLines(t){let e=[],i=t.skip||{},n=t.ext||{},s=t.x0+t.cols*t.px,r=t.z0+t.rows*t.pz,o=t.type==="centro"?"avenida":"calle";for(let l=0;l<=t.cols;l++){if(l===0&&i.W||l===t.cols&&i.E)continue;let c=t.x0+l*t.px,h=t.z0-(n.N||0),u=r+(n.S||0);e.push({name:t.name,kind:o,width:t.sw,pts:[[c,h],[c,u]],grid:t.id})}for(let l=0;l<=t.rows;l++){if(l===0&&i.N||l===t.rows&&i.S)continue;let c=t.z0+l*t.pz,h=t.x0-(n.W||0),u=s+(n.E||0);e.push({name:t.name,kind:o,width:t.sw,pts:[[h,c],[u,c]],grid:t.id})}return e}build(){let t=[];for(let n of Hn)t.push(...a.gridLines(n));for(let n of Wd)t.push({name:n.name,kind:n.kind,width:n.width,pts:n.pts,id:n.id});let e=[];for(let n of t)for(let s=0;s<n.pts.length-1;s++){let[r,o]=n.pts[s],[l,c]=n.pts[s+1];e.push({ax:r,az:o,bx:l,bz:c,width:n.width,kind:n.kind,name:n.name,cuts:[0,1]})}for(let n=0;n<e.length;n++){let s=e[n];for(let r=n+1;r<e.length;r++){let o=e[r];if(Math.max(s.ax,s.bx)+20<Math.min(o.ax,o.bx)||Math.max(o.ax,o.bx)+20<Math.min(s.ax,s.bx)||Math.max(s.az,s.bz)+20<Math.min(o.az,o.bz)||Math.max(o.az,o.bz)+20<Math.min(s.az,s.bz))continue;let l=gl(s.ax,s.az,s.bx,s.bz,o.ax,o.az,o.bx,o.bz);if(l){s.cuts.push(lt(l.t,0,1)),o.cuts.push(lt(l.u,0,1));continue}let c=(h,u,d)=>{let f=d?h.bx:h.ax,m=d?h.bz:h.az,x=Vn(f,m,u.ax,u.az,u.bx,u.bz);x.d<4&&x.t>.001&&x.t<.999&&(u.cuts.push(x.t),d?(h.bx=x.x,h.bz=x.z):(h.ax=x.x,h.az=x.z))};c(s,o,!1),c(s,o,!0),c(o,s,!1),c(o,s,!0)}}let i=(n,s)=>{for(let r=this.nodes.length-1;r>=0;r--){let o=this.nodes[r];if(Math.abs(o.x-n)<2.5&&Math.abs(o.z-s)<2.5)return r}return this.nodes.push({x:n,z:s,edges:[],h:0,id:this.nodes.length}),this.nodes.length-1};for(let n of e){let s=[...new Set(n.cuts.map(r=>Math.round(r*1e5)/1e5))].sort((r,o)=>r-o);for(let r=0;r<s.length-1;r++){let o=s[r],l=s[r+1];if(l-o<1e-4)continue;let c=ht(n.ax,n.bx,o),h=ht(n.az,n.bz,o),u=ht(n.ax,n.bx,l),d=ht(n.az,n.bz,l);if(zt(c,h,u,d)<1)continue;let f=i(c,h),m=i(u,d);f!==m&&this.addEdge(f,m,n)}}this.pruneStubs(),this.reindex()}addEdge(t,e,i){let n=this.nodes[t],s=this.nodes[e];for(let l of n.edges){let c=this.edges[l];if(c.a===t&&c.b===e||c.a===e&&c.b===t)return}let r=zt(n.x,n.z,s.x,s.z),o={id:this.edges.length,a:t,b:e,width:i.width,kind:i.kind,name:i.name,len:r,dx:(s.x-n.x)/r,dz:(s.z-n.z)/r,dead:!1};this.edges.push(o),n.edges.push(o.id),s.edges.push(o.id)}pruneStubs(){let t=!0;for(;t;){t=!1;for(let e of this.nodes){let i=e.edges.filter(n=>!this.edges[n].dead);if(i.length===1){let n=this.edges[i[0]];n.len<22&&n.kind!=="muelle"&&(n.dead=!0,t=!0)}}}}reindex(){let t=this.edges.filter(s=>!s.dead),e=new Set;t.forEach(s=>{e.add(s.a),e.add(s.b)});let i=new Map,n=[];this.nodes.forEach((s,r)=>{e.has(r)&&(i.set(r,n.length),n.push({x:s.x,z:s.z,edges:[],h:0,id:n.length}))}),t.forEach((s,r)=>{s.id=r,s.a=i.get(s.a),s.b=i.get(s.b),n[s.a].edges.push(r),n[s.b].edges.push(r)}),this.nodes=n,this.edges=t;for(let s of this.nodes){s.maxW=0;for(let r of s.edges)s.maxW=Math.max(s.maxW,this.edges[r].width)}}computeHeights(t){for(let i of this.nodes)i.h=t.heightAt(i.x,i.z);let e=[];for(let i of this.edges){let n=this.nodes[i.a],s=this.nodes[i.b],r=Math.max(1,Math.ceil(i.len/10)),o=[];for(let l=0;l<=r;l++){let c=l/r;o.push(t.heightAt(ht(n.x,s.x,c),ht(n.z,s.z,c)))}for(let l=0;l<4;l++){let c=o.slice();for(let h=1;h<r;h++)c[h]=(o[h-1]+o[h]*2+o[h+1])/4;c[0]=n.h,c[r]=s.h;for(let h=0;h<=r;h++)o[h]=c[h]}i.hs=o;for(let l=0;l<r;l++){let c=l/r,h=(l+1)/r;e.push({ax:ht(n.x,s.x,c),az:ht(n.z,s.z,c),bx:ht(n.x,s.x,h),bz:ht(n.z,s.z,h),ha:o[l],hb:o[l+1],width:i.width})}}return e}buildMask(t){this.maskC=2,this.maskX0=t.minX,this.maskZ0=t.minZ,this.maskW=Math.ceil((t.maxX-t.minX)/2)+1,this.maskH=Math.ceil((t.maxZ-t.minZ)/2)+1;let i=new Uint8Array(this.maskW*this.maskH);this.edgeGrid=new Map;for(let n of this.edges){let s=this.nodes[n.a],r=this.nodes[n.b],o=n.kind==="tierra"?2:n.kind==="muelle"?3:1,l=n.width/2+.5,c=Math.min(s.x,r.x)-l,h=Math.max(s.x,r.x)+l,u=Math.min(s.z,r.z)-l,d=Math.max(s.z,r.z)+l;for(let m=Math.floor((u-this.maskZ0)/2);m<=Math.ceil((d-this.maskZ0)/2);m++)for(let x=Math.floor((c-this.maskX0)/2);x<=Math.ceil((h-this.maskX0)/2);x++){if(x<0||m<0||x>=this.maskW||m>=this.maskH)continue;let g=this.maskX0+x*2,p=this.maskZ0+m*2;if(Vn(g,p,s.x,s.z,r.x,r.z).d<=l){let y=m*this.maskW+x;(!i[y]||o===1)&&(i[y]=o)}}let f=64;for(let m=Math.floor(c/f);m<=Math.floor(h/f);m++)for(let x=Math.floor(u/f);x<=Math.floor(d/f);x++){let g=m*1e5+x,p=this.edgeGrid.get(g);p||(p=[],this.edgeGrid.set(g,p)),p.push(n)}}this.mask=i}surfaceAt(t,e){if(!this.mask)return 0;let i=Math.round((t-this.maskX0)/this.maskC),n=Math.round((e-this.maskZ0)/this.maskC);return i<0||n<0||i>=this.maskW||n>=this.maskH?0:this.mask[n*this.maskW+i]}edgesNear(t,e){return this.edgeGrid.get(Math.floor(t/64)*1e5+Math.floor(e/64))||[]}nearestEdge(t,e,i=60,n=null){let s=null,r=i,o=this.edges;if(this.edgeGrid&&i<=64){let c=new Set;for(let h=Math.floor((t-i)/64);h<=Math.floor((t+i)/64);h++)for(let u=Math.floor((e-i)/64);u<=Math.floor((e+i)/64);u++){let d=this.edgeGrid.get(h*1e5+u);if(d)for(let f of d)c.add(f)}o=c}for(let l of o){if(n&&!n(l))continue;let c=this.nodes[l.a],h=this.nodes[l.b];if(t<Math.min(c.x,h.x)-r||t>Math.max(c.x,h.x)+r||e<Math.min(c.z,h.z)-r||e>Math.max(c.z,h.z)+r)continue;let u=Vn(t,e,c.x,c.z,h.x,h.z);u.d<r&&(r=u.d,s={edge:l,t:u.t,d:u.d,x:u.x,z:u.z})}return s}isOnRoad(t,e,i=0){let n=this.nearestEdge(t,e,30);return n&&n.d<n.edge.width/2+i}nearestNode(t,e){let i=0,n=1/0;for(let s of this.nodes){let r=(s.x-t)**2+(s.z-e)**2;r<n&&(n=r,i=s.id)}return i}otherNode(t,e){return t.a===e?t.b:t.a}path(t,e,i=4e3){if(t===e)return[t];let n=this.nodes,s=new Map([[t,0]]),r=new Map([[t,0]]),o=new Map,l=u=>Math.hypot(n[u].x-n[e].x,n[u].z-n[e].z),c=new Map([[t,l(t)]]),h=0;for(;s.size&&h++<i;){let u=-1,d=1/0;for(let[f]of s){let m=c.get(f);m<d&&(d=m,u=f)}if(u===e){let f=[u];for(;o.has(u);)u=o.get(u),f.push(u);return f.reverse()}s.delete(u);for(let f of n[u].edges){let m=this.edges[f];if(m.kind==="muelle")continue;let x=this.otherNode(m,u),g=r.get(u)+m.len*(m.kind==="tierra"?1.3:1);g<(r.has(x)?r.get(x):1/0)&&(o.set(x,u),r.set(x,g),c.set(x,g+l(x)),s.set(x,1))}}return null}buildMeshes(t,e){let i=new Qt,n={asphalt:[],dirt:[],white:[],solidW:[],yellow:[],patchA:[],patchD:[]},s=(p,y)=>p.push(y),r=.12,o=(p,y,M,v,S,b,E,_,T=!0,R=0,C=0,L=0)=>{let z=zt(y,M,v,S);if(z-R-C<.5)return;let P=(v-y)/z,D=(S-M)/z,O=-D,k=P,$=y+P*R+O*L,W=M+D*R+k*L,Y=z-R-C,j=Math.max(1,Math.ceil(Y/5));for(let at=0;at<j;at++){let ot=at/j*Y,Gt=(at+1)/j*Y,Xt=$+P*ot,jt=W+D*ot,Z=$+P*Gt,tt=W+D*Gt,Nt=[[Xt-O*b/2,jt-k*b/2,0,(R+ot)/_],[Xt+O*b/2,jt+k*b/2,1,(R+ot)/_],[Z-O*b/2,tt-k*b/2,0,(R+Gt)/_],[Z+O*b/2,tt+k*b/2,1,(R+Gt)/_]].map(([bt,qt,ze,Zt])=>[bt,t.groundAt(bt,qt)+E,qt,ze,Zt]);s(n[p],[Nt[0],Nt[1],Nt[2],Nt[1],Nt[3],Nt[2]])}};for(let p of this.edges){let y=this.nodes[p.a],M=this.nodes[p.b],v=p.kind==="tierra";if(o(v?"dirt":"asphalt",y.x,y.z,M.x,M.z,p.width,v?r-.03:r,8),v||p.kind==="muelle")continue;let S=y.edges.length>2||y.edges.length===1?y.maxW/2+1.5:0,b=M.edges.length>2||M.edges.length===1?M.maxW/2+1.5:0;p.kind==="ruta"?(o("yellow",y.x,y.z,M.x,M.z,.22,r+.03,1,!0,S,b,-.18),o("yellow",y.x,y.z,M.x,M.z,.22,r+.03,1,!0,S,b,.18),o("solidW",y.x,y.z,M.x,M.z,.2,r+.03,1,!0,S,b,p.width/2-.6),o("solidW",y.x,y.z,M.x,M.z,.2,r+.03,1,!0,S,b,-p.width/2+.6)):p.kind==="avenida"&&o("white",y.x,y.z,M.x,M.z,.2,r+.03,6,!0,S,b,0)}for(let p of this.nodes){if(p.edges.length<3)continue;let y=p.edges.every(b=>this.edges[b].kind==="tierra"),M=p.maxW/2+.8,v=10,S=[];for(let b=0;b<v;b++){let E=b/v*Math.PI*2,_=(b+1)/v*Math.PI*2,T=[[p.x,p.z],[p.x+Math.cos(E)*M*1.15,p.z+Math.sin(E)*M*1.15],[p.x+Math.cos(_)*M*1.15,p.z+Math.sin(_)*M*1.15]];S.push(T.map(([R,C])=>[R,t.groundAt(R,C)+r+.015,C,R/8,C/8]))}for(let b of S)s(n[y?"patchD":"patchA"],[b[0],b[2],b[1]])}let l=(p,y,M)=>{if(!p.length)return;let v=p.reduce((C,L)=>C+L.length,0),S=new Float32Array(v*3),b=new Float32Array(v*2),E=0,_=0;for(let C of p)for(let L of C)S[E++]=L[0],S[E++]=L[1],S[E++]=L[2],b[_++]=L[3],b[_++]=L[4];let T=new fe;T.setAttribute("position",new ne(S,3)),T.setAttribute("uv",new ne(b,2)),T.computeVertexNormals(),T.computeBoundingSphere();let R=new xt(T,y);R.renderOrder=M,R.matrixAutoUpdate=!1,i.add(R)},c=(p,y)=>(p.polygonOffset=!0,p.polygonOffsetFactor=y,p.polygonOffsetUnits=y*2,p),h=c(new Jt({map:e.asphalt}),-1),u=c(new Jt({map:e.dirt}),-1),d=c(new Jt({map:e.dash,transparent:!0,alphaTest:.4}),-3),f=c(new Jt({color:14605520}),-3),m=c(new Jt({color:14264358}),-3),x=c(new Jt({map:e.asphalt}),-2),g=c(new Jt({map:e.dirt}),-2);return l(n.asphalt,h,1),l(n.dirt,u,1),l(n.patchA,x,2),l(n.patchD,g,2),l(n.white,d,3),l(n.solidW,f,3),l(n.yellow,m,3),i}};function Ve(a,t){let e=document.createElement("canvas");return e.width=a,e.height=t,e}function We(a,t=!0,e=!1){let i=new Kn(a);return t&&(i.wrapS=i.wrapT=Ls),i.colorSpace=ti,e&&(i.magFilter=ke),i.anisotropy=4,i}function rs(a,t,e,i,n,s,r=1){a.fillStyle=i,a.fillRect(0,0,t,e);for(let o=0;o<t*e/(r*r)*.6;o++){let l=s.next()*t,c=s.next()*e,h=Math.floor((s.next()-.5)*n);a.fillStyle=h>0?`rgba(255,255,255,${h/255})`:`rgba(0,0,0,${-h/255})`,a.fillRect(l,c,r,r)}}function Kd(){let a=new Oi(1234),t={};{let e=Ve(128,128),i=e.getContext("2d");rs(i,128,128,"#46474a",60,a,1);for(let n=0;n<6;n++)i.fillStyle=`rgba(20,20,22,${.15+a.next()*.2})`,i.fillRect(a.next()*128,a.next()*128,10+a.next()*30,4+a.next()*20);i.strokeStyle="rgba(15,15,15,0.5)";for(let n=0;n<5;n++){i.beginPath();let s=a.next()*128,r=a.next()*128;i.moveTo(s,r);for(let o=0;o<5;o++)s+=(a.next()-.5)*30,r+=(a.next()-.5)*30,i.lineTo(s,r);i.stroke()}t.asphalt=We(e)}{let e=Ve(128,128),i=e.getContext("2d");rs(i,128,128,"#9b8866",70,a,2);for(let n=0;n<300;n++)i.fillStyle=a.chance(.5)?"rgba(80,70,55,0.5)":"rgba(200,190,170,0.5)",i.fillRect(a.next()*128,a.next()*128,2,2);t.dirt=We(e)}{let e=Ve(8,64),i=e.getContext("2d");i.clearRect(0,0,8,64),i.fillStyle="#e8e6da",i.fillRect(0,0,8,32);let n=We(e);t.dash=n}{let e=Ve(64,64),i=e.getContext("2d");rs(i,64,64,"#a7a296",30,a,1),i.strokeStyle="rgba(60,55,50,0.45)",i.lineWidth=1;for(let n=0;n<=64;n+=16)i.beginPath(),i.moveTo(n,0),i.lineTo(n,64),i.stroke(),i.beginPath(),i.moveTo(0,n),i.lineTo(64,n),i.stroke();t.sidewalk=We(e)}{let s=Ve(256,256),r=s.getContext("2d"),o=Ve(256,256),l=o.getContext("2d");l.fillStyle="#000",l.fillRect(0,0,256,256),rs(r,256,256,"#e2ddd2",25,a,2);for(let c=0;c<8;c++)for(let h=0;h<8;h++){let u=h*32,d=c*32;r.fillStyle="#6d6a64",r.fillRect(u+3,d+5,26,21);let f=40+Math.floor(a.next()*40);if(r.fillStyle=`rgb(${f},${f+18},${f+30})`,r.fillRect(u+5,d+7,22,17),r.fillStyle="rgba(255,255,255,0.12)",r.fillRect(u+5,d+7,22/2,17),r.fillStyle="#5a5751",r.fillRect(u+32/2-1,d+7,2,17),a.chance(.38)){let m=a.chance(.75);l.fillStyle=m?`rgb(255,${200+Math.floor(a.next()*40)},${120+Math.floor(a.next()*50)})`:"rgb(170,200,255)",l.fillRect(u+5,d+7,22,17)}}t.office=We(s),t.officeE=We(o)}{let n=Ve(256,128),s=n.getContext("2d"),r=Ve(256,128),o=r.getContext("2d");o.fillStyle="#000",o.fillRect(0,0,256,128),rs(s,256,128,"#ebe6da",30,a,1),s.fillStyle="rgba(80,70,60,0.35)",s.fillRect(0,122,256,6),s.fillStyle="rgba(0,0,0,0.12)",s.fillRect(0,62,256,3);let l=(c,h)=>{s.fillStyle="#f4f4f0",s.fillRect(c+14,h+16,36,28),s.fillStyle="#3d4a55",s.fillRect(c+17,h+19,30,22),s.fillStyle="rgba(255,255,255,0.15)",s.fillRect(c+17,h+19,14,22),s.fillStyle="#f4f4f0",s.fillRect(c+31,h+19,2,22),a.chance(.5)&&(s.fillStyle="rgba(120,90,60,0.9)",s.fillRect(c+17,h+19,30,10)),a.chance(.5)&&(o.fillStyle="#ffd08a",o.fillRect(c+17,h+19,30,22))};for(let c=0;c<4;c++){let h=c*64;l(h,0),c===2?(s.fillStyle="#5b3b22",s.fillRect(h+22,82,20,46),s.fillStyle="#3b2515",s.fillRect(h+24,84,16,42),s.fillStyle="#c9b060",s.fillRect(h+36,106,2,3)):l(h,64)}t.house=We(n),t.houseE=We(r)}{let e=Ve(64,64),i=e.getContext("2d");for(let n=0;n<64;n++){let s=200+Math.round(Math.sin(n/64*Math.PI*16)*30);i.fillStyle=`rgb(${s},${s},${s})`,i.fillRect(n,0,1,64)}i.fillStyle="rgba(120,60,20,0.25)";for(let n=0;n<20;n++)i.fillRect(a.next()*64,a.next()*64,2,6+a.next()*14);t.metal=We(e)}{let e=Ve(64,64),i=e.getContext("2d");for(let n=0;n<64;n++){let s=215+Math.round(Math.sin(n/64*Math.PI*12)*35);i.fillStyle=`rgb(${s},${s},${s})`,i.fillRect(n,0,1,64)}t.roof=We(e)}{let e=Ve(64,64),i=e.getContext("2d");rs(i,64,64,"#77736b",50,a,1),t.roofFlat=We(e)}{let e=Ve(64,64),i=e.getContext("2d");i.fillStyle="#c8bfb2",i.fillRect(0,0,64,64);for(let n=0;n<64;n+=8){let s=n/8%2?8:0;for(let r=-16;r<64;r+=16){let o=150+Math.floor(a.next()*40);i.fillStyle=`rgb(${o+30},${o-40},${o-70})`,i.fillRect(r+s+1,n+1,14,6)}}t.brick=We(e)}{let e=Ve(128,128),i=e.getContext("2d");rs(i,128,128,"#8e7c58",50,a,2),t.pitch=We(e)}{let e=Ve(64,64),i=e.getContext("2d"),n=i.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.35,"rgba(255,255,255,0.6)"),n.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=n,i.fillRect(0,0,64,64),t.glow=We(e,!1)}{let e=Ve(64,64),i=e.getContext("2d");for(let n=0;n<12;n++){let s=16+a.next()*32,r=16+a.next()*32,o=8+a.next()*14,l=i.createRadialGradient(s,r,0,s,r,o);l.addColorStop(0,"rgba(255,255,255,0.35)"),l.addColorStop(1,"rgba(255,255,255,0)"),i.fillStyle=l,i.fillRect(0,0,64,64)}t.smoke=We(e,!1)}{let e=Ve(64,64),i=e.getContext("2d"),n=i.createRadialGradient(32,32,4,32,32,32);n.addColorStop(0,"rgba(0,0,0,0.55)"),n.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=n,i.fillRect(0,0,64,64),t.shadow=We(e,!1)}{let e=Ve(64,64),i=e.getContext("2d");i.fillStyle="#f1f1ec",i.beginPath(),i.moveTo(12,20),i.lineTo(52,20),i.lineTo(56,60),i.lineTo(8,60),i.closePath(),i.fill(),i.strokeStyle="#f1f1ec",i.lineWidth=4,i.beginPath(),i.arc(22,20,7,Math.PI,0),i.stroke(),i.beginPath(),i.arc(42,20,7,Math.PI,0),i.stroke(),i.fillStyle="#1c5aa8",i.font="bold 11px Arial",i.textAlign="center",i.fillText("LA",32,38),i.fillText("AN\xD3MALA",32,50),t.bag=We(e,!1)}return t}var Ah=new Map;function bl(a,t={}){let e=JSON.stringify([a,t]);if(Ah.has(e))return Ah.get(e);let i=t.w||512,n=t.h||128,s=Ve(i,n),r=s.getContext("2d");r.fillStyle=t.bg||"#1c3f7a",r.fillRect(0,0,i,n),t.border!==!1&&(r.strokeStyle=t.borderColor||"#ffffff",r.lineWidth=6,r.strokeRect(6,6,i-12,n-12)),r.fillStyle=t.fg||"#ffffff",r.textAlign="center",r.textBaseline="middle";let o=a.length;a.forEach((c,h)=>{let u=t.sizes&&t.sizes[h]||Math.floor(n*.7/o);r.font=`${t.italic?"italic ":""}bold ${u}px ${t.font||"Arial, Helvetica, sans-serif"}`,r.fillText(c,i/2,n/(o+0)*(h+.5),i-24)});let l=We(s,!1);return Ah.set(e,l),l}var Rh=new Map;function Qd(a){let t=JSON.stringify(a);if(Rh.has(t))return Rh.get(t);let e=Ve(64,64),i=e.getContext("2d");i.fillStyle=a.skin,i.fillRect(0,0,64,64),i.fillStyle=a.hair||"#2a1d14",i.fillRect(0,0,7,7),i.fillStyle=a.hat||"#1c2f6b",i.fillRect(57,0,7,7),i.fillStyle=a.hair||"#2a1d14",i.fillRect(12,20,14,3),i.fillRect(38,20,14,3),a.glasses?(i.fillStyle="#0c0c0e",i.fillRect(9,24,20,11),i.fillRect(35,24,20,11),i.fillRect(27,26,10,3),i.fillStyle="rgba(120,160,200,0.5)",i.fillRect(11,26,6,3),i.fillRect(37,26,6,3)):(i.fillStyle="#fff",i.fillRect(14,26,10,6),i.fillRect(40,26,10,6),i.fillStyle=a.eyes||"#3b2a1c",i.fillRect(18,26,5,6),i.fillRect(42,26,5,6)),i.fillStyle="rgba(0,0,0,0.18)",i.fillRect(29,32,6,10),i.fillStyle="#7a3b30",i.fillRect(22,48,20,3),a.smile&&(i.fillRect(20,46,3,3),i.fillRect(41,46,3,3)),a.mustache&&(i.fillStyle=a.hair||"#2a1d14",i.fillRect(18,42,28,5)),a.beard&&(i.fillStyle=a.beardColor||a.hair||"#2a1d14",i.globalAlpha=.75,i.fillRect(6,44,52,20),i.fillRect(6,34,6,12),i.fillRect(52,34,6,12),i.globalAlpha=1,i.fillStyle="#7a3b30",i.fillRect(24,50,16,3));let n=We(e,!1);return Rh.set(t,n),n}var Ch=new Map;function tf(a,t,e){let i=a+t+e;if(Ch.has(i))return Ch.get(i);let n=Ve(64,64),s=n.getContext("2d");if(s.fillStyle=t,s.fillRect(0,0,64,64),a==="banda"&&(s.fillStyle=e,s.fillRect(0,24,64,16)),a==="rayas"){s.fillStyle=e;for(let o=0;o<64;o+=16)s.fillRect(o,0,8,64)}if(a==="jean"){for(let o=0;o<400;o++)s.fillStyle=`rgba(255,255,255,${Math.random()*.12})`,s.fillRect(Math.random()*64,Math.random()*64,1,3);s.fillStyle="rgba(230,230,230,0.8)",s.fillRect(31,0,2,64),s.fillStyle="rgba(40,50,80,0.6)",s.fillRect(12,16,12,10),s.fillRect(40,16,12,10)}a==="mameluco"&&(s.fillStyle=e,s.fillRect(0,40,64,5),s.fillRect(0,50,64,5)),a==="polo"&&(s.fillStyle=e,s.fillRect(24,0,16,12));let r=We(n,!1);return Ch.set(i,r),r}var as=.22,di=2.6,Qs={centro:[14209732,13220256,12104877,14735040,11049608,13617339,10463405,14272424,12562072,14998731],house:[15852486,13623528,15782092,14215368,15985064,16250352,15255720,13162736,15325168,14273456],roof:[10697258,3107642,2969466,9080724,8008486,3829358,10132896,11553322],metal:[13225166,10465464,12167306,9411232,10991776],rada:[16250352,15261904,13680808,15788248,13160664]};function tv(a,t,e,i,n,s,r,o){let l=(d,f)=>d>=n&&d<=s&&f>=r&&f<=o;if(l(a,t)||l(e,i))return 0;let c=[[n,r,s,r],[s,r,s,o],[s,o,n,o],[n,o,n,r]];for(let d of c)if(gl(a,t,e,i,d[0],d[1],d[2],d[3]))return 0;let h=1/0;for(let[d,f]of[[n,r],[s,r],[s,o],[n,o]])h=Math.min(h,Vn(d,f,a,t,e,i).d);let u=(d,f)=>Math.hypot(d-Math.max(n,Math.min(d,s)),f-Math.max(r,Math.min(f,o)));return h=Math.min(h,u(a,t),u(e,i)),h}var Ml=class{constructor(){this.blocks=[],this.gridIndex=new Map,this.signs=[],this.markers={},this.parkingSpots=[],this.lampSpots=[],this.treeSpots=[],this.plazas=[],this.benches=[]}blockAt(t,e){for(let i of Hn){let n=Math.floor((t-i.x0)/i.px),s=Math.floor((e-i.z0)/i.pz);if(n<0||s<0||n>=i.cols||s>=i.rows)continue;let r=this.gridIndex.get(`${i.id},${n},${s}`);if(r&&t>=r.x0&&t<=r.x1&&e>=r.z0&&e<=r.z1)return r}return null}curbAt(t,e){let i=this.blockAt(t,e);return i&&(i.paved||t-i.x0<di||i.x1-t<di||e-i.z0<di||i.z1-e<di)?as:0}build(t,e,i,n,s){let r=new Oi(2004);this.terrain=t,this.colliders=n;let o=new vl(220);this.chunks=o;let l=new Qt;this.group=l;let c=e.edges.filter(d=>d.kind!=="avenida"&&d.kind!=="calle"?!0:!Hn.some(f=>d.name===f.name)),h=this.specialDefs();this.specialRects=[];for(let d of Hn)for(let f=0;f<d.cols;f++)for(let m=0;m<d.rows;m++){let x=d.x0+f*d.px+d.sw/2,g=d.x0+(f+1)*d.px-d.sw/2,p=d.z0+m*d.pz+d.sw/2,y=d.z0+(m+1)*d.pz-d.sw/2,M=!1;for(let b of c){let E=e.nodes[b.a],_=e.nodes[b.b];if(tv(E.x,E.z,_.x,_.z,x,g,p,y)<b.width/2-1.8){M=!0;break}}if(M)continue;for(let b of ss)b.x0<g&&b.x1>x&&b.z0<y&&b.z1>p&&(M=!0);for(let b of Js)b.x>x-8&&b.x<g+8&&b.z>p-8&&b.z<y+8&&(M=!0);if(M)continue;let v={grid:d.id,gridName:d.name,c:f,r:m,x0:x,x1:g,z0:p,z1:y,type:d.type,special:null,paved:d.type==="centro"},S=h.find(b=>b.grid===d.id&&b.c===f&&b.r===m);S&&(v.special=S),this.blocks.push(v),this.gridIndex.set(`${d.id},${f},${m}`,v)}for(let d of this.blocks){this.buildSidewalk(d,o);let f=[];if(d.special){let m=d.special.build.call(this,d,o,r,i);m&&f.push(...m)}if(!(d.special&&d.special.exclusive)){switch(d.type){case"centro":this.fillCentro(d,o,r,f);break;case"industrial":this.fillIndustrial(d,o,r,f);break;case"rada":this.fillHouses(d,o,r,f,"rada");break;case"km":this.fillHouses(d,o,r,f,"km");break;default:this.fillHouses(d,o,r,f,"barrio")}this.lampSpots.push([d.x0+1,d.z0+1],[d.x1-1,d.z1-1]),d.type==="centro"&&this.lampSpots.push([d.x1-1,d.z0+1],[d.x0+1,d.z1-1])}}this.buildPuerto(o,r),this.buildOutside(o,r,i);let u=this.materials(i);o.build(u,l);for(let d of this.signs)l.add(d);return s.add(l),this.materialsList=u,l}materials(t){let e=n=>new Jt({vertexColors:!0,...n});return{office:e({map:t.office,emissive:16777215,emissiveMap:t.officeE,emissiveIntensity:0}),house:e({map:t.house,emissive:16777215,emissiveMap:t.houseE,emissiveIntensity:0}),metal:e({map:t.metal}),brick:e({map:t.brick}),plain:e({}),roof:e({map:t.roof}),roofFlat:e({map:t.roofFlat}),sidewalk:e({map:t.sidewalk,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),pitch:e({map:t.pitch,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4})}}footprintHeights(t,e,i,n){let s=this.terrain,r=[s.heightAt(t,i),s.heightAt(e,i),s.heightAt(t,n),s.heightAt(e,n),s.heightAt((t+e)/2,(i+n)/2)];return{min:Math.min(...r),max:Math.max(...r)}}buildSidewalk(t,e){let i=this.terrain,n=e.get((t.x0+t.x1)/2,(t.z0+t.z1)/2,"sidewalk"),s=[1,1,1],r=(l,c,h,u)=>{let d=c-l>u-h,f=d?c-l:u-h,m=Math.max(1,Math.ceil(f/6));for(let x=0;x<m;x++){let g,p,y,M;d?(g=l+f*x/m,p=l+f*(x+1)/m,y=h,M=u):(y=h+f*x/m,M=h+f*(x+1)/m,g=l,p=c);let v=(T,R)=>i.heightAt(T,R)+as,S=[g,v(g,y),y],b=[p,v(p,y),y],E=[p,v(p,M),M],_=[g,v(g,M),M];n.quad(_,E,b,S,[g/2,M/2],[p/2,M/2],[p/2,y/2],[g/2,y/2],s)}},o=(l,c,h,u)=>{let d=Math.hypot(h-l,u-c),f=Math.max(1,Math.ceil(d/6));for(let m=0;m<f;m++){let x=l+(h-l)*m/f,g=c+(u-c)*m/f,p=l+(h-l)*(m+1)/f,y=c+(u-c)*(m+1)/f,M=i.heightAt(x,g),v=i.heightAt(p,y);n.quad([x,M-.1,g],[p,v-.1,y],[p,v+as,y],[x,M+as,g],[0,0],[.5,0],[.5,.05],[0,.05],[.8,.8,.8])}};if(t.paved){r(t.x0,t.x1,t.z0,t.z0+(t.z1-t.z0)/2),r(t.x0,t.x1,t.z0+(t.z1-t.z0)/2,t.z1);let l=Math.ceil((t.x1-t.x0)/8),c=Math.ceil((t.z1-t.z0)/8);for(let h=0;h<l;h++)for(let u=0;u<c;u++){let d=t.x0+(t.x1-t.x0)*h/l,f=t.x0+(t.x1-t.x0)*(h+1)/l,m=t.z0+(t.z1-t.z0)*u/c,x=t.z0+(t.z1-t.z0)*(u+1)/c,g=(p,y)=>i.heightAt(p,y)+as;n.quad([d,g(d,x),x],[f,g(f,x),x],[f,g(f,m),m],[d,g(d,m),m],[d/2,x/2],[f/2,x/2],[f/2,m/2],[d/2,m/2],s)}}else r(t.x0,t.x1,t.z0,t.z0+di),r(t.x0,t.x1,t.z1-di,t.z1),r(t.x0,t.x0+di,t.z0+di,t.z1-di),r(t.x1-di,t.x1,t.z0+di,t.z1-di);o(t.x0,t.z1,t.x1,t.z1),o(t.x1,t.z0,t.x0,t.z0),o(t.x1,t.z1,t.x1,t.z0),o(t.x0,t.z0,t.x0,t.z1)}addBuilding(t,e,i,n,s,r,o={}){let l=o.floorH||3.2,{min:c,max:h}=this.footprintHeights(e,i,n,s),u=c-.6,d=h+(o.curb?as:.05),f=d+r*l,m=(e+i)/2,x=(n+s)/2,g=o.mat||"office",p=it(o.color||14209732),y=t.get(m,x,g);d-u>.3&&t.get(m,x,"plain").walls(e,i,n,s,u,d,it(9275260),4,3);let M=28,v=25.6,S=0;if(g==="house"&&(M=14,v=l*2,S=Math.floor(Math.random()*4)/4),g==="office"&&(S=Math.floor(Math.random()*8)/8),g==="metal"&&(M=3,v=3),g==="brick"&&(M=2.5,v=2),g==="plain"&&(M=4,v=3),y.walls(e,i,n,s,d,f,p,M,v,o.vOff||0,S),o.roof==="gable"){let E=t.get(m,x,"roof"),_=o.ridgeX!==void 0?o.ridgeX:i-e>=s-n,T=o.rise||Math.min(i-e,s-n)*.22;return E.gable(e,i,n,s,f,T,it(o.roofColor||10697258),_,.45),this.colliders.addBox(e,i,n,s,u,f+T,o.tag||"building"),{top:f+T,floor:d,base:u}}if(t.get(m,x,"roofFlat").top(e,i,n,s,f,it(o.roofColor||11184810),4),r>1&&g==="office"){let E=t.get(m,x,"plain");E.walls(e-.15,i+.15,n-.15,s+.15,f-.2,f+.7,p),E.top(e-.15,i+.15,n-.15,n+.15,f+.7,p)}if(r>3&&Math.random()<.6){let E=t.get(m,x,"plain"),_=Math.min(4,(i-e)*.3),T=Math.min(4,(s-n)*.3);E.box(m-_/2,m+_/2,f,f+2.2,x-T/2,x+T/2,it(10132120)),Math.random()<.5&&E.cylinder(m+_,x,1.2,f,f+3.2,it(6056564),8)}return this.colliders.addBox(e,i,n,s,u,f+.7,o.tag||"building"),{top:f,floor:d,base:u}}overlaps(t,e,i=.5){for(let n of e)if(t[0]<n[1]+i&&t[1]>n[0]-i&&t[2]<n[3]+i&&t[3]>n[2]-i)return!0;return!1}fillCentro(t,e,i,n){let s=[],r=(l,c,h,u,d)=>{let f=c-l,m=u-h;if(f<26&&m<26||d>5){s.push([l,c,h,u]);return}if(f>=m){let x=l+f*i.range(.38,.62);r(l,x,h,u,d+1),r(x,c,h,u,d+1)}else{let x=h+m*i.range(.38,.62);r(l,c,h,x,d+1),r(l,c,x,u,d+1)}};r(t.x0+3.2,t.x1-3.2,t.z0+3.2,t.z1-3.2,0);for(let l of s){let c=[l[0]+.4,l[1]-.4,l[2]+.4,l[3]-.4];if(this.overlaps(c,n,1))continue;let h=i.next(),u;h<.45?u=i.int(2,4):h<.8?u=i.int(5,9):h<.95?u=i.int(10,15):u=i.int(16,20);let d=i.chance(.18);this.addBuilding(e,c[0],c[1],c[2],c[3],u,{mat:d&&u<6?"brick":"office",color:i.pick(Qs.centro),curb:!0}),n.push(c)}}fillIndustrial(t,e,i,n){let r=i.chance(.6)?[[t.x0+4,(t.x0+t.x1)/2-2,t.z0+4,t.z1-4],[(t.x0+t.x1)/2+2,t.x1-4,t.z0+4,t.z1-4]]:[[t.x0+4,t.x1-4,t.z0+4,(t.z0+t.z1)/2-2],[t.x0+4,t.x1-4,(t.z0+t.z1)/2+2,t.z1-4]];for(let o of r){if(this.overlaps(o,n,1))continue;let l=i.range(0,6),c=[o[0]+l,o[1]-l*.5,o[2]+l*.5,o[3]-l];this.addBuilding(e,c[0],c[1],c[2],c[3],i.int(2,3),{mat:"metal",floorH:3,color:i.pick(Qs.metal),roof:"gable",roofColor:10133668,rise:1.6}),n.push(c)}}fillHouses(t,e,i,n,s){let r=s==="rada"?4:3.2,o=s==="rada"?11:9,l=[{dir:"N",a:t.x0+1,bEnd:t.x1-1},{dir:"S",a:t.x0+1,bEnd:t.x1-1},{dir:"W",a:t.z0+r+o+1,bEnd:t.z1-r-o-1},{dir:"E",a:t.z0+r+o+1,bEnd:t.z1-r-o-1}];for(let c of l){let h=c.a;for(;h<c.bEnd-7;){let u=Math.min(c.bEnd-h,s==="rada"?i.range(12,17):i.range(8.5,12.5));if(u<7)break;let d=u-i.range(1.2,2.6),f,m=o*i.range(.8,1.05);if(c.dir==="N"&&(f=[h,h+d,t.z0+r,t.z0+r+m]),c.dir==="S"&&(f=[h,h+d,t.z1-r-m,t.z1-r]),c.dir==="W"&&(f=[t.x0+r,t.x0+r+m,h,h+d]),c.dir==="E"&&(f=[t.x1-r-m,t.x1-r,h,h+d]),h+=u,this.overlaps(f,n,.8)||i.chance(s==="km"?.18:.1))continue;n.push(f);let x=s==="rada"?i.chance(.6)?2:1:i.chance(.2)?2:1,g=s==="rada"?i.chance(.35):i.chance(.12),p=s==="km"?i.chance(.7)?15921126:i.pick(Qs.house):s==="rada"?i.pick(Qs.rada):i.pick(Qs.house),y=s==="km"?i.chance(.7)?10697258:3107642:i.pick(Qs.roof),M=c.dir==="N"||c.dir==="S";this.addBuilding(e,f[0],f[1],f[2],f[3],x,{mat:"house",floorH:2.8,color:p,roof:g?"flat":"gable",roofColor:g?10328208:y,ridgeX:M,rise:i.range(1.2,2.2)}),s!=="km"&&i.chance(.5)&&this.addWall(e,f,c.dir,t,i)}}}addWall(t,e,i,n,s){let r=this.terrain,o=t.get(e[0],e[2],"plain"),l=it(s.pick([14209216,12564134,15261904,11050120])),c=1.1,h=(f,m,x,g)=>{let p=Math.min(r.heightAt(f,m),r.heightAt(x,g))-.2,y=Math.max(r.heightAt(f,m),r.heightAt(x,g))+c,M=.12,v=Math.min(f,x)-M,S=Math.max(f,x)+M,b=Math.min(m,g)-M,E=Math.max(m,g)+M;o.box(v,S,p,y,b,E,l),this.colliders.addBox(v,S,b,E,p,y,"wall")},u=di+.4,d=3;i==="N"&&(h(e[0],n.z0+u,(e[0]+e[1])/2-d/2,n.z0+u),h((e[0]+e[1])/2+d/2,n.z0+u,e[1],n.z0+u)),i==="S"&&(h(e[0],n.z1-u,(e[0]+e[1])/2-d/2,n.z1-u),h((e[0]+e[1])/2+d/2,n.z1-u,e[1],n.z1-u)),i==="W"&&(h(n.x0+u,e[2],n.x0+u,(e[2]+e[3])/2-d/2),h(n.x0+u,(e[2]+e[3])/2+d/2,n.x0+u,e[3])),i==="E"&&(h(n.x1-u,e[2],n.x1-u,(e[2]+e[3])/2-d/2),h(n.x1-u,(e[2]+e[3])/2+d/2,n.x1-u,e[3]))}addSign(t,e,i,n,s,r,o,l={}){let c=bl(t,{...l,w:l.tw||512,h:l.th||Math.round(512*(r/s))}),h=new He({map:c,side:l.double?Qe:Ki,fog:!0});h.userData.sign=!0;let u=new xt(new ei(s,r),h);return u.position.set(e,i,n),u.rotation.y=o,u.updateMatrix(),u.matrixAutoUpdate=!1,this.signs.push(u),u}specialDefs(){let t=[],e=(i,n,s,r,o,l=!1)=>t.push({grid:i,c:n,r:s,name:r,build:o,exclusive:l});return e("centro",2,2,"plaza",function(i,n,s){let r=this.terrain,o=n.get(i.x0,i.z0,"plain"),l=(i.x0+i.x1)/2,c=(i.z0+i.z1)/2,h=8;for(let d=0;d<h;d++)for(let f=0;f<h;f++){let m=i.x0+4+(i.x1-i.x0-8)*d/h,x=i.x0+4+(i.x1-i.x0-8)*(d+1)/h,g=i.z0+4+(i.z1-i.z0-8)*f/h,p=i.z0+4+(i.z1-i.z0-8)*(f+1)/h,y=(m+x)/2-l,M=(g+p)/2-c,S=Math.abs(Math.abs(y)-Math.abs(M))<6||Math.hypot(y,M)<10?it(12891284):it(7241022),b=(E,_)=>r.heightAt(E,_)+.3;o.quad([m,b(m,p),p],[x,b(x,p),p],[x,b(x,g),g],[m,b(m,g),g],[0,0],[1,0],[1,1],[0,1],S)}let u=r.heightAt(l,c)+.3;o.box(l-3,l+3,u,u+1.2,c-3,c+3,it(12103840)),o.box(l-1.8,l+1.8,u+1.2,u+5,c-1.8,c+1.8,it(13616820)),o.box(l-.6,l+.6,u+5,u+7.4,c-.5,c+.5,it(5069386)),o.box(l-.35,l+.35,u+7.4,u+8.1,c-.35,c+.35,it(5069386)),this.colliders.addBox(l-3,l+3,c-3,c+3,u-1,u+8,"monumento");for(let d=0;d<16;d++){let f=d/16*Math.PI*2;this.treeSpots.push([l+Math.cos(f)*25,c+Math.sin(f)*25,"alamo"])}return this.benches.push([l+12,c],[l-12,c],[l,c+12],[l,c-12]),this.plazas.push(i),i.paved=!1,[[i.x0,i.x1,i.z0,i.z1]]},!0),e("centro",1,0,"comisaria",function(i,n){let s=[i.x0+8,i.x1-8,i.z0+22,i.z1-6],r=this.addBuilding(n,s[0],s[1],s[2],s[3],3,{mat:"office",color:10467024,curb:!0});return this.addSign(["COMISAR\xCDA PRIMERA"],(s[0]+s[1])/2,r.floor+4.2,s[3]+.05,16,1.6,0,{bg:"#1d3f8f"}),this.markers.comisaria={x:(s[0]+s[1])/2,z:s[3]+2},[s]}),e("centro",0,1,"hospital",function(i,n){let s=[i.x0+6,i.x1-6,i.z0+8,i.z1-7],r=this.addBuilding(n,s[0],s[1],s[2],s[3],4,{mat:"office",color:15921902,curb:!0});return this.addSign(["HOSPITAL REGIONAL"],(s[0]+s[1])/2,r.floor+3.6,s[3]+.05,18,1.8,0,{bg:"#ffffff",fg:"#c01818",borderColor:"#c01818"}),this.addSign(["+"],(s[0]+s[1])/2,r.top-2,s[3]+.05,4,4,0,{bg:"#ffffff",fg:"#d01010",border:!1,tw:128,th:128}),this.markers.hospital={x:(s[0]+s[1])/2,z:s[3]+2.5},[s]}),e("centro",0,2,"armeria",function(i,n){let s=[i.x0+16,i.x0+46,i.z1-22,i.z1-4.5],r=this.addBuilding(n,s[0],s[1],s[2],s[3],2,{mat:"brick",color:14207160,curb:!0});return this.addSign(["ARMER\xCDA","LA PATAG\xD3NICA"],(s[0]+s[1])/2,r.floor+3.4,s[3]+.05,10,2.2,0,{bg:"#2d2d2d",fg:"#f0c040"}),this.markers.armeria={x:(s[0]+s[1])/2,z:s[3]+2},[s]}),e("centro",2,3,"pizzeria",function(i,n){let s=[i.x0+18,i.x0+48,i.z0+4.5,i.z0+20],r=this.addBuilding(n,s[0],s[1],s[2],s[3],2,{mat:"brick",color:14731432,curb:!0});return this.addSign(["PIZZER\xCDA LA TUERCA"],(s[0]+s[1])/2,r.floor+3.3,s[2]-.05,14,1.6,Math.PI,{bg:"#b8281c",fg:"#fff3c0"}),this.markers.pizzeria={x:(s[0]+s[1])/2,z:s[2]-2},[s]}),e("centro",3,1,"catedral",function(i,n){let s=[i.x0+14,i.x1-14,i.z0+10,i.z1-10],r=this.addBuilding(n,s[0],s[1],s[2],s[3],4,{mat:"plain",color:15262416,curb:!0,floorH:3.5,roof:"gable",ridgeX:!1,roofColor:8008486,rise:7}),o=(s[0]+s[1])/2,l=s[3]-2,c=s[3]+6,h=n.get(o,l,"plain");return h.box(o-4,o+4,r.base,r.floor+30,l,c,it(15525588)),h.box(o-4.6,o+4.6,r.floor+30,r.floor+31,l-.6,c+.6,it(14209212)),n.get(o,l,"roof").gable(o-4,o+4,l,c,r.floor+31,6,it(6122096),!1,.2),h.box(o-.25,o+.25,r.floor+37,r.floor+41,(l+c)/2-.25,(l+c)/2+.25,it(15263976)),h.box(o-1.3,o+1.3,r.floor+39.2,r.floor+39.7,(l+c)/2-.25,(l+c)/2+.25,it(15263976)),this.colliders.addBox(o-4,o+4,l,c,r.base,r.floor+40,"catedral"),[s,[o-4,o+4,l,c]]}),e("centro",4,1,"torreCrudo",function(i,n){let s=[i.x0+14,i.x1-14,i.z0+14,i.z1-14],r=this.addBuilding(n,s[0],s[1],s[2],s[3],24,{mat:"office",color:6258586,curb:!0});return this.addSign(["TORRE CRUDO"],(s[0]+s[1])/2,r.top-3,s[2]-.05,22,3,Math.PI,{bg:"#111418",fg:"#e8c060"}),this.addSign(["PETROLERA CRUDO S.A."],s[0]-.05,r.floor+5,(s[2]+s[3])/2,16,1.8,-Math.PI/2,{bg:"#111418",fg:"#e8c060"}),this.markers.torreCrudo={x:(s[0]+s[1])/2,z:s[2]-3},[s]}),e("centro",4,4,"terminal",function(i,n){let s=[i.x0+5,i.x1-5,i.z0+8,i.z1-16],r=this.addBuilding(n,s[0],s[1],s[2],s[3],2,{mat:"office",color:13156528,curb:!0,floorH:3.4}),o=n.get(s[0],s[3],"plain");o.box(s[0],s[1],r.top-1.5,r.top-1.1,s[3],i.z1-1,it(9080724));for(let l=s[0]+2;l<s[1];l+=10)o.box(l-.2,l+.2,r.floor,r.top-1.3,i.z1-2,i.z1-1.6,it(6975348)),this.colliders.addCircle(l,i.z1-1.8,.3,r.floor-1,r.top,"poste");return this.addSign(["TERMINAL DE \xD3MNIBUS"],(s[0]+s[1])/2,r.top+1.2,s[3]-3,22,2.2,0,{bg:"#f2f2ee",fg:"#1d3f8f"}),this.markers.terminal={x:(s[0]+s[1])/2,z:i.z1-3},[s,[s[0],s[1],s[3],i.z1]]}),e("centro",0,4,"anomala",function(i,n){let s=[i.x0+5,i.x1-5,i.z0+5,i.z1-14],r=this.addBuilding(n,s[0],s[1],s[2],s[3],2,{mat:"metal",color:15262940,curb:!0,floorH:3.8,vOff:0});return this.addSign(["LA AN\xD3MALA","SUPERMERCADOS"],(s[0]+s[1])/2,r.top-2,s[3]+.05,20,4,0,{bg:"#1c5aa8",fg:"#ffffff",sizes:[70,36]}),this.markers.anomala={x:(s[0]+s[1])/2,z:s[3]+3},[s]}),e("centro",4,3,"remiseria",function(i,n){let s=[i.x0+4.5,i.x0+26,i.z0+8,i.z0+28],r=this.addBuilding(n,s[0],s[1],s[2],s[3],1,{mat:"brick",color:13682872,curb:!0,floorH:3.6});return this.addSign(["REMISER\xCDA","EL VIENTO"],s[0]-.05,r.floor+2.8,(s[2]+s[3])/2,8,2,-Math.PI/2,{bg:"#1a6b2a",fg:"#ffffff"}),this.markers.remiseria={x:s[0]-2.5,z:(s[2]+s[3])/2},[s]}),e("pietrobelli",3,2,"casaAbuela",function(i,n,s){let r=[i.x1-3.2-11,i.x1-3.2,i.z0+16,i.z0+29];this.addBuilding(n,r[0],r[1],r[2],r[3],1,{mat:"house",floorH:2.8,color:15780048,roof:"gable",roofColor:3107642,ridgeX:!1,rise:2});let o=[i.x1-3.2-12,i.x1-3.2,i.z0+33,i.z0+45],l=this.addBuilding(n,o[0],o[1],o[2],o[3],1,{mat:"metal",floorH:3.4,color:12174536,roof:"flat"});return n.get(o[1],o[2],"plain").box(o[1],o[1]+.1,l.floor,l.floor+3,o[2]+2,o[3]-2,it(6961706)),this.addSign(["GARAGE PETROCA"],o[1]+.12,l.floor+3.25,(o[2]+o[3])/2,6,.6,Math.PI/2,{bg:"#f2c230",fg:"#222"}),this.addSign(["AC\xC1 VIVE LA ABUELA"],r[1]+.05,2.6+this.terrain.heightAt(r[1],r[2]),(r[2]+r[3])/2+3.5,3,.5,Math.PI/2,{bg:"#fff5e0",fg:"#5a2a2a",italic:!0}),this.markers.casaAbuela={x:i.x1-1.3,z:(r[2]+r[3])/2},this.markers.garagePetroca={x:i.x1+3,z:(o[2]+o[3])/2},[r,o]}),e("nuevejulio",2,1,"madriguera",function(i,n){let s=this.terrain,r=(i.x0+i.x1)/2,o=(i.z0+i.z1)/2,l=25,c=15,h=s.heightAt(r,o)+.28,u=n.get(r,o,"pitch"),d=6;for(let S=0;S<d;S++)for(let b=0;b<d;b++){let E=r-l+2*l*S/d,_=r-l+2*l*(S+1)/d,T=o-c+2*c*b/d,R=o-c+2*c*(b+1)/d,C=(L,z)=>s.heightAt(L,z)+.28;u.quad([E,C(E,R),R],[_,C(_,R),R],[_,C(_,T),T],[E,C(E,T),T],[E/6,R/6],[_/6,R/6],[_/6,T/6],[E/6,T/6],[1,1,1])}let f=n.get(r,o,"plain"),m=it(15921906),x=(S,b,E,_)=>f.box(S,b,h,h+.03,E,_,m);x(r-l,r+l,o-c,o-c+.2),x(r-l,r+l,o+c-.2,o+c),x(r-l,r-l+.2,o-c,o+c),x(r+l-.2,r+l,o-c,o+c),x(r-.1,r+.1,o-c,o+c);for(let S of[-1,1]){let b=r+S*(l-.3);f.box(b-.1,b+.1,h,h+2.4,o-3.6,o-3.4,m),f.box(b-.1,b+.1,h,h+2.4,o+3.4,o+3.6,m),f.box(b-.1,b+.1,h+2.3,h+2.5,o-3.6,o+3.6,m),this.colliders.addCircle(b,o-3.5,.15,h-1,h+2.5,"arco"),this.colliders.addCircle(b,o+3.5,.15,h-1,h+2.5,"arco")}let g=it(1847147),p=it(15263976);for(let S of[-1,1]){let b=S<0?o-c-7:o+c+2.5,E=S<0?o-c-2.5:o+c+7;for(let _=0;_<4;_++){let T=h+_*.7,R=S<0?b+_*1.1:b,C=S<0?E:E-_*1.1;f.box(r-l+2,r+l-2,T,T+.7,R,C,_%2?g:p)}this.colliders.addBox(r-l+2,r+l-2,b,E,h-1,h+2.8,"tribuna")}let y=3.2,M=(S,b,E,_)=>{f.box(S,b,h-1,h+y,E,_,p),f.box(S-.02,b+.02,h+1.1,h+2,E-.02,_+.02,g),this.colliders.addBox(S,b,E,_,h-1,h+y,"paredon")},v=3.4;return M(i.x0+v,i.x1-v,i.z0+v,i.z0+v+.3),M(i.x0+v,i.x1-v,i.z1-v-.3,i.z1-v),M(i.x0+v,i.x0+v+.3,i.z0+v,o-4),M(i.x0+v,i.x0+v+.3,o+4,i.z1-v),M(i.x1-v-.3,i.x1-v,i.z0+v,i.z1-v),this.addSign(["LA MADRIGUERA"],i.x0+v-.05,h+4.3,o,12,1.6,-Math.PI/2,{bg:"#1c2f6b",fg:"#ffffff"}),this.addSign(["CLUB ATL\xC9TICO JORGE NEWBERY"],i.x1-v+.05-.3+.35,h+2.3,o,16,1.2,Math.PI/2,{bg:"#ffffff",fg:"#1c2f6b"}),this.markers.madriguera={x:i.x0+1.3,z:o},[[i.x0,i.x1,i.z0,i.z1]]},!0),e("industrial",0,0,"gimnasio",function(i,n){let s=[i.x0+8,i.x1-8,i.z0+14,i.z1-4.5],r=this.addBuilding(n,s[0],s[1],s[2],s[3],2,{mat:"metal",color:13658682,floorH:3.4,roof:"gable",roofColor:10133668,rise:1.5});return this.addSign(["GIMNASIO","M\xDASCULO PATAG\xD3NICO"],(s[0]+s[1])/2,r.floor+4.5,s[3]+.05,14,2.6,0,{bg:"#222222",fg:"#ff9030"}),this.markers.gimnasio={x:(s[0]+s[1])/2,z:s[3]+2},[s]}),e("industrial",1,0,"chapa",function(i,n){let s=this.terrain,r=[i.x0+16,i.x1-16,i.z0+20,i.z1-.5],{min:o,max:l}=this.footprintHeights(r[0],r[1],r[2],r[3]),c=o-.5,h=l+5.5,u=n.get(r[0],r[2],"metal"),d=it(4157352),f=.5;return u.box(r[0],r[0]+f,c,h,r[2],r[3],d,3,3),u.box(r[1]-f,r[1],c,h,r[2],r[3],d,3,3),u.box(r[0],r[1],c,h,r[2],r[2]+f,d,3,3),n.get(r[0],r[2],"roofFlat").box(r[0]-.3,r[1]+.3,h,h+.4,r[2]-.3,r[3]+.3,it(10526880)),this.colliders.addBox(r[0],r[0]+f,r[2],r[3],c,h+.4,"chapa"),this.colliders.addBox(r[1]-f,r[1],r[2],r[3],c,h+.4,"chapa"),this.colliders.addBox(r[0],r[1],r[2],r[2]+f,c,h+.4,"chapa"),this.addSign(["CHAPA Y PINTURA","DON TITO"],(r[0]+r[1])/2,h-1,r[3]+.05,14,2.4,0,{bg:"#f0f0f0",fg:"#1d4f9f"}),this.markers.chapa={x:(r[0]+r[1])/2,z:(r[2]+r[3])/2+2,rect:[r[0]+1,r[1]-1,r[2]+1,r[3]]},[[r[0],r[1],r[2],i.z1]]}),e("km3",1,2,"museo",function(i,n){let s=[i.x0+8,i.x1-8,i.z0+8,i.z0+30],r=this.addBuilding(n,s[0],s[1],s[2],s[3],1,{mat:"brick",floorH:4,color:14207160,roof:"gable",roofColor:8008486,rise:2.5});this.addSign(["MUSEO DEL PETR\xD3LEO"],(s[0]+s[1])/2,r.floor+3.2,s[3]+.05,12,1.4,0,{bg:"#2a2a2a",fg:"#f2c230"});let o=(i.x0+i.x1)/2,l=i.z1-16,c=this.terrain.heightAt(o,l),h=n.get(o,l,"plain"),u=it(5914672),d=22,f=3.2,m=.8;for(let[x,g]of[[-1,-1],[1,-1],[1,1],[-1,1]])for(let y=0;y<11;y++){let M=y/11,v=(y+1)/11,S=f+(m-f)*M,b=f+(m-f)*v,E=o+x*S,_=l+g*S,T=o+x*b,R=l+g*b;h.box(Math.min(E,T)-.15,Math.max(E,T)+.15,c+d*M,c+d*v,Math.min(_,R)-.15,Math.max(_,R)+.15,u)}for(let x=1;x<6;x++){let g=x/6,p=f+(m-f)*g,y=c+d*g;h.box(o-p,o+p,y,y+.2,l-p,l-p+.2,u),h.box(o-p,o+p,y,y+.2,l+p-.2,l+p,u),h.box(o-p,o-p+.2,y,y+.2,l-p,l+p,u),h.box(o+p-.2,o+p,y,y+.2,l-p,l+p,u)}return this.colliders.addBox(o-f,o+f,l-f,l+f,c-1,c+d,"torre"),this.addSign(["POZO N\xB02 \u2014 13 DIC 1907"],o,c+1.4,l+f+.8,5,.7,0,{bg:"#f2e8c8",fg:"#3a2a1a",double:!0}),this.markers.museo={x:(s[0]+s[1])/2,z:s[3]+2},[s,[o-f-1,o+f+1,l-f-1,l+f+1]]}),e("rada",3,4,"mansion",function(i,n){let s=[i.x0+6,i.x1-6,i.z0+6,i.z1-14],r=this.addBuilding(n,s[0],s[1],s[2],s[3],2,{mat:"house",floorH:3.2,color:16250352,roof:"flat",roofColor:10328208}),o=this.terrain,l=(s[0]+s[1])/2,c=s[3]+6,h=o.heightAt(l,c)+.25,u=n.get(l,c,"plain");return u.box(l-7,l+7,h-.2,h,c-3,c+3,it(3844312)),u.box(l-7.6,l+7.6,h-.3,h-.05,c-3.6,c+3.6,it(15261904)),this.addSign(["PROPIEDAD PRIVADA \u2014 CHETOS"],(s[0]+s[1])/2,r.floor+3,s[3]+.05,9,.9,0,{bg:"#7b2d8b",fg:"#ffffff"}),this.markers.mansion={x:l,z:c+5},[s,[l-8,l+8,c-4,c+4]]}),t}buildPuerto(t,e){let i=(s,r,o,l,c,h)=>this.addBuilding(t,s,r,o,l,c,{mat:"metal",color:h,floorH:3.2,roof:"gable",roofColor:9278102,rise:1.8});i(305,345,405,440,3,12107972),i(355,415,405,435,3,10465464),i(445,500,405,440,4,10991776),i(305,350,495,540,3,13219984),i(365,420,495,530,2,12107972),this.addSign(["PUERTO COMODORO"],382,13,404.9,18,2,Math.PI,{bg:"#1d3f8f",fg:"#ffffff"}),this.addSign(["PESQUERA SAN JORGE"],327,11,494.9,14,1.6,Math.PI,{bg:"#f2f2ee",fg:"#1a4f7a"}),this.containers=[];let n=[11546656,2117792,213e4,13668384,7368816,14704672,10103402];for(let s=0;s<18;s++){let r=450+s%6*13,o=500+Math.floor(s/6)*5.5,l=e.int(1,3);for(let c=0;c<l;c++)this.containers.push({x:r,z:o,y:this.terrain.heightAt(r,o)+c*2.6,color:e.pick(n),rot:0});this.colliders.addBox(r-6.1,r+6.1,o-1.25,o+1.25,-2,this.terrain.heightAt(r,o)+l*2.6,"container")}for(let s=0;s<6;s++){let r=470+s*13,o=425;this.containers.push({x:r,z:o,y:this.terrain.heightAt(r,o),color:e.pick(n),rot:0}),this.colliders.addBox(r-6.1,r+6.1,o-1.25,o+1.25,-2,this.terrain.heightAt(r,o)+2.6,"container")}}buildOutside(t,e,i){let n=this.terrain,s=(l,c,h)=>{let u=t.get(l,c,"plain"),d=n.heightAt(l,c);u.box(l-9,l+9,d+5,d+5.8,c-6,c+6,it(15921906)),u.box(l-9.05,l+9.05,d+5.2,d+5.6,c-6.05,c+6.05,it(1789856));for(let[m,x]of[[-6,-3],[6,-3],[-6,3],[6,3]])u.box(l+m-.3,l+m+.3,d,d+5,c+x-.3,c+x+.3,it(14737632)),this.colliders.addCircle(l+m,c+x,.4,d-1,d+5,"surtidor");for(let m of[-3,3])u.box(l+m-.5,l+m+.5,d,d+1.6,c-.6,c+.6,it(1789856)),this.colliders.addBox(l+m-.5,l+m+.5,c-.6,c+.6,d-1,d+1.6,"surtidor");this.gasPumps=this.gasPumps||[],this.gasPumps.push({x:l,z:c}),this.addSign(["YPZ"],l,d+5.4,c+6.07,5,.8,0,{bg:"#1b4fa0",fg:"#ffffff",border:!1}),this.addSign(["YPZ"],l,d+5.4,c-6.07,5,.8,Math.PI,{bg:"#1b4fa0",fg:"#ffffff",border:!1});let f=[l+12,l+20,c-5,c+5];this.addBuilding(t,f[0],f[1],f[2],f[3],1,{mat:"office",color:15921906,floorH:3.4})};s(432,-1020,0),s(-560,240,0),((l,c)=>{for(let h=0;h<4;h++){let u=l+h%2*14-7,d=c+Math.floor(h/2)*9-4.5;this.addBuilding(t,u-5.5,u+5.5,d-1.4,d+1.4,1,{mat:"metal",floorH:2.7,color:15921906,roof:"flat"})}this.addSign(["PETROLERA SAN JORGE \u2014 CAMPAMENTO"],l,n.heightAt(l,c)+4.2,c+9,12,1.1,0,{bg:"#f26a1b",fg:"#ffffff",double:!0})})(-1160,-900),this.addBuilding(t,0,25,-735,-720,2,{mat:"metal",floorH:3.5,color:6975348,roof:"gable",roofColor:4869972,rise:1.5}),this.addSign(["DEP\xD3SITO CRUDO S.A."],20-7.5,n.heightAt(20,-715)+8.5,-715-4.9,12,1.4,0,{bg:"#111418",fg:"#e8c060"});{this.addBuilding(t,-420,-370,-1370,-1352,2,{mat:"office",color:14211280,floorH:4});let h=t.get(-390,-1340,"plain"),u=n.heightAt(-360,-1360);h.box(-364,-360,u,u+18,-1364,-1360,it(14211280)),h.box(-390+24.5,-390+31.5,u+18,u+21,-1340-25.5,-1340-18.5,it(3824234)),this.colliders.addBox(-364,-360,-1364,-1360,u-1,u+21,"torre"),this.addSign(["AEROPUERTO GRAL. MOSCONI"],-395,n.heightAt(-390,-1352)+6.5,-1340-11.9,20,1.6,0,{bg:"#f2f2ee",fg:"#1d3f8f"});let d=t.get(-700,-1380,"plain");for(let f=-960;f<-420;f+=20){let m=(x,g)=>n.heightAt(x,g)+.1;d.quad([f,m(f,-1360),-1360],[f+20,m(f+20,-1360),-1360],[f+20,m(f+20,-1400),-1400],[f,m(f,-1400),-1400],[0,0],[1,0],[1,1],[0,1],it(4868942)),f/20%2===0&&d.quad([f+4,m(f,-1380)+.02,-1379.5],[f+14,m(f,-1380)+.02,-1379.5],[f+14,m(f,-1380)+.02,-1380.5],[f+4,m(f,-1380)+.02,-1380.5],[0,0],[1,0],[1,1],[0,1],it(15263968))}}this.addSign(["BIENVENIDOS A COMODORO RIVADAVIA","CAPITAL NACIONAL DEL PETR\xD3LEO"],428,n.heightAt(428,-1560)+5,-1560,16,3.2,Math.PI/2,{bg:"#1d6b3a",fg:"#ffffff",sizes:[40,40],double:!0}),this.addSign(["RADA TILLY","LA VILLA BALNEARIA M\xC1S AUSTRAL"],160,n.heightAt(160,1070)+4,1070,12,2.6,0,{bg:"#1d6b3a",fg:"#ffffff",sizes:[52,30],double:!0});{let l=t.get(428,-1560,"plain"),c=n.heightAt(428,-1560);l.box(427.8,428.2,c,c+3.4,-1567,-1566.6,it(7829367)),l.box(427.8,428.2,c,c+3.4,-1553.4,-1553,it(7829367));let h=n.heightAt(160,1070);l.box(154.8,155.2,h,h+2.8,1069.8,1070.2,it(7829367)),l.box(164.8,165.2,h,h+2.8,1069.8,1070.2,it(7829367))}let o=[[["FERNET BRANCALEONE","EL QUE VA CON COCA"],470,-300,-Math.PI/2,"#101010","#f0f0f0"],[["QUILMEZ","EL SABOR DEL ENCUENTRO... CON EL VIENTO"],300,870,-.6,"#1a3a8a","#ffffff"],[["CTE M\xD3VIL","AHORA CON SE\xD1AL EN EL CHENQUE (A VECES)"],-250,205,0,"#d01818","#ffffff"],[["TOYODA JILUX","PARA EL PETROLERO QUE SE LO MERECE"],420,-1250,-Math.PI/2,"#f2f2f2","#d01818"],[["RADIO CUMBIA VILLERA 104.5","\xA1EL AGUANTE DEL SUR!"],250,990,.3,"#6a1a8a","#ffe040"],[["VAMOS EL LOBO","AGUANTE NEWBERY"],-100,230,0,"#1c2f6b","#ffffff"]];for(let[l,c,h,u,d,f]of o){let m=n.heightAt(c,h),x=t.get(c,h,"plain"),g=Math.cos(u)*4.5,p=-Math.sin(u)*4.5;x.box(c+g-.2,c+g+.2,m,m+7,h+p-.2,h+p+.2,it(5592405)),x.box(c-g-.2,c-g+.2,m,m+7,h-p-.2,h-p+.2,it(5592405)),this.colliders.addCircle(c+g,h+p,.3,m-1,m+7,"cartel"),this.colliders.addCircle(c-g,h-p,.3,m-1,m+7,"cartel"),this.addSign(l,c,m+7.5,h,12,4,u,{bg:d,fg:f,double:!0,sizes:[64,30]})}}sidewalkPoint(t,e,i){let n=di/2,s=t.x0+n,r=t.x1-n,o=t.z0+n,l=t.z1-n;switch(i){case 0:return[s+(r-s)*e,o];case 1:return[r,o+(l-o)*e];case 2:return[r-(r-s)*e,l];default:return[s,l-(l-o)*e]}}};var Ri=()=>new Jt({vertexColors:!0});function gn(a,t,e){let i=new An(a,t,e);return i.frustumCulled=!1,i}var Ne=new de,Ze=new bi,Wn=new N(1,1,1),qe=new N,Le=new Ui,Sl=class{constructor(){this.group=new Qt,this.pumps=[],this.turbines=[],this.blinkers=[]}build(t){let{terrain:e,roads:i,city:n,colliders:s,textures:r}=t;this.game=t;let o=new Oi(7);this.buildPumpjacks(e,i,n,s,o),this.buildTurbines(e,s),this.buildAntennas(e,s),this.buildLamps(e,i,n,s,r),this.buildTrees(e,i,n,s,o),this.buildScrub(e,i,n,o),this.buildContainers(n),this.buildBoats(e,s),this.buildRamps(e,s),this.buildFences(e),this.buildLoberia(e),this.buildTrafficLight(e,s),this.buildBenches(n,e,s),this.buildOilTanks(e,s),this.buildDecks(s),t.scene.add(this.group)}buildPumpjacks(t,e,i,n,s){let r=[];for(let g of Xd){let p=0,y=0;for(;y<g.n&&p++<g.n*40;){let M=s.range(g.x0,g.x1),v=s.range(g.z0,g.z1);if(t.heightAt(M,v)<2||M>nn(v)-40||i.blockAt(M,v))continue;let S=e.nearestEdge(M,v,30);S&&S.d<S.edge.width/2+5||r.some(b=>Math.hypot(b[0]-M,b[1]-v)<24)||(r.push([M,v,s.range(0,Math.PI*2)]),y++)}}let o=new be,l=it(14198820),c=it(3815994),h=it(9079430),u=it(2969466);o.box(-.9,.9,0,.4,-4.2,4.6,h),o.box(-.9,-.6,.4,4.2,.1,.5,c),o.box(.6,.9,.4,4.2,.1,.5,c),o.box(-.9,.9,4,4.3,0,.6,c),o.box(-.6,.6,.4,1.4,-4.1,-3.2,u),o.box(-.5,.5,.4,2.2,-3,-2,c),o.box(-.25,.25,0,.9,4.1,4.6,it(6974054)),o.box(-.05,.05,.9,2.2,4.3,4.4,it(13421772));let d=new be;d.box(-.2,.2,-.25,.25,-3.2,3.9,l),d.box(-.28,.28,-1.8,.4,3.9,4.5,l),d.box(-.28,.28,-1.2,.2,4.5,4.8,l),d.box(-.62,-.5,-2.5,0,-3.1,-2.9,c),d.box(.5,.62,-2.5,0,-3.1,-2.9,c);let f=new be;f.box(-.75,-.55,-1.3,1.3,-.35,.35,c),f.box(.55,.75,-1.3,1.3,-.35,.35,c),f.box(-.8,-.5,.6,1.5,-.55,.55,it(11542560)),f.box(.5,.8,.6,1.5,-.55,.55,it(11542560));let m=Ri(),x=r.length;this.pumpBase=gn(o.toGeometry(),m,x),this.pumpBeam=gn(d.toGeometry(),m,x),this.pumpCrank=gn(f.toGeometry(),m,x),r.forEach(([g,p,y],M)=>{let v=t.heightAt(g,p)-.1;Le.set(0,y,0),Ze.setFromEuler(Le),qe.set(g,v,p),Ne.compose(qe,Ze,Wn),this.pumpBase.setMatrixAt(M,Ne),this.pumps.push({x:g,y:v,z:p,rot:y,phase:s.range(0,10),speed:s.range(.9,1.4)});let S=Math.sin(y),b=Math.cos(y);for(let E of[-3,0,3.5])n.addCircle(g+S*E,p+b*E,1.3,v-1,v+5,"cig\xFCe\xF1a")}),this.pumpBase.instanceMatrix.needsUpdate=!0,this.group.add(this.pumpBase,this.pumpBeam,this.pumpCrank),this.pumpSpots=r}updatePumps(t){let e=new bi,i=new N;for(let n=0;n<this.pumps.length;n++){let s=this.pumps[n],r=t*s.speed+s.phase,o=Math.sin(r)*.32;Le.set(0,s.rot,0),Ze.setFromEuler(Le),i.set(0,4.45,.3).applyQuaternion(Ze),qe.set(s.x+i.x,s.y+i.y,s.z+i.z),Le.set(o,s.rot,0,"YXZ"),e.setFromEuler(Le),Ne.compose(qe,e,Wn),this.pumpBeam.setMatrixAt(n,Ne),i.set(0,1.6,-2.5).applyQuaternion(Ze),qe.set(s.x+i.x,s.y+i.y,s.z+i.z),Le.set(-r,s.rot,0,"YXZ"),e.setFromEuler(Le),Ne.compose(qe,e,Wn),this.pumpCrank.setMatrixAt(n,Ne)}this.pumpBeam.instanceMatrix.needsUpdate=!0,this.pumpCrank.instanceMatrix.needsUpdate=!0}buildTurbines(t,e){let i=new be,n=it(15658732);for(let o=0;o<8;o++){let l=o/8*42,c=(o+1)/8*42,h=1.6-o/8*.7;i.cylinder(0,0,h,l,c,n,10,!1)}i.box(-1.2,1.2,41.5,44,-1.5,4,n);let s=new be;s.box(-.8,.8,-.8,.8,-.6,.8,n);for(let o=0;o<3;o++){let l=o/3*Math.PI*2,c=20,h=Math.cos(l),u=Math.sin(l),d=6;for(let f=0;f<d;f++){let m=.8+f/d*c,x=.8+(f+1)/d*c,g=.9-f/d*.6,p=h*m,y=u*m,M=h*x,v=u*x,S=-u*g,b=h*g;s.quad([p-S,y-b,0],[M-S,v-b,0],[M+S,v+b,0],[p+S,y+b,0],[0,0],[1,0],[1,1],[0,1],n),s.quad([p+S,y+b,0],[M+S,v+b,0],[M-S,v-b,0],[p-S,y-b,0],[0,0],[1,0],[1,1],[0,1],n)}}let r=Ri();this.turbTower=gn(i.toGeometry(),r,ul.length),this.turbRotor=gn(s.toGeometry(),r,ul.length),ul.forEach(([o,l],c)=>{let h=t.heightAt(o,l);Le.set(0,-Math.PI/2,0),Ze.setFromEuler(Le),qe.set(o,h,l),Ne.compose(qe,Ze,Wn),this.turbTower.setMatrixAt(c,Ne),this.turbines.push({x:o,y:h,z:l,phase:c*.7}),e.addCircle(o,l,1.8,h-1,h+44,"molino"),this.blinkers.push({x:o,y:h+44.5,z:l,phase:c*.3})}),this.group.add(this.turbTower,this.turbRotor)}updateTurbines(t,e){for(let i=0;i<this.turbines.length;i++){let n=this.turbines[i],s=t*(.4+e*.04)+n.phase;Le.set(0,-Math.PI/2,s,"YXZ"),Ze.setFromEuler(Le),qe.set(n.x-3.6,n.y+42.8,n.z),Ne.compose(qe,Ze,Wn),this.turbRotor.setMatrixAt(i,Ne)}this.turbRotor.instanceMatrix.needsUpdate=!0}buildAntennas(t,e){let i=new be,n=it(13119520),s=it(15658734),r=[[185,-385,60],[205,-345,48],[150,-420,42],[120,-350,36]];for(let[l,c,h]of r){let u=t.heightAt(l,c),d=.9,f=Math.round(h/4);for(let m=0;m<f;m++){let x=u+m/f*h,g=u+(m+1)/f*h,p=m%2?n:s;for(let[y,M]of[[-d,-d],[d,-d],[d,d],[-d,d]])i.box(l+y-.08,l+y+.08,x,g,c+M-.08,c+M+.08,p);i.box(l-d,l+d,g-.1,g,c-d,c-d+.1,p),i.box(l-d,l+d,g-.1,g,c+d-.1,c+d,p),i.box(l-d,l-d+.1,g-.1,g,c-d,c+d,p),i.box(l+d-.1,l+d,g-.1,g,c-d,c+d,p)}e.addBox(l-d,l+d,c-d,c+d,u-1,u+h,"antena"),this.blinkers.push({x:l,y:u+h+.5,z:c,phase:l*.01}),i.box(l+2,l+6,u,u+2.6,c-2,c+2,it(13683904)),e.addBox(l+2,l+6,c-2,c+2,u-1,u+2.6,"casilla")}let o=new xt(i.toGeometry(),Ri());o.matrixAutoUpdate=!1,this.group.add(o)}buildLamps(t,e,i,n,s){let r=[...i.lampSpots];for(let d of e.edges){if(d.kind!=="ruta"&&d.kind!=="avenida"&&d.kind!=="muelle"||i.blocks.length&&d.kind==="avenida"&&d.name==="Centro")continue;let f=e.nodes[d.a],m=Math.floor(d.len/45);for(let x=1;x<=m;x++){let g=x/(m+1),p=f.x+d.dx*d.len*g,y=f.z+d.dz*d.len*g,M=x%2?1:-1,v=d.width/2+1,S=p-d.dz*v*M,b=y+d.dx*v*M;t.groundAt(S,b)<.5&&d.kind!=="muelle"||r.push([S,b,d.dx,d.dz,M])}}let o=new be,l=it(5922659);o.box(-.09,.09,0,7.5,-.09,.09,l),o.box(-.06,.06,7.3,7.45,0,1.8,l),o.box(-.25,.25,7.1,7.35,1.5,2.2,it(9080723));let c=r.length;this.lampMesh=gn(o.toGeometry(),Ri(),c);let h=new Float32Array(c*3);r.forEach((d,f)=>{let[m,x]=d,g=t.groundAt(m,x)+(i.curbAt(m,x)||0),p=0;if(d.length>2)p=Math.atan2(d[4]*d[3],-d[4]*d[2]);else{let y=e.nearestEdge(m,x,20);y&&(p=Math.atan2(y.x-m,y.z-x))}Le.set(0,p,0),Ze.setFromEuler(Le),qe.set(m,g,x),Ne.compose(qe,Ze,Wn),this.lampMesh.setMatrixAt(f,Ne),h[f*3]=m+Math.sin(p)*1.85,h[f*3+1]=g+7,h[f*3+2]=x+Math.cos(p)*1.85,n.addCircle(m,x,.18,g-1,g+7.5,"poste")}),this.group.add(this.lampMesh);let u=new fe;u.setAttribute("position",new ne(h,3)),this.lampGlow=new Cn(u,new Rn({map:s.glow,size:5,color:16763008,transparent:!0,opacity:0,depthWrite:!1,blending:pn,sizeAttenuation:!0,fog:!1})),this.lampGlow.frustumCulled=!1,this.group.add(this.lampGlow),this.lampPositions=h}buildTrees(t,e,i,n,s){let r=i.treeSpots.map(v=>[...v]),o=[[-770,180,-770,490,"alamo"],[-780,-80,-780,170,"alamo"],[60,-900,60,-620,"alamo"],[-460,520,-80,520,"alamo"],[0,1085,280,1085,"pino"],[0,1090,0,1440,"pino"],[-300,1e3,-60,1080,"pino"],[-20,-140,-20,-40,"alamo"]];for(let[v,S,b,E,_]of o){let T=Math.hypot(b-v,E-S),R=Math.floor(T/6);for(let C=0;C<=R;C++){let L=C/R,z=v+(b-v)*L+s.range(-1,1),P=S+(E-S)*L+s.range(-1,1),D=e.nearestEdge(z,P,12);D&&D.d<D.edge.width/2+1.5||i.blockAt(z,P)||r.push([z,P,_])}}for(let v=0;v<90;v++){let S=s.range(-60,60),b=s.range(-560,-160),E=e.nearestEdge(S,b,12);E&&E.d<E.edge.width/2+2||i.blockAt(S,b)||r.push([S,b,"pino"])}for(let v of i.blocks)if(!(v.type!=="rada"&&!(v.type==="barrio"&&s.chance(.25))))for(let S=0;S<4;S++){let b=s.int(0,3),[E,_]=i.sidewalkPoint(v,s.range(.1,.9),b);r.push([E,_,v.type==="rada"?"pino":"alamo"])}let l=new be;l.cylinder(0,0,.18,0,3,it(5916210),5,!1);let c=new be,h=7;for(let v=0;v<h;v++){let S=v/h*Math.PI*2,b=(v+1)/h*Math.PI*2,E=(T,R,C)=>[Math.cos(C)*R,T,Math.sin(C)*R],_=[[1.5,.4],[4,1.5],[8,1.6],[12,1],[15,0]];for(let T=0;T<_.length-1;T++){let[R,C]=_[T],[L,z]=_[T+1],P=it(T%2?7307066:6452533);c.quad(E(R,C,S),E(R,C,b),E(L,z,b),E(L,z,S),[0,0],[1,0],[1,1],[0,1],P)}}let u=new be;for(let v=0;v<h;v++){let S=v/h*Math.PI*2,b=(v+1)/h*Math.PI*2,E=(T,R,C)=>[Math.cos(C)*R,T,Math.sin(C)*R],_=[[1.2,2.6],[4,1.4],[4,2.2],[7,.9],[7,1.6],[10.5,0]];for(let T=0;T<_.length-1;T++){let[R,C]=_[T],[L,z]=_[T+1];if(R===L)continue;let P=it(3099182);u.quad(E(R,C,S),E(R,C,b),E(L,z,b),E(L,z,S),[0,0],[1,0],[1,1],[0,1],P)}}let d=Ri(),f=r.filter(v=>v[2]==="alamo"),m=r.filter(v=>v[2]!=="alamo"),x=gn(l.toGeometry(),d,r.length),g=gn(c.toGeometry(),d,f.length),p=gn(u.toGeometry(),d,m.length),y=0,M=(v,S)=>v.forEach(([b,E],_)=>{let T=t.heightAt(b,E)+(i.curbAt(b,E)||0)-.1,R=.8+_*7919%100/200;Le.set(0,_,0),Ze.setFromEuler(Le),qe.set(b,T,E),Ne.compose(qe,Ze,new N(R,R,R)),S.setMatrixAt(_,Ne),x.setMatrixAt(y++,Ne),n.addCircle(b,E,.3,T-1,T+10,"arbol")});M(f,g),M(m,p),this.group.add(x,g,p),this.treeMeshes=[g,p]}buildScrub(t,e,i,n){let s=new Pr(1,0);s.scale(1,.55,1),s.translate(0,.25,0);let r=new Jt({color:16777215,flatShading:!0}),o=6500,l=new An(s,r,o);l.frustumCulled=!1;let c=[7039546,8025152,9077072,6186040,10128474,7371338],h=new Ct,u=0,d=0,f=(m,x)=>Zs.some(g=>m>g.x0&&m<g.x1&&x>g.z0&&x<g.z1);for(;u<o&&d++<o*6;){let m=n.range(-1480,700),x=n.range(-1780,1730),g=t.heightAt(m,x);if(g<2.5||m>nn(x)-30||f(m,x)&&n.chance(.85)||i.blockAt(m,x))continue;let p=e.nearestEdge(m,x,10);if(p&&p.d<p.edge.width/2+1.5)continue;let y=n.range(.35,1.1);Le.set(0,n.range(0,6.28),0),Ze.setFromEuler(Le),qe.set(m,g-.1,x),Ne.compose(qe,Ze,new N(y*n.range(.8,1.3),y,y*n.range(.8,1.3))),l.setMatrixAt(u,Ne),h.setHex(n.pick(c)),l.setColorAt(u,h),u++}l.count=u,this.group.add(l)}buildContainers(t){if(!t.containers)return;let e=new ve(12.2,2.6,2.44);e.translate(0,1.3,0);let i=new Jt({map:this.game.textures.metal}),n=new An(e,i,t.containers.length),s=new Ct;t.containers.forEach((r,o)=>{Le.set(0,r.rot,0),Ze.setFromEuler(Le),qe.set(r.x,r.y,r.z),Ne.compose(qe,Ze,Wn),n.setMatrixAt(o,Ne),s.setHex(r.color),n.setColorAt(o,s)}),this.group.add(n)}buildBoats(t,e){let i=new be,n=(r,o,l,c,h,u,d=0)=>{let f=l/2,m=c/2,x=-1.4,g=1.4;d===0&&(i.box(r-f,r+f-2,x,g,o-m,o+m,it(h)),i.box(r+f-2,r+f,x+.8,g,o-m*.6,o+m*.6,it(h)),i.box(r-f,r+f,g-.2,g,o-m,o+m,it(9071178)),i.box(r-f*.3,r+f*.2,g,g+2.4,o-m*.7,o+m*.7,it(u)),i.box(r-f*.1,r,g+2.4,g+5,o-.1,o+.1,it(3355443)),e.addBox(r-f,r+f,o-m,o+m,x,g+3,"barco"))};n(640,500,22,6,14198820,15921906),n(670,461,20,6,11544608,15921906),n(620,461,18,5.5,2977704,15921906),n(560,-1690,14,4.5,14198820,15921906),n(540,-1660,12,4,11544608,15921906);{i.box(650-110/2,650+110/2,-3,5,368-16/2,368+16/2,it(2763310)),i.box(650-110/2,650+110/2,5,5.3,368-16/2,368+16/2,it(9054752)),i.box(650-110/2+4,650-110/2+20,5.3,16,368-16/2+1,368+16/2-1,it(15921906)),i.box(650-110/2+10,650-110/2+13,16,22,368-1.5,368+1.5,it(14168096));for(let h=0;h<5;h++)i.box(630+h*14,636+h*14,5.3,6.5,365,371,it(6978154));e.addBox(650-110/2,650+110/2,368-16/2,368+16/2,-3,22,"buque"),this.addSignTo(i)}let s=new xt(i.toGeometry(),Ri());s.matrixAutoUpdate=!1,this.group.add(s),this.boatMesh=s}addSignTo(){}buildRamps(t,e){let i=new be,n=it(9075290),s=it(6969920);for(let o of t.ramps){let l=o.fx,c=o.fz,h=c,u=-l,d=o.len/2,f=o.w/2,m=(_,T,R)=>[o.x+l*_+h*T,R,o.z+c*_+u*T],x=o.base,g=m(-d,-f,x),p=m(-d,f,x),y=m(d,-f,x+o.h),M=m(d,f,x+o.h),v=m(d,-f,x-.5),S=m(d,f,x-.5);i.quad(g,y,M,p,[0,0],[0,1],[1,1],[1,0],n),i.quad(p,M,y,g,[0,0],[0,1],[1,1],[1,0],n),i.quad(v,S,M,y,[0,0],[1,0],[1,1],[0,1],s),i.tri(g,v,y,[h,0,u],[0,0],[1,0],[1,1],s),i.tri(p,M,S,[-h,0,-u],[0,0],[1,0],[1,1],s);for(let _=1;_<6;_++){let T=-d+_/6*o.len,R=x+o.h*_/6+.03;i.quad(m(T-.1,-f,R),m(T+.1,-f,R),m(T+.1,f,R),m(T-.1,f,R),[0,0],[1,0],[1,1],[0,1],s)}let b=o.x+l*d,E=o.z+c*d;e.addCircle(b-l*.5,E-c*.5,.01,x-5,x-4,"rampa")}let r=new xt(i.toGeometry(),Ri());r.matrixAutoUpdate=!1,this.group.add(r)}buildFences(t){let e=new be,i=it(6969924),n=it(10132122);for(let[r,o]of hl){let l=(r*13+o*7)%3,c=Math.cos(l),h=Math.sin(l);for(let u=-2;u<=2;u++){let d=r+c*u*2.5,f=o+h*u*2.5,m=t.groundAt(d,f);e.box(d-.06,d+.06,m-.2,m+1.3,f-.06,f+.06,i)}for(let u of[.4,.8,1.2]){let d=r-c*5,f=o-h*5,m=r+c*5,x=o+h*5,g=t.groundAt(d,f)+u,p=t.groundAt(m,x)+u;e.quad([d,g,f],[m,p,x],[m,p+.025,x],[d,g+.025,f],[0,0],[1,0],[1,1],[0,1],n),e.quad([d,g+.025,f],[m,p+.025,x],[m,p,x],[d,g,f],[0,0],[1,0],[1,1],[0,1],n)}}let s=new xt(e.toGeometry(),Ri());s.matrixAutoUpdate=!1,this.group.add(s)}buildLoberia(t){let e=new In(1,7,5);e.scale(.7,.45,1.3);let i=new Jt({color:5915698}),n=16;this.lobos=new An(e,i,n),this.loboData=[];let s=new Oi(99),r=0,o=0;for(;r<n&&o++<500;){let l=s.range(560,660),c=s.range(1560,1690),h=t.heightAt(l,c);h<.2||h>2.5||(this.loboData.push({x:l,z:c,y:h+.3,rot:s.range(0,6.28),ph:s.range(0,6)}),r++)}this.lobos.count=this.loboData.length,this.group.add(this.lobos)}updateLobos(t){this.lobos&&(this.loboData.forEach((e,i)=>{Le.set(Math.sin(t*.7+e.ph)*.15,e.rot,0),Ze.setFromEuler(Le),qe.set(e.x,e.y+Math.max(0,Math.sin(t*1.3+e.ph))*.1,e.z),Ne.compose(qe,Ze,Wn),this.lobos.setMatrixAt(i,Ne)}),this.lobos.instanceMatrix.needsUpdate=!0)}buildTrafficLight(t,e){let{x:i,z:n}=Bt.semaforo,s=new be,r=[[i-7.3,n-7.3],[i+7.3,n+7.3]];this.trafficLights=[];for(let[c,h]of r){let u=t.heightAt(c,h)+.22;s.box(c-.1,c+.1,u,u+3.2,h-.1,h+.1,it(2763306)),s.box(c-.25,c+.25,u+3.2,u+4.3,h-.2,h+.2,it(1710618)),e.addCircle(c,h,.2,u-1,u+4.3,"semaforo"),this.trafficLights.push({x:c,y:u+3.75,z:h})}let o=new xt(s.toGeometry(),Ri());this.group.add(o);let l=c=>new xt(new In(.14,6,4),new He({color:c}));this.tlLamps=[];for(let c of this.trafficLights){let h=l(16719888),u=l(16752656),d=l(2162496);h.position.set(c.x,c.y+.35,c.z+.21),u.position.set(c.x,c.y,c.z+.21),d.position.set(c.x,c.y-.35,c.z+.21);let f=h.clone(),m=u.clone(),x=d.clone();f.position.z-=.42,m.position.z-=.42,x.position.z-=.42,this.group.add(h,u,d,f,m,x),this.tlLamps.push([h,u,d],[f,m,x])}}updateTrafficLight(t){for(let[e,i,n]of this.tlLamps||[])e.material.color.setHex(t===2?16719888:3149840),i.material.color.setHex(t===1?16752656:3153936),n.material.color.setHex(t===0?2162496:1060880)}buildBenches(t,e,i){let n=new be;for(let[r,o]of t.benches){let l=e.heightAt(r,o)+.3;n.box(r-1,r+1,l+.4,l+.5,o-.3,o+.3,it(6965802)),n.box(r-1,r+1,l+.5,l+.9,o+.25,o+.35,it(6965802)),n.box(r-.9,r-.8,l,l+.4,o-.3,o+.3,it(3355443)),n.box(r+.8,r+.9,l,l+.4,o-.3,o+.3,it(3355443)),i.addBox(r-1,r+1,o-.3,o+.35,l-1,l+.9,"banco")}let s=new xt(n.toGeometry(),Ri());this.group.add(s)}buildOilTanks(t,e){let i=new be,n=[[-60,-850,11,12],[-30,-850,11,12],[-60,-820,9,10],[-30,-822,9,10],[-95,-840,8,9],[-1120,-880,6,7],[-1105,-880,6,7],[-1230,640,6,7],[-1260,1060,5,6],[5,-700,4,8]];for(let[r,o,l,c]of n){let h=t.heightAt(r,o)-.3;i.cylinder(r,o,l,h,h+c,it(15263456),16,!0),i.cylinder(r,o,l+.05,h+c*.45,h+c*.55,it(1789856),16,!1),e.addCircle(r,o,l,h-1,h+c,"tanque")}let s=new xt(i.toGeometry(),Ri());s.matrixAutoUpdate=!1,this.group.add(s)}buildDecks(t){let e=new be;for(let n of ss){e.box(n.x0,n.x1,n.h-.7,n.h-.02,n.z0,n.z1,it(10131084),4,3);for(let s=n.x0+3;s<n.x1;s+=9)for(let r of[n.z0+1,n.z1-1])e.box(s-.35,s+.35,-8,n.h-.7,r-.35,r+.35,it(6973022)),t.addCircle(s,r,.4,-8,n.h-.75,"pilote");for(let s=n.x0+4;s<n.x1;s+=12)e.box(s-.25,s+.25,n.h,n.h+.5,n.z0+.3,n.z0+.8,it(3355443)),e.box(s-.25,s+.25,n.h,n.h+.5,n.z1-.8,n.z1-.3,it(3355443)),t.addCircle(s,n.z0+.55,.3,n.h-.1,n.h+.5,"bolardo"),t.addCircle(s,n.z1-.55,.3,n.h-.1,n.h+.5,"bolardo")}let i=new xt(e.toGeometry(),Ri());i.matrixAutoUpdate=!1,this.group.add(i)}update(t,e,i){this.updatePumps(t),this.updateTurbines(t,i.windSpeed),this.updateLobos(t),this.lampGlow&&(this.lampGlow.material.opacity=lt(i.night*1.2,0,.9))}};var wl=class{constructor(){this.items=[],this.cells=new Map,this.stamp=0}key(t,e){return t*73856093^e*19349663}addBox(t,e,i,n,s,r,o=null){let l={type:"box",x0:Math.min(t,e),x1:Math.max(t,e),z0:Math.min(i,n),z1:Math.max(i,n),y0:s,y1:r,tag:o,s:0};return this.insert(l,l.x0,l.x1,l.z0,l.z1),l}addCircle(t,e,i,n,s,r=null){let o={type:"circle",x:t,z:e,r:i,y0:n,y1:s,tag:r,s:0};return this.insert(o,t-i,t+i,e-i,e+i),o}insert(t,e,i,n,s){this.items.push(t);let r=Math.floor(e/24),o=Math.floor(i/24),l=Math.floor(n/24),c=Math.floor(s/24);for(let h=r;h<=o;h++)for(let u=l;u<=c;u++){let d=this.key(h,u),f=this.cells.get(d);f||(f=[],this.cells.set(d,f)),f.push(t)}}near(t,e,i,n,s){this.stamp++,s.length=0;let r=Math.floor(t/24),o=Math.floor(e/24),l=Math.floor(i/24),c=Math.floor(n/24);for(let h=r;h<=o;h++)for(let u=l;u<=c;u++){let d=this.cells.get(this.key(h,u));if(d)for(let f of d)f.s!==this.stamp&&(f.s=this.stamp,s.push(f))}return s}resolveCircle(t,e,i,n=1.8){let s=this.near(t.x-e,t.x+e,t.z-e,t.z+e,this._tmp||(this._tmp=[])),r=!1;for(let o of s)if(!(i+n<o.y0||i>o.y1-.35))if(o.type==="box"){let l=Math.max(o.x0,Math.min(t.x,o.x1)),c=Math.max(o.z0,Math.min(t.z,o.z1)),h=t.x-l,u=t.z-c,d=h*h+u*u;if(d<e*e){if(d>1e-8){let f=Math.sqrt(d);t.x+=h/f*(e-f),t.z+=u/f*(e-f)}else{let f=t.x-o.x0,m=o.x1-t.x,x=t.z-o.z0,g=o.z1-t.z,p=Math.min(f,m,x,g);p===f?t.x=o.x0-e:p===m?t.x=o.x1+e:p===x?t.z=o.z0-e:t.z=o.z1+e}r=!0}}else{let l=t.x-o.x,c=t.z-o.z,h=l*l+c*c,u=e+o.r;if(h<u*u){let d=Math.sqrt(h)||.001;t.x=o.x+l/d*u,t.z=o.z+c/d*u,r=!0}}return r}resolveOBB(t){let e=Math.hypot(t.hl,t.hw),i=this.near(t.x-e,t.x+e,t.z-e,t.z+e,this._tmp2||(this._tmp2=[])),n=null,s=t.fz,r=-t.fx;for(let o of i){if(t.y+t.h<o.y0||t.y>o.y1-.4)continue;let l=null;if(o.type==="box"){let c=(o.x0+o.x1)/2,h=(o.z0+o.z1)/2,u=(o.x1-o.x0)/2,d=(o.z1-o.z0)/2,f=t.x-c,m=t.z-h,x=[[1,0],[0,1],[t.fx,t.fz],[s,r]],g=1/0,p=0,y=0,M=!1;for(let[v,S]of x){let b=Math.abs(t.fx*v+t.fz*S)*t.hl+Math.abs(s*v+r*S)*t.hw,E=Math.abs(v)*u+Math.abs(S)*d,_=f*v+m*S,T=b+E-Math.abs(_);if(T<=0){M=!0;break}if(T<g){g=T;let R=_<0?-1:1;p=v*R,y=S*R}}M||(l={nx:p,nz:y,depth:g,c:o})}else{let c=o.x-t.x,h=o.z-t.z,u=c*t.fx+h*t.fz,d=c*s+h*r,f=Math.max(-t.hl,Math.min(t.hl,u)),m=Math.max(-t.hw,Math.min(t.hw,d)),x=t.x+t.fx*f+s*m,g=t.z+t.fz*f+r*m,p=x-o.x,y=g-o.z,M=Math.hypot(p,y);if(M<o.r){M<1e-4&&(p=t.x-o.x,y=t.z-o.z);let v=Math.hypot(p,y)||1;l={nx:p/v,nz:y/v,depth:o.r-M,c:o}}}l&&(!n||l.depth>n.depth)&&(n=l),l&&(t.x+=l.nx*l.depth,t.z+=l.nz*l.depth)}return n}raycast(t,e,i,n,s,r,o){let l=t+n*o,c=i+r*o,h=[],u=Math.max(1,Math.ceil(o/24));this.stamp++;for(let f=0;f<=u;f++){let m=f/u*o,x=t+n*m,g=i+r*m,p=Math.floor(x/24)-1,y=Math.floor(g/24)-1;for(let M=p;M<=p+2;M++)for(let v=y;v<=y+2;v++){let S=this.cells.get(this.key(M,v));if(S)for(let b of S)b.s!==this.stamp&&(b.s=this.stamp,h.push(b))}}let d=null;for(let f of h){let m;if(f.type==="box"){let x=0,g=o,p=-1,y=0,M=(v,S,b,E,_)=>{if(Math.abs(S)<1e-9)return v>=b&&v<=E;let T=(b-v)/S,R=(E-v)/S,C=-1;if(T>R){let L=T;T=R,R=L,C=1}return T>x&&(x=T,p=_,y=C),R<g&&(g=R),x<=g};if(!M(t,n,f.x0,f.x1,0)||!M(e,s,f.y0,f.y1,1)||!M(i,r,f.z0,f.z1,2)||(m=x,m<=0))continue;(!d||m<d.t)&&(d={t:m,c:f,nx:p===0?y:0,ny:p===1?y:0,nz:p===2?y:0})}else{let x=t-f.x,g=i-f.z,p=n*n+r*r;if(p<1e-9)continue;let y=2*(x*n+g*r),M=x*x+g*g-f.r*f.r,v=y*y-4*p*M;if(v<0||(m=(-y-Math.sqrt(v))/(2*p),m<=0||m>o))continue;let S=e+s*m;if(S<f.y0||S>f.y1)continue;let b=t+n*m-f.x,E=i+r*m-f.z,_=Math.hypot(b,E)||1;(!d||m<d.t)&&(d={t:m,c:f,nx:b/_,ny:0,nz:E/_})}}return d}};var os=()=>new Promise(a=>setTimeout(a,0)),Tl=class{constructor(t){this.game=t}async build(t=()=>{}){let e=this.game;t(.05,"Levantando la meseta..."),await os();let i=new yl;t(.15,"Trazando la Ruta 3..."),await os();let n=new _l,s=n.computeHeights(i);i.flattenRoads(s),i.buildRamps(),n.buildMask(Ot);for(let u of n.nodes)u.h=i.heightAt(u.x,u.z);e.terrain=i,e.roads=n,t(.25,"Pintando la estepa..."),await os();let r=Kd();e.textures=r;let o=(u,d)=>Hn.some(f=>u>=f.x0&&u<=f.x0+f.cols*f.px&&d>=f.z0&&d<=f.z0+f.rows*f.pz)||Zs.some(f=>u>f.x0&&u<f.x1&&d>f.z0&&d<f.z1);this.terrainMesh=i.buildMesh(o),e.scene.add(this.terrainMesh),this.water=jd(i),e.scene.add(this.water),t(.4,"Asfaltando calles..."),await os(),this.roadMesh=n.buildMeshes(i,r),e.scene.add(this.roadMesh),t(.5,"Construyendo el Centro..."),await os();let l=new wl;e.colliders=l;let c=new Ml;e.city=c,c.build(i,n,r,l,e.scene),t(.7,"Instalando cig\xFCe\xF1as..."),await os();let h=new Sl;e.props=h,h.build(e),t(.8,"Soplando el viento..."),await os(),this.zoneCache={x:1e9,z:1e9,name:""}}zoneAt(t,e){let i=this.game.terrain;if(i&&i.heightAt(t,e)<-1.5&&t>nn(e)-5)return"Golfo San Jorge";for(let n of qd)if(n.rect){let[s,r,o,l]=n.rect;if(t>=s&&t<=r&&e>=o&&e<=l)return n.name}else if(n.ellipse){let[s,r,o,l]=n.ellipse;if(((t-s)/o)**2+((e-r)/l)**2<=1)return n.name}return"Comodoro Rivadavia"}footGround(t,e){let i=this.game;return i.terrain.groundAt(t,e)+i.city.curbAt(t,e)}};var El=[[0,461596,1383472,.16],[5,856880,2763332,.2],[6.3,2766182,10119786,.45],[7.2,4877992,15247480,.8],[9,5078980,12372952,1],[13,4158914,12899038,1],[17.5,5142968,13813936,.95],[19.3,3820680,15241312,.75],[20.3,1844050,8014426,.4],[21.3,659494,1974840,.2],[24,461596,1383472,.16]],Ph={despejado:{name:"Despejado",wind:9,fogNear:140,fogFar:760,clouds:.15,dust:0},nublado:{name:"Nublado",wind:13,fogNear:110,fogFar:600,clouds:.75,dust:.1},ventoso:{name:"Viento fuerte",wind:22,fogNear:60,fogFar:430,clouds:.35,dust:.55},temporal:{name:"Temporal de viento",wind:34,fogNear:15,fogFar:190,clouds:.6,dust:1}},Al=class{constructor(t,e){this.scene=t,this.time=540,this.weather="despejado",this.weatherTarget="despejado",this.weatherT=1,this.forcedWeather=null,this.windDir=new Ht(1,.15).normalize(),this.windSpeed=9,this.gust=0,this.night=0,this.dayLight=1,this.dust=0,this.nextWeatherChange=180,this.moonDir=new N(.3,.8,-.4).normalize(),this.hemi=new zr(13623551,9075290,1.2),this.sun=new Nr(16773856,2.2),this.sun.position.set(-100,200,50),t.add(this.hemi,this.sun,this.sun.target),this.fog=new br(12372952,140,760),t.fog=this.fog,this.skyUniforms={uTop:{value:new Ct},uHorizon:{value:new Ct},uSunDir:{value:new N(0,1,0)},uSunColor:{value:new Ct(16771264)},uClouds:{value:.2},uTime:{value:0},uNight:{value:0},uDust:{value:0},uDustColor:{value:new Ct(11836016)}};let i=new Ie({uniforms:this.skyUniforms,side:ii,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*p; gl_Position.z = gl_Position.w; }",fragmentShader:`
        uniform vec3 uTop, uHorizon, uSunDir, uSunColor, uDustColor; uniform float uClouds, uTime, uNight, uDust;
        varying vec3 vDir;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
        float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<5;i++){ s+=a*noise(p); p*=2.03; a*=0.5;} return s; }
        void main(){
          vec3 d = normalize(vDir);
          float h = clamp(d.y, -1.0, 1.0);
          float t = pow(clamp(h, 0.0, 1.0), 0.45);
          vec3 col = mix(uHorizon, uTop, t);
          if (h < 0.0) col = mix(uHorizon, uHorizon*0.7, clamp(-h*3.0,0.0,1.0));
          float sd = max(dot(d, normalize(uSunDir)), 0.0);
          col += uSunColor * (pow(sd, 900.0)*6.0 + pow(sd, 12.0)*0.25) * (1.0-uNight*0.9);
          // estrellas
          if (uNight > 0.01 && h > 0.0) {
            vec2 sp = d.xz / (d.y + 0.3) * 120.0;
            float st = step(0.985, hash(floor(sp))) * hash(floor(sp)+3.1);
            col += vec3(st) * uNight * (0.6 + 0.4*sin(uTime*3.0 + hash(floor(sp))*20.0));
          }
          // nubes
          if (h > 0.0) {
            vec2 uv = d.xz / (d.y + 0.08) * 1.6 + vec2(uTime*0.02, uTime*0.006);
            float c = fbm(uv);
            float cov = smoothstep(1.0 - uClouds, 1.2 - uClouds*0.5, c);
            vec3 cc = mix(vec3(1.0,0.98,0.95), uHorizon*0.9, 0.35) * (1.0 - uNight*0.85);
            col = mix(col, cc, cov * smoothstep(0.0, 0.25, h) * 0.9);
          }
          col = mix(col, uDustColor * (1.0-uNight*0.8), uDust * (1.0 - smoothstep(0.0, 0.6, h)) * 0.85);
          gl_FragColor = vec4(col, 1.0);
        }`});this.sky=new xt(new In(900,24,16),i),this.sky.frustumCulled=!1,this.sky.renderOrder=-10,t.add(this.sky),this.tmpTop=new Ct,this.tmpHor=new Ct,this.tmpA=new Ct,this.tmpB=new Ct}get hours(){return this.time/60}setWeather(t,e=!1){this.weatherTarget=t,this.weatherT=e?1:0,e&&(this.weather=t)}current(t){let e=Ph[this.weather][t],i=Ph[this.weatherTarget][t];return ht(e,i,this.weatherT)}update(t,e,i){this.time=(this.time+t)%1440;let n=this.hours;if(this.weatherT<1&&(this.weatherT=Math.min(1,this.weatherT+t/40),this.weatherT>=1&&(this.weather=this.weatherTarget)),this.nextWeatherChange-=t,this.nextWeatherChange<=0&&!this.forcedWeather){this.nextWeatherChange=240+Math.random()*360;let R=Math.random();this.setWeather(R<.45?"despejado":R<.7?"nublado":R<.93?"ventoso":"temporal")}this.forcedWeather&&this.weatherTarget!==this.forcedWeather&&this.setWeather(this.forcedWeather);let s=this.current("wind"),r=Gn(i*.35,3.7)*.7+Gn(i*1.3,8.1)*.3;this.gust=r,this.windSpeed=s*(.65+r*.7);let o=.15+(Gn(i*.05,1.1)-.5)*.6;this.windDir.set(Math.cos(o),Math.sin(o));let l=0;for(;l<El.length-2&&El[l+1][0]<n;)l++;let c=El[l],h=El[l+1],u=lt((n-c[0])/(h[0]-c[0]),0,1);this.tmpTop.setHex(c[1]).lerp(this.tmpA.setHex(h[1]),u),this.tmpHor.setHex(c[2]).lerp(this.tmpB.setHex(h[2]),u);let d=ht(c[3],h[3],u);this.dayLight=d,this.night=lt(1-(d-.16)/.5,0,1);let f=this.current("clouds"),m=this.current("dust");this.dust=m;let x=this.tmpA.setRGB(.62,.64,.66).multiplyScalar(d);this.tmpTop.lerp(x,f*.55),this.tmpHor.lerp(x,f*.4);let g=this.tmpB.setRGB(.66,.56,.4).multiplyScalar(.35+d*.65);this.tmpHor.lerp(g,m*.7);let p=this.skyUniforms;p.uTop.value.copy(this.tmpTop),p.uHorizon.value.copy(this.tmpHor),p.uClouds.value=f,p.uTime.value=i,p.uNight.value=this.night,p.uDust.value=m*.6;let y=(n-7)/13*Math.PI,M=Math.sin(y),v=-Math.cos(y),S=Math.max(M,-.3);p.uSunDir.value.set(v,S,.35).normalize();let E=1-ui(0,.35,M);p.uSunColor.value.setRGB(1,ht(.92,.55,E),ht(.8,.35,E)),this.fog.color.copy(this.tmpHor),this.fog.near=this.current("fogNear"),this.fog.far=this.current("fogFar")*ht(1,.75,this.night);let _=Math.max(0,M)>0?ht(.3,2.4,ui(0,.5,M))*(1-f*.45)*(1-m*.4):0;this.sun.intensity=_+this.night*.25,this.sun.color.copy(p.uSunColor.value),M<=0&&this.sun.color.setRGB(.55,.62,.9);let T=M>0?p.uSunDir.value:this.moonDir;this.sun.position.set(e.x+T.x*200,e.y+Math.max(.2,T.y)*200,e.z+T.z*200),this.sun.target.position.copy(e),this.hemi.intensity=ht(.35,1.25,d)*(1+f*.1),this.hemi.color.copy(this.tmpTop).lerp(this.tmpA.setRGB(1,1,1),.55),this.hemi.groundColor.setRGB(.55,.47,.35).multiplyScalar(ht(.4,1,d)),this.sky.position.copy(e)}weatherName(){return Ph[this.weatherT>.5?this.weatherTarget:this.weather].name}clockString(){let t=Math.floor(this.time/60),e=Math.floor(this.time%60);return`${String(t).padStart(2,"0")}:${String(e).padStart(2,"0")}`}};var Rl=class{constructor(t,e,i){this.max=t,this.pos=new Float32Array(t*3),this.col=new Float32Array(t*4),this.size=new Float32Array(t),this.data=[];for(let r=0;r<t;r++)this.data.push({alive:!1});this.next=0;let n=new fe;n.setAttribute("position",new ne(this.pos,3).setUsage(es)),n.setAttribute("pcolor",new ne(this.col,4).setUsage(es)),n.setAttribute("psize",new ne(this.size,1).setUsage(es)),this.geo=n;let s=new Ie({uniforms:{map:{value:e},uScale:{value:400}},transparent:!0,depthWrite:!1,blending:i?pn:Un,vertexShader:`
        attribute vec4 pcolor; attribute float psize; varying vec4 vC; uniform float uScale;
        void main(){ vC = pcolor; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = psize * uScale / max(1.0, -mv.z); gl_Position = projectionMatrix*mv; }`,fragmentShader:`
        uniform sampler2D map; varying vec4 vC;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC.rgb, vC.a * t.a); if (gl_FragColor.a < 0.01) discard; }`});this.points=new Cn(n,s),this.points.frustumCulled=!1,this.points.renderOrder=8}spawn(t,e,i,n){let s=this.next;this.next=(this.next+1)%this.max;let r=this.data[s];r.alive=!0,r.x=t,r.y=e,r.z=i,r.vx=n.vx||0,r.vy=n.vy||0,r.vz=n.vz||0,r.life=0,r.max=n.life||1,r.s0=n.s0||1,r.s1=n.s1!==void 0?n.s1:r.s0,r.r=n.r,r.g=n.g,r.b=n.b,r.r1=n.r1!==void 0?n.r1:n.r,r.g1=n.g1!==void 0?n.g1:n.g,r.b1=n.b1!==void 0?n.b1:n.b,r.a0=n.a0!==void 0?n.a0:1,r.a1=n.a1!==void 0?n.a1:0,r.grav=n.grav||0,r.drag=n.drag||0,r.wind=n.wind||0}update(t,e){let i=!1;for(let n=0;n<this.max;n++){let s=this.data[n];if(!s.alive){this.col[n*4+3]=0,this.size[n]=0;continue}if(i=!0,s.life+=t,s.life>=s.max){s.alive=!1,this.col[n*4+3]=0,this.size[n]=0;continue}let r=s.life/s.max;s.vy-=s.grav*t;let o=Math.exp(-s.drag*t);s.vx*=o,s.vy*=o,s.vz*=o,s.wind&&e&&(s.vx+=e.x*s.wind*t,s.vz+=e.y*s.wind*t),s.x+=s.vx*t,s.y+=s.vy*t,s.z+=s.vz*t,this.pos[n*3]=s.x,this.pos[n*3+1]=s.y,this.pos[n*3+2]=s.z,this.col[n*4]=s.r+(s.r1-s.r)*r,this.col[n*4+1]=s.g+(s.g1-s.g)*r,this.col[n*4+2]=s.b+(s.b1-s.b)*r,this.col[n*4+3]=s.a0+(s.a1-s.a0)*r,this.size[n]=s.s0+(s.s1-s.s0)*r}(i||this.dirty)&&(this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.pcolor.needsUpdate=!0,this.geo.attributes.psize.needsUpdate=!0,this.dirty=i)}},Cl=class{constructor(t){this.game=t;let e=t.textures;this.soft=new Rl(700,e.smoke,!1),this.glow=new Rl(500,e.glow,!0),t.scene.add(this.soft.points,this.glow.points),this.tracerMax=40,this.tracerPos=new Float32Array(this.tracerMax*6),this.tracerLife=new Float32Array(this.tracerMax);let i=new fe;i.setAttribute("position",new ne(this.tracerPos,3).setUsage(es)),this.tracers=new Er(i,new Hs({color:16773280,transparent:!0,opacity:.8})),this.tracers.frustumCulled=!1,this.tracerNext=0,t.scene.add(this.tracers),this.dustN=500;let n=new Float32Array(this.dustN*3);for(let o=0;o<this.dustN;o++)n[o*3]=st(-60,60),n[o*3+1]=st(0,25),n[o*3+2]=st(-60,60);let s=new fe;s.setAttribute("position",new ne(n,3).setUsage(es)),this.dust=new Cn(s,new Rn({color:13152392,size:.25,transparent:!0,opacity:.5,depthWrite:!1,map:e.glow})),this.dust.frustumCulled=!1,this.dustPos=n,t.scene.add(this.dust),this.flyingBags=[];let r=new fn({map:e.bag,transparent:!0,fog:!0});for(let o=0;o<6;o++){let l=new En(r);l.scale.set(.6,.6,.6),l.userData={x:st(-50,50),y:st(1,8),z:st(-50,50),ph:st(0,6)},this.flyingBags.push(l),t.scene.add(l)}}smoke(t,e,i,n=.5){let s=n;this.soft.spawn(t,e,i,{vx:st(-.3,.3),vy:st(1.2,2),vz:st(-.3,.3),life:st(1.5,2.5),s0:.8,s1:3.5,r:s,g:s,b:s,a0:.55,a1:0,drag:.4,wind:.25})}fire(t,e,i){this.glow.spawn(t+st(-.4,.4),e,i+st(-.4,.4),{vy:st(1.5,3),life:st(.35,.7),s0:1.4,s1:.3,r:1,g:.75,b:.25,r1:.9,g1:.2,b1:.05,a0:.9,a1:0,wind:.15}),Math.random()<.3&&this.smoke(t,e+.8,i,.12)}sparks(t,e,i,n=8){for(let s=0;s<n;s++)this.glow.spawn(t,e,i,{vx:st(-4,4),vy:st(1,5),vz:st(-4,4),life:st(.2,.5),s0:.18,s1:.05,r:1,g:.85,b:.4,a0:1,a1:0,grav:12})}blood(t,e,i){for(let n=0;n<6;n++)this.soft.spawn(t,e,i,{vx:st(-1.5,1.5),vy:st(0,2.5),vz:st(-1.5,1.5),life:st(.3,.6),s0:.25,s1:.1,r:.55,g:.02,b:.02,a0:.9,a1:0,grav:9})}dustPuff(t,e,i,n=4,s=.62){for(let r=0;r<n;r++)this.soft.spawn(t+st(-.5,.5),e,i+st(-.5,.5),{vx:st(-.6,.6),vy:st(.3,1),vz:st(-.6,.6),life:st(.6,1.2),s0:.6,s1:2,r:s,g:s*.88,b:s*.7,a0:.4,a1:0,drag:1,wind:.3})}splash(t,e){for(let i=0;i<12;i++)this.soft.spawn(t,.2,e,{vx:st(-2,2),vy:st(2,5),vz:st(-2,2),life:st(.5,.9),s0:.4,s1:1.2,r:.9,g:.95,b:1,a0:.8,a1:0,grav:10})}muzzle(t,e,i){this.glow.spawn(t,e,i,{life:.06,s0:.9,s1:.4,r:1,g:.9,b:.5,a0:1,a1:0})}tracer(t,e,i,n,s,r){let o=this.tracerNext;this.tracerNext=(this.tracerNext+1)%this.tracerMax,this.tracerPos.set([t,e,i,n,s,r],o*6),this.tracerLife[o]=.06}explosion(t,e,i,n){for(let s=0;s<40;s++)this.glow.spawn(t,e,i,{vx:st(-7,7),vy:st(1,9),vz:st(-7,7),life:st(.4,1),s0:3.5,s1:.5,r:1,g:.8,b:.35,r1:.8,g1:.2,b1:.05,a0:1,a1:0,drag:2.5});for(let s=0;s<24;s++)this.soft.spawn(t,e+1,i,{vx:st(-3,3),vy:st(2,6),vz:st(-3,3),life:st(2,3.5),s0:2,s1:7,r:.12,g:.11,b:.1,a0:.8,a1:0,drag:.8,wind:.3});this.sparks(t,e,i,20),this.game.onExplosion&&this.game.onExplosion(t,e,i,n)}update(t,e){let i=this.game.env;this.soft.update(t,i.windDir),this.glow.update(t,i.windDir);let n=!1;for(let c=0;c<this.tracerMax;c++)this.tracerLife[c]>0&&(this.tracerLife[c]-=t,n=!0,this.tracerLife[c]<=0&&this.tracerPos.fill(0,c*6,c*6+6));(n||this.tracerDirty)&&(this.tracers.geometry.attributes.position.needsUpdate=!0,this.tracerDirty=n);let s=i.windSpeed,r=lt((s-10)/18,0,1)*.55+i.dust*.4;if(this.dust.material.opacity=r,this.dust.visible=r>.02,this.dust.visible){let c=this.dustPos,h=i.windDir.x*s*1.1,u=i.windDir.y*s*1.1;for(let d=0;d<this.dustN;d++){let f=c[d*3]+h*t,m=c[d*3+1]+Math.sin(d+performance.now()*.003)*.02,x=c[d*3+2]+u*t;f-e.x>60?f-=120:f-e.x<-60&&(f+=120),x-e.z>60?x-=120:x-e.z<-60&&(x+=120),m-e.y>25?m-=30:m-e.y<-5&&(m+=30),c[d*3]=f,c[d*3+1]=m,c[d*3+2]=x}this.dust.geometry.attributes.position.needsUpdate=!0}let o=performance.now()*.001,l=s>14;for(let c of this.flyingBags){if(c.visible=l,!l)continue;let h=c.userData;h.x+=i.windDir.x*s*.7*t,h.z+=i.windDir.y*s*.7*t,h.y+=Math.sin(o*2+h.ph)*t*2,h.x-e.x>70&&(h.x-=140,h.y=st(1,8)),h.z-e.z>70?h.z-=140:h.z-e.z<-70&&(h.z+=140),h.x-e.x<-70&&(h.x+=140);let u=this.game.terrain.heightAt(h.x,h.z);h.y<u+.5&&(h.y=u+.5),c.position.set(h.x,h.y,h.z),c.material.rotation=Math.sin(o*5+h.ph)}}};var Pl=class{constructor(t){this.renderer=t,this.enabled=!0,this.scale=1;let e=t.getContext(),i=!!(e.getExtension("EXT_color_buffer_half_float")||e.getExtension("EXT_color_buffer_float")),n={minFilter:Oe,magFilter:Oe,type:i?Si:ci};this.sceneRT=new Ke(4,4,{...n,depthBuffer:!0}),this.histA=new Ke(4,4,n),this.histB=new Ke(4,4,n),this.quadCam=new Nn(-1,1,1,-1,0,1),this.mat=new Ie({uniforms:{tScene:{value:null},tPrev:{value:null},uTrail:{value:.35},uTint:{value:new N(1.04,1,.94)},uSat:{value:1.08},uVig:{value:.35},uFlash:{value:0},uGrey:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`
        uniform sampler2D tScene, tPrev; uniform float uTrail, uSat, uVig, uFlash, uGrey; uniform vec3 uTint; varying vec2 vUv;
        void main(){
          vec3 c = texture2D(tScene, vUv).rgb;
          vec3 p = texture2D(tPrev, vUv).rgb;
          c = mix(c, p, uTrail);
          float l = dot(c, vec3(0.299, 0.587, 0.114));
          c = mix(vec3(l), c, uSat) * uTint;
          c = mix(c, vec3(l * 0.9), uGrey);
          vec2 d = vUv - 0.5;
          c *= 1.0 - dot(d, d) * uVig * 1.6;
          c += uFlash;
          gl_FragColor = vec4(c, 1.0);
        }`,depthTest:!1,depthWrite:!1}),this.copyMat=new Ie({uniforms:{t:{value:null}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`uniform sampler2D t; varying vec2 vUv;
        vec3 toSRGB(vec3 c){ c = max(c, 0.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
        void main(){ gl_FragColor = vec4(toSRGB(texture2D(t, vUv).rgb), 1.0); }`,depthTest:!1,depthWrite:!1}),this.quad=new xt(new ei(2,2),this.mat),this.quad.frustumCulled=!1,this.quadScene=new jn,this.quadScene.add(this.quad)}setSize(t,e,i){this.scale=i;let n=Math.max(2,Math.floor(t*i)),s=Math.max(2,Math.floor(e*i));this.sceneRT.setSize(n,s),this.histA.setSize(n,s),this.histB.setSize(n,s)}render(t,e){let i=this.renderer;if(!this.enabled){i.setRenderTarget(null),i.render(t,e);return}i.setRenderTarget(this.sceneRT),i.render(t,e),this.quad.material=this.mat,this.mat.uniforms.tScene.value=this.sceneRT.texture,this.mat.uniforms.tPrev.value=this.histA.texture,i.setRenderTarget(this.histB),i.render(this.quadScene,this.quadCam),this.quad.material=this.copyMat,this.copyMat.uniforms.t.value=this.histB.texture,i.setRenderTarget(null),i.render(this.quadScene,this.quadCam);let n=this.histA;this.histA=this.histB,this.histB=n}};function nf(a,t=!1){let e=a[0].index!==null,i=new Set(Object.keys(a[0].attributes)),n=new Set(Object.keys(a[0].morphAttributes)),s={},r={},o=a[0].morphTargetsRelative,l=new fe,c=0;for(let h=0;h<a.length;++h){let u=a[h],d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0,u=[];for(let d=0;d<a.length;++d){let f=a[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=a[d].attributes.position.count}l.setIndex(u)}for(let h in s){let u=ef(s[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in r){let u=r[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<r[h].length;++x)f.push(r[h][x][d]);let m=ef(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function ef(a){let t,e,i,n=-1,s=0;for(let c=0;c<a.length;++c){let h=a[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=h.gpuType),n!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=h.count*e}let r=new t(s),o=new ne(r,e,i),l=0;for(let c=0;c<a.length;++c){let h=a[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<e;m++){let x=h.getComponent(d,m);o.setComponent(d+u,m,x)}}else r.set(h.array,l);l+=h.count*e}return n!==void 0&&(o.gpuType=n),o}var Ih=new Map;function Ll(a,t=null,e=!1){let i=a+(t?t.uuid:"")+(e?"vc":"");if(Ih.has(i))return Ih.get(i);let n=new Jt({color:a,map:t,vertexColors:e});return Ih.set(i,n),n}var ev=()=>Ll(16777215,null,!0);function tr(a,t,e,i=0,n=0,s=16777215,r=null,o=0){let l=new ve(a,t,e);l.translate(o,i,n);let c=it(s),h=l.attributes.position.count,u=new Float32Array(h*3);for(let d=0;d<h;d++)u[d*3]=c[0],u[d*3+1]=c[1],u[d*3+2]=c[2];if(l.setAttribute("color",new ne(u,3)),r){let d=l.attributes.uv;for(let f=0;f<d.count;f++)d.setXY(f,r[0],r[1])}return l}var Il=a=>nf(a,!1),zl=class{constructor(t,e){if(this.look=t,this.root=new Qt,this.body=new Qt,this.root.add(this.body),this.anim={phase:0,speed:0,punch:0,aim:0,air:0,sit:0,dead:0,swim:0,jugg:0,wave:0,dance:0},this.build(t),e){let i=new xt(new ei(1.3,1.3),new He({map:e,transparent:!0,depthWrite:!1,fog:!0}));i.rotation.x=-Math.PI/2,i.position.y=.04,i.renderOrder=4,this.shadow=i,this.root.add(i)}}build(t){let e=t.fat||0,i=t.height||1,n=t.shirtKind==="banda"?t.sleeveColor||16053492:t.shirt,s=t.shirtKind?Ll(16777215,tf(t.shirtKind,t.shirtHex,t.shirtAccent||"#000")):Ll(t.shirt),r=ev(),o=.93*i;this.hips=new Qt,this.hips.position.y=o,this.body.add(this.hips);let l=.42+e*.26,c=.23+e*.2;this.torso=new Qt,this.hips.add(this.torso);let h=[new ve(l,.6*i,c).translate(0,.3*i,0)];e>.15&&h.push(new ve(l*.86,.34,.12+e*.12).translate(0,.2,c/2)),this.torso.add(new xt(h.length>1?Il(h):h[0],s)),this.hips.add(new xt(tr(l*.95,.18,c*.95,-.02,0,t.pants),r)),this.neck=new Qt,this.neck.position.y=.6*i,this.torso.add(this.neck);let u=z=>"#"+new Ct(z).getHexString(),d=Qd({skin:u(t.skin),hair:u(t.hair||2759956),hat:u(t.hat||1847147),glasses:t.glasses,mustache:t.mustache,beard:t.beard,beardColor:t.beardColor,smile:t.smile}),f=Ll(16777215,d),m=.25+e*.04,x=[.5,.97],g=[.05,.95],p=[.95,.95],y=new ve(m,.28,.26).translate(0,.17,0);{let z=y.attributes.uv;for(let P=0;P<z.count;P++)(P<16||P>=20)&&z.setXY(P,x[0],x[1])}let M=[y],v=(z,P,D,O,k,$)=>{let W=new ve(z,P,D).translate(0,O,k||0),Y=W.attributes.uv;for(let j=0;j<Y.count;j++)Y.setXY(j,$[0],$[1]);M.push(W)},S=t.hairStyle||"short";S==="short"&&v(m+.02,.07,.28,.33,-.01,g),S==="long"&&(v(m+.03,.08,.29,.33,-.01,g),v(m+.03,.3,.08,.18,-.13,g)),S==="cap"&&(v(m+.03,.09,.29,.34,-.01,p),v(m,.03,.14,.31,.19,p)),S==="helmet"&&(v(m+.07,.13,.33,.34,0,p),v(m+.12,.03,.4,.29,0,p)),S==="police"&&(v(m+.05,.1,.3,.35,0,p),v(m,.03,.12,.31,.19,g)),S==="beanie"&&v(m+.03,.12,.29,.34,-.01,p),this.head=new xt(Il(M),f),this.neck.add(this.head);let b=l/2+.075,E=t.longSleeves?n:t.skin,_=Il([tr(.13+e*.04,.32,.14+e*.03,-.15,0,n),tr(.11+e*.03,.3,.12,-.45,0,E),tr(.1,.1,.11,-.64,0,t.skin)]),T=z=>{let P=new Qt;return P.position.set(z*b,.55*i,0),P.add(new xt(_,r)),this.torso.add(P),P};this.armL=T(1),this.armR=T(-1);let R=l*.25,C=Il([tr(.17+e*.05,.86*i,.19+e*.04,-.43*i,0,t.pants),tr(.17,.1,.29,-.88*i,.05,t.shoes||2236962)]),L=z=>{let P=new Qt;return P.position.set(z*R,-.02,0),P.add(new xt(C,r)),this.hips.add(P),P};this.legL=L(1),this.legR=L(-1),this.handSlot=new Qt,this.handSlot.position.set(0,-.64,.02),this.armR.add(this.handSlot),this.hipY=o}setHeld(t){for(;this.handSlot.children.length;)this.handSlot.remove(this.handSlot.children[0]);t&&this.handSlot.add(t)}update(t,e){let i=this.anim,n=e.speed||0,s=n>.2;i.phase+=t*(s?Math.min(12,3+n*1.55):0);let r=lt(n/5,0,1.3),o=Math.sin(i.phase),l=Math.cos(i.phase),c=0,h=0,u=0,d=0,f=0,m=0,x=0,g=0,p=0;if(s){let M=ht(.45,.95,lt(r,0,1));c=o*M,h=-o*M,u=-o*M*.8,d=o*M*.8,x=.05+r*.12,g=Math.abs(l)*.05*(.5+r)}else g=Math.sin(performance.now()*.002)*.008,f=.06,m=-.06;if(i.air=ht(i.air,e.air?1:0,lt(t*10,0,1)),i.air>.05&&(c=ht(c,-.5,i.air),h=ht(h,.3,i.air),u=ht(u,-.9,i.air),d=ht(d,-.9,i.air),f=ht(f,.5,i.air),m=ht(m,-.5,i.air)),i.swim=ht(i.swim,e.swim?1:0,lt(t*5,0,1)),i.swim>.05){let M=i.swim;x=ht(x,1.2,M),u=ht(u,-2.5+Math.sin(i.phase*.6)*1.5,M),d=ht(d,-2.5-Math.sin(i.phase*.6)*1.5,M),c=ht(c,o*.3,M),h=ht(h,-o*.3,M)}if(i.aim=ht(i.aim,e.aim?1:0,lt(t*14,0,1)),i.aim>.02&&(d=ht(d,-Math.PI/2+(e.aimPitch||0),i.aim),m=ht(m,0,i.aim),e.twoHanded&&(u=ht(u,-Math.PI/2+(e.aimPitch||0)+.1,i.aim),f=ht(f,-.5,i.aim))),i.punch>0){i.punch=Math.max(0,i.punch-t*3.2);let M=Math.sin((1-i.punch)*Math.PI);if(e.melee==="bate")d=ht(d,-2.4+(1-i.punch)*2.6,1),m=-.3,u=d,f=.3,p=(1-i.punch)*1.2-.6;else{let v=e.punchSide||1;v>0?(d=-1.5*M,m=-.1):(u=-1.5*M,f=.1),p=v*M*.35}}if(e.jugg){let M=performance.now()*.012;u=-1.2+Math.sin(M)*.35,d=-1.2+Math.sin(M+Math.PI)*.35,f=.25,m=-.25}if(e.wave&&(d=-2.6+Math.sin(performance.now()*.015)*.3,m=-.4),e.dance){let M=performance.now()*.009;u=-1.5+Math.sin(M)*.8,d=-1.5+Math.cos(M)*.8,c=Math.max(0,Math.sin(M*2))*.5,h=Math.max(0,-Math.sin(M*2))*.5,p=Math.sin(M)*.3,g=Math.abs(Math.sin(M*2))*.08}if(e.ride){let M=e.pedal||0;c=-.95+Math.sin(M)*.45,h=-.95-Math.sin(M)*.45,x=e.ride==="moto"?.3:.45,g=0,u=-1.25,d=-1.25,f=.2,m=-.2,this.legL.rotation.x=c,this.legR.rotation.x=h,this.armL.rotation.x=u,this.armR.rotation.x=d,this.armL.rotation.z=f,this.armR.rotation.z=m,this.torso.rotation.x=x,this.torso.rotation.y=0,this.hips.position.y=this.hipY-.25,this.body.rotation.x=0,this.body.position.y=0,this.body.position.z=0,e.aim&&(this.armR.rotation.x=-Math.PI/2,this.armR.rotation.z=e.aimSide>0?1.3:-.2),this.shadow&&(this.shadow.visible=!1);return}i.sit=e.sit?1:0,i.sit&&(c=-1.45,h=-1.45,x=-.05,g=0,u=-1.1,d=-1.1,f=.15,m=-.15,e.steer&&(u+=e.steer*.3,d-=e.steer*.3),e.aim&&(d=-Math.PI/2,m=e.aimSide>0?1.3:-.2)),this.legL.rotation.x=c,this.legR.rotation.x=h,this.armL.rotation.x=u,this.armR.rotation.x=d,this.armL.rotation.z=f,this.armR.rotation.z=m,this.torso.rotation.x=x,this.torso.rotation.y=p,this.hips.position.y=this.hipY+g-(i.sit?.45:0),this.neck.rotation.y=e.lookYaw||0;let y=e.dead?1:0;i.dead=ht(i.dead,y,lt(t*6,0,1)),this.body.rotation.x=-i.dead*Math.PI/2*.98+(e.knock||0),this.body.position.y=i.dead*.18,this.body.position.z=-i.dead*.1,this.shadow&&(this.shadow.visible=!i.sit)}},Dl={gordopin:{skin:13212276,hair:1971212,hairStyle:"short",fat:.95,height:1,shirt:1847147,shirtKind:"banda",shirtHex:"#f4f4f4",shirtAccent:"#1c2f6b",pants:2764602,shoes:15658734,beard:!0,beardColor:"#2a1d14",smile:!0},petroca:{skin:13803644,hair:2759956,hairStyle:"short",fat:.3,height:1.04,shirt:5205910,shirtKind:"jean",shirtHex:"#4f6f96",longSleeves:!0,pants:2964053,shoes:6964260,glasses:!0,mustache:!0}},iv=[1578e4,14263420,12618340,10119752,15251600,8016438],nv=[1971212,3810836,5913116,2763306,9071162,11575440,1118481],sv=[9052192,2771594,3828282,14209216,5921370,13134368,6961770,15261856,2109504,10533064,8018490,15921906],rv=[2767445,1973794,4868682,6969920,3820138,5913130];function ni(a,t=Math.random){let e=n=>n[Math.floor(t()*n.length)],i={skin:e(iv),hair:e(nv),hairStyle:e(["short","short","short","long","cap","beanie","bald"]),fat:t()<.3?t()*.6:t()*.2,height:.94+t()*.12,shirt:e(sv),pants:e(rv),shoes:e([2236962,15658734,5913120,3357252]),mustache:t()<.2,beard:t()<.12,glasses:t()<.08,longSleeves:t()<.6};return a==="lobo"&&(i.shirtKind="banda",i.shirtHex="#f4f4f4",i.shirtAccent="#1c2f6b",i.shirt=16053492,i.hairStyle=e(["short","cap","beanie"]),i.hat=1847147),a==="cheto"&&(i.shirtKind="polo",i.shirtHex=e(["#7b2d8b","#b04a9a","#f0a0c8"]),i.shirtAccent="#f2f2f2",i.shirt=8072587,i.pants=e([15261896,14209208]),i.hairStyle=e(["long","short"]),i.hair=e([9071162,13148256,3810836]),i.glasses=t()<.4,i.fat=.05,i.skin=e([1578e4,15251600])),a==="caleta"&&(i.shirt=15253536,i.shirtKind=null,i.hairStyle=e(["cap","short"]),i.hat=15253536,i.pants=1973794),a==="cana"&&(i.shirt=2767450,i.shirtKind=null,i.longSleeves=!0,i.pants=1714762,i.hairStyle="police",i.shoes=1118481,i.fat=t()*.4),a==="petrolero"&&(i.shirtKind="mameluco",i.shirtHex=e(["#e8661a","#1b4fa0","#d0a020"]),i.shirtAccent="#e8e8d0",i.shirt=15230490,i.longSleeves=!0,i.pants=e([15230490,1789856]),i.hairStyle="helmet",i.hat=e([15921906,15909424]),i.shoes=5913120),a==="abuela"&&(i.shirt=9067130,i.pants=3816010,i.hair=14211288,i.hairStyle="long",i.fat=.35,i.height=.9,i.glasses=!0,i.skin=15251600,i.longSleeves=!0),a==="tenpesos"&&(i.shirt=2767450,i.pants=1714762,i.hairStyle="police",i.mustache=!0,i.fat=.55,i.skin=14263420,i.longSleeves=!0,i.shoes=1118481),a==="crudo"&&(i.shirt=2763310,i.pants=2763310,i.hairStyle="short",i.hair=11579568,i.fat=.45,i.glasses=!0,i.longSleeves=!0,i.shoes=1118481,i.skin=1578e4),i}var se={punos:{id:"punos",name:"Pu\xF1os",icon:"\u{1F44A}",melee:!0,dmg:7,range:1.4,rate:.38,slot:0},clavas:{id:"clavas",name:"Clavas de malabar",icon:"\u{1F3B3}",melee:!0,dmg:13,range:1.6,rate:.5,slot:1,mesh:"clava"},bate:{id:"bate",name:"Bate",icon:"\u{1F3CF}",melee:!0,dmg:24,range:1.9,rate:.75,slot:1,mesh:"bate",swing:"bate"},pistola:{id:"pistola",name:"Pistola 9mm",icon:"\u{1F52B}",dmg:20,range:70,rate:.26,clip:17,spread:.018,slot:2,mesh:"pistola",price:250,ammoPrice:60,ammoPack:34,sound:"pistol"},escopeta:{id:"escopeta",name:"Escopeta",icon:"\u{1F4A5}",dmg:11,pellets:8,range:32,rate:.95,clip:6,spread:.08,slot:3,mesh:"escopeta",twoHanded:!0,price:700,ammoPrice:120,ammoPack:16,sound:"shotgun"},uzi:{id:"uzi",name:"Uzi",icon:"\u{1F52B}",dmg:11,range:55,rate:.085,clip:50,spread:.05,auto:!0,slot:4,mesh:"uzi",price:1200,ammoPrice:150,ammoPack:100,sound:"smg"}};var Lh={};function Nl(a){if(!a)return null;if(!Lh[a]){let t=new Qt,e=i=>new Jt({color:i});if(a==="clava"){let i=new xt(new gi(.05,.02,.5,6),e(15921906));i.position.y=-.2,i.rotation.x=0;let n=new xt(new gi(.052,.052,.08,6),e(1847147));n.position.y=-.3;let s=new Qt;s.add(i,n),s.rotation.x=Math.PI/2,s.position.z=.1,t.add(s)}else if(a==="bate"){let i=new xt(new gi(.05,.025,.85,6),e(10119738));i.rotation.x=Math.PI/2,i.position.z=.35,t.add(i)}else if(a==="pistola"){let i=new xt(new ve(.05,.08,.2),e(1710618));i.position.set(0,.02,.08);let n=new xt(new ve(.045,.12,.06),e(2763306));n.position.set(0,-.04,0),t.add(i,n)}else if(a==="escopeta"){let i=new xt(new ve(.06,.08,.95),e(2763306));i.position.z=.3;let n=new xt(new ve(.07,.12,.35),e(6965802));n.position.z=-.15,t.add(i,n)}else if(a==="uzi"){let i=new xt(new ve(.06,.1,.3),e(1710618));i.position.z=.1;let n=new xt(new ve(.04,.18,.05),e(2763306));n.position.set(0,-.1,.05),t.add(i,n)}Lh[a]=t}return Lh[a].clone()}var sn=new N;function av(a,t,e,i,n,s,r,o,l){let c={t:l,kind:"none"},h=a.colliders.raycast(e,i,n,s,r,o,l);h&&h.t<c.t&&(c={t:h.t,kind:"static",n:h});for(let u=1;u<c.t;u+=1.5){let d=e+s*u,f=i+r*u,m=n+o*u;if(f<a.terrain.heightAt(d,m)){c={t:u,kind:"ground"};break}}for(let u of a.vehicles){if(u.removed||u===t.vehicle)continue;let d=u.pos.x-e,f=u.pos.z-n,m=d*s+f*o;if(m<0||m>c.t+6)continue;let x=u.fwd,g=x.z,p=-x.x,y=(e-u.pos.x)*g+(n-u.pos.z)*p,M=(e-u.pos.x)*x.x+(n-u.pos.z)*x.z,v=i-u.pos.y,S=s*g+o*p,b=s*x.x+o*x.z,E=0,_=c.t,T=(R,C,L,z)=>{if(Math.abs(C)<1e-8)return R>=L&&R<=z;let P=(L-R)/C,D=(z-R)/C;if(P>D){let O=P;P=D,D=O}return E=Math.max(E,P),_=Math.min(_,D),E<=_};T(y,S,-u.type.W/2,u.type.W/2)&&T(v,r,.2,u.type.H)&&T(M,b,-u.type.L/2,u.type.L/2)&&E<c.t&&(c={t:E,kind:"vehicle",v:u})}for(let u of a.peds){if(u===t||u.removed||u.dead&&u.deadT>.5||u.vehicle)continue;let d=u.pos.x-e,f=u.pos.y-i,m=u.pos.z-n,x=d*s+f*r+m*o;if(x<0||x>c.t)continue;let g=e+s*x,p=n+o*x,y=Math.hypot(g-u.pos.x,p-u.pos.z),M=i+r*x;y<.38&&M>u.pos.y-.1&&M<u.pos.y+1.85&&(c={t:x,kind:"ped",p:u,head:M>u.pos.y+1.5})}return c.x=e+s*c.t,c.y=i+r*c.t,c.z=n+o*c.t,c}function sf(a,t,e){let i=se[t.weapon];if(!i||i.melee)return!1;let n=t.ammo[t.weapon]||0;if(n<=0)return a.audio&&a.audio.click(t.pos),!1;t.infiniteAmmo||(t.ammo[t.weapon]=n-1);let s=t.handWorld(),r=i.pellets||1,o=i.spread*(t.isPlayer?t.aiming?.5:1.2:t.aimSkill||2),l=!1;for(let c=0;c<r;c++){sn.copy(e),sn.x+=st(-o,o),sn.y+=st(-o,o)*.7,sn.z+=st(-o,o),sn.normalize();let h=av(a,t,s.x,s.y,s.z,sn.x,sn.y,sn.z,i.range);if(c<3&&a.effects.tracer(s.x,s.y,s.z,h.x,h.y,h.z),h.kind==="ped"){let u=i.dmg*(h.head?2.2:1)*(t.isPlayer?1:.55);h.p.hurt(u,t,{x:sn.x,z:sn.z,force:r>1?2:1}),a.effects.blood(h.x,h.y,h.z),l=!0}else h.kind==="vehicle"?(h.v.damage(i.dmg*.9*(t.isPlayer?1:.5),t),a.effects.sparks(h.x,h.y,h.z,3),h.v.driver&&h.v.driver!==t&&Math.random()<.25&&h.v.driver.hurt(i.dmg*.3,t,null),l=!0):(h.kind==="static"||h.kind==="ground")&&(c<2&&a.effects.dustPuff(h.x,h.y,h.z,2,.7),c<1&&a.effects.sparks(h.x,h.y,h.z,2))}return a.effects.muzzle(s.x+e.x*.3,s.y+e.y*.3,s.z+e.z*.3),a.audio&&a.audio.gun(i.sound,t.pos),a.onGunshot&&a.onGunshot(t,l),!0}function rf(a,t){let e=se[t.weapon]&&se[t.weapon].melee?se[t.weapon]:se.punos,i={x:Math.sin(t.heading),z:Math.cos(t.heading)},n=null,s=e.range+.4;for(let r of a.peds){if(r===t||r.dead||r.vehicle||r.removed)continue;let o=r.pos.x-t.pos.x,l=r.pos.z-t.pos.z,c=Math.hypot(o,l);c>s||Math.abs(r.pos.y-t.pos.y)>1.2||(o*i.x+l*i.z)/(c||1)<.35||(n=r,s=c)}if(n){let r=t.isPlayer?1+(a.stats?a.stats.muscle/100:0):1;return n.hurt(e.dmg*r*(t.isPlayer?1:.6),t,{x:i.x,z:i.z,force:e.id==="bate"?2.2:e.id==="punos"?.8:1.4,melee:!0}),a.audio&&a.audio.punch(n.pos),e.id!=="punos"&&a.effects.blood(n.pos.x,n.pos.y+1.3,n.pos.z),n}for(let r of a.vehicles){let o=r.pos.x-t.pos.x,l=r.pos.z-t.pos.z;if(Math.hypot(o,l)<r.type.L/2+.8&&o*i.x+l*i.z>0){r.damage(e.dmg*.4,t),a.audio&&a.audio.thud(r.pos,.3);break}}return a.audio&&a.audio.swoosh(t.pos),null}var ov=1,af=new N,er=class{constructor(t,e,i={}){this.game=t,this.id=ov++,this.look=e,this.kind=i.kind||"civil",this.name=i.name||null,this.model=new zl(e,t.textures.shadow),this.group=this.model.root,t.scene.add(this.group),this.pos=new N(i.x||0,0,i.z||0),this.pos.y=t.world.footGround(this.pos.x,this.pos.z),this.heading=i.rot||0,this.vx=0,this.vz=0,this.vy=0,this.kx=0,this.kz=0,this.onGround=!0,this.swimming=!1,this.maxHealth=i.health||100,this.health=this.maxHealth,this.armor=0,this.dead=!1,this.deadT=0,this.knockT=0,this.vehicle=null,this.seat=-1,this.moveX=0,this.moveZ=0,this.moveMag=0,this.gait=1,this.stamina=100,this.weapon="punos",this.ammo={punos:1/0},this.owned=["punos"],this.attackCD=0,this.punchSide=1,this.aiming=!1,this.aimDir=new N(0,0,1),this.aimPitch=0,this.isPlayer=!!i.isPlayer,this.brain=null,this.speedMul=i.speedMul||1,this.jugg=!1,this.wave=!1,this.dance=!1,this.anim={},this.lastAttacker=null,this.money=i.money!==void 0?i.money:Math.floor(st(0,60)),this.persistent=!!i.persistent,this.enterT=0,this.say=null,this.group.position.copy(this.pos)}give(t,e=0){this.owned.includes(t)||this.owned.push(t),se[t].melee?this.ammo[t]=1/0:this.ammo[t]=(this.ammo[t]||0)+e}setWeapon(t){if(!this.owned.includes(t))return;this.weapon=t;let e=se[t];this.model.setHeld(e.mesh?Nl(e.mesh):null)}cycleWeapon(t){let e=["punos","clavas","bate","pistola","escopeta","uzi"].filter(n=>this.owned.includes(n)&&(se[n].melee||(this.ammo[n]||0)>0)),i=e.indexOf(this.weapon);i=(i+t+e.length)%e.length,this.setWeapon(e[i])}handWorld(){let t=this.aiming?this.aimDir:af.set(Math.sin(this.heading),0,Math.cos(this.heading)),e=-Math.cos(this.heading)*.25,i=Math.sin(this.heading)*.25;if(this.vehicle){let n=this.vehicle.seatWorld(this.seat,new N);return{x:n.x+t.x*.6,y:n.y+1.1,z:n.z+t.z*.6}}return{x:this.pos.x+e+t.x*.5,y:this.pos.y+1.4+(this.aiming?t.y*.5:0),z:this.pos.z+i+t.z*.5}}get speed(){return Math.hypot(this.vx,this.vz)}jump(){this.onGround&&!this.swimming&&!this.vehicle&&this.knockT<=0&&!this.dead&&(this.vy=5.6,this.onGround=!1)}attack(){if(this.dead||this.knockT>0||this.attackCD>0)return!1;let t=se[this.weapon]||se.punos;if(t.melee||(this.ammo[this.weapon]||0)<=0&&t.melee)return this.attackCD=t.rate,this.model.anim.punch=1,this.punchSide=-this.punchSide,setTimeout(()=>{this.dead||rf(this.game,this)},140),!0;if((this.ammo[this.weapon]||0)<=0)return this.attackCD=.3,this.game.audio&&this.game.audio.click(this.pos),!1;this.attackCD=t.rate;let e=this.aiming||this.vehicle?this.aimDir:af.set(Math.sin(this.heading),0,Math.cos(this.heading)).clone();return sf(this.game,this,e),!0}hurt(t,e,i){if(!(this.dead||this.invincible)){if(this.armor>0){let n=Math.min(this.armor,t*.7);this.armor-=n,t-=n}if(this.health-=t,this.lastAttacker=e,this.hurtT=.3,i&&i.force){let n=i.force;this.kx+=i.x*n*2.2,this.kz+=i.z*n*2.2,(n>1.8||i.melee&&Math.random()<.18&&!this.isPlayer)&&this.knockdown(i.x*n*2,i.z*n*2,n>3?3:1.5)}this.health<=0&&this.die(e),this.onHurt&&this.onHurt(t,e),this.game.onPedHurt&&this.game.onPedHurt(this,e,t)}}knockdown(t,e,i=2){this.vehicle||(this.knockT=1.6,this.kx=t,this.kz=e,this.vy=i,this.onGround=!1)}die(t){this.dead||(this.dead=!0,this.health=0,this.deadT=0,this.vehicle&&this.exitVehicle(!0),this.game.onPedDeath&&this.game.onPedDeath(this,t))}enterVehicle(t,e=0){if(t.seats[e]&&t.seats[e]!==this)return!1;this.vehicle=t,this.seat=e,t.seats[e]=this,e===0&&(t.driver=this,t.parked=!1),this.game.scene.remove(this.group),t.group.add(this.group);let i=t.model.seats[e];return this.group.position.set(i[0],i[1]-.05,i[2]),this.group.rotation.set(0,0,0),this.vx=this.vz=this.vy=0,this.swimming=!1,!0}exitVehicle(t=!1){let e=this.vehicle;if(!e)return;e.seats[this.seat]=null,e.driver===this&&(e.driver=null,e.ctrl.throttle=0,e.ctrl.steer=0,e.ctrl.handbrake=!1),e.group.remove(this.group),this.game.scene.add(this.group);let i=e.doorPos(this.seat),n=i.x,s=i.z,r={x:n,z:s};if(this.game.colliders.resolveCircle(r,.35,e.pos.y)){let o=e.doorPos(this.seat===0?1:0);n=o.x,s=o.z}this.pos.set(n,Math.max(e.pos.y,this.game.world.footGround(n,s)),s),this.heading=e.heading,this.vehicle=null,this.seat=-1,t&&(this.vx=e.vx*.6,this.vz=e.vz*.6),e.type.bike&&e.speed>4&&this.knockdown(e.vx*.7,e.vz*.7,3)}update(t){let e=this.game;if(this.attackCD=Math.max(0,this.attackCD-t),this.hurtT>0&&(this.hurtT-=t),this.vehicle){let f=this.vehicle;this.pos.copy(f.pos),f.type.bike&&(this.pedal=(this.pedal||0)+(f.key==="bmx"?f.forwardSpeed*t*1.6:0)),this.model.update(t,{sit:!0,steer:f.driver===this?f.ctrl.steer:0,ride:f.type.bike?f.key==="bmx"?"bici":"moto":null,pedal:this.pedal,aim:this.driveBy,aimSide:this.driveBySide});return}if(this.dead){this.deadT+=t,this.kx*=Math.exp(-4*t),this.kz*=Math.exp(-4*t),this.physics(t,0,0,!0),this.model.update(t,{dead:!0}),this.group.position.copy(this.pos),this.group.rotation.y=this.heading;return}let i=this.moveX,n=this.moveZ,s=this.moveMag;this.knockT>0&&(this.knockT-=t,i=0,n=0,s=0);let r=this.isPlayer&&e.stats?1-e.stats.fat/400:1,o=[1.7,4.6,7][this.gait]*this.speedMul*r;this.gait===2&&this.isPlayer?(this.stamina-=t*(18+(e.stats?e.stats.fat/5:0)),this.stamina<=0&&(this.stamina=0,o=4.6*r)):this.stamina=Math.min(100,this.stamina+t*12),this.aiming&&(o=Math.min(o,2.2)),this.swimming&&(o=2.3);let l=i*o*s,c=n*o*s,h=this.onGround||this.swimming?1-Math.exp(-12*t):1-Math.exp(-1.5*t);this.vx=ht(this.vx,l,h),this.vz=ht(this.vz,c,h),this.aiming?this.heading=$r(this.heading,Math.atan2(this.aimDir.x,this.aimDir.z),t*14):s>.1&&this.knockT<=0&&(this.heading=$r(this.heading,Math.atan2(i,n),t*11)),this.physics(t,this.vx,this.vz,!1);let u=this.knockT>0,d=se[this.weapon];this.model.update(t,{speed:u?0:Math.hypot(this.vx,this.vz)*(this.isPlayer?1:1.05),air:!this.onGround&&!this.swimming&&!u,swim:this.swimming,aim:(this.aiming||d&&!d.melee&&this.attackCD>d.rate-.12)&&!u,aimPitch:this.aimPitch,twoHanded:d&&d.twoHanded,melee:d&&d.swing,punchSide:this.punchSide,dead:u,knock:0,jugg:this.jugg,wave:this.wave,dance:this.dance}),this.group.position.copy(this.pos),this.swimming&&(this.group.position.y=this.pos.y-.9),this.group.rotation.y=this.heading}physics(t,e,i,n){let s=this.game,r=s.world,o=0,l=0;if(s.env&&s.env.windSpeed>18&&!n){let d=(s.env.windSpeed-18)*.05;o=s.env.windDir.x*d,l=s.env.windDir.y*d}this.pos.x+=(e+this.kx+o)*t,this.pos.z+=(i+this.kz+l)*t,this.kx*=Math.exp(-5*t),this.kz*=Math.exp(-5*t);let c=r.footGround(this.pos.x,this.pos.z);s.terrain.heightAt(this.pos.x,this.pos.z)<-1.2&&c<-1&&this.pos.y<.3?(!this.swimming&&this.vy<-3&&s.effects&&s.effects.splash(this.pos.x,this.pos.z),this.swimming=!0,this.pos.y=ht(this.pos.y,0,1-Math.exp(-6*t)),this.vy=0,this.onGround=!1,n&&(this.pos.y=-.3)):(this.swimming=!1,this.vy-=20*t,this.pos.y+=this.vy*t,this.pos.y<=c?(this.vy<-14&&!n&&this.hurt((-this.vy-14)*6,null,null),this.pos.y=c,this.vy=0,this.onGround=!0):this.pos.y-c<.35&&this.vy<=0?(this.pos.y=c,this.vy=0,this.onGround=!0):this.onGround=!1),s.colliders.resolveCircle(this.pos,.33,this.pos.y);let u=s.worldBounds;u&&(this.pos.x=lt(this.pos.x,u.minX+3,u.maxX-3),this.pos.z=lt(this.pos.z,u.minZ+3,u.maxZ-3))}remove(){this.vehicle&&this.exitVehicle(),this.group.parent&&this.group.parent.remove(this.group),this.removed=!0}};function Ci(a,t,e=2.5){a.say={text:t,t:e}}var Hi={hit:["\xA1Eh, qu\xE9 hac\xE9', loco!","\xA1Ay, la puta madre!","\xA1Par\xE1, par\xE1!","\xA1Te voy a denunciar!","\xA1Sal\xED de ac\xE1, gil!"],car:["\xA1Mir\xE1 por d\xF3nde manej\xE1s!","\xA1Aprend\xE9 a manejar, bol\xFA!","\xA1Casi me pis\xE1s!","\xA1Sacaste el registro en una rifa!"],flee:["\xA1Socorro!","\xA1Llamen a la cana!","\xA1Corr\xE9, corr\xE9!","\xA1Est\xE1 loco este!"],gordopin:["\xA1Aguante el Lobo, Gordopin!","\xA1Eh, Gordopin! \xA1Hac\xE9 los malabares!","\xA1Vamos Newbery!","\xA1Buena, Gordo!"],wind:["\xA1Qu\xE9 viento, la puta!","Se me vol\xF3 la gorra...","Hoy sopla fuerte, eh.","Ni el perro sale con este viento."],cheto:["\xBFY vos qui\xE9n sos, negro?","Mi viejo es gerente de la petrolera.","Sal\xED de mi playa.","Esto es Rada, no el Km 8."],cana:["\xA1Alto, polic\xEDa!","\xA1Al suelo!","\xA1Quieto ah\xED!","\xA1Documentos!"]};var cf={fitito:{name:"Fitito 600",style:"tiny",L:3.3,W:1.42,H:1.38,mass:600,power:6.5,maxSpeed:27,grip:5.5,steer:2.3,brake:13,colors:[15261856,10143960,14174778,15921906,8034922]},reno12:{name:"Ren\xF3 12",style:"sedan",L:4.35,W:1.64,H:1.43,mass:950,power:7.5,maxSpeed:36,grip:5,steer:2.1,brake:14,colors:[14209200,6982320,11549226,3824186,15921906,9075290,2771578]},falcon:{name:"Falc\xF3n",style:"sedan",L:4.9,W:1.8,H:1.42,mass:1300,power:8.5,maxSpeed:40,grip:4.6,steer:1.9,brake:13,colors:[3099194,5921370,14209216,8006186,2767450,1381653]},pijo504:{name:"Pij\xF3 504",style:"sedan",L:4.5,W:1.7,H:1.45,mass:1150,power:8,maxSpeed:38,grip:5.2,steer:2.1,brake:14,colors:[15921906,9085112,13154448,3815994,10107434]},gool:{name:"Gool",style:"hatch",L:3.9,W:1.65,H:1.42,mass:950,power:8.5,maxSpeed:39,grip:5.8,steer:2.3,brake:15,colors:[14161944,15921906,2763306,3828400,11055288,15253536]},duna:{name:"Fiaz Duna",style:"sedan",L:4.1,W:1.6,H:1.42,mass:900,power:7.5,maxSpeed:36,grip:5.2,steer:2.2,brake:14,colors:[15921906,9050650,4876938,12105896]},jilux:{name:"Toyoda Jilux",style:"pickup",L:5.25,W:1.82,H:1.8,mass:1700,power:10,maxSpeed:42,grip:5,steer:1.95,brake:14,offroad:!0,colors:[15921906,10133154,1710618,11540504,3820138]},empresa:{name:"Chata de Empresa",style:"pickup",L:5.25,W:1.82,H:1.8,mass:1700,power:9.5,maxSpeed:40,grip:5,steer:1.95,brake:14,offroad:!0,flag:!0,colors:[15921906]},f100:{name:"Forz F-100",style:"pickup",L:5.1,W:1.95,H:1.85,mass:1800,power:8,maxSpeed:37,grip:4.5,steer:1.8,brake:12,offroad:!0,colors:[3824266,12098128,8006170,5925450,14209216]},remis:{name:"Rem\xEDs",style:"sedan",L:4.5,W:1.7,H:1.45,mass:1150,power:8,maxSpeed:38,grip:5.2,steer:2.1,brake:14,sign:"REMIS",colors:[1710618]},patrullero:{name:"Patrullero",style:"sedan",L:4.5,W:1.72,H:1.45,mass:1200,power:10,maxSpeed:44,grip:5.6,steer:2.2,brake:16,police:!0,colors:[15921906]},colectivo:{name:"Colectivo",style:"bus",L:11,W:2.5,H:3.1,mass:9e3,power:4.5,maxSpeed:26,grip:4,steer:1.3,brake:9,colors:[15253536,2779824,15921906]},cisterna:{name:"Cami\xF3n Cisterna",style:"tanker",L:9,W:2.5,H:3.3,mass:12e3,power:4.2,maxSpeed:27,grip:4,steer:1.3,brake:8,colors:[1710618]},bmx:{name:"BMX",style:"bike",L:1.7,W:.5,H:1.1,mass:90,power:5.5,maxSpeed:13,grip:7,steer:2.8,brake:10,bike:!0,colors:[2788064,14690858,2809946,15921906]},enduro:{name:"Moto Enduro",style:"moto",L:2.15,W:.75,H:1.2,mass:180,power:13,maxSpeed:44,grip:6.5,steer:2.6,brake:15,bike:!0,offroad:!0,colors:[15231514,1739322,14737440,2771632]}},zh=new Map;function lv(a){if(zh.has(a))return zh.get(a);let t=cf[a],e=new be,i=new be,n=new be,s=[1,1,1],r=it(1976886),o=it(1842206),l=it(12106944),c=it(16774344),h=it(13114384),u=it(15921906),d=it(2236962),f=t.L,m=t.W,x=t.H,g=f/2,p=m/2,y=.33,M=[],v=[],S=[],b=[],E=x,_=(z,P,D,O,k,$,W,Y,j=s)=>{let at=[[-W,z,D],[W,z,D],[W,z,O],[-W,z,O]],ot=[[-Y,P,k],[Y,P,k],[Y,P,$],[-Y,P,$]];for(let Gt of[n])Gt.quad(at[3],at[2],ot[2],ot[3],[0,0],[1,0],[1,1],[0,1],r),Gt.quad(at[1],at[0],ot[0],ot[1],[0,0],[1,0],[1,1],[0,1],r),Gt.quad(at[2],at[1],ot[1],ot[2],[0,0],[1,0],[1,1],[0,1],r),Gt.quad(at[0],at[3],ot[3],ot[0],[0,0],[1,0],[1,1],[0,1],r);e.quad(ot[3],ot[2],ot[1],ot[0],[0,0],[1,0],[1,1],[0,1],j);for(let Gt of[-1,1])e.quad([Gt*W*1.005,z,O],[Gt*W*1.005,z,O-.12],[Gt*Y*1.005,P,$-.12],[Gt*Y*1.005,P,$],[0,0],[1,0],[1,1],[0,1],s)},T=(z,P,D,O,k)=>{for(let $ of[-1,1])i.box($*k-.17,$*k+.17,z-.08,z+.08,D-.02,D+.04,c),i.box($*k-.15,$*k+.15,P-.07,P+.07,O-.04,O+.02,h),S.push([$*k,z,D+.1]),b.push([$*k,P,O-.1]);i.box(-.25,.25,P-.25,P-.1,O-.05,O,u)};if(t.style==="sedan"||t.style==="hatch"||t.style==="tiny"){let P=t.style==="tiny"?.85:.88;if(e.box(-p,p,.28,P,-g,g,s,4,3),i.box(-p*.96,p*.96,.28,.28+.18,g,g+.08,t.style==="tiny"?l:o),i.box(-p*.96,p*.96,.28,.28+.18,-g-.08,-g,t.style==="tiny"?l:o),i.box(-p*.5,p*.5,.28+.25,P-.08,g,g+.02,o),t.style==="sedan"&&_(P,x,-g*.55,g*.25,-g*.42,g*.02,p*.93,p*.82),t.style==="hatch"&&_(P,x,-g*.92,g*.28,-g*.8,g*.02,p*.93,p*.82),t.style==="tiny"&&_(P,x,-g*.6,g*.35,-g*.45,g*.12,p*.93,p*.8),T(.68,.7,g,-g,p*.68),y=t.style==="tiny"?.27:.32,M=[[p-.1,y,g*.66],[-p+.1,y,g*.66],[p-.1,y,-g*.64],[-p+.1,y,-g*.64]],v=[[.38,.35,-.05],[-.38,.35,-.05],[.38,.35,-1],[-.38,.35,-1]],t.police){i.box(-.6,.6,x,x+.14,-.15,.15,o);for(let D of[-1,1])i.box(D*p-.01,D*p+.01,.5,.66,-g*.9,g*.9,it(1916815))}t.sign&&i.box(-.35,.35,x,x+.25,-.2,.1,it(1731370))}else if(t.style==="pickup"){e.box(-p,p,.45,1.1,-g,g,s,4,3);let D=-g*.12,O=g*.45;if(_(1.1,x,D,O,D+.05,O-.45,p*.94,p*.86),i.box(-p*.95,p*.95,1.1-.02,1.1,-g+.1,D-.05,o),i.box(-.8,.8,.45+.2,1.1-.1,g,g+.06,o),i.box(-p*1.02,p*1.02,.45-.05,.45+.15,g+.02,g+.14,l),i.box(-p*1.02,p*1.02,.45-.05,.45+.15,-g-.14,-g-.02,l),e.box(-p,-p+.08,1.1,1.1+.35,-g,D,s),e.box(p-.08,p,1.1,1.1+.35,-g,D,s),e.box(-p,p,1.1,1.1+.35,-g,-g+.08,s),t.key!=="f100"&&i.box(-p*.5,p*.5,x,x+.06,D+.2,O-.6,o),T(.9,.95,g+.02,-g,p*.7),y=.42,M=[[p-.12,y,g*.62],[-p+.12,y,g*.62],[p-.12,y,-g*.6],[-p+.12,y,-g*.6]],v=[[.4,.55,.45],[-.4,.55,.45],[.45,1.15,-1.2],[-.45,1.15,-1.8]],t.flag){i.box(-p+.05,-p+.1,1.1,1.1+3.2,-g+.3,-g+.35,it(3355443)),i.box(-p+.1,-p+.1+.02,1.1+2.8,1.1+3.2,-g+.35,-g+.85,it(15886875));for(let k of[-1,1])i.box(k*p-.01,k*p+.01,.75,.95,-.2,.9,it(15886875))}}else if(t.style==="bus")e.box(-p,p,.45,x,-g,g,s,4,3),i.box(-p-.01,p+.01,1.5,2.5,-g+.5,g-1.2,r),i.box(-p*.95,p*.95,1.1,2.7,g,g+.02,r),i.box(-p,p,.35,.6,-g-.05,g+.05,o),i.box(-p*.9,p*.9,2.75,3,g,g+.03,it(1118481)),T(.8,.9,g+.01,-g,p*.75),y=.5,M=[[p-.2,y,g*.62],[-p+.2,y,g*.62],[p-.2,y,-g*.55],[-p+.2,y,-g*.55]],v=[[.7,.9,g-1.3],[-.6,.9,1],[.6,.9,-1],[-.6,.9,-2.5]],E=3.5;else if(t.style==="tanker"){e.box(-p,p,.6,2,g-2.4,g,s),_(2,3.1,g-2.4+.1,g-.3,g-2.4+.1,g-.6,p*.96,p*.92,s),i.box(-p,p,.5,.8,-g,g-2.4,o);let P=it(14211284);for(let D=0;D<12;D++){let O=D/12*Math.PI*2,k=(D+1)/12*Math.PI*2,$=1.15,W=2,Y=-g+.1,j=g-2.4-.2,at=(ot,Gt)=>[Math.cos(ot)*$,W+Math.sin(ot)*$,Gt];i.quad(at(O,Y),at(k,Y),at(k,j),at(O,j),[0,0],[1,0],[1,1],[0,1],P),i.tri([0,W,j],at(O,j),at(k,j),[0,0,1],[0,0],[1,0],[1,1],P),i.tri([0,W,Y],at(k,Y),at(O,Y),[0,0,-1],[0,0],[1,0],[1,1],P)}for(let D of[-1,1])i.box(D*1.16-.01,D*1.16+.01,1.8,2.2,-g+.5,g-2.4-.6,it(15253536));T(1,1,g+.01,-g,p*.75),y=.52,M=[[p-.2,y,g-1.2],[-p+.2,y,g-1.2],[p-.2,y,-g+1.4],[-p+.2,y,-g+1.4],[p-.2,y,-g+2.6],[-p+.2,y,-g+2.6]],v=[[.55,1.3,g-1.2],[-.55,1.3,g-1.2]],E=3.6}else if(t.style==="bike"){let z=(P,D,O,k,$,W,Y)=>{for(let at=0;at<4;at++){let ot=at/4,Gt=(at+1)/4,Xt=D+($-D)*ot,jt=D+($-D)*Gt,Z=O+(W-O)*ot,tt=O+(W-O)*Gt;Y.box(-.035,.035,Math.min(Xt,jt)-.035,Math.max(Xt,jt)+.035,Math.min(Z,tt)-.035,Math.max(Z,tt)+.035,s)}};z(0,.33,-.1,0,.72,.5,e),z(0,.72,-.25,0,.74,.5,e),z(0,.33,-.1,0,.72,-.25,e),z(0,.33,-.1,0,.3,-.6,e),i.box(-.03,.03,.3,.95,.52,.58,it(3355443)),i.box(-.32,.32,.93,.98,.5,.56,it(2236962)),i.box(-.09,.09,.76,.82,-.36,-.14,it(1118481)),i.box(-.12,.12,.3,.36,-.14,-.06,it(7829367)),y=.3,M=[[0,y,.6],[0,y,-.6]],v=[[0,.17,-.25]],E=1.6}else t.style==="moto"&&(e.box(-.18,.18,.55,.85,-.3,.55,s),e.box(-.12,.12,.75,.95,-.75,-.2,s),i.box(-.2,.2,.35,.6,-.2,.35,o),i.box(-.35,.35,1.05,1.09,.6,.64,l),i.box(-.03,.03,.45,1.05,.62,.72,l),i.box(-.1,.1,.9,1,.7,.78,c),S.push([0,.95,.8]),b.push([0,.9,-.8]),y=.36,M=[[0,y,.75],[0,y,-.72]],v=[[0,.25,-.25],[0,.35,-.7]],E=1.7);let R=new gi(y,y,t.bike?.12:.24,10);R.rotateZ(Math.PI/2);let C=new Float32Array(R.attributes.position.count*3);for(let z=0;z<R.attributes.position.count;z++){let P=Math.abs(R.attributes.position.getX(z)),D=Math.hypot(R.attributes.position.getY(z),R.attributes.position.getZ(z)),O=P>.05&&D<y*.6?l:d;C.set(O,z*3)}R.setAttribute("color",new ne(C,3));let L={paint:e.toGeometry(),det:i.toGeometry(),glass:n.count?n.toGeometry():null,wheel:R,wheels:M,wheelR:y,seats:v,lightsF:S,lightsR:b,camH:E};return zh.set(a,L),L}var of=new Jt({vertexColors:!0}),cv=new Jt({vertexColors:!0,transparent:!0,opacity:.6,side:Qe,depthWrite:!1}),Dh=new Map;function hv(a){if(Dh.has(a))return Dh.get(a);let t=new Jt({vertexColors:!0,color:a});return Dh.set(a,t),t}var lf=new Jt({vertexColors:!0,color:2762276}),Db=new N,Nh=new N,uv=1,Ul=class{constructor(t,e,i={}){this.game=t,this.id=uv++,this.key=e,this.type=cf[e],this.type.key=e,this.color=i.color!==void 0?i.color:ae(this.type.colors),this.model=lv(e),this.group=new Qt,this.body=new Qt,this.group.add(this.body),this.paintMesh=new xt(this.model.paint,hv(this.color)),this.detMesh=new xt(this.model.det,of),this.body.add(this.paintMesh,this.detMesh),this.model.glass&&(this.glassMesh=new xt(this.model.glass,cv),this.glassMesh.renderOrder=5,this.body.add(this.glassMesh)),this.wheels=this.model.wheels.map(([s,r,o])=>{let l=new xt(this.model.wheel,of);return l.position.set(s,r,o),l.rotation.order="YXZ",this.group.add(l),l});let n=new xt(new ei(this.type.W+.8,this.type.L+.8),new He({map:t.textures.shadow,transparent:!0,depthWrite:!1,opacity:.9}));n.rotation.x=-Math.PI/2,n.position.y=.06,n.renderOrder=4,this.shadow=n,this.group.add(n),this.type.police&&(this.sirenR=new xt(new ve(.5,.16,.25),new He({color:4194304})),this.sirenB=new xt(new ve(.5,.16,.25),new He({color:64})),this.sirenR.position.set(.32,this.type.H+.15,0),this.sirenB.position.set(-.32,this.type.H+.15,0),this.body.add(this.sirenR,this.sirenB)),this.pos=new N(i.x||0,0,i.z||0),this.heading=i.rot||0,this.vx=0,this.vz=0,this.vy=0,this.angVel=0,this.pitch=0,this.roll=0,this.susp=0,this.pos.y=t.terrain.groundAt(this.pos.x,this.pos.z),this.grounded=!0,this.health=i.health||1e3,this.fireT=0,this.dead=!1,this.sinking=0,this.ctrl={throttle:0,steer:0,brake:0,handbrake:!1},this.driver=null,this.seats=new Array(this.model.seats.length).fill(null),this.siren=!1,this.sirenT=0,this.wheelSpin=0,this.airTime=0,this.maxAir=0,this.lastImpact=0,this.parked=!!i.parked,this.locked=!1,this.persistent=!!i.persistent,this.stolenBy=null,this.radio=Math.floor(Math.random()*5),this.smokeT=0,this.lean=0,this.hornT=0,this.group.position.copy(this.pos),this.group.rotation.order="YXZ",t.scene.add(this.group),this.updateVisual(0)}get speed(){return Math.hypot(this.vx,this.vz)}get fwd(){return{x:Math.sin(this.heading),z:Math.cos(this.heading)}}get forwardSpeed(){return this.vx*Math.sin(this.heading)+this.vz*Math.cos(this.heading)}obb(){return{x:this.pos.x,z:this.pos.z,fx:Math.sin(this.heading),fz:Math.cos(this.heading),hl:this.type.L/2,hw:this.type.W/2,y:this.pos.y,h:this.type.H}}doorPos(t=0){let e=this.model.seats[t]||[.4,0,0],i=e[0]>=0?1:-1,n=this.fwd,s=n.z,r=-n.x,o=this.type.W/2+.55;return{x:this.pos.x+s*o*i+n.x*e[2],z:this.pos.z+r*o*i+n.z*e[2]}}seatWorld(t,e=new N){let i=this.model.seats[t]||[0,.5,0];return e.set(i[0],i[1],i[2]),e.applyEuler(this.group.rotation),e.add(this.group.position)}damage(t,e=null){this.dead||(this.health-=t,e&&(this.lastDamageBy=e),this.health<=0&&this.fireT===0&&(this.fireT=.001))}explode(){this.dead||(this.dead=!0,this.health=0,this.paintMesh.material=lf,this.detMesh.material=lf,this.glassMesh&&(this.glassMesh.visible=!1),this.vy=6,this.angVel+=st(-2,2),this.game.effects&&this.game.effects.explosion(this.pos.x,this.pos.y+1,this.pos.z,this.lastDamageBy),this.siren=!1,this.deadT=0)}update(t){let e=this.game,i=this.type,n=e.terrain,s=this.ctrl,r=Math.sin(this.heading),o=Math.cos(this.heading),l=this.vx*r+this.vz*o,c=this.vx*o-this.vz*r,h=n.groundAt(this.pos.x,this.pos.z),u=h<-.8&&this.pos.y<.3,d=e.roads.surfaceAt(this.pos.x,this.pos.z),f=d===0||d===2,m=!this.dead&&this.sinking<1&&(this.driver||this.aiDriving);if(this.grounded=this.pos.y<=h+.25,this.grounded&&!u){let v=m?s.throttle:0,S=f?i.offroad?.1:.45:0;if(v>.05)if(l<-.5)l=Zr(l,0,i.brake*t*v);else{let T=lt(l/(i.maxSpeed*(1-S*.5)),0,1);l+=i.power*v*(1-T*T)*(1-S*.4)*t}else v<-.05&&(l>.5?l=Zr(l,0,i.brake*t*-v):l>-i.maxSpeed*.3&&(l+=i.power*.55*v*t));s.brake>0&&(l=Zr(l,0,i.brake*s.brake*t)),l-=l*(.08+S*.9+(v===0?.25:0))*t,n.normalAt(this.pos.x,this.pos.z,Nh),l+=9.8*(Nh.x*r+Nh.z*o)*t;let b=i.grip*(f&&!i.offroad?.7:1);s.handbrake&&(b*=.22,l=Zr(l,0,5*t)),c*=Math.exp(-b*t);let E=Math.abs(l),_=s.steer*i.steer*lt(E/5,0,1)*(1/(1+E*.022))*Math.sign(l||1)*(s.handbrake?1.45:1);this.angVel=ht(this.angVel,_,1-Math.exp(-9*t))}else u?(l*=Math.exp(-2.5*t),c*=Math.exp(-2.5*t),this.angVel*=Math.exp(-2*t),this.sinking+=t):(this.angVel*=Math.exp(-.8*t),i.bike&&(this.angVel+=s.steer*1.5*t));if(this.heading=fl(this.heading+this.angVel*t),this.vx=r*l+o*c,this.vz=o*l-r*c,e.env&&this.grounded){let v=e.env.windSpeed*e.env.windSpeed*9e-4*(i.style==="bus"||i.style==="tanker"?1.2:i.bike?.9:.35);this.vx+=e.env.windDir.x*v*t,this.vz+=e.env.windDir.y*v*t}let x=this.pos.y;this.pos.x+=this.vx*t,this.pos.z+=this.vz*t;let g=n.groundAt(this.pos.x,this.pos.z);if(this.vy-=22*t,this.pos.y+=this.vy*t,u)this.pos.y=Math.max(g,Math.min(this.pos.y,.2-Math.min(3,this.sinking*.7))),this.vy=0;else if(this.pos.y<=g){let v=-this.vy;this.airTime>.25&&v>8&&(this.damage((v-8)*25),this.susp=-.25,e.audio&&e.audio.thud(this.pos,.6)),this.pos.y=g;let S=(g-x)/Math.max(t,.001);this.vy=lt(S,0,14),this.airTime>.4&&(this.lastAir=this.airTime),this.airTime=0}else this.airTime+=t,this.maxAir=Math.max(this.maxAir,this.airTime);let p=this.obb(),y=e.colliders.resolveOBB(p);if(y){this.pos.x=p.x,this.pos.z=p.z;let v=this.vx*y.nx+this.vz*y.nz;if(v<0){let S=-v;this.vx-=y.nx*v*1.25,this.vz-=y.nz*v*1.25,this.vx*=.85,this.vz*=.85,this.angVel+=(Math.random()-.5)*S*.12,S>3.5&&(this.damage((S-3.5)**1.35*9),this.lastImpact=S,e.audio&&e.audio.crash(this.pos,lt(S/20,.2,1)),e.effects&&S>6&&e.effects.sparks(this.pos.x+y.nx*-p.hl*.5,this.pos.y+.6,this.pos.z-y.nz*p.hl*.5,6),this.onImpact&&this.onImpact(S,y))}}let M=e.worldBounds;if(M&&(this.pos.x<M.minX+5&&(this.pos.x=M.minX+5,this.vx=Math.abs(this.vx)*.3),this.pos.x>M.maxX-5&&(this.pos.x=M.maxX-5,this.vx=-Math.abs(this.vx)*.3),this.pos.z<M.minZ+5&&(this.pos.z=M.minZ+5,this.vz=Math.abs(this.vz)*.3),this.pos.z>M.maxZ-5&&(this.pos.z=M.maxZ-5,this.vz=-Math.abs(this.vz)*.3)),this.fireT>0&&!this.dead&&(this.fireT+=t,e.effects&&Math.random()<t*30&&e.effects.fire(this.pos.x+(Math.random()-.5),this.pos.y+this.type.H*.7,this.pos.z+this.fwd.z*this.type.L*.3),this.fireT>4.5&&this.explode()),!this.dead&&e.effects&&(this.smokeT-=t,this.health<420&&this.smokeT<=0)){this.smokeT=this.health<250?.05:.12;let v=this.fwd;e.effects.smoke(this.pos.x+v.x*this.type.L*.4,this.pos.y+this.type.H*.7,this.pos.z+v.z*this.type.L*.4,this.health<250?.15:.7)}if(this.dead&&(this.deadT+=t),this.type.police){this.sirenT+=t;let v=this.siren,S=Math.floor(this.sirenT*6)%2;this.sirenR.material.color.setHex(v&&S?16719904:4194304),this.sirenB.material.color.setHex(v&&!S?2113791:64)}this.updateVisual(t,l)}updateVisual(t,e=0){let i=this.game,n=this.type;if(this.group.position.copy(this.pos),this.grounded||!t){let s=this.fwd,r=n.L*.4,o=n.W*.45,l=i.terrain,c=l.groundAt(this.pos.x+s.x*r,this.pos.z+s.z*r),h=l.groundAt(this.pos.x-s.x*r,this.pos.z-s.z*r),u=s.z,d=-s.x,f=l.groundAt(this.pos.x+u*o,this.pos.z+d*o),m=l.groundAt(this.pos.x-u*o,this.pos.z-d*o),x=Math.atan2(h-c,2*r),g=Math.atan2(f-m,2*o),p=t?1-Math.exp(-12*t):1;this.pitch=ht(this.pitch,x,p),this.roll=ht(this.roll,g,p)}else this.pitch=ht(this.pitch,.25,t*.8);if(n.bike){let s=-this.ctrl.steer*lt(Math.abs(e)/10,0,1)*.45;this.lean=ht(this.lean,s,t?1-Math.exp(-6*t):1)}this.susp=ht(this.susp,0,t?1-Math.exp(-6*t):1),this.group.rotation.set(this.pitch,this.heading,this.roll+(n.bike?this.lean:0)),this.body.position.y=this.susp*.3,this.wheelSpin+=e/this.model.wheelR*t,this.wheels.forEach((s,r)=>{s.rotation.x=this.wheelSpin;let o=n.bike?r===0:r<2;s.rotation.y=o?this.ctrl.steer*.45:0}),this.shadow.visible=this.pos.y-this.game.terrain.groundAt(this.pos.x,this.pos.z)<4}dispose(){this.game.scene.remove(this.group),this.removed=!0}};var Fl=class{constructor(t,e){this.game=t,this.camera=e,this.yaw=Math.PI,this.pitch=.18,this.dist=5,this.target=new N,this.pos=new N,this.lastManual=0,this.mode=0,this.shake=0,this.fov=62,this.cinematic=null,this.aimLerp=0,this.lookBack=!1}forward(){return{x:Math.sin(this.yaw),z:Math.cos(this.yaw)}}update(t,e){let i=this.game,n=this.camera;if(this.cinematic){let C=this.cinematic;C.t=Math.min(1,(C.t||0)+t/(C.dur||4));let L=C.ease?C.t*C.t*(3-2*C.t):C.t;n.position.lerpVectors(C.from,C.to,L),this.target.lerpVectors(C.lookFrom||C.look,C.look,L),n.lookAt(this.target),n.fov=ht(n.fov,C.fov||55,.1),n.updateProjectionMatrix();return}let s=i.player,r=e?e.consumeLook():{x:0,y:0},o=!!s.vehicle,l=s.aiming&&!o;this.aimLerp=ht(this.aimLerp,l?1:0,1-Math.exp(-10*t)),Math.abs(r.x)+Math.abs(r.y)>1e-4&&(this.lastManual=performance.now()),this.yaw-=r.x,this.pitch=lt(this.pitch+r.y,-.6,1.2);let c=s.pos.x,h=s.pos.y+1.55,u=s.pos.z,d=[4.6,7,3.2][this.mode];if(o){let C=s.vehicle;if(c=C.pos.x,u=C.pos.z,h=C.pos.y+C.model.camH*.9+.6,d=(C.type.L*1.1+3.2)*[1,1.5,.75][this.mode]+lt(C.speed*.06,0,2.5),performance.now()-this.lastManual>1400&&C.speed>2){let z=Math.atan2(C.vx,C.vz),D=C.forwardSpeed<-1?C.heading:z;this.yaw=$r(this.yaw,D,t*lt(C.speed*.12,.5,2.2)),this.pitch=ht(this.pitch,.22,t*1.5)}}else s.swimming&&(h=s.pos.y+.6);this.lookBack;let f=this.yaw+(this.lookBack&&o?Math.PI:0),m=ht(d,2.3,this.aimLerp),x=ht(0,.75,this.aimLerp),g=-Math.cos(f),p=Math.sin(f);c+=g*x,u+=p*x,h+=this.aimLerp*.15,this.target.set(c,h,u);let y=Math.cos(this.pitch),M=Math.sin(this.pitch),v=-Math.sin(f)*y,S=M,b=-Math.cos(f)*y,E=m,_=i.colliders.raycast(c,h,u,v,S,b,m+.3);_&&(E=Math.max(.8,_.t-.35));for(let C=.5;C<E;C+=.5){let L=c+v*C,z=h+S*C,P=u+b*C;if(z<i.terrain.heightAt(L,P)+.4){E=Math.max(.8,C-.3);break}}this.dist=E<this.dist?E:ht(this.dist,E,1-Math.exp(-4*t)),this.pos.set(c+v*this.dist,h+S*this.dist,u+b*this.dist);let T=i.terrain.heightAt(this.pos.x,this.pos.z)+.3;this.pos.y<T&&(this.pos.y=T),this.pos.y<.3&&i.terrain.heightAt(this.pos.x,this.pos.z)<0&&(this.pos.y=.3),n.position.copy(this.pos),this.shake>0&&(this.shake=Math.max(0,this.shake-t*2),n.position.x+=(Math.random()-.5)*this.shake*.4,n.position.y+=(Math.random()-.5)*this.shake*.4),n.lookAt(this.target);let R=l?48:o?64+lt(s.vehicle.speed*.25,0,10):62;n.fov=ht(n.fov,R,1-Math.exp(-6*t)),n.updateProjectionMatrix()}aimDirection(t){return this.camera.getWorldDirection(t),t}snapBehind(t){this.yaw=t,this.pitch=.2}startCinematic(t,e,i,n=4,s={}){this.cinematic={from:t.clone(),to:e.clone(),look:i.clone(),lookFrom:s.lookFrom?s.lookFrom.clone():null,dur:n,t:0,ease:!0,fov:s.fov}}endCinematic(){this.cinematic=null}};var Gi=new N,Bl=class{constructor(t){this.game=t,this.enterTarget=null,this.enterT=0,this.hornWas=!1,this.fireHeld=0}get ped(){return this.game.player}update(t,e){let i=this.game,n=this.ped;if(!n||n.dead)return;if(i.controlsLocked){n.moveMag=0,n.aiming=!1,n.vehicle&&n.vehicle.driver===n&&(n.vehicle.ctrl.throttle=0,n.vehicle.ctrl.steer=0,n.vehicle.ctrl.brake=1);return}let s=i.cameraRig;e.inVehicle=!!n.vehicle,n.vehicle?this.drive(t,e):this.onFoot(t,e),e.was("switchChar")&&i.canSwitch&&i.canSwitch()&&i.switchCharacter(),e.was("camera")&&(s.mode=(s.mode+1)%3),s.lookBack=e.is("lookBack")}onFoot(t,e){let i=this.game,n=this.ped,s=i.cameraRig;if(this.enterTarget){let f=this.enterTarget;this.enterT+=t;let m=f.doorPos(0),x=m.x-n.pos.x,g=m.z-n.pos.z,p=Math.hypot(x,g);p>.4&&this.enterT<1.2?(n.moveX=x/p,n.moveZ=g/p,n.moveMag=1,n.gait=1):(n.moveMag=0,this.finishEnter(f)),(e.was("enter")||e.axis().y<-.5||f.dead)&&(this.enterTarget=null);return}let r=e.axis(),o=s.forward(),l=o.x*r.y-Math.cos(s.yaw)*r.x,c=o.z*r.y+Math.sin(s.yaw)*r.x,h=Math.hypot(l,c);h>.05?(n.moveX=l/h,n.moveZ=c/h,n.moveMag=Math.min(1,h)):n.moveMag=0,n.gait=e.is("walk")?0:e.is("sprint")?2:1,e.was("jump")&&n.jump(),(e.was("nextWeapon")||e.wheel>0)&&n.cycleWeapon(1),(e.was("prevWeapon")||e.wheel<0)&&n.cycleWeapon(-1);let u=se[n.weapon];if(n.aiming=e.is("aim")&&!u.melee,n.aiming||!u.melee)if(s.aimDirection(Gi),n.aiming){let m=s.camera.position.x+Gi.x*60,x=s.camera.position.y+Gi.y*60,g=s.camera.position.z+Gi.z*60,p=n.handWorld();n.aimDir.set(m-p.x,x-p.y,g-p.z).normalize(),n.aimPitch=Math.asin(lt(n.aimDir.y,-.9,.9))}else{let f=this.autoTarget();f?(n.aimDir.set(f.pos.x-n.pos.x,f.pos.y+1.1-(n.pos.y+1.4),f.pos.z-n.pos.z).normalize(),n.heading=Math.atan2(n.aimDir.x,n.aimDir.z)):n.aimDir.set(Math.sin(n.heading),0,Math.cos(n.heading)),n.aimPitch=0}let d=e.is("fire");if(d&&(e.was("fire")||u.auto||!u.melee&&this.fireHeld>u.rate)){if(!u.melee&&!n.aiming){let f=this.autoTarget();f&&(n.heading=Math.atan2(f.pos.x-n.pos.x,f.pos.z-n.pos.z))}n.attack(),this.fireHeld=0}if(this.fireHeld=d?this.fireHeld+t:0,e.was("enter")){let f=this.nearestVehicle(5);f&&(this.enterTarget=f,this.enterT=0)}}autoTarget(){let t=this.game,e=this.ped,i=null,n=1/0,s={x:Math.sin(e.heading),z:Math.cos(e.heading)},r=t.cameraRig.forward();for(let o of t.peds){if(o===e||o.dead||o.vehicle||o.removed||o.isFriend)continue;let l=o.pos.x-e.pos.x,c=o.pos.z-e.pos.z,h=Math.hypot(l,c);if(h>30)continue;let u=(l*r.x+c*r.z)/h,d=(l*s.x+c*s.z)/h;if(Math.max(u,d)<.8)continue;let f=o.brain&&o.brain.hostile?.4:1,m=h*f*(2-Math.max(u,d));m<n&&(n=m,i=o)}return i}nearestVehicle(t){let e=this.game,i=this.ped,n=null,s=t;for(let r of e.vehicles){if(r.removed||r.dead||r.locked)continue;let o=Math.hypot(r.pos.x-i.pos.x,r.pos.z-i.pos.z)-r.type.L*.4;o<s&&Math.abs(r.pos.y-i.pos.y)<2.5&&(s=o,n=r)}return n}finishEnter(t){let e=this.game,i=this.ped;if(this.enterTarget=null,t.dead||t.removed)return;let n=t.driver;if(n&&n!==i){if(n.isFriend){let s=t.seats.findIndex((r,o)=>o>0&&!r);s>0&&i.enterVehicle(t,s);return}n.exitVehicle(),n.knockdown(Math.sin(t.heading+Math.PI/2)*2,Math.cos(t.heading+Math.PI/2)*2,1.5),n.hurt(5,i,null),n.brain&&n.brain.onCarjacked&&n.brain.onCarjacked(i),Ci(n,ae(["\xA1Mi auto! \xA1Ladr\xF3n!","\xA1Eh, eh, EH!","\xA1Llamen a la polic\xEDa!","\xA1Es de mi vieja ese auto!"])),e.onCarjack&&e.onCarjack(t,n)}t.seats[0]&&t.seats[0]!==i||(i.enterVehicle(t,0),!t.playerOwned&&!t.missionOwned&&t.stolenBy!==i&&(e.stats&&(e.stats.carsStolen+=1),t.stolenBy=i),e.audio&&e.audio.door(t.pos),e.hud&&e.hud.showVehicleName(t.type.name),t.type.bike?e.audio&&e.audio.stopRadio():e.audio&&e.audio.startRadio(t.radio),e.hud&&!t.type.bike&&e.hud.showRadio(e.audio?e.audio.stationName(t.radio):""),e.cameraRig.snapBehind(t.heading),e.onEnterVehicle&&e.onEnterVehicle(t))}drive(t,e){let i=this.game,n=this.ped,s=n.vehicle;if(s.driver!==n){e.was("enter")&&this.exit(),this.driveBy(t,e);return}let r=e.axis(),o=r.y,l=0;e.padTriggers&&(e.padTriggers.gas>.05||e.padTriggers.brake>.05)&&(o=e.padTriggers.gas-e.padTriggers.brake),e.touch.gas!==void 0&&(e.touch.gas||e.touch.brake)&&(o=(e.touch.gas?1:0)-(e.touch.brake?1:0)),s.ctrl.throttle=o,s.ctrl.brake=l,s.ctrl.steer=ht(s.ctrl.steer,-r.x,1-Math.exp(-(Math.abs(r.x)>.1?8:12)*t)),s.ctrl.handbrake=e.is("handbrake"),s.type.bike&&e.was("jump")&&s.grounded&&(s.vy=5.2);let c=e.is("horn");c?i.audio&&i.audio.horn(s,!0):this.hornWas&&i.audio&&i.audio.horn(s,!1),e.was("horn")&&s.type.police&&(s.siren=!s.siren),this.hornWas=c,!s.type.bike&&(e.was("radio")||e.wheel!==0)&&(s.radio=(s.radio+(e.wheel<0?-1:1)+7)%7,i.audio&&i.audio.startRadio(s.radio),i.hud&&i.hud.showRadio(i.audio?i.audio.stationName(s.radio):"")),this.driveBy(t,e),e.was("enter")&&this.exit()}driveBy(t,e){let i=this.game,n=this.ped,s=se[n.weapon];if(n.driveBy=!1,!(!s||s.melee||s.twoHanded)){if(e.is("fire")&&(e.was("fire")||s.auto||this.fireHeld>s.rate)){i.cameraRig.aimDirection(Gi),Gi.y=lt(Gi.y+.05,-.3,.3),Gi.normalize(),n.aimDir.copy(Gi),n.driveBy=!0;let r=n.vehicle,o=Math.cos(r.heading),l=-Math.sin(r.heading);n.driveBySide=Gi.x*o+Gi.z*l>0?1:-1,n.attack(),this.fireHeld=0}this.fireHeld=e.is("fire")?this.fireHeld+t:0,e.is("fire")&&(n.driveBy=!0)}}exit(){let t=this.game,e=this.ped,i=e.vehicle;i&&(i.speed>12&&!i.type.bike||(e.exitVehicle(i.speed>5),t.audio&&t.audio.stopRadio(),t.audio&&t.audio.horn(i,!1),t.audio&&t.audio.door(i.pos),t.onExitVehicle&&t.onExitVehicle(i)))}};var rn=class{constructor(t,e,i="cruise",n={}){this.game=t,this.v=e,this.mode=i,this.target=n.target||null,this.dest=n.dest||null,this.path=null,this.speedMul=n.speedMul||1,this.aggressive=!!n.aggressive,this.reverseT=0,this.stuckT=0,this.honkT=0,this.replanT=0,this.offroadOK=e.type.offroad,this.laneFrac=.25,this.placeOnRoad()}placeOnRoad(){let e=this.game.roads.nearestEdge(this.v.pos.x,this.v.pos.z,60);if(!e){this.edge=null;return}let i=e.edge,n=this.v.fwd;n.x*i.dx+n.z*i.dz>=0?(this.from=i.a,this.to=i.b):(this.from=i.b,this.to=i.a),this.edge=i,this.next=null}pickNext(t,e){let i=this.game.roads,n=i.nodes[t],s=n.edges.map(o=>i.edges[o]).filter(o=>o!==e&&o.kind!=="muelle"&&(o.kind!=="tierra"||this.offroadOK||this.mode!=="cruise"));if(this.mode==="route"&&this.path&&this.path.length){let o=this.path[0],l=n.edges.map(c=>i.edges[c]).find(c=>i.otherNode(c,t)===o);if(l)return l}if(this.mode==="flee"&&this.target){let o=this.target.pos;return s.sort((l,c)=>{let h=i.nodes[i.otherNode(l,t)],u=i.nodes[i.otherNode(c,t)];return zt(u.x,u.z,o.x,o.z)-zt(h.x,h.z,o.x,o.z)}),s.length>1&&he(.25)?s[1]:s[0]||e}if(!s.length)return e;let r=e?{x:i.nodes[t].x-i.nodes[i.otherNode(e,t)].x,z:i.nodes[t].z-i.nodes[i.otherNode(e,t)].z}:null;if(r&&he(.55)){let o=null,l=-2,c=Math.hypot(r.x,r.z)||1;for(let h of s){let u=i.nodes[i.otherNode(h,t)],d=u.x-n.x,f=u.z-n.z,m=Math.hypot(d,f)||1,x=(d*r.x+f*r.z)/(m*c);x>l&&(l=x,o=h)}if(o)return o}return ae(s)}planRoute(t,e){let i=this.game.roads;if(this.edge||this.placeOnRoad(),!this.edge)return;let n=i.nearestNode(t,e),s=i.path(this.to,n);s&&(this.path=s.slice(1),this.mode=this.mode==="chase"?"chase":"route"),this.goal={x:t,z:e}}laneOffset(t){return t.width*this.laneFrac+(t.width>13?.5:0)}update(t){let e=this.v,i=this.game;if(e.dead||!e.driver||e.driver.isPlayer)return;let n=i.roads,s=e.ctrl,r=e.speed,o=e.forwardSpeed;if(!this.edge&&(this.placeOnRoad(),!this.edge)){s.throttle=0;return}if(this.reverseT>0){this.reverseT-=t,s.throttle=-.8,s.steer=this.revSteer,s.handbrake=!1;return}let l,c,h,u=this.edge,d=n.nodes[this.from],f=n.nodes[this.to],m=(f.x-d.x)/u.len,x=(f.z-d.z)/u.len,g=-x,p=m,y=this.laneOffset(u),M=(e.pos.x-d.x)*m+(e.pos.z-d.z)*x,v=u.len-M;if((this.mode==="chase"||this.mode==="goto")&&this.target&&this.directChase()){let P=this.targetPos();l=P.x,c=P.z,h=e.type.maxSpeed*.95*this.speedMul;let D=zt(e.pos.x,e.pos.z,l,c);this.mode==="goto"&&D<6&&(h=0),this.ram===!1&&D<12&&(h=Math.min(h,8))}else{if(v<Math.max(3,r*.25)){let k=this.next||this.pickNext(this.to,u);this.from=this.to,this.to=n.otherNode(k,this.from),this.edge=k,this.next=null,this.path&&this.path.length&&this.path[0]===this.to?this.path.shift():this.path&&this.path.length&&this.path[0]===this.from&&this.path.shift();return}!this.next&&v<30&&(this.next=this.pickNext(this.to,u));let P=5+r*.7;if(P<v||!this.next){let k=Math.min(u.len,M+P);l=d.x+m*k+g*y,c=d.z+x*k+p*y}else{let k=this.next,$=n.nodes[n.otherNode(k,this.to)],W=k.len,Y=($.x-f.x)/W,j=($.z-f.z)/W,at=Math.min(W,P-v),ot=this.laneOffset(k);l=f.x+Y*at+-j*ot,c=f.z+j*at+Y*ot}if(h=({ruta:21,avenida:15,calle:11.5,tierra:13,muelle:6}[u.kind]||12)*this.speedMul*(this.mode==="chase"||this.mode==="flee"?1.9:1),this.next&&v<25){let k=n.nodes[n.otherNode(this.next,this.to)],$=k.x-f.x,W=k.z-f.z,Y=Math.hypot($,W)||1,j=1-($*m+W*x)/Y;j>.3&&(h=Math.min(h,dv(h,7,lt(j,0,1)))),this.next===u&&(h=Math.min(h,4))}let O=i.activities&&i.activities.trafficLight;O&&this.mode==="cruise"&&zt(f.x,f.z,Bt.semaforo.x,Bt.semaforo.z)<3&&v<22&&v>6&&(Math.abs(x)>Math.abs(m)?O.state!=="NS":O.state!=="EW")&&(h=Math.min(h,Math.max(0,(v-9)*.8)))}let b=e.fwd,E=4+Math.max(0,o)*1.1+e.type.L/2,_=null,T=E;for(let P of i.vehicles){if(P===e||P.removed)continue;let D=P.pos.x-e.pos.x,O=P.pos.z-e.pos.z,k=D*b.x+O*b.z;k<=0||k>T+P.type.L/2||Math.abs(D*b.z-O*b.x)>(e.type.W+P.type.W)/2+.05||this.mode==="chase"&&this.target&&(P===this.target||P===this.target.vehicle)||(T=k-P.type.L/2,_=P)}if(this.mode==="cruise")for(let P of i.peds){if(P.vehicle||P.dead||P.removed||P.hidden)continue;let D=P.pos.x-e.pos.x,O=P.pos.z-e.pos.z,k=D*b.x+O*b.z;k<=0||k>T||Math.abs(D*b.z-O*b.x)>e.type.W/2+.6||(T=k,_=P)}if(_&&!(this.aggressive&&_===this.target)){let P=T-2.5;h=Math.min(h,Math.max(0,P*.9)),(_===i.player||_===i.player.vehicle)&&(this.honkT-=t,this.honkT<=0&&r<2&&(this.honkT=st(2,5),zt(e.pos.x,e.pos.z,i.camera.position.x,i.camera.position.z)<50&&i.audio.tone({freq:420,dur:.35,type:"square",gain:.08,pos:e.pos})))}let R=Math.atan2(l-e.pos.x,c-e.pos.z),C=pl(e.heading,R);o<-.5&&(C=-C),s.steer=lt(C*2.2,-1,1);let L=h-o;s.throttle=lt(L*.35,-1,1),h<.5&&o<1?(s.throttle=0,s.brake=1):s.brake=0,s.handbrake=this.mode==="chase"&&Math.abs(C)>1.2&&r>12;let z=this.mode!=="cruise"?h>3||_&&_!==this.target:s.throttle>.3&&!_;this.blockT=_&&r<.8?(this.blockT||0)+t:0,z&&r<.8||this.blockT>(this.mode==="cruise"?8:2.5)?(this.stuckT+=t,this.blockT>2.5&&(this.stuckT+=t),this.stuckT>1.2&&(this.reverseT=st(.8,1.4),this.revSteer=-Math.sign(C||1),this.stuckT=0,this.placeOnRoad())):this.stuckT=Math.max(0,this.stuckT-t),this.totalStuck=r<.5?(this.totalStuck||0)+t:0}targetPos(){let t=this.target;return t?t.vehicle?t.vehicle.pos:t.pos||t:this.goal||this.v.pos}directChase(){let t=this.targetPos(),e=this.v,i=zt(e.pos.x,e.pos.z,t.x,t.z);if(i<45){if(this.losT=(this.losT||0)-1/30,this.losT<=0){this.losT=.3;let n=t.x-e.pos.x,s=t.z-e.pos.z,r=Math.hypot(n,s)||1;this.los=!this.game.colliders.raycast(e.pos.x,e.pos.y+1,e.pos.z,n/r,0,s/r,Math.max(0,r-2))}if(this.los||i<8)return!0}return this.game.roads.surfaceAt(t.x,t.z)===0&&i<120?!0:(this.replanT-=1/60,(this.replanT<=0||!this.path)&&(this.replanT=3,this.planRoute(t.x,t.z)),!1)}};function dv(a,t,e){return a+(t-a)*e}var kl={centro:["reno12","reno12","pijo504","remis","remis","gool","duna","falcon","fitito","jilux","colectivo"],barrio:["reno12","falcon","fitito","duna","pijo504","gool","f100","reno12"],km:["empresa","empresa","jilux","f100","reno12","falcon","empresa"],rada:["jilux","gool","jilux","pijo504","enduro"],ruta:["empresa","jilux","f100","reno12","falcon","cisterna","colectivo","pijo504"],tierra:["empresa","empresa","jilux","f100","enduro"]},Ol=class{constructor(t){this.game=t,this.cars=[],this.parked=[],this.max=16,this.maxParked=14,this.spawnT=0,this.enabled=!0,this.density=1}zoneKind(t,e,i){if(i&&i.kind==="tierra")return"tierra";let n=this.game.city.blockAt(t,e),s=this.game.world.zoneAt(t,e);return s==="Centro"||s==="Puerto"?"centro":s.startsWith("Km")||s==="Caleta C\xF3rdova"||s==="Parque E\xF3lico"||s==="Pampa del Castillo"?"km":s==="Rada Tilly"?"rada":n?"barrio":i&&i.kind==="ruta"?"ruta":"barrio"}update(t){let e=this.game,i=e.player,n=i.vehicle?i.vehicle.pos:i.pos;for(let r of this.cars)r.ai&&!r.removed&&r.ai.update(t);if(this.cars=this.cars.filter(r=>{if(r.removed)return!1;let o=zt(r.pos.x,r.pos.z,n.x,n.z);return r.driver&&r.driver.isPlayer||r.persistent||r.missionOwned||r===e.lastPlayerVehicle?!(r.driver&&r.driver.isPlayer):o>300||r.dead&&r.deadT>25&&o>60||r.ai&&r.ai.totalStuck>40&&o>50||!r.driver&&!r.parked&&o>120?(e.removeVehicle(r),!1):!0}),this.parked=this.parked.filter(r=>r.removed||r.driver?!1:zt(r.pos.x,r.pos.z,n.x,n.z)>230&&r!==e.lastPlayerVehicle&&!r.missionOwned&&!r.persistent?(e.removeVehicle(r),!1):!0),this.orphanT=(this.orphanT||0)-t,this.orphanT<=0){this.orphanT=2;for(let r of[...e.vehicles])r.persistent||r.missionOwned||r.driver||r===e.lastPlayerVehicle||this.cars.includes(r)||this.parked.includes(r)||zt(r.pos.x,r.pos.z,n.x,n.z)>250&&e.removeVehicle(r)}if(!this.enabled||(this.spawnT-=t,this.spawnT>0))return;this.spawnT=.35,this.cars.filter(r=>r.ai).length<this.max*this.density&&this.spawnMoving(n),this.parked.length<this.maxParked*this.density&&this.spawnParked(n)}randomRoadPoint(t,e,i){let n=this.game.roads;for(let s=0;s<8;s++){let r=st(0,Math.PI*2),o=st(e,i),l=t.x+Math.cos(r)*o,c=t.z+Math.sin(r)*o,h=n.nearestEdge(l,c,40);if(!h||h.edge.kind==="muelle")continue;let u=this.game.camera,d=h.x-u.position.x,f=h.z-u.position.z,m=Math.hypot(d,f),x=this.game.cameraRig.forward();if(!(m<130&&(d*x.x+f*x.z)/m>.3))return h}return null}spawnMoving(t){let e=this.game,i=this.randomRoadPoint(t,80,210);if(!i)return;let n=i.edge,s=this.zoneKind(i.x,i.z,n),r=ae(kl[s]||kl.barrio);he(.06)&&(r="patrullero"),(r==="colectivo"||r==="cisterna")&&n.width<11&&(r="reno12"),n.kind==="tierra"&&!["empresa","jilux","f100","enduro"].includes(r)&&(r="empresa");let o=e.roads,l=he(.5),c=o.nodes[l?n.a:n.b],h=o.nodes[l?n.b:n.a],u=(h.x-c.x)/n.len,d=(h.z-c.z)/n.len,f=n.width*.25,m=i.x-d*f,x=i.z+u*f;for(let M of e.vehicles)if(zt(M.pos.x,M.pos.z,m,x)<8)return;let g=e.spawnVehicle(r,m,x,Math.atan2(u,d)),p=r==="patrullero"?"cana":r==="empresa"||r==="cisterna"?"petrolero":"civil",y=e.spawnPed(p,m,x,{look:ni(p)});y.enterVehicle(g,0),y.brain=null,g.ai=new rn(e,g,"cruise",{speedMul:st(.8,1.1)}),g.vx=u*8,g.vz=d*8,r==="patrullero"&&(g.isCopCar=!0,e.police.registerPatrol(g)),this.cars.push(g)}spawnParked(t){let e=this.game,i=this.randomRoadPoint(t,40,150);if(!i)return;let n=i.edge;if(n.kind==="ruta"||n.kind==="tierra"||n.kind==="muelle")return;let s=e.roads,r=s.nodes[n.a],o=s.nodes[n.b],l=i.t*n.len;if(l<12||n.len-l<12)return;let c=he(.5)?1:-1,h=n.width/2-.65,u=i.x-n.dz*h*c,d=i.z+n.dx*h*c;for(let p of e.vehicles)if(zt(p.pos.x,p.pos.z,u,d)<7)return;let f=this.zoneKind(u,d,n),m=ae(kl[f]||kl.barrio);(m==="colectivo"||m==="cisterna")&&(m="falcon"),he(.08)&&(m="bmx");let x=Math.atan2(n.dx,n.dz)+(c>0?0:Math.PI),g=e.spawnVehicle(m,u,d,x,{parked:!0});this.parked.push(g)}clearAround(t,e){for(let i of[...this.cars,...this.parked])i.persistent||i.missionOwned||i.driver&&i.driver.isPlayer||zt(i.pos.x,i.pos.z,t.x,t.z)<e&&this.game.removeVehicle(i)}};var oe=class{constructor(t,e,i="wander",n={}){this.game=t,this.ped=e,this.mode=i,this.base=i,this.target=null,this.hostile=!!n.hostile,this.t=0,this.wp=null,this.dir=he(.5)?1:-1,this.block=n.block||null,this.corner=0,this.home=n.home||{x:e.pos.x,z:e.pos.z},this.leashR=n.leash||30,this.fleeFrom=null,this.idleT=0,this.shootT=st(.5,1.5),this.aggro=n.aggro||0,this.faction=n.faction||e.kind,this.onDeathCb=null,this.stuckT=0,this.lastPos={x:e.pos.x,z:e.pos.z},i==="wander"&&!this.block&&(this.block=t.city.blockAt(e.pos.x,e.pos.z))}onAttacked(t){let e=this.ped;if(!t||t===e||e.dead)return;if(this.mode==="follow"||this.mode==="script"){t!==this.game.player&&!t.isFriend&&(this.combatTarget=t);return}if(this.mode==="cop")return;e.kind!=="civil"||e.owned.length>1||he(.25)?(this.setMode("attack"),this.target=t,this.hostile=!0):(this.setMode("flee"),this.fleeFrom=t,this.t=st(6,12),he(.5)&&Ci(e,ae(Hi.hit)))}onCarjacked(t){he(.35)&&this.ped.kind!=="civil"?(this.setMode("attack"),this.target=t):(this.setMode("flee"),this.fleeFrom=t,this.t=8)}setMode(t){this.mode=t,this.wp=null,this.ped.aiming=!1}panic(t,e){if(["attack","cop","follow","script","guard"].includes(this.mode)){this.mode==="guard"&&e&&e.isPlayer&&this.ped.kind!=="civil"&&(this.setMode("attack"),this.target=e);return}this.setMode("flee"),this.fleeFrom=t,this.t=st(5,10),he(.2)&&Ci(this.ped,ae(Hi.flee))}moveTo(t,e,i=1,n=.6){let s=this.ped,r=t-s.pos.x,o=e-s.pos.z,l=Math.hypot(r,o);return l<n?(s.moveMag=0,!0):(s.moveX=r/l,s.moveZ=o/l,s.moveMag=1,s.gait=i,!1)}stop(){this.ped.moveMag=0}update(t){let e=this.ped;if(!(e.dead||e.knockT>0)&&!(e.vehicle&&this.mode!=="follow"&&this.mode!=="script"&&this.mode!=="drive")){if(this.t-=t,this.stuckCheck=(this.stuckCheck||0)+t,this.stuckCheck>1.5){let i=Math.hypot(e.pos.x-this.lastPos.x,e.pos.z-this.lastPos.z);this.stuck=e.moveMag>.5&&i<.8,this.lastPos={x:e.pos.x,z:e.pos.z},this.stuckCheck=0,this.stuck&&(this.wp=null,this.dir=-this.dir)}switch(this.mode){case"wander":this.wander(t);break;case"flee":this.flee(t);break;case"attack":this.attack(t);break;case"follow":this.follow(t);break;case"guard":this.guard(t);break;case"idle":this.stop();break;case"script":this.script&&this.script(t,this);break;case"cop":this.game.police.copBrain(this,t);break;default:this.stop()}}}wander(t){let e=this.ped,i=this.game;if(this.idleT>0){this.idleT-=t,this.stop();return}if(!this.block){if(!this.wp||this.moveTo(this.wp.x,this.wp.z,0)){let s=st(0,Math.PI*2);this.wp={x:this.home.x+Math.cos(s)*st(5,25),z:this.home.z+Math.sin(s)*st(5,25)},he(.3)&&(this.idleT=st(2,6))}return}this.wp||(this.wp=this.nextCorner()),this.moveTo(this.wp.x,this.wp.z,0,.8)&&(this.wp.cross&&(this.block=this.wp.cross),this.wp=null,he(.08)&&(this.idleT=st(2,7)));let n=i.player;n&&n===i.gordopin&&!n.vehicle&&he(t*.05)&&Math.hypot(n.pos.x-e.pos.x,n.pos.z-e.pos.z)<6&&e.kind==="civil"&&(Ci(e,ae(Hi.gordopin)),e.wave=!0,setTimeout(()=>{e.wave=!1},1500)),i.env.windSpeed>24&&he(t*.02)&&Ci(e,ae(Hi.wind))}nextCorner(){let t=this.block,e=di/2,i=[[t.x0+e,t.z0+e],[t.x1-e,t.z0+e],[t.x1-e,t.z1-e],[t.x0+e,t.z1-e]],n=this.ped;if(this.corner===void 0||this.cornerBlock!==t){let s=0,r=1/0;return i.forEach(([o,l],c)=>{let h=Math.hypot(o-n.pos.x,l-n.pos.z);h<r&&(r=h,s=c)}),this.corner=s,this.cornerBlock=t,{x:i[s][0],z:i[s][1]}}if(he(.3)){let s=this.corner,r=[],o=this.game,l=(h,u)=>o.city.gridIndex.get(`${t.grid},${t.c+h},${t.r+u}`),c={0:[[-1,0],[0,-1]],1:[[1,0],[0,-1]],2:[[1,0],[0,1]],3:[[-1,0],[0,1]]};for(let[h,u]of c[s]){let d=l(h,u);d&&!d.special&&r.push({n:d,dc:h,dr:u})}if(r.length){let u=ae(r).n,d=[[u.x0+e,u.z0+e],[u.x1-e,u.z0+e],[u.x1-e,u.z1-e],[u.x0+e,u.z1-e]],f,[m,x]=i[s],g=1/0;return d.forEach(([p,y],M)=>{let v=Math.hypot(p-m,y-x);v<g&&(g=v,f=M)}),this.corner=f,this.cornerBlock=u,{x:d[f][0],z:d[f][1],cross:u}}}return this.corner=(this.corner+this.dir+4)%4,{x:i[this.corner][0],z:i[this.corner][1]}}flee(t){let e=this.ped,i=this.fleeFrom;if(this.t<=0||!i){this.setMode(this.base==="flee"?"wander":this.base),this.block=this.game.city.blockAt(e.pos.x,e.pos.z);return}let n=i.pos?i.pos.x:i.x,s=i.pos?i.pos.z:i.z,r=e.pos.x-n,o=e.pos.z-s,l=Math.hypot(r,o)||1;if(this.stuck){let c=Math.atan2(o,r)+st(-1.5,1.5);r=Math.cos(c),o=Math.sin(c)}e.moveX=r/l,e.moveZ=o/l,e.moveMag=1,e.gait=2,l>60&&(this.t=Math.min(this.t,1))}attack(t){let e=this.ped,i=this.target;if(!i||i.dead||i.removed||i.hidden){this.target=null,this.setMode(this.base==="attack"?"guard":this.base),e.aiming=!1;return}let n=i.vehicle?i.vehicle.pos:i.pos,s=n.x-e.pos.x,r=n.z-e.pos.z,o=Math.hypot(s,r);if(o>90||this.leash&&Math.hypot(e.pos.x-this.home.x,e.pos.z-this.home.z)>this.leashR*3){this.target=null,this.setMode(this.base),e.aiming=!1;return}let l=se[e.weapon],c=l&&!l.melee&&(e.ammo[e.weapon]||0)>0;if(!c&&e.owned.some(h=>!se[h].melee&&(e.ammo[h]||0)>0)&&e.setWeapon(e.owned.find(h=>!se[h].melee&&(e.ammo[h]||0)>0)),c){let h=l.range*.45;if(o>h?(this.moveTo(n.x,n.z,2,1),e.aiming=!1):o<5&&he(.02)?this.moveTo(e.pos.x-s,e.pos.z-r,1):e.moveMag=0,o<h*1.1){e.aiming=!0;let u=(i.vehicle?i.vehicle.pos.y+.8:i.pos.y+1.2)-(e.pos.y+1.4);if(e.aimDir.set(s,u,r).normalize(),this.shootT-=t,this.shootT<=0){let d=e.handWorld();this.game.colliders.raycast(d.x,d.y,d.z,e.aimDir.x,e.aimDir.y,e.aimDir.z,o-1)||e.attack(),this.shootT=l.auto?st(.08,.2):st(.6,1.4)/(e.kind==="cana"?1.2:1),l.auto&&he(.12)&&(this.shootT=st(.8,1.5))}}}else e.aiming=!1,o>1.3?this.moveTo(n.x,n.z,o>4?2:1,1.1):(e.moveMag=0,e.heading=Math.atan2(s,r),i.vehicle||e.attack())}guard(t){let e=this.ped,n=this.game.player;Math.hypot(e.pos.x-this.home.x,e.pos.z-this.home.z)>4?this.moveTo(this.home.x,this.home.z,0,1):(this.stop(),this.faceTarget&&(e.heading=Math.atan2(this.faceTarget.x-e.pos.x,this.faceTarget.z-e.pos.z))),this.hostile&&n&&!n.dead&&(Math.hypot(n.pos.x-e.pos.x,n.pos.z-e.pos.z)<(this.aggroRange||14)?(this.aggro+=t,this.aggro>(this.aggroDelay||2.5)?(this.setMode("attack"),this.target=n):this.aggro<t*2&&he(.6)&&Ci(e,ae(e.kind==="cheto"?Hi.cheto:["\xBFQu\xE9 mir\xE1s?","Raj\xE1 de ac\xE1.","Este no es tu barrio."]))):this.aggro=Math.max(0,this.aggro-t))}follow(t){let e=this.ped,i=this.game,n=i.player;if(!n||n===e)return;if(this.combatTarget&&(this.combatTarget.dead||this.combatTarget.removed)&&(this.combatTarget=null),!this.combatTarget||he(t*.5)){let l=null,c=25;for(let h of i.peds){if(h.dead||h.removed||!h.brain||h===e||!(h.brain.hostile&&(h.brain.target===n||h.brain.target===e||h.brain.mode==="attack"))||h.kind==="cana")continue;let u=Math.hypot(h.pos.x-e.pos.x,h.pos.z-e.pos.z);u<c&&(c=u,l=h)}l&&(this.combatTarget=l)}if(n.vehicle){let l=n.vehicle;if(e.vehicle===l){e.driveBy=!1,(this.combatTarget||this.driveTarget)&&this.shootFromCar(t,this.driveTarget||this.combatTarget);return}e.vehicle&&e.exitVehicle();let c=l.seats.findIndex((d,f)=>f>0&&!d);if(c<0){this.stop();return}let h=l.doorPos(c),u=Math.hypot(h.x-e.pos.x,h.z-e.pos.z);if(u<1.2||u<3&&l.speed<1){e.enterVehicle(l,c);return}if(u>60){e.enterVehicle(l,c);return}this.moveTo(h.x,h.z,2,.8);return}if(e.vehicle){e.exitVehicle();return}let s=n.pos.x-e.pos.x,r=n.pos.z-e.pos.z,o=Math.hypot(s,r);if(o>90){let l=n.pos.x-Math.sin(n.heading)*3,c=n.pos.z-Math.cos(n.heading)*3;e.pos.set(l,i.world.footGround(l,c),c);return}if(this.combatTarget&&o<30){this.target=this.combatTarget,this.attack(t),this.mode="follow";return}e.aiming=!1,o>3.2?this.moveTo(n.pos.x-s/o*2,n.pos.z-r/o*2,o>12?2:o>5?1:0,.5):(this.stop(),o>.1&&he(t)&&(e.heading=Math.atan2(s,r))),n.gait===2&&o>4&&(e.gait=2)}shootFromCar(t,e){let i=this.ped;if(!e||e.dead||e.removed)return;let n=e.pos,s=i.pos.x,r=i.pos.z,o=n.x-s,l=n.z-r;if(Math.hypot(o,l)>40)return;if(se[i.weapon].melee||(i.ammo[i.weapon]||0)<=0){let m=i.owned.find(x=>!se[x].melee&&!se[x].twoHanded&&(i.ammo[x]||0)>0);if(!m)return;i.setWeapon(m)}let h=e.pos.y+(e.type?.8:1.1)-(i.pos.y+1.2);i.aimDir.set(o,h,l).normalize(),i.driveBy=!0;let u=i.vehicle,d=Math.cos(u.heading),f=-Math.sin(u.heading);i.driveBySide=o*d+l*f>0?1:-1,this.shootT-=t,this.shootT<=0&&(i.attackCD=0,i.attack(),this.shootT=st(.35,.7))}};var Hl=class{constructor(t){this.game=t,this.max=22,this.spawnT=0,this.enabled=!0,this.density=1,this.turfs=[{kind:"cheto",x:Bt.mansionChetos.x,z:Bt.mansionChetos.z-20,r:140,n:6,weapon:["bate","pistola"],hostile:!0},{kind:"caleta",x:210,z:-1310,r:150,n:6,weapon:["bate","pistola"],hostile:!0},{kind:"lobo",x:-200,z:150,r:170,n:5,weapon:["bate"],hostile:!1},{kind:"petrolero",x:200,z:-760,r:200,n:4,weapon:[],hostile:!1},{kind:"petrolero",x:-1150,z:-880,r:160,n:5,weapon:[],hostile:!1}]}count(){return this.game.peds.filter(t=>t.spawned&&!t.removed).length}update(t){let e=this.game,i=e.player,n=i.vehicle?i.vehicle.pos:i.pos,s=e.camera.position;for(let o of[...e.peds]){if(!o.spawned||o.removed||o.persistent||o.vehicle)continue;let l=zt(o.pos.x,o.pos.z,n.x,n.z);l>140||o.dead&&o.deadT>30?e.removePed(o):o.group.visible=l<110}for(let o of e.peds)o.vehicle&&!o.isPlayer&&(o.group.visible=zt(o.pos.x,o.pos.z,s.x,s.z)<70);if(!this.enabled||(this.spawnT-=t,this.spawnT>0))return;this.spawnT=.25,this.count()<this.max*this.density&&this.spawnCivilian(n),this.spawnGangs(n)}spawnCivilian(t){let e=this.game,i=e.city.blocks,n=[];for(let p of i){let y=(p.x0+p.x1)/2,M=(p.z0+p.z1)/2,v=zt(y,M,t.x,t.z);v>30&&v<110&&n.push(p)}if(!n.length)return;let s=ae(n),r=Math.floor(st(0,4)),[o,l]=e.city.sidewalkPoint(s,st(.1,.9),r),c=e.camera.position,h=o-c.x,u=l-c.z,d=Math.hypot(h,u),f=e.cameraRig.forward();if(d<45&&(h*f.x+u*f.z)/d>.5)return;let m=e.world.zoneAt(o,l),x="civil";(m.startsWith("Km")||m==="Pampa del Castillo")&&he(.4)&&(x="petrolero"),m==="Rada Tilly"&&he(.3)&&(x="cheto");let g=e.spawnPed(x,o,l,{look:ni(x),rot:st(0,6.28)});g.spawned=!0,g.brain=new oe(e,g,"wander",{block:s}),x==="cheto"&&(g.brain.hostile=!1),he(.06)&&g.give("pistola",20),he(.05)&&(g.give("bate"),g.setWeapon("bate"))}spawnGangs(t){let e=this.game;for(let i of this.turfs)if(!(zt(i.x,i.z,t.x,t.z)>i.r+120||e.peds.filter(r=>r.turf===i&&!r.removed&&!r.dead).length>=i.n)&&!(i.cooldown&&i.cooldown>e.time))for(let r=0;r<6;r++){let o=st(0,Math.PI*2),l=st(5,i.r*.6),c=i.x+Math.cos(o)*l,h=i.z+Math.sin(o)*l,u={x:c,z:h};if(e.colliders.resolveCircle(u,.6,e.terrain.heightAt(c,h))||e.terrain.heightAt(c,h)<.5)continue;let d=e.camera.position;if(zt(c,h,d.x,d.z)<35)continue;let f=e.spawnPed(i.kind,c,h,{look:ni(i.kind),rot:st(0,6.28)});f.spawned=!0,f.turf=i;let m=i.weapon.length?ae(i.weapon):null;m&&(f.give(m,30),f.setWeapon(m)),i.kind==="petrolero"?f.brain=new oe(e,f,"wander",{block:e.city.blockAt(c,h)}):(f.brain=new oe(e,f,"guard",{hostile:i.hostile,home:{x:c,z:h},leash:40}),f.brain.base="guard",f.brain.aggroRange=13,f.brain.aggroDelay=i.kind==="cheto"?4:3,i.kind==="lobo"&&(f.isFriend=!0,f.brain.hostile=!1));break}}panic(t,e,i){for(let n of this.game.peds)n.isPlayer||n.dead||!n.brain||n.vehicle||zt(n.pos.x,n.pos.z,t.x,t.z)<e&&n.brain.panic(t,i);for(let n of this.game.traffic.cars)n.ai&&n.ai.mode==="cruise"&&zt(n.pos.x,n.pos.z,t.x,t.z)<e&&(n.ai.speedMul=1.6)}clearAround(t,e){for(let i of[...this.game.peds])!i.spawned||i.persistent||zt(i.pos.x,i.pos.z,t.x,t.z)<e&&!i.vehicle&&this.game.removePed(i)}};var Kr=[0,40,150,350,700,1200,2e3],fv={runOver:18,assault:12,kill:55,gunshot:12,carjack:25,copAttack:160,copKill:260,copCar:160,explosion:60,copCarHit:45},Gl=class{constructor(t){this.game=t,this.heat=0,this.level=0,this.unseenT=0,this.flashing=!1,this.units=[],this.cops=[],this.spawnT=0,this.neverWanted=!1,this.maxLevel=6,this.heli=null,this.arrestT=0}crime(t,e){if(this.neverWanted)return;let i=this.game,n=fv[t]||10,s=!1;for(let o of i.peds)if(o.kind==="cana"&&!o.dead&&zt(o.pos.x,o.pos.z,e.x,e.z)<45){s=!0;break}for(let o of i.vehicles)if(o.type.police&&!o.dead&&zt(o.pos.x,o.pos.z,e.x,e.z)<55){s=!0;break}if(s||(t==="gunshot"||t==="assault"||t==="runOver"||t==="carjack"?n*=this.level>0||he(.35)?1:0:n*=.8),this.game.missions.active&&this.game.missions.active.noWanted||n<=0)return;this.heat=Math.min(Kr[this.maxLevel]+100,this.heat+n);let r=this.level;this.recalc(),this.level>r&&(this.unseenT=0,this.game.audio.beep())}setLevel(t){this.heat=t>0?Kr[t]+1:0,this.recalc()}recalc(){let t=0;for(let e=1;e<Kr.length;e++)this.heat>=Kr[e]&&(t=e);this.level=Math.min(t,this.maxLevel)}clear(){this.heat=0,this.level=0,this.unseenT=0;for(let t of this.units)t.retreat=!0;for(let t of this.cops)t.brain&&(t.brain.hostile=!1)}registerPatrol(t){t.isCopCar=!0}playerSeen(){let t=this.game,e=t.player,i=e.vehicle?e.vehicle.pos:e.pos;for(let n of this.cops){if(n.dead||n.removed)continue;let s=n.vehicle?n.vehicle.pos:n.pos,r=zt(s.x,s.z,i.x,i.z);if(r<18)return!0;if(r<75){let o=i.x-s.x,l=i.z-s.z,c=i.y-s.y,h=Math.hypot(o,c,l);if(!t.colliders.raycast(s.x,s.y+1.5,s.z,o/h,c/h,l/h,h-2))return!0}}return!!(this.heli&&zt(this.heli.pos.x,this.heli.pos.z,i.x,i.z)<80)}update(t){let e=this.game,i=e.player,n=i.vehicle?i.vehicle.pos:i.pos;if(this.cops=this.cops.filter(s=>!s.removed),this.units=this.units.filter(s=>!s.v.removed),this.level>0){this.playerSeen()?(this.unseenT=0,this.flashing=!1):(this.unseenT+=t,this.flashing=this.unseenT>2,this.unseenT>10+this.level*5&&(this.level--,this.heat=this.level>0?Kr[this.level]+1:0,this.unseenT=0,this.level===0&&this.clear())),this.spawnT-=t;let r=[0,1,2,3,4,5,6][this.level],o=this.units.filter(l=>!l.retreat&&!l.v.dead).length;this.spawnT<=0&&o<r&&(this.spawnT=3,this.spawnUnit(n)),this.level>=4&&!this.heli&&this.spawnHeli(n),i.vehicle&&this.level>0&&(this.cops.some(c=>!c.dead&&!c.vehicle&&zt(c.pos.x,c.pos.z,n.x,n.z)<3.2)&&i.vehicle.speed<1?(this.arrestT+=t,this.arrestT>1.5&&(this.arrestT=0,e.wasted(!0))):this.arrestT=Math.max(0,this.arrestT-t))}else this.flashing=!1;this.heli&&this.updateHeli(t,n);for(let s of this.units){let r=s.v;if(r.dead)continue;let o=zt(r.pos.x,r.pos.z,n.x,n.z);if(s.retreat||this.level===0){r.siren=!1,r.ai&&(r.ai.mode="cruise",r.ai.target=null,r.ai.speedMul=1);for(let c of s.cops)c.brain&&!c.vehicle&&(c.brain.mode="cop");if(o>200){for(let c of s.cops)c.removed||e.removePed(c);e.removeVehicle(r)}continue}r.siren=!0,r.ai&&(r.ai.mode="chase",r.ai.target=i,r.ai.speedMul=1.1+this.level*.05,r.ai.aggressive=this.level>=2);let l=i.vehicle?i.vehicle.speed:0;if(o<22&&r.speed<4&&(!i.vehicle||l<3))for(let c of s.cops)c.vehicle===r&&(c.exitVehicle(),c.brain.mode="cop");if(o>320){for(let c of s.cops)!c.removed&&!c.vehicle&&e.removePed(c);e.removeVehicle(r)}}if(this.level>0)for(let s of e.traffic.cars)!s.isCopCar||s.dead||!s.driver||this.units.some(r=>r.v===s)||zt(s.pos.x,s.pos.z,n.x,n.z)<90&&(this.units.push({v:s,cops:[s.driver]}),this.cops.push(s.driver),s.driver.brain=new oe(e,s.driver,"cop"))}spawnUnit(t){let e=this.game,i=e.traffic.randomRoadPoint(t,110,190);if(!i)return;let n=i.edge,s=i.x,r=i.z;for(let d of e.vehicles)if(zt(d.pos.x,d.pos.z,s,r)<8)return;let o=Math.atan2(t.x-s,t.z-r),l=this.level>=5?"jilux":"patrullero",c=e.spawnVehicle(l,s,r,o,l==="jilux"?{color:3820074}:{});c.isCopCar=!0;let h=[],u=this.level>=3?2:1;for(let d=0;d<u;d++){let f=e.spawnPed("cana",s,r,{look:ni("cana"),health:100});f.give("pistola",200),this.level>=4&&f.give("uzi",200),this.level>=3&&he(.4)&&f.give("escopeta",40),f.setWeapon("pistola"),f.enterVehicle(c,d===0?0:1),f.brain=new oe(e,f,"cop"),f.spawned=!0,h.push(f),this.cops.push(f)}c.ai=new rn(e,c,"chase",{target:e.player,aggressive:!0,speedMul:1.15}),c.siren=!0,e.traffic.cars.push(c),this.units.push({v:c,cops:h})}copBrain(t,e){let i=this.game,n=t.ped,s=i.player;if(n.vehicle)return;if(this.level===0){n.aiming=!1,t.wander(e);return}let r=s.vehicle?s.vehicle.pos:s.pos,o=zt(n.pos.x,n.pos.z,r.x,r.z);if(t.hostile=!0,t.target=s,this.level===1){if(n.aiming=!1,s.vehicle){t.moveTo(r.x,r.z,2,2.5);return}o>1.3?t.moveTo(r.x,r.z,2,1.1):(n.moveMag=0,n.heading=Math.atan2(r.x-n.pos.x,r.z-n.pos.z),this.arrestT+=e,he(e*.8)&&Ci(n,ae(Hi.cana)),this.arrestT>1.2&&(s.speed<2.5||s.knockT>0)&&(this.arrestT=0,i.wasted(!0))),o>1.6&&(this.arrestT=Math.max(0,this.arrestT-e*.5));return}t.target=s,t.attack(e),t.mode="cop",o<1.4&&s.knockT>0&&i.wasted(!0)}spawnHeli(t){let e=this.game,i=new be,n=it(1916815),s=it(15921906),r=it(1710618);i.box(-1.1,1.1,0,1.9,-2,2,s),i.box(-1.12,1.12,.5,1,-2,2,n),i.box(-.3,.3,.9,1.5,-6.5,-2,s),i.box(-.05,.05,1.2,2.6,-6.6,-6,n),i.box(-1.4,-1.3,-.4,-.3,-1.6,1.6,r),i.box(1.3,1.4,-.4,-.3,-1.6,1.6,r),i.box(-.9,.9,.8,1.7,1.9,2.3,it(2767434));let o=new xt(i.toGeometry(),new Jt({vertexColors:!0})),l=new xt(new ve(11,.08,.35),new Jt({color:2236962}));l.position.y=2.2;let c=new Qt;c.add(o,l),e.scene.add(c);let h=new N(t.x-150,60,t.z-150);this.heli={grp:c,rotor:l,pos:h,shootT:2,vx:0,vz:0,hp:600,spot:null}}updateHeli(t,e){let i=this.game,n=this.heli;if(this.level<4||n.hp<=0){n.pos.y+=t*8,n.pos.x+=t*30,n.hp<=0&&!n.boom&&(n.boom=!0,i.effects.explosion(n.pos.x,n.pos.y,n.pos.z,i.player)),(n.pos.y>150||n.boom)&&(i.scene.remove(n.grp),this.heli=null),n.grp.position.copy(n.pos),n.rotor.rotation.y+=t*30;return}let s=e.x+Math.sin(i.time*.3)*25,r=e.z+Math.cos(i.time*.3)*25,o=i.terrain.heightAt(e.x,e.z)+32;if(n.vx+=(s-n.pos.x)*t*.6,n.vz+=(r-n.pos.z)*t*.6,n.vx*=Math.exp(-1.2*t),n.vz*=Math.exp(-1.2*t),n.pos.x+=n.vx*t,n.pos.z+=n.vz*t,n.pos.y+=(o-n.pos.y)*t*.8,n.grp.position.copy(n.pos),n.grp.rotation.y=Math.atan2(e.x-n.pos.x,e.z-n.pos.z),n.grp.rotation.x=lt(Math.hypot(n.vx,n.vz)*.01,0,.3),n.rotor.rotation.y+=t*30,n.shootT-=t,n.shootT<=0&&(n.shootT=st(.12,.25),Math.floor(i.time/3)%2===0)){let l=i.player,c=l.vehicle?l.vehicle.pos:l.pos,h=n.pos.x,u=n.pos.y-.5,d=n.pos.z,f=c.x-h+st(-3,3),m=c.y+1-u,x=c.z-d+st(-3,3),g=Math.hypot(f,m,x);f/=g,m/=g,x/=g,i.effects.tracer(h,u,d,h+f*g,u+m*g,d+x*g),i.audio.gun("smg",n.pos);let p=h+f*g,y=d+x*g;zt(p,y,c.x,c.z)<1.8?l.vehicle?l.vehicle.damage(10,null):l.hurt(4,null,null):i.effects.dustPuff(p,i.terrain.heightAt(p,y),y,2)}n.hit=l=>{n.hp-=l}}};var ls=class{constructor(t,e,i,n=16765466,s={}){this.game=t,this.x=e,this.z=i,this.r=s.r||1.4;let r=s.y!==void 0?s.y:t.world.footGround(e,i);this.y=r;let o=s.h||1.6,l=new gi(this.r,this.r,o,24,1,!0);l.translate(0,o/2,0);let c=new He({color:n,transparent:!0,opacity:.45,side:Qe,depthWrite:!1,blending:pn});if(this.mesh=new xt(l,c),this.mesh.position.set(e,r,i),this.mesh.renderOrder=6,t.scene.add(this.mesh),s.arrow!==!1){let h=new Cr(.45,.9,4);h.rotateX(Math.PI),this.arrow=new xt(h,new He({color:n,transparent:!0,opacity:.9})),this.arrow.position.set(e,r+o+1.2,i),t.scene.add(this.arrow)}this.t=st(0,5),this.inside=!1}update(t){this.t+=t,this.mesh.material.opacity=.32+Math.sin(this.t*4)*.12,this.arrow&&(this.arrow.rotation.y+=t*2,this.arrow.position.y=this.y+2.8+Math.sin(this.t*3)*.25)}set visible(t){this.mesh.visible=t,this.arrow&&(this.arrow.visible=t)}contains(t,e=0){return zt(t.x,t.z,this.x,this.z)<this.r+e&&Math.abs(t.y-this.y)<3}dispose(){this.game.scene.remove(this.mesh),this.arrow&&this.game.scene.remove(this.arrow)}},Uh=[{name:"Chorip\xE1n",price:3,hp:20,fat:2},{name:"Bondiola completa",price:6,hp:35,fat:4},{name:"Pizza de muzza",price:10,hp:60,fat:6},{name:"Ensalada (?)",price:8,hp:15,fat:-1}],Vl=class{constructor(t){this.game=t,this.markers=[],this.trafficLight={state:"NS",t:0},this.eatLog=[],this.remis=null,this.jumpsDone=new Set,this.mini=null,this.setupMarkers()}setupMarkers(){let t=this.game,e=t.city.markers,i=(l,c,h,u,d={})=>{if(!c)return;let f=new ls(t,c.x,c.z,h,d);return f.key=l,f.action=u,f.onFoot=d.onFoot!==!1,this.markers.push(f),f};if(i("save",e.casaAbuela,4259696,()=>this.saveMenu()),i("chori",{x:Bt.chori.x-1,z:Bt.chori.z},16752672,()=>this.foodMenu("El Chori del Viento")),i("pizza",e.pizzeria,16752672,()=>this.foodMenu("Pizzer\xEDa La Tuerca")),i("armeria",e.armeria,16728128,()=>this.gunShop()),i("gym",e.gimnasio,12607743,()=>this.gym()),i("malabares",{x:Bt.semaforo.x-8.2,z:Bt.semaforo.z-8.2},16769088,()=>this.juggling(),{r:1.1}),e.chapa){this.chapaRect=e.chapa.rect;let l=i("chapa",{x:e.chapa.x,z:e.chapa.z-2},3178751,()=>{},{r:3.2,h:.4,arrow:!1,onFoot:!1});l.passive=!0}let n=new Qt,s=t.world.footGround(Bt.chori.x+4,Bt.chori.z),r=new xt(new ve(3,2.4,4),new Jt({color:14207136}));r.position.set(Bt.chori.x+4.5,s+1.2,Bt.chori.z);let o=new xt(new ve(3.6,.2,4.6),new Jt({color:12591136}));o.position.set(Bt.chori.x+4.5,s+2.5,Bt.chori.z),n.add(r,o),t.scene.add(n),t.colliders.addBox(Bt.chori.x+3,Bt.chori.x+6,Bt.chori.z-2,Bt.chori.z+2,s-1,s+2.6,"kiosco"),t.city.addSign(["EL CHORI DEL VIENTO"],Bt.chori.x+2.95,s+2.1,Bt.chori.z,3.8,.55,-Math.PI/2,{bg:"#c02020",fg:"#fff3c0"}),t.scene.add(t.city.signs[t.city.signs.length-1])}setupBlips(){let t=this.game,e=t.city.markers,i=(n,s,r,o,l)=>t.blips.push({x:n,z:s,letter:r,bg:o,name:l,legend:!0});e.casaAbuela&&i(e.casaAbuela.x,e.casaAbuela.z,"C","#2a9a3a","Casa de la Abuela (guardar)"),i(Bt.chori.x,Bt.chori.z,"Ch","#d06a10","Comida"),e.pizzeria&&i(e.pizzeria.x,e.pizzeria.z,"Pz","#d06a10","Comida"),e.armeria&&i(e.armeria.x,e.armeria.z,"A","#b02020","Armer\xEDa"),e.gimnasio&&i(e.gimnasio.x,e.gimnasio.z,"G","#7a3ab0","Gimnasio"),e.chapa&&i(e.chapa.x,e.chapa.z,"CP","#2a5ab0","Chapa y Pintura"),i(Bt.semaforo.x,Bt.semaforo.z,"M","#c8a010","Malabares en el sem\xE1foro"),e.hospital&&i(e.hospital.x,e.hospital.z,"H","#e8e8e8","Hospital"),e.comisaria&&i(e.comisaria.x,e.comisaria.z,"\u2605","#1d3f8f","Comisar\xEDa"),e.remiseria&&i(e.remiseria.x,e.remiseria.z,"R","#1a6b2a","Remiser\xEDa (subite a un rem\xEDs y activ\xE1 el trabajo)"),t.blips.find(n=>n.letter==="H")&&(t.blips.find(n=>n.letter==="H").fg="#c01818")}update(t){let e=this.game,i=e.player,n=this.trafficLight;n.t+=t;let s={NS:16,NSy:3,EW:16,EWy:3};n.t>s[n.state]&&(n.t=0,n.state={NS:"NSy",NSy:"EW",EW:"EWy",EWy:"NS"}[n.state]),e.props.updateTrafficLight(n.state==="NS"?0:n.state.endsWith("y")?1:2);for(let r of this.markers){r.update(t);let o=e.missions.active&&!e.missions.active.allowShops;r.visible=!o||r.key==="chapa";let l=r.contains(i.vehicle?i.vehicle.pos:i.pos);if(this.mini||e.controlsLocked||e.menus.choiceEl){r.inside=l;continue}l&&!r.inside&&!r.passive&&(r.onFoot&&i.vehicle||(!o||r.key==="save")&&r.action()),r.inside=l}this.checkChapa(t),this.checkJumps(t),this.updateRemis(t),this.mini&&this.mini.update(t),e.input.was("job")&&i.vehicle&&i.vehicle.driver===i&&!e.missions.active&&(i.vehicle.key==="remis"&&!this.remis?this.startRemis():this.remis&&this.stopRemis("Terminaste el turno de remisero."))}async saveMenu(){let t=this.game;if(await t.menus.choice("Casa de la Abuela",["Guardar partida (y dormir la siesta)","Salir"],"La abuela te dej\xF3 milanesas en la heladera.")===0){t.env.time=(t.env.time+360)%1440;let i=t.player;i.health=i.maxHealth;let n=t.saves.save();t.hud.showToast(n?"Partida guardada. Dormiste 6 horas.":"No se pudo guardar en este navegador.",3)}}async foodMenu(t){let e=this.game,i=e.player,n=Uh.map(o=>`${o.name} \u2014 $${o.price}`);n.push("Nada, gracias");let s=await e.menus.choice(t,n,i===e.gordopin?'"Dame lo de siempre, maestro."':'"\xBFTienen algo sin tanta grasa? Mentira, dame todo."');if(s<0||s>=Uh.length)return;let r=Uh[s];if(e.money<r.price){e.hud.showToast("No te alcanza la guita.",2);return}e.money-=r.price,i.health=Math.min(i.maxHealth,i.health+r.hp),i===e.gordopin&&(e.stats.fat=lt(e.stats.fat+r.fat,0,100)),e.audio.cash(),this.eatLog.push(e.time),this.eatLog=this.eatLog.filter(o=>e.time-o<60),this.eatLog.length>6?(this.eatLog=[],i.health=Math.max(5,i.health-30),e.hud.showToast("Comiste demasiado... \xA1buaaaj!",3),e.effects.smoke(i.pos.x+Math.sin(i.heading),i.pos.y+1.2,i.pos.z+Math.cos(i.heading),.3),e.stats.fat=lt(e.stats.fat-3,0,100)):e.hud.showToast(`${r.name}: +${r.hp} de salud${r.fat>0?`, +${r.fat} de grasa`:""}`,2.5),this.updateBody()}updateBody(){let t=this.game,e=t.gordopin.model,i=t.stats.fat/100,n=t.stats.muscle/100,s=.85+i*.35+n*.15;e.torso.scale.set(s,1,.85+i*.4),e.armL.scale.set(.9+n*.4+i*.2,1,.9+n*.4+i*.2),e.armR.scale.copy(e.armL.scale),e.legL.scale.set(.9+i*.25,1,.9+i*.25),e.legR.scale.copy(e.legL.scale)}async gunShop(){let t=this.game,e=t.player,i=[{id:"pistola",label:"Pistola 9mm",price:se.pistola.price,ammo:34},{id:"escopeta",label:"Escopeta",price:se.escopeta.price,ammo:16},{id:"uzi",label:"Uzi",price:se.uzi.price,ammo:100},{id:"bate",label:"Bate de b\xE9isbol",price:60,ammo:1},{id:"chaleco",label:"Chaleco antibalas",price:200}];for(;;){let n=i.map(h=>{if(h.id==="chaleco")return`${h.label} \u2014 $${h.price}`;let u=e.owned.includes(h.id),d=se[h.id];return u&&!d.melee?`Balas para ${h.label} \u2014 $${d.ammoPrice}`:`${h.label} \u2014 $${h.price}`});n.push("Salir");let s=await t.menus.choice("Armer\xEDa La Patag\xF3nica",n,'"Todo en regla, pibe. Bueno... casi todo."');if(s<0||s>=i.length)return;let r=i[s];if(r.id==="chaleco"){if(t.money<r.price){t.hud.showToast("No te alcanza.",2);continue}t.money-=r.price,e.armor=100,t.audio.cash();continue}let o=se[r.id],l=e.owned.includes(r.id),c=l&&!o.melee?o.ammoPrice:r.price;if(t.money<c){t.hud.showToast("No te alcanza.",2);continue}if(l&&o.melee){t.hud.showToast("Ya ten\xE9s uno.",2);continue}t.money-=c,e.give(r.id,l?o.ammoPack:r.ammo),e.setWeapon(r.id),t.audio.cash()}}checkChapa(t){let e=this.game,i=e.player,n=this.chapaRect;if(!n||!i.vehicle||i.vehicle.driver!==i||this.spraying)return;let s=i.vehicle;if(!(s.pos.x>n[0]&&s.pos.x<n[1]&&s.pos.z>n[2]&&s.pos.z<n[3])){this.chapaDone=!1;return}if(!(this.chapaDone||s.speed>2)){if(this.chapaDone=!0,e.police.level===0&&s.health>950){e.hud.showHelp('Don Tito: "Est\xE1 impecable, pibe. Volv\xE9 cuando la choques."',3);return}if(e.money<100){e.hud.showHelp('Don Tito: "Son cien mangos. Sin guita no hay pintura."',3);return}this.respray(s)}}async respray(t){let e=this.game;this.spraying=!0,e.controlsLocked=!0,await e.hud.fadeTo(!0,.5),e.money-=100,t.health=1e3,t.fireT=0;let i=t.type.colors.length>1?t.type.colors:[11546656,2117792,213e4,15261904,2105376,13672480],n=ae(i);n===t.color&&(n=ae(i)),t.color=n,t.paintMesh.material=new Jt({vertexColors:!0,color:n}),e.police.clear(),e.audio.cash(),await new Promise(s=>setTimeout(s,700)),await e.hud.fadeTo(!1,.5),e.hud.showHelp('Don Tito: "Listo, qued\xF3 como nuevo. Y la cana no la reconoce ni en pedo."',4),e.controlsLocked=!1,this.spraying=!1}checkJumps(t){let e=this.game,i=e.player,n=i.vehicle;if(!(!n||n.driver!==i)){if(!n.grounded&&!this.jumpStart){let s=e.terrain.ramps.findIndex(r=>zt(n.pos.x,n.pos.z,r.x+r.fx*r.len/2,r.z+r.fz*r.len/2)<9);this.jumpStart={x:n.pos.x,z:n.pos.z,ramp:s,t:0,maxY:n.pos.y}}if(this.jumpStart){let s=this.jumpStart;if(s.t+=t,s.maxY=Math.max(s.maxY,n.pos.y),s.ramp>=0&&s.t>.6&&(e.timeScale=.45),n.grounded){e.timeScale=1;let r=zt(s.x,s.z,n.pos.x,n.pos.z);if(s.ramp>=0&&s.t>.8){let o=!this.jumpsDone.has(s.ramp),l=Math.round((s.t*150+r*5)*(o?2:1)/10)*10;o&&(this.jumpsDone.add(s.ramp),e.stats.jumps=this.jumpsDone.size),e.addMoney(l),e.hud.bigText("\xA1SALTO INS\xD3LITO!",`${Math.round(r)} m \u2014 $${l}${o?`<br><small>Saltos \xFAnicos: ${this.jumpsDone.size} de ${Js.length}</small>`:""}`,3.5)}else if(s.t>2.2){let o=Math.round(s.t*40);e.addMoney(o),e.hud.showToast(`Volaste ${Math.round(r)} m \u2014 +$${o}`,2)}this.jumpStart=null}}}}startRemis(){let t=this.game;this.remis={fares:0,state:"find",timer:0,pax:null,blip:null,total:0},t.hud.showHelp(`<b>Remisero</b>: busc\xE1 al pasajero marcado en el radar y fren\xE1 al lado. Para terminar el turno, ${t.key("job")}.`,6),this.nextFare()}stopRemis(t){let e=this.game,i=this.remis;i&&(i.pax&&!i.pax.removed&&(i.pax.vehicle&&i.pax.exitVehicle(),i.pax.persistent=!1,i.pax.blip=null,i.pax.brain=new oe(e,i.pax,"wander")),i.destBlip&&e.blips.splice(e.blips.indexOf(i.destBlip),1),i.marker&&i.marker.dispose(),e.hud.removeCounter("remis"),e.hud.removeCounter("remisT"),e.hud.showToast(`${t}<br>Viajes: ${i.fares} \u2014 Recaudaste $${i.total}`,4),this.remis=null)}nextFare(){let t=this.game,e=this.remis,i=t.player.vehicle.pos,n=t.city.blocks.filter(c=>{let h=zt((c.x0+c.x1)/2,(c.z0+c.z1)/2,i.x,i.z);return h>60&&h<260&&!c.special});if(!n.length){this.stopRemis("No hay pasajeros por ac\xE1.");return}let s=ae(n),[r,o]=t.city.sidewalkPoint(s,st(.2,.8),Math.floor(st(0,4))),l=t.spawnPed("civil",r,o,{look:ni("civil")});l.persistent=!0,l.brain=new oe(t,l,"idle"),l.blip="#20c0ff",l.blipEdge=!0,l.wave=!0,e.pax=l,e.state="find",e.timer=60}updateRemis(t){let e=this.game,i=this.remis;if(!i)return;let n=e.player;if(!n.vehicle||n.vehicle.key!=="remis"){this.stopRemis("Te bajaste del rem\xEDs.");return}if(i.pax&&i.pax.dead){this.stopRemis("Tu pasajero... ya no necesita rem\xEDs.");return}if(i.timer-=t,e.hud.setCounter("remis","VIAJES",String(i.fares)),e.hud.setCounter("remisT","TIEMPO",`${Math.max(0,Math.floor(i.timer/60))}:${String(Math.max(0,Math.floor(i.timer%60))).padStart(2,"0")}`),i.timer<=0){this.stopRemis("Se te acab\xF3 el tiempo.");return}let s=n.vehicle;if(i.state==="find"){if(zt(s.pos.x,s.pos.z,i.pax.pos.x,i.pax.pos.z)<7&&s.speed<2){let o=s.seats.findIndex((d,f)=>f>0&&!d);if(o<0){e.hud.showHelp("No hay lugar para el pasajero.",2);return}i.pax.wave=!1,i.pax.enterVehicle(s,o),i.pax.blip=null;let l=e.city.blocks.filter(d=>{let f=zt((d.x0+d.x1)/2,(d.z0+d.z1)/2,s.pos.x,s.pos.z);return f>200&&f<700}),c=ae(l.length?l:e.city.blocks),[h,u]=e.city.sidewalkPoint(c,.5,Math.floor(st(0,4)));i.dest={x:h,z:u,zone:e.world.zoneAt(h,u)},i.marker=new ls(e,h,u,16765466,{r:3,h:1.2}),i.destBlip={x:h,z:u,color:"#ffd21a",size:8,edge:!0},e.blips.push(i.destBlip),i.dist=zt(s.pos.x,s.pos.z,h,u),i.timer=20+i.dist/9,i.state="drive",e.hud.subtitle(`<span class="who">Pasajero:</span> ${ae(["Llevame a","Voy para","Hasta"])} ${i.dest.zone}, por favor. ${ae(["Rapidito que llego tarde al laburo.","Y no me cobres la vuelta.","Cuidado con el viento.",""])}`,4)}}else if(i.state==="drive"&&(i.marker.update(t),zt(s.pos.x,s.pos.z,i.dest.x,i.dest.z)<5&&s.speed<2)){let o=Math.round(10+i.dist*.06+i.timer*.5);e.addMoney(o),i.total+=o,i.fares++,e.stats.fares++,i.pax.exitVehicle(),i.pax.persistent=!1,i.pax.brain=new oe(e,i.pax,"wander"),i.marker.dispose(),i.marker=null,e.blips.splice(e.blips.indexOf(i.destBlip),1),i.destBlip=null,e.hud.showToast(`\xA1Viaje completado! +$${o}`,2),i.fares===10&&(e.addMoney(3e3),e.hud.bigText("\xA1REMISERO DEL A\xD1O!","+$3.000",4)),this.nextFare()}}gym(){let t=this.game,e=t.player;if(e!==t.gordopin){t.hud.showHelp('Petroca: "\xBFGimnasio? Yo hago fierros en el pozo todo el d\xEDa."',3);return}let i=document.createElement("div");i.className="mini gymbox",i.innerHTML='<h3>Cinta \u2014 Gimnasio M\xFAsculo Patag\xF3nico</h3><p>Apret\xE1 <kbd>A</kbd> y <kbd>D</kbd> (o \u25C0 \u25B6) alternados para correr. <kbd>F</kbd> para salir.</p><div class="meter"><i></i></div><div class="gs"></div><div class="mini-btns"><button data-k="L">\u25C0</button><button data-k="R">\u25B6</button><button data-k="X">Salir</button></div>',document.body.appendChild(i),t.controlsLocked=!0;let n=0,s=null,r=0,o=0,l=h=>{if(h==="X"){c();return}h!==s&&(n=Math.min(1,n+.09),s=h)};i.querySelectorAll("button").forEach(h=>h.addEventListener("pointerdown",u=>{u.preventDefault(),l(h.dataset.k)}));let c=()=>{i.remove(),t.controlsLocked=!1,this.mini=null,e.moveMag=0,t.hud.showToast(`Quemaste ${r.toFixed(1)} de grasa. M\xFAsculo: ${t.stats.muscle.toFixed(0)}`,3),this.updateBody()};this.mini={update:h=>{let u=t.input;if(u.was("left")&&l("L"),u.was("right")&&l("R"),u.was("enter")||u.was("pause")){c();return}if(o+=h,n=Math.max(0,n-h*.35),e.moveMag=0,e.model.update(0,{speed:n*6}),n>.35){let d=h*n*.6;t.stats.fat=Math.max(0,t.stats.fat-d),t.stats.muscle=Math.min(100,t.stats.muscle+d*.35),t.stats.stamina=Math.min(100,t.stats.stamina+d*.5),r+=d}i.querySelector(".meter i").style.width=n*100+"%",i.querySelector(".gs").textContent=`Grasa: ${t.stats.fat.toFixed(1)}   M\xFAsculo: ${t.stats.muscle.toFixed(1)}   Resistencia: ${t.stats.stamina.toFixed(1)}`,this.updateBody()}}}juggling(){let t=this.game,e=t.player;if(e!==t.gordopin){t.hud.showHelp('Petroca: "Yo no hago malabares, loco. Yo tengo un sueldo petrolero."',3);return}(this.trafficLight.state==="NS"||this.trafficLight.state==="NSy")&&(t.hud.showHelp("Esper\xE1 que el sem\xE1foro de <b>Av. San Mart\xEDn</b> se ponga en rojo (los autos tienen que estar frenados).",4),this.jugWait=!0);let i=document.createElement("div");i.className="mini jugbox",i.innerHTML='<div class="jug-head"><span class="jt">MALABARES</span><span class="jm">$0</span></div><div class="lanes"><div class="lane" data-l="0"><b>\u25C0</b></div><div class="lane" data-l="1"><b>\u25B2</b></div><div class="lane" data-l="2"><b>\u25BC</b></div><div class="lane" data-l="3"><b>\u25B6</b></div><div class="hitline"></div></div><div class="jug-msg">"No soy trapito, soy malabarista."</div><div class="mini-btns"><button data-k="0">\u25C0</button><button data-k="1">\u25B2</button><button data-k="2">\u25BC</button><button data-k="3">\u25B6</button></div>',document.body.appendChild(i),t.controlsLocked=!0,e.moveMag=0,e.jugg=!0;let n=[];for(let E=0;E<3;E++){let _=new xt(new gi(.05,.02,.45,6),new Jt({color:E===1?1847147:15921906}));t.scene.add(_),n.push(_)}let s=[...i.querySelectorAll(".lane")],r=[],o=-2,l=0,c=0,h=0,u=0,d=0,m=60/100,x=18,g=i.querySelector(".jug-msg"),p=t.cameraRig,y={x:Math.sin(e.heading),z:Math.cos(e.heading)};e.heading=Math.atan2(Bt.semaforo.x-e.pos.x,Bt.semaforo.z-e.pos.z)+.8;let M=new N(e.pos.x+5,e.pos.y+2.2,e.pos.z+5),v=new N(e.pos.x+3.5,e.pos.y+1.8,e.pos.z+3.8);p.startCinematic(M,v,new N(e.pos.x,e.pos.y+1.6,e.pos.z),20);let S=E=>{let _=null,T=.22;for(let R of r){if(R.lane!==E||R.done)continue;let C=Math.abs(R.t-o);C<T&&(T=C,_=R)}if(_){_.done=!0,_.el.classList.add("ok"),c++,h++;let R=Math.round(st(1,4)*(1+Math.min(c,20)*.1));l+=R,g.textContent=c>5?`\xA1COMBO x${c}! Los autos tiran monedas`:ae(["\xA1Bien!","\xA1Joya!","\xA1Aguante!","\xA1Eso!"]),t.audio.tone({freq:700+E*120,dur:.08,type:"triangle",gain:.15})}else c=0,u++,g.textContent=ae(["\xA1Se te cay\xF3!","Uh, casi...","Concentrate, Gordo"]),t.audio.tone({freq:160,dur:.15,type:"square",gain:.1})};i.querySelectorAll("button").forEach(E=>E.addEventListener("pointerdown",_=>{_.preventDefault(),S(+E.dataset.k)}));let b=()=>{for(let E of n)t.scene.remove(E);i.remove(),e.jugg=!1,t.controlsLocked=!1,p.endCinematic(),this.mini=null,t.addMoney(l),t.stats.juggleBest=Math.max(t.stats.juggleBest,l),t.stats.respect=Math.min(100,t.stats.respect+h*.1),t.hud.bigText("\xA1MALABARES!",`Juntaste $${l} \u2014 Aciertos ${h}, errores ${u}`,4)};this.mini={update:E=>{let _=t.input;if(_.was("left")&&S(0),_.was("forward")&&S(1),_.was("back")&&S(2),_.was("right")&&S(3),_.was("pause")||_.was("enter")){b();return}if(this.jugWait&&(this.trafficLight.state==="NS"||this.trafficLight.state==="NSy")){o=-2;return}if(this.jugWait=!1,o+=E,d-=E,d<=0&&o<x-2){d=m*ae([1,1,.5,2]);let R=Math.floor(st(0,4)),C=document.createElement("i");C.className="note",C.textContent=["\u25C0","\u25B2","\u25BC","\u25B6"][R],s[R].appendChild(C),r.push({lane:R,t:o+1.6,el:C,done:!1})}for(let R of r){let C=1-(R.t-o)/1.6;R.el.style.top=`${lt(C,-.1,1.2)*82}%`,!R.done&&o-R.t>.25&&(R.done=!0,R.el.classList.add("miss"),c=0,u++),o-R.t>.5&&R.el.remove()}i.querySelector(".jm").textContent=`$${l}`;let T=performance.now()*.001;n.forEach((R,C)=>{let L=T*5+C*(Math.PI*2/3);R.position.set(e.pos.x+Math.cos(L)*.35*Math.cos(e.heading),e.pos.y+1.9+Math.abs(Math.sin(L))*.9,e.pos.z-Math.cos(L)*.35*Math.sin(e.heading)),R.rotation.x=T*12+C}),(o>x||o>0&&this.trafficLight.state==="NS")&&b()}}}};var ir=class extends Error{},Fh=class extends Error{},Pt=(a,t,e)=>new N(a,t,e),Bh=class{constructor(t,e){this.game=t,this.def=e,this.t=0,this.waiters=[],this.fails=[],this.cleanup=[],this.allowSwitch=!1,this.allowShops=!1,this.noWanted=!1,this.inCutscene=!1,this.skip=!1}frame(t){this.t+=t;for(let i of this.fails){let n=!1;try{n=i.fn()}catch{n=!1}if(n){this.abort(new ir(i.reason));return}}let e=this.waiters;this.waiters=[];for(let i of e){let n=!1;try{n=i.fn()}catch{n=!1}n?i.resolve():this.waiters.push(i)}}abort(t){let e=this.waiters;this.waiters=[],this.aborted=t;for(let i of e)i.reject(t)}until(t){return this.aborted?Promise.reject(this.aborted):new Promise((e,i)=>this.waiters.push({fn:t,resolve:e,reject:i}))}wait(t){let e=this.t+t;return this.until(()=>this.t>=e)}failIf(t,e){let i={fn:t,reason:e};return this.fails.push(i),i}removeFail(t){this.fails=this.fails.filter(e=>e!==t)}spawnVehicle(t,e,i,n,s={}){let r=this.game.spawnVehicle(t,e,i,n,s);return r.missionOwned=!0,this.cleanup.push(()=>{!r.removed&&!(r.driver&&r.driver.isPlayer)&&!s.keep&&(r.missionOwned=!1)}),r}spawnPed(t,e,i,n={}){let s=this.game.spawnPed(t,e,i,{look:n.look||ni(t),...n});return s.persistent=!0,this.cleanup.push(()=>{if(!s.removed){if(s.blip=null,n.keep)return;s.vehicle&&s.vehicle.driver===this.game.player&&s.exitVehicle(),s.persistent=!1,s.spawned=!0,s.brain&&s.brain.mode==="script"&&s.brain.setMode("wander")}}),s}marker(t,e,i=16765466,n={}){let s=new ls(this.game,t,e,i,n);return this.cleanup.push(()=>s.dispose()),this.markers=this.markers||[],this.markers.push(s),s}blip(t,e,i="#ffd21a"){let n={x:t,z:e,color:i,size:8,edge:!0};return this.game.blips.push(n),this.cleanup.push(()=>this.removeBlip(n)),n}removeBlip(t){let e=this.game.blips.indexOf(t);e>=0&&this.game.blips.splice(e,1)}objective(t,e=6){this.game.hud.subtitle(t,e),this.game.missions.lastObjective=t}help(t,e=6){this.game.hud.showHelp(t,e)}async goTo(t,e,i={}){let n=this.game,s=this.marker(t,e,i.color||16765466,{r:i.radius||(i.vehicle?3:1.4),h:i.vehicle?1.2:1.6}),r=this.blip(t,e);i.text&&this.objective(i.text),await this.until(()=>{s.update(1/60);let o=n.player,l=o.vehicle?o.vehicle.pos:o.pos;return!(!s.contains(l,.5)||i.vehicle===!0&&!o.vehicle||i.vehicle&&i.vehicle!==!0&&o.vehicle!==i.vehicle||i.onFoot&&o.vehicle||i.slow&&o.vehicle&&o.vehicle.speed>6||i.check&&!i.check())}),s.dispose(),this.removeBlip(r)}timer(t,e="TIEMPO"){let i=this.t+t,n="mtimer",s=this.failIf(()=>{let r=Math.max(0,i-this.t);return this.game.hud.setCounter(n,e,`${Math.floor(r/60)}:${String(Math.floor(r%60)).padStart(2,"0")}`),r<=0},"Se te acab\xF3 el tiempo.");return this.cleanup.push(()=>this.game.hud.removeCounter(n)),{stop:()=>{this.removeFail(s),this.game.hud.removeCounter(n)}}}async cutscene(t){let e=this.game;this.inCutscene=!0,e.missions.skipPressed=!1,e.controlsLocked=!0,e.hud.letterbox(!0),e.hud.hideHelp();let i=e.player;i.moveMag=0,i.aiming=!1,this.skip=!1,e.population.clearAround(i.pos,30),e.population.enabled=!1;try{await t()}finally{e.cameraRig.endCinematic(),e.hud.letterbox(!1),e.hud.clearSubtitle(),e.controlsLocked=!1,e.population.enabled=!0,this.inCutscene=!1;let n=e.player;e.cameraRig.snapBehind(n.vehicle?n.vehicle.heading:n.heading)}}async say(t,e,i){let n=this.game;i=i||lt(e.length*.06+1.2,2.2,6),n.hud.subtitle(t?`<span class="who">${t}:</span> ${e}`:`<i>${e}</i>`,i+1),n.settings.tts&&n.audio.speak(e,t==="Petroca"?.8:t==="Tenpesos"?.6:1.1);let s=this.t+i,r=this.t;await this.until(()=>this.t>=s||this.t-r>.35&&this.game.missions.skipPressed),this.game.missions.skipPressed=!1}cam(t,e,i,n=5,s={}){this.game.cameraRig.startCinematic(t,e,i,n,s)}async fade(t,e=.6){await this.game.hud.fadeTo(t,e)}place(t,e,i,n=0){t.vehicle&&t.exitVehicle(),t.pos.set(e,this.game.world.footGround(e,i),i),t.heading=n,t.vx=t.vz=0}face(t,e){t.heading=Math.atan2(e.pos.x-t.pos.x,e.pos.z-t.pos.z)}script(t,e){return t.brain=new oe(this.game,t,"script"),t.brain.script=e,t.brain}},Wl=class{constructor(t){this.game=t,this.done=[],this.active=null,this.starters=[],this.lastBrief="",this.list=this.defs(),this.refresh()}nextHint(){let t=this.list.find(e=>!this.done.includes(e.id));return t?`${t.title} \u2014 ${t.hint}`:"\xA1Terminaste la historia! Segu\xED recorriendo Comodoro, junt\xE1 bolsitas y hac\xE9 saltos."}refresh(){let t=this.game;for(let r of this.starters){r.marker.dispose();let o=t.blips.indexOf(r.blip);o>=0&&t.blips.splice(o,1)}this.starters=[];let e=this.list.find(r=>!this.done.includes(r.id)&&r.start);if(!e)return;let i=e.start(),n=new ls(t,i.x,i.z,16765466,{r:1.3}),s={x:i.x,z:i.z,letter:e.giver,bg:e.giver==="N"?"#1c2f6b":"#c89a10",name:e.giver==="N"?"Misi\xF3n de Newbery":"Misi\xF3n del Petroca",legend:!0};t.blips.push(s),this.starters.push({def:e,marker:n,blip:s})}startIntro(){let t=this.list[0];this.start(t)}update(t){let e=this.game,i=e.input;if((i.was("enter")||i.was("sprint")||i.was("fire")||i.was("jump")||i.touch.pressed.size)&&(this.skipPressed=!0),this.active){this.active.frame(t);return}for(let n of this.starters){n.marker.update(t);let s=e.player;if(!s.vehicle&&n.marker.contains(s.pos)&&!e.respawning){if(e.police.level>0){e.hud.showHelp("Perd\xE9 a la cana antes de empezar la misi\xF3n.",3);continue}if(n.def.needGordopin&&s!==e.gordopin){e.hud.showHelp("Esta misi\xF3n la arranca el <b>Gordopin</b>. Apret\xE1 TAB para cambiar.",3);continue}this.start(n.def);break}}}async start(t){let e=this.game;for(let n of this.starters)n.marker.visible=!1;let i=new Bh(e,t);this.active=i,i.allowSwitch=!!t.allowSwitch,this.lastBrief=`<b>${t.title}</b><br>${t.hint}`,e.hud.missionTitle(t.title,4),e.activities.remis&&e.activities.stopRemis("Arranc\xF3 una misi\xF3n."),t.needPetroca&&i.failIf(()=>e.petroca.dead,"\xA1Mataron al Petroca!");try{await t.run(i,e),this.pass(i,t)}catch(n){n instanceof ir?this.showFail(n.message):n instanceof Fh||(console.error(n),this.showFail("Algo sali\xF3 mal."))}finally{for(let n of i.cleanup)try{n()}catch{}if(e.hud.clearCounters(),i.inCutscene&&(e.cameraRig.endCinematic(),e.hud.letterbox(!1),e.controlsLocked=!1),e.env.forcedWeather=null,this.active=null,e.companionActive&&e.companion&&!e.companion.dead){let n=e.companion;(!n.brain||n.brain.mode!=="follow")&&(n.brain=new oe(e,n,"follow")),n.brain.driveTarget=null}this.refresh()}}pass(t,e){let i=this.game;this.done.push(e.id),i.stats.missions=this.done.length,i.addMoney(e.reward||0,!0),i.stats.respect=Math.min(100,i.stats.respect+(e.respect||5)),i.hud.bigText("\xA1MISI\xD3N SUPERADA!",`${e.reward?"$"+e.reward.toLocaleString("es-AR")+"<br>":""}RESPETO +`,5),i.audio.missionPassed(),i.police.clear()}showFail(t){let e=this.game;if(e.respawning){setTimeout(()=>this.showFail(t),5200);return}e.hud.bigText("\xA1MISI\xD3N FALLIDA!",t,4.5,"red"),e.audio.missionFailed()}fail(t,e=!1){this.active&&this.active.abort(e?new ir(t):new ir(t))}onPedDeath(t){this.active&&this.active.onPedDeath&&this.active.onPedDeath(t)}defs(){let t=this.game,e=()=>t.city.markers,i=()=>({x:e().garagePetroca.x+2,z:e().garagePetroca.z});return[{id:"intro",title:"No me van a sacar de la calle",giver:"P",hint:"Volv\xE9 en bici desde el Chenque a la Casa de la Abuela.",reward:200,respect:5,run:async(n,s)=>{let r=s.gordopin;s.env.time=1100,s.env.setWeather("despejado",!0);let o=Bt.semaforo.x-8.2,l=Bt.semaforo.z-8.2;n.place(r,o,l,Math.PI/4),s.money=250;let c=n.spawnVehicle("patrullero",Bt.semaforo.x-2.5,Bt.semaforo.z-30,0,{persistent:!0});c.siren=!0;let h=n.spawnPed("tenpesos",o+3,l-3,{look:ni("tenpesos"),name:"Tenpesos"}),u=n.spawnPed("cana",o+4,l-1.5,{look:ni("cana"),name:"Pulenta"});n.script(h,()=>{}),n.script(u,()=>{}),n.face(h,r),n.face(u,r),h.group.visible=!1,u.group.visible=!1,await n.cutscene(async()=>{let m=r.pos;n.cam(Pt(m.x+60,m.y+45,m.z+40),Pt(m.x+18,m.y+10,m.z+16),Pt(m.x,m.y+2,m.z),7,{lookFrom:Pt(m.x,m.y+5,m.z-60)}),r.jugg=!0,await n.say("","Comodoro Rivadavia, 2004. El barril sube, el Km 3 se llena de chatas nuevas... y el viento, como siempre, sopla.",6),n.cam(Pt(m.x+4,m.y+1.8,m.z+4.5),Pt(m.x+3,m.y+1.7,m.z+3.5),Pt(m.x,m.y+1.7,m.z),5),await n.say("","En el sem\xE1foro de San Mart\xEDn y Rivadavia, el Gordopin hace lo que mejor le sale.",4),h.group.visible=!0,u.group.visible=!0,r.jugg=!1,n.face(r,h),n.cam(Pt(m.x-3,m.y+1.9,m.z+3),Pt(m.x-2.5,m.y+1.8,m.z+2.5),Pt(h.pos.x,m.y+1.6,h.pos.z),6),await n.say("Tenpesos","Mir\xE1 qui\xE9n est\xE1 ac\xE1. El malabarista del sem\xE1foro."),await n.say("Gordopin","Buenas, comisario. Estoy laburando, no jodo a nadie."),await n.say("Tenpesos","Don Crudo quiere el Centro limpio. Nada de malabaristas, nada de trapitos. Esto ahora es una ciudad petrolera seria."),n.cam(Pt(m.x+2.5,m.y+1.7,m.z-1),Pt(m.x+2,m.y+1.7,m.z-.5),Pt(m.x,m.y+1.6,m.z),6),await n.say("Gordopin","Yo no soy trapito, soy malabarista. Y trabajo en el sem\xE1foro que a m\xED se me da la gana."),await n.say("Pulenta","Uh, se nos puso picante el gordo."),await n.say("Tenpesos","La recaudaci\xF3n del d\xEDa es m\xEDa. Llamalo peaje. Y ahora te vas a dar una vuelta con nosotros."),await n.fade(!0,.8),s.money=0;let x=175,g=-352;n.place(r,x,g,Math.PI);let p=n.spawnVehicle("bmx",x+2.5,g+1.5,Math.PI*.9,{keep:!0});p.missionOwned=!1,n.place(h,x+30,g+10,0),h.group.visible=!1,u.group.visible=!1,c.pos.set(x+8,s.terrain.groundAt(x+8,g+6),g+6),c.heading=Math.PI*.8,c.siren=!1,n.cam(Pt(x-18,r.pos.y+14,g-10),Pt(x-7,r.pos.y+4,g-5),Pt(x,r.pos.y+1.2,g),8,{lookFrom:Pt(x+50,r.pos.y-30,g+200)}),await n.fade(!1,.8),await n.say("","Un rato despu\xE9s, arriba del Cerro Chenque...",3),await n.say("Tenpesos","\xA1A m\xED nadie me dice que no, gordo! \xA1Bajate caminando, a ver si adelgaz\xE1s!",3.5),s.removeVehicle(c),await n.say("Gordopin","Aaah, la concha de la lora... otra vez lo mismo.",3.5)}),s.removePed(h),s.removePed(u),n.help(`Acercate a la <b>bici</b> y ${s.key("enter")} para subirte. Pedale\xE1 con ${s.key("forward").replace(/^\S+ /,"")}; para el saltito, ${s.key("jump")}.`,8),await n.until(()=>r.vehicle&&r.vehicle.type.bike),await n.goTo(e().casaAbuela.x,e().casaAbuela.z,{text:"And\xE1 a la <b>Casa de la Abuela</b> en el Barrio Pietrobelli.",radius:2.5}),r.vehicle&&r.exitVehicle();let d=n.spawnVehicle("empresa",e().garagePetroca.x+18,e().garagePetroca.z+2,0),f=s.petroca;await n.cutscene(async()=>{let m=e().casaAbuela.x,x=e().casaAbuela.z;n.place(r,m+1.5,x,Math.PI/2),s.setCompanionActive(!0,m+6,x+4),n.script(f,()=>{}),f.enterVehicle(d,0),d.pos.set(m+8,d.pos.y,x+30),d.heading=Math.PI,d.ai=new rn(s,d,"goto",{target:{x:m+6,z:x+6,pos:{x:m+6,z:x+6}}}),d.ai.mode="goto",s.traffic.cars.push(d),n.cam(Pt(m+12,r.pos.y+3,x-8),Pt(m+10,r.pos.y+2.5,x-6),Pt(m+6,r.pos.y+1,x+6),8),await n.wait(3.5),d.ai=null,d.ctrl.throttle=0,d.ctrl.brake=1,d.vx=d.vz=0,f.exitVehicle(),n.face(f,r),n.face(r,f),n.cam(Pt(m+4.5,r.pos.y+1.8,x-3),Pt(m+4,r.pos.y+1.8,x-2.5),Pt((r.pos.x+f.pos.x)/2,r.pos.y+1.6,(r.pos.z+f.pos.z)/2),8),await n.say("Petroca","\xA1Buena petroca! \xA1El Gordopin! \xBFQu\xE9 hac\xE9s con esa cara, loco?"),await n.say("Gordopin","Tenpesos me afan\xF3 la recaudaci\xF3n y me tir\xF3 arriba del Chenque."),await n.say("Petroca","Ese rati es un garca. Anda de la mano con Don Crudo, el de la petrolera. Dicen que quieren perforar en el barrio... \xA1hasta en La Madriguera!"),await n.say("Gordopin","\xBFEn la cancha del Lobo? Ni en pedo."),await n.say("Petroca","Tranqui. Yo tengo un par de ideas... y guita. Mucha guita. Tom\xE1, para que no andes seco.")}),f.brain=new oe(s,f,"follow"),n.help(`El <b>Petroca</b> ahora te acompa\xF1a: ${s.key("switchChar")} para jugar con \xE9l. Las misiones con la <b>P</b> amarilla te las da el Petroca.`,8)},start:null},{id:"chata",title:"La chata del Petroca",giver:"P",hint:"Recuper\xE1 la Jilux roja del Petroca en el Puerto.",reward:500,respect:6,needPetroca:!0,needGordopin:!0,start:i,run:async(n,s)=>{let r=s.player,o=s.companion,l=e().garagePetroca.x,c=e().garagePetroca.z,h=n.spawnVehicle("empresa",l+7,c+8,0);await n.cutscene(async()=>{n.place(o,l+3,c-2,-Math.PI/2),n.face(r,o),n.face(o,r),n.cam(Pt(l+8,r.pos.y+2,c-5),Pt(l+7,r.pos.y+2,c-4),Pt(l+3,r.pos.y+1.4,c),8),await n.say("Petroca","Gordo, me afanaron la chata roja. La Jilux que me compr\xE9 con el bono. La vieron en el Puerto, con unos chetos de Rada."),await n.say("Gordopin","\xBFChetos en el Puerto? Esos no laburan ni en pedo."),await n.say("Petroca","Vamos a buscarla. Manej\xE1 vos la de la empresa, que yo llevo la nueve.")}),n.objective("Subite a la <b>chata de la empresa</b>."),h.blip="#40a0ff",await n.until(()=>r.vehicle===h),h.blip=null;let u=505,d=452,f=n.spawnVehicle("jilux",u,d,Math.PI/2,{color:11540504});f.locked=!1;let m=[];for(let x=0;x<3;x++){let g=n.spawnPed("cheto",u-4+x*3,d+5,{});g.give(x===0?"pistola":"bate",40),g.setWeapon(x===0?"pistola":"bate"),g.brain=new oe(s,g,"guard",{hostile:!0,home:{x:g.pos.x,z:g.pos.z}}),g.brain.aggroRange=22,g.brain.aggroDelay=.5,g.blip="#ff3030",m.push(g)}n.failIf(()=>f.dead,"\xA1Hiciste bolsa la chata del Petroca!"),await n.goTo(460,440,{text:"And\xE1 al <b>Puerto</b>.",vehicle:!0,radius:12}),n.objective("Recuper\xE1 la <b>Jilux roja</b> del Petroca."),f.blip="#40a0ff",await n.until(()=>r.vehicle===f),f.blip=null;for(let x of m)x.blip=null;s.hud.showToast("\xA1La chata tiene alarma!",2),s.police.setLevel(1),n.objective("Perd\xE9 a la <b>cana</b>."),await n.until(()=>s.police.level===0),await n.goTo(l+3,c,{text:"Llev\xE1 la chata al <b>garage del Petroca</b>.",vehicle:f,radius:3.5,slow:!0}),await n.cutscene(async()=>{f.ctrl.brake=1,await n.wait(.3),r.exitVehicle(),o.vehicle&&o.exitVehicle(),n.cam(Pt(l+10,r.pos.y+2.5,c+6),Pt(l+9,r.pos.y+2.2,c+5),Pt(f.pos.x,f.pos.y+1,f.pos.z),6),await n.say("Petroca","\xA1Buena petroca! \xA1Mi beb\xE9! \xBFVes, gordo? Con vos no hay quien pueda."),await n.say("Gordopin","Ahora invit\xE1 un chori, que estoy seco.")}),f.persistent=!0,f.playerOwned=!0,s.lastPlayerVehicle=f}},{id:"drive",title:"Chorip\xE1n Drive-Thru",giver:"P",hint:"Llev\xE1 a los pibes al Chori del Viento... y bancate lo que venga.",reward:800,respect:8,needPetroca:!0,needGordopin:!0,start:i,run:async(n,s)=>{let r=s.player,o=s.companion,l=e().garagePetroca.x,c=e().garagePetroca.z,h=n.spawnVehicle("falcon",l+7,c-6,0,{color:3099194}),u=[0,1].map(M=>{let v=n.spawnPed("lobo",l+4+M,c-8+M*1.5,{name:M?"Nahuel":"El Chino"});return v.give("pistola",80),v.setWeapon("pistola"),v.isFriend=!0,v.brain=new oe(s,v,"follow"),v});await n.cutscene(async()=>{n.cam(Pt(l+12,r.pos.y+2.5,c-2),Pt(l+11,r.pos.y+2.2,c-3),Pt(l+5,r.pos.y+1.3,c-6),8),await n.say("Petroca","Tengo un hambre que me como un guanaco. Vamos al Chori del Viento, en la Costanera."),await n.say("El Chino","Yo me pido tres. Y no me mires as\xED, Gordo, que vos te ped\xEDs cuatro."),await n.say("Gordopin","Subanse al Falc\xF3n. Manejo yo.")}),h.blip="#40a0ff",n.objective("Subite al <b>Falc\xF3n</b>."),n.failIf(()=>u.some(M=>M.dead),"\xA1Mataron a uno de los pibes!"),n.failIf(()=>h.dead,"Se hizo bolsa el Falc\xF3n."),await n.until(()=>r.vehicle===h),h.blip=null,await n.until(()=>u.every(M=>M.vehicle===h)&&o.vehicle===h),await n.goTo(Bt.chori.x-12,Bt.chori.z,{text:"Llev\xE1 a los pibes al <b>Chori del Viento</b>, en la Costanera.",vehicle:h,radius:4.5,slow:!0});let d=n.spawnPed("civil",Bt.chori.x+2.2,Bt.chori.z,{name:"El chorizero"});n.script(d,()=>{}),n.face(d,h),await n.cutscene(async()=>{h.ctrl.brake=1,h.vx=h.vz=0;let M=h.pos.x,v=h.pos.z;n.cam(Pt(M-4,h.pos.y+2,v+6),Pt(M-3,h.pos.y+1.8,v+5),Pt(M+2,h.pos.y+1.2,v),10),await n.say("El chorizero","\xBFQu\xE9 va a ser, muchachos?"),await n.say("Petroca","Dame dos choris, un bondiola completo, un chori con doble chimichurri, papas grandes, una bondiola sin tomate, dos cocas de litro y medio, una con hielo...",6),await n.say("Petroca","...y una ensalada."),await n.say("Gordopin","\xBFUna ensalada?"),await n.say("Petroca","Estoy a dieta, gordo."),await n.say("El chorizero","Son ciento cuarenta y tres pesos."),await n.say("Petroca","Cobrate de ac\xE1, maestro. \xA1Buena petroca!")});let f=s.roads.nearestEdge(h.pos.x,h.pos.z-60,60),m=f?f.x:h.pos.x,x=f?f.z:h.pos.z-60,g=n.spawnVehicle("gool",m,x,0,{color:8072587});g.health=700;let p=[0,1,2].map(M=>{let v=n.spawnPed("cheto",m,x,{});return v.give("uzi",400),v.setWeapon("uzi"),v.enterVehicle(g,M),v.brain=new oe(s,v,"follow"),v.brain.mode="script",v.brain.script=(S,b)=>{v.vehicle&&b.shootFromCar(S,s.player.vehicle||s.player)},v});g.ai=new rn(s,g,"chase",{target:h,speedMul:1.1}),g.ai.ram=!1,s.traffic.cars.push(g),g.blip="#ff3030",s.hud.showToast("\xA1Los chetos de Rada Tilly!",2),await n.say("El Chino","\xA1Nos tiran! \xA1Son los chetos!",2),await n.wait(3),g.ai.mode="flee",g.ai.target=h,n.objective("\xA1Segu\xED al <b>Gool violeta</b> y hacelo bolsa! Los pibes tiran desde el auto.");for(let M of[...u,o])M.brain.driveTarget=g;let y=0;n.failIf(()=>(y=zt(g.pos.x,g.pos.z,r.pos.x,r.pos.z)>220?y+1/60:0,y>8&&!g.dead),"Se te escaparon los chetos."),await n.until(()=>g.dead||g.health<150&&g.fireT>0),g.dead||g.explode();for(let M of p)M.dead||M.hurt(999,r);for(let M of[...u,o])M.brain.driveTarget=null;g.blip=null,await n.say("Nahuel","\xA1Tom\xE1! \xA1Eso les pasa por meterse con el barrio!",2.5),await n.goTo(e().casaAbuela.x+6,e().casaAbuela.z-20,{text:"Llev\xE1 a los pibes al <b>barrio</b>.",vehicle:!0,radius:5,slow:!0});for(let M of u)M.vehicle&&M.exitVehicle(),M.brain=new oe(s,M,"wander"),M.persistent=!1,M.spawned=!0;await n.say("El Chino","Gracias, Gordo. El chori estaba de diez. La ensalada del Petroca, no s\xE9.",3)}},{id:"bono",title:"Cobrar el bono",giver:"P",hint:"Llev\xE1 al Petroca al yacimiento de Pampa del Castillo antes del cambio de turno. Hay temporal.",reward:2500,respect:6,needPetroca:!0,needGordopin:!0,start:i,run:async(n,s)=>{let r=s.player,o=s.companion,l=e().garagePetroca.x,c=e().garagePetroca.z,h=n.spawnVehicle("jilux",l+7,c+6,0,{color:11540504});await n.cutscene(async()=>{n.cam(Pt(l+10,r.pos.y+2.5,c-4),Pt(l+9,r.pos.y+2.2,c-3),Pt(l+3,r.pos.y+1.3,c),8),await n.say("Petroca","Gordo, hoy pagan el bono en el yacimiento. Si no llego antes del cambio de turno, lo cobra el capataz."),await n.say("Gordopin","\xBFY por qu\xE9 no vas vos?"),await n.say("Petroca","Porque se viene un temporal de la gran siete y vos manej\xE1s mejor en la tierra. Dale, que es en Pampa del Castillo.")}),s.env.forcedWeather="temporal",s.env.setWeather("temporal"),h.blip="#40a0ff",n.objective("Subite a la <b>chata del Petroca</b>."),n.failIf(()=>h.dead,"Se hizo bolsa la chata."),await n.until(()=>r.vehicle===h&&o.vehicle===h),h.blip=null,n.help("Con el temporal, el viento empuja los autos hacia el <b>Este</b>. Contravolante\xE1.",6);let u=n.timer(240,"CAMBIO DE TURNO");await n.goTo(Bt.yacimiento.x+20,Bt.yacimiento.z+20,{text:"Llev\xE1 al Petroca al <b>campamento de Pampa del Castillo</b>.",vehicle:h,radius:8}),u.stop(),await n.cutscene(async()=>{h.ctrl.brake=1,h.vx=h.vz=0,r.exitVehicle(),o.exitVehicle();let f=Bt.yacimiento.x,m=Bt.yacimiento.z;n.cam(Pt(f+20,r.pos.y+4,m+26),Pt(f+18,r.pos.y+3,m+24),Pt(f,r.pos.y+2,m+8),10),n.script(o,(x,g)=>g.moveTo(f,m+6,1)),await n.say("","El Petroca entra al trailer de la empresa...",3),o.group.visible=!1,await n.wait(1.5),o.group.visible=!0,n.place(o,f+4,m+10,0),n.face(o,r),await n.say("Petroca","\xA1COBR\xC9! \xA1Buena petrocaaaa! Tengo guita para mantener a cincuenta generaciones."),await n.say("Petroca","Tom\xE1, esto es para vos. Y me compr\xE9 una moto enduro. Es tuya, gordo."),await n.say("Gordopin","Con este viento la moto me va a llevar a Caleta Olivia.")}),o.brain=new oe(s,o,"follow");let d=s.spawnVehicle("enduro",Bt.yacimiento.x+8,Bt.yacimiento.z+16,0,{color:15231514});d.persistent=!0,s.env.forcedWeather=null,s.env.setWeather("ventoso")}},{id:"trapo",title:"El trapo del Lobo",giver:"N",hint:"Los chetos se afanaron el trapo de la hinchada de Newbery. Recuperalo antes del cl\xE1sico.",reward:1500,respect:12,needPetroca:!0,needGordopin:!0,start:()=>({x:e().madriguera.x-1,z:e().madriguera.z+4}),run:async(n,s)=>{let r=s.player,o=s.companion,l=e().madriguera.x,c=e().madriguera.z,h=n.spawnPed("lobo",l-1.5,c-2,{name:"Cacho, el utilero",look:{...ni("lobo"),fat:.6,hair:11579568,hairStyle:"beanie",mustache:!0}});n.script(h,()=>{}),await n.cutscene(async()=>{n.face(h,r),n.face(r,h),n.cam(Pt(l-6,r.pos.y+2,c+5),Pt(l-5,r.pos.y+1.9,c+4),Pt(l-1,r.pos.y+1.5,c),8),await n.say("Cacho, el utilero",'Gordopin, una desgracia. Los chetos de Rada Tilly se afanaron el trapo grande de la hinchada. El de "LA BANDA DEL LOBO".'),await n.say("Cacho, el utilero","Y el domingo es el cl\xE1sico con Hurac\xE1n. \xA1No podemos salir sin el trapo!"),await n.say("Gordopin","\xBFSin el trapo? Eso es peor que perder."),await n.say("Cacho, el utilero","Dicen que Don Crudo les pag\xF3. Quiere que el club se desanime y venda la cancha para perforar."),await n.say("Gordopin","Vamos, Petroca. Nadie toca el trapo del Lobo."),await n.say("Cacho, el utilero","Tom\xE1, esto era de mi viejo. Cuidala.")}),r.give("pistola",34),r.setWeapon("pistola");let u=e().mansion,d=[];for(let v=0;v<6;v++){let S=v/6*Math.PI*2,b=n.spawnPed("cheto",u.x+Math.cos(S)*9,u.z-6+Math.sin(S)*7,{}),E=v%3===0?"pistola":v%3===1?"bate":"uzi";b.give(E,60),b.setWeapon(E),b.brain=new oe(s,b,"guard",{hostile:!0,home:{x:b.pos.x,z:b.pos.z}}),b.brain.aggroRange=26,b.brain.aggroDelay=.8,d.push(b)}let f=new xt(new gi(.35,.35,2.2,10),new Jt({color:1847147}));f.rotation.z=Math.PI/2,f.position.set(u.x,s.world.footGround(u.x,u.z)+.5,u.z-2),s.scene.add(f),n.cleanup.push(()=>s.scene.remove(f)),await n.goTo(u.x,u.z-30,{text:"And\xE1 a la <b>mansi\xF3n de los Chetos</b> en Rada Tilly.",radius:10});for(let v of d)v.blip="#ff3030";n.objective("Recuper\xE1 el <b>trapo del Lobo</b>. Cuidado con los chetos.");let m=n.blip(f.position.x,f.position.z,"#40a0ff");await n.until(()=>(f.rotation.y+=.03,zt(r.pos.x,r.pos.z,f.position.x,f.position.z)<2.6&&!r.vehicle)),s.scene.remove(f),n.removeBlip(m),s.audio.pickup(),s.hud.showToast("\xA1Ten\xE9s el trapo del Lobo!",2);let x=n.spawnVehicle("gool",u.x-20,u.z-60,0,{color:15769800}),g=[0,1].map(v=>{let S=n.spawnPed("cheto",x.pos.x,x.pos.z,{});return S.give("uzi",300),S.setWeapon("uzi"),S.enterVehicle(x,v),S.brain=new oe(s,S,"script"),S.brain.script=(b,E)=>{S.vehicle&&E.shootFromCar(b,s.player.vehicle||s.player)},S});x.ai=new rn(s,x,"chase",{target:r,speedMul:1.05}),x.ai.ram=!1,s.traffic.cars.push(x),x.blip="#ff3030",n.timer(210,"CL\xC1SICO"),await n.goTo(l-1,c,{text:"Llev\xE1 el trapo a <b>La Madriguera</b> antes del cl\xE1sico.",radius:3});let p=new xt(new ei(22,3.2),new He({map:bl(["LA BANDA DEL LOBO"],{w:1024,h:150,bg:"#f4f4f4",fg:"#1c2f6b",borderColor:"#1c2f6b"}),side:Qe})),y=s.world.footGround(l+35,c)+3.4;p.position.set(l+35,y,c-18.4),s.scene.add(p);let M=[];for(let v=0;v<8;v++){let S=s.spawnPed("lobo",l+20+v%4*5,c-8+Math.floor(v/4)*4,{});S.persistent=!0,S.dance=!0,S.brain=new oe(s,S,"idle"),S.isFriend=!0,M.push(S)}await n.cutscene(async()=>{n.cam(Pt(l+30,y+6,c+10),Pt(l+34,y+1,c+4),Pt(l+35,y,c-18),7),await n.say("Cacho, el utilero","\xA1Vamos Lobo, carajo! \xA1Volvi\xF3 el trapo!",3),await n.say("Gordopin","Aguante Newbery. Y que Don Crudo se vaya a perforar a la luna.",3.5)}),setTimeout(()=>{for(let v of M)v.dance=!1,v.persistent=!1,v.spawned=!0,v.brain=new oe(s,v,"wander")},2e4),s.removePed(h)}},{id:"cisterna",title:"La cisterna de Don Crudo",giver:"P",hint:"Rob\xE1 el cami\xF3n cisterna del dep\xF3sito de Crudo en el Km 3 y tiralo al mar desde el Muelle de Ultramar.",reward:3e3,respect:10,needPetroca:!0,needGordopin:!0,start:i,run:async(n,s)=>{let r=s.player,o=s.companion,l=e().garagePetroca.x,c=e().garagePetroca.z;await n.cutscene(async()=>{n.cam(Pt(l+10,r.pos.y+2.5,c-4),Pt(l+9,r.pos.y+2.2,c-3),Pt(l+3,r.pos.y+1.3,c),8),await n.say("Petroca","Averig\xFC\xE9 algo. Don Crudo tiene un cami\xF3n cisterna en el dep\xF3sito del Km 3. Adentro est\xE1n los permisos truchos para perforar en La Madriguera."),await n.say("Gordopin","\xBFY qu\xE9 hacemos? \xBFLos quemamos?"),await n.say("Petroca","Mejor: tiramos el cami\xF3n al mar desde el Muelle de Ultramar. Sin permisos no hay perforaci\xF3n."),await n.say("Gordopin","\xBFY la cana?"),await n.say("Petroca","Tenpesos le cuida el dep\xF3sito. As\xED que vamos a tener que correr. Buena petroca.")});let h=Bt.depositoCrudo,u=n.spawnVehicle("cisterna",h.x+16,h.z+12,Math.PI/2);u.health=1200;let d=[];for(let g=0;g<4;g++){let p=n.spawnPed("caleta",h.x-5+g*5,h.z+18+g%2*3,{});p.give(g%2?"pistola":"escopeta",60),p.setWeapon(g%2?"pistola":"escopeta"),p.brain=new oe(s,p,"guard",{hostile:!0,home:{x:p.pos.x,z:p.pos.z}}),p.brain.aggroRange=30,p.brain.aggroDelay=.6,d.push(p)}n.failIf(()=>u.dead,"\xA1Volaste el cami\xF3n en el medio del Km 3!"),await n.goTo(h.x+10,h.z+45,{text:"And\xE1 al <b>Dep\xF3sito de Don Crudo</b> en el Km 3.",radius:18});for(let g of d)g.blip="#ff3030";u.blip="#40a0ff",n.objective("Rob\xE1 el <b>cami\xF3n cisterna</b>. Los caletas de Crudo lo cuidan."),await n.until(()=>r.vehicle===u),u.blip=null,s.police.setLevel(2),s.hud.showToast("\xA1Tenpesos mand\xF3 a toda la comisar\xEDa!",2.5);let f=()=>s.hud.setCounter("truck","CISTERNA",lt((u.health-0)/1200,0,1),!0);n.failIf(()=>(f(),!1),""),n.cleanup.push(()=>s.hud.removeCounter("truck")),n.objective("Tir\xE1 la cisterna al mar desde la punta del <b>Muelle de Ultramar</b> (Puerto).");let m=n.blip(725,390,"#ffd21a"),x=n.marker(722,390,16765466,{r:4,h:1,y:2.6});await n.until(()=>(x.update(1/60),u.sinking>.3||u.pos.y<-.5&&u.pos.x>700)),n.removeBlip(m),x.dispose(),r.vehicle===u&&r.exitVehicle(),s.police.clear(),await n.cutscene(async()=>{n.cam(Pt(700,10,405),Pt(705,6,400),Pt(u.pos.x,0,u.pos.z),6),await n.say("","Los permisos truchos de Don Crudo se hunden en el Golfo San Jorge...",3.5),await n.say("Petroca","\xA1Buena petroca! \xA1Ahora que venga Crudo a perforar con un snorkel!",3.5)}),n.place(r,700,390,-Math.PI/2),r.pos.y=2.6}},{id:"final",title:"Tenpesos, final del recorrido",giver:"N",hint:"Fren\xE1 a Tenpesos antes de que clausure La Madriguera.",reward:1e4,respect:20,needPetroca:!0,needGordopin:!0,start:()=>({x:e().madriguera.x-1,z:e().madriguera.z+4}),run:async(n,s)=>{let r=s.player,o=s.companion,l=e().madriguera.x,c=e().madriguera.z;await n.cutscene(async()=>{n.place(o,l-2.5,c+1.5,0),n.face(o,r),n.face(r,o),n.cam(Pt(l-7,r.pos.y+2.2,c+5),Pt(l-6,r.pos.y+2,c+4),Pt(l-1.5,r.pos.y+1.5,c+1),8),await n.say("Petroca","Gordo, se pudri\xF3 todo. Tenpesos sabe que fuimos nosotros."),await n.say("Petroca","Viene para ac\xE1 con una orden trucha firmada por Crudo para clausurar La Madriguera."),await n.say("Gordopin","Entonces lo paramos en el camino. A m\xED no me van a sacar nunca de la calle. Y al Lobo, de su cancha, tampoco.")}),n.noWanted=!0;let h=e().comisaria,u=n.spawnVehicle("patrullero",h.x,h.z+6,Math.PI/2);u.health=1600,u.siren=!0;let d=n.spawnPed("tenpesos",u.pos.x,u.pos.z,{name:"Tenpesos",look:ni("tenpesos"),health:200}),f=n.spawnPed("cana",u.pos.x,u.pos.z,{name:"Pulenta"});f.give("uzi",999),f.setWeapon("uzi"),d.enterVehicle(u,0),f.enterVehicle(u,1),n.script(d,()=>{}),n.script(f,(x,g)=>{f.vehicle&&zt(u.pos.x,u.pos.z,r.pos.x,r.pos.z)<45&&g.shootFromCar(x,s.player.vehicle||s.player)}),u.ai=new rn(s,u,"route",{speedMul:1.2}),u.ai.planRoute(l-10,c),s.traffic.cars.push(u),u.blip="#ff3030",n.objective("Subite a un auto y fren\xE1 el <b>patrullero de Tenpesos</b> antes de que llegue a La Madriguera."),n.failIf(()=>zt(u.pos.x,u.pos.z,l,c)<25&&!u.dead&&u.health>250,"Tenpesos clausur\xF3 La Madriguera."),await n.until(()=>zt(u.pos.x,u.pos.z,r.pos.x,r.pos.z)<70),u.ai.mode="flee",u.ai.target=r,u.ai.speedMul=1.25,n.fails=n.fails.filter(x=>x.reason!=="Tenpesos clausur\xF3 La Madriguera."),s.hud.showToast("\xA1Tenpesos se escapa!",2),n.objective("\xA1Destroz\xE1 el <b>patrullero de Tenpesos</b>! El Petroca tira desde el auto."),o.brain.driveTarget=u;let m=0;n.failIf(()=>(m=zt(u.pos.x,u.pos.z,r.pos.x,r.pos.z)>260?m+1/60:0,m>10),"Tenpesos se escap\xF3."),u.onImpact=()=>{},await n.until(()=>u.health<300||u.dead),u.ai=null,u.ctrl.throttle=0,u.ctrl.brake=1,u.health=Math.max(u.health,100),u.fireT=0,o.brain.driveTarget=null,d.exitVehicle(),f.exitVehicle(),f.brain=new oe(s,f,"flee"),f.brain.fleeFrom=r,f.brain.t=30,f.brain.base="flee",n.script(d,(x,g)=>{let p=d.pos.x-r.pos.x,y=d.pos.z-r.pos.z,M=Math.hypot(p,y)||1;d.moveX=p/M,d.moveZ=y/M,d.moveMag=1,d.gait=M<15?2:1}),d.speedMul=.62,d.blip="#ff3030",u.blip=null,n.objective("\xA1Se le fundi\xF3 el motor! Agarr\xE1 a <b>Tenpesos</b> antes de que se escape."),n.failIf(()=>d.dead,"Tenpesos tiene que terminar preso, no muerto."),await n.until(()=>!r.vehicle&&zt(d.pos.x,d.pos.z,r.pos.x,r.pos.z)<2.2),await n.cutscene(async()=>{n.script(d,()=>{}),d.knockdown(0,0,1),n.place(o,r.pos.x+1.5,r.pos.z+1,0),n.face(r,d),n.face(o,d);let x=d.pos.x,g=d.pos.z;n.cam(Pt(x+4,r.pos.y+2.2,g+4),Pt(x+3,r.pos.y+1.8,g+3),Pt(x,r.pos.y+.8,g),12),await n.say("Tenpesos","Esto no termina ac\xE1, gordo... Crudo tiene amigos en Buenos Aires."),await n.say("Petroca","Y nosotros tenemos esto: te grab\xE9 todo con el celu nuevo. Tiene c\xE1mara y todo, comisario. Buena petroca."),await n.say("Gordopin","A m\xED no me van a sacar nunca de la calle, comisario. Y a Newbery de La Madriguera, tampoco."),await n.fade(!0,1),s.hud.clearSubtitle(),await n.say("","D\xEDas despu\xE9s, la causa contra Don Crudo y el comisario Tenpesos lleg\xF3 a todos los diarios de la Patagonia.",5),await n.say("","La Madriguera sigui\xF3 siendo del Lobo. El domingo, Newbery le gan\xF3 el cl\xE1sico a Hurac\xE1n 2 a 1.",5),await n.say("","Y el Gordopin volvi\xF3 a su sem\xE1foro. El que a \xE9l se le da la gana.",4.5),await n.fade(!1,1)}),s.removePed(d),s.hud.bigText("\xA1FIN DE LA HISTORIA!","Gracias por jugar \xB7 Aguante Comodoro<br><small>Segu\xED jugando: bolsitas, saltos, rem\xEDs y malabares</small>",8)}}]}};function kh(a){let t=document.createElement("canvas");t.width=t.height=64,a(t.getContext("2d"));let e=new Kn(t);return e.colorSpace=ti,e}var ql=class{constructor(t){this.game=t,this.items=[];let e=t.textures;this.tex={money:kh(i=>{i.fillStyle="#2f8c2a",i.fillRect(8,18,48,28),i.strokeStyle="#0a3a08",i.lineWidth=3,i.strokeRect(8,18,48,28),i.fillStyle="#d8f0c8",i.font="bold 22px Arial",i.textAlign="center",i.fillText("$",32,41)}),heart:kh(i=>{i.fillStyle="#e02020",i.beginPath(),i.moveTo(32,54),i.bezierCurveTo(2,34,8,8,32,22),i.bezierCurveTo(56,8,62,34,32,54),i.fill(),i.strokeStyle="#600",i.lineWidth=3,i.stroke()}),armor:kh(i=>{i.fillStyle="#3a5a8a",i.beginPath(),i.moveTo(16,10),i.lineTo(48,10),i.lineTo(54,20),i.lineTo(50,56),i.lineTo(14,56),i.lineTo(10,20),i.closePath(),i.fill(),i.strokeStyle="#112",i.lineWidth=3,i.stroke(),i.fillStyle="#fff",i.font="bold 12px Arial",i.textAlign="center",i.fillText("POLIC\xCDA",32,38)}),bag:e.bag},this.spawnStatic()}add(t,e,i,n={}){let s=this.game,r;if(t==="weapon"){r=new Qt;let c=Nl(se[n.weapon].mesh||"pistola");c&&(c.scale.setScalar(2),r.add(c));let h=new En(new fn({map:s.textures.glow,color:6340863,transparent:!0,opacity:.6,depthWrite:!1}));h.scale.set(1.6,1.6,1),r.add(h)}else{r=new En(new fn({map:this.tex[t],transparent:!0,depthWrite:!1}));let c=t==="bag"?.9:.8;r.scale.set(c,c,c)}let o=n.y!==void 0?n.y:s.world.footGround(e,i)+(t==="bag"?1:.7);r.position.set(e,o,i),s.scene.add(r);let l={kind:t,x:e,y:o,z:i,obj:r,...n,alive:!0,t:st(0,6)};return this.items.push(l),l}spawnMoney(t,e,i){return this.add("money",t+st(-.5,.5),e+st(-.5,.5),{value:i,ttl:30})}spawnWeapon(t,e,i,n){!se[i]||i==="punos"||this.add("weapon",t,e,{weapon:i,value:n,ttl:30})}spawnStatic(){let t=this.game,e=t.city.markers,i=(n,s,r,o={})=>this.add(n,s,r,{...o,respawn:300,home:{x:s,z:r}});e.hospital&&i("heart",e.hospital.x+5,e.hospital.z),e.casaAbuela&&i("heart",e.casaAbuela.x-1,e.casaAbuela.z+10),e.madriguera&&i("heart",e.madriguera.x+12,e.madriguera.z+30),e.comisaria&&i("armor",e.comisaria.x+22,e.comisaria.z-4),i("armor",30,-690),i("weapon",186,-392,{weapon:"pistola",value:34}),i("weapon",520,512,{weapon:"escopeta",value:16}),i("weapon",-360,-1318,{weapon:"uzi",value:90}),i("weapon",-236,60,{weapon:"bate",value:1}),i("weapon",560,1612,{weapon:"pistola",value:34}),i("heart",-1150,-880),hl.forEach(([n,s],r)=>{t.saves&&t.saves.bagCollected(r)||this.add("bag",n,s,{bag:r,y:t.terrain.groundAt(n,s)+1})})}refreshBags(){for(let t of this.items)t.kind==="bag"&&this.game.saves.bagCollected(t.bag)&&this.hide(t)}hide(t){t.alive=!1,t.obj.visible=!1,t.respawn?t.back=this.game.time+t.respawn:t.kind!=="bag"&&(this.game.scene.remove(t.obj),t.removed=!0)}update(t){let e=this.game,i=e.player,n=i.vehicle?i.vehicle.pos:i.pos;for(let s of this.items){if(s.removed)continue;if(!s.alive){s.back&&e.time>s.back&&(s.alive=!0,s.obj.visible=!0);continue}if(s.t+=t,s.kind==="weapon"&&(s.obj.rotation.y+=t*2),s.obj.position.y=s.y+Math.sin(s.t*3)*.12,s.kind==="bag"&&(s.obj.material.rotation=Math.sin(s.t*4)*.25),s.ttl!==void 0&&(s.ttl-=t,s.ttl<=0)){this.hide(s);continue}let r=zt(s.x,s.z,n.x,n.z),o=i.vehicle?2.5:1.3;r<o&&Math.abs(s.y-n.y)<2.5&&this.collect(s)}this.items=this.items.filter(s=>!s.removed)}collect(t){let e=this.game,i=e.player;if(t.kind==="money")e.addMoney(t.value);else if(t.kind==="heart"){if(i.health>=i.maxHealth)return;i.health=i.maxHealth,e.audio.pickup(),e.hud.showToast("Salud al m\xE1ximo",2)}else if(t.kind==="armor"){if(i.armor>=100)return;i.armor=100,e.audio.pickup(),e.hud.showToast("Chaleco antibalas",2)}else if(t.kind==="weapon"){if(i.vehicle)return;i.give(t.weapon,t.value),(i.weapon==="punos"||i.weapon==="clavas")&&i.setWeapon(t.weapon),e.audio.pickup(),e.hud.showToast(se[t.weapon].name,2)}else if(t.kind==="bag"){e.saves.collectBag(t.bag),e.stats.bags=e.saves.bagCount(),e.addMoney(100),e.audio.pickup();let n=24;e.hud.showToast(`Bolsita de La An\xF3mala ${e.stats.bags} de ${n}`,3),e.stats.bags>=n&&(e.addMoney(1e4),e.hud.bigText("\xA1LIMPIASTE COMODORO!","+$10.000 \u2014 Ahora el viento no te frena",5),e.cheats.windImmune=!0)}this.hide(t)}};var Xl=class{constructor(t){this.game=t,this.keepWeapons=!1,this.windImmune=!1,this.list={HESOYAM:["Salud, chaleco y $250.000",e=>{let i=e.player;i.health=i.maxHealth,i.armor=100,e.addMoney(25e4),i.vehicle&&(i.vehicle.health=1e3,i.vehicle.fireT=0)}],BUENAPETROCA:["La chata del Petroca y $10.000",e=>{this.spawnNear("jilux",11540504),e.addMoney(1e4)}],AEZAKMI:["Nunca buscado",e=>{e.police.neverWanted=!e.police.neverWanted,e.police.clear()}],ASNAEB:["Sin nivel de b\xFAsqueda",e=>e.police.clear()],OSRBLHH:["+2 estrellas",e=>e.police.setLevel(Math.min(6,e.police.level+2))],LXGIWYL:["Armas del barrio",e=>{let i=e.player;i.give("bate"),i.give("pistola",100),i.give("escopeta",40),i.give("uzi",300),i.setWeapon("uzi")}],BTCDBCB:["Gordopin XXL",e=>{e.stats.fat=100,e.activities.updateBody()}],KVGYZQK:["Gordopin flaco",e=>{e.stats.fat=0,e.activities.updateBody()}],JYSDSOD:["M\xFAsculo m\xE1ximo",e=>{e.stats.muscle=100,e.activities.updateBody()}],VIENTOBLANCO:["Temporal de viento",e=>{e.env.forcedWeather=e.env.forcedWeather?null:"temporal",e.env.forcedWeather||e.env.setWeather("despejado")}],XJVSNAJ:["Siempre medianoche",e=>{e.env.time=0}],CPKTNWT:["Explotan todos los autos",e=>{for(let i of e.vehicles)!i.dead&&!(i.driver&&i.driver.isPlayer)&&i.explode()}],CHORIPAN:["Salud completa",e=>{e.player.health=e.player.maxHealth}],AGUANTENEWBERY:["La barra del Lobo te acompa\xF1a",e=>this.lobos()],REMISERO:["Rem\xEDs",()=>this.spawnNear("remis")],PATRULLERO:["Patrullero",()=>this.spawnNear("patrullero")],CISTERNA:["Cami\xF3n cisterna",()=>this.spawnNear("cisterna")],ENDURO:["Moto enduro",()=>this.spawnNear("enduro")],FITITO:["Fitito 600",()=>this.spawnNear("fitito")]}}check(t){for(let e of Object.keys(this.list))if(t.endsWith(e)){let[i,n]=this.list[e];return n(this.game),this.game.hud&&this.game.hud.showToast(`Truco activado<br><small>${i}</small>`,2.5),this.game.audio&&this.game.audio.pickup(),this.game.input.typed="",!0}return!1}spawnNear(t,e){let i=this.game,n=i.player,s={x:Math.sin(n.heading),z:Math.cos(n.heading)},r=n.pos.x+s.x*6,o=n.pos.z+s.z*6,l=i.spawnVehicle(t,r,o,n.heading+Math.PI/2,e!==void 0?{color:e}:{});return i.lastPlayerVehicle=l,l}lobos(){let t=this.game,e=t.player;for(let i=0;i<3;i++){let n=e.pos.x+Math.cos(i*2)*4,s=e.pos.z+Math.sin(i*2)*4,r=t.spawnPed("lobo",n,s);r.give("bate"),r.give("pistola",60),r.setWeapon("pistola"),r.isFriend=!0,r.spawned=!0,r.brain=new oe(t,r,"follow")}}};var Oh="gtasj-save-1",Yl=class{constructor(t){this.game=t,this.bags=new Set}bagCollected(t){return this.bags.has(t)}collectBag(t){this.bags.add(t)}bagCount(){return this.bags.size}exists(){return!!jr(Oh)}snapshot(){let t=this.game,e=i=>({owned:i.owned,ammo:Object.fromEntries(Object.entries(i.ammo).map(([n,s])=>[n,s===1/0?-1:s])),weapon:i.weapon,armor:i.armor});return{v:1,money:t.money,stats:t.stats,missions:t.missions.done,time:t.env.time,gordopin:e(t.gordopin),petroca:e(t.petroca),companion:t.companionActive,bags:[...this.bags],jumps:[...t.activities.jumpsDone],date:new Date().toISOString()}}save(){let t=this.snapshot();return xl(Oh,JSON.stringify(t))}load(){let t=jr(Oh);if(!t)return!1;let e;try{e=JSON.parse(t)}catch{return!1}return this.apply(e),!0}apply(t){let e=this.game;e.money=t.money||0,Object.assign(e.stats,t.stats||{}),e.missions.done=t.missions||[],e.env.time=t.time||540;let i=(r,o)=>{if(o){r.owned=o.owned||["punos"],r.ammo={};for(let[l,c]of Object.entries(o.ammo||{}))r.ammo[l]=c<0?1/0:c;r.ammo.punos=1/0,r.armor=o.armor||0,r.setWeapon(r.owned.includes(o.weapon)?o.weapon:"punos")}};i(e.gordopin,t.gordopin),i(e.petroca,t.petroca),this.bags=new Set(t.bags||[]),e.activities.jumpsDone=new Set(t.jumps||[]),e.pickups.refreshBags();let n=js.casa,s=e.city.markers.casaAbuela||n;e.gordopin.pos.set(s.x+3,e.world.footGround(s.x+3,s.z),s.z),e.player=e.gordopin,e.companion=e.petroca,e.gordopin.isPlayer=!0,e.petroca.isPlayer=!1,t.companion&&e.setCompanionActive(!0,s.x+4,s.z+2),e.activities.updateBody(),e.missions.refresh()}};var ue=(a,t,e,i)=>{let n=document.createElement(a);return t&&(n.className=t),i!==void 0&&(n.innerHTML=i),e&&e.appendChild(n),n};function pv(a){let t=document.createElement("canvas");t.width=64,t.height=64;let e=t.getContext("2d");e.translate(32,32),e.fillStyle="#e8e8e8",e.strokeStyle="#111",e.lineWidth=2;let i=n=>{e.beginPath(),n(),e.fill(),e.stroke()};if(a==="punos"){i(()=>{e.roundRect(-14,-10,26,20,5)}),e.fillStyle="#c9a07a",i(()=>{e.roundRect(-14,-10,26,20,5)}),e.strokeStyle="#6a4a30";for(let n=-8;n<=8;n+=6)e.beginPath(),e.moveTo(n,-10),e.lineTo(n,2),e.stroke()}else a==="clavas"?(e.rotate(-.6),i(()=>{e.ellipse(0,-6,7,16,0,0,Math.PI*2)}),e.fillStyle="#1c2f6b",e.fillRect(-7,-4,14,5),e.fillStyle="#e8e8e8",i(()=>{e.rect(-3,8,6,16)})):a==="bate"?(e.rotate(-.7),e.fillStyle="#b07a44",i(()=>{e.moveTo(-3,24),e.lineTo(3,24),e.lineTo(7,-24),e.lineTo(-7,-24),e.closePath()})):a==="pistola"?(e.fillStyle="#2a2a2a",i(()=>{e.rect(-18,-10,34,10)}),i(()=>{e.moveTo(4,0),e.lineTo(14,0),e.lineTo(10,16),e.lineTo(2,16),e.closePath()})):a==="escopeta"?(e.fillStyle="#2a2a2a",i(()=>{e.rect(-28,-5,40,6)}),e.fillStyle="#7a5030",i(()=>{e.moveTo(10,-6),e.lineTo(28,-2),e.lineTo(28,8),e.lineTo(10,3),e.closePath()})):a==="uzi"&&(e.fillStyle="#2a2a2a",i(()=>{e.rect(-18,-8,30,10)}),i(()=>{e.rect(-4,2,7,18)}));return t.toDataURL()}var $l=class{constructor(t){this.game=t;let e=ue("div","hud",document.body);this.root=e;let i=ue("div","hud-tr",e),n=ue("div","hud-row",i);this.weapon=ue("div","hud-weapon",n),this.weaponImg=ue("img","",this.weapon),this.ammo=ue("div","hud-ammo",this.weapon);let s=ue("div","hud-col",n);this.clock=ue("div","hud-clock",s,"12:00"),this.armorBar=ue("div","hud-bar armor",s,"<i></i>"),this.healthBar=ue("div","hud-bar health",s,"<i></i>"),this.breathBar=ue("div","hud-bar breath",s,"<i></i>"),this.money=ue("div","hud-money",i,"$00000000"),this.stars=ue("div","hud-stars",i),this.starEls=[];for(let r=0;r<6;r++)this.starEls.push(ue("span","star",this.stars,"\u2605"));this.counters=ue("div","hud-counters",i),this.radarWrap=ue("div","hud-radar",e),this.radar=ue("canvas","",this.radarWrap),this.radar.width=200,this.radar.height=200,this.rctx=this.radar.getContext("2d"),this.zone=ue("div","hud-zone",e),this.vname=ue("div","hud-vname",e),this.radio=ue("div","hud-radio",e),this.help=ue("div","hud-help",e),this.sub=ue("div","hud-sub",e),this.big=ue("div","hud-big",e),this.bigSub=ue("div","hud-bigsub",e),this.title=ue("div","hud-title",e),this.cross=ue("div","hud-cross",e),this.bars=ue("div","hud-letterbox",e,"<div></div><div></div>"),this.fade=ue("div","hud-fade",e),this.toast=ue("div","hud-toast",e),this.charTag=ue("div","hud-char",e),this.prompt=ue("div","hud-prompt",e),this.timers={},this.helpQueue=[],this.lastWeapon=null,this.zoneName="",this.buildMapImage()}buildMapImage(){let t=this.game,e=2.5,i=Math.ceil((Ot.maxX-Ot.minX)/e),n=Math.ceil((Ot.maxZ-Ot.minZ)/e),s=document.createElement("canvas");s.width=i,s.height=n;let r=s.getContext("2d"),o=r.createImageData(i,n),l=t.terrain;for(let u=0;u<n;u++){let d=Ot.minZ+u*e;for(let f=0;f<i;f++){let m=Ot.minX+f*e,x=l.heightAt(m,d),g,p,y;if(x<-.3){let v=lt(-x/12,0,1);g=70-v*25,p=104-v*30,y=140-v*25}else if(x<2.5&&m>nn(d)-70)g=196,p=186,y=150;else{let v=lt(x/100,0,1);g=150-v*20,p=146-v*16,y=118-v*20}let M=(u*i+f)*4;o.data[M]=g,o.data[M+1]=p,o.data[M+2]=y,o.data[M+3]=255}}r.putImageData(o,0,0);let c=u=>(u-Ot.minX)/e,h=u=>(u-Ot.minZ)/e;r.fillStyle="rgba(95,92,84,0.55)";for(let u of t.city.blocks)r.fillRect(c(u.x0),h(u.z0),(u.x1-u.x0)/e,(u.z1-u.z0)/e);for(let u of t.city.plazas)r.fillStyle="rgba(80,120,60,0.9)",r.fillRect(c(u.x0),h(u.z0),(u.x1-u.x0)/e,(u.z1-u.z0)/e);r.lineCap="round";for(let u of[0,1])for(let d of t.roads.edges){let f=t.roads.nodes[d.a],m=t.roads.nodes[d.b],x=d.kind==="tierra";r.strokeStyle=u===0?"rgba(40,40,40,0.7)":x?"#b8a07a":d.kind==="ruta"?"#f0e6c0":"#dcd8cc",r.lineWidth=d.width/e*(u===0?1.5:1)+(u===0?1:0),r.beginPath(),r.moveTo(c(f.x),h(f.z)),r.lineTo(c(m.x),h(m.z)),r.stroke()}this.mapImg=s,this.mapScale=e}w2m(t,e){return[(t-Ot.minX)/this.mapScale,(e-Ot.minZ)/this.mapScale]}showZone(t){t!==this.zoneName&&(this.zoneName=t,this.zone.textContent=t,this.zone.classList.remove("show"),this.zone.offsetWidth,this.zone.classList.add("show"))}showVehicleName(t){this.vname.textContent=t,this.vname.classList.remove("show"),this.vname.offsetWidth,this.vname.classList.add("show")}showRadio(t){let e=this.game;this.radio.textContent=t,this.radio.style.color=e.audio?e.audio.stationColor(e.player.vehicle?e.player.vehicle.radio:0):"#fff",this.radio.classList.remove("show"),this.radio.offsetWidth,this.radio.classList.add("show")}showHelp(t,e=6){this.help.innerHTML=t,this.help.classList.add("show"),this.helpT=e}hideHelp(){this.help.classList.remove("show"),this.helpT=0}subtitle(t,e=4){this.sub.innerHTML=t,this.sub.classList.add("show"),this.subT=e}clearSubtitle(){this.sub.classList.remove("show"),this.subT=0}bigText(t,e="",i=4,n=""){this.big.textContent=t,this.big.className="hud-big show "+n,this.bigSub.innerHTML=e,this.bigSub.className="hud-bigsub show "+n,this.bigT=i}missionTitle(t,e=4){this.title.textContent=t,this.title.classList.add("show"),this.titleT=e}showToast(t,e=3){this.toast.innerHTML=t,this.toast.classList.add("show"),this.toastT=e}letterbox(t){this.bars.classList.toggle("on",!!t),this.root.classList.toggle("cinema",!!t)}fadeTo(t,e=.6){return this.fade.style.transition=`opacity ${e}s`,this.fade.style.opacity=t?1:0,new Promise(i=>setTimeout(i,e*1e3))}setCounter(t,e,i,n=!1){let s=this.timers[t];s||(s=ue("div","hud-counter",this.counters,'<span class="lbl"></span><span class="val"></span>'),this.timers[t]=s),s.querySelector(".lbl").textContent=e;let r=s.querySelector(".val");n?r.innerHTML=`<b class="cbar"><i style="width:${lt(i,0,1)*100}%"></i></b>`:r.textContent=i}removeCounter(t){this.timers[t]&&(this.timers[t].remove(),delete this.timers[t])}clearCounters(){for(let t in this.timers)this.removeCounter(t)}setPrompt(t){t?(this.prompt.innerHTML=t,this.prompt.classList.add("show")):this.prompt.classList.remove("show")}update(t){let e=this.game,i=e.player;if(!i)return;this.clock.textContent=e.env.clockString();let n=lt(i.health/i.maxHealth,0,1);this.healthBar.firstChild.style.width=n*100+"%",this.healthBar.classList.toggle("low",n<.25),this.armorBar.style.visibility=i.armor>0?"visible":"hidden",this.armorBar.firstChild.style.width=lt(i.armor,0,100)+"%";let s=i.gait===2&&i.stamina<99||i.swimming;this.breathBar.style.visibility=s?"visible":"hidden",this.breathBar.firstChild.style.width=lt(i.stamina,0,100)+"%",this.shownMoney=this.shownMoney===void 0?e.money:this.shownMoney;let r=e.money-this.shownMoney;Math.abs(r)>0&&(this.shownMoney+=Math.sign(r)*Math.max(1,Math.ceil(Math.abs(r)*t*4))),Math.abs(e.money-this.shownMoney)<2&&(this.shownMoney=e.money),this.money.textContent=Jr(this.shownMoney),this.money.classList.toggle("neg",e.money<0);let o=e.police?e.police.level:0,l=e.police&&e.police.flashing&&Math.floor(performance.now()/300)%2;this.starEls.forEach((u,d)=>{u.classList.toggle("on",d<o&&!l),u.classList.toggle("dim",d>=o)}),this.stars.style.visibility=o>0||e.police&&e.police.showEmpty?"visible":"hidden",i.weapon!==this.lastWeapon&&(this.lastWeapon=i.weapon,this.weaponImg.src=pv(i.weapon));let c=se[i.weapon];this.ammo.textContent=c&&!c.melee?String(i.ammo[i.weapon]||0):"",this.cross.classList.toggle("show",!!i.aiming);let h=(u,d)=>{this[u]>0&&(this[u]-=t,this[u]<=0&&d.classList.remove("show"))};h("helpT",this.help),h("subT",this.sub),h("bigT",this.big),h("titleT",this.title),h("toastT",this.toast),this.bigT>0||this.bigSub.classList.remove("show"),this.charTag.textContent=e.playerName?e.playerName():"",this.drawRadar()}drawRadar(){let t=this.game,e=this.rctx,i=200,n=96,s=t.player,r=s.vehicle?s.vehicle.pos.x:s.pos.x,o=s.vehicle?s.vehicle.pos.z:s.pos.z,l=s.vehicle?s.vehicle.speed:0,c=170+lt(l*6,0,150),h=n/c,u=t.cameraRig.yaw;e.clearRect(0,0,i,i),e.save(),e.beginPath(),e.arc(i/2,i/2,n,0,Math.PI*2),e.clip(),e.fillStyle="#46688c",e.fillRect(0,0,i,i),e.translate(i/2,i/2),e.rotate(Math.PI+u);let[d,f]=this.w2m(r,o),m=h*this.mapScale;e.scale(m,m),e.drawImage(this.mapImg,-d,-f),e.restore();let x=(C,L)=>{let z=C-r,P=L-o,D=z*Math.sin(u)+P*Math.cos(u);return[(z*-Math.cos(u)+P*Math.sin(u))*h,-D*h]},g=(C,L,z,P=!1,D=null)=>{let[O,k]=x(C,L),$=Math.hypot(O,k);if($>n-6){if(!P)return;O*=(n-6)/$,k*=(n-6)/$}let W=0;D!==null&&(W=D-s.pos.y),z(i/2+O,i/2+k,W)},p=(C,L,z="#fff")=>(P,D)=>{e.fillStyle=L,e.strokeStyle="#000",e.lineWidth=2,e.beginPath(),e.arc(P,D,8,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle=z,e.font="bold 11px Arial",e.textAlign="center",e.textBaseline="middle",e.fillText(C,P,D+.5)},y=(C,L=5)=>(z,P,D)=>{e.fillStyle=C,e.strokeStyle="#000",e.lineWidth=1.5,D>4?(e.beginPath(),e.moveTo(z,P-L),e.lineTo(z+L,P+L),e.lineTo(z-L,P+L),e.closePath(),e.fill(),e.stroke()):D<-4?(e.beginPath(),e.moveTo(z,P+L),e.lineTo(z+L,P-L),e.lineTo(z-L,P-L),e.closePath(),e.fill(),e.stroke()):(e.fillRect(z-L/2,P-L/2,L,L),e.strokeRect(z-L/2,P-L/2,L,L))};for(let C of t.blips||[]){if(C.hidden)continue;let L=C.letter?p(C.letter,C.bg||"#222",C.fg):y(C.color||"#ff0",C.size||6);g(C.x,C.z,L,C.edge,C.y!==void 0?C.y:null)}let M=performance.now();for(let C of t.peds)C===s||C.dead||C.removed||(C.blip?g(C.pos.x,C.pos.z,y(C.blip,5),C.blipEdge,C.pos.y):C.kind==="cana"&&C.brain&&C.brain.hostile&&g(C.pos.x,C.pos.z,y(Math.floor(M/250)%2?"#ff2020":"#2040ff",4)));for(let C of t.vehicles)C.dead||C.removed||(C.blip?g(C.pos.x,C.pos.z,y(C.blip,6),C.blipEdge,C.pos.y):C.type.police&&C.siren&&g(C.pos.x,C.pos.z,y(Math.floor(M/250)%2?"#ff2020":"#2040ff",5)));let[v,S]=x(r,o-1e4),b=Math.hypot(v,S),E=i/2+v/b*(n-2),_=i/2+S/b*(n-2);e.fillStyle="#fff",e.strokeStyle="#000",e.lineWidth=3,e.font="bold 13px Arial",e.textAlign="center",e.textBaseline="middle",e.strokeText("N",E,_),e.fillText("N",E,_);let R=(s.vehicle?s.vehicle.heading:s.heading)-u;e.save(),e.translate(i/2,i/2),e.rotate(-R),e.fillStyle="#fff",e.strokeStyle="#000",e.lineWidth=2,e.beginPath(),e.moveTo(0,-8),e.lineTo(6,7),e.lineTo(0,3),e.lineTo(-6,7),e.closePath(),e.fill(),e.stroke(),e.restore(),e.strokeStyle="#000",e.lineWidth=6,e.beginPath(),e.arc(i/2,i/2,n+1,0,Math.PI*2),e.stroke(),e.strokeStyle="#d8d8d8",e.lineWidth=2,e.beginPath(),e.arc(i/2,i/2,n+3.5,0,Math.PI*2),e.stroke()}show(t){this.root.style.display=t?"":"none"}};var hf={forward:["KeyW","ArrowUp"],back:["KeyS","ArrowDown"],left:["KeyA","ArrowLeft"],right:["KeyD","ArrowRight"],sprint:["Space"],handbrake:["Space"],jump:["ShiftLeft","ShiftRight"],walk:["KeyC"],enter:["KeyF","Enter"],fire:["mouse0","ControlLeft","ControlRight"],aim:["mouse2"],nextWeapon:["KeyE"],prevWeapon:["KeyQ"],horn:["KeyH"],radio:["KeyR"],pause:["Escape"],map:[],switchChar:["Tab"],job:["Digit2"],yes:["KeyY"],no:["KeyN"],camera:["KeyV"],lookBack:["KeyX"],action:["KeyG"]},Zl=class{constructor(t){this.canvas=t,this.down=new Set,this.pressed=new Set,this.mdx=0,this.mdy=0,this.wheel=0,this.typed="",this.locked=!1,this.touch={x:0,y:0,active:!1,buttons:new Set,pressed:new Set,lookX:0,lookY:0},this.lastMouseMove=0,this.enabled=!0,this.pad=null,this.padPrev={},this.sensitivity=1,this.invertY=!1,window.addEventListener("keydown",e=>{(e.code==="Tab"||e.code==="Space"||e.code.startsWith("Arrow"))&&e.preventDefault(),this.down.has(e.code)||this.pressed.add(e.code),this.down.add(e.code),e.key&&e.key.length===1&&/[a-zA-Z0-9]/.test(e.key)&&(this.typed=(this.typed+e.key.toUpperCase()).slice(-24),this.onType&&this.onType(this.typed))}),window.addEventListener("keyup",e=>{this.down.delete(e.code)}),window.addEventListener("blur",()=>{this.down.clear()}),t.addEventListener("mousedown",e=>{let i="mouse"+e.button;if(this.down.has(i)||this.pressed.add(i),this.down.add(i),!this.locked&&this.wantLock&&!this.isTouch)try{let n=t.requestPointerLock();n&&n.catch&&n.catch(()=>{})}catch{}}),window.addEventListener("mouseup",e=>{this.down.delete("mouse"+e.button)}),t.addEventListener("contextmenu",e=>e.preventDefault()),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===t}),window.addEventListener("mousemove",e=>{this.locked?(this.mdx+=e.movementX,this.mdy+=e.movementY,this.lastMouseMove=performance.now()):(this.down.has("mouse0")||this.down.has("mouse2")||this.dragLook)&&e.target===t&&(this.mdx+=e.movementX,this.mdy+=e.movementY,this.lastMouseMove=performance.now())}),t.addEventListener("wheel",e=>{this.wheel+=Math.sign(e.deltaY),e.preventDefault()},{passive:!1}),window.addEventListener("gamepadconnected",()=>{this.hasPad=!0})}is(t){let e=hf[t];if(e){for(let i of e)if(this.down.has(i))return!0}return!!(this.touch.buttons.has(t)||this.padDown&&this.padDown[t])}was(t){let e=hf[t];if(e){for(let i of e)if(this.pressed.has(i))return!0}return!!(this.touch.pressed.has(t)||this.padPressed&&this.padPressed[t])}axis(){let t=0,e=0;this.is("forward")&&(e+=1),this.is("back")&&(e-=1),this.is("right")&&(t+=1),this.is("left")&&(t-=1),this.touch.active&&(t+=this.touch.x,e+=this.touch.y),this.padAxis&&(t+=this.padAxis.x,e+=this.padAxis.y);let i=Math.hypot(t,e);return i>1&&(t/=i,e/=i),{x:t,y:e}}pollPad(){let t=navigator.getGamepads?navigator.getGamepads():[],e=t&&[...t].find(o=>o);if(this.padDown=null,this.padPressed=null,this.padAxis=null,this.padLook=null,this.padTriggers=null,!e)return;let i=o=>Math.abs(o)<.18?0:o;this.padAxis={x:i(e.axes[0]||0),y:-i(e.axes[1]||0)},this.padLook={x:i(e.axes[2]||0),y:i(e.axes[3]||0)};let n=o=>e.buttons[o]&&e.buttons[o].pressed,s=o=>e.buttons[o]?e.buttons[o].value:0;this.padTriggers={gas:s(7),brake:s(6)};let r={sprint:n(0),handbrake:n(5),jump:n(2),enter:n(3),fire:n(7)&&!this.inVehicle||n(1),aim:n(6)&&!this.inVehicle,nextWeapon:n(5)&&!this.inVehicle,prevWeapon:n(4)&&!this.inVehicle,horn:n(10),radio:n(12)||n(13),pause:n(9),map:n(8),switchChar:n(11),job:n(14),yes:n(15),no:n(14),camera:n(12)};this.padPressed={};for(let o in r)r[o]&&!this.padPrev[o]&&(this.padPressed[o]=!0);this.padDown=r,this.padPrev=r}consumeLook(){let t=this.mdx*.0022*this.sensitivity,e=this.mdy*.0022*this.sensitivity;return this.mdx=0,this.mdy=0,t+=this.touch.lookX*.006,e+=this.touch.lookY*.006,this.touch.lookX=0,this.touch.lookY=0,this.padLook&&(t+=this.padLook.x*.05,e+=this.padLook.y*.04),this.invertY&&(e=-e),{x:t,y:e}}endFrame(){this.pressed.clear(),this.touch.pressed.clear(),this.wheel=0}};var nr=(a,t,e,i)=>{let n=document.createElement(a);return t&&(n.className=t),i!==void 0&&(n.innerHTML=i),e&&e.appendChild(n),n};var Jl=class{constructor(t){this.game=t,this.attract=!1,this.buildMain(),this.buildPause(),this.buildMap(),this.choiceEl=null}buildMain(){let t=this.game,e=nr("div","screen menu mainmenu",document.body);e.hidden=!0,e.innerHTML=`
      <div class="logo"><span class="gta">GTA</span><span class="sj">San Jorge</span><span class="tag">Comodoro Rivadavia \xB7 2004</span></div>
      <div class="panel">
        <button data-a="continue">Continuar</button>
        <button data-a="new">Nueva partida</button>
        <button data-a="options">Opciones</button>
        <button data-a="controls">Controles</button>
        <button data-a="credits">Cr\xE9ditos</button>
      </div>
      <div class="hint">Protagonizado por el Gordopin y el Petroca \xB7 Un juego de fans, hecho con cari\xF1o y viento</div>`,e.style.background="linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.7))",e.querySelectorAll("button").forEach(i=>i.addEventListener("click",()=>this.mainAction(i.dataset.a))),this.main=e}showMain(){let t=this.game;this.main.hidden=!1,this.attract=!0,t.paused=!0;let e=this.main.querySelector("[data-a=continue]");e.hidden=!t.saves.exists(),t.hud.show(!1),setTimeout(()=>{let i=this.main.querySelector("button:not([hidden])");i&&i.focus()},50)}async mainAction(t){let e=this.game;if(e.audio.init(),t==="new"||t==="continue"){if(t==="new"&&e.saves.exists()&&await this.choice("\xBFEmpezar de nuevo?",["S\xED, nueva partida","No"],"Tu partida guardada se va a mantener hasta que guardes de nuevo.")!==0)return;this.main.hidden=!0,this.attract=!1,e.hud.show(!0),e.input.wantLock=!0,e.started=!0,e.paused=!1,t==="continue"?(e.saves.load(),e.hud.showToast("Partida cargada",2),e.cameraRig.snapBehind(Math.PI/2)):e.missions.startIntro();return}t==="options"&&this.openPane("options",this.main),t==="controls"&&this.openPane("controls",this.main),t==="credits"&&this.openPane("credits",this.main)}buildPause(){let t=nr("div","screen menu pause",document.body);t.hidden=!0,t.innerHTML=`<h2>Pausa</h2><div class="panel">
      <button data-a="resume">Seguir jugando</button>
      <button data-a="map">Mapa</button>
      <button data-a="stats">Estad\xEDsticas</button>
      <button data-a="brief">\xDAltima misi\xF3n</button>
      <button data-a="options">Opciones</button>
      <button data-a="controls">Controles</button>
      <button data-a="quit">Salir al men\xFA</button></div>
      <div class="hint">Para guardar, and\xE1 a la Casa de la Abuela (marcador verde).</div>`,t.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>this.pauseAction(e.dataset.a))),this.pause=t}openPauseMenu(){let t=this.game;if(!(!t.started||t.respawning)){t.paused=!0,this.pause.hidden=!1,this.pauseOpenedAt=t.time,t.input.pressed.clear(),t.audio.stopRadio();try{document.exitPointerLock&&document.exitPointerLock()}catch{}setTimeout(()=>this.pause.querySelector("button").focus(),30)}}resume(){let t=this.game;this.pause.hidden=!0,this.mapEl.hidden=!0,t.paused=!1;let e=t.player.vehicle;e&&!e.type.bike&&t.audio.startRadio(e.radio),t.last=performance.now()}async pauseAction(t){let e=this.game;t==="resume"&&this.resume(),t==="map"&&this.openMap(),t==="stats"&&this.openPane("stats",this.pause),t==="brief"&&this.openPane("brief",this.pause),t==="options"&&this.openPane("options",this.pause),t==="controls"&&this.openPane("controls",this.pause),t==="quit"&&await this.choice("\xBFSalir al men\xFA principal?",["S\xED","No"],"Lo que no guardaste en la Casa de la Abuela se pierde.")===0&&location.reload()}checkInGameKeys(){let t=this.game,e=t.input;this.choiceEl||t.activities.mini||(e.was("pause")?this.openPauseMenu():e.was("map")&&(this.openPauseMenu(),this.openMap()))}update(t){let i=this.game.input;this.mapEl.hidden||((i.was("pause")||i.was("map"))&&(this.mapEl.hidden=!0,this.mapFromGame?this.resume():this.pause.hidden=!1,i.pressed.clear()),this.drawMap()),this.paneEl&&i.was("pause")&&(this.closePane(),i.pressed.clear()),!this.pause.hidden&&this.mapEl.hidden&&!this.paneEl&&!this.choiceEl&&i.was("pause")&&this.resume()}openPane(t,e){let i=this.game;this.closePane();let n=nr("div","screen menu",document.body),s="";if(t==="controls")s=`<h2>Controles</h2><div class="pane"><table>
        <tr><td>Moverse / Manejar</td><td><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> o flechas</td></tr>
        <tr><td>C\xE1mara</td><td>Mouse (hac\xE9 clic para capturarlo)</td></tr>
        <tr><td>Correr / Freno de mano</td><td><kbd>Espacio</kbd></td></tr>
        <tr><td>Saltar / Saltito en bici</td><td><kbd>Shift</kbd></td></tr>
        <tr><td>Caminar despacio</td><td><kbd>C</kbd></td></tr>
        <tr><td>Subir / bajar del auto</td><td><kbd>F</kbd> o <kbd>Enter</kbd></td></tr>
        <tr><td>Golpear / disparar</td><td>Clic izquierdo o <kbd>Ctrl</kbd></td></tr>
        <tr><td>Apuntar</td><td>Clic derecho</td></tr>
        <tr><td>Cambiar arma</td><td><kbd>Q</kbd> <kbd>E</kbd> o ruedita</td></tr>
        <tr><td>Bocina / sirena</td><td><kbd>H</kbd></td></tr>
        <tr><td>Cambiar radio</td><td><kbd>R</kbd> o ruedita (manejando)</td></tr>
        <tr><td>Cambiar de personaje</td><td><kbd>TAB</kbd> (Gordopin \u21C4 Petroca)</td></tr>
        <tr><td>Trabajo de remisero</td><td><kbd>2</kbd> arriba de un rem\xEDs</td></tr>
        <tr><td>Mirar atr\xE1s</td><td><kbd>X</kbd></td></tr>
        <tr><td>C\xE1mara cerca/lejos</td><td><kbd>V</kbd></td></tr>
        <tr><td>Pausa y mapa</td><td><kbd>Esc</kbd></td></tr>
        <tr><td>Joystick</td><td>Stick izq. moverse \xB7 stick der. c\xE1mara \xB7 RT/LT acelerar/frenar \xB7 A correr \xB7 X saltar \xB7 Y subir</td></tr>
        <tr><td>Celular</td><td>Joystick en pantalla, botones a la derecha y desliz\xE1 para girar la c\xE1mara</td></tr>
        </table></div>`;else if(t==="options"){let r=i.settings;s=`<h2>Opciones</h2><div class="pane">
        <label>Filtro PS2 (estela y colores de \xE9poca) <input type="checkbox" id="o-ps2" ${r.ps2?"checked":""}></label>
        <label>Calidad de imagen <select id="o-q"><option value="0.6">Baja</option><option value="0.8">Media</option><option value="1">Alta</option></select></label>
        <label>Volumen de la radio <input type="range" id="o-music" min="0" max="1" step="0.05" value="${r.music}"></label>
        <label>Volumen de efectos <input type="range" id="o-sfx" min="0" max="1" step="0.05" value="${r.sfx}"></label>
        <label>Sensibilidad del mouse <input type="range" id="o-sens" min="0.3" max="2.5" step="0.1" value="${r.sens}"></label>
        <label>Invertir eje vertical <input type="checkbox" id="o-inv" ${r.invertY?"checked":""}></label>
        <label>Voces sintetizadas (radio y di\xE1logos) <input type="checkbox" id="o-tts" ${r.tts?"checked":""}></label>
        <label>Controles t\xE1ctiles <select id="o-touch"><option value="auto">Autom\xE1tico</option><option value="on">Siempre</option><option value="off">Nunca</option></select></label>
      </div>`}else if(t==="stats"){let r=i.stats,o=(c,h)=>`<tr><td>${c}</td><td class="num">${h}</td></tr>`,l=Math.floor(r.timePlayed/60);s=`<h2>Estad\xEDsticas</h2><div class="pane"><table>
        ${o("Misiones superadas",`${i.missions.done.length} de ${i.missions.list.length}`)}
        ${o("Plata",Jr(i.money))}
        ${o("Grasa (Gordopin)",r.fat.toFixed(0)+"%")}
        ${o("M\xFAsculo",r.muscle.toFixed(0)+"%")}
        ${o("Resistencia",r.stamina.toFixed(0)+"%")}
        ${o("Respeto en el barrio",r.respect.toFixed(0)+"%")}
        ${o("Autos afanados",r.carsStolen)}
        ${o("Gente eliminada",r.pedsKilled)}
        ${o("Veces que te hicieron bolsa",r.deaths)}
        ${o("Veces que ca\xEDste en cana",r.arrests)}
        ${o("Bolsitas de La An\xF3mala",`${r.bags} de 24`)}
        ${o("Saltos \xFAnicos",`${r.jumps} de 6`)}
        ${o("Viajes de rem\xEDs",r.fares)}
        ${o("Mejor sesi\xF3n de malabares","$"+r.juggleBest)}
        ${o("Plata ganada en total",Jr(r.cashEarned))}
        ${o("Tiempo jugado",`${Math.floor(l/60)} h ${l%60} min`)}
        </table></div>`}else if(t==="brief"){let r=i.missions;s=`<h2>\xDAltima misi\xF3n</h2><div class="pane">${r.lastBrief||"Todav\xEDa no arrancaste ninguna misi\xF3n."}<br><br><b>Pr\xF3xima:</b> ${r.nextHint()}</div>`}else t==="credits"&&(s=`<h2>Cr\xE9ditos</h2><div class="pane">
        <p><b>GTA: San Jorge</b> es un juego de fans, gratuito, inspirado en <i>Grand Theft Auto: San Andreas</i> (Rockstar Games, 2004). No est\xE1 afiliado ni respaldado por Rockstar.</p>
        <p>El mapa es una versi\xF3n libre y comprimida de <b>Comodoro Rivadavia</b>: el Cerro Chenque, el Centro, la Costanera, el Puerto, el Km 3, los barrios, Rada Tilly, Punta del Marqu\xE9s y la meseta con sus cig\xFCe\xF1as.</p>
        <p><b>El Gordopin</b>: malabarista de sem\xE1foro e hincha del Lobo (Club Atl\xE9tico Jorge Newbery). "A m\xED no me van a sacar nunca de la calle".</p>
        <p><b>El Petroca</b>: petrolero con guita, anteojos negros, camisa de jean y botas. "\xA1Buena petroca!"</p>
        <p>Personajes, empresas y situaciones son ficticios o par\xF3dicos. Todo el sonido y la m\xFAsica se generan en tiempo real.</p>
        <p>Hecho con Three.js. Aguante Comodoro.</p></div>`);if(n.innerHTML=s+'<div class="row-btns"><button data-a="back">Volver</button></div>',n.querySelector("[data-a=back]").addEventListener("click",()=>this.closePane()),t==="options"){let r=i.settings,o=n.querySelector("#o-q");o.value=String(r.quality>=1?1:r.quality>=.8?.8:.6);let l=n.querySelector("#o-touch");l.value=r.touch;let c=()=>{r.ps2=n.querySelector("#o-ps2").checked,r.quality=parseFloat(o.value),r.music=parseFloat(n.querySelector("#o-music").value),r.sfx=parseFloat(n.querySelector("#o-sfx").value),r.sens=parseFloat(n.querySelector("#o-sens").value),r.invertY=n.querySelector("#o-inv").checked,r.tts=n.querySelector("#o-tts").checked,r.touch=l.value,i.applySettings(),i.saveSettings()};n.querySelectorAll("input,select").forEach(h=>h.addEventListener("change",c))}this.paneEl=n,this.paneBack=e,setTimeout(()=>n.querySelector("[data-a=back]").focus(),30)}closePane(){this.paneEl&&(this.paneEl.remove(),this.paneEl=null)}choice(t,e,i=""){let n=this.game;return new Promise(s=>{this.choiceEl&&this.choiceEl.remove();let r=n.controlsLocked;n.controlsLocked=!0;let o=nr("div","choice",document.body);o.innerHTML=`<h3>${t}</h3>${i?`<p>${i}</p>`:""}<div class="opts"></div>`;let l=o.querySelector(".opts"),c=u=>{window.removeEventListener("keydown",h,!0),o.remove(),this.choiceEl=null,n.controlsLocked=r,n.input.pressed.clear(),s(u)};e.forEach((u,d)=>{nr("button","",l,`<kbd>${d+1}</kbd> ${u}`).addEventListener("click",()=>c(d))});let h=u=>{let d=parseInt(u.key,10);d>=1&&d<=e.length?(u.preventDefault(),u.stopPropagation(),c(d-1)):u.key==="Escape"?(u.preventDefault(),u.stopPropagation(),c(-1)):u.key==="y"||u.key==="Y"?/^S[íi]/.test(e[0])&&c(0):(u.key==="n"||u.key==="N")&&e[1]==="No"&&c(1)};window.addEventListener("keydown",h,!0),this.choiceEl=o;try{document.exitPointerLock&&document.exitPointerLock()}catch{}setTimeout(()=>{let u=o.querySelector("button");u&&u.focus()},30)})}buildMap(){let t=nr("div","mapview",document.body);t.hidden=!0,t.innerHTML='<canvas></canvas><div class="maptitle">San Jorge</div><div class="legend"></div><div class="maphint">Arrastr\xE1 para mover \xB7 ruedita o pellizco para zoom \xB7 toc\xE1/clic para marcar destino \xB7 Esc para volver</div>',this.mapEl=t,this.mapCanvas=t.querySelector("canvas"),this.mapView={cx:0,cz:0,zoom:.35};let e=null,i=!1,n=this.mapCanvas;n.addEventListener("pointerdown",s=>{e={x:s.clientX,y:s.clientY,cx:this.mapView.cx,cz:this.mapView.cz},i=!1,n.setPointerCapture(s.pointerId)}),n.addEventListener("pointermove",s=>{if(!e)return;let r=s.clientX-e.x,o=s.clientY-e.y;Math.abs(r)+Math.abs(o)>5&&(i=!0),this.mapView.cx=e.cx-r/this.mapView.zoom,this.mapView.cz=e.cz-o/this.mapView.zoom}),n.addEventListener("pointerup",s=>{if(e&&!i){let r=n.getBoundingClientRect(),o=this.mapView.cx+(s.clientX-r.left-r.width/2)/this.mapView.zoom,l=this.mapView.cz+(s.clientY-r.top-r.height/2)/this.mapView.zoom;this.setWaypoint(o,l)}e=null}),n.addEventListener("wheel",s=>{s.preventDefault(),this.mapView.zoom=lt(this.mapView.zoom*(s.deltaY<0?1.15:.87),.12,3)},{passive:!1})}setWaypoint(t,e){let i=this.game;if(i.waypoint&&i.blips.splice(i.blips.indexOf(i.waypoint),1),i.waypoint&&Math.hypot(i.waypoint.x-t,i.waypoint.z-e)<30){i.waypoint=null;return}i.waypoint={x:t,z:e,color:"#ff40ff",size:8,edge:!0,waypoint:!0},i.blips.push(i.waypoint)}openMap(){let t=this.game;this.mapEl.hidden=!1,this.mapFromGame=this.pause.hidden,this.pause.hidden=!0;let e=t.player,i=e.vehicle?e.vehicle.pos:e.pos;this.mapView.cx=i.x,this.mapView.cz=i.z;let n=this.mapEl.querySelector(".legend"),s=new Set,r="";for(let o of t.blips)!o.legend||!o.name||s.has(o.name)||(s.add(o.name),r+=`<div><span style="background:${o.bg};color:${o.fg||"#fff"}">${o.letter}</span>${o.name}</div>`);r+='<div><span style="background:#ff40ff"></span>Destino marcado</div>',n.innerHTML=r}drawMap(){let t=this.game,e=this.mapCanvas,i=e.clientWidth,n=e.clientHeight;(e.width!==i||e.height!==n)&&(e.width=i,e.height=n);let s=e.getContext("2d"),r=this.mapView;s.fillStyle="#3a5a80",s.fillRect(0,0,i,n);let o=t.hud.mapScale,l=(p,y)=>[i/2+(p-r.cx)*r.zoom,n/2+(y-r.cz)*r.zoom],[c,h]=l(Ot.minX,Ot.minZ);s.imageSmoothingEnabled=!0,s.drawImage(t.hud.mapImg,c,h,t.hud.mapImg.width*o*r.zoom,t.hud.mapImg.height*o*r.zoom),s.font=`${Math.round(lt(r.zoom*40,10,22))}px 'Pirata One', Georgia, serif`,s.textAlign="center",s.fillStyle="rgba(255,255,255,0.85)",s.strokeStyle="rgba(0,0,0,0.8)",s.lineWidth=3;let u=[["Centro",200,90],["Cerro Chenque",150,-360],["Km 3",220,-760],["Km 5",230,-1045],["Km 8",230,-1310],["Caleta C\xF3rdova",320,-1690],["Puerto",420,460],["Pietrobelli",-240,60],["Juan XXIII",-600,60],["9 de Julio",-240,360],["30 de Octubre",-600,360],["Industrial",110,680],["Pueyrred\xF3n",-240,690],["Rada Tilly",140,1270],["Punta del Marqu\xE9s",520,1620],["Pampa del Castillo",-1180,-300],["Aeropuerto",-650,-1400],["Golfo San Jorge",800,0]];for(let[p,y,M]of u){let[v,S]=l(y,M);s.strokeText(p,v,S),s.fillText(p,v,S)}for(let p of t.blips){if(p.hidden)continue;let[y,M]=l(p.x,p.z);p.letter?(s.fillStyle=p.bg,s.strokeStyle="#000",s.lineWidth=2,s.beginPath(),s.arc(y,M,9,0,Math.PI*2),s.fill(),s.stroke(),s.fillStyle=p.fg||"#fff",s.font="bold 11px Arial",s.textBaseline="middle",s.fillText(p.letter,y,M+.5)):(s.fillStyle=p.color||"#ff0",s.strokeStyle="#000",s.lineWidth=2,s.fillRect(y-5,M-5,10,10),s.strokeRect(y-5,M-5,10,10))}let d=t.player,f=d.vehicle?d.vehicle.pos:d.pos,m=d.vehicle?d.vehicle.heading:d.heading,[x,g]=l(f.x,f.z);s.save(),s.translate(x,g),s.rotate(Math.PI-m),s.fillStyle="#fff",s.strokeStyle="#000",s.lineWidth=2,s.beginPath(),s.moveTo(0,-10),s.lineTo(7,8),s.lineTo(0,4),s.lineTo(-7,8),s.closePath(),s.fill(),s.stroke(),s.restore()}};var jl=class{constructor(t){this.game=t;let e="ontouchstart"in window||navigator.maxTouchPoints>0;this.isTouch=e;let i=document.createElement("div");i.className="touch",i.hidden=!0,i.innerHTML=`
      <div class="lookpad"></div>
      <div class="stick"><div class="knob"></div></div>
      <div class="btns"></div>
      <div class="top"><div class="btn" data-a="pause">\u275A\u275A</div><div class="btn" data-a="map">MAPA</div><div class="btn" data-a="switchChar">\u21C4</div><div class="btn" data-a="camera">C\xC1M</div></div>`,document.body.appendChild(i),this.root=i;let n=document.createElement("div");n.className="rotate-hint",n.textContent="Gir\xE1 el celular para jugar mejor \u{1F504}",document.body.appendChild(n),this.btns=i.querySelector(".btns"),this.mode=null;let s=t.input,r=i.querySelector(".stick"),o=i.querySelector(".knob"),l=null,c=null,h=p=>{let y=r.getBoundingClientRect(),M=y.left+y.width/2,v=y.top+y.height/2,S=(p.clientX-M)/(y.width/2),b=(p.clientY-v)/(y.height/2),E=Math.hypot(S,b);E>1&&(S/=E,b/=E),o.style.transform=`translate(${S*45}px, ${b*45}px)`,s.touch.x=S,s.touch.y=-b,s.touch.active=!0,(!t.player||!t.player.vehicle)&&(E>.95?s.touch.buttons.add("sprint"):s.touch.buttons.delete("sprint"))};r.addEventListener("pointerdown",p=>{l=p.pointerId,r.setPointerCapture(l),h(p),t.audio.init()}),r.addEventListener("pointermove",p=>{p.pointerId===l&&h(p)});let u=p=>{p.pointerId===l&&(l=null,o.style.transform="",s.touch.x=0,s.touch.y=0,s.touch.active=!1,s.touch.buttons.delete("sprint"))};r.addEventListener("pointerup",u),r.addEventListener("pointercancel",u);let d=i.querySelector(".lookpad"),f=null,m=0,x=0;d.addEventListener("pointerdown",p=>{f=p.pointerId,m=p.clientX,x=p.clientY,d.setPointerCapture(f)}),d.addEventListener("pointermove",p=>{p.pointerId===f&&(s.touch.lookX+=p.clientX-m,s.touch.lookY+=p.clientY-x,m=p.clientX,x=p.clientY,s.lastMouseMove=performance.now(),t.cameraRig.lastManual=performance.now())});let g=p=>{p.pointerId===f&&(f=null)};d.addEventListener("pointerup",g),d.addEventListener("pointercancel",g),i.querySelectorAll(".top .btn").forEach(p=>this.bindBtn(p)),this.setMode(t.settings.touch)}bindBtn(t){let e=this.game.input,i=t.dataset.a;t.addEventListener("pointerdown",s=>{s.preventDefault(),this.game.audio.init(),t.classList.add("on"),i==="gas"?e.touch.gas=!0:i==="brake"?e.touch.brake=!0:(e.touch.buttons.add(i),e.touch.pressed.add(i))});let n=()=>{t.classList.remove("on"),i==="gas"?e.touch.gas=!1:i==="brake"?e.touch.brake=!1:e.touch.buttons.delete(i)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("pointerleave",n)}layout(t){let e=t?"car":"foot";if(this.layoutKey===e)return;this.layoutKey=e;let i=this.game.input;i.touch.buttons.clear(),i.touch.gas=!1,i.touch.brake=!1;let n=t?[["horn","BOCINA"],["radio","RADIO"],["enter","BAJAR"],["handbrake","FRENO<br>MANO"],["brake","FRENO"],["gas","GAS"],["fire","TIRO"],["job","REM\xCDS"],["lookBack","ATR\xC1S"]]:[["nextWeapon","ARMA"],["aim","APUNTAR"],["enter","SUBIR"],["jump","SALTAR"],["sprint","CORRER"],["fire","GOLPE<br>TIRO"]];this.btns.innerHTML="";for(let[s,r]of n){let o=document.createElement("div");o.className="btn",o.dataset.a=s,o.innerHTML=r,this.btns.appendChild(o),this.bindBtn(o)}}setMode(t){this.mode=t;let e=t==="on"||t==="auto"&&this.isTouch;this.enabled=e,this.root.hidden=!e||!this.game.started,document.body.classList.toggle("is-touch",e),this.game.input.isTouch=e}update(){if(!this.enabled)return;let t=this.game,e=t.missions.active&&t.missions.active.inCutscene;this.root.hidden=!t.started||t.paused||!!t.activities.mini||!!t.menus.choiceEl||e||t.respawning,t.player&&this.layout(!!t.player.vehicle)}};var cs=[{name:"Radio Cumbia Villera 104.5",style:"cumbia",color:"#ff5fd0"},{name:"FM Rock del Golfo 98.3",style:"rock",color:"#ff8a2a"},{name:"Boliche FM 101.1",style:"electro",color:"#3ae8ff"},{name:"Radio Chacarera Patag\xF3nica",style:"folk",color:"#e8d23a"},{name:"Tango del Viento AM 1210",style:"tango",color:"#e84a4a"},{name:"Radio Chenque AM 740 (charla)",style:"talk",color:"#8aff6a"},{name:"Radio apagada",style:"off",color:"#aaaaaa"}],uf=["Buenas tardes Comodoro, son las noticias de Radio Chenque. Se esperan r\xE1fagas de ciento veinte kil\xF3metros por hora. Aten las bolsas.","El barril de petr\xF3leo sigue subiendo y en el Km 3 ya no quedan departamentos para alquilar.","Otra vez cortaron la Ruta 3 por un derrumbe en el Chenque. Se recomienda paciencia y mate.","Aviso: se perdi\xF3 un perro en Rada Tilly. Responde al nombre de Viento. Obvio.","Se viene el cl\xE1sico. Newbery y Hurac\xE1n paralizan la ciudad este domingo.","Un oyente pregunta si el viento de hoy es normal. S\xED, querido, es Comodoro.","La empresa Crudo S.A. anunci\xF3 nuevas perforaciones. Los vecinos del barrio 9 de Julio est\xE1n preocupados.","Est\xE1s escuchando Radio Chenque, la \xFAnica radio que se escucha aunque sople el viento."],Kl=class{constructor(){this.ctx=null,this.enabled=!1,this.radioIdx=-1,this.volMusic=.55,this.volSfx=.8,this.listener={x:0,y:0,z:0},this.useTTS=!1}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let e=new t;this.ctx=e,this.master=e.createGain(),this.master.gain.value=.9;let i=e.createDynamicsCompressor();i.threshold.value=-14,i.ratio.value=4,this.master.connect(i).connect(e.destination),this.sfx=e.createGain(),this.sfx.gain.value=this.volSfx,this.sfx.connect(this.master),this.music=e.createGain(),this.music.gain.value=this.volMusic;let n=e.createBiquadFilter();n.type="lowpass",n.frequency.value=6500,this.music.connect(n).connect(this.master),this.musicBus=e.createGain(),this.musicBus.connect(this.music);let s=e.sampleRate*2,r=e.createBuffer(1,s,e.sampleRate),o=r.getChannelData(0);for(let c=0;c<s;c++)o[c]=Math.random()*2-1;this.noiseBuf=r;let l=new Float32Array(1024);for(let c=0;c<1024;c++){let h=c/1023*2-1;l[c]=Math.tanh(h*6)}this.distCurve=l,this.setupWind(),this.setupEngine(),this.setupSiren(),this.enabled=!0}noise(t){let e=this.ctx.createBufferSource();return e.buffer=this.noiseBuf,e.loop=t>2,e.loopStart=Math.random(),e}posGain(t,e=120){if(!t)return 1;let i=Math.hypot(t.x-this.listener.x,(t.y||0)-this.listener.y,t.z-this.listener.z);return lt(1-i/e,0,1)**1.5}env(t,e,i,n,s){t.gain.setValueAtTime(1e-4,e),t.gain.linearRampToValueAtTime(n,e+i),t.gain.exponentialRampToValueAtTime(1e-4,e+i+s)}burst({t=null,dur:e=.2,freq:i=1e3,q:n=1,type:s="bandpass",gain:r=.5,pos:o=null,range:l=120,out:c=null,attack:h=.002}){if(!this.enabled)return;let u=this.ctx,d=this.posGain(o,l);if(d<=.001)return;t=t||u.currentTime;let f=this.noise(e),m=u.createBiquadFilter();m.type=s,m.frequency.value=i,m.Q.value=n;let x=u.createGain();this.env(x,t,h,r*d,e),f.connect(m).connect(x).connect(c||this.sfx),f.start(t,Math.random()*1.5,e+.1)}tone({t=null,freq:e=440,freq2:i=null,dur:n=.2,type:s="sine",gain:r=.3,pos:o=null,range:l=120,out:c=null,attack:h=.005,detune:u=0}){if(!this.enabled)return;let d=this.ctx,f=this.posGain(o,l);if(f<=.001)return;t=t||d.currentTime;let m=d.createOscillator();m.type=s,m.frequency.setValueAtTime(e,t),i&&m.frequency.exponentialRampToValueAtTime(Math.max(1,i),t+n),m.detune.value=u;let x=d.createGain();this.env(x,t,h,r*f,n),m.connect(x).connect(c||this.sfx),m.start(t),m.stop(t+h+n+.05)}gun(t,e){let i=t==="shotgun";this.burst({dur:i?.35:.16,freq:i?700:1500,q:.6,type:"lowpass",gain:i?1.1:.8,pos:e,range:220}),this.tone({freq:i?110:160,freq2:40,dur:i?.25:.12,type:"triangle",gain:.6,pos:e,range:220})}click(t){this.tone({freq:1800,dur:.03,type:"square",gain:.12,pos:t})}punch(t){this.burst({dur:.08,freq:300,type:"lowpass",gain:.8,pos:t}),this.tone({freq:90,freq2:50,dur:.1,gain:.5,pos:t})}swoosh(t){this.burst({dur:.15,freq:2500,q:2,gain:.15,pos:t,attack:.05})}thud(t,e=.5){this.burst({dur:.2,freq:200,type:"lowpass",gain:e,pos:t})}crash(t,e=.6){this.burst({dur:.35,freq:900,q:.5,type:"lowpass",gain:e,pos:t,range:150}),this.burst({dur:.25,freq:4e3,q:3,gain:e*.4,pos:t,range:150})}door(t){this.burst({dur:.1,freq:250,type:"lowpass",gain:.6,pos:t}),this.tone({freq:120,dur:.08,gain:.3,pos:t})}explosion(t){this.burst({dur:1.8,freq:400,type:"lowpass",q:.5,gain:1.4,pos:t,range:400}),this.tone({freq:70,freq2:25,dur:1.2,type:"sine",gain:1,pos:t,range:400})}splash(t){this.burst({dur:.5,freq:1200,q:.4,gain:.5,pos:t})}pickup(){[880,1320,1760].forEach((t,e)=>this.tone({t:this.ctx&&this.ctx.currentTime+e*.06,freq:t,dur:.12,type:"square",gain:.12}))}cash(){[1200,1600].forEach((t,e)=>this.tone({t:this.ctx&&this.ctx.currentTime+e*.05,freq:t,dur:.1,type:"triangle",gain:.2}))}beep(){this.tone({freq:1e3,dur:.07,type:"square",gain:.1})}step(t){this.burst({dur:.05,freq:600,type:"lowpass",gain:.08,pos:t,range:20})}missionPassed(){if(!this.enabled)return;let t=this.ctx.currentTime+.05,e=[[0,523,.18],[.18,659,.18],[.36,784,.18],[.54,1047,.5],[.54,659,.5],[.54,784,.5],[1.15,988,.15],[1.3,1047,.9],[1.3,784,.9],[1.3,523,.9]];for(let[i,n,s]of e)this.tone({t:t+i,freq:n,dur:s,type:"sawtooth",gain:.09,attack:.01}),this.tone({t:t+i,freq:n/2,dur:s,type:"square",gain:.05,attack:.01});[0,.54,1.3].forEach(i=>this.drum("kick",t+i,.9,this.sfx))}missionFailed(){if(!this.enabled)return;let t=this.ctx.currentTime+.05;[[0,392],[.3,370],[.6,349],[.9,262]].forEach(([e,i])=>this.tone({t:t+e,freq:i,dur:e>.8?.8:.28,type:"sawtooth",gain:.1}))}wasted(){if(!this.enabled)return;let t=this.ctx.currentTime;this.tone({t,freq:220,freq2:55,dur:2.5,type:"sawtooth",gain:.15}),this.drum("kick",t,1,this.sfx)}setupWind(){let t=this.ctx,e=this.noise(10);e.loop=!0;let i=t.createBiquadFilter();i.type="bandpass",i.frequency.value=500,i.Q.value=.7;let n=t.createGain();n.gain.value=0,e.connect(i).connect(n).connect(this.sfx),e.start(),this.wind={f:i,g:n}}setupEngine(){let t=this.ctx,e=t.createOscillator(),i=t.createOscillator();e.type="sawtooth",i.type="square";let n=t.createBiquadFilter();n.type="lowpass",n.frequency.value=400,n.Q.value=3;let s=t.createGain();s.gain.value=0,e.connect(n),i.connect(n),n.connect(s).connect(this.sfx),e.start(),i.start(),this.engine={o1:e,o2:i,f:n,g:s}}setupSiren(){let t=this.ctx,e=t.createOscillator();e.type="square";let i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=1800;let n=t.createGain();n.gain.value=0,e.connect(i).connect(n).connect(this.sfx),e.start(),this.siren={o:e,g:n}}horn(t,e){if(this.enabled){if(e&&!this.hornNode){let i=this.ctx,n=i.createGain();n.gain.value=.12;let s=i.createOscillator(),r=i.createOscillator();s.type=r.type="square";let o=t&&(t.type.style==="bus"||t.type.style==="tanker");s.frequency.value=o?180:t&&t.type.bike?1400:400,r.frequency.value=o?226:t&&t.type.bike?1400:500;let l=i.createBiquadFilter();l.type="lowpass",l.frequency.value=2500,s.connect(l),r.connect(l),l.connect(n).connect(this.sfx),s.start(),r.start(),this.hornNode={o1:s,o2:r,g:n}}else if(!e&&this.hornNode){let i=this.hornNode;i.g.gain.setTargetAtTime(0,this.ctx.currentTime,.02),i.o1.stop(this.ctx.currentTime+.1),i.o2.stop(this.ctx.currentTime+.1),this.hornNode=null}}}update(t,e){if(!this.enabled)return;let n=this.ctx.currentTime,s=e.camera.position;this.listener={x:s.x,y:s.y,z:s.z};let r=e.env,o=e.player,l=o&&o.vehicle&&!o.vehicle.type.bike,c=r.windSpeed,h=lt((c-4)/30,0,1)*(l?.25:.7)*(e.paused?0:1);this.wind.g.gain.setTargetAtTime(h*.55,n,.3),this.wind.f.frequency.setTargetAtTime(300+c*18+r.gust*300,n,.3);let u=o&&o.vehicle;if(u&&!u.dead&&!u.type.bike||u&&u.key==="enduro"){let m=Math.abs(u.forwardSpeed),x=Math.min(4,Math.floor(m/(u.type.maxSpeed/4.5))),g=(m-x*(u.type.maxSpeed/4.5))/(u.type.maxSpeed/4.5),p=u.key==="enduro"?70:u.type.style==="bus"||u.type.style==="tanker"?32:42,y=p+g*p*1.4+x*6+Math.abs(u.ctrl.throttle)*10;this.engine.o1.frequency.setTargetAtTime(y,n,.05),this.engine.o2.frequency.setTargetAtTime(y*.5,n,.05),this.engine.f.frequency.setTargetAtTime(300+Math.abs(u.ctrl.throttle)*700+g*400,n,.05),this.engine.g.gain.setTargetAtTime(e.paused?0:.09+Math.abs(u.ctrl.throttle)*.08,n,.08)}else this.engine.g.gain.setTargetAtTime(0,n,.1);let d=null,f=1e9;for(let m of e.vehicles){if(!m.siren||m.dead)continue;let x=Math.hypot(m.pos.x-s.x,m.pos.z-s.z);x<f&&(f=x,d=m)}if(d&&!e.paused){let m=performance.now()*.001%2;this.siren.o.frequency.setTargetAtTime(m<1?650+m*500:1150-(m-1)*500,n,.02),this.siren.g.gain.setTargetAtTime(lt(1-f/200,0,1)*.07,n,.1)}else this.siren.g.gain.setTargetAtTime(0,n,.1);this.scheduleRadio()}stationName(t){return cs[t]?cs[t].name:""}stationColor(t){return cs[t]?cs[t].color:"#fff"}startRadio(t){if(!this.enabled)return;this.stopRadio(),this.radioIdx=t;let e=cs[t];!e||e.style==="off"||(this.burst({dur:.35,freq:3e3,q:.3,gain:.25,out:this.musicBus}),this.bus=this.ctx.createGain(),this.bus.gain.value=1,this.bus.connect(this.musicBus),this.newSong(e),this.nextNote=this.ctx.currentTime+.3,this.step=0,e.style==="talk"&&this.talk())}stopRadio(){if(this.bus){let t=this.bus;t.gain.setTargetAtTime(0,this.ctx.currentTime,.05),setTimeout(()=>t.disconnect(),400)}if(this.bus=null,this.radioIdx=-1,this.talkTimer&&(clearTimeout(this.talkTimer),this.talkTimer=null),window.speechSynthesis)try{window.speechSynthesis.cancel()}catch{}}newSong(t){let e=Math.floor(Math.random()*1e9),i=new Oi(e),n={style:t.style,r:i,bar:0,bars:48+i.int(0,3)*8},s=[0,2,3,5,7,8,11],r=[0,2,4,5,7,9,11];t.style==="cumbia"&&(n.bpm=i.range(92,102),n.root=45+i.int(0,5),n.scale=s,n.prog=i.pick([[0,3,4,0],[0,6,5,4],[0,3,6,4]]),n.sub=4),t.style==="rock"&&(n.bpm=i.range(118,138),n.root=40+i.int(0,7),n.scale=i.chance(.5)?r:s,n.prog=i.pick([[0,4,5,3],[0,3,4,4],[5,3,0,4],[0,6,3,4]]),n.sub=4),t.style==="electro"&&(n.bpm=i.range(126,132),n.root=41+i.int(0,6),n.scale=s,n.prog=i.pick([[0,5,2,6],[0,0,5,6],[0,3,5,4]]),n.sub=4),t.style==="folk"&&(n.bpm=i.range(58,68),n.root=45+i.int(0,4),n.scale=s,n.prog=[0,3,4,0],n.sub=6),t.style==="tango"&&(n.bpm=i.range(112,122),n.root=43+i.int(0,5),n.scale=s,n.prog=i.pick([[0,4,4,0],[0,3,4,0],[0,5,3,4]]),n.sub=4),t.style==="talk"&&(n.bpm=90,n.root=48,n.scale=r,n.prog=[0,3,4,0],n.sub=4),n.motif=[];for(let o=0;o<16;o++)n.motif.push(i.chance(t.style==="tango"?.75:.6)?i.int(0,9):null);this.song=n}midi(t){return 440*Math.pow(2,(t-69)/12)}deg(t,e,i=0){let n=t.scale,s=Math.floor(e/7),r=(e%7+7)%7;return t.root+n[r]+12*(s+i)}drum(t,e,i,n){let s=this.ctx;if(n=n||this.bus,!!n)if(t==="kick"){let r=s.createOscillator(),o=s.createGain();r.frequency.setValueAtTime(130,e),r.frequency.exponentialRampToValueAtTime(40,e+.18),this.env(o,e,.002,.9*i,.28),r.connect(o).connect(n),r.start(e),r.stop(e+.35)}else if(t==="snare"||t==="clap")this.burst({t:e,dur:t==="clap"?.12:.16,freq:t==="clap"?1500:1900,q:.7,gain:.5*i,out:n}),t==="snare"&&this.tone({t:e,freq:190,freq2:150,dur:.08,type:"triangle",gain:.25*i,out:n});else if(t==="hat")this.burst({t:e,dur:.035,freq:8e3,type:"highpass",gain:.22*i,out:n});else if(t==="ohat")this.burst({t:e,dur:.18,freq:7500,type:"highpass",gain:.18*i,out:n});else if(t==="guiro")for(let r=0;r<3;r++)this.burst({t:e+r*.018,dur:.02,freq:3200,q:3,gain:.25*i,out:n});else t==="conga"?this.tone({t:e,freq:240*i,freq2:190*i,dur:.15,type:"sine",gain:.35,out:n}):t==="bombo"?(this.tone({t:e,freq:95,freq2:60,dur:.35,type:"sine",gain:.7*i,out:n}),this.burst({t:e,dur:.05,freq:800,type:"lowpass",gain:.3*i,out:n})):t==="aro"&&this.burst({t:e,dur:.03,freq:2500,q:2,gain:.35*i,out:n})}inst(t,e,i,n,s=1){let r=this.ctx,o=this.bus;if(!o)return;let l=this.midi(i);if(t==="bass"){let c=r.createOscillator();c.type="triangle",c.frequency.value=l;let h=r.createOscillator();h.type="sawtooth",h.frequency.value=l;let u=r.createBiquadFilter();u.type="lowpass",u.frequency.value=500;let d=r.createGain();this.env(d,e,.005,.35*s,n),c.connect(u),h.connect(u),u.connect(d).connect(o),c.start(e),h.start(e),c.stop(e+n+.1),h.stop(e+n+.1)}else if(t==="organ"||t==="lead"){let c=r.createOscillator();c.type=t==="organ"?"square":"sawtooth",c.frequency.value=l;let h=r.createOscillator();h.type="square",h.frequency.value=l*1.005;let u=r.createOscillator();u.frequency.value=5.5;let d=r.createGain();d.gain.value=l*.012,u.connect(d),d.connect(c.frequency),d.connect(h.frequency);let f=r.createBiquadFilter();f.type="lowpass",f.frequency.value=t==="organ"?2200:3e3;let m=r.createGain();this.env(m,e,.01,.075*s,n),c.connect(f),h.connect(f),f.connect(m).connect(o),[c,h,u].forEach(x=>{x.start(e),x.stop(e+n+.1)})}else if(t==="pluck"){let c=r.createOscillator();c.type="sawtooth",c.frequency.value=l;let h=r.createBiquadFilter();h.type="lowpass",h.Q.value=2,h.frequency.setValueAtTime(l*6,e),h.frequency.exponentialRampToValueAtTime(l*1.2,e+.25);let u=r.createGain();this.env(u,e,.002,.14*s,n),c.connect(h).connect(u).connect(o),c.start(e),c.stop(e+n+.1)}else if(t==="power"){let c=r.createBiquadFilter();c.type="lowpass",c.frequency.value=2600;let h=r.createWaveShaper();h.curve=this.distCurve;let u=r.createGain();this.env(u,e,.003,.07*s,n);for(let d of[0,7,12]){let f=r.createOscillator();f.type="sawtooth",f.frequency.value=this.midi(i+d),f.connect(h),f.start(e),f.stop(e+n+.1)}h.connect(c).connect(u).connect(o)}else if(t==="stab"){let c=r.createBiquadFilter();c.type="lowpass",c.Q.value=6,c.frequency.setValueAtTime(3500,e),c.frequency.exponentialRampToValueAtTime(400,e+n);let h=r.createGain();this.env(h,e,.003,.06*s,n);for(let u of[0,3,7,10]){let d=r.createOscillator();d.type="sawtooth",d.frequency.value=this.midi(i+u),d.connect(c),d.start(e),d.stop(e+n+.1)}c.connect(h).connect(o)}else if(t==="bandoneon"){let c=r.createOscillator();c.type="square",c.frequency.value=l;let h=r.createOscillator();h.type="sawtooth",h.frequency.value=l*2.002;let u=r.createBiquadFilter();u.type="bandpass",u.frequency.value=1400,u.Q.value=.8;let d=r.createGain();d.gain.setValueAtTime(1e-4,e),d.gain.linearRampToValueAtTime(.12*s,e+.06),d.gain.setValueAtTime(.12*s,e+n*.8),d.gain.linearRampToValueAtTime(1e-4,e+n),c.connect(u),h.connect(u),u.connect(d).connect(o),c.start(e),h.start(e),c.stop(e+n+.05),h.stop(e+n+.05)}else if(t==="piano"){let c=r.createOscillator();c.type="triangle",c.frequency.value=l;let h=r.createGain();this.env(h,e,.002,.12*s,n),c.connect(h).connect(o),c.start(e),c.stop(e+n+.1)}}scheduleRadio(){if(!this.bus||!this.song)return;let t=this.song,e=this.ctx,i=60/t.bpm,n=t.style==="folk"?i/2:i/4,s=t.style==="folk"?6:16;for(;this.nextNote<e.currentTime+.25;){let r=this.nextNote,o=this.step%s,l=Math.floor(this.step/s),c=t.prog[l%t.prog.length],h=t.r,u=l<2;if(l>=t.bars){this.newSong(cs[this.radioIdx]),this.step=0,this.nextNote+=i*2,this.jingle(this.nextNote-i*1.8);continue}let d=this.deg(t,c,0),f=t.motif[(o+l%2*8)%16];if(t.style==="cumbia")o%2===0&&this.drum("guiro",r,o%4===0?1:.6),(o===0||o===8)&&this.drum("kick",r,.6),(o===6||o===14)&&this.drum("conga",r,1.1),o===7&&this.drum("conga",r,.9),u||(o===0&&this.inst("bass",r,d-12,i*.9),o===6&&this.inst("bass",r,d-5,i*.4),o===8&&this.inst("bass",r,d-12+7,i*.9),o===14&&this.inst("bass",r,d-12,i*.4),o%4===2&&(this.inst("organ",r,d+12,i*.3,.5),this.inst("organ",r,this.deg(t,c+2,1),i*.3,.5)),f!==null&&o%2===0&&l%8>=2&&this.inst("lead",r,this.deg(t,f+(l%4===3?2:0),2),n*1.8,1));else if(t.style==="rock")(o===0||o===8||o===10&&h.chance(.5))&&this.drum("kick",r,.9),(o===4||o===12)&&this.drum("snare",r,1),o%2===0&&this.drum("hat",r,.8),(!u||o%4===0)&&(o%2===0&&this.inst("power",r,d-12,n*1.9,o%4===0?1:.7),o%2===0&&this.inst("bass",r,d-24,n*1.8),f!==null&&l%16>=8&&o%2===0&&this.inst("lead",r,this.deg(t,f,1),n*2,.9));else if(t.style==="electro")o%4===0&&this.drum("kick",r,1),o%4===2&&this.drum("ohat",r,.9),(o===4||o===12)&&this.drum("clap",r,.8),o%2===1&&this.drum("hat",r,.4),u||(o%4===2&&this.inst("bass",r,d-12,n*1.6),(o===0||o===6||o===12)&&this.inst("stab",r,d,n*2.5),f!==null&&l%8>=4&&this.inst("lead",r,this.deg(t,f,1),n,.7));else if(t.style==="folk"){o===0&&this.drum("bombo",r,1),(o===2||o===3)&&this.drum("aro",r,.8),o===5&&this.drum("bombo",r,.8);let m=[0,2,4].map(x=>this.deg(t,c+x,0));o===0&&this.inst("bass",r,d-12,i*1.2),o!==1&&this.inst("pluck",r,m[o%3]+(o>3?12:0),n*1.5,.9),f!==null&&!u&&l%8>=2&&this.inst("organ",r,this.deg(t,f,1),n*1.8,.5)}else t.style==="tango"?(o%4===0&&(this.inst("bass",r,d-12,i*.35,o===0?1.2:.9),[0,2,4].map(x=>this.deg(t,c+x,0)).forEach(x=>this.inst("piano",r,x+12,i*.3,.8))),o===14&&l%2===1&&this.inst("bass",r,d-13,i*.2,.7),!u&&f!==null&&o%2===0&&this.inst("bandoneon",r,this.deg(t,f,1),n*(o%4===0?2.8:1.6),1)):t.style==="talk"&&o===0&&this.inst("piano",r,d,i*3,.25);this.nextNote+=n,this.step++}}jingle(t){if(!this.bus)return;let e=72;[0,4,7,12].forEach((i,n)=>this.inst("lead",t+n*.12,e+i,.2,.8))}talk(){if(this.radioIdx<0||cs[this.radioIdx].style!=="talk")return;let t=uf[Math.floor(Math.random()*uf.length)];if(this.onTalk&&this.onTalk(t),this.useTTS&&window.speechSynthesis)try{let e=new SpeechSynthesisUtterance(t);e.lang="es-AR",e.rate=1.05,e.volume=this.volMusic,window.speechSynthesis.speak(e)}catch{}this.talkTimer=setTimeout(()=>this.talk(),11e3+Math.random()*6e3)}speak(t,e=1,i=1.05){if(!(!this.useTTS||!window.speechSynthesis))try{window.speechSynthesis.cancel();let n=new SpeechSynthesisUtterance(t);n.lang="es-AR",n.pitch=e,n.rate=i,n.volume=this.volSfx,window.speechSynthesis.speak(n)}catch{}}setVolumes(t,e){this.volMusic=t,this.volSfx=e,this.music&&(this.music.gain.value=t),this.sfx&&(this.sfx.gain.value=e)}};var Ql=class{constructor(){this.vehicles=[],this.peds=[],this.blips=[],this.money=250,this.paused=!0,this.started=!1,this.controlsLocked=!1,this.worldBounds=Ot,this.time=0,this.stats={fat:62,muscle:12,stamina:20,respect:0,carsStolen:0,pedsKilled:0,missions:0,bags:0,jumps:0,timePlayed:0,cashEarned:0,juggleBest:0,fares:0,deaths:0,arrests:0,distance:0},this.settings={ps2:!0,quality:1,music:.55,sfx:.8,sens:1,invertY:!1,tts:!1,touch:"auto"};try{Object.assign(this.settings,JSON.parse(jr("gtasj-settings")||"{}"))}catch{}}saveSettings(){xl("gtasj-settings",JSON.stringify(this.settings))}async init(t){let e=document.createElement("canvas");e.className="game",document.body.prepend(e),this.canvas=e;let i=new ol({canvas:e,antialias:!1,powerPreference:"high-performance"});i.setPixelRatio(1),this.renderer=i,this.scene=new jn,this.camera=new li(62,1,.3,1400),this.env=new Al(this.scene,i),this.post=new Pl(i),this.onResize(),window.addEventListener("resize",()=>this.onResize()),this.audio=new Kl,this.input=new Zl(e),this.world=new Tl(this),await this.world.build(t),t(.85,"Llamando al Gordopin..."),await new Promise(n=>setTimeout(n,0)),this.effects=new Cl(this),this.cameraRig=new Fl(this,this.camera),this.controller=new Bl(this),this.hud=new $l(this),this.hud.show(!1),this.traffic=new Ol(this),this.population=new Hl(this),this.police=new Gl(this),this.pickups=new ql(this),this.activities=new Vl(this),this.missions=new Wl(this),this.cheats=new Xl(this),this.saves=new Yl(this),this.menus=new Jl(this),this.touch=new jl(this),this.input.onType=n=>this.cheats.check(n),this.touch.enabled&&(this.traffic.max=10,this.traffic.maxParked=8,this.population.max=12),this.audio.onTalk=n=>{this.player&&this.player.vehicle&&this.hud.showToast(`<small>\u{1F4FB} ${n}</small>`,5)},this.applySettings(),t(.95,"Casi listo..."),this.createCharacters(),this.activities.setupBlips(),this.activities.updateBody(),this.cameraRig.update(.016,null),this.renderer.compile(this.scene,this.camera),t(1,"\xA1Listo!"),this.last=performance.now(),this.loop=this.loop.bind(this),requestAnimationFrame(this.loop)}applySettings(){let t=this.settings;this.post.enabled=!!t.ps2,this.renderScale=t.quality,this.onResize(),this.audio.setVolumes(t.music,t.sfx),this.audio.useTTS=!!t.tts,this.input.sensitivity=t.sens,this.input.invertY=!!t.invertY,this.touch&&this.touch.setMode(t.touch)}onResize(){let t=window.innerWidth,e=window.innerHeight,i=(this.renderScale||1)*Math.min(window.devicePixelRatio||1,1.5)*(this.post&&this.post.enabled?.75:1);this.renderer.setSize(t,e,!1),this.renderer.setPixelRatio(this.post&&this.post.enabled?1:i),this.post&&this.post.setSize(t,e,i),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}createCharacters(){let t=js.casa;this.gordopin=new er(this,Dl.gordopin,{x:t.x,z:t.z,rot:t.rot,isPlayer:!0,kind:"story",name:"Gordopin",persistent:!0,health:100}),this.gordopin.give("clavas"),this.petroca=new er(this,Dl.petroca,{x:t.x+2,z:t.z+2,rot:t.rot,kind:"story",name:"Petroca",persistent:!0,health:130}),this.petroca.give("pistola",60),this.petroca.setWeapon("pistola"),this.petroca.isFriend=!0,this.petroca.infiniteAmmo=!0,this.peds.push(this.gordopin,this.petroca),this.player=this.gordopin,this.companion=this.petroca,this.companionActive=!1,this.petroca.group.visible=!1,this.petroca.hidden=!0,this.cameraRig.snapBehind(t.rot)}playerName(){return this.player?this.player.name:""}key(t){let e=this.touch&&this.touch.enabled,i={enter:["F","SUBIR"],jump:["Shift","SALTAR"],forward:["W","el joystick"],switchChar:["TAB","\u21C4"],job:["2","REM\xCDS"],horn:["H","BOCINA"],fire:["clic","GOLPE"],aim:["clic derecho","APUNTAR"],map:["M","MAPA"]}[t]||[t,t];return`${e?"toc\xE1":"apret\xE1"} <b>${e?i[1]:i[0]}</b>`}get debug(){let t=this;return{tp(e,i){let n=t.player;if(n.vehicle){let s=n.vehicle;s.pos.set(e,t.terrain.groundAt(e,i),i),s.vx=s.vz=0}else n.pos.set(e,t.world.footGround(e,i),i)},done(e){t.missions.done=t.missions.list.slice(0,e).map(i=>i.id),e>=1&&!t.companionActive&&t.setCompanionActive(!0,t.player.pos.x+2,t.player.pos.z+2),t.missions.refresh()},mission(e){let i=t.missions.list.find(n=>n.id===e);i&&t.missions.start(i)},car(e){return t.cheats.spawnNear(e)},state(){let e=t.player;return{pos:[e.pos.x,e.pos.y,e.pos.z].map(i=>+i.toFixed(1)),veh:e.vehicle&&e.vehicle.key,hp:e.health,money:t.money,wanted:t.police.level,mission:t.missions.active&&t.missions.active.def.id,fps:+t.fps.toFixed(1)}}}}canSwitch(){return!(!this.companionActive||this.companion.dead||this.companion.hidden||this.missions&&this.missions.active&&!this.missions.active.allowSwitch)}switchCharacter(){let t=this.player,e=this.companion;if(t.isPlayer=!1,e.isPlayer=!0,t.brain=new oe(this,t,"follow"),e.brain=null,t.isFriend=!0,e.isFriend=!1,t.infiniteAmmo=!0,e.infiniteAmmo=!1,this.player=e,this.companion=t,this.controller.enterTarget=null,this.hud.showToast(`Ahora jug\xE1s con el <b>${e.name}</b>`,2.5),this.cameraRig.snapBehind(e.vehicle?e.vehicle.heading:e.heading),e.vehicle&&e.vehicle.driver!==e&&t.vehicle===e.vehicle&&t.seat===0){let i=e.vehicle,n=t.seat,s=e.seat;t.exitVehicle(),e.exitVehicle(),e.enterVehicle(i,n),t.enterVehicle(i,s)}this.audio.beep()}setCompanionActive(t,e,i){let n=this.petroca===this.player?this.gordopin:this.petroca;this.companionActive=t,n.hidden=!t,n.group.visible=t,t&&(e!==void 0&&n.pos.set(e,this.world.footGround(e,i),i),n.dead&&this.revive(n),n.brain=new oe(this,n,"follow"))}revive(t){t.dead=!1,t.health=t.maxHealth,t.deadT=0,t.knockT=0,t.model.anim.dead=0}spawnVehicle(t,e,i,n,s={}){let r=new Ul(this,t,{x:e,z:i,rot:n,...s});return this.vehicles.push(r),r}removeVehicle(t){for(let i of t.seats)i&&(i.exitVehicle(),!i.persistent&&!i.isPlayer&&this.removePed(i));t.dispose();let e=this.vehicles.indexOf(t);e>=0&&this.vehicles.splice(e,1)}spawnPed(t,e,i,n={}){let s=n.look||ni(t),r=new er(this,s,{x:e,z:i,kind:t,...n});return this.peds.push(r),r}removePed(t){t.remove();let e=this.peds.indexOf(t);e>=0&&this.peds.splice(e,1)}addMoney(t,e=!1){this.money+=t,t>0&&(this.stats.cashEarned+=t,e||this.audio.cash())}onPedDeath(t,e){t!==this.player&&((e===this.player||e&&e.isPlayer)&&(this.stats.pedsKilled++,this.police.crime(t.kind==="cana"?"copKill":"kill",t.pos)),t.money>0&&!t.persistent&&this.pickups.spawnMoney(t.pos.x,t.pos.z,t.money),!t.persistent&&t.kind!=="civil"&&Math.random()<.5&&t.weapon!=="punos"&&this.pickups.spawnWeapon(t.pos.x+.6,t.pos.z,t.weapon,20),this.missions.onPedDeath&&this.missions.onPedDeath(t,e))}onPedHurt(t,e,i){e&&e.isPlayer&&t!==this.player?(t.kind==="cana"?this.police.crime("copAttack",t.pos):t.isFriend||this.police.crime("assault",t.pos),t.brain&&t.brain.onAttacked(e)):t.brain&&e&&t.brain.onAttacked(e),t.isPlayer&&(this.cameraRig.shake=Math.max(this.cameraRig.shake,.3))}onGunshot(t){t.isPlayer&&this.police.crime("gunshot",t.pos),this.population.panic(t.pos,45,t)}onCarjack(t,e){e.kind==="cana"||t.type.police?this.police.crime("copCar",t.pos):this.police.crime("carjack",t.pos)}onExplosion(t,e,i,n){this.audio.explosion({x:t,y:e,z:i});let s=Math.hypot(this.camera.position.x-t,this.camera.position.z-i);this.cameraRig.shake=Math.max(this.cameraRig.shake,lt(1.5-s/60,0,1.5));for(let r of this.peds){if(r.dead||r.removed)continue;let o=Math.hypot(r.pos.x-t,r.pos.z-i);if(o<9&&Math.abs(r.pos.y-e)<6){let l=1-o/9;if(r.vehicle){o<4&&r.hurt(80*l,n);continue}r.hurt(110*l,n,null);let c=(r.pos.x-t)/(o||1),h=(r.pos.z-i)/(o||1);r.knockdown(c*9*l,h*9*l,5*l+2)}}for(let r of this.vehicles){if(r.dead||r.removed)continue;let o=Math.hypot(r.pos.x-t,r.pos.z-i);if(o<10&&o>.5){let l=1-o/10;r.damage(700*l,n),r.vx+=(r.pos.x-t)/o*8*l,r.vz+=(r.pos.z-i)/o*8*l,r.vy+=5*l}}n&&n.isPlayer&&this.police.crime("explosion",{x:t,z:i})}async wasted(t=!1){if(this.respawning)return;this.respawning=!0;let e=this.player;this.controlsLocked=!0,this.missions.fail(t?"Te agarr\xF3 la cana.":"Te hicieron bolsa.",!0),t?(this.hud.bigText("EN CANA","",4,"blue"),this.stats.arrests++):(this.hud.bigText("HECHO BOLSA","",4,"red"),this.stats.deaths++),this.audio.wasted(),this.post.mat.uniforms.uGrey.value=.8,this.audio.stopRadio(),await new Promise(r=>setTimeout(r,3200)),await this.hud.fadeTo(!0,.8),e.vehicle&&e.exitVehicle();let i=t?js.comisaria:js.hospital,n=t?this.city.markers.comisaria||i:this.city.markers.hospital||i;this.revive(e),e.pos.set(n.x,this.world.footGround(n.x,n.z),n.z+1.5),e.heading=0,e.armor=0,this.police.clear();let s=100;if(this.money=Math.max(0,this.money-s),(t||!this.cheats.keepWeapons)&&(e.owned=["punos"],e.ammo={punos:1/0},e===this.gordopin&&e.give("clavas"),e.setWeapon("punos")),this.companion&&this.companionActive){let r=this.companion;r.vehicle&&r.exitVehicle(),this.revive(r),r.pos.set(e.pos.x+1.5,e.pos.y,e.pos.z+1)}this.population.clearAround(e.pos,40),this.env.time=(this.env.time+360)%1440,this.post.mat.uniforms.uGrey.value=0,this.hud.big.classList.remove("show"),this.hud.bigSub.classList.remove("show"),this.hud.bigT=0,this.cameraRig.snapBehind(0),await this.hud.fadeTo(!1,.8),this.hud.showToast(t?"Pagaste $100 de fianza. Te sacaron las armas.":"Pagaste $100 de guardia en el Hospital Regional.",4),this.controlsLocked=!1,this.respawning=!1}loop(t){requestAnimationFrame(this.loop);let e=(t-this.last)/1e3;this.last=t,e>.1&&(e=.1),e<=0&&(e=.001),this.fps=this.fps?this.fps*.95+1/e*.05:60,this.input.pollPad(),this.menus&&this.menus.update(e),this.touch&&this.touch.update(),!this.paused&&this.started?this.update(e):this.menus&&this.menus.attract&&this.attract(e),this.render(),this.input.endFrame()}attract(t){this.time+=t;let e=this.time*.04,i=250+Math.cos(e)*260,n=40+Math.sin(e)*260;this.camera.position.set(i,95,n),this.camera.lookAt(200,20,60),this.env.update(t*.5,this.camera.position,this.time),this.props.update(this.time,t,this.env),this.effects.update(t,this.camera.position),this.world.water.userData.material.uniforms.uTime.value=this.time}update(t){this.time+=t,this.stats.timePlayed+=t;let e=this.player;this.env.update(t,this.camera.position,this.time),this.controller.update(t,this.input);for(let i=0;i<this.peds.length;i++){let n=this.peds[i];n.removed||n.hidden||(n.brain&&!n.dead&&n.brain.update(t),n.update(t),n.say&&(n.say.t-=t,n.say.t<=0&&(n.say=null)))}for(let i=0;i<this.vehicles.length;i++){let n=this.vehicles[i];n.removed||Math.abs(n.pos.x-this.camera.position.x)+Math.abs(n.pos.z-this.camera.position.z)>500&&!n.driver&&!n.persistent||n.update(t)}if(this.collidePedsVehicles(t),this.collideVehicles(),this.traffic.update(t),this.population.update(t),this.police.update(t),this.pickups.update(t),this.activities.update(t),this.missions.update(t),this.effects.update(t,this.camera.position),this.props.update(this.time,t,this.env),this.world.water.userData.material.uniforms.uTime.value=this.time,this.updateLighting(),e.dead&&!this.respawning&&this.wasted(!1),e.vehicle&&e.vehicle.sinking>1.5&&(e.exitVehicle(),this.effects.splash(e.pos.x,e.pos.z)),this.zoneT=(this.zoneT||0)-t,this.zoneT<=0){this.zoneT=.5;let i=e.vehicle?e.vehicle.pos:e.pos;this.hud.showZone(this.world.zoneAt(i.x,i.z))}this.cameraRig.update(t,this.input),this.hud.update(t),this.audio.update(t,this),this.menus.checkInGameKeys()}updateLighting(){let t=this.env.night,e=this.city.materialsList,i=lt((t-.25)*1.6,0,1);e.office.emissiveIntensity=i*.9,e.house.emissiveIntensity=i*.8}collidePedsVehicles(t){for(let e of this.vehicles){if(e.removed)continue;let i=e.speed,n=e.fwd,s=n.z,r=-n.x;for(let o of this.peds){if(o.vehicle||o.removed||o.hidden)continue;let l=o.pos.x-e.pos.x,c=o.pos.z-e.pos.z;if(Math.abs(l)>8||Math.abs(c)>8||Math.abs(o.pos.y-e.pos.y)>2.2)continue;let h=l*n.x+c*n.z,u=l*s+c*r,d=e.type.L/2+.3,f=e.type.W/2+.3;if(Math.abs(h)>d||Math.abs(u)>f)continue;let m=(e.vx*l+e.vz*c)/(Math.hypot(l,c)||1);if(i>4.5&&m>1&&!o.dead){let x=i*(e.type.mass>3e3?6:3.4);o.hurt(x,e.driver||null,null),o.knockdown(e.vx*.9,e.vz*.9,lt(i*.35,2,8)),e.vx*=.93,e.vz*=.93,this.audio.thud(o.pos,.6),this.effects.blood(o.pos.x,o.pos.y+1,o.pos.z),e.driver&&e.driver.isPlayer&&(this.police.crime(o.kind==="cana"?"copAttack":"runOver",o.pos),!o.dead&&o.brain&&o.brain.onAttacked(e.driver),Math.random()<.3&&Ci(o,ae(Hi.car)))}else{let x=d-Math.abs(h),g=f-Math.abs(u);if(x<g){let p=Math.sign(h)||1;o.pos.x+=n.x*x*p,o.pos.z+=n.z*x*p}else{let p=Math.sign(u)||1;o.pos.x+=s*g*p,o.pos.z+=r*g*p}}}}}collideVehicles(){let t=this.vehicles;for(let e=0;e<t.length;e++){let i=t[e];if(!i.removed)for(let n=e+1;n<t.length;n++){let s=t[n];if(s.removed)continue;let r=s.pos.x-i.pos.x,o=s.pos.z-i.pos.z,l=(i.type.L+s.type.L)/2;if(r*r+o*o>l*l||Math.abs(i.pos.y-s.pos.y)>2.5)continue;let c=i.obb(),h=s.obb(),u=[[c.fx,c.fz],[c.fz,-c.fx],[h.fx,h.fz],[h.fz,-h.fx]],d=1/0,f=0,m=0,x=!1;for(let[S,b]of u){let E=Math.abs(c.fx*S+c.fz*b)*c.hl+Math.abs(c.fz*S-c.fx*b)*c.hw,_=Math.abs(h.fx*S+h.fz*b)*h.hl+Math.abs(h.fz*S-h.fx*b)*h.hw,T=r*S+o*b,R=E+_-Math.abs(T);if(R<=0){x=!0;break}if(R<d){d=R;let C=T<0?-1:1;f=S*C,m=b*C}}if(x)continue;let g=i.type.mass*(i.parked&&!i.driver?1.5:1),p=s.type.mass*(s.parked&&!s.driver?1.5:1),y=p/(g+p),M=g/(g+p);i.pos.x-=f*d*y,i.pos.z-=m*d*y,s.pos.x+=f*d*M,s.pos.z+=m*d*M;let v=(s.vx-i.vx)*f+(s.vz-i.vz)*m;if(v<0){let S=-1.3*v/(1/g+1/p);i.vx-=S/g*f,i.vz-=S/g*m,s.vx+=S/p*f,s.vz+=S/p*m;let b=-v;if(b>3){i.damage((b-3)**1.3*6*y*2,s.driver),s.damage((b-3)**1.3*6*M*2,i.driver),i.angVel+=(Math.random()-.5)*b*.1,s.angVel+=(Math.random()-.5)*b*.1,this.audio.crash(i.pos,lt(b/20,.2,1)),b>6&&this.effects.sparks((i.pos.x+s.pos.x)/2,i.pos.y+.6,(i.pos.z+s.pos.z)/2,8);let E=this.player;(i.driver===E&&s.type.police||s.driver===E&&i.type.police)&&this.police.crime("copCarHit",i.pos),i.onHitVehicle&&i.onHitVehicle(s,b),s.onHitVehicle&&s.onHitVehicle(i,b)}}}}}render(){this.post.mat.uniforms.uTrail.value=this.settings.ps2?.33:0,this.post.render(this.scene,this.camera)}};var tc=["En Comodoro el viento sopla del Oeste. Las motos y los colectivos lo sienten m\xE1s.","Escrib\xED HESOYAM durante el juego si and\xE1s corto de salud y de guita.","Comer en El Chori del Viento te cura, pero engorda al Gordopin.","En la Chapa y Pintura de Don Tito te pintan el auto y la cana se olvida de vos.","Apret\xE1 TAB para cambiar entre el Gordopin y el Petroca.","Hay 24 bolsitas de La An\xF3mala enganchadas en los alambrados. Juntalas todas.","Subite a un rem\xEDs y apret\xE1 2 para laburar de remisero.","En el sem\xE1foro de San Mart\xEDn y Rivadavia el Gordopin hace malabares por monedas.","La Madriguera es la cancha de Newbery. En 2004 todav\xEDa era de tierra."];function mv(){let a=document.createElement("div");a.className="screen loading",a.innerHTML=`<div class="art"></div>
    <div class="load-tip"></div>
    <div class="logo"><span class="gta">GTA</span><span class="sj">San Jorge</span><span class="tag">Comodoro Rivadavia \xB7 2004</span></div>
    <div class="load-msg">Cargando...</div>
    <div class="load-bar"><i></i></div>`,document.body.appendChild(a);let t=a.querySelector(".load-tip"),e=Math.floor(Math.random()*tc.length);t.textContent=tc[e];let i=setInterval(()=>{e=(e+1)%tc.length,t.textContent=tc[e]},3500);return{progress(n,s){a.querySelector(".load-bar i").style.width=Math.round(n*100)+"%",s&&(a.querySelector(".load-msg").textContent=s)},done(){clearInterval(i),a.remove()},error(n){a.querySelector(".load-msg").textContent=n,a.querySelector(".load-msg").style.whiteSpace="normal"}}}async function df(a={}){let t=mv(),e=new Ql;window.__game=e;let i=window.claude&&window.claude.hot;if(i&&i.snapshot)try{i.snapshot(()=>({snap:e.started?e.saves.snapshot():null}))}catch{}try{await e.init((n,s)=>t.progress(n,s))}catch(n){console.error(n),t.error("No se pudo iniciar el juego: "+(n&&n.message?n.message:n)+". Prob\xE1 con otro navegador que soporte WebGL."),e.error=n;return}if(t.done(),a&&a.snap){e.saves.apply(a.snap),e.menus.main.hidden=!0,e.hud.show(!0),e.input.wantLock=!0,e.started=!0,e.paused=!1;let n=()=>{e.audio.init(),window.removeEventListener("pointerdown",n),window.removeEventListener("keydown",n)};window.addEventListener("pointerdown",n),window.addEventListener("keydown",n)}else e.menus.showMain();e.ready=!0}function ff(){let a=window.claude&&window.claude.hot;a&&a.ready?a.ready(df):df(a&&a.data||{})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ff):ff();})();
