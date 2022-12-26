import React, { useRef } from 'react'
import './Header.css'
import { useNavigate } from "react-router-dom"
import { CustomButton, LowCustomTextField } from '../CustomMUIComponents/CustomComponents'
import { useGoogleLogin } from '@react-oauth/google'
import useUserApi from '../../api/userApi'
import { useSelector } from 'react-redux'
import { selectFirstName, selectId, selectImage, selectIsLoading } from '../../store/reducers/UserSlice'
import AccountMenu from './AccountMenu'
import Grid from '@mui/material/Unstable_Grid2'

export default function Header() {
  const navigate = useNavigate()

  const userId = useSelector(selectId)
  const userFirstName = useSelector(selectFirstName)
  const userImage = useSelector(selectImage)

  const isUserLoading = useSelector(selectIsLoading)

  const userApi = useUserApi()

  const signIn = useGoogleLogin({
    onSuccess: async credentialResponse => userApi.authenticate(credentialResponse.access_token)
  })

  const nameRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()

    if(nameRef.current.length > 0){
      navigate(`/catalog?name=${nameRef.current}`)
      nameRef.current = ""
    }
  }

  return (
    <header>
      <div className="header-content">
        <div className="header-content__logo-block" onClick={() => navigate('/')}>
          <p className="header-content__name-text">Auction</p>
        </div>

        <nav>
          <form onSubmit={e => handleSubmit(e)}>
            <Grid container spacing={1}>
              <Grid>
                <LowCustomTextField
                  label="Пошук" 
                  variant="outlined" 
                  color="primary"
                  value={nameRef.current}
                  onChange={e => nameRef.current = e.target.value}
                />
              </Grid>
              <Grid>
                <CustomButton variant="outlined" color="primary" type="submit">
                  Шукати
                </CustomButton>
              </Grid>
              <Grid>
                <CustomButton variant="contained" color="primary" type="button" onClick={() => navigate("/catalog")}>
                  Каталог
                </CustomButton>
              </Grid>
            </Grid>
          </form>
        </nav>

        <div>
          {
            !isUserLoading &&
              userId === null ?
                <CustomButton variant="contained" color="primary" onClick={() => signIn()}>
                  Увійти
                </CustomButton>
              :
                <AccountMenu firstName={userFirstName} image={userImage}/>
          }
        </div>
      </div>
    </header>
  )
}
