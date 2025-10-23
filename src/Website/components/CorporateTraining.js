import React, { useState } from 'react';
import axios from 'axios';
import Footer from "./Footer";
import ContactUs from './Contactus';
import Trainer1 from '../Assets/Trainer1.png';
import Trainer2 from '../Assets/Trainer2.png';
import Trainer3 from '../Assets/Trainer3.png';

const CorporteTraining = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  const handleRequestClick = () => {
    setShowForm(true);
    setSubmitted(false);
    setStatus("");
    setShowModal(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === "modal-overlay") {
      const confirmClose = window.confirm("Are you sure you want to close the demo form?");
      if (confirmClose) setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    const confirmClose = window.confirm("Are you sure you want to close the demo form?");
    if (confirmClose) setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("Sending...");
    try {
      await axios.post("https://edzestweb-6.onrender.com/api/contact", formData);
      setSubmitted(true);
      setStatus("✅ Thank you for your time. We welcome you to our team! We’ll reach out to you soon.");
      setFormData({ fullName: "", email: "", phoneNumber: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting the form. Please try again.");
    } finally {
      setSending(false);
    }
  };



  
  const trainers = [
    {
      img: Trainer1,
      name: "Amit Kumar Chandan",
      desc: "15 years project experince | PMI-ATP Instructor for PMP® and PMI-ACP®",
      linkedin: "https://www.linkedin.com/in/amitkumarchandan/"
    },
    {
      // img: Trainer2,
       img: "https://media.licdn.com/dms/image/v2/D4D03AQGK5lT5AQ94LQ/profile-displayphoto-shrink_400_400/B4DZVwDFwkHYAg-/0/1741341613901?e=1755734400&v=beta&t=ouutyjXlxFBbfzeykiZYlrNDHsifKFu2jYY2N4t_Nc4",
      name: "Manpreet Singh Bhalla",
      desc: "Certified Customer Success Leader | Business Analyst | Driving Growth & Innovation in B2B | Jira ",
      linkedin: "https://www.linkedin.com/in/bhallamanpreet/"
    },
    {
      img: Trainer3,
      name: "Kavitha Girish",
      desc: "25 years project management experience | PMI-ATP Instructor for PMP®",
      linkedin: "https://www.linkedin.com/in/kavithagirishpmpagilist/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eaf6] to-[#f5f7fa] p-6">
      <section className="text-center py-12 bg-[#4748ac] text-white rounded-xl mb-10">
        <h1 className="text-4xl font-bold mb-4">Corporate PMP® Training Program</h1>
        <p className="text-lg mb-6">
          Train your teams with industry-recognized PMP® certification to drive project success and strategic impact.
        </p>
        <button
          onClick={handleRequestClick}
          className="bg-white text-[#4748ac] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Request a Demo
        </button>
      </section>

<section className="py-16 bg-[#f5f7fa] animate-fadeUp">
  <h2 className="text-3xl text-center text-[#4748ac] font-bold mb-10">
    Why Choose Our PMP® Corporate Training?
  </h2>
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
    {[
      {
        title: "Globally Recognized Certification",
        desc: "Boost team credibility with PMP®, the gold standard in project management.",
      },
      {
        title: "Customized Team Learning",
        desc: "Tailored training modules to match your company’s domain and goals.",
      },
      {
        title: "Expert Mentorship",
        desc: "Learn from certified PMP® trainers with real-world corporate experience.",
      },
      {
        title: "Authorized Trainers",
        desc: "PMI-authorized instructors ensure compliance with the latest standards.",
      },
    ].map((item, idx) => (
      <div
        key={idx}
        className="bg-white shadow-xl rounded-xl p-6 transition transform hover:scale-105 hover:shadow-2xl"
        style={{ animationDelay: `${idx * 0.1}s` }}
      >
        <h3 className="text-xl font-semibold text-[#4748ac] mb-2">{item.title}</h3>
        <p className="text-gray-700">{item.desc}</p>
      </div>
    ))}
  </div>
</section>


<section className="py-16 bg-[#f5f7fa] animate-fadeUp">
  <h2 className="text-3xl text-center text-[#4748ac] font-bold mb-10">Program Highlights</h2>
  <ul className="max-w-4xl mx-auto space-y-6">
    {[
      "Duration: 35 Hours (Live/Online)",
      "Delivery: Instructor-led or self-paced",
      "Materials: PMBOK-aligned curriculum",
      "Assessment: 4 mock exams + real scenarios",
      "Support: Dedicated training coordinator",
    ].map((text, idx) => (
      <li key={idx} className="flex items-center space-x-4">
        <div className="w-9 h-9 rounded-full bg-[#4748ac] text-white flex items-center justify-center font-semibold text-sm">
          {idx + 1}
        </div>
        <span className="text-gray-800 text-lg">{text}</span>
      </li>
    ))}
  </ul>
</section>

    <section>
  <h2 className="text-3xl text-[#4748ac] font-bold text-center mb-8">Meet Your Trainers</h2>
  <div className="flex flex-wrap justify-center gap-6">
    {trainers.map((trainer, idx) => (
      <div
        key={idx}
        className="w-72 h-80 perspective relative"
        onMouseEnter={() => setFlippedCard(idx)}
        onMouseLeave={() => setFlippedCard(null)}
      >
        <div
          className={`w-full h-full relative transition-transform duration-[1200ms] transform ${
            flippedCard === idx ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-4 z-10">
            <img
              src={trainer.img}
              alt={trainer.name}
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow mb-3"
            />
            <h3 className="text-xl font-semibold text-[#4748ac]">{trainer.name}</h3>
            <p className="text-gray-600 text-sm text-center">{trainer.desc}</p>
          </div>

          {/* Back Face */}
          <a
            href={trainer.linkedin}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 rotate-y-180 backface-hidden bg-[#4748ac] text-white rounded-xl shadow-xl flex flex-col items-center justify-center p-5 transition-transform duration-1000 z-20"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
              alt="LinkedIn"
              className="w-12 h-12 mb-3 animate-bounce"
            />
            <h4 className="text-lg font-semibold mb-1">Connect on LinkedIn</h4>
            <p className="text-sm opacity-90">{trainer.name}</p>
          </a>
        </div>
      </div>
    ))}
  </div>

  {/* Internal Flip Animation CSS */}
  <style>{`
    .perspective {
      perspective: 1200px;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    .backface-hidden {
      backface-visibility: hidden;
    }
  `}</style>
</section>



      {showModal && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative animate-fadeIn">
            <button
  onClick={handleCloseModal}
  className="modal-close-button"
>
  ✖
</button>


            <h2 className="text-2xl font-bold text-[#4748ac] text-center mb-1">We’re Happy to Have You! 🎉</h2>
            <p className="text-center text-gray-600 text-sm mb-4">
              Fill this quick form. Our team will reach out shortly!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                disabled={sending}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#4748ac] focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                disabled={sending}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#4748ac] focus:outline-none"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                disabled={sending}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#4748ac] focus:outline-none"
              />
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                disabled={sending}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#4748ac] focus:outline-none"
              ></textarea>
              <button
                type="submit"
                disabled={sending}
                className={`w-full bg-[#4748ac] text-white py-2 rounded-lg font-semibold transition-all ${
                  sending ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3737ac]"
                }`}
              >
                {sending ? "Sending..." : "Submit"}
              </button>
              {status && (
                <p className={`text-sm mt-2 text-center ${status.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                  {status}
                </p>
              )}
              {submitted && (
                <div className="text-center text-[#4748ac] font-semibold animate-bounce mt-4">
                  🎊 Thank you for joining Edzest! 🎊
                </div>
              )}
            </form>
          </div>
        </div>
      )}
<br></br>

      <Footer />
<style>{`
.modal-close-button {
  position: absolute;
  top: -19px;
  right: -1px;
  width: 40px;
  height: 40px;
 
  color: white;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-button:hover {
 
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.modal-close-button:focus {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

  .perspective {
    perspective: 1000px;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-fadeUp {
    animation: fadeUp 0.8s ease-out both;
  }

  @keyframes fadeIn {
    0% { opacity: 0; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes fadeUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }

   
 
`}</style>

      <style>{`
        .perspective {
          perspective: 1000px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CorporteTraining;




































