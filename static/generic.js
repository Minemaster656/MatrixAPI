let httpProtocol = 'http://';
let wsProtocol = 'ws://';
if (window.location.protocol === 'https:') {
  httpProtocol = 'https://';
  wsProtocol = 'wss://';
}

// Пример использования:
const apiUrl = httpProtocol + window.location.host + '/api';
const wsUrl = wsProtocol + window.location.host + '/ws';
