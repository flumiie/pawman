import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";

import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState<string | null>("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(greetMsg ? null : await invoke("greet", { name: "world" }));
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div>{greetMsg}</div>
      <Button
        onClick={() => {
          greet();
        }}
      >
        {greetMsg ? "Hide" : "Click me"}
      </Button>
    </div>
  );
}

export default App;
