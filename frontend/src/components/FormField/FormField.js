import React from 'react'
import { Controller } from "react-hook-form"
import { CustomTextField, CustomDateTimePicker } from '../CustomMUIComponents/CustomComponents'

export default function FormField({control, name, label, helperText, dateTime = false, multiline = {}}) {
  if(dateTime)
    return (
      <Controller 
        control={control}
        name={name}
        render={({ field }) => 
          <CustomDateTimePicker 
            label={label}
            fullWidth={true}
            variant="outlined" 
            color="primary"
            onChange={e => field.onChange(e)}
            onBlur={e => field.onBlur(e)}
            value={field.value}
            error={!!helperText}
            helperText={helperText}
            required={false}
            renderInput={(params) => <CustomTextField {...params} />}
            minDate={new Date()}
          />
        }
      />
    )

  return (
    <Controller 
      control={control}
      name={name}
      render={({ field }) => 
        <CustomTextField 
          label={label}
          fullWidth={true}
          variant="outlined" 
          color="primary"
          onChange={e => field.onChange(e)}
          onBlur={e => field.onBlur(e)}
          value={field.value}
          sx={{mb: 2}}
          error={!!helperText}
          helperText={helperText}
          required={false}
          {...multiline}
        />
      }
    />
  )
}
