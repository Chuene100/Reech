import { Link } from "react-router-dom";

const SidebarLogo = () => {
    return (
        <>
            <div className="py-3 px-1">
                <div className="px-6">
                <Link 
                    to='/dashboard'
                >
                    <img 
                        src="/media/logos/reech-icon.png"
                        className="inline-block lg:block" 
                    />
                </Link>
                </div>
                <div className="mt-5 bg-white/10 h-px w-full"></div>
            </div>
        </>
    )
}

export {SidebarLogo}