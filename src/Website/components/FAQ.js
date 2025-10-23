import React, { useState } from "react";
import './FAQ.css';
const faqs = [
  {
    question: "What is PMP® Certification?",
    answer:
      "PMP (Project Management Professional) Certification is a globally recognized certification for project managers, demonstrating their competence in leading and directing projects.",
  },
  {
    question: "Who can apply for PMP® Certification?",
    answer:
      "Anyone with a high school diploma, 35 contact hours of project management education, and a minimum of 3 years of project management experience can apply for PMP Certification.",
  },
  {
    question: "How long is the PMP® Certification valid?",
    answer:
      "PMP Certification is valid for 3 years. After 3 years, you must earn 60 PDUs (Professional Development Units) to maintain your certification.",
  },
  {
    question: "What are the prerequisites for PMP® Certification?",
    answer:
      "You need a high school diploma or equivalent, 35 contact hours of project management education, and at least 3 years of project management experience.",
  },
  {
    question: "How do I maintain my PMP® Certification?",
    answer:
      "To maintain your PMP Certification, you need to earn 60 PDUs every 3 years through professional development activities like attending training, conferences, or working on relevant projects.",
  },
  {
    question: "How should I prepare for the PMP® exam?",
    answer:
      "Preparation involves completing 35 hours of training, studying the PMBOK® Guide, using online resources, taking mock exams, and following a structured plan.",
  },
  {
    question: "What topics are covered in the PMP® exam?",
    answer:
      "The PMP® exam covers People, focusing on leadership and team management; Process, emphasizing project management methodologies; and Business Environment, aligning projects with organizational goals. These domains represent the knowledge areas required for effective project management. ",
  },
  

];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-6 py-16" style={{fontFamily:"sans-serif", fontSize:"17px"}}>
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
              <span
                className={`transform ${
                  activeIndex === index ? "rotate-180" : "rotate-0"
                } transition-transform`}
              >
                ▼
              </span>
            </div>
            {activeIndex === index && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
