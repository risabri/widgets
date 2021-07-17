/* global localStorage */

import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";

import { usePrifina } from "@prifina/hooks";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

import { Submarine } from "./Ship";
import { forwardRef } from "react";

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

  border-right: ${(props) => (props.colIndex === 10 ? "" : "1px solid")};
  border-top: ${(props) =>
    props.colIndex === 0 ? "" : props.rowIndex === 0 ? "" : "1px solid"};
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
`;

const StyledArea = styled.div`
  width: 300px;
  height: 330px;
  border: 1px solid;
  margin-top: 15px;
  margin-left: 50px;
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

const Square = forwardRef(({ children, onDrop, ...props }, ref) => {
  //const { onDrop } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.SHIP,
      drop(item, monitor) {
        //console.log("SQUARE ", item);
        if (onDrop) {
          onDrop(props, monitor);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [props]
  );
  const isActive = canDrop && isOver;
  //ref={mergeRefs(setReferenceElement, ref)}
  return (
    <StyledSquare ref={drop} role="Square" {...props}>
      {children}
    </StyledSquare>
  );
});

const appID = "gameWidget";

//export const Container = memo(function Container() {
export const Container = () => {
  /*
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
  */

  const maxY = 11;
  const maxX = 11;
  let grid = new Array(maxY);
  for (let y = 0; y < maxY; y++) grid[y] = new Array(maxX);
  grid[0] = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  for (let y = 1; y < maxY; y++)
    for (let x = 0; x < maxX; x++) grid[y][x] = x === 0 ? y - 1 : "";

  console.log(grid);
  const [board, setBoard] = useState(grid);
  const squareRef = useRef([]);

  const handleFileDrop = useCallback((item, monitor) => {
    console.log("ITEM ", item);
    //document.querySelectorAll("[data-col-index=5]");
    console.log(
      document.querySelectorAll("[data-row-index='" + item.rowIndex + "']")
    );
    /*
    let boardGrid = board;
    boardGrid[item.rowIndex][item.charIndex] = "X";
    console.log(boardGrid);
    setBoard(boardGrid);
    */
    if (monitor) {
      console.log("MONITOR ", monitor);
    }
  }, []);

  return (
    <>
      <StyledBox>
        <StyledWrapper>
          <StyledClose onClick={() => {}} />
        </StyledWrapper>
        <StyledArea>
          {board.map((col, row) => {
            console.log("RENDER ", row);
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
                      onDrop={handleFileDrop}
                      rowIndex={row}
                      colIndex={i}
                      key={"col-" + i}
                      data-col-index={i}
                      data-row-index={row}
                      ref={(ref) => {
                        console.log("SQUARE REF ", ref);
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

        <div style={{ overflow: "hidden", clear: "both" }}>
          <Submarine name="Sub" />
          {/* 
          <Ship name="Glass" />
          <Ship name="Banana" />
          <Ship name="Paper" />
          */}
        </div>
      </StyledBox>
    </>
  );
};
