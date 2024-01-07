import { By, WebDriver, WebElement, until } from "selenium-webdriver";
export default class BasePage {
    protected driver: WebDriver;


    constructor(driver: WebDriver) {
        this.driver = driver;
    }
    async getTitle(){
        return await this.driver.getTitle();
    }
    async checkMatchingElements(selector: By, matchingItem: string){
        const element = await this.findElement(selector);
        const elementText = await element.getText();
        expect(elementText).toMatch(matchingItem);
    }
    async findElement(selector: By) {
        return await this.driver.findElement(selector);
    }
    async checkTitle(page: { getTitle: () => Promise<string>}, page_title: string){
        let title = await page.getTitle();
        expect(title).toMatch(page_title);
    }  
    async findElementAndClick(selector: By){
        await this.driver.wait(
                       until.elementLocated(selector),10000)
                       .click();
    }
    async waitAndClick(elementLocator, timeout) {
        await this.driver.wait(
            until.elementLocated(elementLocator), timeout).click();
    }
   
    async waitForElement(elementLocator, timeout) {
        return this.driver.wait(until.elementLocated(elementLocator), timeout);
    }
    async waitForElementVisible(elementLocator, timeout) {
        return this.driver.wait(until.elementIsVisible(elementLocator), timeout);
    }
    async hoverElement(element: WebElement) {
        const actions = this.driver.actions({ bridge: true });
        await actions
                    .move({ duration: 2000, origin: element, x: 0, y: 0 })
                    .perform();
    }
    async fillInputField(inputField: By, text: string) {
        await (await this.findElement(inputField)).sendKeys(text);
    }
    async scrollToBottomPage() {
        await this.driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    }
    async verifyDisplayedElement(selector: By) {
        const element = await this.driver.findElement(selector);
        const isDisplayed = await element.isDisplayed();
        expect(isDisplayed).toBe(true);
    }

    async verifySocialMediaLinks(linkSelector: By, expectedUrl: string) {
        // Click the social media link
        const link = await this.driver.findElement(linkSelector);
        await link.click();

        // Wait for the new tab to open
        await this.driver.wait(async () => (await this.driver.getAllWindowHandles()).length === 2, 10000);

        // Switch to the new tab
        const windows = await this.driver.getAllWindowHandles();
        await this.driver.switchTo().window(windows[1]);

        // Get the current URL and verify it
        const currentUrl = await this.driver.getCurrentUrl();
        expect(currentUrl).toContain(expectedUrl);

        // Close the new tab and switch back to the original window
        await this.driver.close();
        await this.driver.switchTo().window(windows[0]);
    }
    
}
