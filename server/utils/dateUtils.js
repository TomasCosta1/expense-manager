/**
 * Parsea una fecha en formato ISO y devuelve un objeto { year, month, day }
 * @param {string} isoString
 */
const parseDateLocal = (isoString) => {
  const [year, month, day] = isoString.slice(0, 10).split("-").map(Number);
  return {
    year,
    month: month - 1,
    day
  };
};

module.exports = {
  parseDateLocal
};
