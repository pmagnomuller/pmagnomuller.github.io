---
title: "Python Mutable Arguments: The Source of All Evil and How to Avoid Them"
date: 2023-02-15
toc_sticky: false
---




Python's mutable default arguments are one of the most notorious gotchas in the language, causing unexpected behavior that can lead to bugs that are difficult to debug. This issue is so common that it's often referred to as "the source of all evil" in Python. In this comprehensive guide, I'll explain what mutable default arguments are, why they cause problems, and how to avoid them.

## What are Mutable Default Arguments?

In Python, when you define a function with a default argument that is a mutable object (like a list, dictionary, or set), that default value is created only once when the function is defined, not each time the function is called.

### The Problem

```python
# THE PROBLEMATIC CODE
def add_item(item, items=[]):
    items.append(item)
    return items

# Let's test it
print(add_item('apple'))  # ['apple']
print(add_item('banana'))  # ['apple', 'banana'] - Wait, what?
print(add_item('cherry'))  # ['apple', 'banana', 'cherry'] - Oh no!
```

### Why This Happens

The issue occurs because:
1. **Default arguments are evaluated at function definition time**, not at call time
2. **Mutable objects are shared** across all function calls
3. **Modifications persist** between function calls

## Understanding the Problem Deeply

### 1. Function Definition vs Function Call

```python
# This happens at FUNCTION DEFINITION time
def bad_function(items=[]):
    print(f"Default items id: {id(items)}")
    items.append('new_item')
    return items

# These happen at FUNCTION CALL time
print(bad_function())  # Default items id: 140234567890123, ['new_item']
print(bad_function())  # Default items id: 140234567890123, ['new_item', 'new_item']
print(bad_function())  # Default items id: 140234567890123, ['new_item', 'new_item', 'new_item']
```

### 2. The Same Object is Reused

```python
def demonstrate_mutable_default():
    def bad_func(items=[]):
        print(f"Items: {items}, ID: {id(items)}")
        items.append('x')
        return items
    
    # First call
    result1 = bad_func()
    print(f"Result 1: {result1}, ID: {id(result1)}")
    
    # Second call
    result2 = bad_func()
    print(f"Result 2: {result2}, ID: {id(result2)}")
    
    # They're the same object!
    print(f"Same object? {result1 is result2}")  # True

demonstrate_mutable_default()
```

## Common Mutable Default Arguments

### 1. Lists

```python
# BAD: Mutable list as default
def process_items(items=[]):
    items.append('processed')
    return items

# GOOD: None as default
def process_items(items=None):
    if items is None:
        items = []
    items.append('processed')
    return items
```

### 2. Dictionaries

```python
# BAD: Mutable dict as default
def update_config(config={}):
    config['last_updated'] = 'now'
    return config

# GOOD: None as default
def update_config(config=None):
    if config is None:
        config = {}
    config['last_updated'] = 'now'
    return config
```

### 3. Sets

```python
# BAD: Mutable set as default
def add_to_collection(item, collection=set()):
    collection.add(item)
    return collection

# GOOD: None as default
def add_to_collection(item, collection=None):
    if collection is None:
        collection = set()
    collection.add(item)
    return collection
```

### 4. Custom Objects

```python
# BAD: Custom object as default
class Config:
    def __init__(self):
        self.settings = {}

def update_settings(config=Config()):
    config.settings['updated'] = True
    return config

# GOOD: None as default
def update_settings(config=None):
    if config is None:
        config = Config()
    config.settings['updated'] = True
    return config
```

## The Correct Solutions

### 1. Use None as Default

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# Test it
print(add_item('apple'))    # ['apple']
print(add_item('banana'))   # ['banana'] - Correct!
print(add_item('cherry'))   # ['cherry'] - Correct!
```

### 2. Use Immutable Defaults

```python
# Good: Immutable defaults
def create_user(name, age=0, is_active=True):
    return {'name': name, 'age': age, 'active': is_active}

def calculate_total(items, tax_rate=0.1):
    return sum(items) * (1 + tax_rate)
```

### 3. Use Factory Functions

```python
from typing import List, Dict, Set

def create_empty_list() -> List:
    return []

def create_empty_dict() -> Dict:
    return {}

def create_empty_set() -> Set:
    return set()

def add_item(item, items=None):
    if items is None:
        items = create_empty_list()
    items.append(item)
    return items
```

## Advanced Patterns

### 1. Using `functools.partial`

```python
from functools import partial

def process_with_default(items, default_items=None):
    if default_items is None:
        default_items = []
    return items + default_items

# Create specialized versions
process_with_apples = partial(process_with_default, default_items=['apple'])
process_with_bananas = partial(process_with_default, default_items=['banana'])

print(process_with_apples(['orange']))  # ['orange', 'apple']
print(process_with_bananas(['orange']))  # ['orange', 'banana']
```

### 2. Using Type Hints with Defaults

```python
from typing import List, Optional

def add_item(item: str, items: Optional[List[str]] = None) -> List[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

### 3. Using Dataclasses

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class ShoppingCart:
    items: List[str] = field(default_factory=list)
    
    def add_item(self, item: str):
        self.items.append(item)
        return self

# Usage
cart1 = ShoppingCart()
cart1.add_item('apple')

cart2 = ShoppingCart()
cart2.add_item('banana')

print(cart1.items)  # ['apple']
print(cart2.items)  # ['banana'] - Correct!
```

## Real-World Examples

### 1. Configuration Management

```python
# BAD: Mutable default
def load_config(config={}):
    config['loaded'] = True
    return config

# GOOD: Immutable default
def load_config(config=None):
    if config is None:
        config = {}
    config['loaded'] = True
    return config

# Usage
config1 = load_config()
config2 = load_config()

print(config1)  # {'loaded': True}
print(config2)  # {'loaded': True} - Different objects
```

### 2. Caching Functions

```python
# BAD: Mutable default
def expensive_calculation(n, cache=[]):
    if n < len(cache):
        return cache[n]
    
    result = n * n  # Expensive calculation
    cache.append(result)
    return result

# GOOD: None as default
def expensive_calculation(n, cache=None):
    if cache is None:
        cache = []
    
    if n < len(cache):
        return cache[n]
    
    result = n * n  # Expensive calculation
    cache.append(result)
    return result
```

### 3. API Response Processing

```python
# BAD: Mutable default
def process_response(data, processed_data=[]):
    processed_data.append(data)
    return processed_data

# GOOD: None as default
def process_response(data, processed_data=None):
    if processed_data is None:
        processed_data = []
    processed_data.append(data)
    return processed_data
```

## Debugging Mutable Default Arguments

### 1. Identifying the Problem

```python
def debug_mutable_default():
    def problematic_function(items=[]):
        print(f"Function called with items: {items}")
        print(f"Items ID: {id(items)}")
        items.append('debug_item')
        return items
    
    print("First call:")
    result1 = problematic_function()
    
    print("\nSecond call:")
    result2 = problematic_function()
    
    print(f"\nSame object? {result1 is result2}")
    print(f"Result 1: {result1}")
    print(f"Result 2: {result2}")

debug_mutable_default()
```

### 2. Using Inspection

```python
import inspect

def inspect_function_defaults(func):
    signature = inspect.signature(func)
    for name, param in signature.parameters.items():
        if param.default is not inspect.Parameter.empty:
            print(f"{name}: {param.default} (type: {type(param.default)})")

# Example
def bad_function(items=[], config={}):
    pass

inspect_function_defaults(bad_function)
```

## Best Practices

### 1. Always Use None for Mutable Defaults

```python
# ✅ GOOD
def process_data(data=None):
    if data is None:
        data = []
    # Process data
    return data

# ❌ BAD
def process_data(data=[]):
    # Process data
    return data
```

### 2. Use Type Hints

```python
from typing import List, Dict, Optional

def process_items(items: Optional[List[str]] = None) -> List[str]:
    if items is None:
        items = []
    return items
```

### 3. Document Your Functions

```python
def add_to_collection(item: str, collection: Optional[List[str]] = None) -> List[str]:
    """
    Add an item to a collection.
    
    Args:
        item: The item to add
        collection: The collection to add to. If None, creates a new list.
    
    Returns:
        The updated collection
    """
    if collection is None:
        collection = []
    collection.append(item)
    return collection
```

### 4. Use Dataclasses for Complex Defaults

```python
from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class UserPreferences:
    favorite_colors: List[str] = field(default_factory=list)
    settings: Dict[str, str] = field(default_factory=dict)
```

## Common Pitfalls to Avoid

### 1. Nested Functions

```python
# BAD: Mutable default in nested function
def outer_function():
    def inner_function(items=[]):
        items.append('item')
        return items
    return inner_function

# GOOD: Use None
def outer_function():
    def inner_function(items=None):
        if items is None:
            items = []
        items.append('item')
        return items
    return inner_function
```

### 2. Class Methods

```python
# BAD: Mutable default in class method
class DataProcessor:
    def process(self, data=[]):
        data.append('processed')
        return data

# GOOD: Use None
class DataProcessor:
    def process(self, data=None):
        if data is None:
            data = []
        data.append('processed')
        return data
```

### 3. Lambda Functions

```python
# BAD: Mutable default in lambda
bad_lambda = lambda items=[]: items.append('item') or items

# GOOD: Avoid mutable defaults in lambdas
def good_function(items=None):
    if items is None:
        items = []
    items.append('item')
    return items
```

## Testing for Mutable Default Arguments

### 1. Unit Tests

```python
import unittest

class TestMutableDefaults(unittest.TestCase):
    def test_mutable_default_behavior(self):
        def bad_function(items=[]):
            items.append('test')
            return items
        
        # First call
        result1 = bad_function()
        self.assertEqual(result1, ['test'])
        
        # Second call - should be independent but isn't
        result2 = bad_function()
        self.assertEqual(result2, ['test', 'test'])  # This is wrong!
    
    def test_correct_behavior(self):
        def good_function(items=None):
            if items is None:
                items = []
            items.append('test')
            return items
        
        # First call
        result1 = good_function()
        self.assertEqual(result1, ['test'])
        
        # Second call - should be independent
        result2 = good_function()
        self.assertEqual(result2, ['test'])  # Correct!
```

### 2. Static Analysis Tools

```python
# Use tools like pylint, flake8, or mypy
# They can detect mutable default arguments

# Example pylint warning:
# W0102: Dangerous default value [] as argument
```

## Conclusion

Mutable default arguments in Python are indeed a source of confusion and bugs, but they're easily avoidable once you understand the problem and the solutions.

**Key Takeaways:**
1. **Default arguments are evaluated at function definition time**, not call time
2. **Mutable objects are shared** across all function calls
3. **Always use None as default** for mutable arguments
4. **Use type hints** to make your intentions clear
5. **Test your functions** to ensure they behave correctly
6. **Use static analysis tools** to catch these issues early

Remember: **The best defense against mutable default arguments is awareness and consistent use of the None pattern.** Once you make this a habit, you'll avoid this common Python pitfall entirely.

---

*Mutable default arguments might be "the source of all evil" in Python, but with the right knowledge and practices, they become just another thing to be aware of and avoid.*
