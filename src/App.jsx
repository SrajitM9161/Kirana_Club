import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import Sidebar from "./sidebar";
import Table from "./Components/Table";
import Visualization from "./Components/Chart";
import ContestDetails from "./Components/Contest";
import "@shopify/polaris/build/esm/styles.css";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 p-4 bg-white">
            <Routes>
              <Route path="/table" element={<Table />} />
              <Route path="/visualization" element={<Visualization />} />
              <Route path="/contest/:contest_id" element={<ContestDetails />} />
              <Route path="*" element={<Table />} /> 
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
