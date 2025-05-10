document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  const messages = document.getElementById('messages-box');
  const token = localStorage.getItem('token');

  if(!token) {
    window.location.href = '/login';
    return;
  }

  document.getElementById('home-container').style.display = 'block';

  const socket = io({
    auth: {
      token: token
    }
  });

  async function loadmessages() {    
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();

      messages.innerHTML = '';
      data.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = msg.content;
        messages.appendChild(div);
      });

      messages.scrollTop = messages.scrollHeight;
    } 
    catch(err) {
      console.error('Error loading messages:', err);
    }
  }

  loadmessages();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = input.value.trim();
    if (msg !== '') {
      socket.emit('chat message', msg);
      input.value = '';
    }
  });

  // 3. Lắng nghe tin nhắn mới từ server
  socket.on('chat message', (msg) => {
    const div = document.createElement('div');
    div.textContent = msg;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  });
});
