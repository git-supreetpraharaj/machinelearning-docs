import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../firebase/FirebaseSetup';
import { signInWithEmailAndPassword } from 'firebase/auth';

const initialState = {
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        responseFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { setUser, setLoading, responseFailure, clearError } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        dispatch(setUser({ uid: user.uid, email: user.email }));
        return { type: setUser.type, payload: user };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const logout = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await auth.signOut();
        dispatch(setUser(null));
    } catch (error) {
        dispatch(responseFailure(error.message));
    }
};

export default authSlice.reducer;
