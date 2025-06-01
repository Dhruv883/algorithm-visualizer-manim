import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-between py-4 px-8">
      <span className="text-3xl font-cabinet-grotesk-extrabold">DrawAlgo</span>

      <span className="glassmorphism-strong p-2 rounded-xl">
        {/* <Sun className="h-6 w-6 text-white cursor-pointer" /> */}
        <Moon className="h-6 w-6 text-white cursor-pointer" />
      </span>
    </div>
  );
};

export default Navbar;
