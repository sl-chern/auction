import React, { useState, useEffect } from 'react'
import './Order.css'
import Grid from '@mui/material/Unstable_Grid2'
import { Box, CardContent, CardHeader, Avatar, OutlinedInput } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useOrderApi from '../../api/orderApi'
import { useForm, useFormState } from 'react-hook-form'
import FormField from '../../components/FormField/FormField'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomCard, CustomTypography, CustomCardMedia, CustomSelect, CustomMenuItem, CustomButton } from '../../components/CustomMUIComponents/CustomComponents'
import useLotApi from '../../api/lotApi'

export default function Order() {
  const orderApi = useOrderApi()
  const lotApi = useLotApi()

  const navigate = useNavigate()

  const [lot, setLot] = useState()
  
  const { id } = useParams()

  const [selectedPostType, setSelectedPostType] = useState("")

  useEffect(() => {
    fetchLot()
  }, [id])

  const fetchLot = async () => {
    const res = await lotApi.getLot(id)
    setLot(res)
  }

  const schema = yup.object().shape({
    firstName: yup.string("Ім'я повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").required("Обов'язкове поле"),
    lastName: yup.string("Прізвище повинно бути строкою").min(2, "Ім'я повинно бути довше 2 букв").required("Обов'язкове поле"),
    phone: yup.string("Телефон повинен бути строкою").min(13, "Телефон повинен бути 13 символів у довжину").max(13, "Телефон повинен бути 13 символів у довжину").required("Обов'язкове поле"),
    city: yup.string("Місто повинно бути строкою").min(2, "Місто повинно бути довше 2 букв").required("Обов'язкове поле"),
    postOffice: yup
      .number()
      .typeError("Номер відділення повинен бути числом")
      .integer("Номер відділення повинен бути цілим числом")
      .required("Обов'язкове поле"),
  })

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })
  const { errors } = useFormState({control})

  const onSubmit = async (data) => {
    try {
      let orderInfo = {
        ...data,
        productId: id,
        postType: selectedPostType,
        deliveryPrice: 100
      }

      await orderApi.createOrder(orderInfo)

      navigate("/")
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <Box sx={{ mt: 1, width: "60%", mx: "auto" }} className="order-content">
      <CustomTypography variant="h4" component="div" sx={{ mx: "auto", width: "max-content", mb: 3 }}>Оформлення замовлення</CustomTypography>
      <Grid container spacing={4}>
        <Grid xs={6}>
          <form onSubmit={handleSubmit(onSubmit)} className="order-content__form">
            <CustomTypography variant="h5" component="div" sx={{ mx: "auto", width: "max-content", mb: 1 }}>Контактна інформація</CustomTypography>
            <FormField
              control={control}
              name="firstName"
              label="Ім'я"
              helperText={errors.firstName?.message}
            />
            <FormField
              control={control}
              name="lastName"
              label="Прізвище"
              helperText={errors.lastName?.message}
            />
            <FormField
              control={control}
              name="phone"
              label="Телефон"
              helperText={errors.phone?.message}
            />
            <CustomTypography variant="h5" component="div" sx={{ mx: "auto", width: "max-content", mb: 1 }}>Інформація про доставку</CustomTypography>
            <CustomSelect
              value={selectedPostType}
              displayEmpty
              onChange={e => setSelectedPostType(e.target.value)}
              input={<OutlinedInput />}
              sx={{width: "100%", mb: 2}}
              required={true}
            >
              <CustomMenuItem value="">
                Обрати
              </CustomMenuItem>
              <CustomMenuItem value={1}>
                Нова пошта
              </CustomMenuItem>
              <CustomMenuItem value={2}>
                Укр пошта
              </CustomMenuItem>
            </CustomSelect>
            <FormField
              control={control}
              name="city"
              label="Місто"
              helperText={errors.city?.message}
            />
            <FormField
              control={control}
              name="postOffice"
              label="Номер відділення пошти"
              helperText={errors.postOffice?.message}
            />
            <CustomButton variant="contained" color="primary" type="submit" sx={{marginX: "auto"}}>Оформити</CustomButton>
          </form>
        </Grid>
        <Grid xs={6}>
          <CustomCard elevation={9}>
            <CustomCardMedia
              image={lot?.image.replace("\\", "/")}
              title={`${lot?.name} image`}
            />
            <CardContent sx={{mt: -1.5}}>
              <CustomTypography variant="h6" component="div">{lot?.name}</CustomTypography>
              <CustomTypography variant="subtitle2" component="div">{lot?.cur_price}₴</CustomTypography>
              <CustomTypography variant="subtitle2" component="div">Місцезнаходження лоту: {lot?.location}</CustomTypography>
              <CustomTypography variant="subtitle1" component="div" sx={{mt: 2}}>Продавець:</CustomTypography>
              <a href={`/user/${lot?.user?.id}`}>
                <CustomCard sx={{color: "#ECEAEA"}} elevation={0}>
                  <CardHeader
                    avatar={
                      <Avatar src={lot?.user?.image}/>
                    }
                    title={`${lot?.user?.first_name} ${lot?.user?.last_name}`}
                  />
                </CustomCard>
              </a>
            </CardContent>
          </CustomCard>
        </Grid>
      </Grid>
    </Box>
  )
}
