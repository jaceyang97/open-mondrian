// Types for Open Mondrian
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
  minSplits?: number; // Minimum number of splits to ensure
  partialLinesProbability: number; // Probability of creating partial lines
  prominentColor?: string; // The color that should appear more frequently
  prominentColorBoost: number; // How much to boost the prominent color (0-1)
}

export interface Cell {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

// Format presets
export const formatPresets = {
  square: { width: 800, height: 800 },
  landscape: { width: 900, height: 600 },
  widescreen: { width: 960, height: 540 }
};

// Complexity presets
export const complexityPresets = {
  low: { minCellSize: 100, maxDepth: 3, splitProb: 0.7, minSplits: 6 },
  medium: { minCellSize: 70, maxDepth: 4, splitProb: 0.7, minSplits: 10 },
  high: { minCellSize: 40, maxDepth: 5, splitProb: 0.8, minSplits: 15 }
};

// Muted color palette
export const mutedColors = {
  white: '#FFFFFF',
  yellow: '#E6C700',
  red: '#D13C37',
  blue: '#3755A1',
  black: '#333333',
  orange: '#E67E22',
  purple: '#9B59B6',
  cyan: '#3498DB',
  green: '#27AE60'
};

// Default configuration
export const defaultConfig: MondrianConfig = {
  canvasWidth: formatPresets.square.width,
  canvasHeight: formatPresets.square.height,
  minCellSize: complexityPresets.low.minCellSize,
  maxCellSize: 200,
  lineThickness: 8, // Medium thickness
  lineColor: mutedColors.black,
  colorPalette: [
    mutedColors.white, 
    mutedColors.red, 
    '#3755A1', // Explicitly use the hex value for blue
    mutedColors.yellow, 
    mutedColors.black
  ],
  colorProbability: 0.4, // Medium color amount
  splitProbability: complexityPresets.low.splitProb,
  maxDepth: complexityPresets.low.maxDepth,
  minSplits: complexityPresets.low.minSplits,
  partialLinesProbability: 0.4, // 40% chance of creating partial lines
  prominentColor: undefined,
  prominentColorBoost: 0.5
};

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get a random color from the palette
const getRandomColor = (palette: string[], colorProbability: number, prominentColor?: string, prominentColorBoost: number = 0.5): string => {
  // First color in palette is considered the background/default color
  if (Math.random() > colorProbability) {
    return palette[0]; // Default color (usually white)
  }
  
  // If a prominent color is set and it's in the palette (not the background color)
  if (prominentColor && prominentColor !== palette[0] && Math.random() < prominentColorBoost) {
    return prominentColor;
  }
  
  // Pick a random color from the rest of the palette
  const index = getRandomInt(1, palette.length - 1);
  return palette[index];
};

// Function to find the largest cell in an array of cells
const findLargestCell = (cells: Cell[]): Cell => {
  let maxArea = 0;
  let largestCell = cells[0];
  
  for (const cell of cells) {
    const area = cell.width * cell.height;
    if (area > maxArea) {
      maxArea = area;
      largestCell = cell;
    }
  }
  
  return largestCell;
};

// Helper function to create a cell
const createCell = (x: number, y: number, width: number, height: number, color: string = ''): Cell => ({
  x, y, width, height, color
});

// Function to split a cell horizontally or vertically
const splitCell = (
  cell: Cell, 
  config: MondrianConfig, 
  depth: number = 0,
  forceSplit: boolean = false
): Cell[] => {
  // Base case: if cell is too small or we've reached max depth, don't split
  if (
    !forceSplit && (
      depth >= config.maxDepth || 
      cell.width < config.minCellSize * 1.5 || 
      cell.height < config.minCellSize * 1.5 ||
      Math.random() > config.splitProbability
    )
  ) {
    cell.color = getRandomColor(config.colorPalette, config.colorProbability, config.prominentColor, config.prominentColorBoost);
    return [cell];
  }

  // Pre-calculate common values
  const minCellSize3x = config.minCellSize * 3;
  const shouldSplitFourWay = 
    cell.width > minCellSize3x && 
    cell.height > minCellSize3x &&
    depth < config.maxDepth - 1 && 
    Math.random() < 0.4;
  
  if (shouldSplitFourWay) {
    // Calculate split points once
    const hSplitRatio = Math.random() < 0.5 ? 
      (Math.random() < 0.5 ? 1/3 : 2/3) : 
      0.5;
    
    const vSplitRatio = Math.random() < 0.5 ? 
      (Math.random() < 0.5 ? 1/3 : 2/3) : 
      0.5;
    
    const minX = cell.x + config.minCellSize;
    const maxX = cell.x + cell.width - config.minCellSize;
    const minY = cell.y + config.minCellSize;
    const maxY = cell.y + cell.height - config.minCellSize;
    
    const splitX = Math.max(minX, Math.min(maxX, cell.x + Math.floor(cell.width * hSplitRatio)));
    const splitY = Math.max(minY, Math.min(maxY, cell.y + Math.floor(cell.height * vSplitRatio)));
    
    // Create four cells at once
    const cells = [
      createCell(cell.x, cell.y, splitX - cell.x, splitY - cell.y),
      createCell(splitX, cell.y, cell.x + cell.width - splitX, splitY - cell.y),
      createCell(cell.x, splitY, splitX - cell.x, cell.y + cell.height - splitY),
      createCell(splitX, splitY, cell.x + cell.width - splitX, cell.y + cell.height - splitY)
    ];
    
    // Recursively split all cells
    return cells.reduce((acc, c) => [...acc, ...splitCell(c, config, depth + 1)], [] as Cell[]);
  } else {
    // Calculate aspect ratio once
    const aspectRatio = cell.width / cell.height;
    const shouldSplitHorizontally = aspectRatio > 1.3 || 
      (aspectRatio >= 0.7 && Math.random() > 0.5);
    
    // Calculate split ratio once
    const splitRatio = Math.random() < 0.5 ? 
      (Math.random() < 0.5 ? 1/3 : 2/3) : 
      0.5;
    
    if (shouldSplitHorizontally) {
      const minX = cell.x + config.minCellSize;
      const maxX = cell.x + cell.width - config.minCellSize;
      const splitX = Math.max(minX, Math.min(maxX, cell.x + Math.floor(cell.width * splitRatio)));
      
      const cells = [
        createCell(cell.x, cell.y, splitX - cell.x, cell.height),
        createCell(splitX, cell.y, cell.x + cell.width - splitX, cell.height)
      ];
      
      return cells.reduce((acc, c) => [...acc, ...splitCell(c, config, depth + 1)], [] as Cell[]);
    } else {
      const minY = cell.y + config.minCellSize;
      const maxY = cell.y + cell.height - config.minCellSize;
      const splitY = Math.max(minY, Math.min(maxY, cell.y + Math.floor(cell.height * splitRatio)));
      
      const cells = [
        createCell(cell.x, cell.y, cell.width, splitY - cell.y),
        createCell(cell.x, splitY, cell.width, cell.y + cell.height - splitY)
      ];
      
      return cells.reduce((acc, c) => [...acc, ...splitCell(c, config, depth + 1)], [] as Cell[]);
    }
  }
};

// Main function to generate a Mondrian composition
export const generateMondrian = (config: MondrianConfig = defaultConfig): Cell[] => {
  // Start with a single cell
  let cells = splitCell(createCell(0, 0, config.canvasWidth, config.canvasHeight), config);
  
  // Ensure minimum number of splits based on complexity
  const minSplits = config.minSplits || 
    (config.maxDepth <= 2 ? 2 : config.maxDepth >= 6 ? 10 : 5);
  
  // If we don't have enough cells, force more splits on the largest cells
  let attempts = 0;
  const maxAttempts = 10;
  
  while (cells.length < minSplits && attempts < maxAttempts) {
    const largestCell = findLargestCell(cells);
    const largestCellIndex = cells.findIndex(cell => 
      cell.x === largestCell.x && 
      cell.y === largestCell.y && 
      cell.width === largestCell.width && 
      cell.height === largestCell.height
    );
    
    // Split the largest cell
    const newCells = splitCell(
      { ...largestCell, color: '' },
      config,
      0,
      true
    );
    
    // Replace the largest cell with new cells
    cells.splice(largestCellIndex, 1, ...newCells);
    attempts++;
  }
  
  // Get non-white colors once
  const selectedColors = config.colorPalette.filter(color => color !== '#FFFFFF');
  
  if (selectedColors.length > 0) {
    // Color all cells at once
    cells.forEach(cell => {
      cell.color = getRandomColor(config.colorPalette, config.colorProbability, config.prominentColor, config.prominentColorBoost);
    });
    
    // Track missing colors
    const usedColors = new Set(cells.map(cell => cell.color));
    const missingColors = selectedColors.filter(color => !usedColors.has(color));
    
    // Handle missing colors
    if (missingColors.length > 0) {
      // Get all white cells once
      const whiteCellIndices = cells.reduce((acc, cell, index) => {
        if (cell.color === '#FFFFFF') acc.push(index);
        return acc;
      }, [] as number[]);
      
      // Assign missing colors to random white cells
      missingColors.forEach(color => {
        if (whiteCellIndices.length > 0) {
          const randomWhiteCellIndex = whiteCellIndices.splice(
            Math.floor(Math.random() * whiteCellIndices.length), 
            1
          )[0];
          cells[randomWhiteCellIndex].color = color;
        }
      });
    }
  }
  
  return cells;
}; 