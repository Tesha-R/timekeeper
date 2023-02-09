import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

function Clock() {
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
  return (
    <>
      <div>
        <p className="text-white">
          Format{' '}
          {formatInTimeZone(date, 'America/New_York', 'E, LLL d h:mm:ss a zzz')}
        </p>
      </div>

      <div className="time-el bg-gray-dark p-7 rounded-lg">
        <div className="flex items-start justify-between">
          <p className="location text-2xl text-gray-200 mb-2 basis-6/7 font-light">
            Detroit - timezone_abbreviation
            <span className="text-2xl text-gray-700"> </span>
          </p>
          <button className="button basis-1/7 text-gray-600 hover:bg-sky-700">
            x
          </button>
        </div>
        <p className="text-7xl text-white mb-2">
          {formatInTimeZone(date, 'America/New_York', 'h:mm:ss a')}
        </p>
        <p className="text-gray-400 text-3xl font-light">
          {formatInTimeZone(date, 'America/New_York', 'E, LLL d')}
        </p>
      </div>
    </>
  );
}

export default Clock;

// {formatInTimeZone(date, 'America/New_York', 'MM-dd h:mm:ss a zzz')}
//{formatInTimeZone(date, 'America/New_York', `h ${colon}mm:ss a zzz`)}

//   let text = "HELLO WORLD";
//   let letter = text.charAt(0);
//  {formatInTimeZone(date, 'America/New_York', 'h:mm:ss a zzz')}
// 2023-02-02 19:50:17
// "2020-05-12T23:50:21.817Z"
