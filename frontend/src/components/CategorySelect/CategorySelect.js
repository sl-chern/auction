import React, { useState, useEffect, useRef } from 'react'
import useLotApi from '../../api/lotApi'
import { FormControl, OutlinedInput } from '@mui/material'
import { CustomSelect, CustomMenuItem, CustomTypography } from '../CustomMUIComponents/CustomComponents'

export default function CategorySelect({value, setValue, setLoading, sx = {}}) {
  const lotApi = useLotApi()

  const [categories, setCategories] = useState()

  const fetchCategories = async () => {
    if(setLoading)
      setLoading(true)
    const res = await lotApi.getCategories()
    setCategories(() => res)
    if(setLoading)
      setLoading(() => false)
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

  return (
    <FormControl sx={{width: "100%", ...sx}}>
      <CustomSelect
        value={value}
        displayEmpty
        onChange={e => setValue(e.target.value)}
        input={<OutlinedInput />}
      >
        <CustomMenuItem value="">
          Обрати
        </CustomMenuItem>
        {selectItems.current}
      </CustomSelect>
    </FormControl>
  )
}
