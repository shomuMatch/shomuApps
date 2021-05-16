import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import TopPage from "./components/pages/TopPage";
import AboutPage from "./components/pages/AboutPage";
import VideoPage from "./components/pages/VideoPage";

import {UserInfoContextProvider} from "./components/contexts/UserInfoContext"




const App: React.FC = () => {

  return (
    <div>
      <UserInfoContextProvider>
        <Router>
          <Switch>
            <Route path="/" component={TopPage} exact />
            <Route path="/video" component={VideoPage} exact />
            <Route path="/about" component={AboutPage} exact />
          </Switch>
        </Router>
        </UserInfoContextProvider>
    </div>
  );
};

export default App;