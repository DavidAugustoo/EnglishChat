const socket = io();
let username = '';
let userlist = [];

let loginPage = document.querySelector('#login-page');
let chatpage = document.querySelector('#chat-page');

let loginNameInput = document.querySelector('#login-text-input');
let chatTextInput = document.querySelector('#chat-text-input');

loginPage.style.display = 'flex';
chatpage.style.display = 'none';


// Events
loginNameInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        let name = loginNameInput.value.trim();
        if(name != '') {
            username = name;
            document.title = `Chat (${username})`;

            socket.emit('join-request', username);
        }
    }
});

chatTextInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        let txt = chatTextInput.value;
        chatTextInput.value = '';

        if(txt != '') {
            socket.emit('send-msg', txt);
        }
    }
});


// Socket
socket.on('user-ok', (list) => {
    loginPage.style.display = 'none';
    chatpage.style.display = 'flex';
    chatTextInput.focus();

    addMessage('status', null, 'conectado');

    userlist = list;
    renderUserList(userlist);
});

socket.on('list-update', (data) => {
    if(data.joined) {
        addMessage('status', null, `${data.joined} entrou no chat`);
    }

    if(data.left) {
        addMessage('status', null, `${data.left} saiu do chat`);
    }

    userlist = data.list;
    renderUserList(userlist);
});

socket.on('show-msg', (data) => {
    addMessage('msg', data.username, data.message);
});

socket.on('disconnect', () => {
    addMessage('status', null, 'Você foi desconectado');
});

socket.on('reconnect_error', () => {
    addMessage('status', null, 'Tentenado reconectar...');
});

socket.on('reconnect', () => {
    addMessage('status', null, 'Reconectado...');

    if(username != '' ) {
        socket.emit('user-join', username);
    }
});


// Functions
function renderUserList(userlist) {
    let ul = document.querySelector('.user-list');
    ul.innerHTML = '';

    userlist.map((item) => {
        ul.innerHTML += `<li>${item}<li>`;
    });
}

function addMessage (type, user, msg) {
    let ul = document.querySelector('.message-list');
    let ulArea = document.querySelector('.message-area');

    switch(type) {
        case 'status':
            ul.innerHTML += `<li class="message-status">${msg}</li>`
        break;
        case 'msg':
            if(username == user) {
                ul.innerHTML += `<li class="message"><h4 class="me">${user}</h4><p>${msg}</p></li>`
            } else {    
                ul.innerHTML += `<li class="message"><h4 class="other">${user}</h4><p>${msg}</p></li>`
            } 
        break;
    }

    ulArea.scrollTop = ulArea.scrollHeight;
}