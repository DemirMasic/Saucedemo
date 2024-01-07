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
    private all_items_button = By.id('inventory_sidebar_link');
    private about_button = By.id('about_sidebar_link');
    private reset_app_state_button = By.id('reset_sidebar_link');
    private items_list = By.className('inventory_item');
    private itemNames = By.css('.inventory_list .inventory_item .inventory_item_name');
    private itemDescriptions = By.css('.inventory_list .inventory_item .inventory_item_desc');
    private footer = By.className('footer');
    private footer_text = By.className('footer_copy');
    private twitter_link = By.css('.social_twitter a');
    private facebook_link = By.css('.social_facebook a');
    private linkedin_link = By.css('.social_linkedin a');
    private cart_badge = By.className('shopping_cart_badge');

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

    public async verifyMenuOptions() {
        // Wait for the menu button to be loaded
        await this.waitForElement(this.menu_button, 10000);
        // Click on menu buttont
        await this.findElementAndClick(this.menu_button);

        //Wait for all items button to be visible
        const all_items_button_timer = await this.waitForElement(this.all_items_button, 10000);
        await this.waitForElementVisible(all_items_button_timer, 10000);
        
        //Wait for about button to be visible
        const about_button_timer = await this.waitForElement(this.about_button, 10000);
        await this.waitForElementVisible(about_button_timer, 10000);

        //Wait for logout button to be visible
        const logout_button_timer = await this.waitForElement(this.logout_button, 10000);
        await this.waitForElementVisible(logout_button_timer, 10000);

        const reset_app_state_button_timer = await this.waitForElement(this.reset_app_state_button, 10000);
        await this.waitForElementVisible(reset_app_state_button_timer, 10000);

        // Check the text of each menu option
        expect(await this.driver.findElement(this.all_items_button).getText()).toBe('All Items');
        expect(await this.driver.findElement(this.about_button).getText()).toBe('About');
        expect(await this.driver.findElement(this.logout_button).getText()).toBe('Logout');
        expect(await this.driver.findElement(this.reset_app_state_button).getText()).toBe('Reset App State');

        console.log('All menu options are present and have correct text.');

      }

    public async verifyFooter() {
        // Scroll to the bottom of the page
        await this.scrollToBottomPage();

        // Verify if footer is displayed
        await this.verifyDisplayedElement(this.footer);

        console.log('Footer is displayed correctly.');
    }

    public async verifyFootersText() {
        // Verify if footer text is displayed
        await this.verifyDisplayedElement(this.footer_text);

        const copyFooterText = await this.findElement(this.footer_text);
        const actualFooterText =  await copyFooterText.getText();
        expect(actualFooterText).toBe(testData.footer.text);

        console.log('Correct text is displayed on footer.');
    }

    public async verifyFB() {
        await this.verifySocialMediaLinks(this.facebook_link, testData.footer.social_facebook);
        console.log('Facebook link is displayed correctly.');
    }

    public async verifyTweeter() {
        await this.verifySocialMediaLinks(this.twitter_link, testData.footer.social_twitter);
        console.log('Tweeter link is displayed correctly.');
    }

    public async verifyLinkedin() {
        await this.verifySocialMediaLinks(this.linkedin_link, testData.footer.social_linkedin);
        console.log('Linkedin link is displayed correctly.');
    }

    public async verifyCartBadge() {
        const badgeElement = await this.waitForElement(this.cart_badge, 1000);
        await this.waitForElementVisible(badgeElement, 10000);

        const badgeText = await badgeElement.getText();

        // Verify that the badge text is '1'
        expect(badgeText).toBe('1');
        console.log('Cart badge is present with number 1.');
      }
}