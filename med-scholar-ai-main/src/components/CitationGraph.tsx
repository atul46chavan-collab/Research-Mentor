import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';

interface CitationResult {
  citation: string;
  status: "matched" | "missing" | "unused";
}

interface CitationGraphProps {
  citationResults: CitationResult[];
}

export const CitationGraph = ({ citationResults }: CitationGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphMethods>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Handle resizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: 400,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate mock graph data from citation strings
  const graphData = useMemo(() => {
    if (!citationResults || citationResults.length === 0) return { nodes: [], links: [] };

    const nodes = citationResults.map((r, i) => {
      const id = `paper_${i}`;
      // Basic extraction
      const parts = r.citation.split('. ');
      const authorMatch = parts[0] ? parts[0].split(' ')[0] : 'Unknown';
      const titleMatch = parts[1] ? parts[1].substring(0, 40) + "..." : r.citation.substring(0, 40) + "...";
      const yearMatch = r.citation.match(/(?:19|20)\d{2}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2023;
      
      return {
        id,
        title: titleMatch,
        author: authorMatch,
        year,
        citations: Math.floor(Math.random() * 80) + 10, // Simulated citation count for node size
        status: r.status // Used for coloring
      };
    });

    const links: any[] = [];
    
    // Create random connections mimicking citation network
    for (let i = 0; i < nodes.length; i++) {
      const numLinks = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numLinks; j++) {
          const targetIdx = Math.floor(Math.random() * nodes.length);
          if (targetIdx !== i && !links.find(l => l.source === nodes[i].id && l.target === nodes[targetIdx].id)) {
              links.push({
                  source: nodes[i].id,
                  target: nodes[targetIdx].id,
                  value: Math.random()
              });
          }
      }
    }

    return { nodes, links };
  }, [citationResults]);

  // Color mapping based on status
  const getColor = (status: string) => {
    if (status === 'matched') return '#22c55e'; // green
    if (status === 'missing') return '#ef4444'; // red
    if (status === 'unused') return '#f59e0b'; // amber
    return '#94a3b8';
  };

  // Node rendering format
  const getTooltip = (node: any) => {
    return `
      <div style="background: rgba(0, 0, 0, 0.85); padding: 12px; border-radius: 8px; color: white; border: 1px solid rgba(255,255,255,0.1); font-family: sans-serif; max-width: 250px;">
        <strong style="display: block; font-size: 14px; margin-bottom: 4px; line-height: 1.2;">${node.title}</strong>
        <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">${node.author} et al. (${node.year})</div>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 12px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${getColor(node.status)}"></span>
            <span style="text-transform: capitalize;">${node.status}</span>
            <span style="margin-left:auto; font-weight: bold; color: #93c5fd;">${node.citations} Citations</span>
        </div>
      </div>
    `;
  };

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  
  const updateHighlight = () => {
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
  };

  const handleNodeHover = (node: any) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      graphData.links.forEach((link: any) => {
        if (link.source.id === node.id || link.target.id === node.id) {
          highlightLinks.add(link);
          highlightNodes.add(link.source);
          highlightNodes.add(link.target);
        }
      });
    }
    updateHighlight();
  };

  const handleLinkHover = (link: any) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
    updateHighlight();
  };

  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Size based on citations
    const size = Math.max(3, Math.sqrt(node.citations) * 1.5);
    
    // Dim non-highlighted nodes if there's a highlight active
    const isActive = highlightNodes.size === 0 || highlightNodes.has(node);
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
    ctx.fillStyle = isActive ? getColor(node.status) : 'rgba(150, 150, 150, 0.2)';
    ctx.fill();
    
    if (isActive && highlightNodes.has(node)) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5 / globalScale;
        ctx.stroke();
    }
  }, [highlightNodes]);

  const paintLink = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isActive = highlightLinks.size === 0 || highlightLinks.has(link);
    const start = link.source;
    const end = link.target;
    
    if (typeof start !== 'object' || typeof end !== 'object') return; // Not yet initialized by force engine
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = isActive ? (highlightLinks.has(link) ? 'rgba(255, 255, 255, 0.6)' : 'rgba(150, 150, 150, 0.2)') : 'rgba(150, 150, 150, 0.05)';
    ctx.lineWidth = (isActive && highlightLinks.has(link) ? 2 : 1) / globalScale;
    ctx.stroke();
  }, [highlightLinks]);

  return (
    <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 border border-border">
      <ForceGraph2D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel={getTooltip}
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
        onNodeClick={(node) => {
            // Recenter on click
            if (graphRef.current) {
                graphRef.current.centerAt(node.x, node.y, 1000);
                graphRef.current.zoom(8, 2000);
            }
        }}
        onBackgroundClick={() => {
            if (graphRef.current) {
                graphRef.current.zoomToFit(400);
            }
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
};
