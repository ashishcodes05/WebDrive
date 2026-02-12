import React from 'react'

const DetailCard = ({name, count, icon}) => {
  return (
    <div className='bg-card-bg/20 border border-white/10 rounded-xl shadow-lg shadow-black/30 w-60 h-30 p-6 flex justify-between backdrop-blur-lg'>
        <div className='flex flex-col justify-center gap-2'>
            <h2 className='text-white text-lg font-semibold'>{name}</h2>
            <h2 className='text-secondary-accent text-2xl font-bold'>{count}</h2>
        </div>
        <div className='flex items-center justify-center'>
            {icon}
        </div>
    </div>
  )
}

export default DetailCard