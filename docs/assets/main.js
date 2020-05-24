!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){!function(){"use strict";var e=["C","C#","D","Eb","E","F","F#","G","G#","A","Bb","B"],t=new(o(1))(1024),n=new THREE.Scene,r=new THREE.PerspectiveCamera(40,1.6,.1,1e3),i=new THREE.LineBasicMaterial({color:65280}),a=(new THREE.LineBasicMaterial({color:65535}),function(e,t){for(var o=[],n=0;n<e;n++)o.push(Array.apply(null,Array(t)).map(Number.prototype.valueOf,0));return o}(20,1024)),c=new THREE.WebGLRenderer({canvas:document.querySelector("canvas")});function d(){c.domElement.style.width="100%",c.domElement.style.height="auto";var e=c.domElement.clientWidth/16*10;c.setPixelRatio(window.devicePixelRatio?window.devicePixelRatio:1),c.setSize(1.6*e,e),c.domElement.style.width="100%",c.domElement.style.height="auto",r.aspect=1.6*e/e,r.updateProjectionMatrix()}d(),window.addEventListener("resize",d);var s=new THREE.DirectionalLight(16777215,.5);s.position.set(0,1,1),n.add(s),r.position.z=5;var u=new THREE.Vector3(0,1,0),l=new THREE.Vector3(1,0,0),p=new THREE.Vector3(1,-6,-15),f=new THREE.ArrowHelper(u,p,1,16776960),m=new THREE.ArrowHelper(u,p,1,255),y=new THREE.ArrowHelper(l,p,1,16711935),g=new THREE.Group;n.add(f),n.add(m),n.add(y);for(var w=0;w<a.length;w++)if(a[w]){var v=new THREE.BufferGeometry,E=new Float32Array(3*a[w].length);v.addAttribute("position",new THREE.BufferAttribute(E,3)),v.setDrawRange(0,a[w].length);var h=new THREE.Line(v,i);g.add(h),E=h.geometry.attributes.position.array}var b=new THREE.BufferGeometry,M=new THREE.Line(b,i),x=new Float32Array(3072);b.addAttribute("position",new THREE.BufferAttribute(x,3)),b.setDrawRange(0,1024),x=M.geometry.attributes.position.array,n.add(M),n.add(g);var R=null,S=document.querySelector("#chroma"),A=document.querySelector("#mfcc");!function o(){if(R=t.get(["amplitudeSpectrum","spectralCentroid","spectralRolloff","loudness","rms","chroma","mfcc"])){S&&R.chroma&&(S.innerHTML=R.chroma.reduce((function(t,o,n){return"".concat(t,'\n          <div class="chroma-band" style="background-color: rgba(0,').concat(Math.round(255*o),',0,1)">').concat(e[n],"</div>")}),"")),A&&R.mfcc&&(A.innerHTML=R.mfcc.reduce((function(e,t,o){return"".concat(e,'\n          <div class="mfcc-band" style="background-color: rgba(0,').concat(5*Math.round(t+25),',0,1)">').concat(o,"</div>")}),"")),a.pop(),a.unshift(R.amplitudeSpectrum);for(var i=t.meyda._m.signal,d=0;d<a.length;d++){for(var s=g.children[d].geometry.attributes.position.array,u=0,l=0;l<3*a[d].length;l++)s[u++]=10.7+8*Math.log10(l/a[d].length),s[u++]=.1*a[d][l]-5,s[u++]=-15-d;g.children[d].geometry.attributes.position.needsUpdate=!0}if(R.spectralCentroid&&f.position.set(10.7+8*Math.log10(R.spectralCentroid/512),-6,-15),R.spectralRolloff){var p=R.spectralRolloff/22050;m.position.set(10.7+8*Math.log10(p),-6,-15)}if(R.rms&&y.position.set(-11,10*R.rms-5,-15),i){for(var w=M.geometry.attributes.position.array,v=0,E=0;E<1024;E++)w[v++]=22*E/1024-11,w[v++]=4+5*i[E],w[v++]=-25;M.geometry.attributes.position.needsUpdate=!0}}requestAnimationFrame(o),c.render(n,r)}()}()},function(e,t){var o,n;(n=function(e){window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext),navigator.hasOwnProperty("webkitGetUserMedia")&&!navigator.hasOwnProperty("getUserMedia")&&(navigator.getUserMedia=webkitGetUserMedia,AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode)),this.context=new AudioContext;var t=document.getElementById("elvisSong"),n=this.context.createMediaElementSource(t);n.connect(this.context.destination),this.meyda=Meyda.createMeydaAnalyzer({audioContext:this.context,source:n,bufferSize:e,windowingFunction:"blackman"}),o=this,this.initializeMicrophoneSampling()}).prototype.initializeMicrophoneSampling=function(){var e=function(e){"suspended"===o.context.state&&document.body.addEventListener("touchend",(function e(){o.context.resume(),setTimeout((function(){"running"===o.context.state&&document.body.removeEventListener("touchend",e,!1)}),0)}),!1)};try{navigator.getUserMedia=navigator.webkitGetUserMedia||navigator.getUserMedia||navigator.mediaDevices.getUserMedia;var t=function(e){document.getElementById("audioControl").style.display="none",console.log("User allowed microphone access."),console.log("Initializing AudioNode from MediaStream");var t=o.context.createMediaStreamSource(e);console.log("Setting Meyda Source to Microphone"),o.meyda.setSource(t),console.groupEnd()};console.log("Asking for permission..."),navigator.getUserMedia({video:!1,audio:!0},t,e)&&(p.then(t),p.catch(e))}catch(t){e()}},n.prototype.get=function(e){return o.context.resume(),o.meyda.get(e)},e.exports=n}]);