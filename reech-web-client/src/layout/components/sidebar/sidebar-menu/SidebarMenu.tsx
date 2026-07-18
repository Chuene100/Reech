import { SidebarMenuItem } from "./SidebarMenuItem"

const SidebarMenu = () => {
    return (
        <div>
            <SidebarMenuItem
                to='/home'
                icon='iconly-Home icbo'
                title='Home'
            />
            <SidebarMenuItem
                to='/dashboard'
                icon='iconly-Activity icbo'
                title='Dashboard'
            />
            <SidebarMenuItem
                to='/opportunity'
                icon='iconly-Chart icbo'
                title='Opportunity'
            />
            <SidebarMenuItem
                to='/chats'
                icon='iconly-Message icbo'
                title='Chats'
            />
        </div>
    )
}

export {SidebarMenu}