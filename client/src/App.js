// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';

function App() {
  return ( 
    <section className="fakeso">
      <Router>
      <AuthProvider>
        <FakeStackOverflow/>
      </AuthProvider>
      </Router>
    </section>
  );
}

export default App;
