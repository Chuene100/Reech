import { SVG, toAbsoluteUrl } from "@/lib"

const Header = () => {
  
  return (
        <div className="flex flex-row items-center justify-between space-x-4 px-6 2xl:container">
          <h5 hidden className="text-2xl font-medium text-gray-600 lg:block">Reech</h5>
          <button className="-mr-2 h-16 w-12 border-r lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="my-auto h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex space-x-4">

            <div hidden className="md:block">
              <div className="relative flex items-center text-gray-400 focus-within:text-cyan-400">
                <span className="absolute left-4 flex h-6 items-center border-r border-gray-300 pr-3 ">
                  <i className="iconly-Search m-auto h-5 w-5 text-gray-600 "></i>
                </span>
                <input
                  type="search"
                  name="leadingIcon"
                  id="leadingIcon"
                  placeholder="Search here"
                  className="outline-none w-full rounded-xl border border-gray-300 py-2.5 pl-14 pr-4 text-sm text-gray-600 transition focus:border-cyan-300"
                />
              </div>
            </div>
            
            <button
              aria-label="search"
              className="h-10 w-10 rounded-xl border bg-gray-100 active:bg-gray-200 md:hidden"
            >
              <i className="iconly-Search m-auto h-5 w-5 text-gray-600 "></i>
            </button>
            <button
              aria-label="chat"
              className="h-10 w-10 rounded-xl border bg-gray-100 active:bg-gray-200"
            >
              <i className="iconly-Message m-auto h-5 w-5 text-gray-600"></i>
            </button>
            <button
              aria-label="notification"
              className="h-10 w-10 rounded-xl border bg-gray-100 active:bg-gray-200"
            >
              <i className="iconly-Notification m-auto h-5 w-5 text-gray-600"></i>
            </button>

            <div className="flex flex-row items-center" style={{ marginTop: "-1%"}}>
              <div className="flex flex-col items-center">
                <img 
                  src="/media/avatars/avatar-02.jpg"
                  className="inline-block w-8 h-8 rounded-lg" 
                />
                <img
                  alt='coca-cola'
                  src={toAbsoluteUrl('/media/svg/general/coca_cola.svg')}
                  className=''
                  style={{width: '4vw', height: '4vh'}}
                />
              </div>
              <div className="flex flex-col" style={{marginTop: "-7%"}}>
                <span style={{fontSize: "15px"}}>
                  Nthabiseng
                </span>
                <span style={{fontSize: "15px"}}>
                  Khumalo
                </span>
              </div>
            </div>
          </div>
        </div>                                
  )
}

export {Header}
