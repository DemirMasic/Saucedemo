import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";
import { InventoryPage } from "./inventory-page";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class CartPage extends BasePage {
    private item_quantity = By.className('cart_quantity');
    private checkout_button = By.id('checkout')
    private item_backpack_add = By.id('add-to-cart-sauce-labs-backpack');
    private remove_backpack = By.id('remove-sauce-labs-backpack');
    

    constructor(driver: WebDriver) {
        super(driver);
    }
    //check to see if we are on the cart page
    async check_current_url_cart() {
        let current_url = await this.driver.getCurrentUrl();
        
        expect(current_url).toBe(testData.url.cart_page);
    }
    //check to see if the added item is in the cart
    async check_item_is_in_cart(){
        let quantity = await this.findElement(this.item_quantity);
        let n_quantity = await quantity.getText();
        expect(n_quantity).toMatch("1");
    }
    async click_checkout_button(){
        await this.findElementAndClick(this.checkout_button);
    }

    async remove_backpack_from_cart() {
        await this.removeItemFromCart(this.remove_backpack, this.item_backpack_add);
    }

}