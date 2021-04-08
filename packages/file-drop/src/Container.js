/* global localStorage */
import React, { useState, useCallback, useEffect } from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

import { usePrifina } from "@prifina/hooks";
import S3Upload from "@prifina/file-upload";
//import { FileList } from './FileList';

const style = {
  height: "200px",
  fontSize: "16px",
  width: "200px",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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

// unique appID for the widget....
const appID = "fileuploadWidget";

export const Container = () => {
  // init hook and get provider api services...
  const { Prifina, API, registerHooks } = usePrifina();

  // init provider api with your appID
  const prifina = new Prifina({ appId: appID });

  const [droppedFiles, setDroppedFiles] = useState([]);
  const [uploaded, setUploaded] = useState(0);

  useEffect(async () => {
    if (droppedFiles.length > 0) {
      setUploaded(0);
      await API[appID].S3FileUpload.S3UploadSimple({
        fileHandler: { files: droppedFiles },
        progress: (progress) => {
          //const currentProgress=100*(progress.loaded/progress.total);
          //progress({ loaded: secs, total: total });

          console.log(progress);
          const currentProgress = 100 * (progress.loaded / progress.total);
          setUploaded(currentProgress);
        },
      });
      setDroppedFiles([]);
    }
  }, [droppedFiles]);

  const handleFileDrop = useCallback((item, monitor) => {
    if (monitor) {
      const files = monitor.getItem().files;
      setDroppedFiles(files);
      //console.log("FILES ", files, typeof files, files.length);
      //console.log("ITEM ", item);
      /*
      // file is only a handler to the file... this will create base64 encoded file object
      const reader = new FileReader();
      reader.onload = (res) => {
        // log to console
        // logs data:<type>;base64,wL2dvYWwgbW9yZ...

        if (res.target.readyState === 2) {
          //console.log(res.target.result);
        }
      };
      reader.readAsDataURL(files[0]);
      */

      //setDroppedFiles(files);
    }
  }, []);

  useEffect(async () => {
    // init callback function for background updates/notifications
    //onUpdate(appID, dataUpdate);
    // register datasource modules
    registerHooks(appID, [S3Upload]);
  }, []);

  return (
    <>
      {droppedFiles.length === 0 && <TargetBox onDrop={handleFileDrop} />}
      {droppedFiles.length > 0 && (
        <div style={style}>Uploaded {Math.floor(uploaded)}%</div>
      )}
    </>
  );
};
