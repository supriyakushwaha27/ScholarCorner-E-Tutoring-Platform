import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Sign Up",
    description: "Create an account to access our platform.",
  },
  {
    label: "Book a Session",
    description:
      "Find the perfect tutor for your needs and easily schedule a video session at your convenience.",
  },
  {
    label: "Learn and Grow",
    description:
      "Connect with knowledgeable tutors and enhance your learning experience.",
  },
];

export default function Guide() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ pt: 9, pb: 10, px: 2 }}>
      <Typography
        sx={{
          lineHeight: "1.2",
          fontSize: {
            xs: "2rem",
            lg: "2.8rem",
          },
          fontWeight: "600",
          textAlign: "center",
          mb: "3rem",
        }}
      >
        How it Works:
        <span style={{ color: "#023063" }}> A Step-by-Step Guide </span>
      </Typography>
      <Grid
        container
        spacing={4}
        sx={{ alignItems: "center", justifyContent: "center" }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ maxWidth: 700, width: "100%" }}>
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              sx={{
                "& .MuiStepLabel-root": { fontSize: "2rem" },
                "& .MuiStepContent-root": { p: 3, textAlign: "left" },
                "& .MuiStepContent-root .MuiBox-root": { textAlign: "left" },
                paddingLeft: { lg: "10rem", xs: "5rem" },
              }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      {activeStep < steps.length - 1 && (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Continue
                        </Button>
                      )}
                      {activeStep > 0 && (
                        <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                          Back
                        </Button>
                      )}
                      {activeStep === steps.length - 1 && (
                        <Button
                          variant="contained"
                          onClick={handleReset}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Done
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="Boy.jpeg"
            alt="Boy"
            style={{
              maxWidth: "80%",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "none",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
