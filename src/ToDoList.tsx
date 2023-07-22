import React, { FC, useState, useEffect, useRef } from "react";
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Autocomplete,
  Stack,
  Dialog,
} from "@mui/material";
import { ToDoCard, CardProps } from "./ToDoCard";

interface ITodo {
  id: string;
  title: string;
  description: string;
  status: string;
}

const STORAGE_KEY = "todos";

const ToDoList: FC = () => {
  const [todos, setTodos] = useState<
    Array<{ todoStatus: string; items: ITodo[] }>
  >([
    {
      todoStatus: "To Do",
      items: [
        {
          id: "1",
          title: "Do Finance Task TEMG4940",
          description: "Finish writing task and quiz",
          status: "To Do",
        },
      ],
    },
    {
      todoStatus: "In Progress",
      items: [
        {
          id: "2",
          title: "Arrange Bali Trip",
          description: "Create excel for places, link, and expenses",
          status: "In Progress",
        },
      ],
    },
    {
      todoStatus: "Archived",
      items: [
        {
          id: "3",
          title: "Coffee Chat with Fel",
          description: "Confirm to Fel again by tomorrow",
          status: "Archived",
        },
      ],
    },
  ]);

  const [createToDo, setCreateToDo] = useState(false);

  const [openDialogTodo, setOpenDialogTodo] = useState(false);

  const [newToDoTitle, setNewToDoTitle] = useState("");

  const [newToDoDesc, setNewToDoDesc] = useState("");

  const [searchedToDo, setSearchedToDo] = useState<ITodo | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Retrieving stored data
  useEffect(() => {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    } else {
      setTodos(todos);
    }
  }, []);

  // Functions to handle when card is dropped and being hovered
  const onCardDrop = (
    event: React.DragEvent<HTMLDivElement>,
    newStatus: string
  ) => {
    // Prevent default to allow drop
    event.preventDefault();

    // Get the dragged card data when it is dropped
    const data = event.dataTransfer.getData("application/json");
    const { id: cardId, status: oldStatus } = JSON.parse(data);

    const draggedCard = todos
      .find((todo) => todo.todoStatus === oldStatus)
      ?.items.find((item) => item.id === cardId);

    // If the dragged card is being dropped in a different status area
    if (draggedCard) {
      // Remove the dragged card from its current position in the todos array
      const draggedCardStatusIndex = todos.findIndex(
        (todo) => todo.todoStatus === draggedCard.status
      );

      const draggedCardIndex = todos[draggedCardStatusIndex].items.findIndex(
        (item) => item.id === cardId
      );

      todos[draggedCardStatusIndex].items.splice(draggedCardIndex, 1);

      if (draggedCard.status !== newStatus) {
        const hoveredCardStatusIndex = todos.findIndex(
          (todo) => todo.todoStatus === newStatus
        );

        draggedCard.status = newStatus;

        // If the new status array is empty
        if (!todos[hoveredCardStatusIndex].items.length) {
          todos[hoveredCardStatusIndex].items.push(draggedCard);
        } else {
          // Find the index of the hovered card in the todos array with the new status
          if (hoveredId === "0") {
            todos[hoveredCardStatusIndex].items.unshift(draggedCard);
          } else {
            const hoveredCardIndex = todos[
              hoveredCardStatusIndex
            ].items.findIndex((item) => item.id === hoveredId);

            todos[hoveredCardStatusIndex].items.splice(
              hoveredCardIndex,
              0,
              draggedCard
            );
          }
        }
      } else {
        // If the dragged card is being dropped in the same status area

        // If array has only single element
        if (!todos[draggedCardStatusIndex].items.length) {
          todos[draggedCardStatusIndex].items.push(draggedCard);
        } else {
          // Find the index of the hovered card in the todos array
          if (hoveredId === "0") {
            todos[draggedCardStatusIndex].items.unshift(draggedCard);
          } else {
            const hoveredCardIndex = todos[
              draggedCardStatusIndex
            ].items.findIndex((item) => item.id === hoveredId);

            todos[draggedCardStatusIndex].items.splice(
              hoveredCardIndex,
              0,
              draggedCard
            );
          }
        }
      }
    }

    const updatedTodos = [...todos];
    setTodos(updatedTodos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
    setHoveredId(null);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    cardID: string
  ) => {
    // Prevent the browser's default handling of the data
    event.preventDefault();
    setHoveredId(cardID);

    // Set the drop effect to "move"
    event.dataTransfer.dropEffect = "move";
  };

  // Functions to handle when card's info is modified
  const handleNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewToDoTitle(event.target.value);
  };

  const handleNewDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewToDoDesc(event.target.value);
  };

  const handleTodoChange = (
    id: string,
    category: string,
    status: string,
    changeValue: string
  ) => {
    const updatedTodos = todos.map((todoGroup) => {
      if (todoGroup.todoStatus === status) {
        const updatedItems = todoGroup.items.map((todo) => {
          if (todo.id === id) {
            return { ...todo, [category]: changeValue };
          } else {
            return todo;
          }
        });

        return { ...todoGroup, items: updatedItems };
      } else {
        return todoGroup;
      }
    });

    setTodos(updatedTodos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  // Functions to handle when new to-do is added
  const addTodo = (titleInput: string, descInput: string) => {
    const newTodo: ITodo = {
      id: String(
        todos[0].items.length +
          todos[1].items.length +
          todos[2].items.length +
          1
      ),
      title: titleInput,
      description: descInput,
      status: "To Do",
    };

    const updatedTodos: Array<{ todoStatus: string; items: ITodo[] }> =
      todos.map((todoGroup) => {
        if (todoGroup.todoStatus === "To Do") {
          let updatedTodo = todos[0];
          updatedTodo.items.push(newTodo);
          return updatedTodo;
        } else {
          return todoGroup;
        }
      });

    setTodos(updatedTodos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTodos));
  };

  const handleSaveTodo = () => {
    addTodo(newToDoTitle, newToDoDesc);
    setCreateToDo(false);

    // clear out state of new title and desc
    setNewToDoTitle("");
    setNewToDoDesc("");
  };

  const handleCloseCreateToDo = () => {
    setCreateToDo(false);
  };

  //Functions to handle when a to-do is searched
  const handleSearchedTodo = () => {
    const userInput = (
      document.getElementById("search-bar") as HTMLInputElement
    ).value;

    const searchedItem = todos
      .flatMap((todoGroup) => todoGroup.items)
      .find((item) => {
        const itemString =
          item.title + (item.description ? ": " + item.description : "");
        const searchRegex = new RegExp(userInput, "i");
        return searchRegex.test(itemString);
      });

    if (searchedItem) {
      setSearchedToDo(searchedItem);
    }
  };

  return (
    <Stack style={{ flexGrow: 1, padding: 24, backgroundColor: "#f4f3ee" }}>
      {/* Title/header */}
      <Box textAlign="center">
        <Typography variant="h3" sx={{ color: "#463f3a" }}>
          To Do List
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: "#8a817c" }}>
          Arrange your day easily
        </Typography>
      </Box>

      {/* Search Bar to find corresponding To Do List */}
      <Box>
        <Autocomplete
          id="search-bar"
          clearText="'Clear'"
          options={todos.flatMap((todoGroup) => todoGroup.items)}
          getOptionLabel={(todo) =>
            todo.title + (todo.description ? ": " + todo.description : "")
          }
          renderInput={(userInput) => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                {...userInput}
                name="searchInput"
                InputProps={{ ...userInput.InputProps, type: "search" }}
                placeholder="Search your To Do List"
                sx={{ borderRadius: 24, marginY: 2 }}
                size="small"
              />
              <Button
                variant="contained"
                size="small"
                color="inherit"
                sx={{
                  marginY: 4,
                  marginX: 2,
                  paddingY: 1,
                  paddingX: 4,
                  borderRadius: 36,
                  fontWeight: "700",
                }}
                onClick={() => {
                  setOpenDialogTodo(true);
                  handleSearchedTodo();
                }}
              >
                Search
              </Button>
            </Box>
          )}
        />
      </Box>

      {/* To Do List section, divided into 3 columns */}
      <Grid container spacing={3}>
        {/* To Do Column */}
        <Grid item xs={12} sm={4}>
          <div
            className="column_ToDoList"
            onDrop={(event) => onCardDrop(event, "To Do")}
            onDragOver={(event) => handleDragOver(event, "0")}
          >
            <Paper style={{ padding: 12, textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "medium", color: "#463f3a" }}
              >
                To Do
              </Typography>
              {todos.map((todoGroup) => {
                if (todoGroup.todoStatus === "To Do") {
                  return todoGroup.items.map((todo, index) => (
                    <div
                      ref={cardRef}
                      id={todo.id}
                      onDragOver={(event) => handleDragOver(event, todo.id)}
                    >
                      <ToDoCard
                        key={todo.id}
                        id={todo.id}
                        index={index}
                        title={todo.title}
                        description={todo.description}
                        status="To Do"
                        open={openDialogTodo}
                        todosSource={todos}
                        fromSearch={false}
                        handleClickedCard={handleTodoChange}
                        // handleClickedCard={() => {
                        //   setOpenFullTodo(true);
                        //   handleCardClick(todo, "In Progress", index);
                        // }}
                      />
                    </div>
                  ));
                }
              })}
            </Paper>
          </div>
        </Grid>

        {/* In Progress Column */}
        <Grid item xs={12} sm={4}>
          <div
            className="column_InProgress"
            onDrop={(event) => onCardDrop(event, "In Progress")}
            onDragOver={(event) => handleDragOver(event, "0")}
          >
            <Paper style={{ padding: 12, textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "medium", color: "#463f3a" }}
              >
                In Progress
              </Typography>
              {todos.map((todoGroup) => {
                if (todoGroup.todoStatus === "In Progress") {
                  return todoGroup.items.map((todo, index) => (
                    <div
                      ref={cardRef}
                      id={todo.id}
                      onDragOver={(event) => handleDragOver(event, todo.id)}
                    >
                      <ToDoCard
                        key={todo.id}
                        id={todo.id}
                        index={index}
                        title={todo.title}
                        description={todo.description}
                        status="In Progress"
                        open={openDialogTodo}
                        todosSource={todos}
                        fromSearch={false}
                        handleClickedCard={handleTodoChange}
                        // handleClickedCard={() => {
                        //   setOpenFullTodo(true);
                        //   handleCardClick(todo, "In Progress", index);
                        // }}
                      />
                    </div>
                  ));
                }
              })}
            </Paper>
          </div>
        </Grid>

        {/* Archived Column */}
        <Grid item xs={12} sm={4}>
          <div
            className="column_Archived"
            onDrop={(event) => onCardDrop(event, "Archived")}
            onDragOver={(event) => handleDragOver(event, "0")}
          >
            <Paper style={{ padding: 12, textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "medium", color: "#463f3a" }}
              >
                Archived
              </Typography>
              {todos.map((todoGroup) => {
                if (todoGroup.todoStatus === "Archived") {
                  return todoGroup.items.map((todo, index) => (
                    <div
                      ref={cardRef}
                      id={todo.id}
                      onDragOver={(event) => handleDragOver(event, todo.id)}
                    >
                      <ToDoCard
                        key={todo.id}
                        id={todo.id}
                        index={index}
                        title={todo.title}
                        description={todo.description}
                        status="Archived"
                        open={openDialogTodo}
                        todosSource={todos}
                        fromSearch={false}
                        handleClickedCard={handleTodoChange}
                        // handleClickedCard={() => {
                        //   setOpenFullTodo(true);
                        //   handleCardClick(todo, "In Progress", index);
                        // }}
                      />
                    </div>
                  ));
                }
              })}
            </Paper>
          </div>
        </Grid>
      </Grid>

      {/* Button to add new to do list */}
      <Box sx={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          size="medium"
          color="inherit"
          sx={{
            marginY: 4,
            paddingY: 1,
            paddingX: 4,
            borderRadius: 36,
            fontWeight: "700",
          }}
          onClick={() => setCreateToDo(true)}
        >
          Add To Do
        </Button>
      </Box>

      {/* Modal to handle adding new todo  */}
      <Dialog open={createToDo} onClose={handleCloseCreateToDo} fullWidth>
        <Box
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontWeight: "medium",
              fontSize: 20,
              color: "#463f3a",
              marginBottom: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography>Title:</Typography>
            <TextField
              required
              value={newToDoTitle}
              size="small"
              sx={{ marginLeft: 2, display: "flex", width: "100%" }}
              variant="standard"
              onChange={handleNewTitle}
              placeholder="Write down the title"
            />
          </Box>

          <Box
            sx={{
              fontWeight: "medium",
              fontSize: 20,
              color: "#463f3a",
              marginBottom: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography>Description:</Typography>
            <TextField
              value={newToDoDesc}
              size="small"
              sx={{ marginLeft: 2, display: "flex", width: "100%" }}
              variant="standard"
              onChange={handleNewDesc}
              placeholder="Write down the description"
            />
          </Box>

          <Box
            sx={{
              fontWeight: "medium",
              fontSize: 20,
              color: "#463f3a",
              marginBottom: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography>Status:</Typography>
            <Typography sx={{ marginLeft: 2, display: "flex", width: "100%" }}>
              To Do
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            color="inherit"
            sx={{
              marginTop: 2,
              paddingY: 1,
              paddingX: 4,
              borderRadius: 36,
              fontWeight: "700",
            }}
            onClick={handleSaveTodo}
          >
            Save To Do List
          </Button>
        </Box>
      </Dialog>

      {/* Handle searched to-do-list */}
      {openDialogTodo && searchedToDo && (
        <ToDoCard
          key={searchedToDo.id}
          id={searchedToDo.id}
          index={todos[
            todos.findIndex((todo) => todo.todoStatus === searchedToDo.status)
          ].items.findIndex((item) => item.id === searchedToDo.id)}
          title={searchedToDo.title}
          description={searchedToDo.description}
          status={searchedToDo.status}
          open={true}
          todosSource={todos}
          fromSearch={true}
          handleClickedCard={handleTodoChange}
        />
      )}
    </Stack>
  );
};

export default ToDoList;
