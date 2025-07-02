import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout.js";
import Routes from "./routes/Routes.tsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes />
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
