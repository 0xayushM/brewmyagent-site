import { useState } from "react";

interface MaskSizeOptions {
  defaultSize?: number;
  hoveredSize?: number;
  transitionDuration?: number;
}

export const useMaskSize = (options: MaskSizeOptions = {}) => {
  const {
    defaultSize = 40,
    hoveredSize = 300,
    transitionDuration = 0.5
  } = options;
  
  const [maskSize, setMaskSize] = useState(defaultSize);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setMaskSize(hoveredSize);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMaskSize(defaultSize);
  };

  // For direct control of mask size if needed
  const setCustomMaskSize = (size: number) => {
    setMaskSize(size);
  };

  return {
    maskSize,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    setCustomMaskSize,
    transitionDuration
  };
};
