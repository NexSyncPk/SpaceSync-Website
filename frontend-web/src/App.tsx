import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Routes from "./routes/Routes.tsx";

function App() {
  return (
    <Router>
      <Routes />
      <Toaster />
    </Router>
  );
}

export default App;
