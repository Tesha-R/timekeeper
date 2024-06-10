// TimeChange.jsx

/**
 * TimeChange Component
 *
 * This component renders a form with a time input and a button to submit the selected time.
 * It allows the user to select a time and submit it to update the time displayed in other components.
 *
 * Props:
 * - onSubmit: Function to handle the form submission.
 * - onTimeChange: Function to handle changes to the time input.
 * - inputTimeVal: The current value of the time input.
 */

function TimeChange(props) {
  return (
    <div className="flex justify-between mb-3 sm:mb-0">
      <form onSubmit={props.onSubmit}>
        <div className="flex items-end space-x-3">
          <div>
            <label
              htmlFor="changeTime"
              className="block text-sm font-medium text-white"
            >
              Time
            </label>
            <input
              id="changeTime"
              type="time"
              name="time"
              onChange={props.onTimeChange}
              value={props.inputTimeVal}
              className="border border-gray-300 px-5 py-2 bg-white  placeholder-slate-400 rounded-md focus:outline-none focus:border-sky-700 focus:ring-sky-700"
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
