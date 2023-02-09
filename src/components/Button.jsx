function Button(props) {
  return (
    <button className="bg-gray-medium hover:bg-sky-700 border border-gray-300 px-5 py-2 text-gray-300 rounded-md font-light mr-3">
      {props.name}
    </button>
  );
}

export default Button;
