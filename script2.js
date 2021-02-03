'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// display movements in UI
const displayMovements = function (movements, sort = false) {
  //empty container before adding new elements through js
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  //loop through movements array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //create html element with changes
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

//calculate and printbalance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

// calculate and display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} EUR`;
};

// computing username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);

// USER LOGS IN
let currentAccount;

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message and first name of owner
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);
  }
});

//TRANSFER EVENT HANDLER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

// Request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// Close account (using findIndex method)
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(`Delete`);

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

//sorting state variable
let sorted = false;

// sorting the movements
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/***********************************************/
/* SIMPLE ARRAY METHODS
/***********************************************/
/* 
//arrays are objects in JS

let arr = ['a', 'b', 'c', 'd', 'e'];

// slice - creates a new array
console.log(arr.slice(2)); //slice returns a new array starting from the index specified
console.log(arr.slice(2, 4)); // element specified by the index is not included
console.log(arr.slice(-2)); //returns last 2 elements
console.log(arr.slice(-1)); //returns last element
console.log(arr.slice(1, -2)); //element specified by the index minus last two elements

console.log(arr.slice()); //shallow copy
console.log([...arr]); //still shallow copy

// splice - changes the orignal array
//console.log(arr.splice(2));
//splice(start index, deletecount)
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// reverse - mutates the orignal array too
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]); //same result

// join
console.log(letters.join(' - '));
 */
/***********************************************/
/* LOOP ARRAY (FOREACH)
/***********************************************/

// you cannot break or continue on forEach
// if needed to break or continue, use for of
/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(`-----for of-------`);
//for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

//array.forEach(function(current element, index, array) {})
console.log(`-----for each-------`);
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`You deposited ${mov}`);
  } else {
    console.log(`You withdrew ${Math.abs(mov)}`);
  }
});
 */
/***********************************************/
/* FOREACH WITH MAPS AND SETS
/***********************************************/
/* 
//on a map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// on a set - key is the same as the value
// use a throwaway variable
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
 */

/***********************************************/
/* CODING CHALLENGE #1
/***********************************************/

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/* 
const checkDogs = function (dogsJulia, dogsKate) {
  console.log(dogsJulia);
  let dogsJuliaCopy = [...dogsJulia].slice(1, -2);
  console.log(dogsJuliaCopy);
  console.log(dogsKate);

  const combined = dogsJuliaCopy.concat(dogsKate);
  console.log(combined);

  combined.forEach(function (dogAge, i) {
    if (dogAge >= 3) {
      console.log(
        `Dog number ${i + 1} is an adult, and is ${dogAge} years old.`
      );
    } else if (dogAge < 3 && dogAge >= 0) {
      console.log(
        `Dog number ${i + 1} is still a puppy, and is ${dogAge} years old.`
      );
    }
  });
};

console.log(`--------TEST DATA 1-----------`);
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
console.log(`--------TEST DATA 2-----------`);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
 */

/***********************************************/
/* MAP / FILTER / REDUCE
/***********************************************/

// map - takes an array, loops over an array, calls a callback function and applies it to every element, then returns a new array containing the results of the callback

// filter - returns a new array of elements that passed a condition

// reduce - reduces all array elements into one value (eg. adding all elements together)

/***********************************************/
/* MAP METHOD
/***********************************************/
/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

//for of comparison
const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
console.log(movementsUSDfor);

//another example with arrow function
const movementDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementDescriptions); */

/***********************************************/
/* FILTER
/***********************************************/

/* const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov, i, arr) {
  return mov > 0;
});

console.log(deposits);

//for of comparison
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

//withdrawals
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
 */

/***********************************************/
/* REDUCE
/***********************************************/
/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//reducing to one value
//items.reduce(function(accumulator, currentEl, index, arra){}, initialValue)
// const balance = movements.reduce(function (accumulator, cur, i, arr) {
//   console.log(`Iteration ${i}: ${accumulator}`);
//   return accumulator + cur;
// }, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

//for of comparison
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// getting maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max); */

/***********************************************/
/* CODING CHALLENGE #2
/***********************************************/

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/* 
//#1
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(dogAge =>
    dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
  );
  console.log(humanAge);

  const atLeast18 = humanAge.filter(age => age >= 18);
  console.log(atLeast18);

  // const average =
  //   atLeast18.reduce((acc, cur) => acc + cur, 0) / atLeast18.length;

  const average = atLeast18.reduce(
    (acc, cur, i, arr) => acc + cur / arr.length,
    0
  );

  return average;
};

console.log(`-------TEST DATA 1 ---------`);
console.log([5, 2, 4, 1, 15, 8, 3]);
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

console.log(`-------TEST DATA 2 ---------`);
console.log([16, 6, 10, 5, 6, 1, 4]);
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
 */

/***********************************************/
/* CHAINING ARRAY METHODS
/***********************************************/
/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
console.log(movements);

const totalDepositUSD = movements
  .filter(mov => mov > 0)
  // .map(mov => mov * eurToUsd)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositUSD);
 */

/***********************************************/
/* CODING CHALLENGE #3
/***********************************************/

//use chaining on challenge 2

/* const calcAverageHumanAge = function (ages) {
  const averageAge = ages
    .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  return averageAge;
};

console.log(`-------TEST DATA 1 ---------`);
console.log([5, 2, 4, 1, 15, 8, 3]);
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

console.log(`-------TEST DATA 2 ---------`);
console.log([16, 6, 10, 5, 6, 1, 4]);
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4])); */

/***********************************************/
/* FIND METHOD
/***********************************************/

// loops in an array to retrieve the first element which satisfies a condition
// setup a condition that makes the returned unique
/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account); */

/***********************************************/
/* SOME AND EVERY
/***********************************************/
/* 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// .includes only checks for equality
console.log(movements);
console.log(movements.includes(-130));

//.some can check a condition and returns boolean
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// every - returns true if every element passes a condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit)); */

/***********************************************/
/* FLAT AND FLATMAP
/***********************************************/
/* 
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); // 2 is a depth argument

//taking all the movements of the accounts and adding them all together
const accountMovements = accounts.map(acc => acc.movements);
console.log(accountMovements);
const allMovements = accountMovements.flat();
console.log(allMovements);
const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//with chaining
const overallBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

// flatMap - only one level deep as a flat
const overallBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
 */

/***********************************************/
/* SORTING ARRAYS
/***********************************************/
/* 
//strings
const owners = ['Juuzo', 'Kaburagi', 'Natsume', 'Tetsuro'];
console.log(owners.sort()); //mutates the original array
console.log(owners);

//Numbers - sort only works correctly on strings
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// return < 0, A, B (keep order)
// return > 0, B, A (switch order)
// ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
console.log(movements);

//other way ascending
movements.sort((a, b) => a - b);
console.log(movements);

//descending
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);

//other way descending
movements.sort((a, b) => b - a);
console.log(movements);
 */

/***********************************************/
/* FILLING ARRAYS
/***********************************************/

/* 
const arr = [1, 2, 3, 4, 5, 6, 7];

const x = new Array(7);
console.log(x); // an array of 7 empty slots

//x.fill(1); // fills the original array with seven 1's
console.log(x);

// empty arrays + fill method
// x.fill(what to fill, start index, last index not included)
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

// '_' -> parameter is not used
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// array.from on iterables
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('EUR', '')
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
});
 */

/***********************************************/
/* WHICH ARRAY METHOD TO USE?
/***********************************************/

// MUTATE the original array: push, unshift, pop, shift, splice, reverse, sort, fill

// RETURN A NEW ARRAY - map, filter, slice, concat, flat, flatmap

// return an array index - index / findIndex
// return an array element - find

// to know if an array includes - includes, some, every

// return a new string - join,

// to transform to a single value - reduce
// to just loop array - forEach

/***********************************************/
/* CODING CHALLENGE #4
/***********************************************/

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

recommendedFood = weight ** 0.75 * 28
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account); 

GOOD LUCK 😀
*/

/* 
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1.
dogs.forEach(function (dog, i, arr) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});

//2. current > (recommended * 0.90) && current < (recommended * 1.10)
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
let foodScale;
if (sarahDog.curFood > sarahDog.recommendedFood) {
  foodScale = 'too much';
} else if (sarahDog.curFood < sarahDog.recommendedFood) {
  foodScale = 'too little';
} else if (
  sarahDog.curFood > sarahDog.recommendedFood * 0.9 &&
  sarahDog.curFood < sarahDog.recommendedFood * 1.1
) {
  foodScale = 'an okay amount';
}
console.log(`Sarah's dog is eating ${foodScale}`);

//3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

//5 - some method can be used
const exactDog = dogs.find(dog => dog.curFood === dog.recommendedFood);
console.log(`${exactDog ? 'true' : 'false'}`);

//6 - some method can be used
const okayDog = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);
console.log(`${okayDog ? 'true' : 'false'}`);

//7
const okayDogsArr = dogs.filter(
  dog =>
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
);

//8
const sortDogs = [...dogs];
sortDogs.sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sortDogs);
 */
