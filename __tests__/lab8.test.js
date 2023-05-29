describe('Basic user flow for Website', () => {
    // First, visit the lab 8 website
    beforeAll(async() => {
        await page.goto('http://127.0.0.1:5500/');
    });

    // Next, check to make sure that all 20 <product-item> elements have loaded
    it('Initial Home Page - Check for 20 product items', async() => {
        console.log('Checking for 20 product items...');
        // Query select all of the <product-item> elements and return the length of that array
        const numProducts = await page.$$eval('product-item', (prodItems) => {
            return prodItems.length;
        });
        // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
        expect(numProducts).toBe(20);
    });

    // Check to make sure that all 20 <product-item> elements have data in them
    it('Make sure <product-item> elements are populated', async() => {
        console.log('Checking to make sure <product-item> elements are populated...');
        // Start as true, if any don't have data, swap to false
        let allArePopulated = true;
        let data, plainValue;
        // Query select all of the <product-item> elements
        const prodItems = await page.$$('product-item');
        console.log(`Checking ${prodItems.length} product items`);
        // Grab the .data property of <product-items> to grab all of the json data stored inside
        for (let i = 0; i < prodItems.length; i++) {
            //console.log(`Checking product item ${i + 1}/${prodItems.length}`);
            data = await prodItems[i].getProperty('data');
            // Convert that property to JSON
            plainValue = await data.jsonValue();
            // Make sure the title, price, and image are populated in the JSON
            if (plainValue.title.length == 0) { allArePopulated = false; break; }
            if (plainValue.price.length == 0) { allArePopulated = false; break; }
            if (plainValue.image.length == 0) { allArePopulated = false; break; }
        }

        // Expect allArePopulated to still be true
        expect(allArePopulated).toBe(true);

        // TODO - Step 1
        // Right now this function is only checking the first <product-item> it found, make it so that
        // it checks every <product-item> it found

    }, 10000);

    // Check to make sure that when you click "Add to Cart" on the first <product-item> that
    // the button swaps to "Remove from Cart"
    it('Clicking the "Add to Cart" button should change button text', async() => {
        console.log('Checking the "Add to Cart" button...');
        // TODO - Step 2
        // Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
        // Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
        // Once you have the button, you can click it and check the innerText property of the button.
        // Once you have the innerText property, use innerText.jsonValue() to get the text value of it

        let productItemHandle = await page.$('product-item');

        // Evaluate and retrieve the shadowRoot element
        let shadowRootHandle = await page.evaluateHandle((element) => element.shadowRoot, productItemHandle);

        // Query the button within the shadowRoot
        let buttonHandle = await shadowRootHandle.$('button');

        // Click the button
        await buttonHandle.click();

        // Wait for a brief moment to allow the button text to update
        await page.waitForTimeout(500);

        // Get the updated button text using innerText.jsonValue()
        let buttonText = await page.evaluate((element) => element.innerText, buttonHandle);

        // Expect the button text to have changed
        expect(buttonText).toBe('Remove from Cart');
    }, 2500);

    // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
    // number in the top right has been correctly updated
    it('Checking number of items in cart on screen', async() => {
        console.log('Checking number of items in cart on screen...');
        // TODO - Step 3
        // Query select all of the <product-item> elements, then for every single product element
        // get the shadowRoot and query select the button inside, and click on it.
        // Check to see if the innerText of #cart-count is 20

        let productItems = await page.$$('product-item');

        // Click "Add to Cart" on every product item
        for (let productItem of productItems) {
            let shadowRootHandle = await productItem.evaluateHandle((element) => element.shadowRoot);
            let addToCartButton = await shadowRootHandle.$('button');
            let buttonText = await page.evaluate((element) => element.innerText, addToCartButton);
            if (buttonText == 'Remove from Cart') {
                continue;
            } else {
                await addToCartButton.click();
            }
        }

        // Wait for a brief moment to allow the cart number to update
        await new Promise(resolve => setTimeout(resolve, 500))

        // Get the updated cart count from #cart-count element
        let cartCount = await page.evaluate(() => {
            let cartCountElement = document.querySelector('#cart-count');
            return parseInt(cartCountElement.innerText);
        });

        // Expect the cart count to be the same as the number of product items
        expect(cartCount).toBe(productItems.length);

    }, 10000);

    // Check to make sure that after you reload the page it remembers all of the items in your cart
    it('Checking number of items in cart on screen after reload', async() => {
        console.log('Checking number of items in cart on screen after reload...');
        // TODO - Step 4
        // Reload the page, then select all of the <product-item> elements, and check every
        // element to make sure that all of their buttons say "Remove from Cart".
        // Also check to make sure that #cart-count is still 20

        // Reload the page
        await page.reload();

        // Select all of the <product-item> elements again after the page reload
        let productItems = await page.$$('product-item');

        // Check every element again to make sure their buttons still say "Remove from Cart"
        for (let productItem of productItems) {
            let shadowRootHandle = await productItem.evaluateHandle((element) => element.shadowRoot);
            let button = await shadowRootHandle.$('button');
            let buttonText = await page.evaluate((el) => el.innerText, button);
            expect(buttonText).toBe('Remove from Cart');
        }

        // Check if #cart-count is still 20
        let cartCount = await page.evaluate(() => {
            let cartCountElement = document.querySelector('#cart-count');
            return parseInt(cartCountElement.innerText);
        });

        expect(cartCount).toBe(20);
    }, 10000);

    // Check to make sure that the cart in localStorage is what you expect
    it('Checking the localStorage to make sure cart is correct', async() => {
        // TODO - Step 5
        // At this point he item 'cart' in localStorage should be 
        // '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is

        // Get the value of 'cart' from localStorage
        let cartValue = await page.evaluate(() => localStorage.getItem('cart'));

        // Parse the cart value into an array
        let cartItems = JSON.parse(cartValue);

        // Expected cart items
        let expectedCartItems = Array.from({ length: 20 }, (_, index) => index + 1);

        // Check if the cart items match the expected value
        expect(cartItems).toEqual(expectedCartItems);
    });

    // Checking to make sure that if you remove all of the items from the cart that the cart
    // number in the top right of the screen is 0
    it('Checking number of items in cart on screen after removing from cart', async() => {
        console.log('Checking number of items in cart on screen...');
        // TODO - Step 6
        // Go through and click "Remove from Cart" on every single <product-item>, just like above.
        // Once you have, check to make sure that #cart-count is now 0

        // Select all of the <product-item> elements
        let productItems = await page.$$('product-item');

        // Remove each item from the cart
        for (let productItem of productItems) {
            let shadowRootHandle = await productItem.evaluateHandle((element) => element.shadowRoot);
            let removeButton = await shadowRootHandle.$('button');
            await removeButton.click();
        }

        // Wait for the cart count to be updated to 0
        await page.waitForFunction(() => {
            let cartCountElement = document.querySelector('#cart-count');
            return parseInt(cartCountElement.innerText) === 0;
        });

        // Check if #cart-count is now 0
        let cartCount = await page.evaluate(() => {
            let cartCountElement = document.querySelector('#cart-count');
            return parseInt(cartCountElement.innerText);
        });

        expect(cartCount).toBe(0);
    }, 10000);

    // Checking to make sure that it remembers us removing everything from the cart
    // after we refresh the page
    it('Checking number of items in cart on screen after reload', async() => {
        console.log('Checking number of items in cart on screen after reload...');
        // TODO - Step 7
        // Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
        // is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
        // Also check to make sure that #cart-count is still 0

        // Reload the page
        await page.reload();

        // Select all of the <product-item> elements
        let productItems = await page.$$('product-item');

        // Check if each item has "Add to Cart" button text
        for (let productItem of productItems) {
            let shadowRootHandle = await productItem.evaluateHandle((element) => element.shadowRoot);
            let addButton = await shadowRootHandle.$('button');
            let buttonText = await page.evaluate((button) => button.innerText, addButton);
            expect(buttonText).toBe('Add to Cart');
        }

        // Check if #cart-count is still 0
        let cartCount = await page.evaluate(() => {
            let cartCountElement = document.querySelector('#cart-count');
            return parseInt(cartCountElement.innerText);
        });

        expect(cartCount).toBe(0);
    }, 10000);

    // Checking to make sure that localStorage for the cart is as we'd expect for the
    // cart being empty
    it('Checking the localStorage to make sure cart is correct', async() => {
        console.log('Checking the localStorage...');
        // TODO - Step 8
        // At this point he item 'cart' in localStorage should be '[]', check to make sure it is

        // Retrieve the 'cart' item from localStorage
        let cartItems = await page.evaluate(() => {
            let cart = localStorage.getItem('cart');
            return JSON.parse(cart);
        });

        // Check if the 'cart' item is an empty array
        expect(cartItems).toEqual([]);
    });
});