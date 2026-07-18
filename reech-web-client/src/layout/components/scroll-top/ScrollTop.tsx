import {useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import {
  ScrollTopComponent,
  DrawerComponent,
  ToggleComponent,
  StickyComponent,
} from '../../../assets/ts/components'
import {SVG} from '@/lib'

export function ScrollTop() {
  const {pathname} = useLocation()
  const isFirstRun = useRef(true)

  const pluginsReinitialization = () => {
    setTimeout(() => {
      StickyComponent.reInitialization()
      setTimeout(() => {
        ToggleComponent.reinitialization()
        DrawerComponent.reinitialization()
      }, 70)
    }, 140)
  }

  const scrollTop = () => {
    ScrollTopComponent.goTop()
  }

  const updateHeaderSticky = () => {
    const stickyHeader = document.body.querySelectorAll(`[data-sticky-name="header"]`)
    if (stickyHeader && stickyHeader.length > 0) {
      const sticky = StickyComponent.getInstance(stickyHeader[0] as HTMLElement)
      if (sticky) {
        sticky.update()
      }
    }
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
    } else {
      pluginsReinitialization()
    }

    updateHeaderSticky()
    setTimeout(() => {
      scrollTop()
    }, 0)
  }, [pathname])

  return (
    <div id='scrolltop' className='scrolltop' data-scrolltop='true'>
      <SVG path='/media/icons/duotune/arrows/arr066.svg' />
    </div>
  )
}
