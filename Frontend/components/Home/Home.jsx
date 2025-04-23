import React from "react";
import Banner from "./Banner";
import About from "./About";
import Services from "./Services";
import Guide from "./Guide";
import BeTutor from "./BeTutor";
import StudentReviews from "./StudentReview";

export default function Home() {
  return (
    <>
      <Banner />
      <About />
      <Services />
      <Guide />
      <BeTutor />
      <StudentReviews />
    </>
  );
}
