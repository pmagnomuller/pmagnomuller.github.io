---
title: "Sliding Window Algorithm: A Complete Guide to Efficient Array Processing"
date: 2023-10-30
categories:
  - Algorithms
  - Programming
tags:
  - Algorithms
  - Sliding Window
  - Data Structures
  - Programming
  - Problem Solving
toc: true
toc_sticky: false
---

# Sliding Window Algorithm: A Complete Guide to Efficient Array Processing

**Published:** January 15, 2023

## Introduction

The Sliding Window algorithm is one of the most powerful and commonly used techniques in algorithmic problem solving. It's particularly effective for solving problems involving arrays, strings, and sequences where you need to find subarrays or substrings that meet certain criteria. This technique can often reduce time complexity from O(n²) to O(n), making it an essential tool in every programmer's toolkit.

In this comprehensive guide, I'll walk you through the sliding window concept, different types of sliding windows, and how to apply this technique to solve various problems efficiently.

## What is the Sliding Window Algorithm?

The Sliding Window algorithm is a technique that involves maintaining a subset of elements (the "window") that slides through an array or string to solve problems efficiently. Instead of processing all possible subarrays or substrings (which would be O(n²)), we maintain a window and adjust its boundaries based on certain conditions.

### Key Concepts

1. **Window**: A contiguous subset of elements from the array/string
2. **Window Size**: Can be fixed or variable
3. **Sliding**: Moving the window's start and end pointers
4. **Conditions**: Rules that determine when to expand or contract the window

## Types of Sliding Windows

### 1. Fixed-Size Window

The window maintains a constant size as it slides through the array.

### 2. Variable-Size Window

The window size changes based on certain conditions (usually expanding and contracting).

## Fixed-Size Window Problems

### Problem 1: Maximum Sum of K Consecutive Elements

**Problem**: Find the maximum sum of k consecutive elements in an array.

```python
def max_sum_k_elements(arr, k):
    """
    Find maximum sum of k consecutive elements.
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if len(arr) < k:
        return None
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        # Add new element and remove first element of previous window
        window_sum = window_sum + arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Example usage
arr = [1, 4, 2, 10, 2, 3, 1, 0, 20]
k = 4
result = max_sum_k_elements(arr, k)
print(f"Maximum sum of {k} consecutive elements: {result}")
# Output: Maximum sum of 4 consecutive elements: 24
```

### Problem 2: First Negative Number in Every Window of Size K

```python
def first_negative_in_window(arr, k):
    """
    Find first negative number in every window of size k.
    Time Complexity: O(n)
    Space Complexity: O(k) in worst case
    """
    if len(arr) < k:
        return []
    
    result = []
    negative_indices = []
    
    # Process first window
    for i in range(k):
        if arr[i] < 0:
            negative_indices.append(i)
    
    # Add result for first window
    if negative_indices:
        result.append(arr[negative_indices[0]])
    else:
        result.append(0)
    
    # Slide the window
    for i in range(k, len(arr)):
        # Remove elements that are no longer in the window
        while negative_indices and negative_indices[0] <= i - k:
            negative_indices.pop(0)
        
        # Add new element if it's negative
        if arr[i] < 0:
            negative_indices.append(i)
        
        # Add result for current window
        if negative_indices:
            result.append(arr[negative_indices[0]])
        else:
            result.append(0)
    
    return result

# Example usage
arr = [12, -1, -7, 8, -15, 30, 16, 28]
k = 3
result = first_negative_in_window(arr, k)
print(f"First negative in each window of size {k}: {result}")
# Output: First negative in each window of size 3: [-1, -1, -7, -15, 0, 0]
```

## Variable-Size Window Problems

### Problem 3: Smallest Subarray with Sum >= Target

**Problem**: Find the smallest subarray with sum greater than or equal to a target value.

```python
def smallest_subarray_with_sum(arr, target):
    """
    Find smallest subarray with sum >= target.
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if not arr:
        return 0
    
    min_length = float('inf')
    window_sum = 0
    window_start = 0
    
    for window_end in range(len(arr)):
        # Add current element to window
        window_sum += arr[window_end]
        
        # Try to shrink the window from the start
        while window_sum >= target:
            min_length = min(min_length, window_end - window_start + 1)
            window_sum -= arr[window_start]
            window_start += 1
    
    return min_length if min_length != float('inf') else 0

# Example usage
arr = [2, 1, 5, 2, 3, 2]
target = 7
result = smallest_subarray_with_sum(arr, target)
print(f"Smallest subarray with sum >= {target}: {result}")
# Output: Smallest subarray with sum >= 7: 2
```

### Problem 4: Longest Substring Without Repeating Characters

```python
def longest_substring_without_repeating(s):
    """
    Find longest substring without repeating characters.
    Time Complexity: O(n)
    Space Complexity: O(min(m, n)) where m is charset size
    """
    if not s:
        return 0
    
    char_map = {}
    max_length = 0
    window_start = 0
    
    for window_end in range(len(s)):
        # If character is already in window, move start pointer
        if s[window_end] in char_map and char_map[s[window_end]] >= window_start:
            window_start = char_map[s[window_end]] + 1
        
        # Update character position
        char_map[s[window_end]] = window_end
        
        # Update max length
        max_length = max(max_length, window_end - window_start + 1)
    
    return max_length

# Example usage
s = "abcabcbb"
result = longest_substring_without_repeating(s)
print(f"Longest substring without repeating characters: {result}")
# Output: Longest substring without repeating characters: 3
```

### Problem 5: Minimum Window Substring

**Problem**: Find the smallest substring in s that contains all characters from t.

```python
def min_window_substring(s, t):
    """
    Find minimum window substring containing all characters from t.
    Time Complexity: O(n)
    Space Complexity: O(k) where k is the size of charset
    """
    if not s or not t:
        return ""
    
    # Count characters in t
    target_count = {}
    for char in t:
        target_count[char] = target_count.get(char, 0) + 1
    
    # Variables for sliding window
    window_start = 0
    min_length = float('inf')
    min_start = 0
    matched = 0
    required = len(target_count)
    window_count = {}
    
    for window_end in range(len(s)):
        char = s[window_end]
        
        # Add character to window
        window_count[char] = window_count.get(char, 0) + 1
        
        # Check if this character helps in matching
        if char in target_count and window_count[char] == target_count[char]:
            matched += 1
        
        # Try to shrink window from start
        while matched == required:
            # Update minimum window
            current_length = window_end - window_start + 1
            if current_length < min_length:
                min_length = current_length
                min_start = window_start
            
            # Remove character from start of window
            start_char = s[window_start]
            window_count[start_char] -= 1
            
            # Check if removing this character breaks the match
            if start_char in target_count and window_count[start_char] < target_count[start_char]:
                matched -= 1
            
            window_start += 1
    
    return s[min_start:min_start + min_length] if min_length != float('inf') else ""

# Example usage
s = "ADOBECODEBANC"
t = "ABC"
result = min_window_substring(s, t)
print(f"Minimum window substring: '{result}'")
# Output: Minimum window substring: 'BANC'
```

## Advanced Sliding Window Problems

### Problem 6: Longest Substring with At Most K Distinct Characters

```python
def longest_substring_k_distinct(s, k):
    """
    Find longest substring with at most k distinct characters.
    Time Complexity: O(n)
    Space Complexity: O(k)
    """
    if not s or k == 0:
        return 0
    
    char_count = {}
    max_length = 0
    window_start = 0
    
    for window_end in range(len(s)):
        # Add current character
        char_count[s[window_end]] = char_count.get(s[window_end], 0) + 1
        
        # Shrink window if we have more than k distinct characters
        while len(char_count) > k:
            start_char = s[window_start]
            char_count[start_char] -= 1
            
            if char_count[start_char] == 0:
                del char_count[start_char]
            
            window_start += 1
        
        # Update max length
        max_length = max(max_length, window_end - window_start + 1)
    
    return max_length

# Example usage
s = "eceba"
k = 2
result = longest_substring_k_distinct(s, k)
print(f"Longest substring with at most {k} distinct characters: {result}")
# Output: Longest substring with at most 2 distinct characters: 3
```

### Problem 7: Subarray Sum Equals K

```python
def subarray_sum_equals_k(nums, k):
    """
    Find number of subarrays with sum equal to k.
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    count = 0
    prefix_sum = 0
    sum_count = {0: 1}  # Initialize with sum 0 appearing once
    
    for num in nums:
        prefix_sum += num
        
        # If (prefix_sum - k) exists in our map, we found a subarray
        if prefix_sum - k in sum_count:
            count += sum_count[prefix_sum - k]
        
        # Update the count of current prefix sum
        sum_count[prefix_sum] = sum_count.get(prefix_sum, 0) + 1
    
    return count

# Example usage
nums = [1, 1, 1]
k = 2
result = subarray_sum_equals_k(nums, k)
print(f"Number of subarrays with sum {k}: {result}")
# Output: Number of subarrays with sum 2: 2
```

## Sliding Window with Two Pointers

### Problem 8: Container With Most Water

```python
def max_area(height):
    """
    Find container with most water using two pointers.
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    max_area = 0
    left = 0
    right = len(height) - 1
    
    while left < right:
        # Calculate area
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        
        max_area = max(max_area, area)
        
        # Move the pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area

# Example usage
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
result = max_area(height)
print(f"Maximum area: {result}")
# Output: Maximum area: 49
```

## Sliding Window in Strings

### Problem 9: Find All Anagrams in a String

```python
def find_anagrams(s, p):
    """
    Find all start indices of p's anagrams in s.
    Time Complexity: O(n)
    Space Complexity: O(k) where k is the size of charset
    """
    if len(s) < len(p):
        return []
    
    result = []
    p_count = {}
    s_count = {}
    
    # Count characters in pattern
    for char in p:
        p_count[char] = p_count.get(char, 0) + 1
    
    # Initialize window
    for i in range(len(p)):
        s_count[s[i]] = s_count.get(s[i], 0) + 1
    
    # Check first window
    if s_count == p_count:
        result.append(0)
    
    # Slide window
    for i in range(len(p), len(s)):
        # Add new character
        s_count[s[i]] = s_count.get(s[i], 0) + 1
        
        # Remove old character
        s_count[s[i - len(p)]] -= 1
        if s_count[s[i - len(p)]] == 0:
            del s_count[s[i - len(p)]]
        
        # Check if current window is an anagram
        if s_count == p_count:
            result.append(i - len(p) + 1)
    
    return result

# Example usage
s = "cbaebabacd"
p = "abc"
result = find_anagrams(s, p)
print(f"Anagram start indices: {result}")
# Output: Anagram start indices: [0, 6]
```

## Optimization Techniques

### 1. Early Termination

```python
def optimized_sliding_window(arr, target):
    """
    Optimized sliding window with early termination.
    """
    if not arr:
        return 0
    
    min_length = float('inf')
    window_sum = 0
    window_start = 0
    
    for window_end in range(len(arr)):
        window_sum += arr[window_end]
        
        # Early termination if we find a single element >= target
        if arr[window_end] >= target:
            return 1
        
        while window_sum >= target:
            min_length = min(min_length, window_end - window_start + 1)
            window_sum -= arr[window_start]
            window_start += 1
    
    return min_length if min_length != float('inf') else 0
```

### 2. Using Deque for Maximum/Minimum in Window

```python
from collections import deque

def max_in_sliding_window(arr, k):
    """
    Find maximum element in each sliding window of size k.
    Time Complexity: O(n)
    Space Complexity: O(k)
    """
    if not arr or k <= 0:
        return []
    
    result = []
    dq = deque()
    
    # Process first window
    for i in range(k):
        while dq and arr[dq[-1]] <= arr[i]:
            dq.pop()
        dq.append(i)
    
    # Process remaining windows
    for i in range(k, len(arr)):
        result.append(arr[dq[0]])
        
        # Remove elements outside current window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove smaller elements
        while dq and arr[dq[-1]] <= arr[i]:
            dq.pop()
        
        dq.append(i)
    
    result.append(arr[dq[0]])
    return result

# Example usage
arr = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
result = max_in_sliding_window(arr, k)
print(f"Maximum in each window of size {k}: {result}")
# Output: Maximum in each window of size 3: [3, 3, 5, 5, 6, 7]
```

## Common Patterns and Templates

### Template 1: Fixed-Size Window

```python
def fixed_window_template(arr, k):
    """
    Template for fixed-size sliding window problems.
    """
    if len(arr) < k:
        return None
    
    # Initialize first window
    window_sum = sum(arr[:k])
    result = window_sum  # or appropriate initial value
    
    # Slide window
    for i in range(k, len(arr)):
        window_sum = window_sum + arr[i] - arr[i - k]
        result = update_result(result, window_sum)  # max, min, etc.
    
    return result
```

### Template 2: Variable-Size Window

```python
def variable_window_template(arr, target):
    """
    Template for variable-size sliding window problems.
    """
    window_start = 0
    window_sum = 0
    result = 0  # or appropriate initial value
    
    for window_end in range(len(arr)):
        # Expand window
        window_sum += arr[window_end]
        
        # Contract window based on condition
        while window_sum >= target:  # or other condition
            result = update_result(result, window_end - window_start + 1)
            window_sum -= arr[window_start]
            window_start += 1
    
    return result
```

## Best Practices

### 1. **Choose the Right Window Type**
- Use fixed-size window for problems requiring specific subarray size
- Use variable-size window for optimization problems

### 2. **Handle Edge Cases**
```python
def handle_edge_cases(arr, k):
    if not arr:
        return None
    if k <= 0:
        return None
    if len(arr) < k:
        return None
    # ... rest of logic
```

### 3. **Optimize Space Usage**
```python
# Use sets instead of dictionaries when order doesn't matter
# Use single variables instead of arrays when possible
# Reuse variables instead of creating new ones
```

### 4. **Consider Time Complexity**
- Most sliding window problems can be solved in O(n) time
- Be careful with nested loops that might make it O(n²)

## Conclusion

The Sliding Window algorithm is a powerful technique that can significantly improve the efficiency of array and string processing problems. By maintaining a window and adjusting its boundaries based on specific conditions, we can often achieve O(n) time complexity instead of O(n²).

**Key Takeaways:**
1. **Understand the window concept** - whether it's fixed or variable size
2. **Identify the right conditions** for expanding and contracting the window
3. **Handle edge cases** properly
4. **Optimize for both time and space** complexity
5. **Practice with different problem types** to build intuition

Remember: **The sliding window technique is particularly effective when you need to find subarrays or substrings that meet certain criteria.** With practice, you'll be able to identify when this technique is applicable and implement it efficiently.

---

*The sliding window algorithm is a fundamental technique that every programmer should master. It's not just about solving specific problems - it's about thinking efficiently about array and string processing.*
