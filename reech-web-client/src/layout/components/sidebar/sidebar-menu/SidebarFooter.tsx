import { useLogout } from "@/rest-api/auth"
import { Link } from "react-router-dom"

const SidebarFooter = () => {
    const {mutate: logout} = useLogout()
    return (
        <button 
            className="text-white/60 gap-0 cursor-pointer"
            // onClick={()=>logout()}
        >
            <Link to='/auth/login'>
            <div className="flex justify-center ">
                <span>
                    <i className='iconly-Logout  text-xl'></i>
                </span>
            </div>
            <div className="flex justify-center">
                <span 
                    className="text-[11px] font-normal"
                >
                    Logout
                </span>
            </div>
            </Link>
        </button>
    )
}

export {SidebarFooter}