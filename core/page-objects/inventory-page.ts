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
    private items_list = By.className('inventory_item');
    private itemNames = By.css('.inventory_list .inventory_item .inventory_item_name');
    private itemDescriptions = By.css('.inventory_list .inventory_item .inventory_item_desc');

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
    

    public async checkItemsCount() {
        // Wait for the inventory items to be loaded
        await this.waitForElement(this.items_list, 10000);
        // Find all inventory items
        const items = await this.driver.findElements(this.items_list);
        // Check if there are exactly 6 items
        expect(items.length).toBe(6)
      }

      public async verifyItemNamesAndDescriptions() {
        // Wait for the inventory items to be loaded
        await this.waitForElement(this.items_list, 10000);
        
        // Map for expected names and descriptions
        const expectedItems = new Map<string, string>();
        testData.items.forEach(item => expectedItems.set(item.name, item.description));
    
        // Find all inventory items
        const items = await this.driver.findElements(this.items_list);
        
        for (const item of items) {
            const actualName = await item.findElement(this.itemNames).getText();
            const actualDescription = await item.findElement(this.itemDescriptions).getText();
            // Check if the actual name is in the map of expected items
            const expectedDescription = expectedItems.get(actualName);
            expect(expectedItems.has(actualName)).toBe(true); // Ensures the actual name is expected
            
            // Check if the description matches the expected description
            expect(actualDescription).toBe(expectedDescription); // Checks if the descriptions match
        }
    
        console.log('All item names and descriptions are correct.');
    }
}