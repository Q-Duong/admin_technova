import { createSlice } from '@reduxjs/toolkit'

const initValue = localStorage.getItem("token") 

const initialState = {
    value: initValue,
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload
            localStorage.setItem("token", action.payload)
        },
        clearToken: (state, action) => {
            state.value = null
            localStorage.removeItem("token")
        }
    },
})

// Action creators are generated for each case reducer function
export const { setToken, clearToken } = tokenSlice.actions

export default tokenSlice.reducer