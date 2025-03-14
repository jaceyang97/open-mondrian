// Types for Mondrian generator
export interface MondrianConfig {
  canvasWidth: number;
  canvasHeight: number;
  minCellSize: number;
  maxCellSize: number;
  lineThickness: number;
  lineColor: string;
  colorPalette: string[];
  colorProbability: number; // Probability of a cell being colored (0-1)
  splitProbability: number; // Probability of splitting a cell (0-1)
  maxDepth: number; // Maximum recursion depth for splitting
}

export interface Cell {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

// Default configuration
export const defaultConfig: MondrianConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  minCellSize: 50,
  maxCellSize: 200,
  lineThickness: 8,
  lineColor: '#000000',
  colorPalette: ['#FFFFFF', '#FF0000', '#0000FF', '#FFFF00'],
  colorProbability: 0.3,
  splitProbability: 0.7,
  maxDepth: 5
};

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get a random color from the palette
const getRandomColor = (palette: string[], colorProbability: number): string => {
  // First color in palette is considered the background/default color
  if (Math.random() > colorProbability) {
    return palette[0]; // Default color (usually white)
  }
  
  // Pick a random color from the rest of the palette
  const index = getRandomInt(1, palette.length - 1);
  return palette[index];
};

// Function to split a cell horizontally or vertically
const splitCell = (
  cell: Cell, 
  config: MondrianConfig, 
  depth: number = 0
): Cell[] => {
  // Base case: if cell is too small or we've reached max depth, don't split
  if (
    depth >= config.maxDepth || 
    cell.width < config.minCellSize * 2 || 
    cell.height < config.minCellSize * 2 ||
    Math.random() > config.splitProbability
  ) {
    return [{ ...cell, color: getRandomColor(config.colorPalette, config.colorProbability) }];
  }

  // Decide whether to split horizontally or vertically
  const splitHorizontally = cell.width > cell.height;
  
  if (splitHorizontally) {
    // Split position (ensure minimum cell size)
    const minX = cell.x + config.minCellSize;
    const maxX = cell.x + cell.width - config.minCellSize;
    const splitX = getRandomInt(minX, maxX);
    
    // Create two new cells
    const leftCell: Cell = {
      x: cell.x,
      y: cell.y,
      width: splitX - cell.x,
      height: cell.height,
      color: ''
    };
    
    const rightCell: Cell = {
      x: splitX,
      y: cell.y,
      width: cell.x + cell.width - splitX,
      height: cell.height,
      color: ''
    };
    
    // Recursively split the new cells
    return [
      ...splitCell(leftCell, config, depth + 1),
      ...splitCell(rightCell, config, depth + 1)
    ];
  } else {
    // Split position (ensure minimum cell size)
    const minY = cell.y + config.minCellSize;
    const maxY = cell.y + cell.height - config.minCellSize;
    const splitY = getRandomInt(minY, maxY);
    
    // Create two new cells
    const topCell: Cell = {
      x: cell.x,
      y: cell.y,
      width: cell.width,
      height: splitY - cell.y,
      color: ''
    };
    
    const bottomCell: Cell = {
      x: cell.x,
      y: splitY,
      width: cell.width,
      height: cell.y + cell.height - splitY,
      color: ''
    };
    
    // Recursively split the new cells
    return [
      ...splitCell(topCell, config, depth + 1),
      ...splitCell(bottomCell, config, depth + 1)
    ];
  }
};

// Main function to generate a Mondrian composition
export const generateMondrian = (config: MondrianConfig = defaultConfig): Cell[] => {
  // Start with a single cell representing the entire canvas
  const initialCell: Cell = {
    x: 0,
    y: 0,
    width: config.canvasWidth,
    height: config.canvasHeight,
    color: ''
  };
  
  // Split the initial cell recursively
  return splitCell(initialCell, config);
}; 