import React from 'react';
import { render, act } from '@testing-library/react';
import App from './App';

// Mock canvas functionality
beforeAll(() => {
  // Mock canvas getContext
  HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation(() => {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
      fillText: jest.fn(),
      canvas: document.createElement('canvas')
    } as unknown as CanvasRenderingContext2D;
  });
});

test('renders app correctly', async () => {
  // Use a simpler approach with act
  await act(async () => {
    render(<App />);
  });
  
  // Basic smoke test - app renders without crashing
  expect(document.querySelector('header')).not.toBeNull();
});
