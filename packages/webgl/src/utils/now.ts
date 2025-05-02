const now = () => {
  return (typeof performance === "undefined" ? Date : performance).now();
};

export default now;
