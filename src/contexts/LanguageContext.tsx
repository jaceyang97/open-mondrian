import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
export type Language = 'en' | 'cn';

// Define translation structure
interface Translations {
  [key: string]: {
    en: string;
    cn: string;
  };
}

// Create translations object
export const translations: Translations = {
  // App title and header
  appTitle: {
    en: 'Open Mondrian',
    cn: '开源蒙德里安'
  },
  createYourOwn: {
    en: 'Create your own Mondrian',
    cn: '创建您自己的蒙德里安'
  },
  info: {
    en: 'Info',
    cn: '信息'
  },
  download: {
    en: 'Download',
    cn: '下载'
  },
  
  // Control panel sections
  format: {
    en: 'Format',
    cn: '格式'
  },
  complexity: {
    en: 'Complexity',
    cn: '复杂度'
  },
  colors: {
    en: 'Colors',
    cn: '颜色'
  },
  colorAmount: {
    en: 'Color amount',
    cn: '颜色数量'
  },
  lineThickness: {
    en: 'Line Thickness',
    cn: '线条粗细'
  },
  prominentColor: {
    en: 'Prominent Color',
    cn: '主要颜色'
  },
  prominentColorBoost: {
    en: 'Prominence Level',
    cn: '主要程度'
  },
  none: {
    en: 'None',
    cn: '无'
  },
  
  // Format options
  square: {
    en: '1:1',
    cn: '1:1'
  },
  landscape: {
    en: '3:2',
    cn: '3:2'
  },
  widescreen: {
    en: '16:9',
    cn: '16:9'
  },
  
  // Complexity options
  low: {
    en: 'Low',
    cn: '低'
  },
  mid: {
    en: 'Mid',
    cn: '中'
  },
  high: {
    en: 'High',
    cn: '高'
  },
  
  // Color names
  yellow: {
    en: 'Yellow',
    cn: '黄色'
  },
  red: {
    en: 'Red',
    cn: '红色'
  },
  blue: {
    en: 'Blue',
    cn: '蓝色'
  },
  black: {
    en: 'Black',
    cn: '黑色'
  },
  orange: {
    en: 'Orange',
    cn: '橙色'
  },
  purple: {
    en: 'Purple',
    cn: '紫色'
  },
  cyan: {
    en: 'Cyan',
    cn: '青色'
  },
  green: {
    en: 'Green',
    cn: '绿色'
  },
  moreColors: {
    en: 'More Colors',
    cn: '更多颜色'
  },
  
  // Slider options
  thin: {
    en: 'Thin',
    cn: '细'
  },
  medium: {
    en: 'Medium',
    cn: '中等'
  },
  thick: {
    en: 'Thick',
    cn: '粗'
  },
  
  // Buttons and actions
  generate: {
    en: 'Generate',
    cn: '生成'
  },
  selectAtLeastOne: {
    en: '(Select at least one)',
    cn: '(至少选择一个)'
  },
  
  // Footer
  inspiredBy: {
    en: 'Inspired by Piet Mondrian\'s Composition series and',
    cn: '灵感来自皮特·蒙德里安的构图系列和'
  }
};

// Create context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

// Create provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext); 