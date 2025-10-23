import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy - Edzest</h1>

      <p className="text-lg mb-4">
        This policy explains what information we collect when you use our websites, services, products, and content ("Services"). It also has information about how we store, use, transfer, and delete that information. Our aim is not just to comply with privacy law but also to earn your trust.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Information We Collect & How We Use It</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>We collect only the information that you actively tell us through sign-up forms and registrations.</li>
        <li>
          We collect only your email ID, first name, last name, and phone number as it helps us stay connected with you. We DO NOT share your details with anyone else, and we will never do so. We DO NOT track any other data.
        </li>
        <li>
          We also do not track any of your details other than the time duration that you spend on our website through Firebase website analytics. This data is not personalized to you but is consolidated in a form of all users. This helps us improve our content and increase user retention.
        </li>
        <li>Edzest doesn’t make money from ads and doesn’t collect data in order to advertise to you.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
      <p className="text-lg mb-6">
        Payments that you make are through a secure gateway by Razorpay, and their privacy policy can be checked here: <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Razorpay Privacy Policy</a>.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Information Disclosure</h2>
      <p className="text-lg">
        Edzest won’t transfer information about you to third parties for the purpose of providing or facilitating third-party advertising to you. We won’t sell information about you to a third party.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
