import React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import OrderInfo from './OrderInfo'

export default function OrdersList({orders, delivery=false}) {
  return (
    <Grid xs={12} container spacing={1} sx={{p: 0}}>
      {
        orders instanceof Array &&
          orders.map((item, index) =>
            <Grid key={`lotcomponent${index}`} xs={6}>
              <OrderInfo 
                image={item.product.image}
                name={item.product.name}
                price={item.product.cur_price}
                userId={delivery ? item.user.id : item.product.user.id}
                userImage={delivery ? item.user.image : item.product.user.image}
                userFirstName={delivery ? item.user.first_name : item.product.user.first_name}
                userLastName={delivery ? item.user.last_name : item.product.user.last_name}
                label={delivery ? "Замовник" : "Відправник"}
                productId={item.product.id}
                firstName={item.first_name}
                lastName={item.last_name}
                phone={item.phone}
                postName={item.delivery.post.name}
                postOfficeNumber={item.delivery.post_office}
                city={item.delivery.city}
              />
            </Grid>
          )
      }
    </Grid>
  )
}
