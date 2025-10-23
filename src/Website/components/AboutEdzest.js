import React from 'react';
import aboutimageImg from '../Assets/aboutimage.png';
import aboutimageImg2 from '../Assets/aboutimage2.png';
import aboutimageImg3 from '../Assets/aboutimage3.png';
import Footer from "./Footer";
import AdBanner from '../components/AdBanner'
 
const AboutEdzest = () => {
  return (
    <>
    <AdBanner/>
      {/* First Section */}
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">About Edzest</h1>
 
        <div className="flex flex-col md:flex-row items-center mb-16 gap-10">
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <img src={aboutimageImg} alt="Edzest Team" className="rounded-xl shadow-xl w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2" data-aos="fade-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Edzest Education Services is your trusted partner in mastering project management.
              As an authorized training partner of PMI, we specialize in providing comprehensive
              training solutions for certifications like PMP®.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              With a commitment to quality, innovation, and personalized guidance, we create impactful
              learning experiences that bridge the gap between theory and practice.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Since 2021, Edzest has helped 500+ professionals across 45 countries—with 156 earning PMP®
              certification and 88% passing on their first attempt.
            </p>
          </div>
        </div>
      </div>
 
      {/* Second Section */}
      <div className="container mx-auto py-16 px-6 bg-gray-100">
        <h1 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">Our Mission</h1>
 
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 order-2 md:order-1" data-aos="fade-right">
            <img src={aboutimageImg2} alt="Mission" className="rounded-xl shadow-xl w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2" data-aos="fade-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              At Edzest, we believe in empowering professionals through top-quality training.
              We use real-world case studies, interactive workshops, and practical exercises
              to deliver an immersive learning experience.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our expert trainers are seasoned professionals who connect theory to real-life scenarios.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Join a community of learners and elevate your project management career with us.
            </p>
          </div>
        </div>
      </div>
 
      {/* Third Section */}
      <div className="container mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">Our Vision</h1>
 
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <img src={aboutimageImg3} alt="Vision" className="rounded-xl shadow-xl w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2" data-aos="fade-left">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our vision is to be the most trusted and innovative provider of project management
              education globally. We aim to inspire individuals to lead with impact.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Through continuous improvement, we guide professionals to deliver extraordinary results
              with confidence and excellence.
            </p>
          </div>
        </div>
      </div>
 
      <Footer />
    </>
  );
};
 
export default AboutEdzest;