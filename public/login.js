document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    const result = await response.json();
    if(response.ok) {
      localStorage.setItem('token', result.token);
      alert('Login successful!');
      window.location.href = '/home';
    }
    else {
      alert('Login failed: ' + result.error);
    }
  });
});