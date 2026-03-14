/**
 * Utility for medical citation checking
 */

export const checkCitations = (text, references) => {
  // Regex patterns for common medical citation formats
  const patterns = {
    parenthetical: /\(([^)]+),\s*(\d{4})\)/g, // (Author, Year)
    narrative: /([A-Z][a-z]+)\s*\((\d{4})\)/g, // Author (Year)
    numeric: /\[(\d+)\]/g,                     // [1]
  };

  const detectedCitations = [];
  let match;

  // 1. Detect Parenthetical Citations: (Author, 2023)
  while ((match = patterns.parenthetical.exec(text)) !== null) {
    detectedCitations.push({
      full: match[0],
      author: match[1].trim(),
      year: match[2],
      type: 'parenthetical'
    });
  }

  // 2. Detect Narrative Citations: Sharma (2023)
  while ((match = patterns.narrative.exec(text)) !== null) {
    detectedCitations.push({
      full: match[0],
      author: match[1].trim(),
      year: match[2],
      type: 'narrative'
    });
  }

  // 3. Detect Numeric Citations: [1]
  while ((match = patterns.numeric.exec(text)) !== null) {
    detectedCitations.push({
      full: match[0],
      index: match[1],
      type: 'numeric'
    });
  }

  // Cross-reference logic
  const matched = [];
  const missing = [];
  const referencesText = references.join(' ').toLowerCase();

  detectedCitations.forEach(cite => {
    let isMatched = false;
    
    if (cite.type === 'numeric') {
       // Check if the reference list has enough items for the index
       isMatched = parseInt(cite.index) <= references.length;
    } else {
       // Check if author and year appear together in a reference string
       isMatched = references.some(ref => 
         ref.toLowerCase().includes(cite.author.toLowerCase()) && 
         ref.includes(cite.year)
       );
    }

    if (isMatched) {
      matched.push(cite);
    } else {
      missing.push(cite);
    }
  });

  // Find uncited references (references that don't match any detected citation)
  const uncited = references.filter(ref => {
    return !detectedCitations.some(cite => {
      if (cite.type === 'numeric') return false; // Hard to trace back numeric exactly without full parsing
      return ref.toLowerCase().includes(cite.author.toLowerCase()) && ref.includes(cite.year);
    });
  });

  return {
    statistics: {
      total_citations: detectedCitations.length,
      matched_count: matched.length,
      missing_count: missing.length,
      uncited_references_count: uncited.length
    },
    matched_citations: matched,
    missing_references: missing,
    uncited_references: uncited
  };
};
