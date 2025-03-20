export interface Trip {
    id: string;
    date: string;
    currentLocation: string;
    pickupLocation: string;
    dropoffLocation: string;
    cycleHours: number;
  }
  
  export const mockTrips: Trip[] = [
    {
      id: "1",
      date: "2025-03-20 08:00",
      currentLocation: "Warehouse A",
      pickupLocation: "Client X",
      dropoffLocation: "Client Y",
      cycleHours: 6
    },
    {
      id: "2",
      date: "2025-03-20 14:30",
      currentLocation: "Distribution Center B",
      pickupLocation: "Supplier Z",
      dropoffLocation: "Retail Outlet 5",
      cycleHours: 4
    }
  ];