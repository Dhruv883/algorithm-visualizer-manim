import { useState } from "react";
import Navbar from "@/components/Navbar";
import PromptInput from "@/components/PromptInput";
import LoadingState from "@/components/LoadingState";
import Footer from "@/components/Footer";
import axios from "axios";
import Preview from "@/components/Preview";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState<
    "idle" | "processing" | "generating" | "rendering" | "complete"
  >("idle");
  const [animationCode, setAnimationCode] = useState("");

  const [videoUrl, setVideoUrl] = useState("");

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    setStage("processing");

    try {
      setStage("generating");
      const codeResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/code/generate`,
        {
          prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const pythonCode = codeResponse.data.replace(/```python|```/g, "").trim();
      setAnimationCode(pythonCode);

      setStage("rendering");

      const videoResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/video/generate`,
        {
          pythonCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const fullVideoUrl = `${import.meta.env.VITE_BACKEND_URL}${
        videoResponse.data.video_url
      }`;
      setVideoUrl(fullVideoUrl);

      setStage("complete");
    } catch (error) {
      console.error("Error generating video:", error);
      // Handle error state here
      setStage("idle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-cabinet-grotesk bg-black text-white min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="bg-black flex flex-col gap-10 justify-center items-center h-full">
        {stage === "idle" && (
          <>
            <div className="text-5xl font-cabinet-grotesk-extrabold">
              Which algorithm do you want to visualize?
            </div>

            <PromptInput
              value={prompt}
              onChange={handlePromptChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              setPrompt={setPrompt}
            />
          </>
        )}

        {(stage === "processing" ||
          stage === "generating" ||
          stage === "rendering") && <LoadingState stage={stage} />}

        {stage === "complete" && (
          <div className="space-y-12 animate-fade-in py-8">
            <PromptInput
              value={prompt}
              onChange={handlePromptChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              setPrompt={setPrompt}
            />

            <Preview animationCode={animationCode} videoUrl={videoUrl} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
