import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
const style = {
  backgroundColor: "black",
  width: "30px",
  height: "30px",
  cursor: "move",
  float: "left",
};
export const Submarine = ({ name }) => {
  //console.log(ItemTypes);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SHIP,
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log("DRAG dropped ", item);
        console.log("DRAG dropped result ", dropResult);
        //alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div
      ref={drag}
      role="ship"
      style={{ ...style, opacity }}
      data-testid={`ship-${name}`}
    />
  );
};
