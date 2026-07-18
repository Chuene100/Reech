/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { SVG } from '@/lib'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
import { User } from '../../types'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import clsx from 'clsx'
import MenuHorizontal from '@/components/ui/MenuHorizontal'
import Button from '@/components/ui/Button'
import InfoOutline from '@/components/ui/InfoOutline'
import OpportunityCard from '@/components/cards/OpportunityCard'

interface Props {
  opp: any
  last_item_id?: number
}

const OppHeader: React.FC<Props> = ({opp, last_item_id}) => {
  const location = useLocation()
//   const pluraliseRoles = `${user?.role.toLowerCase() === 'sponsor' ? user?.role.toLowerCase() : user?.role.toLowerCase().substring(0,user?.role.toLowerCase().length-1)}${user?.role.toLowerCase() === 'sponsor' ? 's' : 'ies'}`

  return (
    <Card className='py-0 px-4'>
      <div className='pt-4 pb-0'>
        <div className='flex flex-wrap sm:flex-nowrap mb-3'>
          <div className='mr-7 m-0 p-0'>
            <OpportunityCard 
                id={opp.id}
                image={opp.image}
                title={opp.title} 
                salary={opp.salary}
                views={opp.views} 
                date_posted={opp.date_posted}
            />
            <div className='flex justify-between py-2 text-[24px] mt-3'>
              {opp.id != 1 ?
                <Link to={`/opportunity/${opp.id-1}`}>
                  <i className="iconly-Arrow-Left-2 icli hover:bg-purple-500 border-2 border-purple-500 rounded-lg text-purple-500 hover:text-white p-1 cursor-pointer"></i>
                </Link>
                :
                <i className="iconly-Arrow-Left-2 icli bg-gray-300 border border-gray-300 rounded-lg text-gray-600 p-1 cursor-not-allowed"></i>

              }
              {opp.id != last_item_id ?
                <Link to={`/opportunity/${opp.id+1}`}>
                  <i className="iconly-Arrow-Right-2 icli hover:bg-purple-500 border-2 border-purple-500 rounded-lg text-purple-500 hover:text-white p-1 cursor-pointer"></i>
                </Link>
                :
                <i className="iconly-Arrow-Right-2 icli bg-gray-300 border border-gray-300 rounded-lg text-gray-600 p-1 cursor-not-allowed"></i>

              }
            </div>
            {/* <div 
                className='inline-block relative h-40 w-40 rounded-lg p-0 m-0'
                style={{
                    background: `url(/media/misc/Junior-bookkeeper.jpg)`,
                    backgroundSize: 'cover'
                }}
            >
              <div className='bg-gradient-to-b from-purple-500/50 to-black/50 w-full h-full rounded-lg p-0 m-0'>
              </div>
            </div> */}
          </div>

          <div className='flex flex-col justify-around grow'>
            <div className='flex justify-between items-start flex-wrap mb-2'>
              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <a href='#' className='text-gray-800 text-hover-primary text-[36px] font-semibold mr-1'>
                   {opp.title}
                  </a>
                </div>

                <div className='flex flex-wrap fw-bold text-slate-500 mb-4 pr-2'>
                  <span>{opp.salary}</span>
                </div>
              </div>

              <div className='flex my-4'>
                <Button
                    variant='custom'
                    size='small'
                    className='bg-purple-500 text-white font-normal text-sm px-8'
                    data-bs-toggle='modal'
                    data-bs-target='#modal_offer_a_deal'
                >
                  Export As 
                  <i className="iconly-Arrow-Up-Square icbo text-lg ml-2"></i>
                </Button>
                <div className='me-0'>
                  <button
                    className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                    data-menu-trigger='click'
                    data-menu-placement='bottom-end'
                    data-menu-flip='top-end'
                  >
                    <i className='bi bi-three-dots fs-3'></i>
                  </button>
                </div>
              </div>
            </div>

            <div className='flex flex-wrap'>
              <div className='flex flex-col grow pr-8'>
                <div className='flex flex-wrap'>

                    <InfoOutline title='01 Mar, 2023' subtitle='Date Created' />
                    <InfoOutline title='1,346' subtitle='Applications' />
      
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-dark/50 mb-5"></div>

        <div className='flex overflow-auto h-55px'>
          <ul 
            className={clsx('flex justify-items-stretch p-0 text-lg flex-nowrap text-gray-400')}
          >
            <MenuHorizontal to={`/opportunity/${opp.id}/understand`} title='Understand My Reech' />
            <MenuHorizontal to={`/opportunity/${opp.id}/see-who`} title="See Who's Been Reeched" />
            <MenuHorizontal to={`/opportunity/${opp.id}/define-cards`} title="Define My Cards" />
            <MenuHorizontal to={`/opportunity/${opp.id}/my-notes`} title="View My Notes" />
            <MenuHorizontal to={`/opportunity/${opp.id}/my-history`} title="My Reech History" />
            <MenuHorizontal to={`/opportunity/${opp.id}/rate-benchmarking`} title="Rate Benchmarking" />
          </ul>
        </div>
      </div>
    </Card>
  )
}

export {OppHeader}
