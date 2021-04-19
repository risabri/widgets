import React, { useState } from "react";

import styled from "styled-components";
import { usePrifina } from "@prifina/hooks";

import {
  Flex,
  ChakraProvider,
  Text,
  Box,
  Image,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";

function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <Box
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.text}
      <Flex>
        <Button
          onClick={() => completeTodo(index)}
          color="white"
          background="#4B0082"
          border="none"
          borderRadius="5px"
          marginRight="5px"
        >
          Complete
        </Button>
        <Button
          onClick={() => removeTodo(index)}
          color="white"
          background="red"
          border="none"
          borderRadius="5px"
        >
          x
        </Button>
      </Flex>
    </Box>
  );
}

const styles = {
  // background: "#F1EBB5",
  borderRadius: "10px",
  background: "linear-gradient(169.38deg, #FFED8D 5.05%, #F1EBB5 90.75%)",
};

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Box flexDirection="column">
      <FormControl>
        <Input
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          marginRight="5px"
          width="150px"
        />
        <Button
          height="22px"
          width="20px"
          onClick={handleSubmit}
          color="white"
          background="#4B0082"
          border="none"
          borderRadius="5px"
        >
          +
        </Button>
      </FormControl>
    </Box>
  );
}

function App() {
  const [todos, setTodos] = useState([
    {
      text: "Set task 1",
      isCompleted: false,
    },
    {
      text: "Set task 2",
      isCompleted: false,
    },
  ]);

  const addTodo = (text) => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <Box
      style={styles}
      width="200px"
      paddingLeft="10px"
      paddingBottom="10px"
      paddingTop="10px"
    >
      <Text color="#4B0082" as="b" fontSize="20px">
        To Do List
      </Text>
      <Box
        // height="auto"
        flexDirection="row"
        alignSelf="center"
        paddingTop="5px"
        paddingBottom="5px"
      >
        <TodoForm addTodo={addTodo} />

        {todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
      </Box>
    </Box>
  );
}

export default App;
