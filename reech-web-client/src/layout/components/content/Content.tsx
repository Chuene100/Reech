import {WithChildren} from '@/lib'

const Content = ({children}: WithChildren) => {
  return (
    <div className="pt-4 2xl:container">
        <div
          className=""
        >
          {children}
        </div>
    </div>
  )
}

export {Content}
