import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Cell, MondrianConfig } from '../utils/mondrianGenerator';

interface MondrianCanvasProps {
  cells: Cell[];
  config: MondrianConfig;
}

const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Canvas = styled.canvas`
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MondrianCanvas: React.FC<MondrianCanvasProps> = ({ cells, config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Draw cells
    cells.forEach(cell => {
      // Draw cell background
      ctx.fillStyle = cell.color;
      ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
    });

    // Draw grid lines (on top of cells)
    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = config.lineThickness;

    // Draw horizontal lines
    const horizontalLines = new Set<number>();
    cells.forEach(cell => {
      horizontalLines.add(cell.y);
      horizontalLines.add(cell.y + cell.height);
    });

    horizontalLines.forEach(y => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(config.canvasWidth, y);
      ctx.stroke();
    });

    // Draw vertical lines
    const verticalLines = new Set<number>();
    cells.forEach(cell => {
      verticalLines.add(cell.x);
      verticalLines.add(cell.x + cell.width);
    });

    verticalLines.forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, config.canvasHeight);
      ctx.stroke();
    });
  }, [cells, config]);

  return (
    <CanvasContainer>
      <Canvas 
        ref={canvasRef} 
        width={config.canvasWidth} 
        height={config.canvasHeight} 
      />
    </CanvasContainer>
  );
};

export default MondrianCanvas; 