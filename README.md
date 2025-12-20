# CP Insight (Codeforces)

A personal dashboard for **competitive programming lovers**, focused on **reality, not vanity**.

This project analyzes your **Codeforces journey** at the **problem level**, not submission spam or fake motivation numbers.

No LeetCode. Never. Why? Because I hate leetcode.

---

## What this is

A **personal CP diary** where users can:

* Track **problems attempted**
* See how many problems they actually **solved vs struggled**
* Analyze repeated **WA / TLE / MLE**
* Identify **weak topics**
* Maintain **notes per problem**
* Build personalized problem lists

This is not:

* A problem solver
* An algorithm generator
* A leaderboard clone

It’s a mirror.

---

## Current Features

### Dashboard

* Fetches last **100 Codeforces submissions**
* Collapses submissions into **unique problems**
* Shows:

  * Problems attempted
  * Solved vs unsolved
  * Attempts per problem
  * Final verdict per problem
  * First time you saw the problem

---

## Tech Stack

* Frontend: Vanilla JS
* Backend: Node.js
* Database: MongoDB
* API: Codeforces API

Simple on purpose.

---

## Core Logic

Raw CF submissions → collapsed into problems using:

* attempts count
* solved / unsolved
* worst verdict severity
* first seen timestamp

This makes analysis meaningful instead of noisy.

---

## Planned Features

* Notes per problem (multiple notes allowed)
* WA / TLE pattern analysis
* Personal problem lists
* Long-term CP journey tracking
* Brutal weekly/monthly reality checks

---
