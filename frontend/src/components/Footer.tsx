const Footer = () => {
  return (
    <footer className="w-full h-10 flex flex-col items-center gap-2 text-sm text-white/70">
      <div className="flex items-center gap-4 mb-1">
        <a
          href="https://x.com/Dhruv0883"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <span className="text-3xl">&bull;</span>
        <a
          href="https://dhruvdedhia.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developer
        </a>
        <span className="text-3xl">&bull;</span>
        <a
          href="https://github.com/Dhruv883"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
