// Mock Data and Controller for Smart Budget v3 Web Application

document.addEventListener('DOMContentLoaded', () => {
  // --- State Variables ---
  let currentUser = JSON.parse(localStorage.getItem('sb_user')) || null;
  let rememberMe = localStorage.getItem('sb_remember') === 'true';
  let currency = localStorage.getItem('sb_currency') || '$';
  
  let transactions = JSON.parse(localStorage.getItem('sb_transactions')) || [
    { id: 'TXN-001', type: 'INCOME', category: 'Salary', desc: 'Monthly corporate salary payout', amount: 5000.00, status: 'CLEARED' },
    { id: 'TXN-002', type: 'EXPENSE', category: 'Rent', desc: 'Monthly apartment rental', amount: 1200.00, status: 'CLEARED' },
    { id: 'TXN-003', type: 'EXPENSE', category: 'Food', desc: 'Organic groceries supermarket sweep', amount: 240.00, status: 'CLEARED' },
    { id: 'TXN-004', type: 'EXPENSE', category: 'Utilities', desc: 'Electricity and fiber internet bill', amount: 150.00, status: 'CLEARED' }
  ];

  let budgets = JSON.parse(localStorage.getItem('sb_budgets')) || {
    'Food': 500.00,
    'Utilities': 200.00,
    'Entertainment': 300.00,
    'Shopping': 400.00,
    'Rent': 1500.00
  };

  let currentFilter = 'all';
  let searchQuery = '';

  // --- DOM Elements ---
  const authContainer = document.getElementById('auth-container');
  const loginView = document.getElementById('login-view');
  const registerView = document.getElementById('register-view');
  const dashboardContainer = document.getElementById('dashboard-container');
  
  // Auth fields
  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const rememberCheckbox = document.getElementById('remember-me-checkbox');
  const authErrorMessage = document.getElementById('auth-error-message');
  
  const registerForm = document.getElementById('register-form');
  const registerName = document.getElementById('register-name');
  const registerEmail = document.getElementById('register-email');
  const registerPassword = document.getElementById('register-password');
  const registerConfirmPassword = document.getElementById('register-confirm-password');
  const registerErrorMessage = document.getElementById('register-error-message');

  const goToRegister = document.getElementById('go-to-register');
  const goToLogin = document.getElementById('go-to-login');

  // Sidebar controls
  const navDashboard = document.getElementById('nav-dashboard');
  const navIncome = document.getElementById('nav-income');
  const navExpense = document.getElementById('nav-expense');
  const navBudget = document.getElementById('nav-budget');
  const navReports = document.getElementById('nav-reports');
  const navProfile = document.getElementById('nav-profile');
  const logoutButton = document.getElementById('logout-button');
  
  const sidebarName = document.getElementById('sidebar-name');
  const sidebarRole = document.getElementById('sidebar-role');
  const sidebarAvatar = document.getElementById('sidebar-avatar');

  // View sections
  const viewTitle = document.getElementById('view-title');
  const dashboardView = document.getElementById('dashboard-view');
  const incomeView = document.getElementById('income-view');
  const expenseView = document.getElementById('expense-view');
  const budgetView = document.getElementById('budget-view');
  const reportsView = document.getElementById('reports-view');
  const profileView = document.getElementById('profile-view');

  // Dashboard Stats
  const statTotal = document.getElementById('stat-total');
  const statIncome = document.getElementById('stat-income');
  const statExpense = document.getElementById('stat-expense');

  // Transaction History Table
  const visitorsList = document.getElementById('visitors-list');
  const noVisitorsAlert = document.getElementById('no-visitors-alert');
  const visitorSearch = document.getElementById('visitor-search');
  const filterAll = document.getElementById('filter-all');
  const filterActive = document.getElementById('filter-active'); // Income filter
  const filterUpcoming = document.getElementById('filter-upcoming'); // Expense filter

  // Forms
  const incomeForm = document.getElementById('income-form');
  const incomeCategory = document.getElementById('income-category');
  const incomeAmount = document.getElementById('income-amount');
  const incomeDesc = document.getElementById('income-desc');
  const incomeErrorMessage = document.getElementById('income-error-message');

  const expenseForm = document.getElementById('expense-form');
  const expenseCategory = document.getElementById('expense-category');
  const expenseAmount = document.getElementById('expense-amount');
  const expenseDesc = document.getElementById('expense-desc');
  const expenseErrorMessage = document.getElementById('expense-error-message');

  const budgetForm = document.getElementById('budget-form');
  const budgetCategory = document.getElementById('budget-category');
  const budgetLimit = document.getElementById('budget-limit');
  const budgetErrorMessage = document.getElementById('budget-error-message');
  const budgetProgressBars = document.getElementById('budget-progress-bars');

  const profileForm = document.getElementById('profile-form');
  const profileName = document.getElementById('profile-name');
  const profileCurrency = document.getElementById('profile-currency');
  const profileRoleView = document.getElementById('profile-role-view');
  const profileAvatarInput = document.getElementById('profile-avatar-input');
  const profilePicPreview = document.getElementById('profile-pic-preview');
  const profileSuccessMessage = document.getElementById('profile-success-message');

  // Reports
  const categoryDistributionList = document.getElementById('category-distribution-list');
  const exportReportsBtn = document.getElementById('export-reports-btn');

  // Modal alert
  const qrModal = document.getElementById('qr-modal');
  const closeQrModal = document.getElementById('close-qr-modal');
  const qrVisitorName = document.getElementById('qr-visitor-name');
  const qrPassId = document.getElementById('qr-pass-id');
  const qrPassStatus = document.getElementById('qr-pass-status');
  const downloadQrButton = document.getElementById('download-qr-button');

  // --- Initial View Sync ---
  if (currentUser) {
    showDashboard();
  } else {
    showAuth();
  }

  // --- View Toggle Functions ---
  function showAuth() {
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    loginView.classList.remove('hidden');
    registerView.classList.add('hidden');
    clearForms();
  }

  function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    
    // Sync sidebar info
    sidebarName.textContent = currentUser.name || currentUser.email.split('@')[0];
    sidebarRole.textContent = "BUDGET MANAGER";
    sidebarAvatar.textContent = (currentUser.name || currentUser.email)[0].toUpperCase();
    currency = currentUser.currency || '$';

    switchView('dashboard');
  }

  function switchView(viewName) {
    const navs = [navDashboard, navIncome, navExpense, navBudget, navReports, navProfile];
    const sections = [dashboardView, incomeView, expenseView, budgetView, reportsView, profileView];
    
    navs.forEach(nav => nav.classList.remove('active'));
    sections.forEach(sec => sec.classList.add('hidden'));

    if (viewName === 'dashboard') {
      navDashboard.classList.add('active');
      dashboardView.classList.remove('hidden');
      viewTitle.textContent = "Dashboard Overview";
      renderDashboard();
    } else if (viewName === 'income') {
      navIncome.classList.add('active');
      incomeView.classList.remove('hidden');
      viewTitle.textContent = "Log Inflow Income";
    } else if (viewName === 'expense') {
      navExpense.classList.add('active');
      expenseView.classList.remove('hidden');
      viewTitle.textContent = "Log Outflow Expense";
    } else if (viewName === 'budget') {
      navBudget.classList.add('active');
      budgetView.classList.remove('hidden');
      viewTitle.textContent = "Configure Limits";
      renderBudgetView();
    } else if (viewName === 'reports') {
      navReports.classList.add('active');
      reportsView.classList.remove('hidden');
      viewTitle.textContent = "Financial Analytics Dashboard";
      renderReportsView();
    } else if (viewName === 'profile') {
      navProfile.classList.add('active');
      profileView.classList.remove('hidden');
      viewTitle.textContent = "My Account Profile";
      
      profileName.value = currentUser.name || "User Account";
      profileCurrency.value = currentUser.currency || '$';
      profileRoleView.value = "BUDGET MANAGER";
    }
  }

  function clearForms() {
    loginForm.reset();
    registerForm.reset();
    incomeForm.reset();
    expenseForm.reset();
    budgetForm.reset();
    authErrorMessage.textContent = '';
    registerErrorMessage.textContent = '';
    incomeErrorMessage.textContent = '';
    expenseErrorMessage.textContent = '';
    budgetErrorMessage.textContent = '';
    profileSuccessMessage.textContent = '';
  }

  // --- Security Helpers ---
  function sanitizeInput(str) {
    if (!str) return '';
    return str
      .replace(/javascript:/gi, '')
      .replace(/onerror/gi, '')
      .replace(/onload/gi, '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  function checkForSQLi(str) {
    // Simple mock detection for input validation test cases
    if (!str) return false;
    const sqliPatterns = [
      /'.*or.*/i,
      /--/i,
      /union.*select/i,
      /select.*from/i,
      /insert.*into/i,
      /drop.*table/i
    ];
    return sqliPatterns.some(pattern => pattern.test(str));
  }

  // --- Auth Handlers ---
  goToRegister.addEventListener('click', () => {
    loginView.classList.add('hidden');
    registerView.classList.remove('hidden');
    clearForms();
  });

  goToLogin.addEventListener('click', () => {
    loginView.classList.remove('hidden');
    registerView.classList.add('hidden');
    clearForms();
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    authErrorMessage.textContent = '';

    // SQLi Check on login form
    if (checkForSQLi(email) || checkForSQLi(password)) {
      authErrorMessage.textContent = 'Malicious SQL sequence detected. Access Denied.';
      return;
    }

    if (!email || !password) {
      authErrorMessage.textContent = 'All credentials fields are required.';
      return;
    }

    if (password.length < 8) {
      authErrorMessage.textContent = 'Password must be at least 8 characters.';
      return;
    }

    // Default admin credentials match check
    if (email === 'admin@budget.com' && password !== 'SmartBudgetPass123!') {
      authErrorMessage.textContent = 'Invalid email or password credential.';
      return;
    }

    currentUser = {
      email,
      name: email === 'admin@budget.com' ? 'Admin Manager' : email.split('@')[0],
      currency: currency,
      role: 'BUDGET MANAGER'
    };

    if (rememberCheckbox.checked) {
      localStorage.setItem('sb_user', JSON.stringify(currentUser));
      localStorage.setItem('sb_remember', 'true');
    } else {
      sessionStorage.setItem('sb_user', JSON.stringify(currentUser));
    }

    showDashboard();
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = registerConfirmPassword.value;

    registerErrorMessage.textContent = '';

    // SQLi checks
    if (checkForSQLi(name) || checkForSQLi(email) || checkForSQLi(password)) {
      registerErrorMessage.textContent = 'Malicious SQL sequence detected. Registration Blocked.';
      return;
    }

    if (!name || !email || !password || !confirm) {
      registerErrorMessage.textContent = 'All fields are required for registration.';
      return;
    }

    if (password !== confirm) {
      registerErrorMessage.textContent = 'Passwords do not match.';
      return;
    }

    if (password.length < 8) {
      registerErrorMessage.textContent = 'Password must be at least 8 characters.';
      return;
    }

    // Check if email already registered
    if (email === 'admin@budget.com') {
      registerErrorMessage.textContent = 'Email address already registered.';
      return;
    }

    currentUser = { name, email, currency: '$', role: 'BUDGET MANAGER' };
    localStorage.setItem('sb_user', JSON.stringify(currentUser));
    showDashboard();
  });

  logoutButton.addEventListener('click', () => {
    // Reset state
    currentUser = null;
    localStorage.removeItem('sb_user');
    sessionStorage.removeItem('sb_user');
    localStorage.removeItem('sb_remember');
    showAuth();
  });

  // --- Sidebar Navigation ---
  navDashboard.addEventListener('click', () => switchView('dashboard'));
  navIncome.addEventListener('click', () => switchView('income'));
  navExpense.addEventListener('click', () => switchView('expense'));
  navBudget.addEventListener('click', () => switchView('budget'));
  navReports.addEventListener('click', () => switchView('reports'));
  navProfile.addEventListener('click', () => switchView('profile'));

  // --- Form Handlers ---
  incomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = incomeCategory.value;
    const amount = parseFloat(incomeAmount.value);
    const desc = incomeDesc.value.trim();

    incomeErrorMessage.textContent = '';

    if (!category || !amount || !desc) {
      incomeErrorMessage.textContent = 'All fields must be completed.';
      return;
    }

    if (checkForSQLi(desc)) {
      incomeErrorMessage.textContent = 'Security alert: SQL character patterns blocked.';
      return;
    }

    const nextId = `TXN-${String(transactions.length + 1).padStart(3, '0')}`;
    const newTxn = {
      id: nextId,
      type: 'INCOME',
      category,
      desc: sanitizeInput(desc),
      amount,
      status: 'CLEARED'
    };

    transactions.push(newTxn);
    localStorage.setItem('sb_transactions', JSON.stringify(transactions));
    
    incomeForm.reset();
    switchView('dashboard');
  });

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = expenseCategory.value;
    const amount = parseFloat(expenseAmount.value);
    const desc = expenseDesc.value.trim();

    expenseErrorMessage.textContent = '';

    if (!category || !amount || !desc) {
      expenseErrorMessage.textContent = 'All fields must be completed.';
      return;
    }

    if (checkForSQLi(desc)) {
      expenseErrorMessage.textContent = 'Security alert: SQL character patterns blocked.';
      return;
    }

    // Check budget cap limits
    const currentLimit = budgets[category] || 999999.00;
    const currentExpenseSum = transactions
      .filter(t => t.type === 'EXPENSE' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);

    const projectedSum = currentExpenseSum + amount;
    if (projectedSum > currentLimit) {
      // Trigger Budget Warning alert modal
      qrVisitorName.textContent = `${category} Spending`;
      qrPassId.textContent = `Limit: ${currency}${currentLimit.toFixed(2)} | Current Total: ${currency}${projectedSum.toFixed(2)}`;
      qrPassStatus.textContent = 'BUDGET CAP BREACHED';
      qrPassStatus.className = 'badge-status cancelled';
      document.getElementById('modal-alert-title').textContent = '⚠️ Budget Overflow Alert';
      qrModal.classList.remove('hidden');
    }

    const nextId = `TXN-${String(transactions.length + 1).padStart(3, '0')}`;
    const newTxn = {
      id: nextId,
      type: 'EXPENSE',
      category,
      desc: sanitizeInput(desc),
      amount,
      status: 'CLEARED'
    };

    transactions.push(newTxn);
    localStorage.setItem('sb_transactions', JSON.stringify(transactions));

    expenseForm.reset();
    switchView('dashboard');
  });

  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = budgetCategory.value;
    const limit = parseFloat(budgetLimit.value);

    budgetErrorMessage.textContent = '';

    if (!category || !limit) {
      budgetErrorMessage.textContent = 'Category and Limit must be defined.';
      return;
    }

    budgets[category] = limit;
    localStorage.setItem('sb_budgets', JSON.stringify(budgets));

    budgetForm.reset();
    renderBudgetView();
  });

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = profileName.value.trim();
    const prefCurrency = profileCurrency.value;

    profileSuccessMessage.textContent = '';

    if (!name) {
      return;
    }

    currentUser.name = name;
    currentUser.currency = prefCurrency;
    currency = prefCurrency;
    
    if (localStorage.getItem('sb_user')) {
      localStorage.setItem('sb_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.setItem('sb_user', JSON.stringify(currentUser));
    }

    // Sync UI elements
    sidebarName.textContent = name;
    sidebarAvatar.textContent = name[0].toUpperCase();

    profileSuccessMessage.textContent = 'Profile settings updated successfully!';
    setTimeout(() => { profileSuccessMessage.textContent = ''; }, 3000);
  });

  profileAvatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        profilePicPreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Modal alert acknowledge
  closeQrModal.addEventListener('click', () => {
    qrModal.classList.add('hidden');
  });

  downloadQrButton.addEventListener('click', () => {
    qrModal.classList.add('hidden');
  });

  // --- Rendering functions ---
  function renderDashboard() {
    // 1. Calculate Stats
    const incomeSum = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expenseSum = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = incomeSum - expenseSum;

    statTotal.textContent = `${currency}${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    statIncome.textContent = `${currency}${incomeSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    statExpense.textContent = `${currency}${expenseSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // 2. Filter Transactions
    let filtered = transactions.filter(t => {
      const descMatch = t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatch = t.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!descMatch && !catMatch) return false;

      if (currentFilter === 'all') return true;
      if (currentFilter === 'active') return t.type === 'INCOME'; // Tab mapping: Income
      if (currentFilter === 'upcoming') return t.type === 'EXPENSE'; // Tab mapping: Expense
      return true;
    });

    // 3. Populate List Table
    visitorsList.innerHTML = '';
    if (filtered.length === 0) {
      noVisitorsAlert.classList.remove('hidden');
    } else {
      noVisitorsAlert.classList.add('hidden');
      filtered.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${t.id}</strong></td>
          <td style="color: ${t.type === 'INCOME' ? 'var(--color-pass)' : 'var(--color-fail)'}">${t.type}</td>
          <td>${t.category}</td>
          <td>${t.desc}</td>
          <td><strong>${currency}${t.amount.toFixed(2)}</strong></td>
          <td><span class="badge-status ${t.type === 'INCOME' ? 'pass' : 'cancelled'}">${t.status}</span></td>
          <td>
            <button class="btn btn-sm btn-logout cancel-pass-row" data-id="${t.id}">Delete</button>
          </td>
        `;
        visitorsList.appendChild(row);
      });
    }

    // Attach Row Action listeners
    document.querySelectorAll('.cancel-pass-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm(`Remove transaction ${id} and adjust balances?`)) {
          const index = transactions.findIndex(t => t.id === id);
          if (index !== -1) {
            transactions.splice(index, 1);
            localStorage.setItem('sb_transactions', JSON.stringify(transactions));
            renderDashboard();
          }
        }
      });
    });
  }

  function renderBudgetView() {
    budgetProgressBars.innerHTML = '';
    
    Object.keys(budgets).forEach(category => {
      const limit = budgets[category];
      const spent = transactions
        .filter(t => t.type === 'EXPENSE' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

      const pct = Math.min(100, Math.round((spent / limit) * 100));
      const statusColor = pct >= 100 ? 'var(--color-fail)' : (pct >= 80 ? 'var(--color-upcoming)' : 'var(--color-pass)');

      const bar = document.createElement('div');
      bar.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:0.25rem;">
          <strong style="color: var(--text-main);">${category}</strong>
          <span style="color: var(--text-muted);">${currency}${spent.toFixed(2)} / ${currency}${limit.toFixed(2)} (${pct}%)</span>
        </div>
        <div style="width:100%; height:8px; background-color: rgba(255,255,255,0.05); border-radius:4px; overflow:hidden; border: 1px solid var(--border-color)">
          <div style="width:${pct}%; height:100%; background-color:${statusColor}; transition: width 0.5s ease-in-out;"></div>
        </div>
      `;
      budgetProgressBars.appendChild(bar);
    });
  }

  function renderReportsView() {
    categoryDistributionList.innerHTML = '';
    
    // Aggregate category expenses
    const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const catAmounts = {};
    
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      catAmounts[t.category] = (catAmounts[t.category] || 0) + t.amount;
    });

    Object.keys(catAmounts).forEach(cat => {
      const amt = catAmounts[cat];
      const pct = totalExpenses > 0 ? Math.round((amt / totalExpenses) * 100) : 0;
      
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.padding = '5px 0';
      item.style.borderBottom = '1px solid var(--border-color)';
      item.innerHTML = `
        <span>${cat}</span>
        <strong>${currency}${amt.toFixed(2)} (${pct}%)</strong>
      `;
      categoryDistributionList.appendChild(item);
    });
  }

  exportReportsBtn.addEventListener('click', () => {
    alert('Simulating reports CSV/Excel format export...');
  });

  // --- Filtering & Search events ---
  visitorSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderDashboard();
  });

  filterAll.addEventListener('click', () => setFilter('all', filterAll));
  filterActive.addEventListener('click', () => setFilter('active', filterActive));
  filterUpcoming.addEventListener('click', () => setFilter('upcoming', filterUpcoming));

  function setFilter(filterVal, btnEl) {
    [filterAll, filterActive, filterUpcoming].forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
    currentFilter = filterVal;
    renderDashboard();
  }

  // --- CORS Security Vulnerability check hook ---
  // Expose a public endpoint mock for the vulnerability suite scanning
  window.securityApiCorsPreflightCheck = function() {
    return {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // VULNERABILITY! Intentionally returns wildcard
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': "default-src 'self'"
      }
    };
  };
});
