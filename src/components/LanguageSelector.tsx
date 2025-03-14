import React from 'react';
import styled from 'styled-components';
import { useLanguage, Language } from '../contexts/LanguageContext';

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const LanguageButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? '#fff' : '#999'};
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  padding: 4px 8px;
  font-family: 'Noto Sans SC', sans-serif;
  transition: color 0.2s;
  
  &:hover {
    color: #fff;
  }
  
  &:focus {
    outline: none;
  }
`;

const Divider = styled.span`
  color: #666;
  margin: 0 4px;
`;

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Update the document title based on language
    document.title = lang === 'en' ? 'Open Mondrian' : '开源蒙德里安';
  };
  
  return (
    <SelectorContainer>
      <LanguageButton 
        active={language === 'en'} 
        onClick={() => handleLanguageChange('en')}
      >
        EN
      </LanguageButton>
      <Divider>|</Divider>
      <LanguageButton 
        active={language === 'cn'} 
        onClick={() => handleLanguageChange('cn')}
      >
        中文
      </LanguageButton>
    </SelectorContainer>
  );
};

export default LanguageSelector; 