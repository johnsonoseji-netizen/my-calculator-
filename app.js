const display = document.getElementById('display');
const buttons = document.querySelectorAll('.numbercontainer li');
const clearBtn = document.getElementById('clearbtn');
const deleteBtn = document.getElementById('deletbtn');

let input = '0';
function show(){ display.textContent = input; display.style.fontSize = input.length>9?'42px':'62px'; }
function isOp(c){ return ['+','-','*','÷','×','%','/'].includes(c); }

buttons.forEach(btn=>{
 btn.addEventListener('click',()=>{
  let val = btn.dataset.value || btn.textContent.trim();
  if(val==='×') val='*';
  if(input==='Error'){ if(val==='=') return; input='0'; }
  if(val==='='){
   try{
    if(isOp(input.slice(-1))) input=input.slice(0,-1);
    let exp = input.replace(/÷/g,'/').replace(/×/g,'*').replace(/%/g,'/100');
    if(!exp) return;
    let res = Function('"use strict";return('+exp+')')();
    if(!isFinite(res)) throw 0;
    res = parseFloat(res.toFixed(8));
    input = res.toString();
   }catch{ input='Error'; }
   show(); return;
  }
  if(val==='.'){
   let p=input.split(/[\+\-\*\/÷\%×]/); if(p[p.length-1].includes('.')) return;
   input+='.'; show(); return;
  }
  if(isOp(val)){
   if(input==='0' && val!== '-' ) return;
   if(isOp(input.slice(-1))) input=input.slice(0,-1)+val; else input+=val;
   show(); return;
  }
  if(input==='0') input=val; else input+=val;
  show();
 });
});
clearBtn.onclick=()=>{ input='0'; show(); };
deleteBtn.onclick=()=>{ if(input==='Error'||input.length<=1) input='0'; else input=input.slice(0,-1); show(); };
show();