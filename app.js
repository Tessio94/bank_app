"use strict";

// Bankist App
// Data
const account1 = {
  owner: "Šime Klapan",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Mate Martinović",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Ivan Galić",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Franko Škugor",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ELEMENTS
// text elements
const welcomeText = document.querySelector(".welcome-text");
const totalBalance = document.querySelector(".balance-number");
const totalDeposit = document.querySelector(".in .value");
const totalWithdrawal = document.querySelector(".out .value");
const totalInterest = document.querySelector(".interest .value");
// navigation
const usernameInput = document.querySelector(".username");
const pinInput = document.querySelector(".pin");
const btnLogin = document.querySelector(".btn-login");

const container = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
// actions
const tranferTo = document.querySelector(".transfer-user");
const transferAmount = document.querySelector(".transfer-value");
const btnTransfer = document.querySelector(".btn_transfer-button");
const requestAmount = document.querySelector(".request-value");
const btnRequestLoan = document.querySelector(".btn_request-loan");
const closeUser = document.querySelector(".user-name");
const closePin = document.querySelector(".user-pin");
const btnCloseAccount = document.querySelector(".btn_close-account");

function createUsername(accs) {
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join(""))
  );
}
createUsername(accounts);

let currentAccount;

function displayMovements(acc) {
  containerMovements.innerHTML = "";

  acc.movements.forEach((movement, i) => {
    const movementType = movement > 0 ? "deposit" : "withdrawal";
    const html = `  
    <div class="movement-individual">
      <div class="movement-type--${movementType}">${i + 1} ${movementType}</div>
      <div class="movement-value">${movement}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function displaySummary(acc) {
  totalBalance.innerHTML =
    acc.movements.reduce((acc, curr) => acc + curr, 0) + "€";
  totalDeposit.innerHTML =
    acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, curr) => acc + curr, 0) + "€";
  totalWithdrawal.innerHTML =
    Math.abs(
      acc.movements
        .filter((mov) => mov < 0)
        .reduce((acc, curr) => acc + curr, 0)
    ) + "€";
  totalInterest.innerHTML =
    acc.movements
      .filter((mov) => mov > 0)
      .map((deposit) => (deposit * acc.interestRate) / 100)
      .filter((int) => int >= 1)
      .reduce((acc, int) => acc + int, 0) + "€";
}

function updateUi(acc) {
  displayMovements(acc);

  displaySummary(acc);
}

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) =>
      acc.username === usernameInput.value && acc.pin === Number(pinInput.value)
  );
  if (currentAccount) {
    container.style.opacity = "100";

    welcomeText.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }
      `;

    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener("click", function transferMoney(e) {
  e.preventDefault();

  const foundTransferAcc = accounts.find(
    (acc) => acc.username === tranferTo.value
  );

  if (
    foundTransferAcc &&
    currentAccount &&
    foundTransferAcc.username !== currentAccount.username &&
    transferAmount.value > 0
  ) {
    foundTransferAcc.movements.push(+transferAmount.value);
    currentAccount.movements.push(-transferAmount.value);
    updateUi(currentAccount);
  }
});

btnRequestLoan.addEventListener("click", function requestMoney(e) {
  e.preventDefault();

  if (
    currentAccount.movements.some((mov) => mov >= requestAmount.value * 0.1)
  ) {
    currentAccount.movements.push(+requestAmount.value);
    updateUi(currentAccount);
    console.log(currentAccount);
  }
});

btnCloseAccount.addEventListener("click", function closeAccount(e) {
  e.preventDefault();

  if (
    currentAccount.username === closeUser.value &&
    currentAccount.pin === +closePin.value
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    container.style.opacity = 0;

    console.log(accounts);
  }
});
