import React, { useState } from 'react'
import { CustomDialog, CustomButton, CustomTextField, CustomSelect, CustomMenuItem } from '../../components/CustomMUIComponents/CustomComponents'
import { DialogTitle, OutlinedInput } from '@mui/material'

export default function CreateCommentModal({visibility, setVisibility, id, requestMethod}) {
  const [review, setReview] = useState()
  const [mark, setMark] = useState(true)

  const closeHandler = () => {
    setReview("")
    setVisibility(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        sellerId: id, 
        mark: mark, 
        text: review
      }

      await requestMethod(data)

      closeHandler()
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <CustomDialog open={visibility} onClose={closeHandler} sx={{color: "#1F1F1F"}} className="modal">
      <DialogTitle sx={{color: "#ECEAEA", textAlign: "center", height: "min-content"}}>Залишити відгук</DialogTitle>
      <form onSubmit={e => onSubmit(e)} className="modal__form">
        <CustomTextField 
          label="Відгук" 
          variant="outlined" 
          color="primary"
          value={review}
          onChange={e => setReview(e.target.value)}
          multiline
          rows={5}
        />
        <CustomSelect
          value={mark}
          displayEmpty
          onChange={e => setMark(e.target.value)}
          input={<OutlinedInput />}
          sx={{width: "100%", my: 2}}
          required={true}
        >
          <CustomMenuItem value={true}>
            Рекомендую
          </CustomMenuItem>
          <CustomMenuItem value={false}>
            Не рекомендую
          </CustomMenuItem>
        </CustomSelect>
        <CustomButton variant="contained" color="primary" type="submit" sx={{marginX: "auto"}}>Створити</CustomButton>
      </form>
    </CustomDialog>
  )
}
