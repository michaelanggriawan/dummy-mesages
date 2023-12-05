const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { getLatestMessagePreview } = require('./helpers/user');

const adapter = new FileSync('db.json');
const db = low(adapter);

module.exports = (req, res, next) => {
  if (req.url === '/users' && req.method === 'GET') {
    const users = db.get('users').value();
    const messages = db.get('messages').value();

    const usersWithMessages = users.map(user => {
      const userMessages = messages.filter(
        message => message.sender_id === user.id || message.receiver_id === user.id
      );
      return {
        ...user,
        previewMessage: getLatestMessagePreview(user.id, userMessages),
      };
    });
    return res.json(usersWithMessages.filter((user) => user.id !== 0));
  }  else if (req.url.startsWith('/users') && req.url.includes('/messages') && req.method === 'GET') {
    const userId = parseInt(req.url.split('/')[2]); // Assuming the URL is /users/:userId/messages/:otherUserId
    const otherUserId = parseInt(req.url.split('/')[4]);

    if (!isNaN(userId) && !isNaN(otherUserId)) {
      const userMessages = db
        .get('messages')
        .filter(
          message =>
            (message.sender_id === userId && message.receiver_id === otherUserId) ||
            (message.sender_id === otherUserId && message.receiver_id === userId)
        )
        .value();

      return res.json(userMessages);
    } else {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }
  } {
    next();
  }
};
