/* eslint no-console: 0 */
// Consider the following simple imperative code from before:
let number = 2;
number = number + 2;
number = number * 4;
number = number - 6;
number = number / 0;
console.log(number);

// We can (but shouldn't) do the same sort of thing with Promises, like this:

new Promise((resolve, reject) => {
  resolve(2+2);
})
  .then(result => result * 4)
  .then(result => result - 6)
  .then(result => result / 0)
  .then(result => result.forEach(thing => thing * 10))
  .then(result => console.log(result))


// When a promise chain fails, `.catch()` is invoked.

// When the end of the chain has finished running,
// either by running out of `.then()`s or by hitting a `.catch()`,
// the `.finally()` is run.

new Promise((resolve, reject) => {
  resolve(2+2);
})
  .then(result => result * 4)
  .then(result => result - 6)
  .then(result => result / 0)
  .then(result => result.forEach(thing => thing * 10))
  .then(result => console.log(result))
  .catch(err => {
    console.log(err); return 'There was an error but its cool'
  })
  .then(result => console.log(result))
  .finally(result => console.log('🐢'));
