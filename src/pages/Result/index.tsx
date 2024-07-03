import { Box, Card, Container, Typography } from "@mui/material";
import { IoReloadCircle } from "react-icons/io5";

const Result = ({ questions, totalCorrect, totalIncorrect }: any) => {
  return (
    <>
      <Container maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Card
            style={{
              backgroundColor: "lightgray",
              padding: "50px",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" style={{ marginBottom: "20px" }}>
              Quiz Complete!
            </Typography>
            <Typography variant="h6">
              Total Questions Served: {questions?.length}
            </Typography>
            <Typography variant="body1">
              Total Correct Answers: {totalCorrect}
            </Typography>
            <Typography variant="body1">
              Total Incorrect Answers: {totalIncorrect}
            </Typography>
            <button
              className="button-with-icon"
              onClick={() => window.location.reload()}
            >
              Re-start
            </button>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Result;
