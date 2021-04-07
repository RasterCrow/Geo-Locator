import React, { Suspense, lazy } from "react";
import CustomNavbar from "./components/UI/Navbar/Navbar";
import { Route, Redirect, Switch, BrowserRouter } from "react-router-dom";
import { Loader } from "rsuite";

const GameLobby = lazy(() => import("./pages/GameLobby"));
const Home = lazy(() => import("./pages/Home"));
const GamePage = lazy(() => import("./pages/GamePage"));

//const ENDPOINT = "http://localhost:4001";

function App() {
  //const { isLoading, authenticated } = useContext(AuthContext);
  const isLoading = false;
  return (
    <div className="App">
      <BrowserRouter>
        {isLoading ? (
          <Loader size="lg" content="Large" center content="Loading..." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <CustomNavbar />
            <div style={{ height: "94vh" }}>
              <Suspense
                fallback={
                  <Loader
                    size="lg"
                    content="Large"
                    center
                    content="Loading..."
                  />
                }
              >
                <Switch>
                  <Route exact path="/" component={Home}></Route>

                  <Route path={`/game/:uid`} exact component={GamePage} />
                  <Route path={`/lobby/:uid`} exact component={GameLobby} />
                  <Redirect from="*" to="/" />
                </Switch>
              </Suspense>
            </div>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
