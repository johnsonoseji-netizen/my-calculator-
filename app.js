const display = document.querySelector('.screen h1');
const buttons = document.querySelectorAll('.numbercontainer li');
const clearBtn = document.getElementById('clearbtn');
const deleteBtn = document.getElementById('deletbtn');

let currentInput = '0';
let shouldReset = false;

function updateDisplay() {
  if (currentInput.length > 12) {
    display.style.fontSize = '40px';
  } else {
    display.style.fontSize = '62px';
  }
  display.textContent = currentInput;
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    let value = btn.getAttribute('value');

    if (value === '=') {
      try {
        // Replace symbols for JS
        let expression = currentInput
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/x/g, '*');

        // Handle % -> /100
        expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

        let result = eval(expression);
        
        if (result === Infinity || isNaN(result)) {
          currentInput = 'Error';
        } else {
          // Round to avoid long decimals
          result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
          currentInput = result.toString();
        }
        shouldReset = true;
      } catch {
        currentInput = 'Error';
        shouldReset = true;
      }
      updateDisplay();
      return;
    }

    if (shouldReset && !isNaN(value)) {
      currentInput = '';
      shouldReset = false;
    }

    if (currentInput === '0' || currentInput === 'Error') {
      if (value === '.') {
        currentInput = '0.';
      } else if (!isNaN(value)) {
        currentInput = value;
      } else {
        currentInput = value === '%' ? '0' : value;
        if(currentInput === '0') currentInput = value;
      }
    } else {
      if (value === '.') {
        // prevent double dot in same number
        let parts = currentInput.split(/[\+\-\*\/÷\%]/);
        let lastPart = parts[parts.length - 1];
        if (!lastPart.includes('.')) {
          currentInput += value;
        }
      } else {
        // prevent double operators
        let lastChar = currentInput.slice(-1);
        let operators = ['+', '-', '*', '÷', '%', '×'];
        if (operators.includes(lastChar) && operators.includes(value)) {
          currentInput = currentInput.slice(0, -1) + value;
        } else {
          currentInput += value;
        }
      }
    }
    shouldReset = false;
    updateDisplay();
  });
});

clearBtn.addEventListener('click', () => {
  currentInput = '0';
  shouldReset = false;
  updateDisplay();
});

deleteBtn.addEventListener('click', () => {
  if (currentInput === 'Error' || currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
});

// Init
updateDisplay();