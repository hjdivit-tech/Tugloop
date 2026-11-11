(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---------- copy email / phone ---------- */
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
  const v=b.dataset.copy;
  const done=()=>{b.textContent='copied ✓';setTimeout(()=>b.textContent='copy',1600)};
  function sel(){const s=b.previousElementSibling;const r=document.createRange();r.selectNodeContents(s);const g=getSelection();g.removeAllRanges();g.addRange(r);b.textContent='select ✓';setTimeout(()=>b.textContent='copy',1600)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(done,sel)}else sel();
}));

/* ---------- mobile menu ---------- */
const nav=$('#nav'), menu=$('#menu');
if(nav&&menu) menu.addEventListener('click',()=>{
  const o=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',o);
  menu.textContent=o?'close':'menu';
});
})();
