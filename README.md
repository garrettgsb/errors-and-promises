# Setup

* Clone this repository: `git clone https://github.com/garrettgsb/errors-and-promises.git`
* `yarn` or `npm install`
* Create a file called `.env` in the project directory with the following keys:

```
OXFORD_ID=abcdefg
OXFORD_KEY=0a1b2c3d4e5f6g
```

* Sign up with Oxford Dictionaries to be given your own API credentials: https://developer.oxforddictionaries.com/
* Put those credentials in your `.env` file

* Start the server: `node server.js`
* Point your favorite browser to `localhost:8080`

# TL;DR:

**Errors**

* Good errors are descriptive
* Handle errors with try-catch, instead of letting them explode your app
* Fail loud, fail early

**Asynchrony**

* Nonblocking/Asynchronous:
  - Walking and listening to music
  - Reading and drinking coffee
  - Event handlers: `onclick`, `onsubmit`
  - Code that doesn't require other code to wait for it to finish
* Blocking/Synchronous:
  - Sneezing
  - Code that makes other code wait

**Promise Mechanics**

  * Most promises that you'll use are promises provided by library/framework code, especially:
    - API calls
    - Database queries

  * Promises either resolve or reject, instead of returning
  * If it resolves: `.then()` receives the output and runs its callback
  * If it rejects: `.catch()` receives the output and runs its callback
  * `.then()` always returns a Promise
    - Which means that you're never _really_ getting out of Promise Land

**Designing With Promises**

* Asynchrony with Promises is not too different from asynchrony with callbacks
* Promises organize code into dependency sequences
* BAD: "Go into a Promise, bring the value out at the end"
* GOOD: "Go into a Promise, execute the desired behavior at the end"

**Advanced Promising**
  * `Promise.all` - Receives an array of Promises; Doesn't run `.then()` until they've all resolved or rejected
    - Useful for multiple dependencies, like waiting for 5 separate API calls to return
  * `Promise.race` - Runs `.then()` as soon as _one_ of the Promises resolve
    - Useful for multiple sources that satisfy the same dependency
    - e.g. Asking 3 different weather APIs what temperature it is outside

# Errors

Errors are good-- They tell you when (and, hopefully, how) your code is bad. Good errors give you the context that you need to fix it in a hurry. A good error tells you:

* What type of thing went wrong
* Which values were involved
* Where in the code the problem occurred

A bad error fails to give context about what is actually wrong.

![A bad error](readme-images/something-happened.png)

## Try-Catch

The "try-catch" pattern (and, in Javascript, language feature) is the bread and butter tool for error handling. It looks like this:

```
try {
  null.forEach(widget => widget.length); // <- Super doesn't work
} catch (error) {
  console.error(error);
}
```

What this code says is "Try to do the thing in the first block. If that fails for some reason, instead of just terminating the application, do what it says in the second `catch` block. Pass the error along as `error`."

## Custom Errors

**Fail loud, fail early**

Sometimes, you want errors to occur even though nothing has gone wrong as far as the Javascript interpreter is concerned. For that, we can create a `new Error` and `throw` it:

```
function singDuet(singers) {
  if (!singers.length === 2) {
    throw new Error("You need exactly 2 singers for a duet!");
  }
  singers.forEach(singer => singer.sing());
}
```

### Custom Error Classes

If we want very robust errors, we can create custom classes that inherit from the Error object:

```
class TooManySingersError extends Error {
  constructor(singers, ...params) {
    super(...params);
    this.name = "TooManySingersError";
    this.message = `Duets must have exactly 2 singers. Given ${singers.length}`
  }
}
```

To be clear: This is not a very common thing to do in application code, so we won't spend too long on it.

# Procedural Programming and its Shortcomings

When you are first learning to code, you are generally learning some form of procedural programming. This paradigm is simply the idea that **a program consists of a series of computational steps to be carried out in order.** Procedural code might look something like this:

```
const totalBill = 83.50;
const taxRate = 0.14;
const diners = [
  "Alice",
  "Bob",
  "Carol",
  "Dean",
];
const randomIndex = Math.floor(Math.random() * diners.length);
console.log(`${diners[randomIndex]} will get the bill, which comes to ${totalBill * (1 + taxRate)}, plus the tip.`);
```

It almost goes without saying that the flow goes line-by-line, in source order. But some code, by nature, can't be written in this way:

A web server, for example, can't respond to an HTTP request at runtime-- It can only respond when the request is made.

Similarly, a user interface can't (or, at least, shouldn't) submit a form when the app first loads-- It should only do so in response to input from the user.

When we are solving problems like building web servers or user interfaces, we are no longer thinking in terms of executing a procedure line-by-line; Rather, we should think of the code we write for these purposes as **definitions of behaviors to be performed later.**

# Asynchrony in Javascript

Javascript is, first and foremost, a language for adding interactivity to webpages. To program an interactive webpage is to establish behaviors that occur in response to a trigger. Triggers can be all sorts of things:

* The page loads
* The user clicks somewhere
* A timer expires
* An HTTP response is received
* The value of an input field changes

And many more.

As a result, Javascript was designed so that it would be easy to establish things that happen at the same time: Javascript can listen for a click _while_ validating an email address _while_ making several AJAX requests _while_ counting to 20, for example. Each of these activities needs to be **non-blocking:** That is, the rest of the app doesn't need to stop and wait for one thing to finish to carry on with the others.

Most languages support this style of programming in some capacity. Not all of them are good at it.

## Dependent Behavior

Mastering asynchrony is a matter of mastering **dependencies**. You might say that making a sandwich is **dependent** on having bread. To say the same thing in reverse: Bread is a dependency of a sandwich.

Some real-world dependencies are obvious: Getting on a bus is dependent on the bus arriving, for example. "First, wait for the bus to arrive. Then, get on the bus."

This is the same sort of pattern that we use when writing asynchronous code: "First, wait for the HTTP response. Then, render that data on the page." The HTTP response is a dependency of the render behavior, so the code must enforce the correct order of operations. That's what Promises are for!

# Promises

**Promises are a tool for enforcing dependencies in asynchronous systems**

Although it's easy to create your own Promises, almost all of your time using them will be spent with _tools that return Promises_, like Knex. In Javascript, you can expect that **any time your application interacts with something outside** of the Node/browser process, a Promise is a likely interface for brokering that interaction. In web development, this is most usually either an **HTTP request** or a **database query**.

## Promise Mechanics

### From the outside

At the very least, you will add a `.then()` to a Promise. The `.then()` receives a callback function, and that function receives the result of the Promise as a parameter. Confused? How about an example:

```
getUsers().then(result => console.log("All of the users:", result));
```

Of course, the callback doesn't need to be an inline anonymous function:

```
function logUsers(users) {
  console.log("All of the users:", result);
}

getUsers().then(logUsers);
```

Any value that is returned from a `.then()` is, itself, a Promise. As a result, we can chain `.then()` calls as much as we want:

```
getUsers()
  .then(users => user.map(user => user.id))
  .then(userIds => return adminFilter(userIds))
  .then(admins => console.log('Admins:', admins));
```

If a Promise rejects instead of resolving, or if there are any errors in the chain, then the function passed to `.catch()` will run, receiving the error as a parameter. Oh yeah, you should have a `.catch()` by the way.

```
doSomethingDangerous()
  .then(result => result.forEach(item => item.toUpperCase())) // Oh man, I hope this is an array of strings!
  .catch(error => console.error(error));
```

### From the inside

A Promise can have three states:

* Pending
* Resolved
* Rejected

When a Promise is first created, it is in the Pending state. The code inside of it runs, and **instead of `return`ing something**, it will either call a function called `resolve()` or a function called `reject()`. If `resolve()` is called, then the parameter that it is passed is given to the first `.then()` call. If `reject()` is called, then the parameter that it receives is passed to the first `.catch()` call. A (fairly pointless) custom Promise might look something like this:

```
new Promise((resolve, reject) => {
  if (Math.random() > 0.5) {
    resolve("Horray!");
  } else {
    reject("Noooo!");
  }
}).then(result => console.log("Then:", result)).catch(error => console.error("Catch:", error));
```

## Designing With Promises

Perhaps the most common sticking point with Promises is trying to use procedural code to do asynchronous stuff. We think, "I'll just dip into the Promise mode for a second to do that spooky asynchronous thing, then pop back out and carry on." But Promises don't work like this:

```
const city = "Vancouver";
const weather = getWeatherFor(city).then(result => return result);
console.log(`It's gonna be ${weather}-y out!`);
```

Or even like this (which _could_ actually work, by accident):

```
const city = "Vancouver";
let weather;
getWeatherFor(city).then(result => weather = result);
console.log(`It's gonna be ${weather}-y out!`);
```

In the examples above, we go into Promise-land, get a value, pull it back out, and then resume our top-level procedure. But we shouldn't think of Promises as just a way to grab data-- We should think of Promises as a separate behavior chain that _does not_ (usually) return a value to the top level: **Any work that depends on the Promise result is done inside of the Promise chain**

So your Promise code should look like this instead:

```
const city = "Vancouver";
getWeatherFor(city).then(result => console.log(`It's gonna be ${result}-y out!`));
```

## Advanced Promise Features

* `Promise.all` - Receives an array of Promises; Doesn't run `.then()` until they've all resolved or rejected
  - Treat _many_ Promises like _one_ Promise
  - Useful for multiple dependencies, like waiting for 5 separate API calls to return
* `Promise.race` - Runs `.then()` as soon as _one_ of the Promises resolve
  - Useful for a _single_ dependency that can be satisfied in _multiple ways_
  - e.g. Asking 3 different weather APIs what temperature it is outside
