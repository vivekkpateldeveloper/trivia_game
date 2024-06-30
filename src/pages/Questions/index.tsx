import React, { useState, useEffect } from "react";
import { Button, Typography, Container, Grid, Card } from "@mui/material";
// import { getQuestions } from "../../service/quiz";
import { apiData } from "../questionData";
import Result from "../Result";
import { QuizQuestion } from "../../interface";
import { ShuffleArray } from "../../utils/suffleArray";

const Questions = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [totalIncorrect, setTotalIncorrect] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestions(apiData?.results);
      // const response = await getQuestions();
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions?.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const allAnswers = ShuffleArray([
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ]);
      setShuffledAnswers(allAnswers);
    }
  }, [questions, currentQuestionIndex]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitClick = () => {
    if (selectedAnswer) {
      const correctAnswer = questions[currentQuestionIndex].correct_answer;
      if (selectedAnswer === correctAnswer) {
        setTotalCorrect((prev) => prev + 1);
      } else {
        setTotalIncorrect((prev) => prev + 1);
        setShowExplanation(true);
      }
      setShowNextButton(true);
    }
  };

  const handleNextClick = () => {
    if (currentQuestionIndex + 1 === questions.length) {
      setQuizComplete(true);
    } else {
      setShowNextButton(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % questions.length
      );
    }
  };

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      {quizComplete ? (
        <Result
          questions={questions}
          totalIncorrect={totalIncorrect}
          totalCorrect={totalCorrect}
        />
      ) : (
        <>
          <h1>
            Question {currentQuestionIndex + 1} / {questions.length}
          </h1>
          <Container maxWidth="sm">
            <Card
              style={{
                backgroundColor: "lightgray",
                padding: "50px",
                textAlign: "center",
              }}
            >
              <Typography variant="h5">{currentQuestion.difficulty}</Typography>
              <Typography variant="h5">{currentQuestion.question}</Typography>
              <Grid container spacing={2}>
                {shuffledAnswers.map((answer, index) => {
                  let backgroundColor: string | undefined;

                  if (showNextButton) {
                    if (
                      answer === currentQuestion.correct_answer &&
                      answer === selectedAnswer
                    ) {
                      backgroundColor = "green";
                    } else if (answer === selectedAnswer) {
                      backgroundColor = "red";
                    }
                  } else if (selectedAnswer === answer) {
                    backgroundColor = "gray";
                  }

                  return (
                    <Grid item xs={12} key={index}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleAnswerClick(answer)}
                        style={{
                          backgroundColor: backgroundColor,
                          color: "white",
                        }}
                        disabled={showNextButton}
                      >
                        {answer}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
              {showExplanation && (
                <Typography variant="body1" style={{ marginTop: "10px" }}>
                  Correct Answer is {currentQuestion?.correct_answer}
                </Typography>
              )}
              {!showNextButton && selectedAnswer && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitClick}
                  style={{ marginTop: "20px" }}
                >
                  Submit
                </Button>
              )}
            </Card>
            {showNextButton && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextClick}
                style={{ marginTop: "20px" }}
              >
                Next
              </Button>
            )}
          </Container>
        </>
      )}
    </div>
  );
};

export default Questions;
