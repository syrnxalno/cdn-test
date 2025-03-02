import { useState, useRef, useEffect } from "react";
import "./App.css";
import logo from '../src/assets/logo.png';

function App() {
  const iframeRef = useRef(null);
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [parentMessage, setParentMessage] = useState("Hi User"); // Default message

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://cdn.jsdelivr.net/gh/syrnxalno/cdn-script-hosting@main/cdn-script1.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = () => {
    if (code.length === 6) {
      setAuthenticated(true);
      console.log("User authenticated!");
    } else {
      alert("Enter a valid 6-digit code!");
    }
  };

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:5174") return; // Validate origin

      if (event.data.type === "REQUEST_DATA") {
        console.log("Parent received data request from iframe");
        sendMessageToIframe();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendMessageToIframe = () => {
    if (iframeRef.current) {
      const iframeOrigin = "http://localhost:5174";
      iframeRef.current.contentWindow.postMessage(
        { type: "DATA_RESPONSE", message: parentMessage },
        iframeOrigin
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <img src={logo} alt="Logo" className="logo" />

        {/* Display parent message */}
        <p className="success-message">{parentMessage}</p>

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
          <p className="success-message">Authenticated. Ready to communicate with iframe.</p>
        )}

        <iframe
          ref={iframeRef}
          src="https://iframe-app-gamma.vercel.app/"
          className="iframe"
          title="Embedded Iframe"
        />
      </div>
    </div>
  );
}

export default App;
