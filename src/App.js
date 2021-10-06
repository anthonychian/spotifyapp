import React from "react";
import "./App.css";
import Login from './components/Login'
import Dashboard from './components/Dashboard'

// 'URLSearchParams(window.location.search)' will get url string after the '?' & .get() will get the code value from the url
const code = new URLSearchParams(window.location.search).get('code')

function App() {
  return (
    <div className="app">
      {code ? <Dashboard code={code} /> : <Login />}
    </div>
  );
}

export default App;