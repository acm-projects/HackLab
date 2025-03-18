const chatButton = document.getElementById('chat-button');
const socket = io();

if (chatButton) {
    chatButton.addEventListener('click', async (e) => {
        e.preventDefault();

        // check if username is set
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();

        if (!username || await getUserID(username) == undefined) { // no username or username not in db
            alert('Please enter a valid username before opening the chat.');
            return;
        }
        //console.log(username)
        togglePopup(username);
    });
}

// these are some getter functions that are self explanatory so no comments
// they use promise and resolve which I'm not 100% on how it all works but i think it's similar to asynchronous functions and just prevents issues when dealing with them
function getProjectID(project) {
    return new Promise((resolve, reject) => {
        socket.emit('getPID', project);
        socket.on('returnPID', (projectID) => {
            resolve(projectID);
        });
    });
}

function getProjectName(PID) {
    return new Promise((resolve, reject) => {
        const eventName = `returnPName-${PID}`; // unique event per request bc loading dms was giving me cancer for some reason

        socket.once(eventName, (PID) => {
            resolve(PID);
        });

        socket.emit('getPName', PID, eventName);
    });
}

function getUserID(user) {
    return new Promise((resolve, reject) => {
        socket.emit('getUID', user);
        socket.once('returnUID', (userID) => {
            resolve(userID);
        });
    });
}

function getUserName(UID) {
    return new Promise((resolve, reject) => {
        const eventName = `returnUsername-${UID}`; // unique event per request bc loading dms was giving me cancer for some reason

        socket.once(eventName, (username) => {
            resolve(username);
        });

        socket.emit('getUsername', UID, eventName);
    });
}

// just turns project popup on or off
async function togglePopup(username) {
    let popupContainer = document.getElementById('popup-container');

    if (popupContainer) {
        popupContainer.classList.remove('active');
        setTimeout(() => popupContainer.remove(), 300);
    } else {
        await createPopup(username);
    }
}

// makes the project popup when clicking chat button
async function createPopup(username) {
    const popupContainer = document.createElement('div');
    popupContainer.id = 'popup-container';
    popupContainer.classList.add('popup-container');

    const popup = document.createElement('div');
    popup.id = 'room-popup';
    popup.classList.add('popup');
    const UID = await getUserID(username)
    socket.emit('loadProjects', UID); // this sends request for every project from database, will need to be changed to just get projects that the user is a part of
    const roomList = document.createElement('ul');
    socket.on('projects', projects => { // loads projects from database
        projects.forEach(async project => {
            const li = document.createElement('li');
            const name = await getProjectName(project.project_id);
            li.textContent = name;
            li.classList.add('room-item');
            li.addEventListener('click', () => {
                if (name === 'Private Messages')
                    privMsgRoomsPopup(username);
                else createDraggablePopup(name, username);
            });
            roomList.appendChild(li);
        });
    });

    const topWrapper = document.createElement('div');
    topWrapper.classList.add('text-and-close-wrapper');

    const projectsText = document.createElement('h3');
    projectsText.textContent = 'Project Chats';
    projectsText.classList.add('project-popup-text');

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.classList.add('popup-close');
    closeButton.addEventListener('click', () => togglePopup(username));

    topWrapper.appendChild(projectsText);
    topWrapper.appendChild(closeButton);
    popup.appendChild(topWrapper);
    popup.appendChild(roomList);
    popupContainer.appendChild(popup);
    document.body.appendChild(popupContainer);

    setTimeout(() => popupContainer.classList.add('active'), 10);
    setTimeout(() => popup.classList.add('active'), 10);
}

// opens the popup when you click on the 'private message' button to display people you've gotten dms from and sent dms to 
async function privMsgRoomsPopup(username) {
    //console.log('Current Username:', currentUsername);
    const dragPop = document.getElementById('draggable-popup');
    if (dragPop) {
        dragPop.remove();
        socket.emit('leave');
    }

    // remove previous event listeners to avoid duplicates
    socket.off('loadDMs');
    socket.off('loadSentDMs');

    const UID = await getUserID(username);
    //console.log(UID)
    //console.log('Current User ID:', UID);
    socket.emit('getDMs', UID); // request dms sent to user
    socket.emit('sentDMs', UID); // request dms user's sent

    const popup = document.createElement('div');
    popup.id = 'draggable-popup';
    popup.classList.add('draggable-popup');

    const header = document.createElement('div');
    header.classList.add('popup-header');
    header.textContent = 'Private Messages';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.classList.add('popup-close');
    closeButton.addEventListener('click', () => {
        socket.emit('leave');
        popup.remove();
    });

    const content = document.createElement('div');
    content.classList.add('popup-content');
    content.innerHTML = `
        <div class="chat-messages"></div>
        <div class="chat-form-container">
            <form id="chat-form">
                <input id="msg" type="text" placeholder="Enter Message" required autocomplete="off" />
                <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
            </form>
        </div>
    `;

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');

    header.appendChild(closeButton);
    popup.appendChild(header);
    popup.appendChild(content);
    popup.appendChild(resizeHandle);
    document.body.appendChild(popup);

    popup.style.top = '100px';
    popup.style.left = '100px';

    makePopupDraggable(popup, header);
    makePopupResizable(popup, resizeHandle);

    const chatMessages = popup.querySelector('.chat-messages');

    // Sets to store unique senders and receivers
    const uniqueSenders = new Set();
    const uniqueReceivers = new Set();

    const renderDMRoom = async (PID, isReceivedDM) => {
        //const otherUsername = await getUserName(userID);
        const div = document.createElement('div');
        div.classList.add('message');
        //console.log(UID, PID)
        div.innerHTML = `<button class="text" onclick="createDMPopup('${UID}', '${PID}')">${await getUserName(PID)}</button>`;
        chatMessages.appendChild(div);
    };

    // Handle received DMs (messages sent to current user)
    socket.on('loadDMs', async (rooms) => {
        //console.log('Received DMs:', rooms);
        for (const room of rooms) {
            const senderID = room.sender_id; // Sender is the first ID
            if (!uniqueReceivers.has(senderID)) {
                uniqueSenders.add(senderID);
            }
        }
        for (const sender of uniqueSenders) {
            await renderDMRoom(sender, true);
        }
    });

    // Handle sent DMs (messages sent by current user)
    socket.on('loadSentDMs', async (rooms) => {
        //console.log('Sent DMs:', rooms);
        for (const room of rooms) {
            const receiverID = room.receiver_id; // Receiver is the second ID
            if (!uniqueSenders.has(receiverID)) {
                uniqueReceivers.add(receiverID);
            }
        }
        for (const receiver of uniqueReceivers) {
            await renderDMRoom(receiver, false);
        }
    });
}

// makes popup, used in a lot of spaces, mainly frotend shit doesn't matter
function createDraggablePopup(title, username) {
    const dragPop = document.getElementById('draggable-popup');
    if (dragPop) {
        dragPop.remove();
        socket.emit('leave');
    }

    const popup = document.createElement('div');
    popup.id = 'draggable-popup';
    popup.classList.add('draggable-popup');

    const header = document.createElement('div');
    header.classList.add('popup-header');
    header.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.classList.add('popup-close');
    closeButton.addEventListener('click', () => {
        socket.emit('leave');
        popup.remove();
    });

    const userListBar = document.createElement('div');
    userListBar.classList.add('user-list-bar');
    userListBar.innerHTML = `
        <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="users"></ul>
    `;

    const content = document.createElement('div');
    content.classList.add('popup-content');
    content.innerHTML = `
        <div class="chat-messages"></div>
        <div class="chat-form-container">
            <form id="chat-form">
                <input id="msg" type="text" placeholder="Enter Message" required autocomplete="off" />
                <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
            </form>
        </div>
    `;

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');

    header.appendChild(closeButton);
    popup.appendChild(header);
    popup.appendChild(userListBar);
    popup.appendChild(content);
    popup.appendChild(resizeHandle);
    document.body.appendChild(popup);

    popup.style.top = '100px';
    popup.style.left = '100px';

    makePopupDraggable(popup, header);
    makePopupResizable(popup, resizeHandle);
    initializeChat(popup, title, username);
}

// loads past messages and updates chat when other users send messages
async function initializeChat(popup, room, username) {
    const project_id = await getProjectID(room);
    const user_id = await getUserID(username);
    const chatForm = popup.querySelector('#chat-form');
    const chatMessages = popup.querySelector('.chat-messages');
    const userList = popup.querySelector('#users');

    if (!chatForm || !chatMessages || !userList) {
        console.error('Chat elements not found in the popup.');
        return;
    }

    socket.emit('joinRoom', { user_id, username, project_id });

    // Listen for the list of users in the project
    socket.on('roomUsers', ({ project_id, users }) => {
        // Clear the existing user list
        userList.innerHTML = '';

        // Populate the user list with all users in the project
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `<button onclick="privateMessage('${user.name}')">${user.name}</button>`;
            userList.appendChild(li);
        });
    });

    socket.on('message', message => { // when a message is recieved, output it to the popup
        outputMessage(message, chatMessages);
        chatMessages.scrollTop = chatMessages.scrollHeight; // makes it auto scroll down to newest message
    });

    socket.on('bot-alert', message => {
        outputBotAlert(message, chatMessages);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('loadMessages', async messages => { // loads past messages in the chat
        for (const message of messages) {
            const username = await getUserName(message.sender_id) || 'Unknown User';
            outputMessage({
                username,
                user_id: message.user_id,
                text: message.message,
                time: message.time
            }, chatMessages);
        }
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = e.target.elements.msg.value;
        socket.emit('chatMessage', user_id, msg, project_id, false);
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    });

    function outputMessage(message, chatMessages) { // adds message to popup
        const div = document.createElement('div');
        const time = ((message.time).replace(':', ' ')).replace(':', ' ');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${time}</span></p>
                         <p class="text">${message.text}</p>`;
        chatMessages.appendChild(div);
    }

    function outputBotAlert(message, chatMessages) {
        const div = document.createElement('div');
        const time = ((message.time).replace(':', ' ')).replace(':', ' ');
        div.classList.add('bot-alert');
        div.innerHTML = `<p class="meta">${message.username} ⋅ <span>${time}</span></p>
                         <p class="text">${message.text}</p>`;
        chatMessages.appendChild(div);
    }
}

async function initializeDMChat(popup, UID, PID) {
    const username = await getUserName(UID);
    const privName = await getUserName(PID);
    const roomName = username > privName ? `${privName + ' and ' + username}` : `${username + ' and ' + privName}`;
    const chatForm = popup.querySelector('#chat-form');
    const chatMessages = popup.querySelector('.chat-messages');
    const userList = popup.querySelector('#users');

    if (!chatForm || !chatMessages || !userList) {
        console.error('Chat elements not found in the popup.');
        return;
    }

    console.log('Initializing DM chat for room:', roomName);
    socket.emit('joinDMRoom', UID, username, PID, roomName);

    //socket.off('roomUsers');
    socket.off('message');
    socket.off('loadDMMessages');
    socket.off('loadDMs');
    socket.off('loadSentDMs');

    // socket.on('roomUsers', ({ project_id, users }) => {
    //    // userList.innerHTML = `${users.map(user => `<li><button onclick="privateMessage('${user.username}')">${user.username}</button></li>`).join('')}`;
    // });

    socket.on('message', message => {
        outputMessage(message, chatMessages);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('loadDMMessages', async () => {
        console.log('Loading DM messages...');
        socket.emit('getDMs', UID);
        socket.emit('sentDMs', UID);

        const [receivedDMs, sentDMs] = await Promise.all([
            new Promise(resolve => socket.once('loadDMs', resolve)),
            new Promise(resolve => socket.once('loadSentDMs', resolve))
        ]);

        let chats = [];
        //console.log(receivedDMs)
        //console.log(sentDMs)
        // Process received DMs
        for (const room of receivedDMs) {
            //console.log(room.sender_id, PID);
            console.log(typeof room.sender_id, typeof PID)
            if (String(room.sender_id) === String(PID)) {
                
                const username = await getUserName(room.sender_id);
                chats.push({
                    username,
                    user_id: room.sender_id,
                    text: room.message,
                    time: room.time
                });
            }
        }

        // Process sent DMs
        for (const room of sentDMs) {
            //console.log(room.sender_id, PID);
            console.log(typeof room.sender_id, typeof PID)
            if (String(room.receiver_id) === String(PID)) {
                console.log('hi')
                const username = await getUserName(room.sender_id);
                chats.push({
                    username,
                    user_id: room.sender_id,
                    text: room.message,
                    time: room.time
                });
            }
        }
        console.log(chats)
        // Sort messages by time
        chats.sort((a, b) => new Date(a.time) - new Date(b.time));

        // Clear existing messages in the chat container
        chatMessages.innerHTML = '';

        // Render all messages
        chats.forEach(msg => outputMessage(msg, chatMessages));

        // Auto-scroll to the latest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = e.target.elements.msg.value;
        socket.emit('chatMessage', UID, msg, PID, true);
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    });

    function outputMessage(message, chatMessages) {
        const div = document.createElement('div');
        const time = ((message.time).replace(':', ' ')).replace(':', ' ');
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${time}</span></p>
                         <p class="text">${message.text}</p>`;
        chatMessages.appendChild(div);
    }
}

async function createDMPopup(UID, PID){
    const dragPop = document.getElementById('draggable-popup');
    if (dragPop) {
        dragPop.remove();
        socket.emit('leave');
    }

    const popup = document.createElement('div');
    popup.id = 'draggable-popup';
    popup.classList.add('draggable-popup');

    const username = await getUserName(UID);
    const privName = await getUserName(PID);
    const roomName = username > privName ? `${privName + ' and ' + username}` : `${username + ' and ' + privName}`

    const header = document.createElement('div');
    header.classList.add('popup-header');
    header.textContent = roomName; // see what this does

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.classList.add('popup-close');
    closeButton.addEventListener('click', () => {
        socket.emit('leave');
        popup.remove();
    });

    const userListBar = document.createElement('div');
    userListBar.classList.add('user-list-bar');
    userListBar.innerHTML = `
        <h3><i class="fas fa-users"></i> Users</h3>
        <ul id="users"></ul>
    `;

    const content = document.createElement('div');
    content.classList.add('popup-content');
    content.innerHTML = `
        <div class="chat-messages"></div>
        <div class="chat-form-container">
            <form id="chat-form">
                <input id="msg" type="text" placeholder="Enter Message" required autocomplete="off" />
                <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
            </form>
        </div>
    `;

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');

    header.appendChild(closeButton);
    popup.appendChild(header);
    popup.appendChild(userListBar);
    popup.appendChild(content);
    popup.appendChild(resizeHandle);
    document.body.appendChild(popup);

    popup.style.top = '100px';
    popup.style.left = '100px';

    makePopupDraggable(popup, header);
    makePopupResizable(popup, resizeHandle);
    initializeDMChat(popup, UID, PID);
}

// when you click on user's name from user list bar to dm them
async function privateMessage(privUser) {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    if (username === privUser) { // dont let user dm themselves like an idiot
        return;
    }

    const dragPop = document.getElementById('draggable-popup');
    dragPop.remove();
    socket.emit('leave');
    const UID = await getUserID(username);
    const PID = await getUserID(privUser);
    console.log('yoyoyo')
    console.log(UID, PID);
    //socket.emit('getDMs', UID)
    //socket.emit('sentDMs', UID)
    createDMPopup(UID, PID);

    // Explicitly emit loadDMMessages to fetch past messages
    // Explicitly emit loadDMMessages to fetch past messages
    // setTimeout(() => {
    //     console.log("Emitting loadDMMessages after opening popup");
    //     socket.emit('loadDMMessages');
    // }, 500);
    
    // Explicitly emit loadDMMessages to fetch past messages
    // setTimeout(() => {
    //     console.log("Emitting loadDMMessages after opening popup");
    //     socket.emit('loadDMMessages');
    // }, 500); 
}

// frontend shit (doesn't matter)
function makePopupDraggable(popup, header) {
    let offsetX, offsetY, isDragging = false;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
        popup.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            popup.style.left = `${e.clientX - offsetX}px`;
            popup.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// frontend shit (doesn't matter)
function makePopupResizable(popup, resizeHandle) {
    let isResizing = false;
    let initialWidth, initialHeight, initialX, initialY;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        initialWidth = popup.offsetWidth;
        initialHeight = popup.offsetHeight;
        initialX = e.clientX;
        initialY = e.clientY;
        document.body.style.cursor = 'se-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const widthChange = e.clientX - initialX;
            const heightChange = e.clientY - initialY;
            popup.style.width = `${initialWidth + widthChange}px`;
            popup.style.height = `${initialHeight + heightChange}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
        }
    });
}