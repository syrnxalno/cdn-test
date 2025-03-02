import { useState, useRef, useEffect } from "react";
import "./App.css"; // Ensure you have this CSS file
import logo from '../src/assets/logo.png';

function App() {
  const iframeRef = useRef(null);
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Load external CDN script when component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://cdn.jsdelivr.net/gh/syrnxalno/cdn-script-hosting@main/cdn-script1.js`
   //script.src = `https://raw.githubusercontent.com/syrnxalno/cdn-script-hosting/main/cdn-script.js?v=${Date.now()}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  // Function to send data to iframe
  const sendMessageToIframe = () => {
    if (iframeRef.current) {
      const iframeOrigin = "http://localhost:5174";
      iframeRef.current.contentWindow.postMessage(
        { type: "AUTH_SUCCESS", message: "User authenticated!" },
        iframeOrigin
      );
    }
  };

  // Function to handle login
  const handleLogin = () => {
    if (code.length === 6) {
      setAuthenticated(true);
      sendMessageToIframe();
    } else {
      alert("Enter a valid 6-digit code!");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <img src={logo} alt="Logo" className="logo" />

        {!authenticated ? (
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="input-field"
            />
            <button onClick={handleLogin} className="btn">
              Login
            </button>
          </div>
        ) : (
          <p className="success-message">Authenticated. Ready to send data to iframe</p>
        )}

        <iframe
          ref={iframeRef}
          src="http://localhost:5174"
          className="iframe"
          title="Embedded Iframe"
        />
      </div>
    </div>
  );
}

export default App;
