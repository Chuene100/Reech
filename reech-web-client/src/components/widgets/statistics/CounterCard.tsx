type Props = {
    className?: string
    description: string
    color?: string
    img?: string
    count: any
    isLoading?: boolean
  }
  
  const CounterCard = ({className, description, color, img, count, isLoading}: Props) => (
    <>
    {isLoading
      ?
      <h3>Loader here...</h3>
      :
        <div
            className={`h-full w-full rounded-lg border-0 p-3 bg-gradient-to-br from-teal-400 to-teal-700 ${className}`}
            >
            <div className='flex justify-between items-stretch flex-wrap pt-5'>
                <div className='flex flex-col'>
                    <span className='text-[24px] font-semibold text-white mr-2'>{count}</span>
        
                    <span className='text-white/70 pt-1 font-medium '>{description}</span>
                </div>
            </div>
            <div className='flex items-end pt-5'>
                <div className='flex items-center flex-col mt-3 w-full'>
                    <div className='flex justify-between fw-bold fs-6 text-white opacity-75 w-full mt-auto mb-2'>
                    <span>{count-2} Done</span>
                    <span>{`${Math.round(((count-2)/count)*100)}%`}</span>
                    </div>
        
                    <div className="w-full bg-gray-200/30 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full" 
                            style={{width: `${((count-2)/count)*100}%`}}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    }
    </>
  )
  export {CounterCard}
  