import React, { FC } from "react";
import { CssBaseline, Stack } from "@mui/material";
import logo from "./logo.svg";
import "./App.css";
import ToDoList from "./ToDoList";
import { DragDropContext } from "react-beautiful-dnd";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Hola hola Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const App: FC = () => {
  return (
    <Stack style={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
      <CssBaseline />
      <ToDoList />
    </Stack>
  );
};

export default App;
