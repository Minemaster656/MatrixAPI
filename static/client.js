
let httpProtocol = 'http://';
let wsProtocol = 'ws://';
if (window.location.protocol === 'https:') {
  httpProtocol = 'https://';
  wsProtocol = 'wss://';
}


const apiUrl = httpProtocol + window.location.host + '/api';
const wsUrlGeneric = wsProtocol + window.location.host;
const md = window.markdownit();

/** @type {WebSocket} */
let socket;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL = 2000; // 2 секунды

/** @type {HTMLButtonElement} */
const send_button = document.getElementById("message-send");
/** @type {HTMLTextAreaElement} */
const message_field = document.getElementById("message-input");
/** @type {HTMLDivElement} */
const messages_container = document.getElementById("history");
/**
 *
 * @param {String} message
 */
function onSocketMessage(message) {
    let msg_container = document.createElement("div");
    msg_container.classList.add("message");
    msg_container.innerHTML = md.render(message);
    messages_container.appendChild(msg_container);
}

function connect() {
    socket = new WebSocket(wsUrlGeneric+"/api/msg/ws");

    socket.onopen = function () {
        console.log("Соединение установлено");
        reconnectAttempts = 0;
    };

    socket.onmessage = function (event) {
        console.log("Получено сообщение:", event.data);
        onSocketMessage(event.data);
    };

    socket.onerror = function (error) {
        console.error("Ошибка:", error.message);
    };

    socket.onclose = function (event) {
        console.log(
            "Соединение закрыто, код:",
            event.code,
            "причина:",
            event.reason
        );
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => {
                reconnectAttempts++;
                console.log("Попытка переподключения №", reconnectAttempts);
                connect();
            }, RECONNECT_INTERVAL);
        } else {
            console.log("Достигнут лимит попыток переподключения");
        }
    };
}

// Запуск соединения
connect();
/**
 * Send a message with WebSocket
 * @param {Object} msg
 */
function sendMessageBySocket(msg) {
    if (socket.CLOSED) {
        connect();
    }
    socket.send(msg);
}
/**
 * 
 * @param {String} msg 
 */
function sendMessage(msg) {
    fetch(apiUrl + "/msg/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

send_button.addEventListener("click", () => {
    sendMessage(message_field.value);
    message_field.value = "";
});
