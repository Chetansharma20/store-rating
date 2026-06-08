const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour
    sameSite: "lax",
  });
};

const clearCookie = (res) => {
  res.clearCookie("token");
};

module.exports = {
  setCookie,
  clearCookie,
};
