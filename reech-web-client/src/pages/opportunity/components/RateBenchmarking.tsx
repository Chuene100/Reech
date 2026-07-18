import React from 'react';
import Card from "@/components/ui/Card";
import { LineChart } from "@/components/widgets/charts/LineChart";
import Rater from '@/components/widgets/rater/Rater';

const RateBenchmarking = () => {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="basis-1/2">
                <Card className="w-full h-full">
                    <Rater />
                </Card>
            </div>
            <div className="basis-1/2">
                <Card className="border border-black/40 text-center" style={{borderRadius: '64px', margin: '2vh', width: "98%"}}>
                    <h4 style={{textDecoration: "underline"}}>Real-time rate trend</h4>
                    <LineChart chartHeight="200px" chartColor="" className="" />
                </Card>
            </div>
        </div>
    );
};

export default RateBenchmarking;