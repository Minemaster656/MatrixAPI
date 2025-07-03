/** @type {WebSocket} */
let socket;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_INTERVAL = 2000; // 2 секунды

/**
 *
 * @param {String} message
 */
function onSocketMessage(message) {}

function connect() {
    socket = new WebSocket("ws://localhost:8000/ws");

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
function sendMessage(msg) {
    if (socket.CLOSED) {
        connect();
    }
    socket.send(msg);
}

/** @type {HTMLButtonElement} */
const send_button = document.getElementById("message-send");
/** @type {HTMLTextAreaElement} */
const message_field = document.getElementById("message-input");
/** @type {HTMLDivElement} */
const messages_container = document.getElementById("history");
