const randomNumber = Math.random();
const newNumber = randomNumber.toFixed(1);
const checkNumber = (num) => {return num === 0.2};
console.log(checkNumber(newNumber));
console.log(newNumber);
