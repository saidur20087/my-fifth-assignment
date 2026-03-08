📝 JavaScript Core Concepts
1️⃣ What is the difference between var, let, and const?
var: The old way to declare variables. It is function-scoped and can be re-declared, which often leads to bugs.

let: The modern way to declare variables. It is block-scoped (stays within { }) and allows you to change the value later.

const: Short for "constant." It is also block-scoped, but once you assign a value, you cannot change it.

2️⃣ What is the spread operator (...)?
The spread operator (...) allows you to quickly copy all or part of an existing array or object into another array or object. It "spreads" the elements out.

Example: const newArray = [...oldArray, "new item"];

3️⃣ What is the difference between map(), filter(), and forEach()?
map(): Loops through an array and returns a new array with modified values.

filter(): Checks a condition and returns a new array containing only the items that pass the test.

forEach(): Just a simple loop to perform an action on each item. It does not return a new array.

4️⃣ What is an arrow function?
A shorter and more modern way to write functions in JavaScript. It makes the code cleaner and easier to read.

Example: const sayHello = () => console.log("Hello!");

5️⃣ What are template literals?
A way to create strings using backticks ( ` ) instead of quotes. They allow you to easily insert variables using ${variable} and write multi-line strings without extra effort.

Example: `Welcome, ${saidur20087}!`