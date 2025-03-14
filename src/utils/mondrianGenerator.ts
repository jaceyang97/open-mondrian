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
  if (prominentColor && palette.includes(prominentColor) && prominentColor !== palette[0]) {
    // Use the prominentColorBoost to determine if we should use the prominent color
    if (Math.random() < prominentColorBoost) {
      return prominentColor;
    }
  }
  
  // Pick a random color from the rest of the palette
  const index = getRandomInt(1, palette.length - 1);
  return palette[index];
};

// Function to find the largest cell in an array of cells
const findLargestCell = (cells: Cell[]): Cell => {
  return cells.reduce((largest, current) => {
    const largestArea = largest.width * largest.height;
    const currentArea = current.width * current.height;
    return currentArea > largestArea ? current : largest;
  }, cells[0]);
};

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
    return [{ ...cell, color: getRandomColor(config.colorPalette, config.colorProbability, config.prominentColor, config.prominentColorBoost) }];
  }

  // Decide whether to split into 2 or 4 parts
  // Higher chance of 4-way split for larger cells or at lower depths
  const shouldSplitFourWay = 
    (cell.width > config.minCellSize * 3 && 
     cell.height > config.minCellSize * 3 &&
     depth < config.maxDepth - 1 && 
     Math.random() < 0.4); // 40% chance for eligible cells
  
  if (shouldSplitFourWay) {
    // Split into 4 parts - first determine horizontal and vertical split points
    
    // Horizontal split - choose between 1/2 or 1/3 split
    const useOneThirdHSplit = Math.random() < 0.5; // 50% chance for 1/3 split
    const hSplitRatio = useOneThirdHSplit ? 
      (Math.random() < 0.5 ? 1/3 : 2/3) : // Either 1/3 or 2/3
      0.5; // 1/2 split
    
    const minX = cell.x + config.minCellSize;
    const maxX = cell.x + cell.width - config.minCellSize;
    const preferredHSplit = cell.x + Math.floor(cell.width * hSplitRatio);
    const splitX = Math.max(minX, Math.min(maxX, preferredHSplit));
    
    // Vertical split - choose between 1/2 or 1/3 split
    const useOneThirdVSplit = Math.random() < 0.5; // 50% chance for 1/3 split
    const vSplitRatio = useOneThirdVSplit ? 
      (Math.random() < 0.5 ? 1/3 : 2/3) : // Either 1/3 or 2/3
      0.5; // 1/2 split
    
    const minY = cell.y + config.minCellSize;
    const maxY = cell.y + cell.height - config.minCellSize;
    const preferredVSplit = cell.y + Math.floor(cell.height * vSplitRatio);
    const splitY = Math.max(minY, Math.min(maxY, preferredVSplit));
    
    // Create four new cells
    const topLeftCell: Cell = {
      x: cell.x,
      y: cell.y,
      width: splitX - cell.x,
      height: splitY - cell.y,
      color: ''
    };
    
    const topRightCell: Cell = {
      x: splitX,
      y: cell.y,
      width: cell.x + cell.width - splitX,
      height: splitY - cell.y,
      color: ''
    };
    
    const bottomLeftCell: Cell = {
      x: cell.x,
      y: splitY,
      width: splitX - cell.x,
      height: cell.y + cell.height - splitY,
      color: ''
    };
    
    const bottomRightCell: Cell = {
      x: splitX,
      y: splitY,
      width: cell.x + cell.width - splitX,
      height: cell.y + cell.height - splitY,
      color: ''
    };
    
    // Recursively split the new cells
    return [
      ...splitCell(topLeftCell, config, depth + 1),
      ...splitCell(topRightCell, config, depth + 1),
      ...splitCell(bottomLeftCell, config, depth + 1),
      ...splitCell(bottomRightCell, config, depth + 1)
    ];
  } else {
    // Decide whether to split horizontally or vertically
    // For more balanced compositions, consider the aspect ratio of the cell
    const aspectRatio = cell.width / cell.height;
    const splitHorizontally = aspectRatio > 1.3; // Prefer splitting horizontally if wider
    const splitVertically = aspectRatio < 0.7;   // Prefer splitting vertically if taller
    
    // If aspect ratio is close to 1 (square-ish), choose randomly
    const shouldSplitHorizontally = splitHorizontally || 
      (!splitVertically && Math.random() > 0.5);
    
    if (shouldSplitHorizontally) {
      // Choose between 1/2 or 1/3 split
      const useOneThirdSplit = Math.random() < 0.5; // 50% chance for 1/3 split
      const splitRatio = useOneThirdSplit ? 
        (Math.random() < 0.5 ? 1/3 : 2/3) : // Either 1/3 or 2/3
        0.5; // 1/2 split
      
      // Split position (ensure minimum cell size)
      const minX = cell.x + config.minCellSize;
      const maxX = cell.x + cell.width - config.minCellSize;
      const preferredSplit = cell.x + Math.floor(cell.width * splitRatio);
      
      // Ensure the split point is within valid range
      const splitX = Math.max(minX, Math.min(maxX, preferredSplit));
      
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
      // Choose between 1/2 or 1/3 split
      const useOneThirdSplit = Math.random() < 0.5; // 50% chance for 1/3 split
      const splitRatio = useOneThirdSplit ? 
        (Math.random() < 0.5 ? 1/3 : 2/3) : // Either 1/3 or 2/3
        0.5; // 1/2 split
      
      // Split position (ensure minimum cell size)
      const minY = cell.y + config.minCellSize;
      const maxY = cell.y + cell.height - config.minCellSize;
      const preferredSplit = cell.y + Math.floor(cell.height * splitRatio);
      
      // Ensure the split point is within valid range
      const splitY = Math.max(minY, Math.min(maxY, preferredSplit));
      
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
  let cells = splitCell(initialCell, config);
  
  // Ensure minimum number of splits based on complexity
  const minSplits = config.minSplits || 
    (config.maxDepth <= 2 ? 2 : 
     config.maxDepth >= 6 ? 10 : 5);
  
  // If we don't have enough cells, force more splits on the largest cells
  let attempts = 0;
  while (cells.length < minSplits && attempts < 10) {
    const largestCell = findLargestCell(cells);
    
    // Remove the largest cell from the array
    cells = cells.filter(cell => 
      cell.x !== largestCell.x || 
      cell.y !== largestCell.y || 
      cell.width !== largestCell.width || 
      cell.height !== largestCell.height
    );
    
    // Force split the largest cell and add the resulting cells
    const newCells = splitCell(
      { ...largestCell, color: '' }, // Reset color for splitting
      config,
      0, // Reset depth for this split
      true // Force split
    );
    
    cells = [...cells, ...newCells];
    attempts++;
  }
  
  // Ensure we have some colored cells based on complexity
  const coloredCellsCount = cells.filter(cell => cell.color !== config.colorPalette[0]).length;
  const minColoredCells = Math.max(1, Math.floor(minSplits * config.colorProbability * 0.8));
  
  if (coloredCellsCount < minColoredCells) {
    // Sort cells by size (largest first)
    const sortedCells = [...cells].sort((a, b) => 
      (b.width * b.height) - (a.width * a.height)
    );
    
    // Force color some of the larger cells
    for (let i = 0; i < Math.min(minColoredCells, sortedCells.length); i++) {
      if (sortedCells[i].color === config.colorPalette[0]) {
        // Find this cell in our original array
        const cellIndex = cells.findIndex(cell => 
          cell.x === sortedCells[i].x && 
          cell.y === sortedCells[i].y && 
          cell.width === sortedCells[i].width && 
          cell.height === sortedCells[i].height
        );
        
        if (cellIndex !== -1) {
          // Pick a random non-white color
          const colorIndex = getRandomInt(1, config.colorPalette.length - 1);
          cells[cellIndex].color = config.colorPalette[colorIndex];
        }
      }
    }
  }
  
  return cells;
}; 