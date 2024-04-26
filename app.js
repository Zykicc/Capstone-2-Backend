const express = require("express");
const cors = require("cors");

const app = express();

const KEY = "90013C80CBD3FEA67DED4D882ACD455C";
const USER_ID = "76561199005985110";

app.use(
  cors({
    origin: "http://localhost:5173",
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
  const res = await result.json();
  // console.log(result);
  return res;
};

app.get("/", async (req, res) => {
  const results = await fetchData(KEY, USER_ID);
  // console.log(results);
  res.send(results);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
