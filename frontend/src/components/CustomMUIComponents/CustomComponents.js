import { Card, MenuItem, Select, TextField, Typography, FormControlLabel, Checkbox, Button, Link, TableCell, Tab, Divider, Dialog } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { styled } from '@mui/material/styles'

export const CustomCard = styled(Card)(() => ({
    backgroundColor: "#141414"
}))

export const CustomTypography = styled(Typography)(() => ({
  color: "#ECEAEA"
}))

export const CustomSelect = styled(Select)(() => ({
  "& .MuiInputBase-input": {
    color: "#ECEAEA",
    border: '1px solid #ECEAEA',
    "&:hover": {
      border: '1px solid #ECEAEA'
    }
  },
  '& .MuiFormLabel-root': {
    transform: "translate(14px, 8px) scale(1);",
    '&.Mui-focused': {
      transform: "translate(14px, -9px) scale(0.75);",
    },
    '&.MuiFormLabel-filled': {
      transform: "translate(14px, -9px) scale(0.75);",
    }
  },
  "& fieldset": {
    border: "0"
  },
  "& .MuiSelect-icon": {
    color: "#ECEAEA"
  },
  "& .MuiPaper-root": {
    backgroundColor: "#1F1F1F"
  }
}))

export const CustomMenuItem = styled(MenuItem)(() => ({
  color: "#ECEAEA",
  "&:hover": {
    backgroundColor: "#141414"
  },
}))

export const CustomTextField = styled(TextField)(() => ({
  width: "100%",
  '& .MuiInputBase-input': {
    color: "#ECEAEA",
  },
  '& label.Mui-focused': {
    color: '#ECEAEA',
  },
  '& label': {
    color: '#ECEAEA',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ECEAEA',
  },
  '& input': {
    color: "#ECEAEA",
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ECEAEA',
    },
    '&:hover fieldset': {
      borderColor: '#ECEAEA',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ECEAEA',
    },
  },
}))

export const CustomFormControlLabel = styled(FormControlLabel)(() => ({
  color: "#ECEAEA"
}))

export const CustomCheckbox = styled(Checkbox)(() => ({
  "& .MuiSvgIcon-root": {
    color: "#ECEAEA"
  }
}))

export const CustomButton = styled(Button)(() => ({
  fontFamily: "Open Sans, sans-serif",
  fontWeight: "600",
  fontSize: "1rem"
}))

export const CustomLink = styled(Link)(() => ({
  color: "#ECEAEA"
}))

export const LowCustomTextField = styled(TextField)(() => ({
  '& label.Mui-focused': {
    color: '#ECEAEA',
  },
  '& label': {
    color: '#ECEAEA',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ECEAEA',
  },
  '& input': {
    color: "#ECEAEA",
    width: "350px",
    padding: "8px"
  },
  '& .MuiFormLabel-root': {
    transform: "translate(14px, 8px) scale(1);",
    '&.Mui-focused': {
      transform: "translate(14px, -9px) scale(0.75);",
    },
    '&.MuiFormLabel-filled': {
      transform: "translate(14px, -9px) scale(0.75);",
    }
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ECEAEA',
    },
    '&:hover fieldset': {
      borderColor: '#ECEAEA',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ECEAEA',
    },
  },
}))

export const CustomTableCell = styled(TableCell)(() => ({
  color: "#ECEAEA",
  fontSize: "1rem",
  border: "none"
}))

export const CustomTab = styled(Tab)(() => ({
  color: "#ECEAEA",
}))

export const CustomDivider = styled(Divider)(() => ({
  backgroundColor: "#ECEAEA",
}))

export const CustomDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    backgroundColor: "#1F1F1F",
    padding: "20px",
    width: "350px"
  }
  
}))

export const CustomDateTimePicker = styled(DateTimePicker)(() => ({
  marginBottom: "14px",
  "& .MuiSvgIcon-root": {
    color: "#ECEAEA",
  }
}))