import React from "react";
import { ChatFeed, Message } from "react-chat-ui";

export default ({ messages, sender, senderName, receiverName }) => (
  <ChatFeed
    maxHeight={window.innerHeight - 80}
    messages={messages.map(
      (msg) =>
        new Message({
          id: msg.sender === sender ? 0 : msg.messageId,
          senderName: msg.sender === sender ? senderName : receiverName,
          message: msg.body,
        })
    )}
    isTyping={false}
    showSenderName
    bubblesCentered={false}
  />
);
