---
title: "Understanding Promises in JavaScript: From Callbacks to Promise.allSettled()"
date: 2024-01-10
categories:
  - JavaScript
tags:
  - JavaScript
  - Programming
  - Asynchronous Programming
  - Promises
toc: false
toc_sticky: false
draft: true
---

Being new to JavaScript has these things. I'm sure you understand what an async function is and how asynchronicity works in JavaScript. A key difference from all other languages is the use of Promise.

> A Promise is an object that will produce a single value some time in the future.

Async/await function won't do it for you always, trust me. You'll have to grasp these concepts sooner or later and know when to apply them.

## Callback Example: Navigating the Asynchronous Waters

Before Promises, JavaScript had callbacks! Consider this simple callback example where we fetch some data asynchronously:

```javascript
function fetchData(callback) {
  // Simulating an asynchronous operation
  setTimeout(() => {
    const data = 'Callback Example';
    callback(data);
  }, 1000);
}

// Using the callback
fetchData((result) => {
  console.log('Data:', result);
});
```

Callbacks have been our go-to solution for handling asynchronous operations. They work, but as our code grows, nesting callbacks lead to less readable and harder-to-maintain code.

## The Birth of Promises

JavaScript Promises are like the unsung heroes of asynchronous programming. They provide a cleaner syntax and a more structured approach to handling asynchronous tasks. No more callback hell (google it, have some fun) – just a clean and organized flow of code.

Imagine you're fetching data from an API. With Promises, you can initiate the request and continue with other tasks without blocking the execution. Once the data is ready, the Promise resolves, and you gracefully handle the result.

```javascript
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const data = { message: 'Promises are awesome!' };
    resolve(data);
  }, 2000);
});

fetchData
  .then((data) => console.log(data.message))
  .finally(() => console.log('Promise settled, moving on!'));
```

## Taming the Beast: Promise.all() and Promise.allSettled()

Now, let's talk about `Promise.all()` and `Promise.allSettled()`, two invaluable tools in the developer's toolkit. These functions come to the rescue when dealing with multiple Promises, saving you from the dreaded callback hell.

### Promise.all()

When you have an array of Promises and want to wait for all of them to resolve, `Promise.all()` is your go-to hero. It takes an iterable of Promises as an input and returns a single Promise that resolves to an array of the results. But beware, if any of the Promises reject, the entire operation is rejected.

```javascript
const promise1 = Promise.resolve('One');
const promise2 = Promise.resolve('Two');
const promise3 = Promise.resolve('Three');

Promise.all([promise1, promise2, promise3])
  .then((results) => console.log(results))
  .catch((error) => console.error(error));

// Result:
// ["One", "Two", "Three"]
```

In this example, if any of the promises rejects, the catch block will be triggered.

### Promise.allSettled()

Now, let's talk about `Promise.allSettled()`. This hero is more forgiving than its counterpart. It waits for all the Promises to settle, whether they resolve or reject. It returns an array of objects representing the outcome of each Promise, ensuring that no Promise is left behind.

```javascript
const promise1 = Promise.resolve('One');
const promise2 = Promise.reject('Two');
const promise3 = Promise.resolve('Three');

Promise.allSettled([promise1, promise2, promise3])
  .then((results) => console.log(results))
  .catch((error) => console.error(error));

// Result:
// [ {status: "fulfilled", value: "One"},
//   {status: "rejected", reason: "Two"},
//   {status: "fulfilled", value: "Three"} ]
```

With `Promise.allSettled()`, even if one or more promises reject, you'll get information on all of them without stopping the execution.

## Conclusion

Hope this was helpful for you! Until next time, happy coding, fellow developers! May your Promises always resolve, and your code sail smoothly through the asynchronous seas. See you on the next blog post! 