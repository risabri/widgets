import { IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import React, { useEffect, useState, useRef } from "react";
//import { useSelector } from "react-redux";
//import "./Chat.css";
//import { selectChatId, selectChatName } from "./features/chatSlice";
//import db from "./firebase";
import ChatMessage from "./ChatMessage";
//import firebase from "firebase";
//import { selectUser } from "./features/userSlice";
//import FlipMove from "react-flip-move";
import { Op } from "@prifina/hooks";
import { useAppContext } from "./IMessage";
import styled from "styled-components";

const ChatContainer = styled.div`
  /* */
  width: 60%;
`;

const Form = styled(Chat)`
  .chat {
    display: flex;
    flex-direction: column;
    flex: 0.65;
    height: 100vh;
    background-color: white;
  }

  .chat__header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    background-color: #f5f5f5;
  }

  .chat__header > h4 {
    font-weight: 500;
    color: gray;
  }

  .chat__name {
    color: black;
  }

  .chat__input {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-top: 1px solid lightgray;
    background-color: #f5f5f5;
  }

  .chat__input > form {
    flex: 1;
  }

  .chat__messages {
    flex: 1;
    overflow: scroll;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .chat__messages::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .chat__messages {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .chat__input > form > input {
    width: 98%;
    outline-width: 0;
    border: 1px solid lightgray;
    border-radius: 999px;
    padding: 5px;
  }

  .chat__input > form > button {
    display: none;
  }
`;

function useIsMountedRef() {
  const isMountedRef = useRef(null);
  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });
  return isMountedRef;
}

function Chat({ newChat, className }) {
  //const user = useSelector(selectUser);

  const { appID, API, receiver, sender, newChatMessage } = useAppContext();

  const [input, setInput] = useState("");
  const chatName = receiver.name;
  //const chatId = useSelector(selectChatId);
  const [messages, setMessages] = useState([]);
  const [chatSelected, setChatSelected] = useState(false);
  //const [chatId, setChatId] = useState("");
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (newChatMessage.length) {
      console.log("CHAT NEW MSG from Context ", newChatMessage);
      const msgList = newChatMessage.map((m) => ({
        id: m.messageId,
        data: {
          timestamp: m.createdAt,
          message: m.body,
          sender: m.sender,
          receiver: m.receiver,
          chatId: m.chatId,
        },
      }));
      setMessages((messages) => [...messages, ...msgList]);
    }
  }, [newChatMessage]);

  useEffect(() => {
    console.log("CHAT SELECTED...", receiver);
    if (receiver?.chatId !== undefined && receiver.chatId !== "") {
      /*
      const filter = {
        ["chatId"]: {
          [Op.eq]: receiver.chatId,
        },
      };
      */
      const filter = {
        ["sender"]: {
          [Op.eq]: receiver.chatId,
        },
      };

      //{ chatId: receiver.chatId }

      API[appID].Messaging.queryGetMessages({
        filter: filter,
      }).then((msgs) => {
        console.log("MSGS ", msgs);
        //{ id,user, contents: { timestamp, message,sender} },

        // sort createdAt...
        const sortedMsgs = msgs.data.getMsgs.sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        );

        setMessages(
          sortedMsgs.map((m) => ({
            id: m.messageId,

            data: {
              timestamp: m.createdAt,
              message: JSON.parse(m.body),
              sender: m.sender,
              receiver: m.receiver,
              chatId: m.chatId,
            },
          }))
        );
        //setChatId(receiver.chatId);
        setChatSelected(true);
      });
    }
  }, [receiver?.chatId, newChat]);

  const sendMessage = (e) => {
    console.log("SAVE MSG ", input, sender, receiver);
    e.preventDefault();

    API[appID].Messaging.mutationCreateMessage({
      variables: {
        body: JSON.stringify(input),
        receiver: receiver.chatId,
        sender: sender.uuid,
        chatId: receiver.chatId,
      },
    }).then((res) => {
      console.log("CREATE MSG ", res);

      setMessages((messages) => [
        ...messages,
        {
          id: res.data.createMessage.messageId,
          data: {
            timestamp: res.data.createMessage.createdAt,
            message: input,
            sender: sender.uuid,
            receiver: res.data.createMessage.receiver,
            chatId: receiver.chatId,
          },
        },
      ]);

      setInput("");
    });

    setInput("");
  };
  useEffect(() => {
    let scrollTimer = null;
    let msgTimer = [];
    //if (isMountedRef.current) {
    let chatDiv = document.getElementsByClassName("chat");
    let msgDiv = document.getElementsByClassName("chat__messages");
    //let msgDiv = document.getElementsByClassName("chat__input");

    //console.log("CHATS ", msgDiv);
    if (msgDiv.length > 0) {
      //console.log("CHATS ", chatDiv[0].scrollHeight);
      scrollTimer = setTimeout(() => {
        //console.log("SCROLL ");
        msgDiv[0].scrollTop = chatDiv[0].scrollHeight;
        //console.log("SCROLL ", chatDiv[0].scrollHeight);
      }, 200);

      //let msg = { messageId: variables.messageId, status: variables.status };
      //mutationUpdateMessageStatus
      /*
      data:
chatId: "hamza-id"
message: "hi"
receiver: "hamza-id"
sender: "tero-id"
timestamp: 1652248162416
[[Prototype]]: Object
id: "0eec23f8-7994-42ce-ab08-aa3ca7ebf12a"
*/
      let sentMessages = [];
      messages.forEach((m) => {
        if (
          m.data.receiver === sender.uuid &&
          m.data.sender === receiver.chatId
        ) {
          sentMessages.push(m);
        }
      });
      console.log("UPDATE MSG STATUS ", sentMessages);
      msgTimer = sentMessages.map((m) => {
        return setTimeout(async () => {
          await API[appID].Messaging.mutationUpdateMessageStatus({
            variables: { messageId: m.id, status: 1 },
          });
        }, 500);
      });
    }
    // }
    return () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);

        msgTimer.forEach((t) => {
          clearTimeout(t);
        });
      }
    };
  });
  // }, [isMountedRef, receiver]);
  //console.log("MESSAGES ", messages);
  return (
    <ChatContainer>
      <div className={className}>
        <div className="chat">
          <div className="chat__header">
            <h4>
              To: <span className="chat__name">{chatName}</span>
            </h4>
            <strong>Details</strong>
          </div>

          {/* chat messages */}
          <div className="chat__messages">
            {/* 
            {chatSelected && (
              <FlipMove>
                {messages.map((m) => {
                  console.log("EXTRA ", chatSelected, receiver, m);
                  //if (receiver.chatId !== m.data.chatId) return null;
                  return (
                    <ChatMessage
                      key={m.id}
                      user={sender}
                      chat={receiver.chatId}
                      contents={m.data}
                    />
                  );
                })}
              </FlipMove>
            )}
            */}
            {chatSelected &&
              messages.map((m) => {
                console.log("EXTRA ", chatSelected, receiver, m);
                //if (receiver.chatId !== m.data.chatId) return null;
                return (
                  <ChatMessage
                    key={m.id}
                    user={sender}
                    chat={receiver.chatId}
                    contents={m.data}
                  />
                );
              })}
          </div>
          {receiver?.chatId !== undefined && (
            <div className="chat__input">
              <form>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="iMessage"
                  type="text"
                />
                <button onClick={sendMessage}>Send Message</button>
              </form>

              <IconButton onClick={sendMessage}>
                <SendIcon className="chat__send" />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </ChatContainer>
  );
}

export default Form;
