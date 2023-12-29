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

test("complete order of an item", async () => {
    //Pre-condtions
    await loginPage.enter_login_username();
    await loginPage.enter_password();
    await loginPage.press_login();
    //Step 1:
    await inventoryPage.add_backpack_to_cart();
    await inventoryPage.check_text_remove();
    //Step 2:
    await inventoryPage.click_cart_button();
    await cartPage.check_current_url_cart();
    await cartPage.check_item_is_in_cart();
    //Step 3:
    await cartPage.click_checkout_button();
    await checkoutPage.check_current_url_checkout();
    //Step 4, 5, 6:
    await checkoutPage.enter_first_name();
    await checkoutPage.enter_last_name();
    await checkoutPage.enter_postal_code();
    await checkoutPage.check_input_fields();
    //Step 7:
    await checkoutPage.click_continue();
    await checkoutPage.is_overview();
    //Step 8:
    await checkoutPage.click_finish();
    await checkoutPage.is_complete();
  },20000);

afterAll(async () => {
    await quitDriver(driver);
},10000);