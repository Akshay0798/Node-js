//stateless authentication
const jwt = require("jsonwebtoken");
const secret = "Suppu@0231";

//this function will make token for me
function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
}

// we were maintaining state bcoz its statefull authentication
/*const sessionIdToUserMap = new Map();

function setUser(id, user) {
  sessionIdToUserMap.set(id, user);
}

function getUser(id) {
  return sessionIdToUserMap.get(id);
}*/

module.exports = {
  setUser,
  getUser,
};
