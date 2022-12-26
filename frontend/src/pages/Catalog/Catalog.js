import React, { useEffect, useState, useRef } from 'react'
import './Catalog.css'
import { Box, CardContent } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import useLotApi from '../../api/lotApi'
import { useSearchParams } from 'react-router-dom'
import { CustomCard, CustomMenuItem, CustomTypography, CustomTextField, CustomFormControlLabel, CustomCheckbox, CustomButton } from '../../components/CustomMUIComponents/CustomComponents'
import Lot from '../../components/Lot/Lot'
import CategorySelect from '../../components/CategorySelect/CategorySelect'

export default function Catalog() {
  const [categories, setCategories] = useState()
  const [lots, setLots] = useState()

  const [selectedCategory, setSelectedCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [auctionStarted, setAuctionStarted] = useState(false)

  const [categoryLoading, setCategoryLoading] = useState(true)

  const [searchParams, setSearchParams] = useSearchParams()

  const lotApi = useLotApi()

  const [errorObj, setErrorObj] = useState({})

  const fetchCategories = async () => {
    setCategoryLoading(true)
    const res = await lotApi.getCategories()
    setCategories(() => res)
    setCategoryLoading(() => false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const selectItems = useRef([])

  useEffect(() => {
    let items = []

    categories instanceof Array &&
      categories.forEach(parentItem => {
        items.push(
          <CustomTypography 
            key={`categorytypography${parentItem.id}`}
            sx={{paddingX: "15px"}} 
            variant="body1" 
            component="div"
          >
            {parentItem.name}
          </CustomTypography>
        )

        parentItem.child_categories.forEach(item => {
          items.push(
            <CustomMenuItem key={`category${item.id}`} sx={{ pl: 4 }} value={item.id}>
              {item.name}
            </CustomMenuItem>
          )
        })
      })

    selectItems.current = items
  }, [categories])

  useEffect(() => {
    if(!categoryLoading) {
      const filterParams = Object.fromEntries([...searchParams])

      if(filterParams.category)
        setSelectedCategory(() => parseInt(filterParams.category))
      if(filterParams.started && filterParams.started === "true")
        setAuctionStarted(() => true)
      if(filterParams.min_price)
        setMinPrice(() => parseFloat(filterParams.min_price).toFixed(2))
      if(filterParams.max_price)
        setMaxPrice(() => parseFloat(filterParams.max_price).toFixed(2))

      fetchProducts()
    }
  }, [searchParams, categoryLoading])

  const setPrice = (e, setState) => {
    setErrorObj({})
    if(!isNaN(e.target.value))
      setState(e.target.value)
  }

  const reset = () => {
    setSelectedCategory("")
    setMinPrice("")
    setMaxPrice("")
    setAuctionStarted(false)
  }

  const filter = () => {
    const filterParams = {}

    if(minPrice !== "" && maxPrice !== "" && minPrice > maxPrice) {
      setErrorObj({
        error: "error",
        helperText: "MinPrice > MaxPrice"
      })
      return
    }

    if(selectedCategory !== "")
      filterParams.category = selectedCategory
    if(auctionStarted)
      filterParams.started = true
    if(minPrice !== "")
      filterParams.min_price = minPrice
    if(maxPrice !== "")
      filterParams.max_price = maxPrice

    setSearchParams(filterParams)
  }

  const fetchProducts = async () => {
    let data = {}

    if(selectedCategory !== "")
      data.category = selectedCategory
    if(auctionStarted)
      data.auctionStarted = true
    if(minPrice !== "")
      data.minPrice = minPrice
    if(maxPrice !== "")
      data.maxPrice = maxPrice

    const res = await lotApi.getLots(data)

    setLots(res)
  }

  return (
    <Box sx={{ mt: 1, width: "100%" }} className={`catalog`}>
      <Grid container spacing={2}>
        <Grid xs={9} container spacing={1}>
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
                  />
                </Grid>
              )
          }
        </Grid>
        <Grid xs={3}>
          <CustomCard>
            <CardContent>
              <CustomTypography variant="h5" component="div">Фільтри</CustomTypography>
              <Box sx={{mt: 1}}>
                <CustomTypography variant="subtitle1" component="div">Категорія</CustomTypography>
                <CategorySelect 
                  value={selectedCategory}
                  setValue={setSelectedCategory}
                  setLoading={setCategoryLoading}
                />
              </Box>
              <Box sx={{mt: 1}}>
                <CustomTypography sx={{mb: 0.7}} variant="subtitle1" component="div">Ціна</CustomTypography>
                <CustomTextField 
                  {...errorObj}
                  label="Мінімальна ціна" 
                  variant="outlined" 
                  color="primary"
                  value={minPrice}
                  onChange={e => setPrice(e, setMinPrice)}
                />
                <CustomTextField 
                  {...errorObj}
                  sx={{mt: 1.5}}
                  label="Максимальна ціна" 
                  variant="outlined" 
                  color="primary"
                  value={maxPrice}
                  onChange={e => setPrice(e, setMaxPrice)}
                />
              </Box>
              <Box sx={{mt: 1}}>
                <CustomTypography variant="subtitle1" component="div">Інше</CustomTypography>
                <CustomFormControlLabel 
                  control={
                    <CustomCheckbox 
                      checked={auctionStarted}
                      onChange={e => setAuctionStarted(e.target.checked)}
                    />
                  } 
                  label="Торги вже почались" 
                />
              </Box>
              <Grid sx={{ p: 0, mt: 1 }} container xs={12}>
                <Grid mdOffset={0}>
                  <CustomButton sx={{p:1}} variant="outlined" color="primary" type="button" onClick={() => filter()}>Фільтрувати</CustomButton>
                </Grid>
                <Grid md="auto" mdOffset="auto">
                  <CustomButton sx={{p:1}} variant="outlined" color="primary" type="button" onClick={() => reset()}>Скинути</CustomButton>
                </Grid>
              </Grid>
            </CardContent>
          </CustomCard>
        </Grid>
      </Grid>
    </Box>
  )
}