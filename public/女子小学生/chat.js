/**
 * chat system
 */
function init_chat(socket, form, messages, msgInput) {
  form.submit(function() {
    socket.emit('chat message up', msgInput.val());
    msgInput.val('');
    return false;
  });

  socket.on('chat message2', function(msg) {
    messages.prepend($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
};
