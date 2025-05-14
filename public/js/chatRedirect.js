const messageBtn = document.querySelector('.message-btn');

if (messageBtn) {
  // Generate and store a unique user ID if not already stored
  if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', 'user_' + Math.random().toString(36).substr(2, 9));
  }

  const senderId = localStorage.getItem('userId');
  const adminId = 'admin';

  // Add event listener to redirect when the message button is clicked
  messageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const roomId = [senderId, adminId].sort().join('_');
    window.location.href = `/inbox?roomId=${roomId}&sender=${senderId}`;
  });
}
