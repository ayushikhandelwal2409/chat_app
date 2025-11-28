const Loader = ({ fullscreen = false, label = 'Loading...' }) => {
  return (
    <div className={fullscreen ? 'loader loader--fullscreen' : 'loader'}>
      <span className="loader__spinner" />
      <p>{label}</p>
    </div>
  );
};

export default Loader;

