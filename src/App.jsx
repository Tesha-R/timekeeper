import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

import axios from 'axios';
import './App.css';

import BaseLocation from './components/BaseLocation';
import TimeBox from './components/TimeBox';
import closeWhite from './assets/closeWhite.svg';
import blank from './assets/blank.svg';
import TimeChange from './components/TimeChange';

export default function App() {
  const [isDeleted, setIsDeleted] = useState(false); // delete location
  const [isShowing, setIsShowing] = useState(false); // show form for baseLocation

  const [targetLocation, setTargetLocation] = useState(''); // set new targetLocation

  // set new baseLocation
  const [baseLocation, setBaseLocation] = useState(() => {
    const saved = localStorage.getItem('baseLocation');
    const locations = JSON.parse(saved);
    return locations || '';
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

  const [baseTimeVal, setBaseTimeVal] = useState('');

  const [isTimeChanged, setIsTimeChanged] = useState(false);

  function onBaseTimeChange(e) {
    setBaseTimeVal(e.target.value);
  }

  // Changed: Always use today's date combined with the selected time
  let today = new Date(); // always use today's date
  let timeParts = baseTimeVal.split(':');
  let newDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    timeParts[0],
    timeParts[1]
  );

  function onChangeTimeSubmit(e) {
    e.preventDefault();
    setIsTimeChanged(true);
  }

  function handleClearTime(e) {
    e.preventDefault();
    setBaseTimeVal('');
    setIsTimeChanged(false);
  }

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

  // save new locations in localStorage everytime state changes
  useEffect(() => {
    localStorage.setItem('targetData', JSON.stringify(targetData));
  }, [targetData]);

  // get targetLocation from input field
  function onChangeTargetLocation(event) {
    setTargetLocation(event.target.value);
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
    setTargetData((prevState) => {
      const updatedData = [...prevState];
      updatedData.splice(index, 1);
      return updatedData;
    });
    setIsDeleted(true);
  }

  const timeChangeItems = targetData?.map((item, index) => {
    return (
      isTimeChanged && (
        <TimeBox
          key={index}
          location={item.requested_location}
          timezone={item.timezone_abbreviation}
          iconMapPin={blank}
          eventHandler={(event) => handleDeleteTimeItems(event, index)}
          iconDelete={closeWhite}
          hours={`${formatInTimeZone(newDate, item.timezone_location, 'h')}`}
          locationSemiColon={`${formatInTimeZone(
            newDate,
            item.timezone_location,
            ':'
          )}`}
          minutes={formatInTimeZone(newDate, item.timezone_location, 'mm a')}
          day={formatInTimeZone(newDate, item.timezone_location, 'E, LLL d')}
        />
      )
    );
  });

  const timeItems = targetData?.map((item, index) => {
    return (
      !isTimeChanged && (
        <TimeBox
          key={index}
          location={item.requested_location}
          timezone={item.timezone_abbreviation}
          iconMapPin={blank}
          eventHandler={(event) => handleDeleteTimeItems(event, index)}
          iconDelete={closeWhite}
          hours={`${formatInTimeZone(date, item.timezone_location, 'h')}`}
          locationSemiColon={`${formatInTimeZone(
            date,
            item.timezone_location,
            ':'
          )}`}
          minutes={formatInTimeZone(date, item.timezone_location, 'mm a')}
          day={formatInTimeZone(date, item.timezone_location, 'E, LLL d')}
        />
      )
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
            <div className="target-location space-x-0 items-end justify-start lg:flex sm:space-x-3">
              <form
                className="flex items-end mb-3 sm:mb-0"
                onSubmit={getTargetLocation}
              >
                <div>
                  <label
                    htmlFor="newLocation"
                    className="block text-sm font-medium text-white"
                  >
                    Location
                  </label>
                  <input
                    id="newLocation"
                    type="text"
                    name="new-location"
                    onChange={onChangeTargetLocation}
                    className=" border border-gray-300 placeholder-slate-400 focus:outline-none focus:border-sky-700 focus:ring-sky-700 block w-half rounded-l-md focus:ring-1  px-5 py-2"
                  />
                </div>
                <button className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-r-md font-light">
                  Add city
                </button>
              </form>
              <div>
                <TimeChange
                  onSubmit={onChangeTimeSubmit}
                  onTimeChange={onBaseTimeChange}
                  inputTimeVal={baseTimeVal}
                />
              </div>
              <div>
                <button
                  onClick={handleClearTime}
                  className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-md font-light mr-3"
                >
                  Reset
                </button>
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
                date={isTimeChanged ? newDate : date}
                setIsShowing={setIsShowing}
                isShowing={isShowing}
              />
            }
            {targetData && timeItems}
            {timeChangeItems ? timeChangeItems : timeItems}
          </div>
        </div>
      </div>
    </div>
  );
}
