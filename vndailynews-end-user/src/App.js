import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "@components/Layout/Header/NavBar";
import HeaderTop from "@components/Layout/Header/HeaderTop";
import Footer from "@components/Layout/Footer/Footer";
import { SearchProvider } from "./components/SearchContext";
import { MenuProvider } from "./components/MenuContext";
import routesConfig from "./routes/routesConfig";

function App() {
  return (
    <div className="page-container">
      <MenuProvider>
        <SearchProvider>
          <Router>
            <HeaderTop />
            <NavBar />
            <div className="content-wrap">
              <Routes>
                {routesConfig.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  ></Route>
                ))}
              </Routes>
            </div>
            <Footer />
          </Router>
        </SearchProvider>
      </MenuProvider>
    </div>
  );
}

export default App;
