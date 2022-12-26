import { CardContent, CardMedia, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import React from 'react'
import './Lot.css'
import getRemainingDate from '../../utils/getRemainingTime'
import { CustomCard } from '../CustomMUIComponents/CustomComponents'
import getStringDate from '../../utils/getStringDate'

export default function Lot({id, image, name, price, betsCount = 0, endDate, isArchived = false}) {
  const CustomCardMedia = styled(CardMedia)(() => ({
    aspectRatio: "1 / 1"
  }))

  const CustomTypography = styled(Typography)(() => ({
    color: "#ECEAEA"
  }))

  const CustomGrid = styled(Grid)(() => ({
    padding: 0
  }))

  console.log(image);

  return (
    <a href={`/lot/${id}`}>
      <div className="lot-component">
        <CustomCard elevation={9}>
          <CustomCardMedia
            image={image.replace("\\", "/")}
            title={`${name} image`}
          />
          <CardContent sx={{mt: -1.5}}>
            <CustomTypography variant="h6" component="div">{name}</CustomTypography>
            <Grid container>
              <CustomGrid xs={6}>
                <CustomTypography variant="body1" component="div">{price}₴</CustomTypography>
              </CustomGrid>
              <CustomGrid xs={6}>
                <CustomTypography variant="body1" component="div">Ставок: {betsCount}</CustomTypography>
              </CustomGrid>
            </Grid>
            <CustomTypography sx={{mt: 0.5}} variant="body2" component="div">
              {
                isArchived ? 
                  `Закінчився: ${getStringDate(endDate).slice(0, -5)}`
                :
                  `До кінця: ${getRemainingDate(endDate)}`
              }
            </CustomTypography>
          </CardContent>
        </CustomCard>
      </div>
    </a>
  )
}