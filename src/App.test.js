import React from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import './index.css';

function App() {
  const [showContact, setShowContact] = React.useState(false);

  if (showContact) {
    // A simple contact page view
    return (
      <div className="main-container">
        <a href="#" onClick={() => setShowContact(false)} className="nav-link">back</a>
        {/* You can add a more complex contact form component here */}
        <p>Contact me at: <a href="mailto:megiannilli@gmail.com">megiannilli@gmail.com</a></p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <img src="/logo.png" alt="Logo" className="logo" style={{ width: '100px' }} />
      <a href="#" onClick={() => setShowContact(true)} className="nav-link">let's chat</a>
      <p className="bottom-text">
        crafting digital experience that blend creativity with human knowledge crafting<br />
        digital experience that blend creativity with human knowledge
      </p>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;