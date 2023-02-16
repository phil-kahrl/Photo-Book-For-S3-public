const isSmartPhone = onChange => {
  const matchMax = window.matchMedia('(max-device-width : 950px)');
  matchMax.addListener(onChange);
  return matchMax.matches;
};

export default isSmartPhone;
