// ============================================================
// Debugging practice — find and fix the bugs
// Run with: node debug.js
//
// Each section has an EXPECTED result in a comment.
// Compare that to what actually prints. Fix the code until
// every section matches. Difficulty goes: Easy → Medium → Hard.
//
// Tips:
//   - Read the error message carefully (line number + type).
//   - Use console.log to inspect values mid-function.
//   - try/catch around each task keeps later tasks running;
//     remove the wrappers once you are comfortable.
// ============================================================

"use strict";

console.log("=== DEBUGGING PRACTICE ===\n");

function check(label, actual, expected) {
  const actualText = typeof actual === "object" ? JSON.stringify(actual) : String(actual);
  const expectedText = typeof expected === "object" ? JSON.stringify(expected) : String(expected);
  const ok = actualText === expectedText;
  console.log(
    (ok ? "PASS" : "FAIL") + " " + label,
    "| got:",
    actual,
    "| expected:",
    expected
  );
}

/* ============================================================
   LEVEL 1 — EASY
   Typos, wrong operators, missing returns, simple if mistakes.
   ============================================================ */

console.log("--- Level 1: Easy ---\n");

// 1A. Expected: 15
try {
  function add(a, b) {
    a + b;
  }
  check("1A add(7, 8)", add(7, 8), 15);
} catch (error) {
  console.log("FAIL 1A threw:", error.message);
}

// 1B. Expected: "Ada Lovelace"
try {
  function fullName(first, last) {
    return first + " " + Last;
  }
  check("1B fullName", fullName("Ada", "Lovelace"), "Ada Lovelace");
} catch (error) {
  console.log("FAIL 1B threw:", error.message);
}

// 1C. Expected: true when age is 18 or more
try {
  function canVote(age) {
    if (age > 18) {
      return true;
    } else {
      return false;
    }
  }
  check("1C canVote(18)", canVote(18), true);
} catch (error) {
  console.log("FAIL 1C threw:", error.message);
}

// 1D. Expected: "even" for even numbers, "odd" for odd
try {
  function parity(n) {
    if (n % 2 === 1) {
      return "even";
    }
    return "odd";
  }
  check("1D parity(4)", parity(4), "even");
  check("1D parity(7)", parity(7), "odd");
} catch (error) {
  console.log("FAIL 1D threw:", error.message);
}

// 1E. Expected: 3 (how many scores are above 50)
try {
  const scores = [40, 55, 90, 12, 70];
  let aboveFifty = 0;
  for (let i = 0; i < scores.length - 1; i++) {
    if (scores[i] > 50) {
      aboveFifty = aboveFifty + 1;
    }
  }
  check("1E aboveFifty", aboveFifty, 3);
} catch (error) {
  console.log("FAIL 1E threw:", error.message);
}

/* ============================================================
   LEVEL 2 — MEDIUM
   Type coercion, loops, arrays, objects — wrong results, few throws.
   ============================================================ */

console.log("\n--- Level 2: Medium ---\n");

// 2A. Expected: 100 (the number), not "5050"
try {
  function doubleAsNumber(value) {
    return value + value;
  }
  check("2A doubleAsNumber('50')", doubleAsNumber("50"), 100);
} catch (error) {
  console.log("FAIL 2A threw:", error.message);
}

// 2B. Expected: ["red", "green", "blue", "yellow"]
try {
  const colors = ["red", "green", "blue"];
  colors[colors.length + 1] = "yellow";
  check("2B colors", colors, ["red", "green", "blue", "yellow"]);
} catch (error) {
  console.log("FAIL 2B threw:", error.message);
}

// 2C. Expected: sum of 1+2+3+4+5 = 15
try {
  function sumTo(n) {
    let total = 0;
    let i = 1;
    while (i < n) {
      total = total + i;
      i = i + 1;
    }
    return total;
  }
  check("2C sumTo(5)", sumTo(5), 15);
} catch (error) {
  console.log("FAIL 2C threw:", error.message);
}

// 2D. Expected: "Hi, Ada"
try {
  const person = {
    name: "Ada",
    age: 36,
  };
  function greet(user) {
    return "Hi, " + user.Name;
  }
  check("2D greet(person)", greet(person), "Hi, Ada");
} catch (error) {
  console.log("FAIL 2D threw:", error.message);
}

// 2E. Expected: only active members → ["Sam", "Riley"]
try {
  const members = [
    { name: "Sam", active: true },
    { name: "Jordan", active: false },
    { name: "Riley", active: true },
  ];
  const activeNames = [];
  for (let i = 0; i < members.length; i++) {
    if (members[i].active = true) {
      activeNames[activeNames.length] = members[i].name;
    }
  }
  check("2E activeNames", activeNames, ["Sam", "Riley"]);
} catch (error) {
  console.log("FAIL 2E threw:", error.message);
}

// 2F. Expected: false — number 2 and string "2" are different values
try {
  function includesItem(list, item) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] == item) {
        return true;
      }
    }
    return false;
  }
  check('2F includesItem([1, 2, 3], "2")', includesItem([1, 2, 3], "2"), false);
} catch (error) {
  console.log("FAIL 2F threw:", error.message);
}

/* ============================================================
   LEVEL 3 — HARD
   Mutation, shared references, scope, edge cases.
   Output often looks "almost right".
   ============================================================ */

console.log("\n--- Level 3: Hard ---\n");

// 3A. Expected: 18 → (5*2) + (2*4)
try {
  function cartTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total = items[i].price + items[i].qty;
    }
    return total;
  }
  const cart = [
    { name: "Notebook", price: 5, qty: 2 },
    { name: "Pen", price: 2, qty: 4 },
  ];
  check("3A cartTotal", cartTotal(cart), 18);
} catch (error) {
  console.log("FAIL 3A threw:", error.message);
}

// 3B. Expected: sale prices 5 and 10; inventory stays 10 and 20
try {
  function discountPrices(products, percentOff) {
    const discounted = products;
    for (let i = 0; i < discounted.length; i++) {
      discounted[i].price = discounted[i].price * (1 - percentOff / 100);
    }
    return discounted;
  }
  const inventory = [
    { id: 1, price: 10 },
    { id: 2, price: 20 },
  ];
  const sale = discountPrices(inventory, 50);
  // sale prices should be 5 and 10, AND inventory should stay 10 and 20
  check(
    "3B sale + inventory",
    [sale[0].price, sale[1].price, inventory[0].price, inventory[1].price],
    [5, 10, 10, 20]
  );
} catch (error) {
  console.log("FAIL 3B threw:", error.message);
}

// 3C. Expected: 4 for [2,4,6]; null for []
try {
  function average(nums) {
    let total = 0;
    for (let i = 0; i < nums.length; i++) {
      total = total + nums[i];
    }
    return total / nums.length;
  }
  check("3C average([])", average([]), null);
} catch (error) {
  console.log("FAIL 3C threw:", error.message);
}

// 3D. Expected: reversed copy; original order unchanged
try {
  function reversedCopy(list) {
    const result = list;
    for (let i = 0; i < Math.floor(result.length / 2); i++) {
      const other = result.length - 1 - i;
      const temp = result[i];
      result[i] = result[other];
      result[other] = temp;
    }
    return result;
  }
  const order = ["first", "second", "third"];
  const backwards = reversedCopy(order);
  // backwards should be reversed, AND order should stay in its original order
  check("3D backwards + order", [backwards, order], [
    ["third", "second", "first"],
    ["first", "second", "third"],
  ]);
} catch (error) {
  console.log("FAIL 3D threw:", error.message);
}

// 3E. Expected: task object for "b2"; null for "z9"
try {
  function findTask(tasks, id) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        return tasks[i];
      } else {
        return null;
      }
    }
  }
  const tasks = [
    { id: "a1", title: "Write brief" },
    { id: "b2", title: "Design layout" },
    { id: "c3", title: "Ship feature" },
  ];
  // "b2" should return its task, AND "z9" should return null
  check(
    "3E findTask b2 + z9",
    [findTask(tasks, "b2"), findTask(tasks, "z9")],
    [{ id: "b2", title: "Design layout" }, null]
  );
} catch (error) {
  console.log("FAIL 3E threw:", error.message);
}

// 3F. Expected: 3 completed tasks
try {
  function countDone(taskList) {
    let count = 0;
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].done) {
        count + 1;
      }
    }
    return count;
  }
  const sprint = [
    { title: "Login", done: true },
    { title: "Dashboard", done: false },
    { title: "Settings", done: true },
    { title: "Logout", done: true },
  ];
  check("3F countDone", countDone(sprint), 3);
} catch (error) {
  console.log("FAIL 3F threw:", error.message);
}

/* ============================================================
   LEVEL 4 — CHALLENGE
   Several interacting mistakes in one function.
   ============================================================ */

console.log("\n--- Level 4: Challenge ---\n");

// Expected for getReport(students):
// {
//   total: 3,
//   passing: 2,
//   names: ["Ada", "Lin"],
//   averageScore: 80
// }
// Passing means score >= 60.
// averageScore is the average of ALL students, rounded down.
// If students is empty:
// { total: 0, passing: 0, names: [], averageScore: null }

try {
  function getReport(students) {
    const report = {
      total: students.length,
      passing: 0,
      names: [],
      averageScore: 0,
    };

    if (students.length === 0) {
      return report;
    }

    let scoreSum = 0;
    for (let i = 0; i <= students.length; i++) {
      const student = students[i];
      scoreSum = scoreSum + student.score;

      if (student.score > 60) {
        report.passing = report.passing + 1;
        report.names[report.names.length] = student.Name;
      }
    }

    report.averageScore = scoreSum / students.length;
    return report;
  }

  const cohort = [
    { name: "Ada", score: 90 },
    { name: "Grace", score: 55 },
    { name: "Lin", score: 95 },
  ];

  check("4 getReport(cohort)", getReport(cohort), {
    total: 3,
    passing: 2,
    names: ["Ada", "Lin"],
    averageScore: 80,
  });
  check("4 getReport([])", getReport([]), {
    total: 0,
    passing: 0,
    names: [],
    averageScore: null,
  });
} catch (error) {
  console.log("FAIL 4 threw:", error.message);
}

console.log("\n=== Fix until every line says PASS ===");
