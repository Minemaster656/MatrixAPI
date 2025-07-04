let httpProtocol = "http://";
let wsProtocol = "ws://";
if (window.location.protocol === "https:") {
    httpProtocol = "https://";
    wsProtocol = "wss://";
}
const apiUrl = httpProtocol + window.location.host + "/api";
const wsUrlGeneric = wsProtocol + window.location.host;
const md = window.markdownit();


let isPageFocused = true;

window.addEventListener("focus", () => {
    isPageFocused = true;
});

window.addEventListener("blur", () => {
    isPageFocused = false;
});

