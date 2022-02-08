import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import devicesReducer from './devicesRedux';

const initialState = {
  devices: {
    data: {},
    loading: {
      active: false,
      error: false,
    },
  },
};

const reducers = {
  devices: devicesReducer,
};

Object.keys( initialState ).forEach( item => {
  if ( typeof reducers[ item ] === 'undefined' ) {
    reducers[ item ] = ( statePart = null ) => statePart;
  }
} );

const combinedReducers = combineReducers( reducers );

export const store = createStore(
  combinedReducers,
  initialState,
  composeWithDevTools(
    applyMiddleware( thunk )
  )
);
