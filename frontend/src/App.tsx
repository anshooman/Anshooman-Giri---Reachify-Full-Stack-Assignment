import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ItemList from './components/ItemList';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/items" component={ItemList} />
            <Redirect from="/" to="/items" />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute: React.FC<{ component: React.ComponentType<any>; path: string }> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default App;

