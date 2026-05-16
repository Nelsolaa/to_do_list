import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './index.css'

type ButtonProps = {
  children: ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
} 

function Button(componenteProps: ButtonProps) {
  const { children, type = 'button', ...buttonProps } = componenteProps

  return (
    <button
      {...buttonProps}
      type={type}
      className="flip-card__btn"
    >
      {children}
    </button>
  )
}

export default Button
