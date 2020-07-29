import React, { FC } from 'react'
import Button, { ButtonProps } from '@material-ui/core/Button'

const CustomButton: FC<ButtonProps> = (props) => {
  return <Button disableRipple disableTouchRipple {...props} />
}

export default CustomButton
