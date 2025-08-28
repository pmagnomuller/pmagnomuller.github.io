---
title: "JavaScript Promises: A Complete Guide to Promise.all() vs Promise.allSettled()"
date: 2023-06-27
toc_sticky: false
---



JavaScript Promises are fundamental to modern asynchronous programming, providing a clean way to handle asynchronous operations. Among the most commonly used Promise methods are `Promise.all()` and `Promise.allSettled()`, which both handle multiple promises but behave quite differently. In this comprehensive guide, I'll explain the differences between these methods and when to use each one.

## Understanding Promises

Before diving into the differences, let's quickly review what Promises are and how they work.

### What is a Promise?

A Promise is an object representing the eventual completion (or failure) of an asynchronous operation. It has three states:

```javascript
// Basic Promise example
const myPromise = new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
        const random = Math.random();
        if (random > 0.5) {
            resolve(`Success! Random number: ${random}`);
        } else {
            reject(`Failed! Random number: ${random}`);
        }
    }, 1000);
});

myPromise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

## Promise.all()

### How Promise.all() Works

`Promise.all()` takes an array of promises and returns a single promise that:

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 2000));
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3])
    .then(values => {
        console.log(values); // [3, 'foo', 42]
    })
    .catch(error => {
        console.error('One of the promises failed:', error);
    });
```

### Promise.all() Behavior

```javascript
// Example 1: All promises succeed
const promises1 = [
    Promise.resolve('Success 1'),
    Promise.resolve('Success 2'),
    Promise.resolve('Success 3')
];

Promise.all(promises1)
    .then(results => {
        console.log('All succeeded:', results);
        // Output: ['Success 1', 'Success 2', 'Success 3']
    })
    .catch(error => {
        console.error('Error:', error); // This won't run
    });

// Example 2: One promise fails
const promises2 = [
    Promise.resolve('Success 1'),
    Promise.reject('Error 2'),
    Promise.resolve('Success 3')
];

Promise.all(promises2)
    .then(results => {
        console.log('All succeeded:', results); // This won't run
    })
    .catch(error => {
        console.error('One failed:', error);
        // Output: 'One failed: Error 2'
    });
```

### Use Cases for Promise.all()

1. **When you need ALL operations to succeed**
2. **When the order of results matters**
3. **When you want to fail fast if any operation fails**

```javascript
// Example: Loading user data that depends on all parts
async function loadUserProfile(userId) {
    try {
        const [userInfo, userPosts, userSettings] = await Promise.all([
            fetchUserInfo(userId),
            fetchUserPosts(userId),
            fetchUserSettings(userId)
        ]);
        
        return {
            info: userInfo,
            posts: userPosts,
            settings: userSettings
        };
    } catch (error) {
        console.error('Failed to load user profile:', error);
        throw error;
    }
}
```

## Promise.allSettled()

### How Promise.allSettled() Works

`Promise.allSettled()` takes an array of promises and returns a single promise that:

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => 
    setTimeout(() => reject('foo'), 2000)
);
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        console.log(results);
        // Output:
        // [
        //   { status: 'fulfilled', value: 3 },
        //   { status: 'rejected', reason: 'foo' },
        //   { status: 'fulfilled', value: 42 }
        // ]
    });
```

### Promise.allSettled() Behavior

```javascript
// Example 1: Mixed results
const promises = [
    Promise.resolve('Success 1'),
    Promise.reject('Error 2'),
    Promise.resolve('Success 3'),
    Promise.reject('Error 4')
];

Promise.allSettled(promises)
    .then(results => {
        console.log('All settled:', results);
        // Output:
        // [
        //   { status: 'fulfilled', value: 'Success 1' },
        //   { status: 'rejected', reason: 'Error 2' },
        //   { status: 'fulfilled', value: 'Success 3' },
        //   { status: 'rejected', reason: 'Error 4' }
        // ]
        
        // Process results
        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');
        
        console.log('Successful:', successful.length);
        console.log('Failed:', failed.length);
    });
```

### Use Cases for Promise.allSettled()

1. **When you want to handle partial failures**
2. **When you need to know the status of each operation**
3. **When you want to continue even if some operations fail**

```javascript
// Example: Batch processing with partial failures
async function processBatch(items) {
    const promises = items.map(item => processItem(item));
    
    const results = await Promise.allSettled(promises);
    
    const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
    
    const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);
    
    return {
        successful,
        failed,
        totalProcessed: results.length,
        successRate: successful.length / results.length
    };
}
```

## Key Differences

### 1. **Failure Behavior**

```javascript
// Promise.all() - Fails fast
const promises = [
    Promise.resolve('Success'),
    Promise.reject('Error'),
    Promise.resolve('Success 2')
];

Promise.all(promises)
    .then(results => console.log('Success:', results))
    .catch(error => console.log('Failed:', error));
// Output: Failed: Error

// Promise.allSettled() - Waits for all
Promise.allSettled(promises)
    .then(results => console.log('All settled:', results));
// Output: All settled: [
//   { status: 'fulfilled', value: 'Success' },
//   { status: 'rejected', reason: 'Error' },
//   { status: 'fulfilled', value: 'Success 2' }
// ]
```

### 2. **Return Value Structure**

```javascript
// Promise.all() returns array of values
Promise.all([
    Promise.resolve('A'),
    Promise.resolve('B')
]).then(results => {
    console.log(results); // ['A', 'B']
});

// Promise.allSettled() returns array of result objects
Promise.allSettled([
    Promise.resolve('A'),
    Promise.reject('B')
]).then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 'A' },
    //   { status: 'rejected', reason: 'B' }
    // ]
});
```

### 3. **Error Handling**

```javascript
// Promise.all() - Errors are caught in .catch()
Promise.all([
    Promise.resolve('Success'),
    Promise.reject('Error')
])
.then(results => console.log('Success:', results))
.catch(error => console.log('Caught error:', error));
// Output: Caught error: Error

// Promise.allSettled() - Errors are part of the result
Promise.allSettled([
    Promise.resolve('Success'),
    Promise.reject('Error')
])
.then(results => {
    const errors = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason);
    console.log('Errors found:', errors);
});
// Output: Errors found: ['Error']
```

## Real-World Examples

### 1. **API Calls with Promise.all()**

```javascript
// When you need all data to proceed
async function loadDashboardData() {
    try {
        const [users, posts, analytics] = await Promise.all([
            fetch('/api/users'),
            fetch('/api/posts'),
            fetch('/api/analytics')
        ]);
        
        const [usersData, postsData, analyticsData] = await Promise.all([
            users.json(),
            posts.json(),
            analytics.json()
        ]);
        
        return {
            users: usersData,
            posts: postsData,
            analytics: analyticsData
        };
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Show error message to user
        throw error;
    }
}
```

### 2. **Batch Processing with Promise.allSettled()**

```javascript
// When you want to process items independently
async function processUserUploads(files) {
    const uploadPromises = files.map(file => uploadFile(file));
    
    const results = await Promise.allSettled(uploadPromises);
    
    const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
    
    const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => ({
            file: result.reason.file,
            error: result.reason.message
        }));
    
    return {
        uploaded: successful,
        failed: failed,
        summary: {
            total: results.length,
            successful: successful.length,
            failed: failed.length
        }
    };
}
```

### 3. **Data Validation with Promise.allSettled()**

```javascript
// When you want to collect all validation errors
async function validateFormData(data) {
    const validations = [
        validateEmail(data.email),
        validatePassword(data.password),
        validateUsername(data.username),
        validateAge(data.age)
    ];
    
    const results = await Promise.allSettled(validations);
    
    const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);
    
    const isValid = errors.length === 0;
    
    return {
        isValid,
        errors,
        errorCount: errors.length
    };
}
```

## Performance Considerations

### 1. **Execution Order**

```javascript
// Both methods execute promises in parallel
const promises = [
    new Promise(resolve => setTimeout(() => resolve('A'), 3000)),
    new Promise(resolve => setTimeout(() => resolve('B'), 1000)),
    new Promise(resolve => setTimeout(() => resolve('C'), 2000))
];

// Both will complete in ~3 seconds (not 6 seconds)
Promise.all(promises).then(results => console.log('All:', results));
Promise.allSettled(promises).then(results => console.log('Settled:', results));
```

### 2. **Memory Usage**

```javascript
// Promise.all() might use less memory since it can fail early
// Promise.allSettled() always waits for all promises, potentially using more memory

// For large arrays, consider batching
async function processLargeBatch(items, batchSize = 100) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }
    
    const results = [];
    for (const batch of batches) {
        const batchResults = await Promise.allSettled(
            batch.map(item => processItem(item))
        );
        results.push(...batchResults);
    }
    
    return results;
}
```

## Best Practices

### 1. **Choose the Right Method**

```javascript
// Use Promise.all() when:
// - All operations must succeed
// - You want to fail fast
// - You need the results in order

// Use Promise.allSettled() when:
// - You want to handle partial failures
// - You need to know the status of each operation
// - You want to continue even if some operations fail
```

### 2. **Error Handling Patterns**

```javascript
// Pattern 1: Promise.all() with try-catch
async function criticalOperation() {
    try {
        const results = await Promise.all([
            criticalTask1(),
            criticalTask2(),
            criticalTask3()
        ]);
        return results;
    } catch (error) {
        // Handle any failure
        console.error('Critical operation failed:', error);
        throw error;
    }
}

// Pattern 2: Promise.allSettled() with result processing
async function flexibleOperation() {
    const results = await Promise.allSettled([
        optionalTask1(),
        optionalTask2(),
        optionalTask3()
    ]);
    
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason);
    
    return { successful, failed };
}
```

### 3. **Timeout Handling**

```javascript
// Adding timeout to Promise.all()
function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

async function fetchWithTimeout(urls, timeout = 5000) {
    const promises = urls.map(url => 
        withTimeout(fetch(url), timeout)
    );
    
    try {
        const responses = await Promise.all(promises);
        return responses;
    } catch (error) {
        console.error('Request failed or timed out:', error);
        throw error;
    }
}
```

## Browser Support

### Promise.all()

### Promise.allSettled()

### Polyfill for Older Browsers

```javascript
// Simple polyfill for Promise.allSettled()
if (!Promise.allSettled) {
    Promise.allSettled = function(promises) {
        return Promise.all(
            promises.map(promise => 
                Promise.resolve(promise)
                    .then(value => ({ status: 'fulfilled', value }))
                    .catch(reason => ({ status: 'rejected', reason }))
            )
        );
    };
}
```

## Conclusion

Both `Promise.all()` and `Promise.allSettled()` are powerful tools for handling multiple promises, but they serve different purposes:

**Use Promise.all() when:**

**Use Promise.allSettled() when:**

**Key Takeaways:**
1. **Promise.all()** fails fast and returns values directly
2. **Promise.allSettled()** waits for all and returns status objects
3. **Choose based on your error handling needs**
4. **Consider browser support** for Promise.allSettled()
5. **Use appropriate error handling patterns** for each method

Remember: **The choice between these methods depends on how you want to handle failures in your application.** Understanding the differences will help you write more robust asynchronous code.

---

*Both Promise.all() and Promise.allSettled() are essential tools in the modern JavaScript developer's toolkit. Choose wisely based on your specific use case and error handling requirements.*
