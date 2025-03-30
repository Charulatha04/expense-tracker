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
        document.getElementById('amount').value = '';
        document.getElementById('category').value = '';
        document.getElementById('date').value = '';
        displayExpenses();
    }
}

function filterExpenses() {
    const month = document.getElementById('filterMonth').value;
    const category = document.getElementById('filterCategory').value;
    
    let filtered = expenses;
    
    // Filter by month if not "all"
    if (month !== 'all') {
        filtered = filtered.filter(exp => {
            const expMonth = exp.date.split('-')[1]; // Get MM from YYYY-MM-DD
            return expMonth === month;
        });
    }
    
    // Filter by category if not "all"
    if (category !== 'all') {
        filtered = filtered.filter(exp => exp.category === category);
    }
    
    displayExpenses(filtered);
}

function displayExpenses(expensesToShow = expenses) {
    const list = document.getElementById('expenseList');
    let total = 0;
    list.innerHTML = '';

    expensesToShow.forEach((exp, index) => {
        total += exp.amount;
        list.innerHTML += `
            <li>
                ${exp.date} - ₹${exp.amount} - ${exp.category}
                <button onclick="editExpense(${index})">✏️</button>
                <button onclick="deleteExpense(${index})">❌</button>
            </li>`;
    });

    document.getElementById('total').innerText = total;
    document.getElementById('totalExpenses').innerText = total;
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
    
    document.getElementById(`editCategory${index}`).value = exp.category;
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
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
    }
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
    if (confirm('Are you sure you want to reset all data?')) {
        localStorage.clear();
        expenses = [];
        budgetLimit = 0;
        totalIncome = 0;
        displayExpenses();
        updateBalance();
        alert('All data has been reset!');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const toggleBtn = document.getElementById('darkModeToggle');
    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.textContent = '☀️ Light Mode';
    } else {
        toggleBtn.textContent = '🌙 Dark Mode';
    }
}

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

window.onload = function() {
    displayExpenses();
    updateBalance();
};