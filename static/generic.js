// let httpProtocol = 'http://';
// let wsProtocol = 'ws://';
// if (window.location.protocol === 'https:') {
//   httpProtocol = 'https://';
//   wsProtocol = 'wss://';
// }

// // Пример использования:
// const apiUrl = httpProtocol + window.location.host + '/api';
// const wsUrlGeneric = wsProtocol + window.location.host;

let isPageFocused = true;

window.addEventListener("focus", () => {
    isPageFocused = true;
});

window.addEventListener("blur", () => {
    isPageFocused = false;
});
