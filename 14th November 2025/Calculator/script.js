let curr = "0";
let op = "";
let val1 = "";
let reset = false;

function update() {
  document.getElementById("display").textContent = curr;
}

function addNum(num) {
  if (reset) {
    curr = num;
    reset = false;
  } else {
    if (curr === "0" && num !== ".") {
      curr = num;
    } else {
      if (num === "." && curr.includes(".")) return;
      curr += num;
    }
  }
  update();
}

function appendOperator(operator) {
  if (op && val1 && !reset) {
    calculate();
  }
  val1 = curr;
  op = operator;
  reset = true;
}

function calculate() {
  if (!op || !val1) return;

  let a = parseFloat(val1);
  let b = parseFloat(curr);
  let result;

  switch (op) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = b === 0 ? "Error" : a / b; break;
  }

  curr = result.toString();
  op = "";
  val1 = "";
  reset = true;
  update();
}

function clearAll() {
  curr = "0";
  op = "";
  val1 = "";
  reset = false;
  update();
}
