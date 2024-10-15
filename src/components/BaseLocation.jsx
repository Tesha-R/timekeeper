import { useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';

import MapPin from '../assets/MapPin.svg';
import closeWhite from '../assets/closeWhite.svg';
import TimeBox from './TimeBox';

/**
 * BaseLocation Component
 *
 * This component handles the base location for the timekeeper app. It allows the user to set their current location,
 * automatically fetches the user's location and time, and displays the current time for the base location.
 *
 * Props:
 * - baseLocation: The current base location.
 * - setBaseLocation: Function to update the base location.
 * - baseData: The data for the base location.
 * - setBaseData: Function to update the base location data.
 * - isShowing: Boolean to control the visibility of the location input form.
 * - setIsShowing: Function to update the visibility of the location input form.
 * - date: The current date and time.
 */

//   `https://timezone.abstractapi.com/v1/current_time?api_key=${apiKey}&location=${region}`

function BaseLocation(props) {
  // get baseLocation from input field
  const onChangeBaseLocation = (event) => {
    props.setBaseLocation(event.target.value);
  };
  // Extracted API call function
  const fetchLocationData = async (apiKey, region) => {
    const response = await axios.get(
      `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&location=${region}`
    );
    console.log('initial request - fetchLocationData', response);
    return response.data;
  };

  // get users time automatically
  useEffect(() => {
    const getDateTimeAutomatically = async () => {
      // Check if baseLocation is already set
      if (props.baseLocation) {
        return; // If baseLocation is already set, no need to fetch again
      }

      try {
        const response1 = await axios.get(
          `https://extreme-ip-lookup.com/json/?key=${
            import.meta.env.VITE_API_IP_URL
          }`
        );
        const baseData = await fetchLocationData(
          import.meta.env.VITE_API_URL,
          response1.data.region
        );
        props.setBaseLocation(response1.data.region);
        props.setBaseData(baseData);
        props.setIsShowing(false);
        localStorage.setItem(
          'baseLocation',
          JSON.stringify(response1.data.region)
        );
        localStorage.setItem('baseData', JSON.stringify(baseData));
      } catch (error) {
        console.error('An error occurred while fetching data');
      }
    };
    getDateTimeAutomatically();
  }, [
    props.baseLocation,
    props.setBaseLocation,
    props.setBaseData,
    props.setIsShowing,
  ]);

  // use baseLocation to request time
  async function getBaseTimeData(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    try {
      const response = await axios.get(
        `https://api.ipgeolocation.io/timezone?apiKey=${
          import.meta.env.VITE_API_IPGEOLOCATION_URL
        }&location=${props.baseLocation}`
      );
      props.setBaseData(response.data);
      props.setIsShowing(false);
      localStorage.setItem('baseData', JSON.stringify(response.data));
      localStorage.setItem(
        'baseLocation',
        JSON.stringify(response.data.requested_location)
      );
    } catch (error) {
      //console.error('ERROR - getBaseTimeData', error);
      console.error('ERROR - getBaseTimeData');
    }
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
        <TimeBox
          location={props.baseData?.requested_location}
          timezone={props.baseData?.timezone_abbreviation}
          iconMapPin={MapPin}
          eventHandler={() => handleDeleteBaseData()}
          iconDelete={closeWhite}
          hours={`${formatInTimeZone(
            props.date,
            props.baseData?.timezone_location,
            'h'
          )}`}
          locationSemiColon={`${formatInTimeZone(
            props.date,
            props.baseData?.timezone_location,
            ':'
          )}`}
          minutes={formatInTimeZone(
            props.date,
            props.baseData?.timezone_location,
            'mm a'
          )}
          day={formatInTimeZone(
            props.date,
            props.baseData?.timezone_location,
            'E, LLL d'
          )}
        />
      )}
    </>
  );
}

export default BaseLocation;
