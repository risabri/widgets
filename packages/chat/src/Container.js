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
  const [selectedContact, setSelectedContact] = useState(-1);

  const onUpdateRef = useRef();
  const messageCount = useRef({});
  const updateTest = (data) => {
    console.log("UPDATE TEST ", data, Object.keys(data));
    if (data.hasOwnProperty("data")) {
      // subscription update...
      console.log("UPDATE TEST PAYLOAD FOUND ", Object.keys(data.data));
      if (data.data.hasOwnProperty("addMessage")) {
        console.log("UPDATE TEST ADD MESSAGE FOUND");
        if (selectedContact === -1) {
          messageCount.current[data.data.addMessage.sender]++;

          setMessages((prev) => [...prev, data.data.addMessage]);
        } else {
          setMessages((prev) => [...prev, data.data.addMessage]);
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
      setContacts(contactList);
      contactList.forEach((c) => {
        messageCount.current[c.uuid] = 0;
      });
    } else {
      const contactList = addressBook.data.getUserAddressBook;
      setContacts(contactList);
      contactList.forEach((c) => {
        messageCount.current[c.uuid] = 0;
      });
    }

    //console.log(addressBook);
    //setContacts(contactList);
    //
    await prifina.core.subscriptions.addMessage(onUpdateRef.current);

    console.log(prifina);
  }, []);

  const contactClick = useCallback(
    (i) => {
      console.log("CLICK ", i, contacts, onUpdateRef);
      setSelectedContact(i);

      setShowContacts(false);
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
    console.log("CONTACT ", contacts[selectedContact].name);
    await prifina.core.mutations.createMessage({
      body: msg,
      sender: currentUser.uuid,
      receiver: contacts[selectedContact].uuid,
    });
    setMessages((prev) => [
      ...prev,
      {
        body: msg,
        sender: currentUser.uuid,
        receiver: contacts[selectedContact].uuid,
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
                    messageCount.current[c.uuid] > 0 &&
                    messageCount.current[uuid]}
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
                setSelectedContact(-1);
                setShowContacts(true);
                setMessages([]);
                //unSubscribe(appID, onUpdateRef, "addMessage");
              }}
            />
          </StyledWrapper>
          <MessageBox>
            {messages.length > 0 && (
              <MessageList
                messages={messages}
                sender={currentUser.uuid}
                senderName={currentUser.name}
                receiverName={contacts[selectedContact].name}
              />
            )}
          </MessageBox>
          <SendMessage onCreate={sendMessage} />
        </StyledBox>
      )}
    </>
  );
};
