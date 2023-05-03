import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import pagesReducer from './slices/pagesSlice';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';

const persistConfig = {
    key: import.meta.env.VITE_REDUX_PERSIST_KEY,
    storage
};

const rootReducer = combineReducers({
    auth: authReducer,
    books: booksReducer,
    pages: pagesReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
});

export const persistor = persistStore(store);
