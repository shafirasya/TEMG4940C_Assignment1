import React, { FC, useState, useEffect } from "react";
import { Typography, TextField, Box, Dialog, Button } from "@mui/material";

interface ITodo {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface CardProps {
  id: string;
  index: number;
  title: string;
  description: string;
  status: string;
  open: boolean;
  fromSearch: boolean;
  todosSource: Array<{ todoStatus: string; items: ITodo[] }>;
  handleClickedCard: (
    id: string,
    category: string,
    status: string,
    changeValue: string
  ) => void;
}

const STORAGE_KEY = "todos";

const ToDoCard: FC<CardProps> = ({
  id,
  index,
  title,
  description,
  status,
  fromSearch,
  open,
  todosSource,
  handleClickedCard,
}) => {
  const [cardTitle, setCardTitle] = useState(title);
  const [cardDescription, setCardDescription] = useState(description);
  const [cardStatus, setCardStatus] = useState(status);
  const [openDialog, setOpenDialog] = useState(open);

  // Retrieving stored data for corresponding to-do and update the state whenever the corresponding data in array is changed
  useEffect(() => {
    //const storedTodo = localStorage.getItem(STORAGE_KEY) || "[]";
    //const parsedData = JSON.parse(storedTodo);
    const matchingTodoGroup = todosSource.find(
      (tg) => tg.todoStatus === status
    );
    if (matchingTodoGroup) {
      const matchingTodoItem = matchingTodoGroup.items.find((t) => t.id === id);
      if (matchingTodoItem) {
        setCardTitle(matchingTodoItem.title);
        setCardDescription(matchingTodoItem.description);
        setCardStatus(matchingTodoItem.status);
      }
    }
  }, [id, status, todosSource]);

  // Functions to handle the card being dragged (transfering information)
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    // Set the data being dragged (id & current status)
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id, status })
    );
    event.dataTransfer.dropEffect = "move";

    // Set a class on the card being dragged
    event.currentTarget.classList.add("dragging");

    // // Set the dragging index
    // draggingIndex.current = index;
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    // Remove the class from the card being dragged
    event.currentTarget.classList.remove("dragging");
  };

  // Functions to handle the display of card when the info is being edited straight on the card
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardTitle(event.target.value);
    handleClickedCard(id, "title", status, event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardDescription(event.target.value);
    handleClickedCard(id, "description", status, event.target.value);
  };

  // Functions to handle open and close dialog to modify content
  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSave = () => {
    setOpenDialog(false);
  };

  return (
    <div
      className="card"
      draggable
      onDragStart={(event) => handleDragStart(event, index)}
      onDragEnd={handleDragEnd}
      data-status={cardStatus}
    >
      {!fromSearch && (
        <Box
          sx={{
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            textAlign: "start",
            marginTop: 2,
            display: "flex",
            width: "100%",
            flexDirection: "column",
          }}
          component="button"
          onClick={handleEditClick}
        >
          {/* title of to do list card */}
          <Box
            sx={{
              fontWeight: "medium",
              fontSize: 20,
              color: "#463f3a",
              marginBottom: 1,
            }}
          >
            {cardTitle}
          </Box>

          {/* desc of to do list card */}
          <Box sx={{ color: "#463f3a" }}>{cardDescription}</Box>
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
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
              value={cardTitle}
              size="small"
              sx={{ marginLeft: 2, display: "flex", width: "100%" }}
              variant="standard"
              onChange={handleTitleChange}
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
              value={cardDescription}
              size="small"
              sx={{ marginLeft: 2, display: "flex", width: "100%" }}
              variant="standard"
              onChange={handleDescriptionChange}
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
              {cardStatus}
            </Typography>
          </Box>

          {/* <TextField label="Status" value={cardStatus} onChange={handleStatusChange} />
              <Button onClick={handleModalSave}>Save</Button> */}
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
            onClick={handleDialogSave}
          >
            Modify To Do List
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export { ToDoCard };
export type { CardProps };
