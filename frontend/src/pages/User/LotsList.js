import React from 'react'
import Lot from '../../components/Lot/Lot'
import Grid from '@mui/material/Unstable_Grid2'

export default function LotsList({lots, isArchived = false}) {
  return (
    <Grid xs={12} container spacing={1} sx={{p: 0}}>
      {
        lots instanceof Array &&
          lots.map((item, index) =>
            <Grid key={`lotcomponent${index}`} xs={3}>
              <Lot
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.cur_price}
                betsCount={item.bets_count}
                endDate={item.end_date}
                startDate={item.start_date}
                isArchived={isArchived}
              />
            </Grid>
          )
      }
    </Grid>
  )
}
