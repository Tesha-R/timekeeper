import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

import axios from 'axios';
import './App.css';

import BaseLocation from './components/BaseLocation';
import TimeBox from './components/TimeBox';
import closeWhite from './assets/closeWhite.svg';
import blank from './assets/blank.svg';
import TimeChange from './components/TimeChange';

/**
 * App Component
 *
 * This component serves as the main application component for the TimeKeeper app.
 * It handles the state and logic for managing base location, target locations,
 * and changing the displayed time.
 */

export default function App() {
  // State for managing whether a location was deleted
  const [isDeleted, setIsDeleted] = useState(false);
  // State for managing the visibility of the base location form
  const [isShowing, setIsShowing] = useState(false);
  // State for managing the target location
  const [targetLocation, setTargetLocation] = useState('');

  // State for managing the base location, initialized from localStorag
  const [baseLocation, setBaseLocation] = useState(() => {
    const saved = localStorage.getItem('baseLocation');
    const locations = JSON.parse(saved);
    return locations || '';
  });

  // State for managing an array of target locations, initialized from localStorage
  const [targetData, setTargetData] = useState(() => {
    const saved = localStorage.getItem('targetData');
    const locations = JSON.parse(saved);
    return locations || [];
  });

  // State for managing the base location data, initialized from localStorage
  const [baseData, setBaseData] = useState(() => {
    const saved = localStorage.getItem('baseData');
    const locations = JSON.parse(saved);
    return locations || '';
  });
  // State for managing the time input value for the base location
  const [baseTimeVal, setBaseTimeVal] = useState('');

  // State for managing whether the time has been changed
  const [isTimeChanged, setIsTimeChanged] = useState(false);

  // Function to handle changes to the base time input
  function onBaseTimeChange(e) {
    setBaseTimeVal(e.target.value);
  }
  // Combine today's date with the selected time to create a new Date object
  let today = new Date();
  let timeParts = baseTimeVal.split(':');
  let newDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    timeParts[0],
    timeParts[1]
  );
  // Function to handle the submission of the time change form
  function onChangeTimeSubmit(e) {
    e.preventDefault();
    setIsTimeChanged(true);
  }
  // Function to reset the time change form
  function handleClearTime(e) {
    e.preventDefault();
    setBaseTimeVal('');
    setIsTimeChanged(false);
  }

  // CLOCK
  // State and function to manage the current date and time
  const [date, setDate] = useState(new Date());
  // Function to refresh the clock every second
  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  // Save new locations in localStorage whenever targetData changes
  useEffect(() => {
    localStorage.setItem('targetData', JSON.stringify(targetData));
  }, [targetData]);

  // get targetLocation from input field
  function onChangeTargetLocation(event) {
    setTargetLocation(event.target.value);
  }

  // Function to use baseLocation and targetLocation to request time data
  function getTargetLocation(event) {
    event.preventDefault();
    axios
      .get(
        `https://api.ipgeolocation.io/timezone?apiKey=${
          import.meta.env.VITE_API_IPGEOLOCATION_URL
        }&location=${targetLocation}`
      )
      .then((response) => {
        setTargetData((prevstate) => [...prevstate, response.data]);
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
          location={item.geo.location}
          timezone={item.timezone}
          iconMapPin={blank}
          eventHandler={(event) => handleDeleteTimeItems(event, index)}
          iconDelete={closeWhite}
          hours={`${formatInTimeZone(newDate, item.timezone, 'h')}`}
          locationSemiColon={`${formatInTimeZone(newDate, item.timezone, ':')}`}
          minutes={formatInTimeZone(newDate, item.timezone, 'mm a')}
          day={formatInTimeZone(newDate, item.timezone, 'E, LLL d')}
        />
      )
    );
  });

  const timeItems = targetData?.map((item, index) => {
    return (
      !isTimeChanged && (
        <TimeBox
          key={index}
          location={item.geo.location}
          timezone={item.timezone}
          iconMapPin={blank}
          eventHandler={(event) => handleDeleteTimeItems(event, index)}
          iconDelete={closeWhite}
          hours={`${formatInTimeZone(date, item.timezone, 'h')}`}
          locationSemiColon={`${formatInTimeZone(date, item.timezone, ':')}`}
          minutes={formatInTimeZone(date, item.timezone, 'mm a')}
          day={formatInTimeZone(date, item.timezone, 'E, LLL d')}
        />
      )
    );
  });

  return (
    <div className="App">
      <div className="container mx-auto">
        <h1 className="logo text-white text-3xl py-7 pl-10 font-bold md:pl-0">
          TimeKeeper
        </h1>
        <div className="main p-10 bg-gray-medium rounded-lg ">
          <div className="pb-10 ">
            <div className="target-location space-x-0 items-end justify-start lg:flex lg:space-x-3">
              <form
                className="flex items-end mb-3 lg:mb-0"
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
                    placeholder="(e.g., Los Angeles, CA)"
                    id="newLocation"
                    type="text"
                    name="new-location"
                    onChange={onChangeTargetLocation}
                    className=" border border-gray-300 placeholder-slate-400 focus:outline-none focus:border-sky-700 focus:ring-sky-700 block w-half rounded-l-md focus:ring-1  px-5 py-2"
                  />
                </div>
                <button
                  disabled={!targetLocation}
                  className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-r-md font-light"
                >
                  Add
                </button>
              </form>
              <div className="mb-3 lg:mb-0">
                <TimeChange
                  onSubmit={onChangeTimeSubmit}
                  onTimeChange={onBaseTimeChange}
                  inputTimeVal={baseTimeVal}
                  isDisabled={!baseTimeVal}
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
