import React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Review from './Review'

export default function OrdersList({reviews, setReviews}) {
  return (
    <Grid xs={12} container spacing={1} sx={{p: 0}}>
      {
        reviews instanceof Array &&
          reviews.map((item, index) =>
            <Grid key={`lotcomponent${index}`} xs={12}>
              <Review 
                userId={item.user.id}
                image={item.user.image}
                firstName={item.user.first_name}
                lastName={item.user.last_name}
                sellerId={item.seller_id}
                mark={item.mark}
                text={item.text}
                reviews={reviews}
                setReviews={setReviews}
                index={index}
              />
            </Grid>
          )
      }
    </Grid>
  )
}
