import Button from "@/components/ui/Button"
import ReechForModal from "@/components/ui/modal/modals/ReechForModal"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"

const GreetingCard = () => {
    const [showModal, setShowModal] = useState(false)
    return (
        <div 
            className="flex flex-col w-full bg-gradient-to-br from-fuchsia-400 to-fuchsia-800 
            text-white rounded-md p-3 lg:pt-8"
        >
            <h2 className="text-[24px] text-bold mb-4">Hello, <span className="font-bold">Nthabiseng!</span> 😀</h2>
            <p className="">
                Welcome back to your Reech dashboard. What would you 
                <br /> like to do today?
            </p>
            <div className="pt-5 mb-2">
                <Button 
                    variant="normal"
                    className="mr-2 px-10 hover:bg-purple-600 hover:text-white"
                    onClick={()=>setShowModal(true)}

                >
                    Reech For
                </Button>
                {showModal ? (
                        <>
                            <ReechForModal 
                                closeModal={()=>setShowModal(false)}
                            />
                        </>
                    ) : null}
                
                <Button 
                    variant="lightOutline"
                    className="mr-2 px-10"
                >
                    <Link to='/opportunity'>
                        See Who Reeched Me
                    </Link>
                    
                </Button>
            </div>
        </div>
    )
}

export {GreetingCard}