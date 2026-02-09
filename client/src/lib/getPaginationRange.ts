export function getPaginationRange(currPage: number, pageLength: number, maxWindow: number): number[] {
  
  // Calculate the start and end of the window
  let start = Math.max(1, currPage - Math.floor(maxWindow / 2));
  let end = Math.min(pageLength, start + maxWindow - 1);
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxWindow) {
    start = Math.max(1, end - maxWindow + 1);
  }
  
  // Generate array of page numbers
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
}