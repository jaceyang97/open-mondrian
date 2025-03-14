import React, { useState } from 'react';
import styled from 'styled-components';
import { MondrianConfig, defaultConfig, complexityPresets } from '../utils/mondrianGenerator';
import { useLanguage } from '../contexts/LanguageContext';

interface ControlPanelProps {
  config: MondrianConfig;
  onConfigChange: (config: MondrianConfig) => void;
  onGenerate: () => void;
}

const Panel = styled.div`
  padding: 12px;
  height: 100%;
  overflow-y: auto;
  font-family: 'Noto Sans SC', sans-serif;
  
  @media (max-width: 768px) {
    padding: 8px;
    height: auto;
    overflow: visible;
  }
`;

const SectionTitle = styled.h3<{ error?: boolean }>`
  font-size: 0.95rem;
  margin: 0 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid ${props => props.error ? '#D13C37' : '#ddd'};
  color: ${props => props.error ? '#D13C37' : '#333'};
  font-family: 'Noto Sans SC', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin: 0 0 4px 0;
    padding-bottom: 3px;
  }
`;

const ControlGroup = styled.div`
  margin-bottom: 14px;
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

// Format options
const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const OptionButton = styled.div<{ isSelected?: boolean }>`
  border: 1px solid ${props => props.isSelected ? '#333' : '#ccc'};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f0f0f0' : 'white'};
  padding: 6px 0;
  
  &:hover {
    border-color: #999;
  }
  
  @media (max-width: 768px) {
    padding: 4px 0;
  }
`;

const OptionLabel = styled.div<{ isSelected?: boolean }>`
  text-align: center;
  font-size: 0.8rem;
  margin-top: 4px;
  color: ${props => props.isSelected ? '#000' : '#666'};
  font-family: 'Noto Sans SC', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-top: 2px;
  }
`;

// Format icons
const FormatIcon = styled.div<{ ratio: string; isSelected?: boolean }>`
  width: 40px;
  height: 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    border: 1px solid ${props => props.isSelected ? '#000' : '#999'};
    background-color: #f5f5f5;
    
    ${props => props.ratio === '1:1' && `
      width: 30px;
      height: 30px;
      top: 0;
      left: 5px;
    `}
    
    ${props => props.ratio === '3:2' && `
      width: 36px;
      height: 24px;
      top: 3px;
      left: 2px;
    `}
    
    ${props => props.ratio === '16:9' && `
      width: 40px;
      height: 22.5px;
      top: 4px;
      left: 0;
    `}
  }
`;

// Complexity icons
const ComplexityIcon = styled.div<{ complexity: 'low' | 'mid' | 'high'; isSelected?: boolean }>`
  width: 40px;
  height: 30px;
  display: grid;
  grid-template-columns: ${props => 
    props.complexity === 'low' ? '1fr' : 
    props.complexity === 'mid' ? '1fr 1fr' : 
    '1fr 1fr 1fr'
  };
  grid-template-rows: ${props => 
    props.complexity === 'low' ? '1fr' : 
    props.complexity === 'mid' ? '1fr 1fr' : 
    '1fr 1fr 1fr'
  };
  gap: 2px;
`;

const ComplexityCell = styled.div<{ isSelected?: boolean }>`
  background-color: ${props => props.isSelected ? '#000' : '#ddd'};
`;

// Color options
const ColorOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const ColorSwatch = styled.div<{ color: string; isSelected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${props => props.isSelected ? props.color : '#e0e0e0'};
  border: 1px solid ${props => props.isSelected ? '#333' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    border-color: #999;
  }
  
  @media (max-width: 768px) {
    border-width: 1px;
  }
`;

const ColorLabel = styled.div<{ isSelected?: boolean }>`
  text-align: center;
  font-size: 0.7rem;
  margin-top: 2px;
  color: ${props => props.isSelected ? '#000' : '#666'};
  font-family: 'Noto Sans SC', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    margin-top: 1px;
  }
`;

// Slider options
const SliderOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const SliderOption = styled.div<{ isSelected: boolean }>`
  border: 1px solid ${props => props.isSelected ? '#333' : '#ccc'};
  border-radius: 4px;
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f0f0f0' : 'white'};
  color: ${props => props.isSelected ? '#000' : '#666'};
  font-family: 'Noto Sans SC', sans-serif;
  
  &:hover {
    border-color: #999;
  }
  
  @media (max-width: 768px) {
    padding: 4px 0;
    font-size: 0.8rem;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 8px 0;
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
  background: #ddd;
  border-radius: 3px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: #333;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #333;
    border-radius: 50%;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    margin: 6px 0;
  }
`;

const ColorDropdown = styled.select`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-family: 'Noto Sans SC', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #333;
  }
  
  @media (max-width: 768px) {
    padding: 4px;
    font-size: 0.85rem;
  }
`;

const SliderValue = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  margin-top: 3px;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const MoreColorsButton = styled.button`
  width: 100%;
  padding: 5px 0;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 6px;
  font-family: 'Noto Sans SC', sans-serif;
  
  &:hover {
    background-color: #e0e0e0;
    border-color: #999;
  }
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 3px 0;
    margin-top: 4px;
  }
`;

const GenerateButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 10px;
  background-color: ${props => props.disabled ? '#999' : '#333'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  font-family: 'Noto Sans SC', sans-serif;
  
  &:hover {
    background-color: ${props => props.disabled ? '#999' : '#555'};
  }
  
  @media (max-width: 768px) {
    padding: 7px;
    margin-top: 8px;
    font-size: 0.85rem;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, 
  onConfigChange, 
  onGenerate 
}) => {
  const { t } = useLanguage();
  
  // State to track if there's an error with color selection
  const [colorError, setColorError] = useState(false);
  // State to track if additional colors are shown
  const [showMoreColors, setShowMoreColors] = useState(false);
  
  // Format options (aspect ratio)
  const formats = [
    { label: t('square'), key: 'square', width: 800, height: 800 },
    { label: t('landscape'), key: 'landscape', width: 900, height: 600 },
    { label: t('widescreen'), key: 'widescreen', width: 960, height: 540 }
  ];
  
  // Complexity presets - using imported values
  const complexityOptions = [
    { label: t('low'), key: 'low', ...complexityPresets.low },
    { label: t('mid'), key: 'mid', ...complexityPresets.medium },
    { label: t('high'), key: 'high', ...complexityPresets.high }
  ];
  
  // Color options - more muted colors
  const colorOptions = [
    { label: t('yellow'), key: 'yellow', color: '#E6C700' }, // Muted yellow
    { label: t('red'), key: 'red', color: '#D13C37' },    // Muted red
    { label: t('blue'), key: 'blue', color: '#3755A1' },   // Navy blue (updated)
    { label: t('black'), key: 'black', color: '#333333' }   // Soft black
  ];
  
  // Additional color options
  const additionalColorOptions = [
    { label: t('orange'), key: 'orange', color: '#E67E22' }, // Muted orange
    { label: t('purple'), key: 'purple', color: '#9B59B6' }, // Muted purple
    { label: t('cyan'), key: 'cyan', color: '#3498DB' },     // Muted cyan
    { label: t('green'), key: 'green', color: '#27AE60' }    // Muted green
  ];
  
  // Line thickness presets
  const thicknessPresets = [
    { label: t('thin'), key: 'thin', value: 3 },
    { label: t('medium'), key: 'medium', value: 8 },
    { label: t('thick'), key: 'thick', value: 15 }
  ];
  
  // Color probability presets
  const colorProbabilityPresets = [
    { label: t('low'), key: 'low', value: 0.2 },
    { label: t('medium'), key: 'medium', value: 0.4 },
    { label: t('high'), key: 'high', value: 0.7 }
  ];
  
  // Get current format
  const getCurrentFormat = () => {
    const ratio = config.canvasWidth / config.canvasHeight;
    if (Math.abs(ratio - 1) < 0.1) return t('square');
    if (Math.abs(ratio - 1.5) < 0.1) return t('landscape');
    if (Math.abs(ratio - 16/9) < 0.1) return t('widescreen');
    return '';
  };
  
  // Get current complexity
  const getCurrentComplexity = () => {
    if (config.minCellSize >= 100 && config.maxDepth <= 3) return t('low');
    if (config.minCellSize <= 50 && config.maxDepth >= 5) return t('high');
    return t('mid');
  };
  
  // Get current line thickness
  const getCurrentThickness = () => {
    if (config.lineThickness <= 4) return t('thin');
    if (config.lineThickness >= 12) return t('thick');
    return t('medium');
  };
  
  // Get current color probability
  const getCurrentColorProbability = () => {
    if (config.colorProbability <= 0.25) return t('low');
    if (config.colorProbability >= 0.6) return t('high');
    return t('medium');
  };
  
  // Check if any non-white colors are selected
  const hasSelectedColors = () => {
    // Check if there are any colors other than white in the palette
    return config.colorPalette.some(color => color !== '#FFFFFF');
  };
  
  // Handle format change
  const handleFormatChange = (width: number, height: number) => {
    onConfigChange({
      ...config,
      canvasWidth: width,
      canvasHeight: height
    });
  };
  
  // Handle complexity change
  const handleComplexityChange = (preset: typeof complexityOptions[0]) => {
    onConfigChange({
      ...config,
      minCellSize: preset.minCellSize,
      maxDepth: preset.maxDepth,
      splitProbability: preset.splitProb,
      minSplits: preset.minSplits
    });
  };
  
  // Handle color toggle
  const handleColorToggle = (color: string) => {
    let newPalette = [...config.colorPalette];
    
    // Don't allow removing white (background color)
    if (color === '#FFFFFF') return;
    
    if (newPalette.includes(color)) {
      // Remove the color
      newPalette = newPalette.filter(c => c !== color);
    } else {
      // Add the color
      newPalette.push(color);
    }
    
    // Update the config with the new palette
    onConfigChange({
      ...config,
      colorPalette: newPalette
    });
    
    // Check if there are any colors selected after this change
    setColorError(!newPalette.some(c => c !== '#FFFFFF'));
  };
  
  // Handle line thickness change
  const handleThicknessChange = (thickness: number) => {
    onConfigChange({
      ...config,
      lineThickness: thickness
    });
  };
  
  // Handle color probability change
  const handleColorProbabilityChange = (probability: number) => {
    onConfigChange({
      ...config,
      colorProbability: probability
    });
  };
  
  // Handle prominent color change
  const handleProminentColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onConfigChange({
      ...config,
      prominentColor: value === 'none' ? undefined : value
    });
  };
  
  // Handle prominent color boost change
  const handleProminentColorBoostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    onConfigChange({
      ...config,
      prominentColorBoost: value
    });
  };
  
  // Check if a color is selected (accounting for muted colors)
  const isColorSelected = (color: string) => {
    const palette = config.colorPalette;
    
    // Direct match
    if (palette.includes(color)) return true;
    
    // For the blue color, check for any of the blue variants we've used
    if (color === '#3755A1') {
      return palette.includes('#3755A1') || 
             palette.includes('#0A3B78') || 
             palette.includes('#1E5AA8');
    }
    
    // For cyan, check for similar blue-cyan variants
    if (color === '#3498DB') {
      return palette.includes('#3498DB') || 
             palette.includes('#2980B9');
    }
    
    // For green, check for similar green variants
    if (color === '#27AE60') {
      return palette.includes('#27AE60') || 
             palette.includes('#2ECC71');
    }
    
    return false;
  };
  
  // Handle generate click with validation
  const handleGenerate = () => {
    if (hasSelectedColors()) {
      setColorError(false);
      onGenerate();
    } else {
      setColorError(true);
    }
  };
  
  return (
    <Panel>
      <ControlGroup>
        <SectionTitle>{t('format')}</SectionTitle>
        <OptionGrid>
          {formats.map(format => (
            <OptionButton 
              key={format.key}
              isSelected={getCurrentFormat() === format.label}
              onClick={() => handleFormatChange(format.width, format.height)}
            >
              <FormatIcon ratio={format.label} isSelected={getCurrentFormat() === format.label} />
              <OptionLabel isSelected={getCurrentFormat() === format.label}>{format.label}</OptionLabel>
            </OptionButton>
          ))}
        </OptionGrid>
      </ControlGroup>
      
      <ControlGroup>
        <SectionTitle>{t('complexity')}</SectionTitle>
        <OptionGrid>
          {complexityOptions.map(preset => (
            <OptionButton 
              key={preset.key}
              isSelected={getCurrentComplexity() === preset.label}
              onClick={() => handleComplexityChange(preset)}
            >
              <ComplexityIcon complexity={preset.key as 'low' | 'mid' | 'high'} isSelected={getCurrentComplexity() === preset.label}>
                {Array.from({ length: preset.key === 'low' ? 1 : preset.key === 'mid' ? 4 : 9 }).map((_, i) => (
                  <ComplexityCell key={i} isSelected={getCurrentComplexity() === preset.label} />
                ))}
              </ComplexityIcon>
              <OptionLabel isSelected={getCurrentComplexity() === preset.label}>{preset.label}</OptionLabel>
            </OptionButton>
          ))}
        </OptionGrid>
      </ControlGroup>
      
      <ControlGroup>
        <SectionTitle error={colorError}>{t('colors')} {colorError && t('selectAtLeastOne')}</SectionTitle>
        <ColorOptions>
          {colorOptions.map(option => (
            <div key={option.key}>
              <ColorSwatch 
                color={option.color}
                isSelected={isColorSelected(option.color)}
                onClick={() => handleColorToggle(option.color)}
              />
              <ColorLabel isSelected={isColorSelected(option.color)}>{option.label}</ColorLabel>
            </div>
          ))}
        </ColorOptions>
        
        {showMoreColors && (
          <ColorOptions style={{ marginTop: '5px' }}>
            {additionalColorOptions.map(option => (
              <div key={option.key}>
                <ColorSwatch 
                  color={option.color}
                  isSelected={isColorSelected(option.color)}
                  onClick={() => handleColorToggle(option.color)}
                />
                <ColorLabel isSelected={isColorSelected(option.color)}>{option.label}</ColorLabel>
              </div>
            ))}
          </ColorOptions>
        )}
        
        <MoreColorsButton onClick={() => setShowMoreColors(!showMoreColors)}>
          {showMoreColors ? '▲ ' : '▼ '}{t('moreColors')}
        </MoreColorsButton>
      </ControlGroup>
      
      <ControlGroup>
        <SectionTitle>{t('prominentColor')}</SectionTitle>
        <ColorDropdown value={config.prominentColor || 'none'} onChange={handleProminentColorChange}>
          <option value="none">{t('none')}</option>
          {[...colorOptions, ...additionalColorOptions].map(option => (
            <option key={option.key} value={option.color}>
              {option.label}
            </option>
          ))}
        </ColorDropdown>
      </ControlGroup>
      
      {config.prominentColor && (
        <ControlGroup>
          <SectionTitle>{t('prominentColorBoost')}</SectionTitle>
          <Slider
            type="range"
            value={config.prominentColorBoost}
            onChange={handleProminentColorBoostChange}
            min="0"
            max="1"
            step="0.05"
          />
          <SliderValue>{Math.round(config.prominentColorBoost * 100)}%</SliderValue>
        </ControlGroup>
      )}
      
      <ControlGroup>
        <SectionTitle>{t('colorAmount')}</SectionTitle>
        <SliderOptions>
          {colorProbabilityPresets.map(preset => (
            <SliderOption 
              key={preset.key}
              isSelected={getCurrentColorProbability() === preset.label}
              onClick={() => handleColorProbabilityChange(preset.value)}
            >
              {preset.label}
            </SliderOption>
          ))}
        </SliderOptions>
      </ControlGroup>
      
      <ControlGroup>
        <SectionTitle>{t('lineThickness')}</SectionTitle>
        <SliderOptions>
          {thicknessPresets.map(preset => (
            <SliderOption 
              key={preset.key}
              isSelected={getCurrentThickness() === preset.label}
              onClick={() => handleThicknessChange(preset.value)}
            >
              {preset.label}
            </SliderOption>
          ))}
        </SliderOptions>
      </ControlGroup>
      
      <GenerateButton 
        onClick={handleGenerate} 
        disabled={!hasSelectedColors()}
      >
        <ButtonIcon>✨</ButtonIcon> {t('generate')}
      </GenerateButton>
    </Panel>
  );
};

export default ControlPanel; 