/* global localStorage */

import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import styled from "styled-components";

import { usePrifina } from "@prifina/hooks";

//import cannon from "./Cannon-SoundBible.com-1661203605.mp3";

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
  border: 1px solid;
  /*
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  */
`;

const propsTest = (props) => {
  console.log("PROPS ", props);
  return null;
};
const StyledSquare = styled.div`
  /* ${propsTest}; */
  background-color: ${(props) =>
    props.status === 0 ? "white" : props.status === 1 ? "red" : "black"};
  border-right: ${(props) => (props.colIndex === 10 ? "" : "1px solid black")};
  border-top: ${(props) =>
    props.colIndex === 0 ? "" : props.rowIndex === 0 ? "" : "1px solid black"};
    border-bottom: ${(props) =>
      props.rowIndex === 10 ? "1px solid black" : null};  
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
`;

const StyledArea = styled.div`
  /* ${propsTest} */
  width: 300px;
  height: 330px;
  border: 1px solid;
  margin-top: 15px;
  margin-left: 50px;
  
`;

const WaitingList = styled.div`
  /* */
  width: 400px;
  height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const style = {
  width: "300px",
  height: "330px",
  border: "1px solid",
  marginTop: "15px",
  marginLeft: "50px",
};

/*
const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};
*/

const Square = forwardRef(({ children, game = false, ...props }, ref) => {
  let status = 0;
  if (children === "X") {
    status = 1;
  } else if (children === "O") {
    status = 2;
  }
  return (
    <StyledSquare ref={ref} status={game ? 0 : status} {...props}>
      {children}
    </StyledSquare>
  );
});

const appID = "gameWidget";

//export const Container = memo(function Container() {
export const Container = () => {
  // init hook and get provider api services...
  const {
    Prifina,
    registerRemoteClient,
    onUpdate,
    currentUser,
    subscriptionTest,
    unSubscribe,
  } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  console.log("PRIFINA ", prifina);
  const maxY = 11;
  const maxX = 11;
  let grid = new Array(maxY);
  for (let y = 0; y < maxY; y++) grid[y] = new Array(maxX);
  grid[0] = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  for (let y = 1; y < maxY; y++)
    for (let x = 0; x < maxX; x++) grid[y][x] = x === 0 ? y - 1 : "";

  console.log(grid);
  //const [board, setBoard] = useState(grid);
  const board = useRef(grid);
  const game = useRef([]);
  const squareRef = useRef([]);
  const [play, setPlay] = useState(-1);
  const [waitingStatus, setWaitingStatus] = useState(0);
  const timer = useRef();
  const waitingList = useRef([]);
  const selectedPlayerIndex = useRef(-1);

  const onUpdateRef = useRef();
  const total = useRef(0);
  const [hits, setHits] = useState(0);
  const hitsTotal = useRef(0);
  const playerStatus = useRef("host");
  const gameKey = "battleShip";
  const receiver = useRef("");
  const gameStarted = useRef(false);
  const [gameStatus, setGameStatus] = useState(["Init"]);

  /*
  const handleFileDrop = useCallback((item, monitor) => {
    console.log("ITEM ", item);
    //document.querySelectorAll("[data-col-index=5]");
    console.log(
      document.querySelectorAll("[data-row-index='" + item.rowIndex + "']")
    );
   
    if (monitor) {
      console.log("MONITOR ", monitor);
    }
  }, []);
*/

  const updateTest = async (data) => {
    console.log("UPDATE TEST ", data, Object.keys(data));
    if (data.hasOwnProperty("data")) {
      if (data.data.hasOwnProperty("Waiting")) {
        // update waiting list...
      }
      if (data.data.hasOwnProperty("Messaging")) {
        const msg = data.data.Messaging;
        const body = JSON.parse(msg.body);
        console.log("BODY ", body);
        if (body.hasOwnProperty("result")) {
          //e.target.style.backgroundColor = "red";
          //document.querySelectorAll("[data-row-index='" + item.rowIndex + "']")
          const r = document.querySelector(
            "[data-row-index='" +
              body.rowIndex +
              "'][data-col-index='" +
              body.colIndex +
              "']"
          );
          if (body.result === 1) {
            hitsTotal.current++;
            setHits(hitsTotal.current);
            game.current[body.rowIndex][body.colIndex] = "O";
            setGameStatus((arr) => ["Hit...", ...arr]);
            r.style.backgroundColor = "red";
          } else {
            game.current[body.rowIndex][body.colIndex] = "X";
            r.style.backgroundColor = "gray";
            setGameStatus((arr) => ["Miss...", ...arr]);
          }
        } else if (body.hasOwnProperty("connect")) {
          registerRemoteClient(body.endpoint, body.region);
          receiver.current = msg.sender;
          // body.name... player
          if (gameStarted.current) {
            await prifina.core.mutations.createMessaging({
              receiver: receiver.current,
              key: gameKey,
              body: JSON.stringify({
                play: true,
              }),
            });
          }
          // update player status....
          setGameStatus((arr) => ["Player joined...", ...arr]);
        } else if (body.hasOwnProperty("play")) {
          gameStarted.current = true;
          setGameStatus((arr) => ["Player ready...", ...arr]);
        } else if (body.hasOwnProperty("start")) {
          gameStarted.current = true;
          setGameStatus((arr) => ["Game started...", ...arr]);
        } else {
          let result = "";
          const rr = document.querySelector(
            "[data-row-index='" +
              body.rowIndex +
              "'][data-col-index='" +
              body.colIndex +
              "']"
          );
          if (board.current[body.rowIndex][body.colIndex] === "O") {
            console.log("NOTIFY RESULT HIT");
            result = JSON.stringify({ result: 1, ...body });
            rr.style.backgroundColor = "red";
          } else {
            console.log("NOTIFY RESULT MISS");
            result = JSON.stringify({ result: 0, ...body });
            rr.style.backgroundColor = "gray";
          }

          //await prifina.core.mutations.createRemoteMessaging({
          await prifina.core.mutations.createMessaging({
            id: msg.id,
            receiver: msg.sender,
            key: msg.key,
            body: result,
          });
        }
      }
    } else {
      waitingList.current.push(data);
      setWaitingStatus(waitingList.current.length);
    }
  };

  useEffect(async () => {
    onUpdateRef.current = onUpdate(appID, updateTest);
    const waitingListData = await prifina.core.queries.getWaitingList();
    console.log("Waiting ", waitingListData);
    waitingList.current = waitingListData.data.listWaiting.items;
    /*
    subscriptionTest(appID, {
      Waiting: [
        {
          createdAt: new Date().getTime(),
          endpoint: "https://endpoint.xxx",
          name: "Unknown1",
        },
        {
          createdAt: new Date().getTime(),
          endpoint: "https://endpoint.xxx",
          name: "Unknown2",
        },
        {
          createdAt: new Date().getTime(),
          endpoint: "https://endpoint.xxx",
          name: "Unknown3",
        },
      ],
    });
    */
    //unSubscribe(appID, onUpdateRef, "addMessage");
    setWaitingStatus(waitingList.current.length);
    setPlay(0);
  }, []);
  const playClick = () => {
    /*
    timer.current = setInterval(() => {
      const yInt = Math.floor(Math.random() * Math.floor(10));
      const xInt = Math.floor(Math.random() * Math.floor(10));
      console.log("Y", yInt);
      console.log("X", xInt);
      // 0123456789

      let pos = (yInt + 1) * 11 + (xInt + 1);
      console.log("POS ", pos);

      //squareRef.current[pos].style.backgroundColor = "red";
      //console.log(squareRef.current[pos].dataset);
      const rowIndex = parseInt(squareRef.current[pos].dataset.rowIndex);
      const colIndex = parseInt(squareRef.current[pos].dataset.colIndex);
      if (board.current[rowIndex][colIndex] === "O") {
        board.current[rowIndex][colIndex] = "X";
        squareRef.current[pos].style.backgroundColor = "red";
      } else {
        board.current[rowIndex][colIndex] = "Z";
        squareRef.current[pos].innerText = "X";
      }
    }, 5000);
    */
    /*
    let submarines = [];
    let destroyer = [];
    let cruiser = [];
    let battleship = [];
    let carrier = [];
*/
    game.current = grid;
    // only when playerStatus is player...
    /*
    prifina.core.subscriptions
      .addMessaging(onUpdateRef.current, { key: "battleship" })
      .then((res) => {
        console.log("PLAY SUB ", res);
        setPlay(2);
      });
      */

    if (receiver.current !== "") {
      if (!gameStarted.current && receiver.current !== "") {
        //await prifina.core.mutations.createRemoteMessaging({
        prifina.core.mutations
          .createMessaging({
            receiver: receiver.current,
            key: gameKey,
            body: JSON.stringify({
              play: true,
            }),
          })
          .then(() => {
            gameStarted.current = true;
            //remove from waiting list...
            setPlay(2);
          });
      } else {
        //console.log("UPDATE STATUS ????");
        gameStarted.current = true;
        prifina.core.mutations
          .createMessaging({
            receiver: receiver.current,
            key: gameKey,
            body: JSON.stringify({
              start: true,
            }),
          })
          .then(() => {
            setPlay(2);
          });
      }
    } else {
      // update player status....
      setGameStatus((arr) => ["Waiting for player...", ...arr]);
    }
  };

  const handleClick = useCallback((e) => {
    console.log("CLICK ", e);
    console.log("CLICK ", e.target.dataset);
    e.target.style.backgroundColor = "black";
    const rowIndex = parseInt(e.target.dataset.rowIndex);
    const colIndex = parseInt(e.target.dataset.colIndex);
    /*
    let boardGrid = board;
    boardGrid[rowIndex][colIndex] = "X";
    console.log(boardGrid);
    setBoard(boardGrid);
    */
    board.current[rowIndex][colIndex] = "O";
    total.current++;
    //document.getElementById("cannon").play();
    //console.log("REFS ", squareRef.current);
  }, []);
  const handleGameClick = useCallback(async (e) => {
    //console.log("CLICK ", e.target.dataset);
    //e.target.style.backgroundColor = "black";
    const rowIndex = parseInt(e.target.dataset.rowIndex);
    const colIndex = parseInt(e.target.dataset.colIndex);
    //const receiver = waitingList.current[waitingIndex].senderKey.split("#")[0];

    //await prifina.core.mutations.createRemoteMessaging({
    await prifina.core.mutations.createMessaging({
      key: gameKey,
      body: JSON.stringify({ rowIndex: rowIndex, colIndex: colIndex }),
      receiver: receiver.current,
    });

    /*
    if (board.current[rowIndex][colIndex] == "O") {
      e.target.style.backgroundColor = "red";
      hitsTotal.current++;
      setHits(hitsTotal.current);
    } else {
      e.target.style.backgroundColor = "gray";
    }
    */
  }, []);
  const handleWaitingClick = useCallback(async (e) => {
    console.log("CLICK ", e.target.dataset);
    const waitingIndex = parseInt(e.target.dataset.waitingIndex);
    console.log("CLIENT ", waitingList.current[waitingIndex]);
    selectedPlayerIndex.current = waitingIndex;
    registerRemoteClient(
      waitingList.current[waitingIndex].endpoint,
      waitingList.current[waitingIndex].region
    );

    playerStatus.current = "player";
    const host = waitingList.current[waitingIndex].senderKey.split("#");
    receiver.current = host[0];
    //await prifina.core.mutations.createRemoteMessaging({
    await prifina.core.mutations.createMessaging({
      receiver: receiver.current,
      key: host[1],
      body: JSON.stringify({
        connect: true,
        endpoint: currentUser.endpoint,
        region: currentUser.region,
        name: "Unknown",
      }),
    });
    await prifina.core.subscriptions.addMessaging(onUpdateRef.current, {
      key: gameKey,
    });
    setPlay(1);
  }, []);

  console.log("NEW RENDER ");
  return (
    <>
      {waitingStatus === 0 && (
        <WaitingList>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            No games available...
          </div>

          <div
            style={{
              height: "100px",
              width: "400px",
              textAlign: "center",
              borderTop: "1px solid",
            }}
          >
            Name: <input id={"player"} name={"player"} />
            <button
              style={{ marginTop: "10px", marginLeft: "10px" }}
              onClick={() => {
                const player = document.getElementById("player").value;
                //await prifina.core.mutations.addWaiting({endpoint: "", name: "", senderKey: ""});

                prifina.core.mutations
                  .addWaiting({
                    name: player,
                    key: gameKey,
                    endpoint: currentUser.endpoint,
                    region: currentUser.region,
                  })
                  .then((res) => {
                    console.log("ADD NEW PLAYER...", res);
                    waitingList.current.push(res.data.waiting);
                    setWaitingStatus(waitingList.current.length);
                    prifina.core.subscriptions
                      .addMessaging(onUpdateRef.current, { key: gameKey })
                      .then((res) => {
                        console.log("ADD MESSAGING SUB...", res);
                        setPlay(1);
                      });
                  });
              }}
            >
              New Game
            </button>
          </div>
        </WaitingList>
      )}
      {play === 0 && waitingStatus > 0 && (
        <>
          <WaitingList>
            <ul>
              {waitingList.current.map((w, i) => {
                console.log("WAITING ....", w.name);
                return (
                  <li
                    style={{ cursor: "pointer" }}
                    key={"waiting-" + i}
                    data-waiting-index={i}
                    onClick={handleWaitingClick}
                  >
                    {w.name}
                    <span style={{ fontSize: "0.75rem", color: "gray" }}>
                      {" "}
                      - {new Date(w.createdAt).toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </WaitingList>
          <div
            style={{
              height: "100px",
              width: "400px",
              textAlign: "center",
              borderTop: "1px solid",
            }}
          >
            Name: <input id={"player"} name={"player"} />
            <button
              style={{ marginTop: "10px", marginLeft: "10px" }}
              onClick={() => {
                const player = document.getElementById("player").value;
                //await prifina.core.mutations.addWaiting({endpoint: "", name: "", senderKey: ""});
                prifina.core.mutations
                  .addWaiting({
                    name: player,
                    key: gameKey,
                    endpoint: currentUser.endpoint,
                    region: currentUser.region,
                  })
                  .then((res) => {
                    console.log("ADD NEW PLAYER... 2", res);
                    waitingList.current.push(res.data.waiting);
                    setWaitingStatus(waitingList.current.length);
                    prifina.core.subscriptions
                      .addMessaging(onUpdateRef.current, { key: gameKey })
                      .then((res) => {
                        console.log("ADD MESSAGING SUB... 2", res);
                        setPlay(1);
                      });
                  });
              }}
            >
              New Game
            </button>
          </div>
        </>
      )}
      {play === 1 && (
        <StyledBox>
          <StyledWrapper>
            <StyledClose onClick={() => {}} />
          </StyledWrapper>
          <StyledArea>
            {board.current.map((col, row) => {
              //console.log("RENDER ", row);
              return (
                <div
                  key={"grid-row-" + row}
                  style={{
                    width: "100%",
                    display: "flex",
                  }}
                >
                  {col.map((c, i) => {
                    return (
                      <Square
                        onClick={handleClick}
                        key={"col-" + i}
                        rowIndex={row}
                        colIndex={i}
                        data-col-index={i}
                        data-row-index={row}
                        ref={(ref) => {
                          //console.log("SQUARE REF ", ref);
                          if (ref !== null) squareRef.current.push(ref);
                        }}
                      >
                        {c}
                      </Square>
                    );
                  })}
                </div>
              );
            })}
          </StyledArea>

          <button style={{ marginTop: "20px" }} onClick={playClick}>
            Ready
          </button>
          <div
            style={{
              overflow: "auto",
              clear: "both",
              marginTop: "20px",
              height: "150px",
            }}
          >
            <ul>
              {gameStatus.map((m, i) => {
                return <li key={"msg-" + i}>{m}</li>;
              })}
            </ul>
          </div>
        </StyledBox>
      )}
      {play === 2 && (
        <StyledBox>
          <StyledArea>
            {game.current.map((col, row) => {
              //console.log("RENDER GAME ", row, col);
              return (
                <div
                  key={"game-grid-row-" + row}
                  style={{
                    width: "100%",
                    display: "flex",
                  }}
                >
                  {col.map((c, i) => {
                    return (
                      <Square
                        onClick={handleGameClick}
                        key={"game-col-" + i}
                        rowIndex={row}
                        colIndex={i}
                        data-col-index={i}
                        data-row-index={row}
                        game={true}
                      >
                        {c}
                      </Square>
                    );
                  })}
                </div>
              );
            })}
          </StyledArea>

          <div style={{ overflow: "hidden", clear: "both" }}>
            <div>Hits:{hits}</div>
            <div>Total:{total.current}</div>
          </div>

          <div
            style={{
              overflow: "auto",
              clear: "both",
              marginTop: "20px",
              height: "110px",
            }}
          >
            <ul>
              {gameStatus.map((m, i) => {
                return <li key={"msg-" + i}>{m}</li>;
              })}
            </ul>
          </div>
        </StyledBox>
      )}
      {/* 
      <audio id="cannon">
        <source src={cannon} type="audio/mpeg" />
      </audio>
      */}
    </>
  );
};
