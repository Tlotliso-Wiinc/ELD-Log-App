# eld_api/eld_logic.py

import datetime
from typing import Dict, List, Tuple

class ELDLogicEngine:
    def __init__(self):
        # Constants for HOS regulations
        self.MAX_DRIVING_HOURS = 11  # Maximum driving hours per day
        self.MAX_DUTY_HOURS = 14     # Maximum on-duty hours per day
        self.MIN_REST_HOURS = 10     # Minimum consecutive rest hours
        self.CYCLE_LIMIT = 70        # Maximum hours in 8-day period
        self.FUEL_INTERVAL = 1000    # Fuel stop every 1000 miles
        self.FUEL_DURATION = 1       # 1 hour for fueling
        self.PICKUP_DROPOFF_DURATION = 1  # 1 hour for pickup/dropoff

    def calculate_hours(self, start_time: datetime.datetime, end_time: datetime.datetime) -> float:
        """
        Calculate the number of hours between two datetime objects
        """
        return (end_time - start_time).total_seconds() / 3600
    
    def convert_to_hours(self, seconds: int) -> float:
        """
        Convert seconds to hours
        """
        return seconds / 3600
    
    def generateTimeLog(self, route1_duration: float, route2_duration: float):
        """
        Generate a time log based on the duration of two routes (start to pickup, pickup to dropoff)
        """
        # Initialize the time log data
        logData = {
            'offDuty': [],
            'sleeper': [],
            'driving': [],
            'onDuty': [],
        }

        # Calculate the total duration of the trip
        total_duration = route1_duration + route2_duration

         # Assume the driver starts duty at 6AM
        start_time = 6  # Start time of the day
        for i in range(start_time):
            logData['offDuty'].append(i)

        # Calculate the end time of the first route (pickup)
        pickup_time = start_time + int(self.convert_to_hours(route1_duration))
        for i in range(start_time, pickup_time):
            logData['driving'].append(i)

        # Add the pickup loading time
        for i in range(pickup_time, pickup_time + self.PICKUP_DROPOFF_DURATION):
            logData['onDuty'].append(i)
  
        # Calculate the end time of the second route (dropoff)
        dropoff_time = pickup_time + self.PICKUP_DROPOFF_DURATION + int(self.convert_to_hours(route2_duration))
        for i in range(pickup_time + self.PICKUP_DROPOFF_DURATION, dropoff_time):
            logData['driving'].append(i)

        # Add the dropoff unloading time
        for i in range(dropoff_time, dropoff_time + self.PICKUP_DROPOFF_DURATION):
            logData['onDuty'].append(i)

        # Calculate the remaining hours of the day
        end_time = 24  # End time of the day
        for i in range(dropoff_time + self.PICKUP_DROPOFF_DURATION, end_time):
            logData['offDuty'].append(i)

        return logData

   