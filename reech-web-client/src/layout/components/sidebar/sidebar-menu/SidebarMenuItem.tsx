import { checkIsActive } from "@/lib"
import clsx from "clsx"
import { FC } from "react"
import { Link, useLocation } from "react-router-dom"

type Props = {
    to: string
    title: string
    icon?: string
  }

const SidebarMenuItem: FC<Props> = ({to, title, icon}) => {
    const {pathname} = useLocation()
    const isActive = checkIsActive(pathname, to)

    return (
        <ul className="mb-2 py-2">
            <Link className="grid grid-cols-1 gap-0" to={to}>
                <div className="relative hover:cursor-pointer">
                    <li className={clsx("cursor-pointer items-center text-white/70", {'text-fuchsia-400': isActive})}>
                        <div className="flex justify-center ">
                            <span>
                                <i className={clsx(icon, 'text-2xl')}></i>
                            </span>
                        </div>
                        <div className="flex justify-center">
                            <span className="text-[13px] font-normal">{title}</span>
                        </div>
                    </li>
                    {isActive &&
                        <div className="absolute z-100 left-0 top-px h-11 w-1 rounded-lg bg-fuchsia-400" />
                    }
                </div>          
            </Link>
        </ul>
    )
}

export {SidebarMenuItem}