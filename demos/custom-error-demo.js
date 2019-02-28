/* eslint no-console: 0 */
// Sometimes, we want to throw an error to indicate that a developer's code
// isn't actually bad Javascript, but is still problematic.
// We can do that by throwing a custom error:

function dressHotDog(hotDog={ condiments: [] }, userCondiment) {
  const validCondiments = ["ketchup", "mustard", "relish"];

  if (!validCondiments.includes(userCondiment)) {
    throw new Error(`It's immoral to put ${userCondiment} on a hot dog!`);
  } else {
    hotDog.condiments.push(userCondiment);
  }
  return hotDog;
}

const hotDog = {
  type: "100% Beef",
  bun: "Sesame",
  condiments: [],
};


// =-=-=-=-=-=-=-=-=-=-=
// Custom Error Classes
// =-=-=-=-=-=-=-=-=-=-=

class InvalidCondimentError extends Error {
  constructor(hereticalCondiment, ...params) {
    super(...params);
    this.name = "InvalidCondimentError";
    this.message = `It's immoral to put ${hereticalCondiment} on a hot dog!`;
  }
}

function dressHotDogCustom(hotDog={ condiments: [] }, userCondiment) {
  const validCondiments = ["ketchup", "mustard", "relish"];

  if (!validCondiments.includes(userCondiment)) {
    throw new InvalidCondimentError(userCondiment);
  } else {
    hotDog.condiments.push(userCondiment);
  }
  return hotDog;
}

try {
  dressHotDogCustom(hotDog, "relish");
  dressHotDogCustom(hotDog, "mayonnaise");
} catch (e) {
  // Halt if the condiment choice is bad; Keep going for all other errors.
  // (Note: Don't actually do this)
  if (e instanceof InvalidCondimentError) {
    console.error("Looks like we've got a trouble-maker:");
    throw e;
  } else {
    console.error("Something went wrong with the condiments, but the condiment choice was okay.");
    console.error(e);
  }
}
