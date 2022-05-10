import { Avatar } from "@material-ui/core";
import React, { forwardRef } from "react";
//import { useSelector } from "react-redux";
//import { selectUser } from "./features/userSlice";
//import "./Message.css";

import styled from "styled-components";

const MsgDiv = styled.div`
  /* */
  .message {
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
    justify-content: space-between;
    margin: 15px;
  }
  .message > p {
    background-color: #f3f3f5;
    font-size: medium;
    padding: 15px;
    border-radius: 20px;
    margin: 10px;
    margin-right: auto;
  }
  .message > small {
    color: gray;
    position: absolute;
    font-size: 8px;
    bottom: -5px;
    right: 0;
  }
  .message__sender {
    margin-left: auto;
  }

  .message__sender > .message__photo {
    order: 1;
    margin: 15px;
  }

  .message__photo {
    order: 0;
  }

  .message__sender > p {
    background-color: #3cabfa;
    color: white;
  }
`;

/*
const Form = styled(Message)`
  .message {
    display: flex;
    align-items: center;
    position: relative;
    width: fit-content;
    justify-content: space-between;
    margin: 15px;
  }

  .message > p {
    background-color: #f3f3f5;
    font-size: medium;
    padding: 15px;
    border-radius: 20px;
    margin: 10px;
    margin-right: auto;
  }

  .message > small {
    color: gray;
    position: absolute;
    font-size: 8px;
    bottom: -5px;
    right: 0;
  }

  .message__sender {
    margin-left: auto;
  }

  .message__sender > .message__photo {
    order: 1;
    margin: 15px;
  }

  .message__photo {
    order: 0;
  }

  .message__sender > p {
    background-color: #3cabfa;
    color: white;
  }
`;
*/

/*
const Message = forwardRef(
  (
    { id, contents: { timestamp, displayName, email, message, photo, uid } },
    ref
  ) => {
*/
/*
function ChatMessage({
  user,
  contents: { timestamp, message, sender, photo },
  className,
}) {
  */

function Message({
  user,
  chat,
  contents: { timestamp, message, sender, photo, chatId },
}) {
  // console.log("PROPS ", props);
  console.log("CHAT ", user, chat, sender, message, chatId);
  console.log("CHAT ", user.uuid === sender);

  return (
    <MsgDiv>
      <div
        className={`message ${user.uuid === sender ? "message__sender" : ""}`}
      >
        {user.uuid !== sender && (
          <Avatar className="message__photo" src={photo} />
        )}
        <p>{message}</p>
        <small>{new Date(timestamp).toLocaleString()}</small>
      </div>
    </MsgDiv>
  );
}

const ChatMessage = (props, ref) => {
  console.log("PROPS HERE ", props);
  //sender: 'hamza-id', receiver: 'tero-id'

  if (
    props.chat === props.contents.chatId ||
    (props.contents.sender === props.chat &&
      props.contents.receiver === props.user.uuid) ||
    (props.contents.receiver === props.chat &&
      props.contents.sender === props.user.uuid)
  ) {
    return <Message {...props} ref={ref} />;
  } else {
    return null;
  }
};

export default forwardRef(ChatMessage);
