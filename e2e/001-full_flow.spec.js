const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');

test('Login and randomly select items', async ({page}) => {
    const browser = await chromium.launch({ headless: false });
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

    // Get all "Add to Cart" buttons
    const addToCartButtons = await page.$$('button[id^="add-to-cart"]');
    console.log(`Total items available: ${addToCartButtons.length}`);

    // Define the number of items to select randomly
    const itemsToSelect = 5; // Adjust this value as needed
    const selectedIndices = new Set();

    // Randomly select unique items
    while (selectedIndices.size < itemsToSelect) {
        const randomIndex = Math.floor(Math.random() * addToCartButtons.length);
        selectedIndices.add(randomIndex);
    }

    console.log(`Randomly selected indices: ${[...selectedIndices].join(', ')}`);

    // Click on the randomly selected items
    for (const index of selectedIndices) {
        console.log(`Adding item at index: ${index}`);
        await addToCartButtons[index].click();
    }

    // Verify the cart count matches the number of items selected
    const cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe(String(itemsToSelect));

    console.log(`Successfully added ${itemsToSelect} random items to the cart!`);

    // Navigate to the cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.cart.html/);

    // Validate the cart title
    const cartTitle = await page.locator('.title').textContent();
    expect(cartTitle).toBe('Your Cart');
    console.log('Cart title validated successfully.');

    // Validate the number of items in the cart
    const cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(itemsToSelect);
    console.log(`Validated ${cartItems.length} items in the cart.`);

    // Remove some items
    const itemsToRemove = 2;
    const removeButtons = await page.$$('button[id^="remove"]');
    for (let i = 0; i < itemsToRemove; i++) {
        console.log(`Removing item at index: ${i}`);
        await removeButtons[i].click();
    }

    // Validate the remaining items in the cart
    const remainingItems = await page.$$('.cart_item');
    expect(remainingItems.length).toBe(itemsToSelect - itemsToRemove);
    console.log(`Validated ${remainingItems.length} items remaining in the cart.`);
    
    // checkout remaining item
    const checkoutItem = await page.click('//*[@id="checkout"]');
    console.log('Checkout clicked')

    // Fill form
    const firstName = 'alfin';
    const lastName = 'wicaksono';
    const postalCode = '12345';
    await page.fill('//*[@id="first-name"]', firstName);
    await page.fill('//*[@id="last-name"]', lastName);
    await page.fill('//*[@id="postal-code"]', postalCode);
    console.log('Success fill form.');

    // Validate form inputs
    const txtFirstName = await page.inputValue('//*[@id="first-name"]');
    const txtLastName = await page.inputValue('//*[@id="last-name"]');
    const txtPostalCode = await page.inputValue('//*[@id="postal-code"]');

    expect(txtFirstName).toBe(firstName);
    expect(txtLastName).toBe(lastName);
    expect(txtPostalCode).toBe(postalCode);

    // Finish checkout
    await page.click('//*[@id="continue"]');
    await expect(page).toHaveURL(/.checkout-step-two.html/);
    await page.click('//*[@id="finish"]');
    await expect(page).toHaveURL(/.checkout-complete.html/);
    const thankYouMessage = await page.locator('.complete-header').textContent();
    expect(thankYouMessage).toBe('Thank you for your order!');
    console.log('Order completed successfully.');

});