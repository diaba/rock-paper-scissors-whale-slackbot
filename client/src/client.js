// initially taken from https://github.com/Juriy/gamedev/blob/master/rps/client/src/client.js to learn node.js - after which i added my own stuff (e.g. scoring + more play options + automatic computer plays) + changed things

const writeEvent = (text) => {
  // <ul> element
  const parent = document.querySelector('#events'); // events is the id of our wrapper

  // <li> element
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
  
  parent.scrollTop = parent.scrollHeight;
};

const updateScore = (text) => {
  // <ul> element
  // const parent = document.querySelector('#score'); // events is the id of our wrapper
  // parent.innerHTML = text;
  if (text == "newScores") {
  	document.getElementById('score').innerHTML = "Scores:\n";
  } else {
  	document.getElementById('score').innerHTML += "<p>"+text+"<\p>";
  }


};

const onFormSubmitted = (e) => { // executed when user pressed enter to submit the form
  e.preventDefault(); // bc we dont need to submit the form and reload the page - we'll submit the data ourselves

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', text); /// send the text across the socket to the server
};

const addButtonListeners = () => {
  ['rock', 'paper', 'scissors', 'whale', 'slackbot'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
      sock.emit('turn', id); //emit== send
    });
  });
};




writeEvent('Welcome to Rock Paper Scissors Whale Slackbot!');

const sock = io();
sock.on('message', writeEvent); // receiving the message
sock.on('score', updateScore);

document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted); // whenever we have submit- this func (onFormSubmitted) is called

addButtonListeners();