document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  const messages = document.getElementById('messages-box');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const msg = input.value.trim();
    if (msg !== '') {
      const div = document.createElement('div');
      div.textContent = msg;
      messages.appendChild(div);

      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: msg }),
        });

        const data = await response.json();
        if (data && data.data) {
          console.log('Message saved:', data.data);
        }
      } 
      catch(error) {
        console.error('Error sending message:', error);
      }

      input.value = '';
      messages.scrollTop = messages.scrollHeight;
    }
  });

});

async function loadmessages() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('message-input');
  const messages = document.getElementById('messages-box');
  
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
