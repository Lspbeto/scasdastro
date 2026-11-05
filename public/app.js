// Troque pela URL do seu backend depois do deploy
const API_URL = 'https://seu-backend.onrender.com';

const form = document.getElementById('form');
const msg = document.getElementById('msg');
const btn = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  btn.disabled = true;
  msg.className = '';
  msg.textContent = 'Enviando...';

  try {
    const res = await fetch(`${API_URL}/api/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome.value,
        email: form.email.value,
        senha: form.senha.value,
      }),
    });
    const data = await res.json();

    msg.className = res.ok ? 'ok' : 'erro';
    msg.textContent = data.mensagem || data.erro;
    if (res.ok) form.reset();
  } catch {
    msg.className = 'erro';
    msg.textContent = 'Não foi possível conectar ao servidor.';
  }
  btn.disabled = false;
});