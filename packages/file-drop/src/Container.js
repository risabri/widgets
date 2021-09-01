/* global localStorage */
import React, { useState, useCallback, useEffect } from "react";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

import { usePrifina } from "@prifina/hooks";
import S3Upload from "@prifina/file-upload";
//import { FileList } from './FileList';

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  IconButton,
  ButtonGroup,
  CircularProgress,
  Input,
  Stack,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CircularProgressLabel,
} from "@chakra-ui/react";

import { Progress as Progress2 } from "@chakra-ui/react";

import folder from "./assets/folder.svg";

const container = {
  height: "296px",
  fontSize: "16px",
  width: "308px",
  background: "rgba(151, 212, 231, 0.15",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "45px",
  paddingBottom: "35px",
  borderRadius: 10,
  // border: "1px solid red",
  boxShadow: "0px 12px 24px rgba(182, 204, 214, 0.2)",
};
const uploadContainer = {
  height: "296px",
  fontSize: "16px",
  width: "308px",
  background: "linear-gradient(180deg, #F0FDFC 0%, #E8F5FE 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  boxShadow: "0px 12px 24px rgba(182, 204, 214, 0.2)",
};

const innerContainer = {
  height: "150px",
  fontSize: "16px",
  width: "220px",
  background: "rgba(151, 212, 231, 0.25)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  // border: "1px solid #D3F2F0",
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
    <Flex style={container}>
      <Text fontSize={20} fontWeight="600">
        Upload your files
      </Text>
      <Text color="gray" fontSize={10}>
        You can upload one file at a time
      </Text>
      <Flex ref={drop} style={innerContainer}>
        <Image src={folder} />
        <Text color="gray" fontSize={10}>
          {isActive ? "Release to drop" : "Drag and drop your files here"}
        </Text>
      </Flex>
    </Flex>
  );
};

// unique appID for the widget....
const appID = "dataUploadWidget";

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
    <ChakraProvider>
      {droppedFiles.length === 0 && <TargetBox onDrop={handleFileDrop} />}
      {droppedFiles.length > 0 && (
        <Flex style={uploadContainer}>
          <Text fontWeight="600" fontSize={20} paddingBottom="15px">
            Your file is being uploaded
          </Text>
          <CircularProgress
            value={uploaded}
            size="120px"
            color="teal"
            capIsRound
          >
            <CircularProgressLabel color="gray">
              {Math.floor(uploaded)}%
            </CircularProgressLabel>
          </CircularProgress>
        </Flex>
      )}
    </ChakraProvider>
  );
};
