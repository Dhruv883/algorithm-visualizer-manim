import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

const PREDEFINED_ALGORITHMS = [
  {
    label: "Binary Search",
    prompt:
      "Generate Manim code to visualize Binary Search on a sorted array of 10 integers. Animate the narrowing search interval, highlight the middle element each step, and indicate when the target is found or the search ends.",
  },
  {
    label: "Dijkstra's Algorithm",
    prompt:
      "Visualize Dijkstra's algorithm on a weighted graph with 5 nodes. Animate node visits, update tentative distances in a table, and highlight the shortest path found from a start to a target node.",
  },
  {
    label: "Merge Sort",
    prompt:
      "Animate Merge Sort on an array of 8 numbers. Show recursive splitting into subarrays, sorting of elements, and merging with comparisons highlighted. Use clear arrows and boxes for subarray visualization.",
  },
  {
    label: "Kruskal's Algorithm",
    prompt:
      "Visualize Kruskal’s algorithm on a weighted undirected graph with 6 nodes. Show edge sorting by weight, animate union-find steps, and highlight edges added to the MST in order.",
  },
  {
    label: "Quick Sort",
    prompt:
      "Animate Quick Sort on an array of 8 numbers. Show pivot selection, partitioning of elements into left/right subarrays, and recursive sorting steps. Highlight elements being compared and swapped.",
  },
  {
    label: "Prim's Algorithm",
    prompt:
      "Show Prim’s algorithm on a weighted undirected graph with 6 nodes. Animate MST growth from a start node, highlight edge weights, selected edges, and show cost updates as the tree expands.",
  },
  {
    label: "Breadth-First Search",
    prompt:
      "Visualize BFS traversal on a 6-node undirected graph. Animate queue operations, highlight visited nodes in traversal order, and show edges being explored with step-by-step updates.",
  },
  {
    label: "Ford-Fulkerson Algorithm (Max Flow)",
    prompt:
      "Animate the Ford-Fulkerson algorithm on a flow network with 5 nodes and 6 edges. Show each augmenting path via BFS/DFS, update edge capacities, and track total flow incrementally.",
  },
  {
    label: "Depth-First Search",
    prompt:
      "Visualize DFS traversal on a binary tree with 7 nodes. Animate recursive traversal path, backtracking, and highlight each node as it's visited, with arrows and labels for traversal direction.",
  },
  {
    label: "Floyd-Warshall Algorithm",
    prompt:
      "Show Floyd-Warshall on a weighted directed graph with 4 nodes. Animate step-by-step distance matrix updates, showing comparisons and changes at each iteration for all-pairs shortest paths.",
  },
  {
    label: "Topological Sort",
    prompt:
      "Animate Topological Sort on a DAG with 6 nodes. Show in-degree updates, node removal in order, and maintain a list of sorted nodes. Highlight current node and remaining graph structure.",
  },
  {
    label: "Suffix Array Construction",
    prompt:
      "Visualize suffix array construction for 'banana'. Show all suffixes, their lexicographical sorting, and the final array of starting indices. Highlight comparison of suffixes during sorting.",
  },
  {
    label: "Segment Tree (Range Sum Query)",
    prompt:
      "Animate the construction of a Segment Tree from an array of 6 integers. Show recursive building of nodes, then animate a range sum query by highlighting relevant segments used to compute the sum.",
  },
  {
    label: "Fenwick Tree (Binary Indexed Tree)",
    prompt:
      "Visualize a Fenwick Tree for prefix sums on an array of 8 elements. Show tree index mapping, and animate a value update and a prefix sum query by highlighting traversed indices in the BIT.",
  },
];

function getRandomAlgorithms(arr: typeof PREDEFINED_ALGORITHMS, n: number = 7) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  setPrompt?: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  setPrompt,
}) => {
  const randomAlgos = useMemo(
    () => getRandomAlgorithms(PREDEFINED_ALGORITHMS),
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isSubmitting) {
        onSubmit();
      }
    }
  };

  const handleBadgeClick = (prompt: string) => {
    if (setPrompt) setPrompt(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <textarea
          className="w-full rounded-2xl glassmorphism-strong p-6  min-h-[140px] text-lg transition-all resize-none placeholder:text-white/40 text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30"
          placeholder="Which algorithm would you like to visualize?"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          maxLength={300}
        />

        <div
          className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 rounded-xl glassmorphism cursor-pointer"
          onClick={onSubmit}
        >
          <img src="/icons/enter.svg" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {randomAlgos.map((algo) => (
          <Badge
            key={algo.label}
            className="px-4 py-1 rounded-full text-sm cursor-pointer"
            variant="secondary"
            onClick={() => handleBadgeClick(algo.prompt)}
          >
            {algo.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default PromptInput;
