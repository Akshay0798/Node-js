const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  try {
    const userUid = req.cookies?.uid;

    if (!userUid) {
      console.error("User UID not found in cookies");
      return res.redirect("/login");
    }

    const user = await getUser(userUid);

    if (!user) {
      console.error("User not found for UID:", userUid);
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error occurred while fetching user:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = { 
    restrictToLoggedinUserOnly,
};
