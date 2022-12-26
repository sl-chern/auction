import React, { useState, useEffect } from 'react'
import "./Lot.css"
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Box, CardHeader, Divider, TableContainer, TableRow, TableHead, TableBody } from '@mui/material'
import useLotApi from '../../api/lotApi'
import { CustomLink, CustomTypography, CustomButton, LowCustomTextField, CustomCard, CustomTableCell } from '../../components/CustomMUIComponents/CustomComponents'
import getStringDate from '../../utils/getStringDate'
import useOrderApi from '../../api/orderApi'
import { useSelector } from 'react-redux'
import { selectFirstName, selectId, selectLastName, selectPhone } from '../../store/reducers/UserSlice'
import UpdateLotModal from "./UpdateLotModal"

export default function Lot() {
  const lotApi = useLotApi()
  const orderApi = useOrderApi()

  const navigate = useNavigate()

  const userId = useSelector(selectId)
  const firstName = useSelector(selectFirstName)
  const lastName = useSelector(selectLastName)

  const [bet, setBet] = useState("")

  const { id } = useParams()

  const [lot, setLot] = useState()
  const [bets, setBets] = useState()

  const [visibility, setVisibility] = useState(false)

  const phone = useSelector(selectPhone)

  useEffect(() => {
    fetchLot()
    fetchBets()
  }, [id])

  const fetchLot = async () => {
    const res = await lotApi.getLot(id)
    setLot(res)
  }

  const fetchBets = async () => {
    const res = await lotApi.getBets(id)
    setBets(res)
  }

  const setPrice = (e, setState) => {
    if(!isNaN(e.target.value))
      setState(e.target.value)
  }

  const createBet = async () => {
    try {
      const data = {
        product_id: id,
        price: bet
      }

      const res = await orderApi.createBet(data)

      setBets(() => [{
        user: {
          id: userId,
          first_name: firstName,
          last_name: lastName
        },
        id: res.bet_id,
        price: bet,
        date: new Date()
      }, ...bets])

      setLot({
        ...lot,
        cur_price: bet
      })

      setBet("")
    }
    catch(err) {
      console.log(err)
    } 
  }

  const deleteBet = async (id) => {
    try {
      await orderApi.deleteBet(id)

      setLot(() => {
        if(bets.length > 1)
          return {
            ...lot,
            cur_price: bets[1].price
          }
        else
          return {
            ...lot,
            cur_price: lot.start_price
          }
      })

      setBets([...bets].slice(1))
    }
    catch(err) {
      console.log(err)
    }
  }

  const deleteLot = async () => {
    try{
      await lotApi.deleteLot(id)
      navigate('/')
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <Box sx={{ mt: 1, width: "100%" }} className="lot-content">
      <Grid container spacing={6}>
        <Grid xs={4}>
          <Avatar sx={{ width: "100%", height: "auto" }} variant="rounded" src={lot?.image}/>
          <CustomTypography variant="h6" component="div" sx={{mt: 2, mb: 1}}>Продавець:</CustomTypography>
          <a href={`/user/${lot?.user?.id}`}>
            <CustomCard sx={{color: "#ECEAEA"}}>
              <CardHeader
                avatar={
                  <Avatar src={lot?.user?.image}/>
                }
                title={`${lot?.user?.first_name} ${lot?.user?.last_name}`}
              />
            </CustomCard>
          </a>
          {
            lot?.user?.id === userId &&
              <CustomButton sx={{width: "100%", mt: 2}} variant="contained" color="primary" onClick={() => setVisibility(true)}>Редагування лоту</CustomButton>
          }
          {
            lot?.user?.id === userId &&
              <CustomButton sx={{width: "100%", mt: 2}} variant="contained" color="primary" onClick={() => deleteLot()}>Видалити лот</CustomButton>
          }
          {
            bets instanceof Array && bets[0].user_id === userId && new Date(lot?.end_date) < new Date() &&
              <CustomButton sx={{width: "100%", mt: 2}} variant="contained" color="primary" onClick={() => navigate(`/order/${1}`)}>Оформити замовлення</CustomButton>
          }
        </Grid>
        <Grid xs={8}>
          <CustomTypography variant="h3" component="div">{lot?.name}</CustomTypography>
          <CustomTypography variant="h6" component="span">Категорія: </CustomTypography>
          <CustomLink underline="hover" variant="h6" href={`/catalog?category=${lot?.category?.id}`}>{lot?.category?.name}</CustomLink>
          <Divider sx={{my: 3}}/>
          <Grid container xs={12} sx={{ p: 0 }} alignItems="center">
            <Grid xs="auto">
              <CustomTypography variant="body2" component="div">Ціна:</CustomTypography>
              <CustomTypography variant="h5" component="div">{lot?.cur_price} грн</CustomTypography>
            </Grid>
            <Grid xs="auto" sx={{pr: 1}}>
              <LowCustomTextField 
                label="Ваша ставка" 
                variant="outlined" 
                color="primary"
                value={bet}
                onChange={e => setPrice(e, setBet)}
                sx={{width: "140px"}}
                disabled={userId === lot?.user?.id || !phone || new Date(lot?.start_date) > new Date() || new Date(lot?.end_date) < new Date()}
              />
            </Grid>
            <Grid xs="auto" sx={{pl: 1}}>
              <CustomButton variant="outlined" color="primary" onClick={() => createBet()} disabled={userId === lot?.user?.id || !phone || new Date(lot?.start_date) > new Date() || new Date(lot?.end_date) < new Date()}>Зробити ставку</CustomButton>
            </Grid>
          </Grid>
          <Divider sx={{my: 3}}/>
          <CustomTypography variant="h6" component="div">Місцезнаходження: {lot?.location}</CustomTypography>
          <CustomTypography variant="h6" component="div">Опис:</CustomTypography>
          <CustomTypography variant="body1" component="div">{lot?.description}</CustomTypography>
          <Divider sx={{my: 3}}/>
          <CustomTypography variant="h6" component="div">Ставки:</CustomTypography>
          <TableContainer sx={{fontSize: "1rem", minWidth: "100%"}}>
            <TableHead sx={{fontSize: "1rem", minWidth: "100%"}}>
              <TableRow>
                <CustomTableCell>Користувач</CustomTableCell>
                <CustomTableCell align="right">Ставка</CustomTableCell>
                <CustomTableCell align="right">Дата</CustomTableCell>
                <CustomTableCell align="right"></CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{fontSize: "1rem", minWidth: "750px"}}>
              {
                bets instanceof Array && 
                  bets.map((item, index) => 
                    <TableRow key={`betstablerow${index}`}>
                      <CustomTableCell sx={{mr: 10}}>{item.user.first_name} {item.user.last_name}</CustomTableCell>
                      <CustomTableCell align="right">{item.price} грн</CustomTableCell>
                      <CustomTableCell align="right">{getStringDate(item.date)}</CustomTableCell>
                      <CustomTableCell align="right">
                        {
                          index === 0 && item.user?.id === userId ?
                            <CustomButton variant="outlined" color="primary" onClick={() => deleteBet(item.id)}>Видалити</CustomButton>
                          :
                            null
                        }
                      </CustomTableCell>
                    </TableRow>
                  )
              }
            </TableBody>
          </TableContainer>
        </Grid>
      </Grid>
      <UpdateLotModal
        visibility={visibility}
        setVisibility={setVisibility}
        id={id}
        setLot={setLot}
      />
    </Box>
  )
}
