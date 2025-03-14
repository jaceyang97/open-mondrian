import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MondrianCanvas from './components/MondrianCanvas';
import ControlPanel from './components/ControlPanel';
import { generateMondrian, MondrianConfig, defaultConfig, Cell } from './utils/mondrianGenerator';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

const App: React.FC = () => {
  const [config, setConfig] = useState<MondrianConfig>(defaultConfig);
  const [cells, setCells] = useState<Cell[]>([]);

  // Generate initial composition on mount
  useEffect(() => {
    generateComposition();
  }, []);

  const generateComposition = () => {
    const newCells = generateMondrian(config);
    setCells(newCells);
  };

  const handleConfigChange = (newConfig: MondrianConfig) => {
    setConfig(newConfig);
  };

  return (
    <AppContainer>
      <Header>
        <Title>Open Mondrian</Title>
        <Subtitle>
          Create your own Mondrian-style compositions by adjusting the parameters below.
          Piet Mondrian's work, especially his Composition series, can be viewed as early generative art,
          with carefully balanced lines, rectangles, and primary colors.
        </Subtitle>
      </Header>

      <ControlPanel 
        config={config} 
        onConfigChange={handleConfigChange} 
        onGenerate={generateComposition} 
      />
      
      <MondrianCanvas cells={cells} config={config} />
      
      <Footer>
        <p>
          Inspired by Piet Mondrian's Composition series and{' '}
          <a href="https://www.mondriangenerator.io/" target="_blank" rel="noopener noreferrer">
            mondriangenerator.io
          </a>
        </p>
      </Footer>
    </AppContainer>
  );
};

export default App;
