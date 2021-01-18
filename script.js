'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Angry Bird',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1996,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-01-08T14:11:59.604Z',
    '2021-01-11T17:01:17.194Z',
    '2021-01-12T23:36:17.929Z',
    '2021-01-13T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-us', // de-DE
};

const account2 = {
  owner: 'Aryan Crazysoul',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 7474,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-us',
};
// Data

const accounts = [account1, account2];

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

const formatMovDate = function (date, locale) {
  const calcDisplayDate = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const DaysPassed = calcDisplayDate(new Date(), date);
  if (DaysPassed === 0) return 'Today';
  if (DaysPassed === 1) return 'Yesterday';
  if (DaysPassed <= 7) return `${DaysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    let left = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    left[0] = movs[0];
    left[1] = movs[0] + movs[1];
    left[2] = movs[0] + movs[1] + movs[2];
    left[3] = movs[0] + movs[1] + movs[2] + movs[3];
    left[4] = movs[0] + movs[1] + movs[2] + movs[3] + movs[4];
    left[5] = movs[0] + movs[1] + movs[2] + movs[3] + movs[4] + movs[5];
    left[6] =
      movs[0] + movs[1] + movs[2] + movs[3] + movs[4] + movs[5] + movs[6];
    left[7] =
      movs[0] +
      movs[1] +
      movs[2] +
      movs[3] +
      movs[4] +
      movs[5] +
      movs[6] +
      movs[7];
    left[8] =
      movs[0] +
      movs[1] +
      movs[2] +
      movs[3] +
      movs[4] +
      movs[5] +
      movs[6] +
      movs[7] +
      movs[8];
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">Rs: ${formattedMov}
      <div class="movements__cur">Remaining ${left[i]}</div></div>
      </div> 
      `;

    // <div class="movements__cur">Remaining ${1}</div>
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calDisplyBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySum = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((ac, cu) => ac + cu, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((ac, cu) => ac + cu, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  );

  const intr = acc.movements
    .filter(mov => mov > 0)
    .map(dep => (dep * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((ac, cu) => ac + cu, 0);
  labelSumInterest.textContent = formatCur(intr, acc.locale, acc.currency);
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

const updateUi = function (acc) {
  displayMovements(acc);

  calDisplyBalance(acc);

  calcDisplaySum(acc);
};

// *TIMER//////////////////////////////////////////////////////////////////
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = time % 60;

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log In To Get Started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 600;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// Event handler

let current, timer;

//* DEFAULT

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  current = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(current);

  if (current?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${current.owner.split(' ')[0]}`;
    labelWelcome.style.color = '#444';
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'short',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      current.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    updateUi(current);
  } else if (inputLoginUsername.value === '' || inputLoginPin.value === '') {
    labelWelcome.textContent = 'Please enter the login fields';
    labelWelcome.style.color = 'red';
  } else {
    labelWelcome.textContent = `Wrong Credentials, Try again`;
    labelWelcome.style.color = 'red';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && current.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      current.movements.push(amount);

      current.movementsDates.push(new Date().toISOString());
      updateUi(current);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    current.pin === +inputClosePin.value &&
    current.username === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(acc => acc.username === current.username);

    //  delacc
    accounts.splice(index, 1);
    // hideUi
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const revAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    revAcc &&
    current.balance >= amount &&
    revAcc?.username !== current.username
  ) {
    // Doind transfer
    current.movements.push(-amount);
    revAcc.movements.push(amount);

    current.movementsDates.push(new Date().toISOString());
    revAcc.movementsDates.push(new Date().toISOString());

    updateUi(current);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(current, !sorted);
  sorted = !sorted;
});
