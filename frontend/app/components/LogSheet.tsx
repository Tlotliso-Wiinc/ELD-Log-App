import React from 'react';

const LogSheet = ({ 
  date = { month: '', day: '', year: '' },
  from = '',
  totalMilesDrivingToday = '',
  totalMileageToday = '',
  carrierName = '',
  mainOfficeAddress = '',
  homeTerminalAddress = '',
  truckNumberInfo = '',
  logData = {
    offDuty: [],
    sleeper: [],
    driving: [],
    onDuty: []
  },
  remarks = '',
  shippingDocuments = '',
  manifestNumber = ''
}) => {
  // Generate hour markers for the grid
  const hourMarkers = Array.from({ length: 24 }, (_, i) => {
    return (
      <div key={`hour-${i}`} className="text-xs font-bold text-center" style={{ width: '4.16%' }}>
        {i}
      </div>
    );
  });

  // Generate the time grid for each status
  interface GenerateGridProps {
    status: string;
    index: number;
  }

  const generateGrid = (status: string, index: number): React.ReactElement => {
    return (
      <div key={`grid-${status}`} className="flex h-6 border-t border-black">
        <div className="w-16 border-r border-black text-xs flex items-center pl-1">
          {index}. {status}
        </div>
        <div className="flex flex-1 relative">
          {Array.from({ length: 24 }, (_, i: number) => (
            <div
              key={`cell-${status}-${i}`}
              className="border-r border-black"
              style={{ width: '4.16%', height: '100%' }}
            >
              {Array.from({ length: 4 }, (_, j: number) => (
                <div
                  key={`subcell-${status}-${i}-${j}`}
                  className="border-r border-gray-300 h-full"
                  style={{ width: '25%', float: 'left' }}
                ></div>
              ))}
            </div>
          ))}

          {/* This is where we would render the actual log data for this status */}
        </div>
        <div className="w-12 border-l border-black"></div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 max-w-6xl mx-auto">
      <div className="border border-black p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-bold">Driver's Daily Log</div>
          <div className="flex items-center gap-1">
            <div className="border-b border-black px-4 text-center">{date.month}</div>
            <div>/</div>
            <div className="border-b border-black px-4 text-center">{date.day}</div>
            <div>/</div>
            <div className="border-b border-black px-4 text-center">{date.year}</div>
          </div>
        </div>
        
        {/* From field */}
        <div className="flex mb-2">
          <div className="w-16 font-bold">From:</div>
          <div className="flex-1 border-b border-black">{from}</div>
        </div>
        
        {/* Total miles and Carrier info */}
        <div className="flex mb-2">
          <div className="w-1/2 border border-black p-1 mr-1">
            <div className="flex">
              <div className="w-1/2 border-r border-black p-1 text-center">
                <div className="border-b border-black pb-1 text-center">Total Miles Driving Today</div>
                <div className="text-center pt-1">{totalMilesDrivingToday}</div>
              </div>
              <div className="w-1/2 p-1 text-center">
                <div className="border-b border-black pb-1 text-center">Total Mileage Today</div>
                <div className="text-center pt-1">{totalMileageToday}</div>
              </div>
            </div>
          </div>
          <div className="w-1/2 border border-black p-1">
            <div className="border-b border-black pb-1 text-center">Name of Carrier or Carriers</div>
            <div className="text-center pt-1">{carrierName}</div>
          </div>
        </div>
        
        {/* Truck info and Address */}
        <div className="flex mb-2">
          <div className="w-1/2 border border-black p-1 mr-1">
            <div className="border-b border-black pb-1 text-center text-xs">Truck/Trailer and Entity Numbers or License Numbers (Show each unit)</div>
            <div className="text-center pt-1">{truckNumberInfo}</div>
          </div>
          <div className="w-1/2 border border-black p-1">
            <div className="border-b border-black pb-1 text-center">Home Terminal Address</div>
            <div className="text-center pt-1">{homeTerminalAddress}</div>
          </div>
        </div>
        
        {/* Grid header */}
        <div className="flex mb-0 bg-black text-white">
          <div className="w-16"></div>
          <div className="flex flex-1 justify-between">
            <div className="text-xs px-1">Mid-<br/>night</div>
            <div className="text-xs px-1">Noon</div>
            <div className="text-xs px-1">Mid-<br/>night</div>
          </div>
          <div className="w-12 text-center text-xs">Total<br/>Hours</div>
        </div>
        
        {/* Hour markers */}
        <div className="flex">
          <div className="w-16"></div>
          <div className="flex flex-1">
            {hourMarkers}
          </div>
          <div className="w-12"></div>
        </div>
        
        {/* Log grids */}
        {generateGrid("Off Duty", 1)}
        {generateGrid("Sleeper Berth", 2)}
        {generateGrid("Driving", 3)}
        {generateGrid("On Duty (Not Driving)", 4)}
        
        {/* Remarks */}
        <div className="mt-4 border border-black p-1">
          <div className="border-b border-black pb-1 font-bold">Remarks</div>
          <div className="h-10">{remarks}</div>
        </div>
        
        {/* Shipping Documents */}
        <div className="mt-2 border border-black p-1">
          <div className="font-bold mb-1">Shipping Documents:</div>
          <div className="mb-2">{shippingDocuments}</div>
          
          <div className="flex">
            <div className="w-1/3 pr-1">
              <div className="font-bold text-sm">Pro or Manifest No.</div>
              <div className="border-b border-black pb-1">{manifestNumber}</div>
            </div>
          </div>
          
          <div className="mt-4 text-xs">
            Enter name of place you reported and where unloaded from ways and when and where each change of duty occurred.<br/>
            Use time standard of time at home terminal.
          </div>
        </div>
        
        {/* Hour Summary Table */}
        <div className="mt-4 border border-black text-xs">
          <div className="flex">
            <div className="w-1/4 p-1 border-r border-black">
              <div className="font-bold">Recap:</div>
              <div>Calculate as of end of day</div>
            </div>
            <div className="w-1/4 p-1 border-r border-black">
              <div className="font-bold">70 Hour / 8 Day</div>
            </div>
            <div className="w-1/4 p-1 border-r border-black">
              <div className="font-bold">60 Hour / 7 Day</div>
            </div>
            <div className="w-1/4 p-1">
              <div className="font-bold">*If you took 34 consecutive hours off duty, you may reset hours to 0</div>
            </div>
          </div>
          
          <div className="flex border-t border-black">
            <div className="w-1/4 p-1 border-r border-black">
              <div className="font-bold">On Duty Hours Today: 3 & 4</div>
            </div>
            <div className="w-1/4 flex border-r border-black">
              <div className="w-1/3 p-1 border-r border-black">
                <div className="font-bold">A. Total hours on duty today:</div>
              </div>
              <div className="w-1/3 p-1 border-r border-black">
                <div className="font-bold">B. Total hours on duty previous 7 days:</div>
              </div>
              <div className="w-1/3 p-1">
                <div className="font-bold">C. Total hours on duty previous 8 days:</div>
              </div>
            </div>
            <div className="w-1/4 flex border-r border-black">
              <div className="w-1/3 p-1 border-r border-black">
                <div className="font-bold">A. Total hours on duty today:</div>
              </div>
              <div className="w-1/3 p-1 border-r border-black">
                <div className="font-bold">B. Total hours on duty previous 6 days:</div>
              </div>
              <div className="w-1/3 p-1">
                <div className="font-bold">C. Total hours on duty previous 7 days:</div>
              </div>
            </div>
            <div className="w-1/4 p-1">
              <div>Indicate how many hours 60/70 available:</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogSheet;
