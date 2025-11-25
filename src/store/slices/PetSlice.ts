import { createSlice } from "@reduxjs/toolkit";

const petSlice = createSlice({
    name: "pet",
    initialState: [],
    reducers: {
        setPets: (state, action) => {
            return action.payload; // store all fetched pets
        },
    },
});

export const { setPets } = petSlice.actions;
export default petSlice.reducer;
