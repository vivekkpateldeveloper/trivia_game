import React, { useState } from "react";
import Questions from "../Questions";
import { Typography } from "@mui/material";

const StartQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };
  return (
    <div className="main-container">
      {quizStarted ? (
        <Questions />
      ) : (
        <>
          <Typography variant="h4" style={{ marginBottom: "20px" }}>
            Welcome to the Quiz!
          </Typography>
          <Typography variant="h5">
            10 questions to test your knowledge{" "}
          </Typography>
          <Typography variant="h5">Good luck!</Typography>
          <button id="startQuizBtn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default StartQuiz;
