const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');

test('Login to Sauce Demo as Standard user then Select 2 items', async ({page}) => {
    const browser = await chromium.launch({ headless: true });
    await browser.newPage();
    
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

    // Select 3 items by clicking on their "Add to cart" buttons
    await page.waitForSelector('//*[@id="add-to-cart-sauce-labs-backpack"]');
    await page.click('//*[@id="add-to-cart-sauce-labs-backpack"]');

    await page.waitForSelector('//*[@id="add-to-cart-sauce-labs-bike-light"]');
    await page.click('//*[@id="add-to-cart-sauce-labs-bike-light"]');

    // Verify the cart count is updated
    const cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('2');
    
        if (cartCount === '2') {
            console.log('Successfully added 3 items to the cart!');
        } else {
            console.log('Failed to add the correct number of items to the cart.');
        }
    });