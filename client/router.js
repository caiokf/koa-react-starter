import React from "react";
import { Router, Route, browserHistory, IndexRoute } from "react-router";

// Layouts
import MainLayout from "./layouts/main.layout";

// Pages
import NotFound from "./pages/not-found";
import Home from "./pages/index";
import Error from "./pages/error";

export default (
  <Router history={browserHistory}>

    <Route component={MainLayout}>
      <Route path="/" component={Home} />
    </Route>

    <Route component={MainLayout}>
      <Route path="/error" component={Error} />
    </Route>

    <Route component={MainLayout}>
      <Route path="*" component={NotFound} />
    </Route>

  </Router>
);
