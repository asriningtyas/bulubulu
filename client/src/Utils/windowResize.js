import { useEffect, useState } from "react";

export default function WindowResize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Function to update the windowSize state with the current window dimensions 
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add an event listener for the "resize" event 
    window.addEventListener("resize", updateWindowSize);

    // Remove the event listener when the component unmounts 
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []); // The empty dependency array ensures this effect runs only once, like componentDidMount 

  // Return the windowSize state, which contains the current window dimensions 
  return windowSize;
}