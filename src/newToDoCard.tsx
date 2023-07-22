import React, { FC, useState, useEffect } from "react";
import { Typography, TextField, Box, Dialog, Button } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";

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
  handleClickedCard: () => void;
}

const ToDoCard: FC<CardProps> = ({
  id,
  index,
  title,
  description,
  status,
  handleClickedCard,
}) => {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
            onClick={handleClickedCard}
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
              {title}
            </Box>

            {/* desc of to do list card */}
            <Box sx={{ color: "#463f3a" }}>{description}</Box>
          </Box>
        </div>
      )}
    </Draggable>
  );
};

export { ToDoCard };
export type { CardProps };
