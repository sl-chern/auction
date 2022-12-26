import React, { useState, useRef } from 'react'
import { DialogTitle } from '@mui/material'
import { CustomButton, CustomDialog } from '../../components/CustomMUIComponents/CustomComponents'
import { useForm, useFormState } from "react-hook-form"
import FormTextField from '../../components/FormField/FormField'
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import useUserApi from '../../api/userApi'

export default function UserSettings({visibility, setVisibility, id, setUser}) {
  const userApi = useUserApi()

  const [drag, setDrag] = useState()
  const inputRef = useRef()

  const [userImg, setUserImg] = useState()

  const schema = yup.object().shape({
    firstName: yup.string("Ім'я повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").notRequired(),
    lastName: yup.string("Прізвище повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").notRequired(),
    email: yup.string("Email повинен бути строкою").email("Поле не є email-ом").notRequired(),
    phone: yup.string("Телефон повинен бути строкою").min(13, "Телефон повинен бути 13 символів у довжину").max(13, "Телефон повинен бути 13 символів у довжину").notRequired(),
    image: yup.object().test("is-file", "Картинка має бути файлом", value => value instanceof File).notRequired()
  })

  const { register, control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })
  const { errors } = useFormState({control})

  const closeHandler = () => {
    reset()
    setVisibility(false)
  }

  const onSubmit = async (data) => {
    try {
      let updatedInfo = new FormData()

      if(!!data.firstName)
        updatedInfo.append('firstName', data.firstName)
      if(!!data.lastName)
        updatedInfo.append('lastName', data.lastName)
      if(!!data.phone)
        updatedInfo.append('phone', data.phone)
      if(!!data.email)
        updatedInfo.append('email', data.email)
      if(userImg instanceof FormData)
        updatedInfo.append('image', userImg.get('image'))
  
      console.log(updatedInfo.get('image'))

      const res = await userApi.updateUser(updatedInfo, id)

      setUser(res)
    }
    catch(err) {
      console.log(err)
    }
  }

  const changeImg = e => {
    e.preventDefault()
    let file = inputRef.current.files[0]
    getImageFromFile(file)
  }

  const handleStartDrag = e => {
    e.preventDefault()
    setDrag(true)
  }

  const handleLeaveDrag = e => {
    e.preventDefault()
    setDrag(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    let file = e.dataTransfer.files[0]
    getImageFromFile(file)
  }

  const getImageFromFile = (file) => {
    let formData = new FormData()
    formData.append('image', file)
    setUserImg(formData)
    setDrag(false)
  }

  return (
    <CustomDialog open={visibility} onClose={closeHandler} sx={{color: "#1F1F1F"}} className="modal">
      <DialogTitle sx={{color: "#ECEAEA", textAlign: "center"}}>Налаштування</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="modal__form">
        <FormTextField
          control={control}
          name="firstName"
          label="Ім'я"
          helperText={errors.firstName?.message}
        />
        <FormTextField
          control={control}
          name="lastName"
          label="Прізвище"
          helperText={errors.lastName?.message}
        />
        <FormTextField
          control={control}
          name="phone"
          label="Телефон"
          helperText={errors.phone?.message}
        />
        <FormTextField
          control={control}
          name="email"
          label="Email"
          helperText={errors.email?.message}
        />
        <div className="modal__img-settings">
          <div className="modal__drag-and-drop-block">
            <label 
              className="modal__drag-and-drop-label default-text"
              onDragStart={e => handleStartDrag(e)}
              onDragOver={e => handleStartDrag(e)}
              onDragLeave={e => handleLeaveDrag(e)}
              onDrop={e => handleDrop(e)}
            >
              {drag ? "Відпустіть" : "Перетягніть нове фото профілю сюди"}
              <input ref={inputRef} hidden type='file' onChange={e => changeImg(e)} {...register("image")}/>
            </label>
          </div>
        </div>
        <CustomButton variant="contained" color="primary" type="submit" sx={{marginX: "auto"}}>Змінити</CustomButton>
      </form>
    </CustomDialog>
  )
}
