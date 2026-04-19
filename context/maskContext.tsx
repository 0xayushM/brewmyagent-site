import { createContext, useContext } from 'react';

// Define the shape of the data the context will provide.
// We only need to provide the function to set the size.
export interface MaskContextType {
  setMaskSize: (size: number) => void;
}

// Create the context with a default value (it will be overridden by the Provider).
export const MaskContext = createContext<MaskContextType | undefined>(undefined);

// Create a custom hook for easy access to the context.
// This is a best practice that also handles the case where the context is not found.
export const useMask = () => {
  const context = useContext(MaskContext);
  if (!context) {
    throw new Error('useMask must be used within a MaskProvider');
  }
  return context;
};
