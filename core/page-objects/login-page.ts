import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class LoginPage extends BasePage {
    private username = By.id('user-name');
    private password = By.id('password');
    private login_button = By.id('login-button');

    constructor(driver: WebDriver) {
        super(driver);
    }

    async enter_login_username() {
        await this.fillInputField(this.username, testData.login_data.standard_username)
    }

    async enter_password() {
        await this.fillInputField(this.password, testData.login_data.login_password)
    }

    async press_login() {
        await this.findElementAndClick(this.login_button)
    }
}