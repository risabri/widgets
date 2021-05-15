import React, { useEffect, useState } from "react";
import audio1 from "../alarm-sound.mp3";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  Image,
  Button,
  Stack,
  Select,
} from "@chakra-ui/react";
import { height } from "styled-system";

const buttonStyle = {
  background: " #6B0796",
  boxShadow: "inset 0px 3px 4px #7D1BC5",
  borderRadius: "20px",
  width: 100,
  height: 21,
};
const selectStyle = {
  background: "black",
};

function Clock() {
  const [AlarmHours, setHour] = useState();
  const [AlarmMin, setMins] = useState();
  const setAlarm = () => {
    var currentH = document.querySelector(".hours").value;
    setHour(currentH);
    var currentM = document.querySelector(".mins").value;
    setMins(currentM);
    console.log("alarm is now set");
    //console.log(currentH);
    //console.log(currentM);
    checkAlarm();
  };
  const stopAlarm = () => {
    document.querySelector(".audio1").pause();
    document.querySelector(".audio1").currentTime = 60;
  };
  const checkAlarm = () => {
    setInterval(function () {
      var time = new Date();
      var curr_h = time.getHours();
      var curr_m = time.getMinutes();
      console.log(curr_h + ":" + curr_m);
      console.log(AlarmHours + ":" + AlarmMin);
      if (AlarmHours == curr_h && AlarmMin == curr_m) {
        console.log("Its time up now get up");
        document.querySelector(".audio1").play();
      }
    }, 10000);
  };
  useEffect(() => {
    checkAlarm();
  });

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between" paddingBottom="10px">
        <Select
          height="70px"
          fontSize="20px"
          color="#4FFF6B"
          borderColor="transparent"
          className="hours"
        >
          <option>00</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
          <option>14</option>
          <option>15</option>
          <option>16</option>
          <option>17</option>
          <option>18</option>
          <option>19</option>
          <option>20</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
        </Select>
        <Select
          height="70px"
          fontSize="20px"
          color="#4FFF6B"
          borderColor="transparent"
          className="mins"
        >
          <option>00</option>
          <option>01</option>
          <option>02</option>
          <option>03</option>
          <option>04</option>
          <option>05</option>
          <option>06</option>
          <option>07</option>
          <option>08</option>
          <option>09</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>13</option>
          <option>14</option>
          <option>15</option>
          <option>16</option>
          <option>17</option>
          <option>18</option>
          <option>19</option>
          <option>20</option>
          <option>21</option>
          <option>22</option>
          <option>23</option>
          <option>24</option>
          <option>25</option>
          <option>26</option>
          <option>27</option>
          <option>28</option>
          <option>29</option>
          <option>30</option>
          <option>31</option>
          <option>32</option>
          <option>33</option>
          <option>34</option>
          <option>35</option>
          <option>36</option>
          <option>37</option>
          <option>38</option>
          <option>39</option>
          <option>40</option>
          <option>41</option>
          <option>42</option>
          <option>43</option>
          <option>44</option>
          <option>45</option>
          <option>46</option>
          <option>47</option>
          <option>48</option>
          <option>49</option>
          <option>50</option>
          <option>51</option>
          <option>52</option>
          <option>53</option>
          <option>54</option>
          <option>55</option>
          <option>56</option>
          <option>57</option>
          <option>58</option>
          <option>59</option>
        </Select>
      </Flex>

      <Stack spacing={2} alignItems="center" paddingBottom="5px">
        <Button onClick={setAlarm} style={buttonStyle} colorScheme="white">
          Set Alarm
        </Button>
        <Button onClick={stopAlarm} style={buttonStyle} colorScheme="white">
          Stop Alarm
        </Button>
      </Stack>

      <div className="playback">
        <audio className="audio1">
          <source src={audio1} type="audio/mp3" />
        </audio>
      </div>
    </Flex>
  );
}

export default Clock;
