import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';
import './App.css';

import BaseLocation from './components/BaseLocation';
import Button from './components/Button';
import CloseFilled from './assets/CloseFilled.svg';

export default function App() {
  const [isDeleted, setIsDeleted] = useState(false); // delete location
  const [isShowing, setIsShowing] = useState(false); // show and hide form
  const [targetLocation, setTargetLocation] = useState(); // set new location
  // hold array of locations data
  const [targetData, setTargetData] = useState(() => {
    const saved = localStorage.getItem('targetData');
    const locations = JSON.parse(saved);
    return locations || '';
  });

  const [baseLocation, setBaseLocation] = useState(() => {
    const saved = localStorage.getItem('baseLocation');
    const initial = JSON.parse(saved);
    return initial || '';
  });

  // all base location data saved in local storage
  const [baseData, setBaseData] = useState(() => {
    const saved = localStorage.getItem('baseData');
    const initial = JSON.parse(saved);
    return initial || '';
  });

  // CLOCK
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
  // stay rendered on refresh
  useEffect(() => {
    localStorage.getItem('baseLocation');
    if (baseLocation) {
      setIsShowing(true);
    }
  }, []);

  // save new locations in local storage everytime state changes
  useEffect(() => {
    localStorage.setItem('targetData', JSON.stringify(targetData));
  }, [targetData]);

  useEffect(() => {
    JSON.parse(localStorage.getItem('targetData'));
  }, [targetData]);

  useEffect(() => {
    localStorage.setItem('targetData', JSON.stringify(targetData));
    //setIsDeleted(false);
  }, [isDeleted]);

  function onChangeTargetLocation(event) {
    setTargetLocation(event.target.value);
  }
  //console.log('import.meta.env.API_URL', import.meta.env.VITE_API_URL);

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
  }

  // delete time items
  function handleDeleteTimeItems(event) {
    targetData.splice(event.target.dataset.id, 1);
    setIsDeleted(true);
    console.log('delete', event);
    console.log('isDeleted', isDeleted);
  }

  const timeItems = targetData.map((item, index) => {
    return (
      <div className="time-el bg-gray-dark p-7 rounded-lg">
        <div className="flex items-start justify-between">
          <p className="location text-2xl text-gray-200 mb-2 basis-6/7 font-light">
            {item.requested_location}
            <span className="text-2xl text-gray-700"> {item.gmt_offset}</span>
          </p>
          <button
            onClick={handleDeleteTimeItems}
            data-id={index}
            className="button basis-1/7 text-gray-600 hover:bg-sky-700"
          >
            <img
              src={CloseFilled}
              className="w-8 text-gray-300"
              alt="close icon"
            />
          </button>
        </div>
        <p className="text-6xl sm:text-7xl  text-white mb-2">
          {formatInTimeZone(date, `${item.timezone_location}`, 'h:mm:ss a')}
        </p>
        <p className="text-gray-400 text-3xl font-light">
          {formatInTimeZone(date, `${item.timezone_location}`, 'E, LLL d')}
        </p>
      </div>
    );
  });

  return (
    <div className="App">
      <div className="container mx-auto">
        <h1 className="logo text-white text-3xl py-7 font-bold">TimeKeeper</h1>
        <div className="main p-10 bg-gray-medium rounded-lg ">
          <div className="pb-10 grid grid-cols-1 col-auto md:grid-cols-1 lg:grid-cols-2 gap-8">
            {
              <BaseLocation
                baseLocation={baseLocation}
                setBaseLocation={setBaseLocation}
                baseData={baseData}
                setBaseData={setBaseData}
                isShowing={isShowing}
                setIsShowing={setIsShowing}
                date={date}
              />
            }
            <div className="target-location space-x-0 items-center justify-end lg:flex md:max-xl:flex-col sm:space-x-3">
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

              <div className="ml-0" onMouseLeave={-0.25}>
                {' '}
                <Button name="Change time" />
                <Button name="Reset" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {timeItems}
          </div>
        </div>
      </div>
    </div>
  );
}
