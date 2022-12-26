import React, { useState } from 'react'
import { CustomDialog, CustomButton, CustomTextField, CustomSelect, CustomMenuItem } from '../../components/CustomMUIComponents/CustomComponents'
import { DialogTitle, OutlinedInput } from '@mui/material'
import useOrderApi from '../../api/orderApi'

export default function UpdateCommentModal({visibility, setVisibility, id, text, userMark, reviews, setReviews, index}) {
  const orderApi = useOrderApi()

  const [review, setReview] = useState(text)
  const [mark, setMark] = useState(() => userMark)

  const closeHandler = () => {
    setReview(text)
    setMark(() => userMark)
    setVisibility(false)
  }

  const updateReviews = () => {
    let newReviews = [...reviews]
    newReviews[index] = {
      ...newReviews[index],
      mark: mark,
      text: review
    }
    setReviews(newReviews)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        sellerId: id, 
        mark: mark, 
        text: review
      }

      await orderApi.updateReview(data)

      updateReviews()
      closeHandler()
    }
    catch(err) {
      console.log(err)
    }
  }

  return (
    <CustomDialog open={visibility} onClose={closeHandler} sx={{color: "#1F1F1F"}} className="modal">
      <DialogTitle sx={{color: "#ECEAEA", textAlign: "center", height: "min-content"}}>Редагувати відгук</DialogTitle>
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
        <CustomButton variant="contained" color="primary" type="submit" sx={{marginX: "auto"}}>Редагувати</CustomButton>
      </form>
    </CustomDialog>
  )
}