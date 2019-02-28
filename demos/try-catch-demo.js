/* eslint no-console: 0 */

// =-=-=-=-=-=-=-=
// Error Handling
// =-=-=-=-=-=-=-=

// Consider the following simple imperative code:
let number = 2;
number = number + 2;
number = number * 4;
number = number - 6;
number = number / 0;
console.log(number);

// As this goes on, what if something goes wrong?

number = 2;

number = number + 2;
number = number * 4;
number = number - 6;
// number.forEach(digit => digit + 10); // <- Not gonna work
number = number / 0;
console.log(number);


// We can handle the error manually:
number = 2;

try {
  number = number + 2;
  number = number * 4;
  number = number - 6;
  number.forEach(digit => digit + 10); // <- Not gonna work
  number = number / 0;
} catch (error) {
  console.error(error);
}
console.log(number);

// This is often useful to hedge potentially problematic functions:

function arbitraryMath(number) {
  number = number + 2;
  number = number * 4;
  number = number - 6;
  number.forEach(digit => digit + 10); // <- Not gonna work
  number = number / 0;
  return number;
}

number = 2;

try {
  number = arbitraryMath(number);
} catch (error) {
  console.log("Hey, I thought you should know about this: \n\n");
  console.error(error);
  console.log("\n\nIt's cool though, I handled it.");
}

console.log(number); // Notice that the value is still 2
