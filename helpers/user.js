function getLatestMessagePreview (userId, messages)  {
    const userMessages = messages.filter(
      message => message.sender_id === userId || message.receiver_id === userId
    );
  
    const latestMessage = userMessages.reduce((latest, message) => {
      return latest && latest.timestamp > message.timestamp ? latest : message;
    }, null);
  
    return latestMessage ? latestMessage.text : '';
  };

module.exports = {
    getLatestMessagePreview,
}