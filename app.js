const ul=document.querySelector('ul')
const calNum=ul.querySelectorAll('li')
const screencal =document.querySelector('h1')
const clearbtn=document.querySelector('#clearbtn')
const deletbtn =document.querySelector('#deletbtn')
let expression=''

function updateScreen(val){
  screencal.textContent=val
  
  if(val.length > 9){
    screencal.style.fontSize='26px'
  }else{
    screencal.style.fontSize='42px'
  }
}

calNum.forEach((figuers) =>{
  figuers.addEventListener('click',()=>{
    const calvalue=figuers.getAttribute('value')
     if(!calvalue)return;

    if(calvalue == '='){
      try{
        let tocal=expression.replace(/x/g,'*').replace(/X/g,'*').replace(/÷/g,'/')
        let result=eval(tocal)
        if(result.toString().length > 10){
          result = Number(result).toExponential(4)
        }
        updateScreen(result.toString())
        expression=result.toString()
      }catch{
        updateScreen('error')
        expression=''
      }
      return;
    }

    if(calvalue == '%'){
      let matches=expression.match(/(\d+\.?\d*)$/)
      if(!matches)return;
      let last=matches[0]
      expression=expression.slice(0, -last.length) + (Number(last) / 100)
      updateScreen(expression)
      return;
    }

    
    if(expression.length >= 12) return;
    expression +=calvalue
    updateScreen(expression)
  })
})

clearbtn.addEventListener('click',()=>{
  expression=''
  screencal.textContent='0'
  screencal.style.fontSize='42px'
})

deletbtn.addEventListener('click',()=>{
  expression=expression.slice(0, -1)
  if(expression === ''){
    screencal.textContent='0'
  }else{
    screencal.textContent=expression
  }
})