import React, { useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import './Home.css'
import useLotApi from '../../api/lotApi'
import Lot from '../../components/Lot/Lot'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function Home() {
  const CustomTypography = styled(Typography)(() => ({
    color: "#ECEAEA"
  }))

  const lotApi = useLotApi()

  const [soonEnd, setSoonEnd] = useState()
  const [started, setStarted] = useState()

  const getLotsOrderedByEndDate = async () => {
    const res = await lotApi.getAuctionEnd()
    setSoonEnd(res)
  }

  const getLotsOrderedByStartDate = async () => {
    const res = await lotApi.getAuctionStart()
    setStarted(res)
  }

  useEffect(() => {
    getLotsOrderedByEndDate()
    getLotsOrderedByStartDate()
  }, [])

  return (
    <Box sx={{ mt: 1, width: "100%" }} className="home-content">
      <Grid container columnSpacing={2} direction="column">
        <Grid xs={12}>
          <CustomTypography variant="h5" gutterBottom>Торги закінчуються</CustomTypography>
        </Grid>

        <Grid xs={12}>
          <Swiper
            slidesPerView={5}
            speed={500}
          >
            {
              soonEnd instanceof Array &&
                soonEnd.map((item, index) => 
                  <SwiperSlide key={`lotcomponent${index}`}>
                    <Lot
                      id={item.id}
                      image={item.image}
                      name={item.name}
                      price={item.cur_price}
                      betsCount={item.bets_count}
                      endDate={item.end_date}
                      startDate={item.start_date}
                    />
                  </SwiperSlide>
                )
            }
          </Swiper>
        </Grid>

        <Grid xs={12} sx={{mt: 1}}>
          <CustomTypography variant="h5" gutterBottom>Торги тільки розпочались</CustomTypography>
        </Grid>

        <Grid xs={12}>
          <Swiper
            slidesPerView={5}
            speed={500}
          >
            {
              started instanceof Array &&
                started.map((item, index) => 
                  <SwiperSlide key={`lotcomponent${index}`}>
                    <Lot
                      id={item.id}
                      image={item.image}
                      name={item.name}
                      price={item.cur_price}
                      betsCount={item.bets_count}
                      endDate={item.end_date}
                      startDate={item.start_date}
                    />
                  </SwiperSlide>
                )
            }
          </Swiper>
        </Grid>
      </Grid>
    </Box>
  )
}
