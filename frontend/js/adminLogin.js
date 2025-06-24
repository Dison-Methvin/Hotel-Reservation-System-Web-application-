document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    /*  —— authenticate ——  */
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login failed');
      const { token } = await res.json();
      localStorage.setItem('token', token);
    } catch (err) {
      alert(err.message);
      return;
    }

    /*  —— redirect by role ——  */
    const map = {
      admin : 'AdminDashboard.html',
      manager: 'ManagerDashboard.html',
      clerk : 'ReservationClerk.html',
      travel: 'TravelCompany.html'
    };
    window.location.href = map[role] || 'home.html';
  });
});