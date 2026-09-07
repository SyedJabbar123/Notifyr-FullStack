import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { itemReducer, initialState } from './ItemReducer';
import { ItemContext } from './ItemContext';
import { useAuth } from '../../hooks/useAuth';
import * as itemService from '../../services/itemService';

const ItemProvider = ({ children }) => {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(itemReducer, initialState);

  // for testing
console.log('ITEM CONTEXT STATE:', state.items.length, 'items, loading:', state.loading);


  const { items, loading, error } = state;


  const fetchItems = useCallback(async () => {
    if (!token) return;

    dispatch({ type: 'FETCH_ITEMS_START' });
    try {
      const data = await itemService.getMyItems(token);
      dispatch({ type: 'FETCH_ITEMS_SUCCESS', payload: data.items || data });
    } catch (error) {
      dispatch({ type: 'FETCH_ITEMS_FAILURE', payload: { error: error.message } });
    }
  }, [token]);



  // Every one of these MUST be wrapped in useCallback with an empty
  // dependency array (dispatch is stable across renders by React's guarantee).
  // Without this, each function gets a new identity on every render, which
  // cascades into any screen's useCallback/useEffect that depends on them,
  // causing an infinite refetch loop.
  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);
 
  const updateItem = useCallback((item) => {
    dispatch({ type: 'UPDATE_ITEM', payload: item });
  }, []);
 
  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);



  // This one legitimately depends on `items`, so it's expected to get a new
  // identity when the list actually changes — just not on every render.
  const getItemById = useCallback(
    (id) => items.find((item) => item.id === id),
    [items]
  );
 
  // Items belong to whoever's logged in — wipe them the moment the token
  // disappears (logout), so a fresh login never briefly shows old data.
  useEffect(() => {
    if (!token) {
      dispatch({ type: 'CLEAR_ITEMS' });
    }
  }, [token]);





  //  Memoize the context value itself too — otherwise every consumer
  // re-renders on every ItemProvider render even if nothing they use
  // actually changed.
  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      fetchItems,
      addItem,
      updateItem,
      removeItem,
      getItemById,
    }),
    [items, loading, error, fetchItems, addItem, updateItem, removeItem, getItemById]
  );

  return (<ItemContext.Provider value={value}>
    {children}
    </ItemContext.Provider>);
};

export default ItemProvider;