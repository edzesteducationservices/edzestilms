import React from "react";
// import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom

const TermsAndConditions = () => {

  

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-md">
        <h1 className="text-3xl font-bold text-[#4748ac] mb-6">
          Terms and Conditions of Use
        </h1>
        <ol className="list-decimal list-inside text-gray-700 text-lg leading-relaxed space-y-6">
          <li>
            <strong>Acceptance of Terms:</strong> By accessing or using the Edzest Education Services website
            (hereinafter referred to as "the Website"), you agree to comply with and be bound by these terms and
            conditions. If you do not agree to these terms, please refrain from using our services.
          </li>
          <li>
            <strong>Intellectual Property:</strong> All materials, content, and resources provided during the training,
            including course materials, videos, slides, quizzes, and other documentation, are the intellectual property
            of Edzest or its licensors. You are not permitted to copy, distribute, or reproduce these materials without
            prior written permission.
          </li>
          <li>
            <strong>Eligibility and Enrollment:</strong> To enroll in the PMP® training, you must meet the eligibility
            criteria defined by PMI® (Project Management Institute). Edzest reserves the right to refuse enrollment or
            revoke access to the course if fraudulent or misleading information is provided during registration.
          </li>
          <li>
            <strong>Refund and Return Policy:</strong> All course fees must be paid in full before access to training
            materials is granted. Refund requests will only be accepted within 7 days of enrollment, provided that no
            significant course material has been accessed or downloaded. 
           
          </li>
          <li>
            <strong>Course Completion and Certification:</strong> Edzest provides training to help participants prepare
            for the PMP® exam, but we do not guarantee passing the exam. Certification is awarded by PMI® after
            successfully passing the PMP® exam conducted by PMI®.
          </li>
          <li>
            <strong>User Responsibilities:</strong> Participants must ensure that their login credentials are kept
            confidential. Sharing access with others is strictly prohibited. You agree to use the training materials
            and platform ethically and responsibly. Any misuse or violation of these terms may result in termination of
            access without a refund.
          </li>
          <li>
            <strong>Training Delivery:</strong> The training is delivered online through live sessions, pre-recorded
            modules, and downloadable resources. Edzest reserves the right to modify the training schedule, content, or
            instructors as necessary.
          </li>
          <li>
            <strong>Limitation of Liability:</strong> In no event shall Edzest be held liable for any damages arising
            out of the use or inability to use the materials on this website.
          </li>
          <li>
            <strong>Privacy Policy:</strong> Edzest is committed to protecting your personal information. Please refer
            to our 
            <a
              href="https://www.edzest.org/privacypolicy"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{" "}
            for details on how your data is collected, used, and stored.
          </li>
          <li>
            <strong>Governing Law:</strong> These terms are governed by and construed in accordance with the laws of
            [Karnataka, India]. Any disputes arising under these terms will be subject to the exclusive jurisdiction
            of the courts in [Bengaluru, Karnataka, India].
          </li>
          <li>
            <strong>Contact Information:</strong> For any questions or concerns regarding these Terms and Conditions,
            please contact us at:
            <ul className="list-disc ml-6 mt-2">
              <li>
                Email:{" "}
                <a
                  href="mailto:contact@edzest.org"
                  className="text-blue-600 underline"
                >
                  contact@edzest.org
                </a>
              </li>
              <li>Phone: +91 9673332684</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TermsAndConditions;
