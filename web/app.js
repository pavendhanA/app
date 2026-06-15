// Mock Data and Controller for GateGuard Web Portal

document.addEventListener('DOMContentLoaded', () => {
  // --- State Variables ---
  let currentUser = JSON.parse(localStorage.getItem('gg_user')) || null;
  let rememberMe = localStorage.getItem('gg_remember') === 'true';
  
  let visitors = JSON.parse(localStorage.getItem('gg_visitors')) || [
    { id: 'GG-501', name: 'Alice Smith', email: 'alice@smith.com', phone: '+1 (555) 019-2834', purpose: 'Personal Delivery', status: 'ACTIVE', host: 'Admin User' },
    { id: 'GG-502', name: 'Bob Johnson', email: 'bob@johnson.com', phone: '+1 (555) 018-2940', purpose: 'Maintenance Worker', status: 'UPCOMING', host: 'Host User' },
    { id: 'GG-503', name: 'Charlie Brown', email: 'charlie@brown.com', phone: '+1 (555) 017-3850', purpose: 'Social Meeting', status: 'ACTIVE', host: 'Jane Doe' }
  ];

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
  const loginRole = document.getElementById('login-role');
  const rememberCheckbox = document.getElementById('remember-me-checkbox');
  const authErrorMessage = document.getElementById('auth-error-message');
  
  const registerForm = document.getElementById('register-form');
  const registerName = document.getElementById('register-name');
  const registerEmail = document.getElementById('register-email');
  const registerPassword = document.getElementById('register-password');
  const registerConfirmPassword = document.getElementById('register-confirm-password');
  const registerRole = document.getElementById('register-role');
  const registerErrorMessage = document.getElementById('register-error-message');

  const goToRegister = document.getElementById('go-to-register');
  const goToLogin = document.getElementById('go-to-login');

  // Sidebar controls
  const navDashboard = document.getElementById('nav-dashboard');
  const navPass = document.getElementById('nav-pass');
  const navProfile = document.getElementById('nav-profile');
  const logoutButton = document.getElementById('logout-button');
  const sidebarName = document.getElementById('sidebar-name');
  const sidebarRole = document.getElementById('sidebar-role');
  const sidebarAvatar = document.getElementById('sidebar-avatar');

  // View sections
  const viewTitle = document.getElementById('view-title');
  const dashboardView = document.getElementById('dashboard-view');
  const passView = document.getElementById('pass-view');
  const profileView = document.getElementById('profile-view');

  // Dashboard / Table elements
  const visitorsList = document.getElementById('visitors-list');
  const noVisitorsAlert = document.getElementById('no-visitors-alert');
  const visitorSearch = document.getElementById('visitor-search');
  const filterAll = document.getElementById('filter-all');
  const filterActive = document.getElementById('filter-active');
  const filterUpcoming = document.getElementById('filter-upcoming');

  // Dashboard Stats
  const statTotal = document.getElementById('stat-total');
  const statActive = document.getElementById('stat-active');
  const statUpcoming = document.getElementById('stat-upcoming');

  // Forms
  const passForm = document.getElementById('pass-form');
  const passName = document.getElementById('pass-name');
  const passEmail = document.getElementById('pass-email');
  const passPhone = document.getElementById('pass-phone');
  const passPurpose = document.getElementById('pass-purpose');
  const passHost = document.getElementById('pass-host');
  const passErrorMessage = document.getElementById('pass-error-message');

  const profileForm = document.getElementById('profile-form');
  const profileName = document.getElementById('profile-name');
  const profilePhone = document.getElementById('profile-phone');
  const profileRoleView = document.getElementById('profile-role-view');
  const profileAvatarInput = document.getElementById('profile-avatar-input');
  const profilePicPreview = document.getElementById('profile-pic-preview');
  const profileSuccessMessage = document.getElementById('profile-success-message');

  // Modal
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
    
    // Sync sidebar
    sidebarName.textContent = currentUser.name || currentUser.email.split('@')[0];
    sidebarRole.textContent = currentUser.role.toUpperCase();
    sidebarAvatar.textContent = (currentUser.name || currentUser.email)[0].toUpperCase();

    // Default to stats dashboard
    switchView('dashboard');
    renderDashboard();
  }

  function switchView(viewName) {
    const navs = [navDashboard, navPass, navProfile];
    const sections = [dashboardView, passView, profileView];
    
    navs.forEach(nav => nav.classList.remove('active'));
    sections.forEach(sec => sec.classList.add('hidden'));

    if (viewName === 'dashboard') {
      navDashboard.classList.add('active');
      dashboardView.classList.remove('hidden');
      viewTitle.textContent = "Dashboard Overview";
      renderDashboard();
    } else if (viewName === 'pass') {
      navPass.classList.add('active');
      passView.classList.remove('hidden');
      viewTitle.textContent = "Generate Visitor Pass";
    } else if (viewName === 'profile') {
      navProfile.classList.add('active');
      profileView.classList.remove('hidden');
      viewTitle.textContent = "My Profile Settings";
      // Fill profile settings
      profileName.value = currentUser.name || "Jane Doe";
      profilePhone.value = currentUser.phone || "+1 (555) 012-3456";
      profileRoleView.value = currentUser.role.toUpperCase();
    }
  }

  function clearForms() {
    loginForm.reset();
    registerForm.reset();
    passForm.reset();
    authErrorMessage.textContent = '';
    registerErrorMessage.textContent = '';
    passErrorMessage.textContent = '';
    profileSuccessMessage.textContent = '';
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
    const role = loginRole.value;

    authErrorMessage.textContent = '';

    // Core validation
    if (!email || !password) {
      authErrorMessage.textContent = 'Email and Password are required fields.';
      return;
    }

    if (password.length < 8) {
      authErrorMessage.textContent = 'Password must be at least 8 characters.';
      return;
    }

    // Authenticate (Mock logic: accept any valid password or standard users)
    if (email === 'admin@gateguard.app' && password !== 'GateGuardPass123!') {
      authErrorMessage.textContent = 'Invalid credentials provided.';
      return;
    }

    // Successful login
    currentUser = {
      email,
      role,
      name: email === 'admin@gateguard.app' ? 'Admin User' : (role === 'host' ? 'Host User' : 'Guard User'),
      phone: '+1 (555) 012-3456'
    };

    if (rememberCheckbox.checked) {
      localStorage.setItem('gg_user', JSON.stringify(currentUser));
      localStorage.setItem('gg_remember', 'true');
    } else {
      sessionStorage.setItem('gg_user', JSON.stringify(currentUser));
    }

    showDashboard();
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = registerConfirmPassword.value;
    const role = registerRole.value;

    registerErrorMessage.textContent = '';

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

    // Success registration -> immediately login
    currentUser = { name, email, role, phone: '+1 (555) 019-1234' };
    localStorage.setItem('gg_user', JSON.stringify(currentUser));
    showDashboard();
  });

  logoutButton.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('gg_user');
    sessionStorage.removeItem('gg_user');
    localStorage.removeItem('gg_remember');
    showAuth();
  });

  // --- Sidebar Navigation ---
  navDashboard.addEventListener('click', () => switchView('dashboard'));
  navPass.addEventListener('click', () => switchView('pass'));
  navProfile.addEventListener('click', () => switchView('profile'));

  // --- Profile Settings Handler ---
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = profileName.value.trim();
    const newPhone = profilePhone.value.trim();

    if (!newName || !newPhone) {
      return;
    }

    currentUser.name = newName;
    currentUser.phone = newPhone;
    
    if (localStorage.getItem('gg_user')) {
      localStorage.setItem('gg_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.setItem('gg_user', JSON.stringify(currentUser));
    }

    // Sync sidebar name
    sidebarName.textContent = newName;
    sidebarAvatar.textContent = newName[0].toUpperCase();

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

  // --- Pass Generation Handler ---
  passForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = passName.value.trim();
    const email = passEmail.value.trim();
    const phone = passPhone.value.trim();
    const purpose = passPurpose.value;
    const host = passHost.value;

    passErrorMessage.textContent = '';

    if (!name || !email || !phone || !purpose || !host) {
      passErrorMessage.textContent = 'Please fill out all visitor fields.';
      return;
    }

    const nextId = `GG-${500 + visitors.length + 1}`;
    const newPass = { id: nextId, name, email, phone, purpose, status: 'UPCOMING', host };
    
    visitors.push(newPass);
    localStorage.setItem('gg_visitors', JSON.stringify(visitors));

    // Show modal preview
    qrVisitorName.textContent = name;
    qrPassId.textContent = `Pass ID: ${nextId}`;
    qrPassStatus.textContent = 'UPCOMING';
    qrPassStatus.className = 'badge-status upcoming';
    
    qrModal.classList.remove('hidden');
    
    passForm.reset();
  });

  // --- Modal Close ---
  closeQrModal.addEventListener('click', () => {
    qrModal.classList.add('hidden');
    switchView('dashboard');
  });

  downloadQrButton.addEventListener('click', () => {
    alert('QR code download initialized...');
  });

  // --- Dashboard Controller & Grid Sync ---
  function renderDashboard() {
    // Re-calc Stats
    statTotal.textContent = visitors.length;
    statActive.textContent = visitors.filter(v => v.status === 'ACTIVE').length;
    statUpcoming.textContent = visitors.filter(v => v.status === 'UPCOMING').length;

    // Filter visitors
    let filtered = visitors.filter(v => {
      const nameMatch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!nameMatch) return false;
      if (currentFilter === 'all') return true;
      return v.status === currentFilter.toUpperCase();
    });

    // Render table rows
    visitorsList.innerHTML = '';
    if (filtered.length === 0) {
      noVisitorsAlert.classList.remove('hidden');
    } else {
      noVisitorsAlert.classList.add('hidden');
      filtered.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${v.id}</strong></td>
          <td>${v.name}</td>
          <td>${v.email}</td>
          <td>${v.phone}</td>
          <td>${v.purpose}</td>
          <td><span class="badge-status ${v.status.toLowerCase()}">${v.status}</span></td>
          <td>
            <button class="btn btn-sm view-qr-row" data-id="${v.id}">QR</button>
            <button class="btn btn-sm btn-logout cancel-pass-row" data-id="${v.id}">Cancel</button>
          </td>
        `;
        visitorsList.appendChild(row);
      });
    }

    // Attach row events
    document.querySelectorAll('.view-qr-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const pass = visitors.find(v => v.id === id);
        if (pass) {
          qrVisitorName.textContent = pass.name;
          qrPassId.textContent = `Pass ID: ${pass.id}`;
          qrPassStatus.textContent = pass.status;
          qrPassStatus.className = `badge-status ${pass.status.toLowerCase()}`;
          qrModal.classList.remove('hidden');
        }
      });
    });

    document.querySelectorAll('.cancel-pass-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const index = visitors.findIndex(v => v.id === id);
        if (index !== -1) {
          if (confirm(`Are you sure you want to cancel the pass for ${visitors[index].name}?`)) {
            visitors[index].status = 'CANCELLED';
            localStorage.setItem('gg_visitors', JSON.stringify(visitors));
            renderDashboard();
          }
        }
      });
    });
  }

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
});
