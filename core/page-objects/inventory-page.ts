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
    private menu_button = By.id('react-burger-menu-btn');
    private logout_button = By.id('logout_sidebar_link');
    private items_list = By.css('[class*="inventory_item"]')

    constructor(driver: WebDriver) {
        super(driver);
    }
    
    async add_backpack_to_cart() {
        await this.waitAndClick(this.item_backpack_add,10000);
        
    }
    //after adding item to the cart, check if remove button is now available
    async check_text_remove() {
        await this.waitForElement(this.remove_backpack, 10000);
        let text = await this.findElement(this.remove_backpack);
        let r_text = await text.getText();
        expect(r_text).toMatch("Remove");
    }
    
    async click_cart_button() {
        await this.findElementAndClick(this.cart_button);
        await this.driver.sleep(1000); 
    }
    async check_current_url_inventory(){
        let current_url = await this.driver.getCurrentUrl();
        expect(current_url).toBe(testData.url.inventory_page);
    }
    async click_menu_button(){
        await this.findElementAndClick(this.menu_button);
    }
    async click_logout(){
        await this.waitForElement(this.logout_button, 5000);
        await this.findElementAndClick(this.logout_button);
    }
    async check_items_inventory(){
        //??
    }
}