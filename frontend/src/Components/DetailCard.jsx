import React from 'react'

const DetailCard = ({name, count}) => {
  return (
    <div className='bg-card-bg border border-white/10 rounded-xl shadow-lg shadow-black/30 w-60 h-30 p-6 flex flex-col justify-between'>
        <div>
            <h2 className='text-white text-lg font-semibold'>{name}</h2>
        </div>
        <div>
            <h2 className='text-secondary-accent text-2xl font-bold'>{count}</h2>
        </div>
    </div>
  )
}

export default DetailCard