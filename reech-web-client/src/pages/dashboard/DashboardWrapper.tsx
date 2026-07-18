import Card from "@/components/ui/Card"
import { useModalAction } from "@/components/ui/modal/Modal.Context"
import MiniCalendar from "@/components/widgets/calendar/MiniCalendar"
import { AnotherBarChart } from "@/components/widgets/charts/AnotherBarChart"
import { BarChart } from "@/components/widgets/charts/BarChart"
import { LineChart } from "@/components/widgets/charts/LineChart"
import { TaskRadialBar } from "@/components/widgets/charts/TaskRadialBar"
import { GreetingCard } from "@/components/widgets/greetings/GreetingCard"
import OldRater from "@/components/widgets/rater/OldRater"
import { CounterCard } from "@/components/widgets/statistics/CounterCard"
import NumberCard from "@/components/widgets/statistics/NumberCard"

export const DashboardWrapper = () => {
    const {openModal} = useModalAction();
    return (
        <>
            {/* Dashboard Container  */}
            <div className="flex flex-col w-full h-full">
                {/* Main Col 1 */}
                <div>
                    <div className="flex flex-row ">
                        <div className="basis-3/4 h-full">
                            {/* Inner Row  */}
                            <div className="flex flex-row h-full">
                                {/* User Greeting  */}
                                <div className="basis-2/3">
                                    <GreetingCard />
                                </div>
                                {/* End User Greeting  */}

                                {/* Counter Card  */}
                                <div className="basis-1/3 px-2">
                                    <CounterCard
                                        className='h-md-170px mb-5 xl:mb-10'
                                        description='Active Opportunity Cards'
                                        count={14}
                                        // isLoading={isLoading}
                                    />
                                </div>
                                {/* End Counter Card  */}
                            </div>
                            {/* End Inner Row  */}

                            {/* Inner Row  */}
                            <div className="flex flex-row mt-2 pr-2">
                                <div className="basis-1/4">
                                    <Card className="h-full">
                                        <TaskRadialBar
                                            className=""
                                            chartTitle='Posts Left This Month'
                                            chartHeight="200px"
                                        />
                                    </Card>
                                </div>

                                <div className="basis-1/4 px-2">
                                    <Card className="h-full">
                                        <MiniCalendar />
                                    </Card>
                                </div>

                                <div className="basis-1/2">
                                    <Card className="h-full">
                                        <BarChart 
                                            className='h-full'
                                            chartHeight='150px'
                                            chartTitle="Card Statistics"
                                        />
                                    </Card>
                                </div>


                            </div>
                            {/* End Inner Row  */}
                        </div>
                        <div className="basis-1/4">
                        <Card className="w-full h-full">
                            <OldRater />
                        </Card>
                        </div>
                    </div>

                    
                    
                </div>
                {/* End Main Col 1 */}

                {/* Main Col 2 */}
                <div className="flex mt-2">
                    <div className="basis-1/2">
                        <Card className="w-full">
                            <h4>Real Time Rate Trend</h4>
                            <LineChart chartHeight="200px" chartColor="" className="" />
                        </Card>
                    </div>
                    
                    

                    <div className="basis-1/4 flex ml-2">
                      <NumberCard  className='h-full'/>
                    </div>

                    <div className="basis-1/4 ml-2">
                        <Card className=" h-full">
                            <h4>Growth in Campaign</h4>
                            <AnotherBarChart 
                                className='h-full'
                                chartHeight="200px"
                                chartTitle="Card Statistics"
                            />
                        </Card>
                    </div>

                    

                </div>
                {/* End Main Col 2 */}
            </div>
            {/* End Dashboard Container  */}
        </>
        
    )
}