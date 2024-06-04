const express = require("express");
const { BadRequestError } = require("./expressError");
const cors = require("cors");

const app = express();

const KEY = "90013C80CBD3FEA67DED4D882ACD455C";
const USER_ID = "76561199005985110";

app.use(
  cors({
    origin: ["http://localhost:5173", "https://steam-hours-frontend.onrender.com"],
    methods: ["GET", "POST"],
  })
);

const fetchData = async (key, steamId) => {
  const result = await fetch(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}&format=json`,
    {
      method: "GET",
      redirect: "follow",
    }
  );
  if (!result.ok) {
    return new BadRequestError("Invalid Steam Id");
  }
  const res = await result.json();
  // console.log(result);
  return res;
};

const fetchGameData = async (appId) => {
  const result = await fetch(
    `http://store.steampowered.com/api/appdetails?appids=${appId}`,
    {
      method: "GET",
      redirect: "follow",
    }
  );
  const res = await result.json();
  return res;
};

const fetchProfileData = async (key, steamId) => {
  const result = await fetch(
    `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`,
    {
      method: "GET",
      redirect: "follow",
    }
  );
  const res = await result.json();
  return res;
};

app.get("/getProfileData/:steamId", async (req, res) => {
  const steamId = req.params.steamId;
  const results = await fetchProfileData(KEY, steamId);
  res.send(results);
});

app.get("/getOwnedGames/:steamId", async (req, res, next) => {
  try {
    const steamId = req.params.steamId;
    const results = await fetchData(KEY, steamId);
    res.send(results);
  } catch (e) {
    return next(e);
  }
});

app.get("/getGameInfo/:appId", async (req, res) => {
  const appId = req.params.appId;
  const results = await fetchGameData(appId);

  res.send(results);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
