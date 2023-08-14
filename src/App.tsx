import React, { useRef } from "react";
import { createCapture } from "./packages/cameraCapture";
import { Container, Video } from "./App.styled";

function App() {
  const { startMediaStream, captureImages } = createCapture({
    media: { idealCameraWidth: 1024, frontFacing: false },
  });
  // 0 = dark, 1 = light
  const lightingPattern = [
    0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
  ];
  const [darkMode, setDarkMode] = React.useState(lightingPattern[0] === 0);
  const videoElement = useRef<HTMLVideoElement>(null);

  const callBackFn = (shotNumber: number) => {
    console.log("Call back in application", shotNumber);

    setDarkMode(lightingPattern[shotNumber - 1] === 0);
  };

  React.useEffect(() => {
    console.log("Trigger starts here..");

    startMediaStream()
      .then((mediaStream) => {
        if (videoElement.current && mediaStream) {
          videoElement.current.srcObject = mediaStream;
          videoElement.current.onloadedmetadata = () => {
            if (videoElement.current) videoElement.current.play();
          };
        }
        captureImages(callBackFn, 10, 20);
      })
      .catch((err) => {
        console.error(`
        ----Application Error----
        ${err.name}: ${err.message}
        `);
      });
  }, []);

  return (
    <>
      <Container $darkMode={darkMode}>
        <h3>Camera Capture Demo</h3>
        <Video
          style={{ display: "block" }}
          ref={videoElement}
          width="450"
          controls
        />
      </Container>
    </>
  );
}

export default App;
