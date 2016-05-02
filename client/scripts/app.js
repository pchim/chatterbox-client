// YOUR CODE HERE:
var app = {
  init: function () {
    $('.username').on('click', function() {
      app.addFriend();
    });
    $('#send .submit').on('submit', app.handleSubmit);

  },
  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },
  server: 'https://api.parse.com/1/classes/messages',
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    $username = $('<div class=\'username\'></div>');
    $('#chats').append($username);

  },
  addRoom: function(roomName) {
    $('#roomSelect').append('<div>,</div>');
  },
  addFriend: function(friendName) {

  },
  handleSubmit: function() {
    console.log('hs called');
  }
};






