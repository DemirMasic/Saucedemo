import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver } from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { InventoryPage } from "../core/page-objects/inventory-page";


const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

let driver: WebDriver;
let loginPage: LoginPage;
let inventoryPage: InventoryPage;

beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
},10000);

test("login to the page", async () => {
    //regression test 
    //User should be able to log out of the page
    //Pre-condtions
    await loginPage.enter_login_username();
    await loginPage.enter_password();
    await loginPage.press_login();
    //Steps 1:
    await inventoryPage.check_current_url_inventory();
    await inventoryPage.verifyItemNamesAndDescriptions();
    
  },20000);

afterAll(async () => {
    await quitDriver(driver);
},10000);