/* global localStorage */

import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import SendMessage from "./SendMessage";
import MessageList from "./MessagesList";

import { usePrifina } from "@prifina/hooks";

const StyledWrapper = styled.div`
  /* */
  width: 400px;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
`;
const StyledClose = styled.div`
  /*
  position: absolute;
  right: 32px;
  top: 32px;
  */
  width: 32px;
  height: 32px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
  ::before,
  ::after {
    position: absolute;
    /* left: 15px; */
    top: 6px;
    content: " ";
    height: 33px;
    width: 2px;
    background-color: #333;
  }
  ::before {
    transform: rotate(45deg);
  }
  ::after {
    transform: rotate(-45deg);
  }
`;

const StyledBox = styled.div`
  /* */
  width: 400px;
  height: 600px;

  position: relative;
  top: 0px;
  /*
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  */
`;

const MessageBox = styled.div`
  /* */
  padding: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(600px - 79px);
`;
const AddressBook = styled.div`
  /* */
  width: 400px;
  height: 600px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const appID = "chatWidget";

export const Container = () => {
  // init hook and get provider api services...
  const {
    Prifina,
    registerHooks,
    onUpdate,
    currentUser,
    subscriptionTest,
    unSubscribe,
  } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  const [showContacts, setShowContacts] = useState(true);
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);

  //const [selectedContact, setSelectedContact] = useState(-1);
  const selectedContact = useRef(-1);
  const onUpdateRef = useRef();
  const messageCount = useRef({});
  const unreadMessageList = useRef({});

  const updateTest = (data) => {
    console.log("UPDATE TEST ", data, Object.keys(data), selectedContact);
    if (data.hasOwnProperty("data")) {
      // subscription update...
      console.log("UPDATE TEST PAYLOAD FOUND ", Object.keys(data.data));
      if (data.data.hasOwnProperty("addMessage")) {
        console.log(
          "UPDATE TEST ADD MESSAGE FOUND ",
          Object.keys(data.data.addMessage)
        );
        if (selectedContact.current === -1) {
          console.log("UPDATE TEST SENDER FOUND ", data.data.addMessage.sender);
          messageCount.current[data.data.addMessage.sender]++;

          setMessages((prev) => [...prev, data.data.addMessage]);
        } else {
          // can change status to 1===read
          const msg = data.data.addMessage;
          console.log("UPDATE MESSAGE STATUS ", msg);
          prifina.core.mutations
            .updateMessageStatus({
              createdAt: msg.created_at,
              sender: msg.sender,
              messageId: msg.messageId,
              status: 1,
            })
            .then(() => {
              setMessages((prev) => [...prev, msg]);
            });
        }
        console.log("MESSAGE COUNT ", messageCount.current);
      }
    } else {
      setMessages((prev) => [...prev, data]);
    }
  };

  useEffect(async () => {
    onUpdateRef.current = onUpdate(appID, updateTest);
    const addressBook = await prifina.core.queries.getAddressBook();
    console.log("ADDRESSBOOK ", addressBook);

    if (typeof addressBook.data.getUserAddressBook.addressBook === "string") {
      const contactList = JSON.parse(
        addressBook.data.getUserAddressBook.addressBook
      );
      contactList.forEach((c) => {
        messageCount.current[c.uuid] = 0;
      });

      await prifina.core.subscriptions.addMessage(onUpdateRef.current);
      const unreadMessages = await prifina.core.queries.getUnreadMessages();
      if (unreadMessages.data.listUnreadMessages.items.length > 0) {
        unreadMessages.data.listUnreadMessages.items.forEach((item) => {
          if (!unreadMessageList.current.hasOwnProperty(item.sender))
            unreadMessageList.current[item.sender] = [];
          unreadMessageList.current[item.sender].push(item);
          messageCount.current[item.sender]++;
        });
      }

      setContacts(contactList);
    } else {
      const contactList = addressBook.data.getUserAddressBook;
      contactList.forEach((c) => {
        messageCount.current[c.uuid] = 0;
      });
      setContacts(contactList);
    }

    //console.log(addressBook);
    //setContacts(contactList);
    //

    console.log(prifina);
  }, []);

  const contactClick = useCallback(
    (i) => {
      console.log("CLICK ", i, contacts, onUpdateRef);

      //setSelectedContact(i);
      selectedContact.current = i;
      let msgQueue = messages;
      if (
        unreadMessageList.current.hasOwnProperty(
          contacts[selectedContact.current].uuid
        )
      ) {
        msgQueue = messages.concat(
          unreadMessageList.current[contacts[selectedContact.current].uuid]
        );
      }

      // if messages>0 .... update status to 1===read
      if (msgQueue.length > 0) {
        //console.log("STATUS UPDATE ", msgQueue);

        const statuses = msgQueue.map((msg) => {
          return prifina.core.mutations.updateMessageStatus({
            createdAt: msg.created_at,
            sender: msg.sender,
            messageId: msg.messageId,
            status: 1,
          });
        });
        Promise.all(statuses)
          .then(() => {
            unreadMessageList.current[
              contacts[selectedContact.current].uuid
            ] = [];
            messageCount.current[contacts[selectedContact.current].uuid] = 0;
            setShowContacts(false);
          })
          .catch((err) => {
            console.log("STATUS UPDATE ERROR ", err);
          });
      } else {
        setShowContacts(false);
      }

      /*
      prifina.core.subscriptions
        .addMessage(onUpdateRef.current)
        .then((subRes) => {
          console.log("SUB RESULT ", subRes);
        });
        */
      /*
      subscriptionTest(appID, {
        addMessage: [
          {
            messageId: 1,
            body: "Hello",
            receiver: currentUser.uuid,
            sender: contacts[i].uuid,
          },
          {
            messageId: 3,
            body: "Something",
            receiver: currentUser.uuid,
            sender: contacts[i].uuid,
          },
          {
            messageId: 2,
            body: "Testing",
            receiver: currentUser.uuid,
            sender: contacts[i].uuid,
          },
        ],
      });
      */
    },
    [contacts]
  );

  const sendMessage = async (msg) => {
    console.log("MSG ", msg);
    console.log("CONTACT ", contacts[selectedContact.current].name);
    await prifina.core.mutations.createMessage({
      body: msg,
      sender: currentUser.uuid,
      receiver: contacts[selectedContact.current].uuid,
    });
    setMessages((prev) => [
      ...prev,
      {
        body: msg,
        sender: currentUser.uuid,
        receiver: contacts[selectedContact.current].uuid,
      },
    ]);

    //setMessages({ body: msg, handle: currentUser.name, username: username });
  };
  return (
    <>
      {showContacts && contacts.length > 0 && (
        <AddressBook>
          <h3 style={{ textAlign: "center" }}>Contacts</h3>
          <hr />
          <ul>
            {contacts.map((c, i) => {
              return (
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => contactClick(i)}
                  key={"contact-" + i}
                >
                  {c.name}{" "}
                  {Object.keys(messageCount.current).length > 0 &&
                    messageCount.current[c.uuid] > 0 && (
                      <span style={{ paddingLeft: "5px" }}>
                        (
                        <span style={{ color: "red" }}>
                          {messageCount.current[c.uuid]}
                        </span>
                        )
                      </span>
                    )}
                </li>
              );
            })}
          </ul>
        </AddressBook>
      )}
      {!showContacts && (
        <StyledBox>
          <StyledWrapper>
            <StyledClose
              onClick={() => {
                //setSelectedContact(-1);
                selectedContact.current = -1;
                setShowContacts(true);
                setMessages([]);
                //unSubscribe(appID, onUpdateRef, "addMessage");
                contacts.forEach((c) => {
                  messageCount.current[c.uuid] = 0;
                });
              }}
            />
          </StyledWrapper>
          <MessageBox>
            {messages.length > 0 && (
              <MessageList
                messages={messages}
                sender={currentUser.uuid}
                senderName={currentUser.name}
                receiverName={contacts[selectedContact.current].name}
              />
            )}
          </MessageBox>
          <SendMessage onCreate={sendMessage} />
        </StyledBox>
      )}
    </>
  );
};
