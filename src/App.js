import { connect } from 'react-redux';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { getUserAuth } from './actions';

import { Resource } from "./components/Resource/Resource";
import { Network } from "./components/Network/Network";
import { Notifications } from "./components/notifications/notifications";
import Profile  from "./components/Profile.jsx";

function App(props) {
  useEffect(() => {
    props.getUserAuth();
  }, []);
  
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/"><Login /></Route>
            <Route path="/home"><Navbar /><Home /></Route>
            <Route path="/resource"><Navbar /><Resource /></Route>
            <Route path="/notifications"><Navbar /><Notifications /></Route>
            <Route path="/network"><Navbar /><Network /></Route>
            <Route path="/profile"><Navbar /><Profile /></Route>
          </Switch>
        </Router>
      </div>
    );
  }
  
  const mapStateToProps = (state) => {
    return {};
  };
  
  const mapDispatchToProps = (dispatch) => ({
    getUserAuth: () => dispatch(getUserAuth()),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(App);
