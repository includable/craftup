const populateValue = (value) => {
  if (value.match(/^\$([a-z0-9_]+)$/i)) {
    const p1 = value.substring(1);
    return p1 in process.env ? process.env[p1] : value;
  }

  value = value.replace(/\${([a-z0-9_]+)\}/gi, (m, p1) =>
    p1 in process.env ? process.env[p1] : p1
  );

  return value;
};

module.exports = {
  populateValue,
};
