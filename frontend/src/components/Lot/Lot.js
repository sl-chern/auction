import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import React from 'react'
import './Lot.css'
import getRemainingDate from '../../utils/getRemainingTime'

export default function Lot({id, image, name, price, betsCount = 0, endDate, startDate}) {

  const CustomCard = styled(Card)(() => ({
    backgroundColor: "#141414"
  }))

  const CustomCardMedia = styled(CardMedia)(() => ({
    aspectRatio: "1 / 1"
  }))

  const CustomTypography = styled(Typography)(() => ({
    color: "#ECEAEA"
  }))

  const CustomGrid = styled(Grid)(() => ({
    padding: 0
  }))

  return (
    <a href={`/lot/${id}`}>
      <div className="lot-component">
        <CustomCard elevation={9}>
          <CustomCardMedia
            image={image}
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
            <CustomTypography sx={{mt: 0.5}} variant="body2" component="div">До кінця: {getRemainingDate(endDate)}</CustomTypography>
          </CardContent>
        </CustomCard>
      </div>
    </a>
  )
}