let httpProtocol = "http://";
let wsProtocol = "ws://";
if (window.location.protocol === "https:") {
    httpProtocol = "https://";
    wsProtocol = "wss://";
}
let CONNECTION_NAME
const apiUrl = httpProtocol + window.location.host + "/api";
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

/** @type {HTMLInputElement} */
let enableSoundsCheckbox = document.getElementById("enable-sounds");

// Check if the enableSounds property is saved in local storage
if (localStorage.getItem("enableSounds") === null) {
    localStorage.setItem("enableSounds", "true");
}

// Set the checkbox to the saved value on page load
enableSoundsCheckbox.checked = localStorage.getItem("enableSounds") === "true";

// Add event listener to save the checkbox value when it changes
enableSoundsCheckbox.addEventListener("change", function () {
    localStorage.setItem("enableSounds", enableSoundsCheckbox.checked);
    enableSounds = enableSoundsCheckbox.checked;
});

// Read the checkbox value to determine if sounds are enabled
let enableSounds = enableSoundsCheckbox.checked;

/**
 * @param {String} message
 */
function onSocketMessage(message) {
    // console.log(`Received websocket message: ${message}`)
    /** @type {Object}*/
    let msg_parsed = JSON.parse(message);
    if (msg_parsed["type"] == "message") {
        makeMessage(msg_parsed["content"]);
        if (!isPageFocused && enableSounds) playAudioFromStatic("message.mp3");
    } else if (msg_parsed.type == "join") {
        makeMessage(`Пользователь ${msg_parsed["name"]} присоединился`, "msgtype-join");
        if (!isPageFocused && enableSounds) playAudioFromStatic("join.mp3");
    }
}
function makeMessage(message, type = "") {
    let msg_container = document.createElement("div");
    msg_container.classList.add("message");
    type != "" ? msg_container.classList.add(type) : "";
    msg_container.innerHTML = md.render(message);
    messages_container.appendChild(msg_container);

    messages_container.scrollTop = messages_container.scrollHeight;
}

function connect() {
    socket = new WebSocket(wsUrlGeneric + "/api/msg/ws");

    socket.onopen = function () {
        console.log("Соединение установлено");
        reconnectAttempts = 0;
        const connectionName = CONNECTION_NAME;
        socket.send(JSON.stringify({ type: "auth", name: connectionName }));
    };

    socket.onmessage = function (event) {
        console.log("Получено сообщение:", event.data);
        onSocketMessage(event.data);
    };

    socket.onerror = function (error) {
        console.error("Ошибка:", error.message);
    };

    socket.onclose = function (event) {
        console.log("Соединение закрыто, код:", event.code, "причина:", event.reason);
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
 * @param {String} msg
 */
function sendMessage(msg) {
    fetch(apiUrl + "/msg/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
    })
        .then((response) => response.json())
        .then((data) => {
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

message_field.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
        event.preventDefault();
        sendMessage(message_field.value);
        message_field.value = "";
    }
});

document.getElementById("connect").addEventListener("click", () => {
    CONNECTION_NAME = document.getElementById("connection-name-input").value;
    connect();
    document.getElementById("connection-modal").remove()
});
