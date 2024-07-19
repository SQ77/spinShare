import Hero from "../Hero";
import Features from "../Features";

const Home = () => {
  return (
    <>
    <Hero />
    <Features />
    <p className="ml-4 mb-4">Help to improve SpinShare by giving{' '}  
      <a href="https://forms.gle/tSN6GMSWoa5RPDYK7" className="text-blue-600 hover:underline">
          feedback
      </a>
    </p>
    </>
  );
};

export default Home;
