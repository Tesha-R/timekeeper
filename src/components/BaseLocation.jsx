import { useState, useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';
import MapPin from '../assets/MapPin.svg';
import CloseFilled from '../assets/CloseFilled.svg';

let didInit = false;

function BaseLocation(props) {
  const [locationLookUp, setLocationLookUp] = useState('');

  // get baseLocation from input field
  const onChangeBaseLocation = (event) => {
    props.setBaseLocation(event.target.value);
  };

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      getLocationLookUp();
      getBaseTimeData();
    }
  }, []);

  // get baseLocation automatically once on load
  function getLocationLookUp() {
    axios
      .get(
        `https://extreme-ip-lookup.com/json/?key=${
          import.meta.env.VITE_API_IP_URL
        }`
      )
      .then((response) => {
        setLocationLookUp(response.data.region);
        props.setBaseLocation(response.data.region);
        localStorage.setItem(
          'baseLocation',
          JSON.stringify(response.data.region)
        );
      });
  }

  // use baseLocation to request time
  function getBaseTimeData(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    axios
      .get(
        `https://timezone.abstractapi.com/v1/current_time?api_key=${
          import.meta.env.VITE_API_URL
        }&location=${props.baseLocation}`
      )
      .then((response) => {
        props.setBaseData(response.data);
        localStorage.setItem('baseData', JSON.stringify(response.data));
        localStorage.setItem(
          'baseLocation',
          JSON.stringify(response.data.requested_location)
        );
        props.setIsShowing(false);
      });
  }

  // delete baseLocation data / show and hide form
  function handleDeleteBaseData() {
    props.setIsShowing(true);
    props.setBaseLocation('');
    props.setBaseData('');
    localStorage.setItem('baseLocation', JSON.stringify(''));
    localStorage.setItem('baseData', JSON.stringify(''));
  }
  return (
    <>
      {props.isShowing ? (
        <div className="bg-gray-dark p-7 rounded-lg">
          <form
            className="flex flex-col justify-center "
            onSubmit={getBaseTimeData}
          >
            <label className="text-gray-200 mr-2 text-2xl font-light mb-2">
              Current location
            </label>
            <div className="flex items-center flex-col sm:flex-row">
              <input
                type="text"
                name="user-base-location"
                onChange={onChangeBaseLocation}
                placeholder="Current location"
                className=" border border-gray-300 placeholder-slate-400 focus:outline-none focus:border-sky-700 focus:ring-sky-700 block w-half 
                rounded-l-md focus:ring-1  px-5 py-2"
              />
              <button className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-r-md font-light">
                Get time
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="time-el bg-gray-dark p-7 rounded-lg">
          <div className="flex items-start justify-between">
            <p className="flex space-x-4 capitalize location text-2xl text-gray-200 mb-2 basis-6/7 font-light">
              {props.baseData?.requested_location}
              <span className="text-2xl text-gray-700 ml-1">
                {' '}
                {props.baseData?.timezone_abbreviation}
              </span>
              <img
                src={MapPin}
                className="w-8 text-gray-300"
                alt="map pin icon"
              />
            </p>
            <p>
              <button
                onClick={() => handleDeleteBaseData()}
                className="button basis-1/7 text-gray-600 hover:bg-sky-700"
              >
                <img
                  src={CloseFilled}
                  className="w-8 text-gray-300"
                  alt="close icon"
                />
              </button>
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
      )}
    </>
  );
}

export default BaseLocation;
