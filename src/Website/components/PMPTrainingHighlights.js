import React from "react";

const PMPTrainingHighlights = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          PMP® Training Highlights
        </h2>

        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">Live Online Zoom Training</h5>
                <p className="card-text text-gray-600">
                  Attend live sessions every Friday (Middle East) and Saturday (India).
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">7 Weeks • 35 Contact Hours</h5>
                <p className="card-text text-gray-600">
                  5 hours each session for 7 weeks to fulfill PMP requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">Practical Project Practitioner Course</h5>
                <p className="card-text text-gray-600">
                  48+ hours of recorded videos to strengthen your real-world project knowledge.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">Weekly Tests</h5>
                <p className="card-text text-gray-600">
                  7 topic-based tests (60 questions each) to track your weekly progress.
                </p>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">Mock Exam Simulators</h5>
                <p className="card-text text-gray-600">
                  5 full-length mocks (180 questions each) to boost your exam readiness.
                </p>
              </div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="col-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">PMI Licensed Content</h5>
                <p className="card-text text-gray-600">
                  Access premium PMI® licensed materials and e-books.
                </p>
              </div>
            </div>
          </div>

          {/* Card 7 */}
          <div className="col-md-4 offset-md-4">
            <div className="card h-100 shadow hover:shadow-lg transition">
              <div className="card-body text-center">
                <h5 className="card-title text-[#4748ac] font-bold">1:1 Discussion</h5>
                <p className="card-text text-gray-600">
                  Personalized mentorship sessions to build your custom study plan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-center mt-10">
          <button className="btn btn-primary rounded-pill mx-2 px-4 py-2">
            Learn More
          </button>
          <button className="btn btn-outline-primary rounded-pill mx-2 px-4 py-2">
            Explore More
          </button>
        </div>
      </div>
    </section>
  );
};

export default PMPTrainingHighlights;
