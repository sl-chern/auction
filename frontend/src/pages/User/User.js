import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useUserApi from '../../api/userApi'
import './User.css'
import Grid from '@mui/material/Unstable_Grid2'
import { Box, Avatar } from '@mui/material'
import { CustomTypography, CustomTab, CustomDivider, CustomButton } from '../../components/CustomMUIComponents/CustomComponents'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useSelector } from 'react-redux'
import { selectId } from '../../store/reducers/UserSlice'
import useLotApi from '../../api/lotApi'
import LotsList from './LotsList'
import UserSettings from './UserSettings'
import LotCreatingModal from './LotCreatingModal'

export default function User() {
  const { id } = useParams()

  const userId = useSelector(selectId)

  const userApi = useUserApi()
  const lotApi = useLotApi()

  const [user, setUser] = useState()

  const [currentTab, setCurrentTab] = useState("1")

  const [lots, setLots] = useState()
  const [archivedLots, setArchivedLots] = useState()

  const [visibility, setVisibility] = useState(false)
  const [visibilityOfCreating, setVisibilityOfCreating] = useState(false)

  const fetchUser = async () => {
    const res = await userApi.getUser(id)
    setUser(res)
  }

  const fetchLots = async (filters, setData) => {
    const res = await lotApi.getLots(filters)
    setData(res)
  }

  useEffect(() => {
    fetchUser()
    fetchLots({userId: id}, setLots)
    fetchLots({userId: id, isArchived: true}, setArchivedLots)
  }, [id])

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  }

  return (
    <Box sx={{ mt: 1, width: "100%" }} className="user-content">
      <Grid container spacing={4}>
        <Grid xs={2.5}>
          <Avatar sx={{ width: "100%", height: "auto" }} variant="rounded" src={user?.image}/>
          <CustomButton sx={{width: "100%", mt: 2}} variant="contained" color="primary" onClick={() => setVisibility(true)}>Редагування профілю</CustomButton>
          <CustomButton sx={{width: "100%", mt: 2}} variant="contained" color="primary" onClick={() => setVisibilityOfCreating(true)}>Створити лот</CustomButton>
        </Grid>
        <Grid xs={9.5}>
          <CustomTypography variant="h3" component="div">{user?.first_name} {user?.last_name}</CustomTypography>
          <CustomTypography variant="subtitle1" component="div">Email: {user?.email}</CustomTypography>
          <CustomTypography variant="subtitle1" component="div">Номер телефону: {user?.phone || "Невказаний"}</CustomTypography>
          <CustomDivider sx={{my: 3}}/>
          <Box sx={{ width: "100%" }}>
            <TabContext value={currentTab}>
              <Box>
                  {
                    id == userId ?
                      <TabList onChange={handleChange}>
                        <CustomTab label="Лоти" value="1" />
                        <CustomTab label="Лоти (в архіві)" value="2" />
                        <CustomTab label="Замовлення (відправник)" value="3" />
                        <CustomTab label="Замовлення (покупець)" value="4" />
                      </TabList>
                    :
                      <TabList onChange={handleChange}>
                        <CustomTab label="Лоти" value="1" />
                      </TabList>
                  } 
              </Box>
              <TabPanel sx={{px: 0}} value="1">
                <LotsList lots={lots}/>
              </TabPanel>
              <TabPanel sx={{px: 0}} value="2">
                <LotsList lots={archivedLots} isArchived={true}/>
              </TabPanel>
              <TabPanel sx={{px: 0}} value="3">Item Three</TabPanel>
              <TabPanel sx={{px: 0}} value="4">Item Three</TabPanel>
            </TabContext>
          </Box>
          <UserSettings 
            visibility={visibility} 
            setVisibility={setVisibility} 
            id={userId} 
            setUser={setUser}
          />
          <LotCreatingModal
            visibility={visibilityOfCreating} 
            setVisibility={setVisibilityOfCreating} 
          />
        </Grid>
      </Grid>
    </Box>
  )
}
