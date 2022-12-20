//* including socket
const socket = io('http://localhost:8000');


//* getting user name

const userName = prompt("Enter your name to join chat");
const formMessage = document.querySelector('#send__message__form');

//* const send tune

var messageSendRecievedTune = new Audio('news-ting-6832.mp3');
var userConnectDisconnectTune = new Audio("bicycle-bell_19-80368.mp3");


//* addding message/update in container
const udpateChatContainer = (message, action) => {
    const newElement = document.createElement('div');
    newElement.classList.add('message');
    newElement.classList.add(action);
    newElement.innerText = message;
    document.querySelector('.chat__body').append(newElement);
    if ((action == "send") || (action == "recieved")) {
        messageSendRecievedTune.play();
    }
    
    if ((action == "full")) {
        userConnectDisconnectTune.play();
    }
}

//* telling server user wants to connect
socket.emit('user-connect', userName);


//* when new user connected
socket.on("user-connected", (name) => {
    udpateChatContainer(`${name} joined the chat`, 'full');
});

socket.on("user-disconnect", (response) => {
    udpateChatContainer(`${response.user} disconnect beacuse of ${response.message}`, 'full');
});



//* on sending message
formMessage.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('type__message').value;
    socket.emit('sent-message', message);
    //* updating chat container
    udpateChatContainer(`You: ${message}`, 'send');
    document.getElementById('type__message').value = "";
});



//* on recieving messgae

socket.on('recieved-message', (recievedMessageData) => {
    //* updating chat container
    udpateChatContainer(`${recievedMessageData.user}: ${recievedMessageData.message}`, 'recieved');
})


