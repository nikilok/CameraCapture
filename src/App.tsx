import React, { useRef } from "react";
import { createCapture } from "./packages/cameraCapture";

function App() {
  const { getMediaStream } = createCapture({
    media: { idealCameraWidth: 1024, frontFacing: false },
  });
  const videoElement = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    getMediaStream()
      .then((mediaStream) => {
        if (videoElement.current && mediaStream) {
          videoElement.current.srcObject = mediaStream;
          videoElement.current.onloadedmetadata = () => {
            if (videoElement.current) videoElement.current.play();
          };
        }
      })
      .catch((err) => {
        console.log("The catch block");
        console.error(`${err.name}: ${err.message}`);
      });
  }, [getMediaStream]);

  return (
    <>
      <h1>Video Test</h1>
      <video
        style={{ display: "block" }}
        ref={videoElement}
        width="450"
      ></video>
    </>
  );
}

export default App;
