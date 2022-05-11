import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import { usePrifina, Op } from "@prifina/hooks";
import IM from "@prifina/messaging";
import styled from "styled-components";

import Sidebar from "./SideBar";
import Chat from "./Chat";

const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

const AppContainer = styled.div`
  /* */
  display: flex;
`;

// unique appID for the widget....
const appID = "IM-app";

const IMessage = (props) => {
  const { data } = props;
  console.log("DATA PROPS ", data);
  // init hook and get provider api services...
  const {
    currentUser,
    onUpdate,
    Prifina,
    API,
    registerHooks,
    registerClient,
    unSubscribe,
  } = usePrifina();
  const [hooksReady, setHooks] = useState(false);
  const [newChat, setNewChat] = useState(0);
  const chat = useRef({});
  const subscriptionHandler = useRef(null);
  const [newMessage, setNewMessage] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState([]);

  const dataUpdate = (payload) => {
    console.log("UPDATE TEST PAYLOAD", payload, chat.current);
    // payload.messagingStatus.cnt
    /*
    {addMessage: {…}}
    addMessage:
    receiver: "Testing-uuid"
    result: "{\"cnt\":1,\"lastMessage\":\"2022-05-06T09:28:52.515Z\"}"
*/
    if (payload?.addMessage !== undefined) {
      const statusRes = JSON.parse(payload.addMessage.result);
      if (statusRes.cnt > 0) {
        /* 
        if (statusRes.cnt === 1 && statusRes.chatId === chat.current.chatId) {
          //newChatMessages.push(mm);
          setNewMessage([statusRes]);
          setNewChatMessage([statusRes]);
        } else { */
        API[appID].Messaging.queryGetUnreadMessages({}).then((m) => {
          console.log("UNREAD ", m);

          // console.log("UNREAD ", m.data);
          //console.log("UNREAD ", Object.keys(m.data));

          let newChatMessages = [];
          let newMessages = [];
          if (m.data.getUnreadMsgs.length > 0) {
            m.data.getUnreadMsgs.forEach((mm) => {
              console.log("UNREAD UPDATE ", chat.current, mm);

              if (
                chat.current?.chatId !== undefined &&
                (mm.sender === chat.current.chatId ||
                  m.chatId === currentUser.uuid)
              ) {
                newChatMessages.push(mm);
              }

              newMessages.push(mm);
            });
          }
          if (newMessages.length > 0) {
            setNewMessage(newMessages);
          }
          if (newChatMessages.length > 0) {
            setNewChatMessage(newChatMessages);
          }

          //setNewMessage(m.data.queryGetUnreadMessages);
          //setNewChatMessage(m.data.queryGetUnreadMessages);
        });
        //}
      }
    }
  };
  useEffect(() => {
    // init callback function for background updates/notifications
    console.log("SUBS HANDLER ", subscriptionHandler.current);
    const onUpdateID = onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [IM]);
    registerClient([data.appSyncClient]);

    API[appID].Messaging.subscribeMessagingStatus({
      variables: {
        receiver: currentUser.uuid,
      },
    }).then(() => {
      subscriptionHandler.current = onUpdateID;
      setHooks(true);
    });

    return () => {
      console.log("HOOK UNLOAD....");
      unSubscribe(appID, subscriptionHandler.current);
      //const unSubscribe = useCallback((appID, onUpdateID, subscription) => {
    };
  }, []);

  const initChat = (receiver) => {
    console.log("CHAT ", receiver, newChat);
    chat.current = receiver;
    setNewChat(newChat + 1);
  };
  const addMsg = () => {
    if (chat.current?.chatId !== undefined) {
      const newMsg = prompt("Please enter msg");
      if (newMsg !== null && newMsg !== "") {
        //const chats = document.querySelectorAll("div[data-chatId]");
        //const firstChat = chats[0].dataset["chatid"];

        API[appID].Messaging.mutationCreateTestMessage({
          variables: {
            body: JSON.stringify(newMsg),
            sender: currentUser.uuid,
            chatId: chat.current.chatId,
            receiver: chat.current.chatId,
          },
        }).then((res) => {
          console.log("NEW TEST MSG ", res);
          //setNewMessage(res.data.createMessage);
        });
      }
    }
    /*


    API[appID].Messaging.mutationCreateMessage({
      variables: {
        body: JSON.stringify(input),
        receiver: receiver.chatId,
        sender: sender.uuid,
        chatId: receiver.chatId,
      },

    if (chatName) {
      db.collection("chats").add({
        chatName: chatName,
      });
    }
    */
  };
  const addMsg2 = () => {
    const newMsg = prompt("Please enter msg");
    if (newMsg !== null && newMsg !== "") {
      const chats = document.querySelectorAll("div[data-chatId]");
      //const firstChat = chats[0].dataset["chatid"];
      const firstChat = "hamza-id";

      API[appID].Messaging.mutationCreateTestMessage({
        variables: {
          body: JSON.stringify(newMsg),
          sender: firstChat,
          receiver: currentUser.uuid,
          //chatId: currentUser.uuid,
          chatId: firstChat,
        },
      }).then((res) => {
        console.log("NEW TEST MSG2 ", res);
        //setNewMessage(res.data.createMessage);
      });
    }
  };

  return (
    <>
      {!hooksReady && <div>Loading...</div>}
      {hooksReady && (
        <AppContext.Provider
          value={{
            appID,
            API,
            sender: currentUser,
            receiver: chat.current,
            initChat,
            newMessage,
            newChatMessage,
          }}
        >
          <button onClick={addMsg}>New Message</button>
          <button onClick={addMsg2}>New Message2</button>
          <button
            onClick={async (e) => {
              console.log(
                "API ",
                await API[appID].Messaging.subscribeMessagingStatus({
                  variables: {
                    receiver: currentUser.uuid,
                  },
                })
              );
            }}
          >
            SUBS MSG STATUS
          </button>
          <AppContainer>
            <Sidebar />
            <Chat newChat={newChat} />
          </AppContainer>
        </AppContext.Provider>
      )}
    </>
  );

  {
    /* 
    <div>
      <div>
        <button
          onClick={async (e) => {
            console.log("API ", API);
          }}
        >
          API
        </button>
      </div>
      <div>
        <button
          onClick={async (e) => {
            console.log(
              "API ",
              await API[appID].Messaging.mutationCreateMessage({
                variables: { body: { test: "ok" }, receiver: "tero" },
              })
            );
          }}
        >
          CREATE MSG
        </button>
      </div>
      <div>
        <button
          onClick={async (e) => {
            console.log(
              "API ",
              await API[appID].Messaging.subscribeMessagingStatus({
                variables: { body: { test: "ok" }, receiver: "tero" },
              })
            );
          }}
        >
          SUBS MSG STATUS
        </button>
      </div>
      <div>
        <button
          onClick={async (e) => {
            console.log(
              "API ",
              await API[appID].Messaging.mutationCreateTestMessage({
                variables: { body: { test: "ok" }, sender: "tero" },
              })
            );
          }}
        >
          CREATE TESTMSG
        </button>
      </div>
      <div>
        <button
          onClick={async (e) => {
            console.log(
              "API ",
              await API[appID].Messaging.queryGetUnreadMessages({})
            );
          }}
        >
          GET UNREAD MSGS
        </button>
      </div>
      <div>
        <button
          onClick={async (e) => {
            console.log(
              "API ",
              await API[appID].Messaging.mutationUpdateMessageStatus({
                variables: { status: 1, messageId: "qwg765" },
              })
            );
          }}
        >
          UPDATE MSG STATUS
        </button>
      </div>
      
    </div>
    */
  }
};

IMessage.displayName = "IMessage";

export default IMessage;
