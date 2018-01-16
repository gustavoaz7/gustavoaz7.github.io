const display = document.querySelector('#display');
const btns = document.querySelectorAll('p');
const operators = {
  '÷': '/',
  '×': '*',
  '-': '-',
  '+': '+'
}
let expression = "", // Expression string to be evaluated
  lastBtn, // Last inputted element
  parCounter = 0, // Parenthesis counter
  answer; 

  // Working with mouse-click
btns.forEach(b=>b.addEventListener('click', ()=>{
  input(b);
}))

// Working with keyboard inputs aswell
// Special elements:
  // Parenthesis - left/right arrow keys (open/close)
  // Clear all - Space
document.addEventListener('keydown', (e) => {
  input(e)
  // Style pressed element
  pressed(e)
});

// Back to original element Style after transition
btns.forEach(b => b.addEventListener('transitionend', pressEnd));

function pressed(e) { 
  let btn = document.getElementById(`${e.key}`);
  btn.classList.add('pressed');
}

function pressEnd(e) {
  if(e.propertyName!=('background-color'||'color')){return};
  this.classList.remove('pressed');
}

function input(pressed) {

  // Evaluating expression
  if ((pressed.textContent === '=') || (pressed.key === 'Enter')) {
    try {
      answer = eval(expression)
      
      // Dealing with floating point number precision problem:
        // Set to 8 decimas places when not integer
      Number.isInteger(answer) ? answer : answer.toFixed(8);
        // Remove all zeros
      while(answer[answer.length-1] === '0') {answer = answer.slice(0,-1)}

      // Limiting result length to 10 characters
        // When integer < 10e9, slice the string to get 10 chars (For brevity I'm ignoring rounding of 10th element)
        // When integer > 10e9, show number in scientific notation
      answer < 10e9 ? answer = answer.toString().slice(0,10) : answer = answer.toExponential(4);
      expression = answer;
    } catch(e) {
      expression = `Error`
    }
  
    // Avoiding duplicated operators (replace with last operator pressed)
  } else if ( (pressed.className === 'operator' || (pressed.key||'').match(/[\+\-\*\/]/)) && lastBtn.match(/[\+\-\*\/]/) ) {
    expression = expression.slice(0,-1); 
    expression += operators[pressed.textContent] || pressed.key

    // Adding 'dot' only if last number is not yet decimal
  } else if ((pressed.className === 'dot') || (/[\.]/.test(pressed.key))) {
    if (!/\d*\.\d*$/.test(expression)) expression += '.';
    
    // Adding operator
  } else if ((pressed.className === 'operator') || (/[\+\-\*\/]/.test(pressed.key))) {
    expression += operators[pressed.textContent] || pressed.key;

    // Adding numbers
  } else if ((pressed.className === 'number') || (/[0-9]/.test(pressed.key))) {
    expression += pressed.textContent || pressed.key;

    // Backspace - Removing last element
  } else if ((pressed.className === 'delete') || (pressed.key === 'Backspace')) {
    expression = expression.slice(0,-1);

    // Clear all
  } else if ((pressed.className === 'clear') || (pressed.key === ' ')) {
    expression = '';
    
    // Parenthesis
  } else if ((pressed.className === 'parO') || (pressed.key === 'ArrowLeft')) {
    // When parenthesis is placed after a number or a closing parenthesis, multiply them
    /\d$|\)$/.test(expression) ? expression += '*(' : expression += '(';
    // Add 1 to opened parenthesis counter
    parCounter++;
  } else if ((pressed.className === 'parC') || (pressed.key === 'ArrowRight')) {
    // Close parenthesis as long as there is an opened one.
    if (/\(/.test(expression) && parCounter > 0) {
      expression += ')';
      parCounter--;
    }
  }

  // Updating expression on display
  expression === 'NaN' ? display.innerHTML = 'Error' : display.innerHTML = expression.slice(-10);

  //Set new last element
  lastBtn = expression[expression.length-1];
}


//  For advanced (scientific) calculator:
// Replace last number ( expression.match(/\d+\.\d+$|\d+$/) ) with the pressed operation over this matched number.
// Keyboard input for all Scientific Operations would be crazy random. Probably just listen to mouse-click
