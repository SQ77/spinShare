import Hero from "../Hero";
import Features from "../Features";
import ContactForm from "../ContactForm";

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <div className="bg-blue-800 py-8"> 
          <ContactForm />
      </div>
    </>
  );
};

export default Home;
