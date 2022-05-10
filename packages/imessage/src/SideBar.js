import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";

import styled from "styled-components";
import { useAppContext } from "./IMessage";
import SidebarChat from "./SidebarChat";

const SideContainer = styled.div`
  /* */
  width: 40%;
`;
const Form = styled(Sidebar)`
  .sidebar {
    flex: 0.35;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    border-right: 1px solid lightgray;
  }

  .sidebar__header {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 50px;
  }

  .sidebar__avatar {
    cursor: pointer;
    margin: 10px;
  }

  .sidebar__input {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background-color: #e1e1e1;
    color: gray;
    border-radius: 5px;
  }

  .sidebar__input > input {
    border: none;
    background: transparent;
    outline-width: 0;
  }

  .sidebar__chats {
    overflow: scroll;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .sidebar__chats::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .sidebar__chats {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

function Sidebar({ className }) {
  // const user = useSelector(selectUser);
  const { appID, API } = useAppContext();
  //console.log(appID);
  const user = {};
  //const [chats, setChats] = useState([]);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      chatInfo: {},
      chats: [],
    }
  );

  /*
  const auth = {
    signOut: () => {
      return true;
    },
  };
  */
  useEffect(async () => {
    const userAddressBook = await API[appID].Messaging.queryUserAddressBook({});
    //console.log(userAddressBook);

    const unreadMsgs = await API[appID].Messaging.queryGetUnreadMessages({
      filter: {},
    });
    const chatInfo = {};
    unreadMsgs.data.getUnreadMsgs.forEach((m) => {
      //console.log("UNREAD MSG ", m);
      if (!chatInfo.hasOwnProperty(m.chatId)) {
        chatInfo[m.chatId] = {};
      }
      chatInfo[m.chatId] = {
        message: m.body,
        timestamp: m.createdAt,
      };
    });
    //console.log("CHAT INFO SIDEBAR ", chatInfo);
    const chats = userAddressBook.data.getAddressBook.map((u) => ({
      chatId: u.uuid,
      name: u.name,
    }));

    setState({ chatInfo: chatInfo, chats: chats });
  }, []);

  const addChat = () => {
    const chatName = prompt("Please enter a chat name");
    /*
    if (chatName) {
      db.collection("chats").add({
        chatName: chatName,
      });
    }
    */
  };

  return (
    <SideContainer>
      <div className={className}>
        <div className="sidebar">
          <div className="sidebar__header">
            <Avatar src={user.photo} className="sidebar__avatar" />
            <div className="sidebar__input">
              <SearchIcon />
              <input placeholder="Search" />
            </div>
            {/*    
          <IconButton variant="outlined" className="sidebar__inputButton">
            <RateReviewOutlinedIcon onClick={addChat} />
          </IconButton>
          */}
          </div>

          <div className="sidebar__chats">
            {state.chats.map(({ chatId, name }) => (
              <SidebarChat
                key={chatId}
                id={chatId}
                info={state.chatInfo[chatId]}
                chatName={name}
              />
            ))}
          </div>
        </div>
      </div>
    </SideContainer>
  );
}

export default Form;
