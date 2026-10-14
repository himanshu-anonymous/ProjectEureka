'use client';

import React from 'react';

interface MaharashtraMapTopologyProps {
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export const MaharashtraMapTopology: React.FC<MaharashtraMapTopologyProps> = ({
  selectedDistrictId,
  onSelectDistrict,
}) => {
  return (
    <div className="w-full h-64 bg-surface-secondary rounded border border-borderLine-subtle p-3 relative flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 500 350" className="w-full h-full max-h-64">
        {/* State boundary background outline */}
        <path
          d="M 50 140 L 90 70 L 170 50 L 300 40 L 440 60 L 460 140 L 370 190 L 320 270 L 220 280 L 150 290 L 100 240 L 60 190 Z"
          fill="#F5F6F7"
          stroke="#DADCE0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* 1. Konkan (Mumbai & Thane) */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('thane')}
        >
          <path
            d="M 60 140 L 85 130 L 105 160 L 95 210 L 70 190 Z"
            fill={selectedDistrictId === 'thane' ? '#202124' : '#80868B'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="75" y="175" fill="#FFFFFF" fontSize="10" fontWeight="bold">Thane</text>
        </g>

        {/* Mumbai City Hub */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('mumbai')}
        >
          <circle
            cx="65"
            cy="165"
            r="8"
            fill={selectedDistrictId === 'mumbai' ? '#202124' : '#303134'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="45" y="195" fill="#202124" fontSize="9" fontWeight="bold">Mumbai</text>
        </g>

        {/* 2. Pune Division */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('pune')}
        >
          <path
            d="M 105 160 L 165 155 L 180 215 L 120 225 L 95 210 Z"
            fill={selectedDistrictId === 'pune' ? '#202124' : '#5F6368'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="125" y="190" fill="#FFFFFF" fontSize="11" fontWeight="bold">Pune</text>
        </g>

        {/* 3. Nashik Division */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('nashik')}
        >
          <path
            d="M 85 130 L 155 105 L 175 155 L 105 160 Z"
            fill={selectedDistrictId === 'nashik' ? '#202124' : '#80868B'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="115" y="138" fill="#FFFFFF" fontSize="10" fontWeight="bold">Nashik</text>
        </g>

        {/* 4. Chhatrapati Sambhajinagar (Marathwada) */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('aurangabad')}
        >
          <path
            d="M 155 105 L 245 110 L 235 180 L 165 155 Z"
            fill={selectedDistrictId === 'aurangabad' ? '#202124' : '#DADCE0'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="180" y="145" fill="#202124" fontSize="9" fontWeight="bold">Chh. Sambhajinagar</text>
        </g>

        {/* 5. Nagpur / Vidarbha */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('nagpur')}
        >
          <path
            d="M 245 110 L 420 85 L 435 175 L 300 190 L 235 180 Z"
            fill={selectedDistrictId === 'nagpur' ? '#202124' : '#80868B'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="320" y="140" fill="#FFFFFF" fontSize="11" fontWeight="bold">Nagpur / Vidarbha</text>
        </g>

        {/* 6. Southern Maharashtra (Kolhapur/Satara) */}
        <g
          className="cursor-pointer transition-all"
          onClick={() => onSelectDistrict('kolhapur')}
        >
          <path
            d="M 120 225 L 220 180 L 255 260 L 140 270 Z"
            fill={selectedDistrictId === 'kolhapur' ? '#202124' : '#DADCE0'}
            stroke="#FFFFFF"
            strokeWidth="2"
            className="hover:opacity-85"
          />
          <text x="160" y="240" fill="#202124" fontSize="10" fontWeight="bold">Kolhapur / South</text>
        </g>
      </svg>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px] font-mono text-content-muted bg-surface/85 backdrop-blur-sm px-2 py-1 rounded border border-borderLine-subtle">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-content-primary"></span>
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#80868B]"></span>
          Division Hub
        </span>
        <span>• Click district polygon to inspect DIO data</span>
      </div>
    </div>
  );
};
