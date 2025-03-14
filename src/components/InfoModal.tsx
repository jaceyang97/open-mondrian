import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Noto Sans SC', sans-serif;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
  
  &:focus {
    outline: none;
  }
`;

const ModalBody = styled.div`
  color: #444;
  line-height: 1.6;
  
  p {
    margin-bottom: 16px;
  }
  
  a {
    color: #1976D2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add translations for the modal content
const infoContent = {
  title: {
    en: 'About Mondrian Generator',
    cn: '关于蒙德里安生成器'
  },
  description: {
    en: `This open-source application allows you to create artwork inspired by Piet Mondrian's neoplasticism style. 
    Adjust the settings to create your own unique compositions with different formats, complexity levels, and color schemes.`,
    cn: `这个开源应用程序允许您创建受皮特·蒙德里安新造型主义风格启发的艺术作品。
    调整设置以创建具有不同格式、复杂度和配色方案的独特构图。`
  },
  instructions: {
    en: 'How to use:',
    cn: '使用方法：'
  },
  step1: {
    en: '1. Select a format (square, landscape, or widescreen)',
    cn: '1. 选择格式（正方形、横向或宽屏）'
  },
  step2: {
    en: '2. Choose a complexity level (low, medium, or high)',
    cn: '2. 选择复杂度级别（低、中或高）'
  },
  step3: {
    en: '3. Select one or more colors to include',
    cn: '3. 选择要包含的一种或多种颜色'
  },
  step4: {
    en: '4. Adjust color amount and line thickness',
    cn: '4. 调整颜色数量和线条粗细'
  },
  step5: {
    en: '5. Click "Generate" to create your composition',
    cn: '5. 点击"生成"创建您的构图'
  },
  credits: {
    en: 'Created as an open-source project inspired by mondriangenerator.io',
    cn: '作为开源项目创建，灵感来自 mondriangenerator.io'
  }
};

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  
  if (!isOpen) return null;
  
  const content = infoContent;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{content.title[language]}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <p>{content.description[language]}</p>
          <p><strong>{content.instructions[language]}</strong></p>
          <p>{content.step1[language]}</p>
          <p>{content.step2[language]}</p>
          <p>{content.step3[language]}</p>
          <p>{content.step4[language]}</p>
          <p>{content.step5[language]}</p>
          <p>{content.credits[language]}</p>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoModal; 