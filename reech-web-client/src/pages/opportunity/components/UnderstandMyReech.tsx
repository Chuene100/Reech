import Card from '@/components/ui/Card';
import { AnotherBarChart } from '@/components/widgets/charts/AnotherBarChart';
import { SimplePieChart } from '@/components/widgets/charts/SimplePieChart';
import NumberCard from '@/components/widgets/statistics/NumberCard';
import { toAbsoluteUrl } from '@/lib';
import React from 'react';
import Globe from 'react-globe.gl';

interface Props {
    opp?: any
}

const UnderstandMyReech: React.FC<Props> = ({opp}) => {
    return (
        <div className='p-3'>
            <div className='flex flex-row gap-2'>
                <div className="basis-1/5 flex">
                    <NumberCard applications={opp.oppChartData.applications.toLocaleString()} className='h-full'/>
                </div>

                <div className="basis-2/5">
                    <Card className="h-full bg-white">
                        <h4>Growth in Campaign</h4>
                        <AnotherBarChart 
                            className='h-full'
                            chartHeight="260px"
                            chartTitle="Card Statistics"
                            chartData={opp.oppChartData.barChartData}
                        />
                    </Card>
                </div>

                <div className='basis-2/5'>
                    <Card className='h-full bg-white'>
                        <SimplePieChart 
                            className='mx-auto' 
                            chartWidth='400'
                            chartTitle='Education Levels' 
                            chartData={opp.oppChartData.pieChartData}
                        />
                    </Card>
                </div>
                
            </div>

            <div className="flex flex-row mt-2 rounded">
                <Globe
                    backgroundColor='white'
                    waitForGlobeReady={true}
                    globeImageUrl='/media/misc/worldmap.jpg'
                    width={1225}
                />
            </div>
        </div>
    );
};

export default UnderstandMyReech;