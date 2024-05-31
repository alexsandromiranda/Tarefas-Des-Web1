// script.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('userForm');
    const tableBody = document.getElementById('userTable').querySelector('tbody');

    // Função para enviar dados do formulário via AJAX
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        fetch('/api/users', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.reset();
                form.className = 'success';
                alert('Usuário cadastrado com sucesso!');
                loadUsers();
            } else {
                form.className = 'error';
                alert('Erro ao cadastrar usuário.');
            }
        })
        .catch(error => {
            form.className = 'error';
            alert('Erro ao cadastrar usuário.');
        });
    });

    // Função para carregar usuários
    function loadUsers() {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = '';
                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="edit" data-id="${user.id}">Editar</button>
                            <button class="delete" data-id="${user.id}">Apagar</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Adiciona eventos para os botões de editar e apagar
                document.querySelectorAll('.edit').forEach(button => {
                    button.addEventListener('click', editUser);
                });
                document.querySelectorAll('.delete').forEach(button => {
                    button.addEventListener('click', deleteUser);
                });
            });
    }

    // Função para editar usuário
    function editUser(event) {
        const userId = event.target.getAttribute('data-id');
        fetch(`/api/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                form.setAttribute('data-id', user.id);
            });
    }

    // Função para apagar usuário
    function deleteUser(event) {
        const userId = event.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja apagar este usuário?')) {
            fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Usuário apagado com sucesso!');
                    loadUsers();
                } else {
                    alert('Erro ao apagar usuário.');
                }
            });
        }
    }

    // Carrega usuários ao iniciar
    loadUsers();
});

// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let users = [];
let currentId = 1;

// Endpoint para criar usuário
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    if (name && email) {
        users.push({ id: currentId++, name, email });
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Endpoint para listar usuários
app.get('/api/users', (req, res) => {
    res.json({ users });
});

// Endpoint para obter dados de um usuário
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ success: false });
    }
});

// Endpoint para apagar usuário
app.delete('/api/users/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ success: true });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

git checkout main
git merge ajax

// script.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('userForm');
    const tableBody = document.getElementById('userTable').querySelector('tbody');
    const alertContainer = document.getElementById('alertContainer');

    // Função para mostrar mensagens de alerta
    function showAlert(message, type) {
        alertContainer.className = `alert alert-${type}`;
        alertContainer.textContent = message;
        alertContainer.style.display = 'block';

        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 3000);
    }

    // Função para enviar dados do formulário via AJAX
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const userId = form.getAttribute('data-id');
        const method = userId ? 'PUT' : 'POST';
        const url = userId ? `/api/users/${userId}` : '/api/users';

        fetch(url, {
            method: method,
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.reset();
                form.removeAttribute('data-id');
                showAlert('Usuário cadastrado com sucesso!', 'success');
                loadUsers();
            } else {
                showAlert('Erro ao cadastrar usuário.', 'error');
            }
        })
        .catch(error => {
            showAlert('Erro ao cadastrar usuário.', 'error');
        });
    });

    // Função para carregar usuários
    function loadUsers() {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = '';
                data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>
                            <button class="edit" data-id="${user.id}">Editar</button>
                            <button class="delete" data-id="${user.id}">Apagar</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                // Adiciona eventos para os botões de editar e apagar
                document.querySelectorAll('.edit').forEach(button => {
                    button.addEventListener('click', editUser);
                });
                document.querySelectorAll('.delete').forEach(button => {
                    button.addEventListener('click', deleteUser);
                });
            });
    }

    // Função para editar usuário
    function editUser(event) {
        const userId = event.target.getAttribute('data-id');
        fetch(`/api/users/${userId}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                form.setAttribute('data-id', user.id);
            });
    }

    // Função para apagar usuário
    function deleteUser(event) {
        const userId = event.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja apagar este usuário?')) {
            fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Usuário apagado com sucesso!', 'success');
                    loadUsers();
                } else {
                    showAlert('Erro ao apagar usuário.', 'error');
                }
            });
        }
    }

    // Carrega usuários ao iniciar
    loadUsers();
});
