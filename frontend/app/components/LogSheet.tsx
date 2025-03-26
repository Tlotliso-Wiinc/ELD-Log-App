import React from 'react';

const LogSheet = ({ 
  date = { day: '', month: '', year: '' },
  from = '',
  to='',
  totalMilesDrivingToday = '',
  totalMileageToday = '',
  carrierName = '',
  mainOfficeAddress = '',
  homeTerminalAddress = '',
  truckNumberInfo = '',
  logData = {
    offDuty: [] as number[],
    sleeper: [] as number[],
    driving: [] as number[],
    onDuty: [] as number[]
  },
  remarks = '',
  shippingDocuments = '',
  manifestNumber = ''
}) => {

  // Generate the time grid for each status
  interface GenerateGridProps {
    status: string;
    index: number;
  }

  const createHourMarkerLabel = (hour: number): string => {
    if (hour === 0) {
      return 'Minight';
    } else if (hour === 12) {
      return 'Noon';
    } else if (hour < 12) {
      return `${hour}`;
    } else {
      return `${hour - 12}`;
    }
  };

  const calculateTotalHours = (index: number): number => {
    if (index === 1) {
      return logData.offDuty.length;
    } else if (index === 2) {
      return logData.sleeper.length;
    } else if (index === 3) {
      return logData.driving.length;
    } else if (index === 4) {
      return logData.onDuty.length;
    }
    return 0;
  };
  

  const generateGridHeader = (): React.ReactElement => {
    return (
      <div className="flex h-6 border-t border-black bg-gray-800 text-white" style={{ height: '50px' }}>
        <div className="text-xs flex items-center pl-1" style={{ width: '150px' }}>
          
        </div>
        <div className="flex flex-1 relative">
          {Array.from({ length: 24 }, (_, i: number) => (
            <div
              className="text-xs flex items-center justify-center"
              style={{ width: '4.16%', height: '100%' }}
            >
              <span className="font-bold text-xs" style={{position: 'relative', left: '-18px', top: '5px'}}>{createHourMarkerLabel(i)}</span>
            </div>
          ))}
        </div>
        <div 
          className="w-12 pl-1 border-l border-black font-bold text-xs flex items-center justify-center" 
          style={{position: 'relative', left: '-3px'}}
        >
          <span>Total Hours</span>
        </div>
      </div>
    );
  };


  const generateGrid = (status: string, index: number): React.ReactElement => {
    return (
      <div key={`grid-${status}`} className="flex h-6 border-t border-black">
        <div className="border-r border-black text-xs flex items-center pl-1" style={{ width: '150px' }}>
          {index}. {status}
        </div>

        {/* This is where we render the actual log data for this status */}
        <div className="flex flex-1 relative">
          {Array.from({ length: 24 }, (_, i: number) => (
            <div
              key={`cell-${status}-${i}`}
              className="border-r border-black"
              style={{ width: '4.16%', height: '100%' }}
            >
              {index === 1 && logData.offDuty.includes(i) && (
                <div className="h-1/3 bg-blue-400 mt-2"></div>
              )}
              {index === 2 && logData.sleeper.includes(i) && (
                <div className="h-1/3 bg-blue-400 mt-2"></div>
              )}
              {index === 3 && logData.driving.includes(i) && (
                <div className="h-1/3 bg-blue-400 mt-2"></div>
              )}
              {index === 4 && logData.onDuty.includes(i) && (
                <div className="h-1/3 bg-blue-400 mt-2"></div>
              )}
              {/*
                {Array.from({ length: 4 }, (_, j: number) => (
                  <div
                    key={`subcell-${status}-${i}-${j}`}
                    className="border-r border-gray-300 h-1/3"
                    style={{ width: '25%', float: 'left' }}
                  ></div>
                ))}
                {Array.from({ length: 4 }, (_, j: number) => (
                  <div
                    key={`subcell-${status}-${i}-${j}`}
                    className="border-r border-t border-gray-300 h-1/3"
                    style={{ width: '25%', float: 'left' }}
                  ></div>
                ))}
                {Array.from({ length: 4 }, (_, j: number) => (
                  <div
                    key={`subcell-${status}-${i}-${j}`}
                    className="border-r border-t border-gray-300 h-1/3"
                    style={{ width: '25%', float: 'left' }}
                  ></div>
                ))}
              */}
            </div>
          ))}
        </div>

        <div className="w-12 text-sm font-bold flex items-center justify-center">
          {calculateTotalHours(index)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 max-w-6xl mx-auto">
      <div className="border border-black p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-md font-bold">Driver's Daily Log</div>
          <div className="flex items-center gap-1 text-xs">
            <div className="border-b border-black px-4 text-center">{date.day}</div>
            <div>/</div>
            <div className="border-b border-black px-4 text-center">{date.month}</div>
            <div>/</div>
            <div className="border-b border-black px-4 text-center">{date.year}</div>
          </div>
        </div>
        
        {/* From field */}
        <div className="flex mb-2">
          <div className="w-1/2 flex p-4">
            <div className="w-14 font-bold text-sm text-gray-600">From:</div>
            <div className="flex-1 border-b border-black text-sm">{from}</div>
          </div>

          <div className="w-1/2 flex p-4">
            <div className="w-10 font-bold text-sm text-gray-600">To:</div>
            <div className="flex-1 border-b border-black text-sm">{to}</div>
          </div>
        </div>
        
        {/* Total miles and Carrier info */}
        <div className="flex mb-2">
          <div className="w-1/2 border border-black p-1 mr-1 text-sm">
            <div className="flex">
              <div className="w-1/2 border-r border-black p-1 text-center">
                <div className="border-b border-black pb-1 text-center text-gray-600 text-xs">Total Miles Driving Today</div>
                <div className="text-center pt-1 font-medium">{totalMilesDrivingToday}</div>
              </div>
              <div className="w-1/2 p-1 text-center">
                <div className="border-b border-black pb-1 text-center text-gray-600 text-xs">Total Mileage Today</div>
                <div className="text-center pt-1 font-medium">{totalMileageToday}</div>
              </div>
            </div>
          </div>
          <div className="w-1/2 border border-black p-1 text-sm">
            <div className="border-b border-black pb-1 text-center text-gray-600 text-xs">Name of Carrier or Carriers</div>
            <div className="text-center pt-1 font-medium">{carrierName}</div>
          </div>
        </div>
        
        {/* Truck info and Address */}
        <div className="flex mb-2">
          <div className="w-1/2 border border-black p-1 mr-1">
            <div className="border-b border-black pb-1 text-center text-xs text-gray-600">
              Truck/Trailer and Entity Numbers or License Numbers (Show each unit)
            </div>
            <div className="text-center pt-1 font-medium text-sm">{truckNumberInfo}</div>
          </div>
          <div className="w-1/2 border border-black p-1 text-sm">
            <div className="border-b border-black pb-1 text-center text-gray-600 text-xs">
              Home Terminal Address
            </div>
            <div className="text-center pt-1 font-medium">{homeTerminalAddress}</div>
          </div>
        </div>
        
        {/* Log grids */}
        <div className="mt-4">
          {generateGridHeader()}
          {generateGrid("Off Duty", 1)}
          {generateGrid("Sleeper Berth", 2)}
          {generateGrid("Driving", 3)}
          {generateGrid("On Duty (Not Driving)", 4)}
        </div>
        
        {/* Remarks */}
        <div className="mt-4 border border-black p-1">
          <div className="border-b border-black pb-1 font-bold text-sm">Remarks</div>
          <div className="h-10 text-xs">
            <ul style={{ listStyleType: 'circle', paddingLeft: '20px' }}>
            {/*}
              <li>Loading, at Mafeteng, (From 8AM to 9AM)</li>
              <li>Unloading, at Maseru, (From 1PM to 2PM)</li>
            */}
            </ul>
          </div>
        </div>
        
        {/* Shipping Documents */}
        <div className="mt-2 border border-black p-1">
          <div className="font-bold mb-1 text-sm">Shipping Documents:</div>
          <div className="mb-2 text-xs">{shippingDocuments}</div>
          
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
