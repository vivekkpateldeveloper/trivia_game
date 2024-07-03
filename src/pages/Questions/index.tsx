import React, { useState, useEffect } from "react";
import { Button, Typography, Container, Grid, Card } from "@mui/material";
import Result from "../Result";
import { QuizQuestion } from "../../interface";
import { ShuffleArray } from "../../utils/suffleArray";
import { Loader } from "../../component/loader";
import { getQuestions } from "../../service/quiz";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions();

        const questions = response?.results;

        const easy = questions.filter(
          (q: QuizQuestion) => q.difficulty === "easy"
        );
        const medium = questions.filter(
          (q: QuizQuestion) => q.difficulty === "medium"
        );
        const hard = questions.filter(
          (q: QuizQuestion) => q.difficulty === "hard"
        );

        const combined = [...easy, ...medium, ...hard];
        setQuestions(combined);
        setLoading(false);
      } catch (error) {
        setQuestions([]);
        setError("Failed to load questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions?.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const allAnswers = ShuffleArray([
        ...currentQuestion?.incorrect_answers,
        currentQuestion?.correct_answer,
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
    if (currentQuestionIndex + 1 === questions?.length) {
      setQuizComplete(true);
    } else {
      setShowNextButton(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setCurrentQuestionIndex(
        (prevIndex) => (prevIndex + 1) % questions?.length
      );
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <Loader />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const decodeHtmlEntities = (str: string) => {
    return str.replace(/&quot;/g, '"').replace(/&#039;/g, "'");
  };

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
            Question {currentQuestionIndex + 1} / {questions?.length}
          </h1>
          <Container maxWidth="sm">
            <Card
              style={{
                backgroundColor: "lightgray",
                padding: "50px",
                textAlign: "center",
              }}
            >
              <Typography className="label-square">
                {currentQuestion?.difficulty}
              </Typography>
              <Typography style={{ textAlign: "left" }} variant="h5">
                <b>Q.</b>{" "}
                {currentQuestion
                  ? decodeHtmlEntities(currentQuestion?.question)
                  : ""}
              </Typography>
              <Grid container spacing={2}>
                {shuffledAnswers?.map((answer, index) => {
                  let backgroundColor: string | undefined;
                  
                  if (showNextButton) {
                    if (
                      answer === currentQuestion?.correct_answer &&
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
                        {answer ? decodeHtmlEntities(answer) : ""}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
              {showExplanation && (
                <Typography variant="body1" style={{ marginTop: "10px" }}>
                  Correct Answer is{" "}
                  <strong>{currentQuestion?.correct_answer}</strong>
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
               <button id="startQuizBtn" className="btn-group"
                onClick={handleNextClick}
                style={{ marginTop: "20px" }}
              >
                Next
              </button>
            )}
          </Container>
        </>
      )}
    </div>
  );
};

export default Questions;
