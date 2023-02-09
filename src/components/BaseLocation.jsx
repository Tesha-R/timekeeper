import { formatInTimeZone } from 'date-fns-tz';
import axios from 'axios';

import CloseFilled from '../assets/CloseFilled.svg';

function BaseLocation(props) {
  const onChangeBaseLocation = (event) => {
    props.setBaseLocation(event.target.value);
  };
  function handleShowForm() {
    props.setIsShowing(false);
    props.setBaseLocation('');
    localStorage.setItem('baseLocation', JSON.stringify(''));
    console.log('baselocation isShowing false', props.isShowing);
  }
  function getBaseTimeData(event) {
    event.preventDefault();
    axios
      .get(
        `https://timezone.abstractapi.com/v1/current_time?api_key=${
          import.meta.env.VITE_API_URL
        }&location=${props.baseLocation}`
      )
      .then((response) => {
        localStorage.setItem('baseData', JSON.stringify(response.data));
        localStorage.setItem(
          'baseLocation',
          JSON.stringify(response.data.requested_location)
        );
        props.setBaseData(response.data);
        props.setIsShowing(true);
        console.log('BL isShowing true', props.isShowing);
      });
  }
  //console.log('props.date', props.date);
  return (
    <div className="base-location">
      <div className="flex items-center">
        {props.isShowing && (
          <>
            <div className="bg-gray-dark p-7 rounded-lg flex items-baseline ">
              <h2 className="flex flex-col text-gray-300 font-light mr-3">
                <p className="mr-2 text-2xl">
                  {props.baseData?.requested_location}{' '}
                  {props.baseData?.timezone_abbreviation}
                </p>
                <p className="mr-2 text-3xl">
                  {formatInTimeZone(
                    props.date,
                    props.baseData?.timezone_location,
                    'E, LLL d h:mm:ss a'
                  )}
                </p>
              </h2>
              <button onClick={handleShowForm}>
                {' '}
                <img
                  src={CloseFilled}
                  className="w-7 text-gray-300"
                  alt="close icon"
                />
              </button>
            </div>
          </>
        )}
      </div>
      {!props.isShowing && (
        <form
          className="flex items-end sm:items-center"
          onSubmit={getBaseTimeData}
        >
          <div className="flex items-center flex-col sm:flex-row">
            <label className="text-gray-200 mr-2">My location</label>
            <input
              type="text"
              name="user-base-location"
              onChange={onChangeBaseLocation}
              className=" border border-gray-300 placeholder-slate-400 focus:outline-none focus:border-sky-700 focus:ring-sky-700 block w-half 
          rounded-l-md focus:ring-1  px-5 py-2"
            />
          </div>
          <button className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-r-md font-light">
            Get time
          </button>
        </form>
      )}
    </div>
  );
}

export default BaseLocation;
