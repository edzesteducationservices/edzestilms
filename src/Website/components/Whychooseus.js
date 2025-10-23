import React from "react";
import './whychooseus.css';
import trainerImg from '../Assets/trainerImg.jpg';
import elearningImg from '../Assets/elearningImg.jpg';
import personalisedsupportImg from '../Assets/personalisedsupportImg.jpg';
import flexibleImg from '../Assets/flexibleImg.jpg';
import applicationImg from '../Assets/applicationImg.jpg';
 
const benefits = [
  {
    title: "Expert Trainers",
    description:
      "Our trainers are qualified and experienced project professionals hence they help you learn the nitty-gritties of Project Management in a real world setting.",
    imgSrc: trainerImg,
  },
  {
    title: "Personalised Support",
    description:
      "We provide every participants individual attention to help them through their journey of learning and career development.",
    imgSrc: personalisedsupportImg,
  },
  {
    title: "Goal oriented learning",
    description:
      "Our training programs and Workshops are focused on helping you achieve your goals- whether you want to manage projects better or grab that lucrative job/position.",
    imgSrc: elearningImg,
  },
  {
    title: "Detailed analytics and progress tracking",
    description:
      "Throughout your learning, you will receive regular updates on your progress so that you can align your efforts to your goals.",
    imgSrc: flexibleImg,
  },
  {
    title: "Career support",
    description:
      "Our expert counsellors will help you build a career that you desire: from resume review to interview prep, we help you through the entire process of career development.",
    imgSrc: applicationImg,
  },
];
 
const WhyChooseUs = () => {
  return (
    <div className="hero-container">
      <h1 className="section-header" data-aos="fade-up">Why learn with Edzest?</h1>
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="hero-item"
          data-aos={index % 4 === 0 ? 'fade-right' : 'fade-left'}
          data-aos-duration="1000"
        >
          <div className="text-section">
            <h2>{String(index + 1).padStart(2, "0")}</h2>
            <h3>{benefit.title}</h3>
            <p style={{ fontFamily: "sans-serif", fontSize: "17px" }}>
              {benefit.description}
            </p>
          </div>
          <div className="image-section">
            <img
              src={benefit.imgSrc}
              alt={benefit.title}
              className="circle-image"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
 
export default WhyChooseUs;