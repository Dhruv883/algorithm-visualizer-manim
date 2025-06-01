import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Code } from "lucide-react";
import VideoPreview from "@/components/VideoPreview";
import CodePreview from "./CodePreview";

interface Preview {
  animationCode: string;
  videoUrl: string;
}

const Preview: React.FC<Preview> = ({ animationCode, videoUrl }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="video" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-neutral-900 border border-neutral-700">
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Video Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="data-[state=active]:bg-white data-[state=active]:text-black text-white flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Python Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="mt-6">
          <div className="bg-neutral-900 rounded-xl border border-neutral-700 overflow-hidden">
            <VideoPreview videoUrl={videoUrl} />
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          <CodePreview code={animationCode} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Preview;
