import React, { useState, useEffect } from 'react'
import './Order.css'
import Grid from '@mui/material/Unstable_Grid2'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import useOrderApi from '../../api/orderApi'
import { useForm, useFormState } from 'react-hook-form'
import FormField from '../../components/FormField/FormField'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { CustomTypography } from '../../components/CustomMUIComponents/CustomComponents'
import useLotApi from '../../api/lotApi'

export default function Order() {
  const params = useParams()

  const orderApi = useOrderApi()
  const lotApi = useLotApi()

  const [lot, setLot] = useState()
  
  const { id } = useParams()

  useEffect(() => {
    fetchLot()
  }, [id])

  const fetchLot = async () => {
    const res = await lotApi.getLot(id)
    setLot(res)
  }

  const schema = yup.object().shape({
    
  })

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  })
  const { errors } = useFormState({control})

  const onSubmit = async (data) => {
    try {
      
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <Box sx={{ mt: 1, width: "60%", mx: "auto" }} className="order-content">
      <Grid container spacing={4}>
        <Grid xs={6}>
          <CustomTypography variant="h5" component="div" sx={{ mx: "auto", width: "min-content" }}>Замовлення</CustomTypography>
        </Grid>
        <Grid xs={6}>
          
        </Grid>
      </Grid>
    </Box>
  )
}
