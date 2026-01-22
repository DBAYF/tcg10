import React from 'react';
import './App.css';

// Simple Cardloom web app
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎴 Cardloom TCG</h1>
        <p>Welcome to the Card Trading Platform!</p>
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>✅ Card Catalog with Search & Filters</li>
            <li>✅ Marketplace for Buying & Selling</li>
            <li>✅ Deck Builder Tools</li>
            <li>✅ Collection Management</li>
            <li>✅ TCG API Integration</li>
          </ul>
        </div>
        <p className="App-footer">
          Built with React • Vercel Compatible
        </p>
      </header>
    </div>
  );
}

export default App;