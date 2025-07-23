import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Routes from "./routes/Routes.tsx";
import SocketManager from "./components/SocketManager.tsx";

function App() {
  return (
    <Router>
      <SocketManager />
      <Routes />
      <Toaster />
    </Router>
  );
}

export default App;
