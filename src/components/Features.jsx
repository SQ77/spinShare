
const Features = () => {
  return (
    <section className="py-20">
          <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
                  <div className="bg-white border-2 shadow-lg rounded-lg p-8 ml-5 mr-5 md:mr-0 hover:bg-gray-200">
                      <h3 className="text-xl font-semibold mb-4">Create, Edit, Delete</h3>
                      <p className="text-black">Let your friends know your plans by filling in your schedule with spin classes.</p>
                  </div>
                  <div className="bg-white border-2 shadow-lg rounded-lg ml-5 mr-5 md:ml-0 md:mr-0 p-8 hover:bg-gray-200">
                      <h3 className="text-xl font-semibold mb-4">Add Friends</h3>
                      <p className="text-black">Send and manage friend requests. Friends will be able to see each other's schedule.</p>
                  </div>
                  <div className="bg-white border-2 shadow-lg rounded-lg p-8 ml-5 mr-5 md:ml-0 hover:bg-gray-200">
                      <h3 className="text-xl font-semibold mb-4">Absolute & Revolution Schedule Forecast</h3>
                      <p className="text-black">Access the schedule of upcoming classes at Absolute & Revolution and easily add them to your own schedule.</p>
                  </div>
              </div>
          </div>
    </section>
  );
};

export default Features;
