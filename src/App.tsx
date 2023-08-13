import { createCapture } from "./packages/cameraCapture";

function App() {
  const cameraInstance = createCapture({ foo: "some-config" });
  const foo = cameraInstance.getFoo();

  return (
    <>
      <h1>{foo}</h1>
    </>
  );
}

export default App;
