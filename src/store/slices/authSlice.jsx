import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../firebase/FirebaseSetup';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

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
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { setUser, setLoading, responseFailure, clearError, updateUser } =
    authSlice.actions;

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        dispatch(
            setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                verified: user.emailVerified
            })
        );
        return { type: setUser.type, payload: user };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const updateUserAsync = (user, updatedFields) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        if ('imageURL' in updatedFields) {
            if (updatedFields.imageURL) {
                if (typeof updatedFields.imageURL === 'object') {
                    const uploadImageName = `profile-images/${
                        user.uid
                    }.${updatedFields.image.name.split('.').pop()}`;
                    const imageStorageRef = ref(storage, uploadImageName);
                    await uploadBytes(imageStorageRef, updatedFields.image);
                    updatedFields.imageURL = await getDownloadURL(
                        imageStorageRef
                    );
                }
            } else {
                if (user.imageURL) {
                    const imageStorageRef = ref(storage, user.imageURL);
                    await deleteObject(imageStorageRef);
                    updatedFields.imageURL = null;
                }
            }
        }
        await updateProfile(auth.currentUser, updatedFields);
        dispatch(updateUser(updatedFields));
        return { type: updateUser.type, payload: updatedFields };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const register = (email, password, userFields) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        const updatedUser = {
            uid: user.uid,
            email: user.email,
            displayName: userFields.displayName,
            phoneNumber: userFields.phoneNumber,
            photoURL: userFields.photoURL
        };
        await user.updateProfile({
            displayName: updatedUser.displayName,
            photoURL: updatedUser.photoURL
        });
        dispatch(setUser(updatedUser));
        return { type: setUser.type, payload: updatedUser };
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
        return { type: setUser.type, payload: null };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export default authSlice.reducer;
