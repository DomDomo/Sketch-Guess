import { socket } from "./script.js";

let username;

window.addEventListener('load', () => {
  const $loginForm = document.getElementById('loginForm');
  const $nameInput = document.getElementById('nameInput');

  // Login

  $loginForm.addEventListener('submit', function(event) {
    console.log('TESTING');
    event.preventDefault();
    let name = $nameInput.value;
    login(name);
  })


  function login(name) {
    username = name;
    socket.emit('login', username);
    console.log(username);
    
  }

}) 