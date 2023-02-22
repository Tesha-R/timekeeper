import { useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';
import MapPin from '../assets/MapPin.svg';

function BaseLocation(props) {
  useEffect(() => {
    if (props.baseLocation) {
      getUserCurrentTime();
    }
  }, []);

  async function getUserCurrentTime() {
    try {
      const response = await axios
        .get(
          `https://timezone.abstractapi.com/v1/current_time?api_key=${
            import.meta.env.VITE_API_URL
          }&location=${props.baseLocation}`
        )
        .then((response) => {
          props.setBaseData(response.data);
          localStorage.setItem('baseData', JSON.stringify(response.data));
          console.log('response baseData getUserCurrentTime', response.data);
        });
    } catch (error) {
      console.log('ERROR - getUserCurrentTime', error);
    }
  }

  return (
    <div className="time-el bg-gray-dark p-7 rounded-lg">
      <div className="flex items-start justify-between">
        <p className="capitalize location text-2xl text-gray-200 mb-2 basis-6/7 font-light">
          {props.baseData?.requested_location}
          <span className="text-2xl text-gray-700">
            {' '}
            {props.baseData?.timezone_abbreviation}
          </span>
        </p>
        <p>
          {' '}
          <img src={MapPin} className="w-8 text-gray-300" alt="map pin icon" />
        </p>
      </div>
      <p className="text-6xl sm:text-7xl  text-white mb-2 lowercase flex items-center ">
        {' '}
        {`${formatInTimeZone(
          props.date,
          props.baseData?.timezone_location,
          'h'
        )}`}{' '}
        <span className="animate-pulse pb-3">{`${formatInTimeZone(
          props.date,
          props.baseData?.timezone_location,
          ':'
        )}`}</span>
        {formatInTimeZone(
          props.date,
          props.baseData?.timezone_location,
          'mm:ss a'
        )}
      </p>
      <p className="text-gray-400 text-2xl font-light md:text-3xl">
        {formatInTimeZone(
          props.date,
          props.baseData?.timezone_location,
          'E, LLL d'
        )}
      </p>
    </div>
  );
}

export default BaseLocation;
