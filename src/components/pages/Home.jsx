import Hero from "../Hero";
import Features from "../Features";
import ContactForm from "../ContactForm"; // Import the ContactForm component

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <div className="bg-indigo-700 py-8"> {/* Added purple background */}
        <ContactForm /> 
      </div>
    </>
  );
};

export default Home;
