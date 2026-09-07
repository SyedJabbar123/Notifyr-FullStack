export const initialState = {
  items: [],
  loading: false,
  error: null,
};

export function itemReducer(state, action) {
  switch (action.type) {
    case 'FETCH_ITEMS_START':
      return { 
        ...state, 
        loading: true, 
        error: null 
    };

    case 'FETCH_ITEMS_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        items: action.payload 
    };

    case 'FETCH_ITEMS_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error 
    };

    // Used after creating a brand-new item, so it shows up immediately
    // without needing a full list refetch.
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [action.payload, ...state.items] 
    };

    // Used after editing an item, changing its status, or binding a QR tag.
    // Upserts: replaces the item if it already exists, otherwise adds it
    // (covers the case where a detail screen fetched an item not yet in
    // the shared list).
    case 'UPDATE_ITEM': {
      const exists = state.items.some((item) => item.id === action.payload.id);
      const items = exists
        ? state.items.map((item) =>
            item.id === action.payload.id ? { ...item, ...action.payload } : item
          )
        : [action.payload, ...state.items];
      return { ...state, items };
    };


    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter((item) => item.id !== action.payload.id) 
    };

    // Items belong to a specific logged-in owner — clear them on logout so
    // the next user who logs in on this device never sees stale data.
    case 'CLEAR_ITEMS':
      return initialState;

    default:
      return state;
  }
}