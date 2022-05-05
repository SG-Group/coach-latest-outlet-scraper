import { Sequelize, DataTypes } from "sequelize";
import cheerio from "cheerio";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
});

const DB = sequelize.define("Items", {
  upc: DataTypes.STRING,
  name: DataTypes.STRING,
  brand: DataTypes.STRING,
  price: DataTypes.REAL,
  lastUpdatedPrice: DataTypes.REAL,
  originalPrice: DataTypes.REAL,
  discount: DataTypes.NUMBER,
  url: DataTypes.STRING,
  img: DataTypes.STRING,
});

/**
 * Connects to the local db
 */
export const connectToDatabase = () => {
  try {
    sequelize.authenticate();
    sequelize.sync();
  } catch (error) {
    console.log("Oops! Error connecting to the db :( ", error);
  }
};

/**
 * Processes raw product data as html and format it according to the db specification
 * @param {*} data raw product data as html
 * @returns formatted product data
 */
export const proccessItemsData = (html) => {
  try {
    const $ = cheerio.load(html);
    let products = [];

    $("div.product").each((idx, element) => {
      try {
        const json = JSON.parse($(element).attr("data-gtmitemdata"));
        products.push({
          upc: json.item_id,
          name: json.item_name,
          brand: json.item_brand,
          price: parseFloat(json.price),
          originalPrice: parseFloat(json.was_price),
          url: `https://www.coachoutlet.com/search?q=${json.item_id}&search-button=&lang=en_US`,
          img: `https://images.coach.com${$(element)
            .find("picture")
            .attr("data-gtm-imageurl")}`,
          discount: (
            ((json.was_price - json.price) / json.was_price) *
            100
          ).toFixed(0),
        });
      } catch (error) {
        console.log(`Error Processing product ${err.message}`);
      }
    });
    return products;
  } catch (error) {
    console.log(html);
    console.log(error.msg);
  }
};

/**
 * Persists a list of items to the local db
 * @param {*} items raw product data
 */
export const saveItems = async (items) => {
  for (let item of items) {
    let itemAlreadyExists = await DB.findOne({ where: { upc: item.upc } });
    if (itemAlreadyExists && itemAlreadyExists.price !== item.price) {
      /**
       * Updates item if it already exists in db and
       * saves last price to lastUpdatedPrice
       */
      await itemAlreadyExists
        .update({
          upc: item.upc,
          name: item.name,
          brand: item.brand,
          price: item.price,
          lastUpdatedPrice: itemAlreadyExists.price,
          originalPrice: item.originalPrice,
          discount: item.discount,
          url: item.url,
          img: item.img,
        })
        .catch(console.error);
    } else {
      await DB.create(item).catch(console.error);
    }
  }
};

export default {};
