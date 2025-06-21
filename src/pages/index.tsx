import Cell from '@/components/Cell'
import React from 'react'

const index = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-8">Minesweeper</h1>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 100 }).map((_, index) => (
            <Cell key={index} />
          ))}
        </div>
      </div>

    </>

  )
}

export default index