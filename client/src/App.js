// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import { BrowserRouter as Router} from 'react-router-dom';

function App() {
  return ( 
    <section className="fakeso">
      <Router>
        <FakeStackOverflow />
      </Router>
    </section>
  );
}

export default App;
