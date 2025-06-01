import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Code2, Eye, EyeOff } from "lucide-react";

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = "python",
  title = "Algorithm Implementation",
  showLineNumbers = true,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const highlightSyntax = (line: string) => {
    const tokens: Array<{ text: string; type: string }> = [];

    const keywords =
      /\b(def|class|if|else|elif|for|while|import|from|return|try|except|finally|with|as|in|not|and|or|is|None|True|False|self|pass|break|continue|lambda|yield|global|nonlocal|assert|del|raise|async|await|function|const|let|var|catch|export|default|extends|super|this|new|typeof|instanceof|Promise|console|document|window)\b/g;

    const strings = /(["'`])((?:(?!\1)[^\\]|\\.)*)(\1)/g;

    const numbers = /\b\d+\.?\d*\b/g;

    const comments = /(#.*|\/\/.*|\/\*[\s\S]*?\*\/)/g;

    const allMatches: Array<{ match: RegExp; type: string }> = [
      { match: keywords, type: "keyword" },
      { match: strings, type: "string" },
      { match: numbers, type: "number" },
      { match: comments, type: "comment" },
    ];

    const matches: Array<{
      start: number;
      end: number;
      type: string;
      text: string;
    }> = [];

    allMatches.forEach(({ match, type }) => {
      match.lastIndex = 0;
      let result;
      while ((result = match.exec(line)) !== null) {
        matches.push({
          start: result.index,
          end: result.index + result[0].length,
          type,
          text: result[0],
        });
      }
    });

    let currentPos = 0;
    matches.forEach((match) => {
      if (match.start > currentPos) {
        tokens.push({
          text: line.slice(currentPos, match.start),
          type: "default",
        });
      }

      tokens.push({
        text: match.text,
        type: match.type,
      });

      currentPos = match.end;
    });

    if (currentPos < line.length) {
      tokens.push({
        text: line.slice(currentPos),
        type: "default",
      });
    }

    return tokens;
  };

  const getTokenClassName = (type: string) => {
    switch (type) {
      case "keyword":
        return "text-purple-400 font-semibold";
      case "string":
        return "text-emerald-400";
      case "number":
        return "text-amber-400";
      case "comment":
        return "text-gray-500 italic";
      default:
        return "text-slate-200";
    }
  };

  const lines = code.split("\n");

  return (
    <div
      className={`rounded-xl overflow-hidden glassmorphism-strong ${className}`}
    >
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <Code2 className="h-4 w-4 text-blue-400" />
          <span className="text-white/90 font-medium text-sm">{title}</span>
          <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
            {language}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-white/10 text-white/70"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 hover:bg-white/10 text-white/70 text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="relative">
          <div className="bg-slate-900 p-6 overflow-x-auto">
            <pre className="text-sm font-mono leading-relaxed">
              {lines.map((line, lineIndex) => {
                const tokens =
                  line.trim() === ""
                    ? [{ text: "\u00A0", type: "default" }]
                    : highlightSyntax(line);

                return (
                  <div key={lineIndex} className="flex">
                    {showLineNumbers && (
                      <span className="select-none text-slate-500 text-xs mr-4 w-8 text-right flex-shrink-0 leading-relaxed">
                        {lineIndex + 1}
                      </span>
                    )}
                    <code className="flex-1 leading-relaxed">
                      {tokens.map((token, tokenIndex) => (
                        <span
                          key={tokenIndex}
                          className={getTokenClassName(token.type)}
                        >
                          {token.text}
                        </span>
                      ))}
                    </code>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      )}

      {isMinimized && (
        <div className="px-4 py-3 bg-slate-800/30">
          <p className="text-white/50 text-sm">Code preview minimized</p>
        </div>
      )}
    </div>
  );
};

export default CodePreview;
