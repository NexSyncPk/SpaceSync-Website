import CreateMeetingForm from "./subcomponents/CreateMeetingForm";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white w-full md:w-4/6 mx-auto p-4 rounded-lg shadow-2xl">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6">
          New Meeting Request
        </h1>
        <CreateMeetingForm />
      </div>
    </div>
  );
};

export default Home;
