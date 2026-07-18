import { SidebarFooter } from "./sidebar-menu/SidebarFooter"
import { SidebarMenu } from "./sidebar-menu/SidebarMenu"
import { SidebarLogo } from "./SidebarLogo"

const Sidebar = () => {
  return (
    <aside 
        className="fixed top-0 z-10 ml-[-100%] flex h-[99vh] w-full flex-col 
        justify-between border-r bg-gray-700 pb-3 transition duration-300 md:w-4/12 
        lg:m-1 rounded-lg lg:w-[6%]"
    >
        <SidebarLogo />
        <SidebarMenu />
        <SidebarFooter />

    </aside>
  )
}

export {Sidebar}
