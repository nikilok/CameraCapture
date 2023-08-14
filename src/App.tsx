import React, { useRef } from "react";
import { createCapture } from "./packages/cameraCapture";
import {
  Container,
  ImageContainer,
  ImageCounterBadge,
  ImageShell,
  Video,
} from "./App.styled";

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
  const [urls, setUrls] = React.useState<string[]>([]);

  const beforeCaptureImageHandle = (shotNumber: number) => {
    console.log("Call back in application", shotNumber);

    setDarkMode(lightingPattern[shotNumber - 1] === 0);
  };

  const onImageCaptureHandle = (imageBitMap: ImageBitmap) => {
    const canvas = document.createElement("canvas");
    // Set the width and height of the canvas
    canvas.width = imageBitMap.width;
    canvas.height = imageBitMap.height;
    // Get the canvas context
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw the image bitmap on to the canvas
      ctx.drawImage(imageBitMap, 0, 0);
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        if (blob)
          if (imageBitMap instanceof ImageBitmap) {
            // Create an array of urls from the blob
            setUrls((url) => [...url, URL.createObjectURL(blob)]);
          }
      });
    }
  };

  // Effect that starts the media stream using startMediaStream
  React.useEffect(() => {
    startMediaStream()
      .then((mediaStream) => {
        if (videoElement.current && mediaStream) {
          videoElement.current.srcObject = mediaStream;
          videoElement.current.onloadedmetadata = () => {
            if (videoElement.current) videoElement.current.play();
          };
        }
        // Trigger captureImages to initiate image capturing from the stream
        captureImages({
          beforeCaptureImageHandle,
          durationInSeconds: 10,
          numberFramesToCapture: 20,
          onImageCaptureHandle,
        });
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
        <ImageContainer>
          {urls.map((url, index) => (
            <ImageShell>
              <img src={url} style={{ width: "100%" }} />
              <ImageCounterBadge>{index + 1}</ImageCounterBadge>
            </ImageShell>
          ))}
        </ImageContainer>
      </Container>
    </>
  );
}

export default App;
