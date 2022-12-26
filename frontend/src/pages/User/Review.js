import { CardContent } from '@mui/material'
import React, { useState } from 'react'
import { CustomButton, CustomCard, CustomTypography } from '../../components/CustomMUIComponents/CustomComponents'
import { Avatar, CardHeader } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import UpdateCommentModal from './UpdateCommentModal'
import useOrderApi from '../../api/orderApi'
import { useSelector } from 'react-redux'
import { selectId } from '../../store/reducers/UserSlice'

export default function Review({userId, image, firstName, lastName, sellerId, mark, text, reviews, setReviews, index}) {
  const orderApi = useOrderApi()

  const uId = useSelector(selectId)
  
  const [visibilityOfReview, setVisibilityOfReview] = useState(false)

  const deleteReview = async () => {
    try {
      await orderApi.deleteReview(sellerId)

      let newReviews = [...reviews]
      newReviews = newReviews.filter((item, ind) => ind !== index)
      setReviews(newReviews)
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <CustomCard>
      <CardContent sx={{p: "10px !important"}}>
        <Grid container spacing={4} sx={{p: "0 !important", }}>
          <Grid xs={4}>
            <a href={`/user/${userId}`}>
              <CustomCard sx={{color: "#ECEAEA"}} elevation={0}>
                <CardHeader 
                  avatar={
                    <Avatar src={image}/>
                  }
                  title={`${firstName} ${lastName}`}
                  sx={{p: 0}}
                />
              </CustomCard>
            </a>
          </Grid>
          <Grid xs="auto" xsOffset="auto">
            {
              userId === uId &&
                <>
                  <CustomButton sx={{mr: 2}} variant="outlined" color="primary" onClick={() => setVisibilityOfReview(true)}>Редагувати</CustomButton>
                  <CustomButton variant="outlined" color="primary" onClick={() => deleteReview()}>Видалити</CustomButton>
                </>
            }
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{p: 1, mt: -3}}>
          <Grid xs={1} sx={{textAlign: "center"}}>
            {
              mark ?
                <ThumbUpAltIcon color="primary" fontSize="large"/>
              :
                <ThumbDownAltIcon color="primary" fontSize="large"/>
            }
          </Grid>
          <Grid xs={11}>
            <CustomTypography variant="body2" component="div">{text}</CustomTypography>
          </Grid>
        </Grid>
      </CardContent>
      <UpdateCommentModal
        visibility={visibilityOfReview} 
        setVisibility={setVisibilityOfReview} 
        id={sellerId}
        text={text}
        userMark={mark}
        reviews={reviews}
        setReviews={setReviews}
        index={index}
      />
    </CustomCard>
  )
}
