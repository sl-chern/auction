import React, { useRef, useState } from 'react'
import { Button, Avatar, ButtonGroup } from '@mui/material'
import { styled } from '@mui/material/styles'
import useOutsideClickDetector from '../../hooks/useOutsideClickDetector'
import useUserApi from '../../api/userApi'

export default function AccountMenu({image, firstName}) {
  const [optionsVisibility, setOptionsVisibility] = useState(false)

  const userApi = useUserApi()

  const CustomButton = styled(Button)(({theme}) => ({
    fontFamily: "Open Sans, sans-serif",
    fontWeight: "600",
    fontSize: "1rem",
    textAlign: "left",
    width: "100%"
  }))

  const CustomButtonGroup = styled(ButtonGroup)(() => ({
    width: "100%"
  }))

  const optionsRef = useRef()
  const buttonRef = useRef()

  useOutsideClickDetector(optionsRef, buttonRef, () => {
    setOptionsVisibility(false)
  })

  return (
    <div className="header-content__account-menu">
      <Button
        color="primary"
        startIcon={<Avatar src={image} />}
        onClick={() => setOptionsVisibility(true)}
        ref={buttonRef}
      >
        {firstName}
      </Button>
      {
        optionsVisibility &&
          <div className="header-content__options-buttons" ref={optionsRef}>
            <CustomButtonGroup
              orientation="vertical"
              aria-label="vertical contained button group"
            >
              <CustomButton variant="contained" color="secondary" key="one">Профіль</CustomButton>
              <CustomButton variant="contained" color="secondary" key="two" onClick={() => userApi.logout()}>Вийти</CustomButton>
            </CustomButtonGroup>
          </div>
      }
    </div>
  )
}
