export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email); // use the regex instance's test() method
};

export const getInitial = (title = "") => {
  if (!title) return ""; // return empty if no title

  const words = title.trim().split(" "); // split by spaces
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};
