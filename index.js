import startScraping from "./src/script-logic.js";
import { connectToDatabase } from "./src/db-connector.js";

const main = async () => {
  try {
    connectToDatabase();
    startScraping();
  } catch (error) {
    console.log("Oops! Something went wrong :( ", error);
  }
};

main();
