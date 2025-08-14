import React from 'react'
import NumberFlow, { continuous } from '@number-flow/react'
import styles from './NumberFlowContainer.module.css'
import Spinner from '../Spinner'

function NumberFlowContainer({ color, fontSize, fontWeight, maskHeight, maskWidth, value }) {
  const styleVariables = {
    ...(color && { '--number-flow-color': color }),
    ...(fontSize && { '--number-flow-font-size': fontSize }),
    ...(fontWeight && { '--number-flow-font-weight': fontWeight }),
    ...(maskHeight && { '--number-flow-mask-height': maskHeight }),
    ...(maskWidth && { '--number-flow-mask-width': maskWidth }),
  }

  const isValidValue = Number.isFinite(value)

  return (
    <div className={styles.wrapper} style={styleVariables}>
      {isValidValue ? <NumberFlow plugins={[continuous]} value={value} /> : <Spinner />}
    </div>
  )
}

export default NumberFlowContainer
