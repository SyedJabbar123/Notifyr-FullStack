import { useContext } from 'react';
import { ItemContext } from '../context/Item/ItemContext';

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used inside ItemProvider');
  }
  return context;
};