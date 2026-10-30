const display = document.querySelector('.screen h1');
const buttons = document.querySelectorAll('.numbercontainer li');
const clearBtn = document.getElementById('clearbtn');
const deleteBtn = document.getElementById('deletbtn');

let input = '0';

function show() {
  display.textContent = input;
  display.style.fontSize = input.length > 9 ? '42px' : '62px';
}

function isOperator(ch) {
  return ['+', '-', '*', '÷', 'x', '×', '%', '/'].includes(ch);
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    let val = btn.getAttribute('value');

    // If currently Error, reset first
    if (input === 'Error') {
      if (val === '=') return;
      input = '0';
    }

    if (val === '=') {
      try {
        if (isOperator(input.slice(-1))) {
          input = input.slice(0, -1);
        }
        let exp = input.replace(/÷/g, '/').replace(/x/g, '*').replace(/×/g, '*');
        // fix % -> /100
        exp = exp.replace(/%/g, '/100');
        
        if (exp === '' || exp === '0') return;
        
        let res = Function('"use strict"; return (' + exp + ')')();
        
        if (!isFinite(res)) throw new Error();
        
        // clean result
        res = parseFloat(res.toFixed(8));
        input = res.toString();
      } catch {
        input = 'Error';
      }
      show();
      return;
    }

    if (val === '.') {
      let parts = input.split(/[\+\-\*\/÷\%x×]/);
      let last = parts[parts.length - 1];
      if (last.includes('.')) return;
      input += '.';
      show();
      return;
    }

    if (isOperator(val)) {
      if (input === '0' && val !== '-') {
        // don't allow + * / at start
        return;
      }
      if (isOperator(input.slice(-1))) {
        input = input.slice(0, -1) + val;
      } else {
        input += val;
      }
      show();
      return;
    }

    // number
    if (input === '0') {
      input = val;
    } else {
      input += val;
    }
    show();
  });
});

clearBtn.addEventListener('click', () => {
  input = '0';
  show();
});

deleteBtn.addEventListener('click', () => {
  if (input === 'Error' || input.length <= 1) {
    input = '0';
  } else {
    input = input.slice(0, -1);
  }
  show();
});

show();