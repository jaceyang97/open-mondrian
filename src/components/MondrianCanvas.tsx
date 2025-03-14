import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Cell, MondrianConfig } from '../utils/mondrianGenerator';
import { useLanguage } from '../contexts/LanguageContext';

interface MondrianCanvasProps {
  cells: Cell[];
  config: MondrianConfig;
}

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: auto;
  }
`;

const Canvas = styled.canvas`
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-height: none;
    width: auto;
    height: auto;
    max-width: 100%;
    object-fit: contain;
  }
`;

const CanvasControls = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  position: relative;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #333;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const InfoTooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: -10px;
  left: 0;
  transform: translateY(-100%);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 300px;
  max-width: 400px;
  display: ${props => props.visible ? 'block' : 'none'};
  text-align: left;
  color: #333;
  font-size: 0.9rem;
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
`;

const InfoRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const InfoLabel = styled.td`
  padding: 6px 0;
  font-weight: 500;
  color: #555;
  width: 40%;
`;

const InfoValue = styled.td`
  padding: 6px 0;
  color: #333;
`;

const InfoTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const MondrianCanvas: React.FC<MondrianCanvasProps> = ({ cells, config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const { t, language } = useLanguage();

  // Function to render the canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;
    
    // For mobile, adjust the display size while maintaining the internal resolution
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const containerWidth = canvas.parentElement?.clientWidth || window.innerWidth - 20;
      const scale = Math.min(0.8, containerWidth / config.canvasWidth);
      canvas.style.width = `${config.canvasWidth * scale}px`;
      canvas.style.height = `${config.canvasHeight * scale}px`;
      canvas.style.maxHeight = 'none';
    }

    // Set canvas background to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Create a map to track which edges have been drawn
    const drawnEdges = new Map();
    const getEdgeKey = (x1: number, y1: number, x2: number, y2: number) => {
      // Normalize the edge coordinates to ensure uniqueness
      return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)].join(',');
    };

    // First, draw all cell backgrounds
    cells.forEach(cell => {
      if (cell.color !== '#FFFFFF') { // Skip white cells (already set as background)
        ctx.fillStyle = cell.color;
        ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
      }
    });
    
    // Set up line style
    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = config.lineThickness;
    
    // Draw borders for each cell
    cells.forEach(cell => {
      const x1 = cell.x;
      const y1 = cell.y;
      const x2 = cell.x + cell.width;
      const y2 = cell.y + cell.height;
      
      // Draw top edge if not already drawn
      const topEdgeKey = getEdgeKey(x1, y1, x2, y1);
      if (!drawnEdges.has(topEdgeKey)) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.stroke();
        drawnEdges.set(topEdgeKey, true);
      }
      
      // Draw right edge if not already drawn
      const rightEdgeKey = getEdgeKey(x2, y1, x2, y2);
      if (!drawnEdges.has(rightEdgeKey)) {
        ctx.beginPath();
        ctx.moveTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        drawnEdges.set(rightEdgeKey, true);
      }
      
      // Draw bottom edge if not already drawn
      const bottomEdgeKey = getEdgeKey(x1, y2, x2, y2);
      if (!drawnEdges.has(bottomEdgeKey)) {
        ctx.beginPath();
        ctx.moveTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        drawnEdges.set(bottomEdgeKey, true);
      }
      
      // Draw left edge if not already drawn
      const leftEdgeKey = getEdgeKey(x1, y1, x1, y2);
      if (!drawnEdges.has(leftEdgeKey)) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.stroke();
        drawnEdges.set(leftEdgeKey, true);
      }
    });
  }, [cells, config]);

  // Render the canvas whenever cells or config changes
  useEffect(() => {
    renderCanvas();
    
    // Add resize event listener
    const handleResize = () => {
      renderCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderCanvas]);

  // Format color palette for display
  const formatColorPalette = (palette: string[]) => {
    // Filter out white (background color)
    const colors = palette.filter(color => color !== '#FFFFFF');
    if (colors.length === 0) return 'None';
    
    return colors.map(color => {
      // Get color name based on hex value
      let name = '';
      if (color === '#E6C700') name = language === 'en' ? 'Yellow' : '黄色';
      else if (color === '#D13C37') name = language === 'en' ? 'Red' : '红色';
      else if (color === '#3755A1' || color === '#0A3B78' || color === '#1E5AA8') name = language === 'en' ? 'Blue' : '蓝色';
      else if (color === '#333333') name = language === 'en' ? 'Black' : '黑色';
      else if (color === '#E67E22') name = language === 'en' ? 'Orange' : '橙色';
      else if (color === '#9B59B6') name = language === 'en' ? 'Purple' : '紫色';
      else if (color === '#3498DB') name = language === 'en' ? 'Cyan' : '青色';
      else if (color === '#27AE60') name = language === 'en' ? 'Green' : '绿色';
      else name = color; // Use hex if no name match
      
      return name;
    }).join(', ');
  };

  // Format a single color name
  const formatColorName = (color: string): string => {
    if (color === '#E6C700') return language === 'en' ? 'Yellow' : '黄色';
    if (color === '#D13C37') return language === 'en' ? 'Red' : '红色';
    if (color === '#3755A1' || color === '#0A3B78' || color === '#1E5AA8') return language === 'en' ? 'Blue' : '蓝色';
    if (color === '#333333') return language === 'en' ? 'Black' : '黑色';
    if (color === '#E67E22') return language === 'en' ? 'Orange' : '橙色';
    if (color === '#9B59B6') return language === 'en' ? 'Purple' : '紫色';
    if (color === '#3498DB') return language === 'en' ? 'Cyan' : '青色';
    if (color === '#27AE60') return language === 'en' ? 'Green' : '绿色';
    return color; // Use hex if no name match
  };

  // Format complexity level
  const getComplexityLevel = () => {
    if (config.minCellSize >= 100 && config.maxDepth <= 3) return language === 'en' ? 'Low' : '低';
    if (config.minCellSize <= 50 && config.maxDepth >= 5) return language === 'en' ? 'High' : '高';
    return language === 'en' ? 'Medium' : '中';
  };

  // Format line thickness
  const getLineThickness = () => {
    if (config.lineThickness <= 4) return language === 'en' ? 'Thin' : '细';
    if (config.lineThickness >= 12) return language === 'en' ? 'Thick' : '粗';
    return language === 'en' ? 'Medium' : '中等';
  };

  // Format color amount
  const getColorAmount = () => {
    if (config.colorProbability <= 0.25) return language === 'en' ? 'Low' : '低';
    if (config.colorProbability >= 0.6) return language === 'en' ? 'High' : '高';
    return language === 'en' ? 'Medium' : '中等';
  };

  // Format aspect ratio
  const getAspectRatio = () => {
    const ratio = config.canvasWidth / config.canvasHeight;
    if (Math.abs(ratio - 1) < 0.1) return language === 'en' ? '1:1 (Square)' : '1:1 (正方形)';
    if (Math.abs(ratio - 1.5) < 0.1) return language === 'en' ? '3:2 (Landscape)' : '3:2 (横向)';
    if (Math.abs(ratio - 16/9) < 0.1) return language === 'en' ? '16:9 (Widescreen)' : '16:9 (宽屏)';
    return `${config.canvasWidth}:${config.canvasHeight} (${language === 'en' ? 'Custom' : '自定义'})`;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a temporary link
    const link = document.createElement('a');
    link.download = 'mondrian-artwork.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CanvasContainer>
      <Canvas 
        ref={canvasRef} 
        width={config.canvasWidth} 
        height={config.canvasHeight} 
      />
      <CanvasControls>
        <ControlButton 
          onClick={() => setShowInfo(!showInfo)}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <ButtonIcon>ⓘ</ButtonIcon> {t('info')}
          <InfoTooltip visible={showInfo}>
            <InfoTitle>{language === 'en' ? 'Parameters' : '参数'}</InfoTitle>
            <InfoTable>
              <tbody>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Format:' : '格式:'}</InfoLabel>
                  <InfoValue>{getAspectRatio()}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Dimensions:' : '尺寸:'}</InfoLabel>
                  <InfoValue>{config.canvasWidth}×{config.canvasHeight}px</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Complexity:' : '复杂度:'}</InfoLabel>
                  <InfoValue>{getComplexityLevel()}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Min Cell Size:' : '最小单元格大小:'}</InfoLabel>
                  <InfoValue>{config.minCellSize}px</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Max Depth:' : '最大深度:'}</InfoLabel>
                  <InfoValue>{config.maxDepth} {language === 'en' ? 'levels' : '级'}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Split Probability:' : '分割概率:'}</InfoLabel>
                  <InfoValue>{Math.round(config.splitProbability * 100)}%</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Colors Used:' : '使用的颜色:'}</InfoLabel>
                  <InfoValue>{formatColorPalette(config.colorPalette)}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Color Amount:' : '颜色数量:'}</InfoLabel>
                  <InfoValue>{getColorAmount()} ({Math.round(config.colorProbability * 100)}%)</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Line Thickness:' : '线条粗细:'}</InfoLabel>
                  <InfoValue>{getLineThickness()} ({config.lineThickness}px)</InfoValue>
                </InfoRow>
                {config.prominentColor && (
                  <InfoRow>
                    <InfoLabel>{language === 'en' ? 'Prominent Color:' : '主要颜色:'}</InfoLabel>
                    <InfoValue>
                      {formatColorName(config.prominentColor)} ({Math.round(config.prominentColorBoost * 100)}%)
                    </InfoValue>
                  </InfoRow>
                )}
                <InfoRow>
                  <InfoLabel>{language === 'en' ? 'Total Cells:' : '总单元格数:'}</InfoLabel>
                  <InfoValue>{cells.length} {language === 'en' ? 'rectangles' : '矩形'}</InfoValue>
                </InfoRow>
              </tbody>
            </InfoTable>
          </InfoTooltip>
        </ControlButton>
        <ControlButton onClick={handleDownload}>
          <ButtonIcon>↓</ButtonIcon> {t('download')}
        </ControlButton>
      </CanvasControls>
    </CanvasContainer>
  );
};

export default MondrianCanvas; 