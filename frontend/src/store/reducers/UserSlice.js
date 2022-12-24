import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: null,
  firstName: null,
  lastName: null,
  phone: null,
  email: null,
  image: null,
  roleId: null,
  isLoading: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    changeId: (state, action) => {
      state.id = action.payload
    },
    changeFirstName: (state, action) => {
      state.firstName = action.payload
    },
    changeLastName: (state, action) => {
      state.lastName = action.payload
    },
    changePhone: (state, action) => {
      state.phone = action.payload
    },
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    changeImage: (state, action) => {
      state.image = action.payload
    },
    changeRoleId: (state, action) => {
      state.roleId = action.payload
    },
    changeIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  }
})

export default userSlice.reducer

export const {changeId, changeFirstName, changeLastName, changePhone, changeEmail, changeImage, changeRoleId, changeIsLoading} = userSlice.actions

export const selectId = (state) => state.user.id
export const selectFirstName = (state) => state.user.firstName
export const selectLastName = (state) => state.user.lastName
export const selectPhone = (state) => state.user.phone
export const selectEmail = (state) => state.user.email
export const selectImage = (state) => state.user.image
export const selectRoleId = (state) => state.user.roleId
export const selectIsLoading = (state) => state.user.isLoading