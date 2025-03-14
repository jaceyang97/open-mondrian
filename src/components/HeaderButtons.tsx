import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const HeaderButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  padding: 4px 12px;
  margin-right: 10px;
  border-radius: 4px;
  font-family: 'Noto Sans SC', sans-serif;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
  }
  
  &:last-child {
    margin-right: 0;
  }
`;

interface HeaderButtonsProps {
  onInfoClick: () => void;
  onDownloadClick: () => void;
}

const HeaderButtons: React.FC<HeaderButtonsProps> = ({ onInfoClick, onDownloadClick }) => {
  const { t } = useLanguage();
  
  return (
    <ButtonsContainer>
      <HeaderButton onClick={onInfoClick}>
        {t('info')}
      </HeaderButton>
      <HeaderButton onClick={onDownloadClick}>
        {t('download')}
      </HeaderButton>
    </ButtonsContainer>
  );
};

export default HeaderButtons; 