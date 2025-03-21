let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budgetLimit = parseFloat(localStorage.getItem('budgetLimit')) || 0;
let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;

function addIncome() {
  const income = parseFloat(document.getElementById('incomeAmount').value);
  if (income > 0) {
    totalIncome += income;
    localStorage.setItem('totalIncome', totalIncome);
    alert('Income Added: ₹' + income);
    document.getElementById('incomeAmount').value = '';
    updateBalance();
  }
}

function addExpense() {
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (amount && category && date) {
    expenses.push({ amount, category, date });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
  }
}

function displayExpenses(filtered = expenses) {
  const list = document.getElementById('expenseList');
  let total = 0;
  list.innerHTML = '';

  filtered.forEach((exp, index) => {
    total += exp.amount;
    list.innerHTML += `
      <li>
        ${exp.date} - ₹${exp.amount} - ${exp.category}
        <button onclick="editExpense(${index})">✏️</button>
        <button onclick="deleteExpense(${index})">❌</button>
      </li>`;
  });

  document.getElementById('total').innerText = total;
  checkBudgetLimit(total);
  updateBalance();
}

function editExpense(index) {
  const exp = expenses[index];
  const list = document.getElementById('expenseList');
  list.children[index].innerHTML = `
    <input type="number" id="editAmount${index}" value="${exp.amount}">
    <input type="date" id="editDate${index}" value="${exp.date}">
    <select id="editCategory${index}">
      <option value="Food">Food</option>
      <option value="Transport">Transport</option>
      <option value="Shopping">Shopping</option>
      <option value="Bills">Bills</option>
      <option value="Other">Other</option>
    </select>
    <button onclick="saveEdit(${index})">💾</button>
    <button onclick="displayExpenses()">❌</button>`;
}

function saveEdit(index) {
  expenses[index] = {
    amount: parseFloat(document.getElementById(`editAmount${index}`).value),
    date: document.getElementById(`editDate${index}`).value,
    category: document.getElementById(`editCategory${index}`).value
  };
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
}

function setBudgetLimit() {
  budgetLimit = parseFloat(document.getElementById('budgetLimit').value);
  localStorage.setItem('budgetLimit', budgetLimit);
  displayExpenses();
}

function checkBudgetLimit(total) {
  document.getElementById('budgetWarning').innerText = total > budgetLimit ? `⚠️ Over Budget!` : '';
}

function updateBalance() {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  document.getElementById('totalIncome').innerText = totalIncome;
  document.getElementById('totalExpenses').innerText = totalExpenses;
  document.getElementById('balance').innerText = totalIncome - totalExpenses;
}

function resetAllData() {
  localStorage.clear();
  expenses = []; budgetLimit = 0; totalIncome = 0;
  displayExpenses(); updateBalance(); alert('All data reset!');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// ✅ CSV Download Function
function downloadCSV() {
  if (expenses.length === 0) {
    alert("No expenses to download!");
    return;
  }

  let csvContent = "Date,Amount,Category\n";
  expenses.forEach(exp => {
    csvContent += `${exp.date},${exp.amount},${exp.category}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "Expenses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.onload = displayExpenses;
