import os
import re
import subprocess
import tempfile
import uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from google import genai
import sys
import uvicorn

VIDEOS_DIR = "videos/"

try:
    import imageio_ffmpeg as ffmpeg
    ffmpeg_path = ffmpeg.get_ffmpeg_exe()
    os.environ['PATH'] = os.path.dirname(ffmpeg_path) + os.pathsep + os.environ['PATH']
except ImportError:
    pass

class GenerateCodeRequest(BaseModel):
    prompt: str

class GenerateVideoRequest(BaseModel):
    pythonCode: str

class Settings(BaseSettings):
    FRONTEND_URL: str
    GEMINI_API_KEY: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
app = FastAPI(debug=True)

client = genai.Client(api_key=settings.GEMINI_API_KEY)

origins = [
    settings.FRONTEND_URL,
    "https://algorithm-visualizer-manim.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

@app.get("/", status_code=status.HTTP_200_OK)
async def root() -> dict[str, str]:
    return {"message": "FastAPI Server!"}

@app.post("/code/generate", status_code=status.HTTP_201_CREATED)
async def generate_manim_code(request: GenerateCodeRequest) -> str:
    user_prompt = request.prompt

    system_prompt = f"""You are an expert in Manim (Mathematical Animation Engine) and data structures/algorithms. 
        Generate clean, working Manim code that visualizes the requested algorithm or data structure.
        
        Requirements:
        - Use Manim Community and Manim DSA Edition syntax
        - Use ONLY standard Manim imports (from manim import *)
        - DO NOT use manim_dsa or any external visualization libraries
        - Include proper imports from manim
        - Create a Scene class that inherits from Scene
        - Add clear animations and visual representations
        - Include comments explaining key steps
        - Make sure the code is executable
        - Use basic Manim objects like Rectangle, Circle, Text, VGroup, Arrow for visualizations
        - AVOID complex LaTeX formulas - use simple Text objects instead of MathTex when possible
        - If you need mathematical notation, use simple Tex() instead of complex MathTex()
        
        Algorithm Visualization Guidelines:
        - Implement the COMPLETE algorithm with proper logic and steps
        - Use proper spacing to avoid overlapping elements (minimum 1.5 units between objects)
        - Position elements clearly: arrays horizontally, trees with proper hierarchy
        - Use consistent color coding: RED for current/active elements, GREEN for sorted/final, BLUE for comparisons
        - Add step-by-step animations with self.wait(0.5) between major operations
        - Show indices, pointers, and current operations clearly
        - Include a title describing the current operation
        - Use VGroup to organize related elements and move them together
        - Scale elements appropriately (scale=0.8 for text, 0.7 for small elements)
        - Position elements within the visible frame: use UP*2, DOWN*2, LEFT*3, RIGHT*3 for positioning
        - For sorting algorithms: show comparisons, swaps, and final sorted state
        - For search algorithms: highlight the search process and found/not found states
        - For tree/graph algorithms: show node visits, path highlighting, and traversal order
        - Always complete the algorithm - don't stop halfway through
        - Add a final state showing the completed result
        
        Spacing and Layout Best Practices:
        - Arrays: space elements 1.2 units apart horizontally
        - Text labels: position 0.5 units above/below related elements
        - Multiple rows: space 2 units apart vertically
        - Pointers/arrows: use proper start and end points to avoid overlap
        - Use self.arrange() for VGroups to auto-space elements
        
        User request: {user_prompt}
        
        Respond with only the Python code, no explanations:"""
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=system_prompt
        )

        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate Manim code: {str(e)}")



def extract_scene_name(code: str) -> str | None:
    match = re.search(r"class\s+(\w+)\s*\(\s*Scene\s*\)\s*:", code)
    if match:
        return match.group(1)
    return None

@app.post("/video/generate", status_code=status.HTTP_201_CREATED)
async def generate_video(request: GenerateVideoRequest) -> dict[str, str]:
    video_id = str(uuid.uuid4())
    
    try:
        output_dir = Path(VIDEOS_DIR) / video_id
        output_dir.mkdir(parents=True, exist_ok=True)
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as temp_file:
            temp_file.write(request.pythonCode)
            temp_python_file = temp_file.name

        scene_name = extract_scene_name(request.pythonCode)
        if not scene_name:
            raise HTTPException(
                status_code=400,
                detail="No Scene class found in the provided code."
            )
        
        try:
            cmd = [
                sys.executable, "-m", "manim",
                temp_python_file,
                scene_name,
                "--media_dir", str(output_dir),
                "--quality", "m",
                "--format", "mp4",
                "--disable_caching",  
            ]
            
            env = os.environ.copy()
            env['PYTHONIOENCODING'] = 'utf-8'
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                encoding="utf-8", 
                timeout=120,
                shell=False,
                env=env
            )
            
            if result.returncode != 0:
                raise HTTPException(
                    status_code=500,
                    detail=f"Manim execution failed: {result.stderr}"
                )
            
            videos_path = output_dir / "videos"
            if not videos_path.exists():
                raise HTTPException(
                    status_code=500,
                    detail="Video output directory not found"
                )
            
            video_file = None
            for root, dirs, files in os.walk(videos_path):
                for file in files:
                    if file.endswith('.mp4'):
                        video_file = Path(root) / file
                        break
                if video_file:
                    break
            
            if not video_file or not video_file.exists():
                raise HTTPException(
                    status_code=500,
                    detail="Generated video file not found"
                )
            
            final_video_path = output_dir / f"{video_id}.mp4"
            video_file.rename(final_video_path)
            
            return {
                "video_id": video_id,
                "status": "success",
                "video_url": f"/video/{video_id}"
            }
            
        finally:
            if os.path.exists(temp_python_file):
                os.unlink(temp_python_file)
                
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=500,
            detail="Video generation timed out"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate video: {str(e)}"
        )

@app.get("/video/{video_id}")
async def get_video(video_id: str):
    video_path = Path(VIDEOS_DIR) / video_id / f"{video_id}.mp4"
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    
    return FileResponse(
        path=str(video_path),
        media_type="video/mp4",
        filename=f"{video_id}.mp4"
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
