import {Navigate, Routes, Route, Outlet, useParams} from 'react-router-dom'
import { OppHeader } from './OppHeader';
import React, { useMemo } from "react";
import UnderstandMyReech from './components/UnderstandMyReech'
import SeeWhosBeenReeched from './components/SeeWhosBeenReeched'
import Card from '@/components/ui/Card';
import ViewMyNotes from './components/ViewMyNotes';
import DefineMyCards from './components/DefineMyCards';
import MyReechHistory from './components/MyReechHistory';
import RateBenchmarking from './components/RateBenchmarking';
import { Opps } from '@/rest-api/fake-data/fake-data';


const OpportunityPage: React.FC = () => {
  const {id} = useParams()
  const opp = Opps[Number(id)-1]
  const next_opp = Opps[Number(id)]
  const last_item_id = Opps[Opps.length-1].id

  return (
    <Routes>
      <Route
        element={
          <>
            <OppHeader opp={opp} last_item_id={last_item_id}  />
            <Outlet />
          </>
        }
      >
        <Route
          path='understand'
          element={
            <>
              <>
                <UnderstandMyReech opp={opp} />
              </>  
            </>
          }
        />
        <Route
          path='see-who'
          element={
            <>
              <Card className='mt-5'>
                <SeeWhosBeenReeched />
              </Card>
            </>
          }
        />
        <Route
          path='define-cards'
          element={
            <>
            <Card className='mt-5'>
              <DefineMyCards />
            </Card>
            </>
          }
        />
        <Route
          path='my-notes'
          element={
            <>
              <>
                <ViewMyNotes />
              </>  
            </>
          }
        />
        <Route
          path='my-history'
          element={
            <>
              <Card className='mt-5'>
                <MyReechHistory />
              </Card>  
            </>
          }
        />
        <Route
          path='rate-benchmarking'
          element={
            <>
              <Card className='mt-5'>
                <RateBenchmarking />
              </Card>  
            </>
          }
        />
        <Route index element={<Navigate to={`/opportunity/${id}/understand`} />} />
      </Route>
    </Routes>
  );
  
}

export default OpportunityPage
