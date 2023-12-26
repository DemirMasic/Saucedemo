import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class InventoryPage extends BasePage {
    private item_backpack_add = By.id('add-to-cart-sauce-labs-backpack');
    private remove_backpack = By.id('remove-sauce-labs-backpack');
    private cart_button = By.id('shopping_cart_container');

    constructor(driver: WebDriver) {
        super(driver);
    }
    
    async add_backpack_to_cart() {
        this.findElementAndClick(this.item_backpack_add)
    }
    //after adding item to the cart, check if remove button is now available
    async check_text_remove() {
        let text = await this.findElement(this.remove_backpack)
        let r_text = await text.getText();
        expect(r_text).toMatch("Remove");
    }
    
    async click_cart_button() {
        await this.findElementAndClick(this.cart_button);
        await this.driver.sleep(1000); 
    }

}