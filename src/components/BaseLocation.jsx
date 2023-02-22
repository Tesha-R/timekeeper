import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';
import MapPin from '../assets/MapPin.svg';
import { useEffect } from 'react';

function BaseLocation(props) {
  useEffect(() => {
    axios
      .get(
        `https://extreme-ip-lookup.com/json/?key=${
          import.meta.env.VITE_API_IP_URL
        }`
      )
      .then((response) => {
        console.log('response', response.data.region);
        props.setBaseLocation(response.data.region);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `https://timezone.abstractapi.com/v1/current_time?api_key=${
          import.meta.env.VITE_API_URL
        }&location=${props.baseLocation}`
      )
      .then((response) => {
        localStorage.setItem('baseData', JSON.stringify(response.data));
        console.log('response', response.data);
        props.setBaseData(response.data);
      });
  }, []);

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
