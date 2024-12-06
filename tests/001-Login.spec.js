const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');

test('Login to Sauce Demo', async () => {

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
    // Navigate to the login page
    await page.goto('https://www.saucedemo.com/');

    // Perform login
    await page.fill('//*[@id="user-name"]', 'standard_user');
    await page.fill('//*[@id="password"]', 'secret_sauce');
    await page.click('//*[@id="login-button"]');

    // Verify login success
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Verify that login was successful by checking the URL or page content
    const url = page.url();
    if (url.includes('/inventory.html')) {
        console.log('Login successful!');
    } else {
        console.log('Login failed!');
    }
});
