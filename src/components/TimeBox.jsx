function TimeBox(props) {
  return (
    <div className="time-el bg-gray-dark p-7 rounded-lg">
      <div className="flex items-start justify-between">
        <p className="flex space-x-4 capitalize location text-2xl text-gray-200 mb-2 basis-6/7 font-light">
          {props.location}
          <span className="text-2xl text-gray-700 ml-1">{props.timezone}</span>
          <img
            src={props.iconMapPin}
            className="w-8 text-gray-300"
            alt="map pin icon"
          />
        </p>
        <p>
          <button
            onClick={props.eventHandler}
            className="button basis-1/7 text-gray-600 hover:bg-sky-700"
          >
            <img
              src={props.iconDelete}
              className="w-8 text-gray-300"
              alt="close icon"
            />
          </button>
        </p>
      </div>
      <p className="text-6xl md:max-xl:text-6xl sm:text-7xl  text-white mb-2 lowercase flex items-center ">
        {props.hours}

        <span className="animate-pulse pb-3">{props.locationSemiColon}</span>
        {props.minutes}
      </p>
      <p className="text-gray-400 text-2xl font-light md:text-3xl">
        {props.day}
      </p>
    </div>
  );
}

export default TimeBox;
