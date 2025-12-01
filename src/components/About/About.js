import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  let navigate = useNavigate();
  return (
    <div className="about-container flex flex-col items-center p-8 bg-gray-100">
      {/* Header Section */}
      <h1 className="title text-4xl font-bold text-center text-teal-600 mb-6">
        Library on Wheels: Bringing Books Closer to You!
      </h1>
      <p className="subtitle text-lg text-center text-gray-700 mb-6">
        Imagine the joy of sipping your favorite coffee or tea while diving into a captivating book—all in the cozy setting of your neighborhood café. Library on Wheels is here to make that dream a reality!
      </p>
      <p className="description text-md text-center text-gray-600 mb-10">
        With <strong>400+ books</strong> housed in Mini-Libraries at popular cafés across the city, we’re redefining how you enjoy reading.
      </p>

      {/* Borrow and Return Section */}
      <div className="steps-section bg-white shadow-lg p-8 rounded-lg max-w-4xl">
        <h2 className="steps-title text-2xl font-semibold text-teal-600 mb-4 text-center">
          How It Works
        </h2>
        <ol className="steps-list list-decimal list-inside text-gray-800 mb-6">
          <li className="mb-2">Subscribe to Library on Wheels and receive your unique Reader QR code.</li>
          <li className="mb-2">Visit a Mini-Library at one of these locations:
            <ul className="ml-6 list-disc">
              <li><a href="https://g.co/kgs/hDPAi6" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline"><strong>Essence Café</strong></a> (Mate Square)</li>
              <li><a href="https://g.co/kgs/x5dwCyR" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline"><strong>Seven O Eleven Café</strong></a> (Pratap Nagar)</li>
              <li><a href="https://g.co/kgs/iC3B1yH" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline"><strong>Three Beans Café</strong></a> (Civil Lines)</li>
            </ul>
          </li>
          <li className="mb-2">Pick a book that calls to you or comes highly recommended.</li>
          <li className="mb-2">Get your Reader QR code and the book QR scanned at the café counter using our web app.</li>
          <li className="mb-2">Take the book home or enjoy it in the café.</li>
        </ol>

        <h2 className="steps-title text-2xl font-semibold text-teal-600 mb-4 text-center">
          How to Return a Book
        </h2>
        <ol className="steps-list list-decimal list-inside text-gray-800">
          <li className="mb-2">Return to the café where you borrowed the book.</li>
          <li className="mb-2">Go to the café counter and have the book QR scanned by the representative using our web app.</li>
          <li className="mb-2">Feel free to pick another book and repeat the process to keep reading!</li>
        </ol>
      </div>

      {/* Community Section */}
      <div className="community-section text-center mt-10">
        <h2 className="addlib-title text-2xl font-semibold text-teal-600 mb-4">
          Join Our Community
        </h2>
        <p className="addlib-description text-md text-gray-700 mb-4">
          Be part of the Library on Wheels community and connect with fellow book lovers! We host fun events where you can share ideas and meet amazing people.
        </p>
        <p className="text-md text-gray-700 mb-4">
          Want to join? Send a message to <strong>9130522794</strong> to be added to our WhatsApp group.
        </p>
        <p className="text-md text-gray-700">
          <strong>Follow us on Instagram:</strong> Stay updated with the latest events, activities, and book collections. Follow us at <em>Library.on.wheels</em>.
        </p>
        <button
          className="register-button mt-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded shadow-md hover:bg-teal-700"
          onClick={() => {
            navigate("/addreader");
          }}
        >
          START REGISTERING 🚀
        </button>
      </div>
    </div>
  );
};

export default About;
