import axios from "axios";
import https from "https";
import http from "http";

/**
 * Gets items data from the Coach Outlet API
 * @param {number} page page number to query by
 * @returns raw items data as html
 */
export const getItems = async (page) => {
  let items;
  let url = `https://www.coachoutlet.com/shop/whats-new/view-all?page=${page}&start=0`;
  try {
    let response = await axios.post(
      "https://de.hideproxy.me/includes/process.php?action=update",
      new URLSearchParams({ u: url }),
      {
        headers: {
          authority: `de.hideproxy.me`,
          origin: "https://hide.me",
          "content-type": "application/x-www-form-urlencoded",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          referer: "https://hide.me/",
          "accept-language": "en-US,en;q=0.9,sv;q=0.8,hy;q=0.7",
          cookie: `s=qq5qmklp838e3kuufkjvtms5pb`,
        },
        httpAgent: new http.Agent({ keepAlive: true }),
        httpsAgent: new https.Agent({ keepAlive: true }),
      }
    );
    if (response && response.status === 200) {
      items = response.data;
    } else {
      throw new Error("Unable to get products");
    }
  } catch (error) {
    console.log(error.message);
  }
  return items;
};

export default {};
