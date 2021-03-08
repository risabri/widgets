/* global localStorage */

import { useState, useCallback } from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";
//import { FileList } from './FileList';

const style = {
  border: "1px solid gray",
  height: "15rem",
  width: "15rem",
  padding: "2rem",
  textAlign: "center",
};
const TargetBox = (props) => {
  const { onDrop } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item, monitor) {
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
  return (
    <div ref={drop} style={style}>
      {isActive ? "Release to drop" : "Drag file here"}
    </div>
  );
};

export const Container = () => {
  let widgetImage = JSON.parse(localStorage.getItem("WidgetImage"));

  const [droppedFiles, setDroppedFiles] = widgetImage
    ? useState([widgetImage])
    : useState([]);
  const handleFileDrop = useCallback((item, monitor) => {
    if (monitor) {
      const files = monitor.getItem().files;
      console.log("FILES ", files);
      localStorage.setItem(
        "WidgetImage",
        JSON.stringify({ image: URL.createObjectURL(files[0]) })
      );
      setDroppedFiles(files);
    }
  }, []);

  console.log(widgetImage, droppedFiles);

  return (
    <>
      {droppedFiles.length === 0 && <TargetBox onDrop={handleFileDrop} />}
      {droppedFiles.length > 0 &&
        droppedFiles.map((file, index) => {
          console.log("FILE ", file, typeof file.image);
          let isImageFile = false;
          let image = "";
          if (typeof file.image !== "undefined") {
            image = file.image;
            isImageFile = true;
          } else {
            isImageFile = file.type.split("/")[0] === "image";
            image = URL.createObjectURL(file);
          }
          return (
            <div key={file.name}>
              <div>
                {isImageFile && (
                  <img
                    width={"400px"}
                    src={image}
                    alt={`file preview ${index}`}
                  />
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};
