import Hero from "../Hero";
import Features from "../Features";
import GetStarted from "../GetStarted";

const Home = () => {
  return (
    <>
    <Hero />
    <Features />
    <p className="ml-4 mb-4">Help to improve SpinShare by giving feedback{' '}  
      <a href="https://forms.gle/tSN6GMSWoa5RPDYK7" className="text-blue-600 hover:underline">
          here
      </a>
    </p>
    </>
  );
};

export default Home;
