import { Personality } from "../../types/ModelTypes";

const personalities: Personality[] = [
  {
    name: "billy",
    description:
      "You are a senior developer at a tech company. You are very experienced and have a lot of knowledge about coding, you are a backend expert with strong skills in Python, Ruby, Typescript, and more. You have excellent knowlege about algorithms and data structures.",
  },
  {
    name: "alex",
    description:
      "You are a junior developer at a tech company. You are new to coding and have a basic understanding of Python, Ruby, and Typescript. You are eager to learn and improve your coding skills. However you are still incredibly smart and have a lot of potential.",
  },
  {
    name: "john",
    description:
      "You are a senior at a tech company who is the best algorithm expert. You are new to coding and have a basic understanding of Python, Ruby, and Typescript. You are eager to learn and improve your coding skills. However you are still incredibly smart and have a lot of potential.",
  },
];

const problem: string = `
# Problem: Make String a Subsequence Using Cyclic Increments

You are given two 0-indexed strings \`str1\` and \`str2\`.

In an operation, you select a set of indices in \`str1\`, and for each index \`i\` in the set, increment \`str1[i]\` to the next character cyclically. That is:
- \`'a'\` becomes \`'b'\`
- \`'b'\` becomes \`'c'\`
- ...
- \`'z'\` becomes \`'a'\`

Return \`true\` if it is possible to make \`str2\` a subsequence of \`str1\` by performing **at most one operation**, and \`false\` otherwise.

**Note:**  
A subsequence of a string is a new string formed from the original string by deleting some (possibly none) of the characters without disturbing the relative positions of the remaining characters.

---

## Examples

### Example 1
**Input:**  
\`str1 = "abc", str2 = "ad"\`  
**Output:**  
\`true\`  

**Explanation:**  
- Select index 2 in \`str1\`.  
- Increment \`str1[2]\` to become \`'d'\`.  
- Hence, \`str1\` becomes \`"abd"\`, and \`str2\` is now a subsequence.  

---

### Example 2
**Input:**  
\`str1 = "zc", str2 = "ad"\`  
**Output:**  
\`true\`  

**Explanation:**  
- Select indices 0 and 1 in \`str1\`.  
- Increment \`str1[0]\` to become \`'a'\`.  
- Increment \`str1[1]\` to become \`'d'\`.  
- Hence, \`str1\` becomes \`"ad"\`, and \`str2\` is now a subsequence.  

---

### Example 3
**Input:**  
\`str1 = "ab", str2 = "d"\`  
**Output:**  
\`false\`  

**Explanation:**  
- It is impossible to make \`str2\` a subsequence of \`str1\` using the operation at most once.  

---

## Constraints
- \( 1 \leq \text{str1.length} \leq 10^5 \)
- \( 1 \leq \text{str2.length} \leq 10^5 \)
- \`str1\` and \`str2\` consist of only lowercase English letters.


Here is the code at the moment, edit and return the answer here:

class Solution(object):
    def canMakeSubsequence(self, str1, str2):
        
`;

export { personalities, problem };
