import React, { useState, useRef } from 'react'
import { DialogTitle } from '@mui/material'
import { CustomButton, CustomDialog } from '../../components/CustomMUIComponents/CustomComponents'
import { useForm, useFormState } from 'react-hook-form'
import FormField from '../../components/FormField/FormField'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useLotApi from '../../api/lotApi'
import { useNavigate } from 'react-router-dom'
import CategorySelect from '../../components/CategorySelect/CategorySelect'

export default function LotCreatingModal({visibility, setVisibility}) {
  const navigate = useNavigate()

  const lotApi = useLotApi()

  const [drag, setDrag] = useState()
  const inputRef = useRef()

  const [lotImg, setLotImg] = useState()

  const [selectedCategory, setSelectedCategory] = useState("")

  const schema = yup.object().shape({
    name: yup.string("Назва повинна бути строкою").min(2, "Назва повинна бути довше 2 букв").required("Обов'язкове поле"),
    location: yup.string("Місцезнаходження повинно бути строкою").min(2, "Місцезнаходження повинно бути довше 2 букв").required("Обов'язкове поле"),
    description: yup.string("Опис повинен бути строкою").min(2, "Опис повинен бути довше 2 букв").required("Обов'язкове поле"),
    currentPrice: yup.number().typeError("Ціна повинна бути десятковим числом").positive("Ціна повинна бути десятковим числом").test(
      'is-decimal',
      'Ціна повинна бути десятковим числом',
      value => (value + "").match(/^\d+(,\d{1,2})?$/),
    ).required("Обов'язкове поле"),
    startDate: yup.date("Дата початку повинна бути датою").required("Обов'язкове поле"),
    endDate: yup.date("Дата кінця повинна бути датою").required("Обов'язкове поле")
  })

  const { control, handleSubmit, reset } = useForm({
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
      let productInfo = new FormData()

      productInfo.append("name", data.name)
      productInfo.append("location", data.location)
      productInfo.append("description", data.description)
      productInfo.append("currentPrice", data.currentPrice)
      productInfo.append("image", lotImg.get('image'))
      productInfo.append("categoryId", selectedCategory)
      productInfo.append("startDate", data.startDate)
      productInfo.append("endDate", data.endDate)

      const res = await lotApi.createLot(productInfo)

      navigate(`/lot/${res.product_id}`)
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
    setLotImg(formData)
    setDrag(false)
  }

  return (
    <CustomDialog open={visibility} onClose={closeHandler} sx={{color: "#1F1F1F"}} className="modal">
      <DialogTitle sx={{color: "#ECEAEA", textAlign: "center", height: "min-content"}}>Створення лоту</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} className="modal__form">
        <FormField
          control={control}
          name="name"
          label="Назва"
          helperText={errors.name?.message}
        />
        <FormField
          control={control}
          name="description"
          label="Опис"
          helperText={errors.description?.message}
          multiline={{multiline: true, rows: 6}}
        />
        <CategorySelect value={selectedCategory} setValue={setSelectedCategory} sx={{mb: 2}}/>
        <FormField
          control={control}
          name="currentPrice"
          label="Стартова ціна"
          helperText={errors.currentPrice?.message}
        />
        <FormField
          control={control}
          name="location"
          label="Місцезнаходження"
          helperText={errors.location?.message}
        />
        <FormField
          control={control}
          name="startDate"
          label="Дата початку торгів"
          helperText={errors.startDate?.message}
          dateTime={true}
        />
        <FormField
          control={control}
          name="endDate"
          label="Дата кінця торгів"
          helperText={errors.endDate?.message}
          dateTime={true}
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
              {drag ? "Відпустіть" : "Перетягніть фото лоту сюди"}
              <input ref={inputRef} hidden type='file' onChange={e => changeImg(e)}/>
            </label>
          </div>
        </div>
        <CustomButton variant="contained" color="primary" type="submit" sx={{marginX: "auto"}}>Створити</CustomButton>
      </form>
    </CustomDialog>
  )
}
