import { getItems } from "./data-fetcher.js";
import { proccessItemsData, saveItems } from "./db-connector.js";
import { timeout } from "./utils.js";

const startScraping = async () => {
  let flag = true;
  let pageNumber = 1;
  while (flag) {
    for (let i = 0; i < 5; i++) {
      await timeout(10000);
      const items = await getItems(pageNumber);
      const parsedItems = proccessItemsData(items);
      if (parsedItems.length === 0) {
        flag = false;
        break;
      } else {
        await saveItems(items);
        pageNumber++;
      }
    }
    await timeout(10000);
  }
  startScraping();
};

export default startScraping;
