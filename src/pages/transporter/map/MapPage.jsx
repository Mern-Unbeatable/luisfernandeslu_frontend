import { useState } from 'react'
import { FiMapPin, FiPlus } from 'react-icons/fi'

export default function MapPage() {
  const [startingPoint, setStartingPoint] = useState('')
  const [destination, setDestination] = useState('')

  return (
    <div className="relative w-full h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
      {/* Interactive Google Map Embed */}
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5115989.155702283!2d20.064971846467364!3d51.9189073100344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2spl!4v1700000000000!5m2!1sen!2spl"
        className="w-full h-full border-0 outline-none"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Overlaid Route Planner Card */}
      <div className="absolute top-4 left-4 z-10 w-80 rounded-2xl bg-white p-5 shadow-xl border border-gray-100 flex flex-col gap-4">
        <div className="relative flex flex-col gap-3 pl-6">
          {/* Vertical Dotted Line Connector */}
          <div className="absolute left-[7px] top-[14px] bottom-[14px] w-0.5 border-l-2 border-dashed border-gray-300"></div>

          {/* Starting Point Input */}
          <div className="relative flex items-center">
            {/* Circle Marker */}
            <div className="absolute -left-6 flex items-center justify-center">
              <div className="size-3.5 rounded-full border-2 border-gray-400 bg-white"></div>
            </div>
            <input
              type="text"
              placeholder="Choose Starting Point"
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              className="w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-amber-500 transition-all"
            />
          </div>

          {/* Destination Input */}
          <div className="relative flex items-center">
            {/* Red Pin Marker */}
            <div className="absolute -left-6 flex items-center justify-center">
              <FiMapPin className="size-4.5 text-red-500" />
            </div>
            <input
              type="text"
              placeholder="Choose Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-xl bg-gray-50 border border-transparent px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-amber-500 transition-all"
            />
          </div>
        </div>

        {/* Add Destination Button */}
        <div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--active)] hover:underline ml-6"
          >
            <FiPlus className="size-4" />
            Add destination
          </button>
        </div>
      </div>
    </div>
  )
}