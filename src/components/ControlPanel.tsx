import React from 'react';
import styled from 'styled-components';
import { MondrianConfig, defaultConfig } from '../utils/mondrianGenerator';

interface ControlPanelProps {
  config: MondrianConfig;
  onConfigChange: (config: MondrianConfig) => void;
  onGenerate: () => void;
}

const Panel = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

const ControlGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RangeInput = styled.input`
  flex: 1;
  margin-right: 10px;
`;

const RangeValue = styled.span`
  min-width: 40px;
  text-align: right;
`;

const ColorPaletteContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  background-color: ${props => props.color};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  
  &:hover::after {
    content: '×';
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff4444;
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const AddColorButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: white;
  border: 1px dashed #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const ResetButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, 
  onConfigChange, 
  onGenerate 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    let newValue: any = value;
    if (type === 'number' || type === 'range') {
      newValue = parseFloat(value);
    }
    
    onConfigChange({
      ...config,
      [name]: newValue
    });
  };
  
  const handleColorChange = (index: number, color: string) => {
    const newPalette = [...config.colorPalette];
    newPalette[index] = color;
    onConfigChange({
      ...config,
      colorPalette: newPalette
    });
  };
  
  const addColor = () => {
    onConfigChange({
      ...config,
      colorPalette: [...config.colorPalette, '#FFFFFF']
    });
  };
  
  const removeColor = (index: number) => {
    if (config.colorPalette.length <= 2) return; // Keep at least 2 colors
    const newPalette = [...config.colorPalette];
    newPalette.splice(index, 1);
    onConfigChange({
      ...config,
      colorPalette: newPalette
    });
  };
  
  const resetConfig = () => {
    onConfigChange(defaultConfig);
  };
  
  return (
    <Panel>
      <h2>Mondrian Generator Controls</h2>
      <ControlGrid>
        <ControlGroup>
          <Label>Canvas Width</Label>
          <Input 
            type="number" 
            name="canvasWidth" 
            value={config.canvasWidth} 
            onChange={handleChange}
            min="200"
            max="2000"
          />
        </ControlGroup>
        
        <ControlGroup>
          <Label>Canvas Height</Label>
          <Input 
            type="number" 
            name="canvasHeight" 
            value={config.canvasHeight} 
            onChange={handleChange}
            min="200"
            max="2000"
          />
        </ControlGroup>
        
        <ControlGroup>
          <Label>Minimum Cell Size: {config.minCellSize}px</Label>
          <RangeContainer>
            <RangeInput 
              type="range" 
              name="minCellSize" 
              value={config.minCellSize} 
              onChange={handleChange}
              min="20"
              max="200"
            />
            <RangeValue>{config.minCellSize}</RangeValue>
          </RangeContainer>
        </ControlGroup>
        
        <ControlGroup>
          <Label>Maximum Cell Size: {config.maxCellSize}px</Label>
          <RangeContainer>
            <RangeInput 
              type="range" 
              name="maxCellSize" 
              value={config.maxCellSize} 
              onChange={handleChange}
              min="50"
              max="500"
            />
            <RangeValue>{config.maxCellSize}</RangeValue>
          </RangeContainer>
        </ControlGroup>
        
        <ControlGroup>
          <Label>Line Thickness: {config.lineThickness}px</Label>
          <RangeContainer>
            <RangeInput 
              type="range" 
              name="lineThickness" 
              value={config.lineThickness} 
              onChange={handleChange}
              min="1"
              max="20"
            />
            <RangeValue>{config.lineThickness}</RangeValue>
          </RangeContainer>
        </ControlGroup>
        
        <ControlGroup>
          <Label>Line Color</Label>
          <Input 
            type="color" 
            name="lineColor" 
            value={config.lineColor} 
            onChange={handleChange}
          />
        </ControlGroup>
        
        <ControlGroup>
          <Label>Color Probability: {(config.colorProbability * 100).toFixed(0)}%</Label>
          <RangeContainer>
            <RangeInput 
              type="range" 
              name="colorProbability" 
              value={config.colorProbability} 
              onChange={handleChange}
              min="0"
              max="1"
              step="0.05"
            />
            <RangeValue>{(config.colorProbability * 100).toFixed(0)}%</RangeValue>
          </RangeContainer>
        </ControlGroup>
        
        <ControlGroup>
          <Label>Split Probability: {(config.splitProbability * 100).toFixed(0)}%</Label>
          <RangeContainer>
            <RangeInput 
              type="range" 
              name="splitProbability" 
              value={config.splitProbability} 
              onChange={handleChange}
              min="0"
              max="1"
              step="0.05"
            />
            <RangeValue>{(config.splitProbability * 100).toFixed(0)}%</RangeValue>
          </RangeContainer>
        </ControlGroup>
        
        <ControlGroup>
          <Label>Max Depth: {config.maxDepth}</Label>
          <RangeContainer>
            <RangeInput 
              type="range" 
              name="maxDepth" 
              value={config.maxDepth} 
              onChange={handleChange}
              min="1"
              max="10"
              step="1"
            />
            <RangeValue>{config.maxDepth}</RangeValue>
          </RangeContainer>
        </ControlGroup>
      </ControlGrid>
      
      <ControlGroup>
        <Label>Color Palette</Label>
        <ColorPaletteContainer>
          {config.colorPalette.map((color, index) => (
            <ColorSwatch 
              key={index} 
              color={color}
              onClick={() => index > 0 && removeColor(index)}
            >
              <input 
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                style={{ opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              />
            </ColorSwatch>
          ))}
          <AddColorButton onClick={addColor}>+</AddColorButton>
        </ColorPaletteContainer>
      </ControlGroup>
      
      <ButtonContainer>
        <ResetButton onClick={resetConfig}>Reset</ResetButton>
        <Button onClick={onGenerate}>Generate</Button>
      </ButtonContainer>
    </Panel>
  );
};

export default ControlPanel; 