import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { generateMondrian, MondrianConfig, defaultConfig, Cell, complexityPresets, mutedColors } from './utils/mondrianGenerator';
import { Helmet } from 'react-helmet';

// Global styles
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    
    @media (max-width: 768px) {
      overflow-y: auto;
      overflow-x: hidden;
      height: auto;
    }
  }
`;

// Lazy load components for better initial load performance
const MondrianCanvas = lazy(() => import('./components/MondrianCanvas'));
const ControlPanel = lazy(() => import('./components/ControlPanel'));
const InfoModal = lazy(() => import('./components/InfoModal'));

// Styled Components
const AppContainer = styled.div`
  max-width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans SC', 'Roboto', 'Segoe UI', Arial, sans-serif;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 8px 20px;
  background-color: #000000;
  border-bottom: 1px solid #333;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
`;

const MainTitle = styled.span`
  cursor: help;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  margin: 0;
  color: #ffffff;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CreatedBy = styled.span`
  font-size: 0.9rem;
  color: #999;
  font-weight: 300;
  
  a {
    color: #fff;
    text-decoration: none;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 15px;
`;

const GitHubLink = styled.a`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const TitleTooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 400px;
  max-width: 90vw;
  display: ${props => props.visible ? 'block' : 'none'};
  text-align: left;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
  font-weight: normal;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 20px;
    width: 14px;
    height: 14px;
    background-color: #fff;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    transform: rotate(45deg);
  }
`;

const TooltipTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const TooltipSection = styled.p`
  margin: 0 0 12px 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 0;
    flex: 1 0 auto;
    overflow: visible;
  }
`;

const LeftPanel = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    height: auto;
    overflow: visible;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  padding: 20px;
  overflow: auto;
  min-height: 0;
  
  @media (max-width: 768px) {
    height: auto;
    min-height: auto;
    padding: 10px;
    overflow: visible;
  }
`;

const Footer = styled.footer`
  padding: 10px 20px;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
  white-space: nowrap;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    white-space: normal;
    padding: 8px 10px;
    font-size: 0.8rem;
  }
`;

const AppContent: React.FC = () => {
  const { t, language } = useLanguage();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  
  const initialConfig: MondrianConfig = useMemo(() => ({
    ...defaultConfig,
    minCellSize: complexityPresets.low.minCellSize,
    maxDepth: complexityPresets.low.maxDepth,
    splitProbability: complexityPresets.low.splitProb,
    minSplits: complexityPresets.low.minSplits,
    colorPalette: [mutedColors.white, mutedColors.red, mutedColors.blue, mutedColors.yellow, mutedColors.black],
    colorProbability: 0.4,
    lineThickness: 8
  }), []);

  const [uiConfig, setUiConfig] = useState<MondrianConfig>(initialConfig);
  const [generationConfig, setGenerationConfig] = useState<MondrianConfig>(initialConfig);
  const [cells, setCells] = useState<Cell[]>([]);

  const projectBackground = useMemo(() => ({
    title: {
      en: 'About This Project',
      cn: '关于此项目'
    },
    description: {
      en: 'Open Mondrian allows users to create artwork inspired by the Dutch painter Piet Mondrian (1872-1944), a pioneer of abstract art and founder of the De Stijl movement.',
      cn: '开源蒙德里安允许用户创建受荷兰画家皮特·蒙德里安（1872-1944）启发的艺术作品，他是抽象艺术的先驱和风格派运动的创始人。'
    },
    technology: {
      en: 'Built with React, TypeScript, and styled-components.',
      cn: '使用React、TypeScript和styled-components构建。'
    },
  }), []);

  const generateComposition = useCallback(() => {
    setGenerationConfig(() => ({...uiConfig}));
    const newCells = generateMondrian(uiConfig);
    setCells(newCells);
  }, [uiConfig]);

  useEffect(() => {
    generateComposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfigChange = useCallback((newConfig: MondrianConfig) => {
    setUiConfig(newConfig);
  }, []);

  const handleMouseEnter = useCallback(() => setShowTitleTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTitleTooltip(false), []);
  const handleModalClose = useCallback(() => setIsInfoModalOpen(false), []);

  const GitHubIcon = useMemo(() => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.52 21.272 9.52 21.008C9.52 20.768 9.512 20.058 9.508 19.192C6.726 19.8 6.139 17.782 6.139 17.782C5.685 16.642 5.028 16.334 5.028 16.334C4.132 15.728 5.097 15.74 5.097 15.74C6.094 15.809 6.628 16.757 6.628 16.757C7.52 18.376 8.97 17.829 9.54 17.575C9.631 16.928 9.889 16.482 10.175 16.219C7.955 15.953 5.62 15.127 5.62 11.477C5.62 10.387 6.01 9.492 6.649 8.787C6.546 8.535 6.203 7.629 6.747 6.476C6.747 6.476 7.587 6.208 9.497 7.611C10.295 7.39 11.15 7.28 12 7.276C12.85 7.28 13.705 7.39 14.505 7.611C16.413 6.208 17.251 6.476 17.251 6.476C17.797 7.629 17.454 8.535 17.351 8.787C17.991 9.492 18.379 10.387 18.379 11.477C18.379 15.138 16.039 15.949 13.813 16.209C14.172 16.531 14.496 17.169 14.496 18.145C14.496 19.538 14.483 20.676 14.483 21.008C14.483 21.275 14.661 21.587 15.171 21.489C19.138 20.162 22 16.417 22 12C22 6.477 17.523 2 12 2Z" fill="white"/>
    </svg>
  ), []);

  const tooltipContent = useMemo(() => (
    <TitleTooltip visible={showTitleTooltip}>
      <TooltipTitle>{projectBackground.title[language]}</TooltipTitle>
      <TooltipSection>{projectBackground.description[language]}</TooltipSection>
      <TooltipSection>{projectBackground.technology[language]}</TooltipSection>
    </TitleTooltip>
  ), [showTitleTooltip, projectBackground, language]);

  const footerContent = useMemo(() => (
    <p>
      {t('inspiredBy')}{' '}
      <a href="https://www.mondriangenerator.io/" target="_blank" rel="noopener noreferrer">
        mondriangenerator.io
      </a>
    </p>
  ), [t]);

  const creditText = useMemo(() => ({
    en: 'Created by',
    cn: '作者：'
  }), []);

  return (
    <AppContainer>
      <Header>
        <TitleContainer>
          <Title>
            <MainTitle
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {t('createYourOwn')}
            </MainTitle>
            <CreatedBy>
              {creditText[language]}{' '}
              <a href="https://www.jaceyang.com" target="_blank" rel="noopener noreferrer">
                {language === 'cn' ? '杨泽群' : 'Jace Yang'}
              </a>
            </CreatedBy>
          </Title>
          {tooltipContent}
        </TitleContainer>
        <HeaderRight>
          <LanguageSelector />
          <GitHubLink 
            href="https://github.com/jaceyang97/open-mondrian" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            {GitHubIcon}
          </GitHubLink>
        </HeaderRight>
      </Header>

      <MainContent>
        <LeftPanel>
          <Suspense fallback={<div>Loading controls...</div>}>
            <ControlPanel 
              config={uiConfig} 
              onConfigChange={handleConfigChange} 
              onGenerate={generateComposition} 
            />
          </Suspense>
        </LeftPanel>
        
        <RightPanel ref={canvasRef}>
          <Suspense fallback={<div>Loading canvas...</div>}>
            <MondrianCanvas cells={cells} config={generationConfig} />
          </Suspense>
        </RightPanel>
      </MainContent>
      
      <Footer>
        {footerContent}
      </Footer>
      
      <Suspense fallback={null}>
        {isInfoModalOpen && (
          <InfoModal 
            isOpen={isInfoModalOpen}
            onClose={handleModalClose}
          />
        )}
      </Suspense>
    </AppContainer>
  );
};

const MemoizedAppContent = React.memo(AppContent);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <GlobalStyle />
      <MemoizedAppContent />
    </LanguageProvider>
  );
};

export default App;
