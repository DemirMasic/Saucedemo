import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { InventoryPage } from "../core/page-objects/inventory-page";
import { CartPage } from "../core/page-objects/cart-page";
import { CheckoutPage } from "../core/page-objects/checkout-page";

const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
    cartPage = new CartPage(driver);
    checkoutPage = new CheckoutPage(driver);
},10000);

test("User should be able to add an item to the cart", async () => {
    //smoke test
    //Pre-condtions
    await loginPage.enter_login_username();
    await loginPage.enter_password();
    await loginPage.press_login();
    await inventoryPage.add_backpack_to_cart();
    await inventoryPage.check_text_remove();
    //Step 1 Go to cart page:
    await inventoryPage.click_cart_button();
    await cartPage.check_current_url_cart();
    //Step 2 Remove item from cart
    await cartPage.remove_backpack_from_cart();


  },20000);

afterAll(async () => {
    await quitDriver(driver);
},10000);