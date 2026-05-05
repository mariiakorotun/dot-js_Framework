import { dot } from '../framework/dot.js';

// 1. Стан
const state = dot.initState({
  users: ['Alice', 'Bob'],
  newUser: ''
});

dot.component('user-list', (s) => `
  <ul>
    ${s.users.map(user => `<li>${user}</li>`).join('')}
  </ul>
  <input type="text" id="userInput" placeholder="Name">
  <button on-click="state.users.push(document.getElementById('userInput').value)">
    Add User
  </button>
`);

await dot.loadTemplate('./index.html');
dot.mount('#app');