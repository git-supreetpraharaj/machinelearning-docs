import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
    auth: authReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk]
});

export default store;
