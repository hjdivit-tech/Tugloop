(()=>{
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let mx=innerWidth/2,my=innerHeight/2;

/* ---------- code rain (hero) ---------- */
function makeRain(cv,opts){
  const ctx=cv.getContext('2d'); const G="01{}[]<>/=;:+*#$&()_λΔ∑ABCDEFabcdef".split("");
  let W,H,cols,drops,dpr; const fs=opts.fs||15;
  function size(){dpr=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    cols=Math.ceil(W/fs);drops=Array.from({length:cols},()=>({y:Math.random()*-H/fs*1.2,v:.25+Math.random()*.55,o:Math.random()<.13}));
    ctx.fillStyle=opts.bg;ctx.fillRect(0,0,W,H);ctx.font=`${fs-3}px "JetBrains Mono",monospace`;}
  size(); addEventListener('resize',size);
  let run=true,rect=cv.getBoundingClientRect();
  function frame(){
    if(!run) return;
    rect=cv.getBoundingClientRect();
    ctx.fillStyle=opts.fade; ctx.fillRect(0,0,W,H);
    ctx.font=`${fs-3}px "JetBrains Mono",monospace`;
    const lx=mx-rect.left, ly=my-rect.top;
    for(let i=0;i<cols;i++){
      const d=drops[i], x=i*fs+3, y=d.y*fs;
      const dist=Math.hypot(x-lx,y-ly), near=opts.interactive && dist<150;
      const ch=G[(Math.random()*G.length)|0];
      ctx.fillStyle = near? '#FFB070' : (d.o? '#F07A1F' : opts.head);
      if(near){ctx.globalAlpha=1;ctx.fillText(ch,x+(x-lx)/dist*8,y);}
      else {ctx.globalAlpha=d.o?.9:.75; ctx.fillText(ch,x,y);}
      ctx.globalAlpha=1;
      d.y+= d.v*(near?2.4:1);
      if(y>H && Math.random()>.975){d.y=-Math.random()*8;d.v=.25+Math.random()*.55;d.o=Math.random()<.13;}
    }
    requestAnimationFrame(frame);
  }
  if(RM){for(let k=0;k<120;k++){frame();} run=false; return;}
  new IntersectionObserver(es=>es.forEach(e=>{const was=run;run=e.isIntersecting;if(run&&!was)requestAnimationFrame(frame)})).observe(cv);
  requestAnimationFrame(frame);
}
$('#rain')&&makeRain($('#rain'),{bg:'#0A0A09',fade:'rgba(10,10,9,0.085)',head:'#5f5a53',interactive:true,fs:16});
$('#miniRain')&&makeRain($('#miniRain'),{bg:'#0B0C0B',fade:'rgba(11,12,11,0.12)',head:'#3d3a36',interactive:false,fs:11});

/* ---------- typing ---------- */
const lines=['npx build-the-future','git commit -m "make it unforgettable"','npm run elevate'];
const typed=$('#typed'); let li=0;
function typeLine(){const s=lines[li%lines.length];let i=0;
  const t=setInterval(()=>{typed.textContent=s.slice(0,++i); if(i>=s.length){clearInterval(t);setTimeout(()=>{const e=setInterval(()=>{typed.textContent=typed.textContent.slice(0,-1);if(!typed.textContent){clearInterval(e);li++;typeLine();}},28)},2600);}},55);}
if(typed){ if(RM) typed.textContent=lines[0]; else setTimeout(typeLine,400); }

/* ---------- headline word swap ---------- */
const words=['scrolling','talking','clicking','staring'];let wi=0;const sw=$('#swap');
if(!RM&&sw) setInterval(()=>{wi=(wi+1)%words.length;sw.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-.4em)',opacity:0}],{duration:220,easing:'ease-in'}).onfinish=()=>{sw.textContent=words[wi];sw.animate([{transform:'translateY(.4em)',opacity:0},{transform:'none',opacity:1}],{duration:320,easing:'cubic-bezier(.3,1.5,.5,1)'});};},2300);

/* ---------- wordmark parallax ---------- */
const wm=$('.wm-hero'); const layers=wm?$$('g[data-depth]',wm):[];
/* orbit dash length */
(wm?$$('#wb path,#wf path',wm):[]).forEach(p=>{try{p.parentNode.style.setProperty('--len',p.getTotalLength())}catch(e){}});

/* ---------- cursor ---------- */

addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;},{passive:true});

function loop(){
  const cx=innerWidth/2,cy=innerHeight/2;
  if(!RM) layers.forEach(l=>{const d=+l.dataset.depth;l.style.translate=`${(mx-cx)/cx*d}px ${(my-cy)/cy*d}px`;});
  requestAnimationFrame(loop);
}
loop();



/* ---------- magnetic ---------- */
if(FINE&&!RM) $$('.mag').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;});
  b.addEventListener('pointerleave',()=>b.style.transform='');
});

/* ---------- tiles spotlight + tilt ---------- */
$$('.tile').forEach(t=>{
  t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
    t.style.setProperty('--mx',x+'px');t.style.setProperty('--my',y+'px');
    if(!RM) t.style.transform=`perspective(800px) rotateX(${(y/r.height-.5)*-8}deg) rotateY(${(x/r.width-.5)*8}deg)`;});
  t.addEventListener('pointerleave',()=>t.style.transform='');
});

/* ---------- split headings ---------- */
$$('.split').forEach(h=>{
  const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(/^\s+$/.test(w)){f.append(w);return;}const s=document.createElement('span');s.style.display='inline-block';s.style.whiteSpace='nowrap';[...w].forEach((ch,i)=>{const x=document.createElement('span');x.className='ch';x.textContent=ch;s.append(x)});f.append(s)});c.replaceWith(f);}else if(c.nodeType===1&&c.tagName!=='BR')walk(c);});};
  walk(h);
  const r=h.getBoundingClientRect();
  if(!RM && r.top>innerHeight){h.classList.add('pre');
    new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){$$('.ch',h).forEach((c,i)=>c.style.transitionDelay=(i*18)+'ms');h.classList.remove('pre');o.disconnect();}}),{threshold:.3}).observe(h);}
});

/* ---------- marquee bands: scroll-velocity driven ---------- */
const tracks=$$('.track'); let lastY=scrollY, vel=0;
tracks.forEach(t=>{t.innerHTML+=t.innerHTML; t._x=0;});
function bands(){
  const dy=scrollY-lastY; lastY=scrollY; vel+= (dy-vel)*.1;
  tracks.forEach(t=>{const dir=+t.dataset.dir, sp=+t.dataset.speed; const w=t.scrollWidth/2;
    t._x += dir*(sp + Math.abs(vel)*.35) * (vel<0?-1:1);
    if(t._x<-w) t._x+=w; if(t._x>0) t._x-=w;
    t.style.transform=`translateX(${t._x}px) skewX(${Math.max(-12,Math.min(12,vel*-.4))}deg)`;});
  if(!RM) requestAnimationFrame(bands);
}
bands();

/* ---------- horizontal reel ---------- */
const pin=$('#workPin'), reel=$('#reel'), bar=$('#reelBar');
function sizePin(){ if(!pin) return; if(innerWidth<=860){pin.style.height='';return;} const dist=reel.scrollWidth-innerWidth+parseFloat(getComputedStyle(document.documentElement).fontSize)*4; pin.style.height=(innerHeight+Math.max(0,dist))+'px'; pin._dist=Math.max(0,dist);}
sizePin(); addEventListener('resize',sizePin); addEventListener('load',sizePin);

/* ---------- process + progress + nav ---------- */
const steps=$('#steps'), stepEls=$$('.step'), nav=$('#nav'), prog=$('#progress');
function onScroll(){
  const st=scrollY, h=document.documentElement.scrollHeight-innerHeight;
  prog.style.transform=`scaleX(${h>0?st/h:0})`;
  nav.classList.toggle('solid',st>40);
  if(pin&&innerWidth>860){const r=pin.getBoundingClientRect(); const p=Math.min(1,Math.max(0,-r.top/(pin.offsetHeight-innerHeight||1)));
    reel.style.transform=`translateX(${-p*(pin._dist||0)}px)`; bar.style.transform=`scaleX(${p})`;}
  if(!steps) return;
  const sr=steps.getBoundingClientRect(); const p2=Math.min(1,Math.max(0,(innerHeight*.75-sr.top)/(sr.height+innerHeight*.2)));
  steps.style.setProperty('--p',p2); stepEls.forEach((s,i)=>s.classList.toggle('on',p2>=i/(stepEls.length-1)-.02));
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();

/* ---------- small loops ---------- */
const vt=$('#vtitle'),vts=['Before the First Brick.','The Silent Strength.','Built to Last.','Empty Land to Landmark.'];let vi=0;
if(!RM&&vt) setInterval(()=>{vt.classList.add('out');setTimeout(()=>{vi=(vi+1)%vts.length;vt.textContent=vts[vi];vt.classList.remove('out')},300)},2600);
const says=['obstacle left → <b>“turn right”</b>','obstacle right → <b>“turn left”</b>','obstacle ahead → <b>beep · beep · beep</b>'];let si=0;
if(!RM&&$('#say')) setInterval(()=>{si=(si+1)%says.length;$('#say').innerHTML=says[si]},2400);

/* ---------- big contact text: letters dodge the cursor ---------- */
const big=$('#big');
(big?$$('.ln',big):[]).forEach(ln=>{const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();[...c.textContent].forEach(ch=>{const s=document.createElement('span');s.className='ch';s.textContent=ch===' '?' ':ch;f.append(s)});c.replaceWith(f);}else walk(c);});};walk(ln);});
const bigCh=big?$$('.ch',big):[];
if(!RM&&FINE&&big) addEventListener('pointermove',()=>{const br=big.getBoundingClientRect(); if(br.bottom<-100||br.top>innerHeight+100) return;
  bigCh.forEach(c=>{const r=c.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=cx-mx,dy=cy-my,d=Math.hypot(dx,dy);
    if(d<180){const k=(180-d)/180;c.style.transform=`translate(${dx/d*k*26}px,${dy/d*k*26}px) rotate(${dx/d*k*14}deg)`;c.style.color='var(--ember-hi)';}
    else if(c.style.transform){c.style.transform='';c.style.color='';}});},{passive:true});

/* ---------- copy ---------- */
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.copy;
  const done=()=>{b.textContent='copied ✓';setTimeout(()=>b.textContent='copy',1600)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(done,()=>sel(b))}else sel(b);
  function sel(btn){const s=btn.previousElementSibling;const r=document.createRange();r.selectNodeContents(s);const g=getSelection();g.removeAllRanges();g.addRange(r);btn.textContent='select ✓';setTimeout(()=>btn.textContent='copy',1600)}
}));

/* ---------- scanned-the-card toast ---------- */
const toast=$('#toast');
function checkHash(){ if(toast&&location.hash==='#scan') setTimeout(()=>toast.classList.add('show'),900); }
checkHash(); addEventListener('hashchange',checkHash);
if(toast){$('#toastX').addEventListener('click',()=>toast.classList.remove('show'));
$('#toastGo').addEventListener('click',()=>toast.classList.remove('show'));}

/* ---------- mobile menu ---------- */
const menu=$('#menu');
if(menu) menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o);menu.textContent=o?'close':'menu';});
})();
