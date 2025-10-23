
import React from "react";
import trainingpageimageimg from "../Assets/Trainingpageimage.png";
import pmilogoimg from "../Assets/pmilogo.png";
import liveTrainingImg from "../Assets/Livetraining.png";
import recordedVideosImg from "../Assets/recordedvideos.png";
import flashcardsImg from "../Assets/flashcard.png";
import personalizedsupportimg from "../Assets/personalizedsupport.png";
import mockExamImg from "../Assets/mockexam.png";
import applicationSupportImg from "../Assets/Applicationsupport.png";
import FAQ from "./FAQ"; 
import Contact from "./Contact"; 
import Footer  from "./Footer";
 


const Hero = () => {
  return (
    <>
      {/* Section 1: Hero Section */}
      <section className="bg-gray-100 w-full" style={{fontFamily:"sans-serif", fontSize:"17px"}}>
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center px-6 md:px-12 lg:px-24">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-800">
              PMP<span className="text-gray-900">®</span> Exam Prep <br />
              by <span className="text-[#4748ac]">edzest</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
            Prepare for your PMP® certification exam with our expert-led training courses that get you ready to pass the exam on your first attempt.
            </p>
            <div>
            <a
  href="https://exams.edzest.org/learn/PMP-training-Apr-25-batch
"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-block bg-[#4748ac] hover:bg-[3636ac] text-white font-semibold py-3 px-6 rounded-lg transition text-decoration-none duration-300"
>
  Enroll Now
</a>

            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src={trainingpageimageimg}
              alt="Instructor presenting online"
              className="w-full max-w-md md:max-w-lg lg:max-w-full object-cover rounded-md shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Banner Section */}
      <section className="bg-gray-100 py-12" style={{ fontFamily: "sans-serif", fontSize: "17px" }}>
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold text-gray-900">Training options</h2>
    <p className="text-gray-600 text-xl mt-4">
      Whether you want to attend online instructor-led sessions or study at your own pace, we have the training options available to meet all your needs. Choose from below options to prepare for your exam.
    </p>

    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* PMP Live Online Training */}
      <div className="bg-gray-300 p-6 rounded-lg shadow-md flex flex-col h-full">
        <h3 className="text-xl font-semibold text-gray-900 text-center">PMP Live Online Training</h3>
        <ul className="text-gray-700 text-base space-y-2 list-disc pl-5 mt-4 flex-grow">
          <li>40 hrs. of instructor-led sessions</li>
          <li>Complementary recorded videos course</li>
          <li>Access to Mock exam simulators</li>
          <li>Free e-book to study in detail</li>
          <li>Application support</li>
          <li>Weekly group revision sessions</li>
          <li>1:1 guidance till your certification</li>
        </ul>
        <a href="https://exams.edzest.org/learn/PMP-training-Apr-batch" target="_blank" rel="noopener noreferrer" className="mt-auto text-center">
          <button className="bg-[#4748ac] hover:bg-[#3737ac] text-white font-semibold py-2 px-6 rounded mt-6">
            Learn More
          </button>
        </a>
      </div>

      {/* PMP Recorded Videos */}
      <div className="bg-gray-300 p-6 rounded-lg shadow-md flex flex-col h-full">
        <h3 className="text-xl font-semibold text-gray-900 text-center">PMP Recorded Videos</h3>
        <ul className="text-gray-700 text-base space-y-2 list-disc pl-5 mt-4 flex-grow">
          <li>40+ hrs. of pre-recorded videos</li>
          <li>Access to Mock exam simulators</li>
          <li>Free e-book to study in detail</li>
          <li>Application support</li>
          <li>Weekly group revision sessions</li>
          <li>Access to study resources</li>
        </ul>
        <a href="https://exams.edzest.org/learn/PMP-selfstudy" target="_blank" rel="noopener noreferrer" className="mt-auto text-center">
          <button className="bg-[#4748ac] hover:bg-[#3737ac] text-white font-semibold py-2 px-6 rounded mt-6">
            Learn More
          </button>
        </a>
      </div>

      {/* PMP Mock Exams */}
      <div className="bg-gray-300 p-6 rounded-lg shadow-md flex flex-col h-full">
        <h3 className="text-xl font-semibold text-gray-900 text-center">PMP Mock Exams</h3>
        <ul className="text-gray-700 text-base space-y-2 list-disc pl-5 mt-4 flex-grow">
          <li>8 topic-wise mini mock exams (60 questions each)</li>
          <li>3 ECO domain-wise mocks</li>
          <li>5 Full-length mock exams</li>
          <li>Free revision course</li>
          <li>Exercises to improve your scores</li>
        </ul>
        <a href="https://exams.edzest.org/learn/PMP-mock-exams-by-edzest" target="_blank" rel="noopener noreferrer" className="mt-auto text-center">
          <button className="bg-[#4748ac] hover:bg-[#3737ac] text-white font-semibold py-2 px-6 rounded mt-6">
            Learn More
          </button>
        </a>
      </div>
    </div>
  </div>
</section>


      {/* Section 3: Why Choose Us */}
      <section className="bg-white py-16" style={{fontFamily:"sans-serif", fontSize:"17px"}}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why choose our training program?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="flex items-center space-x-6">
              <img
                src={liveTrainingImg}
                alt="Live Training"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  40 hrs. of live training
                </h3>
                <p className="text-gray-600 mt-2">
                  Learn directly from PMI Authorized Instructors of PMP® in
                  interactive live sessions.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <img
                src={recordedVideosImg}
                alt="Recorded Videos"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  40+ hrs. of Recorded Videos
                </h3>
                <p className="text-gray-600 mt-2">
                  Access recorded versions of live classes anytime.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <img
                src={flashcardsImg}
                alt="Flashcards"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Flashcards and E-Book
                </h3>
                <p className="text-gray-600 mt-2">
                  Get access to PMP® flashcards and an e-book for quick and easy revision.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <img
                src={personalizedsupportimg}
                alt="Personalized Support"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Personalized Support
                </h3>
                <p className="text-gray-600 mt-2">
                  Receive individualized guidance and support to ensure success.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <img
                src={mockExamImg}
                alt="Mock Exams"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Mock Exams
                </h3>
                <p className="text-gray-600 mt-2">
                  Practice with PMP® mock exams to boost your confidence and exam readiness.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <img
                src={applicationSupportImg}
                alt="Application Support"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Application Support
                </h3>
                <p className="text-gray-600 mt-2">
                  Get help with your PMP® application to make the process seamless.
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center my-8">
          <a
              href="https://exams.edzest.org/learn/PMP-training-Apr-25-batch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#4748ac] hover:bg-[#3737ac] text-white font-semibold py-3 px-6 rounded-lg text-decoration-none transition duration-300"
            >
              Enroll Now
            </a>
          </div>
        </div>
      </section>
      {/* Training Overview Section */}
<section className="py-12 bg-purple-50" style={{fontFamily:"sans-serif", fontSize:"17px"}}>
  <div className="container mx-auto px-4 bg-red shadow-lg rounded-lg p-8">
    <h2 className="text-3xl font-bold text-center text-black-800 mb-12">
Training content</h2>
    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
    The content of the training is designed to help you understand the flow of
activities in Project Management. Over the course of 4 weeks (32 sessions), we
will help you learn about Project Management from starting to closure.
Throughout the training program, we have highlighted the important
scenarios, concepts, and mindset that will help you answer the exam
questions with ease.
    </p>

    <section className="bg-gray-100 py-12" style={{ fontFamily: "sans-serif", fontSize: "17px" }}>
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"> 
      
      {/* Pre-training (Left - Narrower) */}
      <div className="flex justify-center items-center text-center h-full">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md max-w-[180px] sm:max-w-[200px] w-full flex justify-center items-center text-center h-full">
          <h3 className="text-lg  text-gray-900">Pre-training</h3>
        </div>
      </div>
      <div className="flex justify-center h-full">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md max-w-sm sm:max-w-md w-full h-full flex items-center">
          <p className="text-gray-900 text-lg" style={{ fontFamily: "sans-serif", fontSize: "14px" }}>
            Pre-training conceptual knowledge test on Traditional and Agile approach.<br />
            Discovery call to discuss your experience and plans for PMP certification.
          </p>
        </div>
      </div>

      {/* Training (Left - Narrower) */}
      <div className="flex justify-center items-center text-center h-full">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md max-w-[180px] sm:max-w-[200px] w-full flex justify-center items-center text-center h-full">
          <h3 className="text-lg text-gray-900">Training</h3>
        </div>
      </div>
      <div className="flex justify-center h-full">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md max-w-sm sm:max-w-md w-full h-full flex items-center">
          <ul className="text-gray-900 text-lg space-y-1 "style={{marginLeft:"-30px",  fontFamily: "sans-serif", fontSize: "14px" }}>
            <li>Week 1: Starting a Project</li>
            <li>Week 2: Planning in Projects</li>
            <li>Week 3: Leading the work</li>
            <li>Week 4: Delivering project successfully</li>
          </ul>
        </div>
      </div>

      {/* Post-training (Left - Narrower) */}
      <div className="flex justify-center items-center text-center h-full">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md max-w-[180px] sm:max-w-[200px] w-full flex justify-center items-center text-center h-full">
          <h3 className="text-base text-gray-900">Post-training</h3>
        </div>
      </div>
      <div className="flex justify-center h-full">
        <div className="bg-indigo-100 p-6 rounded-xl shadow-md max-w-sm sm:max-w-md w-full h-full flex items-center">
          <p className="text-gray-900 text-lg" style={{ fontFamily: "sans-serif", fontSize: "14px" }}>
            Full-length mock exams to test and identify gaps.<br />
            1:1 discussion with trainers for guidance and plan for the exam.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>


<div className="text-center mt-6">
<a
  href="/PMP exam prep by edzest.pdf"
  download
  className="text-[#4748ac] font-semibold underline text-sm lg:text-base"
>
  Download Curriculum
</a>

</div>


  </div>


</section>
{/* FAQ Section */}
<FAQ />
{/* Contact Section */}
<Contact />
<Footer />
    </>
  );
};

export default Hero;