const express = require("express");
const cors = require("cors");
const { v4 } = require("uuid");
const { readFile, writeFile } = require("./api/metods");
const errorMiddleware = require("./middleware/error.middleware");
const { BedRequest } = require("./error/error");

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

/////get
app.get("/get_product", (req, res, next) => {
  try {
   
    const data = readFile("products.json");
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

/////get_one

app.get("/get_one_product/:id", (req, res, next) => {
  try {
    const readFileData = readFile("products.json");
    const foundedData = readFileData.find((item) => item.id === req.params.id);
    if (!foundedData) {
      throw BedRequest(404,"Mahsulot topilmadi")
    }
    res.status(200).json(foundedData);
  } catch (error) {
    next(error);
  }
});

////////add product

app.post("/add_product", (req, res, next) => {
  try {
    const readFileData = readFile("products.json");
    if (typeof req.body.title !== "string") {
      throw BedRequest(400,"Title stringda emas")
    }
    if (typeof req.body.desc !== "string") {
      throw BedRequest(400,"Description stringda emas")
    }

    readFileData.push({
      id: v4(),
      ...req.body,
    });
    writeFile("products.json", readFileData);
    res.status(200).json({
      message: "Mahsulot qoshildi",
    });
  } catch (error) {
    next(error);
  }
});

//////update

app.put("/update_product/:id", (req, res, next) => {
  try {
    const readFileData = readFile("products.json");
    const { title, desc, price, quantity } = req.body;
    const foundedData = readFileData.find((item) => item.id === req.params.id);
    if (!foundedData) {
      res.status(404).json({
        message: `Mahsulot topilmadi`,
      });
    }
    readFileData.forEach((item) => {
      if (item.id === req.params.id) {
        (item.title = title ? title : item.title),
          (item.desc = desc ? desc : item.desc),
          (item.price = price ? price : item.price),
          (item.quantity = quantity ? quantity : item.quantity);
      }
    });
    writeFile("products.json", readFileData);
    res.status(200).json({
      message: "Mahsulot Ozgartrildi",
    });
  } catch (error) {
    next(error);
  }
});

///////delete

app.delete("/delete_product/:id", (req, res, next) => {
  try {
    const readFileData = readFile("products.json");
    const foundedData = readFileData.find((item) => item.id === req.params.id);
    if (!foundedData) {
      res.status(404).json({
        message: `Mahsulot topilmadi`,
      });
    }
    readFileData.forEach((item, index) => {
      if (item.id === req.params.id) {
        readFileData.splice(index, 1);
      }
    });
    writeFile("products.json", readFileData);
    res.status(200).json({
      message: "Mahsulot ochirildi",
    });
  } catch (error) {
    next(error);
  }
});

//////buy

app.get("/buy_one_product/:id", (req, res, next) => {
  try {
    const readFileData = readFile("products.json");
    const purchasedData = readFile("purchased_products.json");

    const productId = req.params.id;

    const product = readFileData.find((item) => item.id === productId);

    if (!product) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }

    if (product.quantity === 0) {
      return res.status(400).json({
        message: "Mahsulot tugagan",
      });
    }

    let purchasedProduct = purchasedData.find((item) => item.id === productId);

    if (purchasedProduct) {
      purchasedProduct.quantity += 1;
    } else {
      purchasedProduct = { ...product, quantity: 1 };
      purchasedData.push(purchasedProduct);
    }

    product.quantity -= 1;

    const updatedPurchasedData = purchasedData.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }));

    writeFile("purchased_products.json", updatedPurchasedData);
    writeFile("products.json", readFileData);

    res.status(200).json({
      message: "Mahsulot sotib olindi",
    });
  } catch (error) {
    next(error);
  }
});
 
///  get_purchased_products
app.get("/get_purchased_products", (req, res, next) => {
  try {
    const purchasedData = readFile("purchased_products.json");
    res.status(200).json(purchasedData);
  } catch (error) {
    next(error);
  }
});




app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log(`Server ishladi :${PORT}`);
});
