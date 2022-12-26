import { CardContent, Avatar, CardHeader } from '@mui/material'
import React from 'react'
import { CustomCard, CustomCardMedia, CustomTypography } from '../../components/CustomMUIComponents/CustomComponents'
import Grid from '@mui/material/Unstable_Grid2'

export default function OrderInfo({image, name, price, productId, userId, userImage, userFirstName, userLastName, label, firstName, lastName, phone, city, postName, postOfficeNumber}) {
  return (
    <CustomCard>
      <CardContent>
        <Grid container spacing={3} sx={{p: 0}}>
          <Grid xs={7}>
            <CustomTypography variant="h6" component="div" sx={{textAlign: "center"}}>{label}</CustomTypography>
            <a href={`/user/${userId}`}>
              <CustomCard sx={{color: "#ECEAEA"}} elevation={0}>
                <CardHeader
                  avatar={
                    <Avatar src={userImage}/>
                  }
                  title={`${userFirstName} ${userLastName}`}
                  sx={{py: 1}}
                />
              </CustomCard>
            </a>
            <CustomTypography variant="subtitle1" component="div" sx={{textAlign: "center", mt: 1.5}}>Контактна інформація</CustomTypography>
            <CustomTypography variant="body2" component="div">{firstName} {lastName}</CustomTypography>
            <CustomTypography variant="body2" component="div">{phone}</CustomTypography>
            <CustomTypography variant="subtitle1" component="div" sx={{textAlign: "center", mt: 1.5}}>Інформація про доставку</CustomTypography>
            <CustomTypography variant="body2" component="div">{city} {postName}</CustomTypography>
            <CustomTypography variant="body2" component="div">Відділення №{postOfficeNumber}</CustomTypography>
          </Grid>
          <Grid xs={5} >
            <a href={`/lot/${productId}`}>
              <CustomCard>
                <CustomCardMedia
                  image={image.replace("\\", "/")}
                  title={`${name} image`}
                />
                <CardContent sx={{mt: -1.5, pb: "0 !important"}}>
                  <CustomTypography variant="h6" component="div">{name}</CustomTypography>
                  <CustomTypography variant="body1" component="div">{price}₴</CustomTypography>
                </CardContent>
              </CustomCard>
            </a>
          </Grid>
        </Grid>
      </CardContent>
    </CustomCard>
  )
}