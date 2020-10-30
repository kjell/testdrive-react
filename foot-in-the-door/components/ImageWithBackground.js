/** @format */

import { cx } from '../util'
import styles from './ImageWithBackground.module.css'

function ImageWithBackground(props) {
  const {
    imageSrc,
    children,
    as: WrapperElem,
    className,
    style,
    ...wrapperProps
  } = props

  const Wrapper = WrapperElem || 'div'

  return (
    <Wrapper
      {...wrapperProps}
      className={cx(className, styles.imageBlurBackground, 'relative')}
      style={{ style, '--bg-image': `url(${imageSrc})` }}
    >
      {children}
    </Wrapper>
  )
}

export default ImageWithBackground
