import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';
import './App.css';

import BaseLocation from './components/BaseLocation';
import Button from './components/Button';
import CloseFilled from './assets/CloseFilled.svg';

export default function App() {
  const [isDeleted, setIsDeleted] = useState(false); // delete location
  const [isShowing, setIsShowing] = useState(false); // show form for baseLocation

  const [targetLocation, setTargetLocation] = useState(''); // set new targetLocation

  // set new baseLocation
  const [baseLocation, setBaseLocation] = useState(() => {
    const saved = localStorage.getItem('baseLocation');
    const locations = JSON.parse(saved);
    return locations || [''];
  });

  // save array of new locations data in localStorage
  const [targetData, setTargetData] = useState(() => {
    const saved = localStorage.getItem('targetData');
    const locations = JSON.parse(saved);
    return locations || [];
  });

  // save base location data in localStorage to render
  const [baseData, setBaseData] = useState(() => {
    const saved = localStorage.getItem('baseData');
    const locations = JSON.parse(saved);
    return locations || '';
  });

  // // CLOCK
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  // get updated locations in localStorage everytime state changes
  useEffect(() => {
    JSON.parse(localStorage.getItem('baseData'));
  }, [baseData]);

  // save new locations in localStorage everytime state changes
  useEffect(() => {
    localStorage.setItem('targetData', JSON.stringify(targetData));
  }, [targetData]);

  // get updated locations in localStorage everytime state changes
  useEffect(() => {
    JSON.parse(localStorage.getItem('targetData'));
  }, [targetData]);

  // save updated locations in localStorage everytime state changes
  useEffect(() => {
    localStorage.setItem('targetData', JSON.stringify(targetData));
    //setIsDeleted(false);
  }, [isDeleted]);

  // get targetLocation from input field
  function onChangeTargetLocation(event) {
    setTargetLocation(event.target.value);
    console.log('targetLocation', targetLocation);
  }
  // use baseLocation and targetLocation to request time
  function getTargetLocation(event) {
    event.preventDefault();
    axios
      .get(
        `https://timezone.abstractapi.com/v1/convert_time?api_key=${
          import.meta.env.VITE_API_URL
        }&base_location=${baseLocation}&target_location=${targetLocation}`
      )
      .then((response) => {
        setTargetData((prevstate) => [
          ...prevstate,
          response.data.target_location,
        ]);
      });
    setTargetLocation('');
  }

  // delete new location items
  function handleDeleteTimeItems(event, index) {
    event.preventDefault();
    targetData.splice(index, 1);
    setIsDeleted(true);
  }

  const timeItems = targetData?.map((item, index) => {
    return (
      <div key={index} className="time-el bg-gray-dark p-7 rounded-lg">
        <div className="flex items-start justify-between">
          <p className="capitalize location text-2xl text-gray-200 mb-2 basis-6/7 font-light">
            {item.requested_location}
            <span className="text-2xl text-gray-700">
              {' '}
              {item.timezone_abbreviation}
            </span>
          </p>
          <button
            onClick={(event) => handleDeleteTimeItems(event, index)}
            className="button basis-1/7 text-gray-600 hover:bg-sky-700"
          >
            <img
              src={CloseFilled}
              className="w-8 text-gray-300"
              alt="close icon"
            />
          </button>
        </div>

        <p className="text-6xl sm:text-7xl  text-white mb-2 lowercase flex items-center ">
          {' '}
          {`${formatInTimeZone(date, item.timezone_location, 'h')}`}{' '}
          <span className="animate-pulse pb-3">{`${formatInTimeZone(
            date,
            item.timezone_location,
            ':'
          )}`}</span>
          {formatInTimeZone(date, item.timezone_location, 'mm a')}
        </p>
        <p className="text-gray-400 text-2xl font-light md:text-3xl">
          {formatInTimeZone(date, item.timezone_location, 'E, LLL d')}
        </p>
      </div>
    );
  });

  return (
    <div className="App">
      <div className="container mx-auto">
        <h1 className="logo text-white text-3xl py-7 font-bold pl-10">
          TimeKeeper
        </h1>
        <div className="main p-10 bg-gray-medium rounded-lg ">
          <div className="pb-10 ">
            <div className="target-location space-x-0 items-center justify-start lg:flex  sm:space-x-3">
              <form
                className="flex items-center mb-3 sm:mb-0"
                onSubmit={getTargetLocation}
              >
                <input
                  type="text"
                  name="new-location"
                  onChange={onChangeTargetLocation}
                  className=" border border-gray-300 placeholder-slate-400 focus:outline-none focus:border-sky-700 focus:ring-sky-700 block w-half 
                  rounded-l-md focus:ring-1  px-5 py-2"
                />
                <button className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-r-md font-light">
                  Add city
                </button>
              </form>

              <div>
                {' '}
                <Button name="Change time" />
                <Button name="Reset" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              <BaseLocation
                baseLocation={baseLocation}
                setBaseLocation={setBaseLocation}
                baseData={baseData}
                setBaseData={setBaseData}
                date={date}
                setIsShowing={setIsShowing}
                isShowing={isShowing}
              />
            }
            {targetData && timeItems}
          </div>
        </div>
      </div>
    </div>
  );
}
