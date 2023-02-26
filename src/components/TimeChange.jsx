function TimeChange(props) {
  return (
    <div className="flex justify-between mb-3 sm:mb-0">
      <form onSubmit={props.onSubmit}>
        <div className="flex items-end space-x-3">
          <div>
            <label className="block text-sm font-medium text-white">Date</label>
            <input
              type="date"
              name="date"
              onChange={props.onDateChange}
              value={props.inputDateVal}
              className="px-3 py-2 bg-white  placeholder-slate-400 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Time</label>
            <input
              type="time"
              name="time"
              onChange={props.onTimeChange}
              value={props.inputTimeVal}
              className="px-3 py-2 bg-white  placeholder-slate-400 rounded-md"
            />
          </div>
          <div>
            {' '}
            <button className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-md font-light mr-3 w-36">
              Change time
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TimeChange;
