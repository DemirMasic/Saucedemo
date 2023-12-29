import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class CheckoutPage extends BasePage {
    private your_cart = By.xpath('//span[@class="title"]')
    private first_name = By.id('first-name');
    private last_name = By.id('last-name');
    private postal_code = By.id('postal-code');
    private continue_button = By.id('continue');
    private overview_checkout = By.className('title');
    private finish_button = By.id('finish');

    constructor(driver: WebDriver) {
        super(driver);
    }
    //check to see if we are on the cart page
    async check_current_url_checkout() {
        await this.driver.wait(until.urlIs(testData.url.checkout_page), 500)
        let current_url = await this.driver.getCurrentUrl();
        expect(current_url).toBe(testData.url.checkout_page);
    }
    async enter_first_name() {
        await this.waitForElement(this.first_name, 10000)
        await this.fillInputField(this.first_name, testData.credentials.first_name)
        
    }
    async enter_last_name() {
        await this.fillInputField(this.last_name, testData.credentials.last_name)
        
    }
    async enter_postal_code() {
        await this.fillInputField(this.postal_code, testData.credentials.postal_code)
        
    }
    async check_input_fields(){
        let fn = await this.findElement(this.first_name);
        let fnn = await fn.getAttribute('value');
        expect(fnn).toMatch(testData.credentials.first_name);
        let ln = await this.findElement(this.last_name)
        let lnn = await ln.getAttribute('value');
        expect(lnn).toMatch(testData.credentials.last_name);
        let pc = await this.findElement(this.postal_code)
        let pcc = await pc.getAttribute('value');
        expect(pcc).toMatch(testData.credentials.postal_code);
    }
    async click_continue(){
        await this.findElementAndClick(this.continue_button);
    }
    async is_overview(){
        let text = await this.findElement(this.overview_checkout);
        let r_text = await text.getText();
        expect(r_text).toMatch(testData.verification_message.checkout_overview);
    }
    async click_finish(){
        await this.findElementAndClick(this.finish_button);
    }
    async is_complete(){
        let text = await this.findElement(this.overview_checkout);
        let r_text = await text.getText();
        expect(r_text).toMatch(testData.verification_message.checkout_complete);
    }
}