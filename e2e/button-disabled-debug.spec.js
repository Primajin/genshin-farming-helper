/**
 * Debug test for button disabled state issue
 *
 * Issue: After removing a farm helper, the button no longer shows as disabled
 * but clicking it doesn't work. Only after clicking a different button does
 * the first button become clickable again.
 */

import {test, expect} from '@playwright/test';

test.describe('Button Disabled State Debug', () => {
	test('should enable button immediately after removing helper', async ({page}) => {
		await page.goto('http://localhost:3000');

		// Wait for the page to load
		await page.waitForLoadState('networkidle');

		// Step 1: Click "Philosophies of Freedom" (first button in character talent)
		console.log('Step 1: Clicking Philosophies of Freedom...');
		const philosophiesButton = page.locator('input[value="TALENT.58"]');

		// Verify button is enabled
		await expect(philosophiesButton).not.toBeDisabled();
		console.log('Button is enabled before clicking');

		// Click it
		await philosophiesButton.click();
		await page.waitForTimeout(500); // Wait for state update

		// Take screenshot after adding
		await page.screenshot({path: '/tmp/after-add-philosophies.png'});
		console.log('Screenshot saved: after-add-philosophies.png');

		// Verify button is now disabled
		await expect(philosophiesButton).toBeDisabled();
		console.log('Button is disabled after clicking');

		// Verify helper was added
		const helpers = page.locator('[data-testid="farm-helper"]');
		await expect(helpers).toHaveCount(1);
		console.log('Helper count: 1');

		// Step 2: Remove the helper via remove button
		console.log('\nStep 2: Removing helper...');
		const removeButton = page.locator('button[aria-label*="remove"]').first();
		await removeButton.click();
		await page.waitForTimeout(500); // Wait for state update

		// Take screenshot after removing
		await page.screenshot({path: '/tmp/after-remove-philosophies.png'});
		console.log('Screenshot saved: after-remove-philosophies.png');

		// Verify helper was removed
		await expect(helpers).toHaveCount(0);
		console.log('Helper count: 0');

		// Step 3: Verify button is enabled again
		console.log('\nStep 3: Checking button state...');

		// Check if button LOOKS disabled (CSS)
		const isVisuallyDisabled = await philosophiesButton.evaluate(element => {
			const styles = globalThis.getComputedStyle(element.nextElementSibling);
			return styles.opacity === '0.5';
		});
		console.log(`Button visually disabled (opacity 0.5): ${isVisuallyDisabled}`);

		// Check if button IS disabled (attribute)
		const isDisabledAttr = await philosophiesButton.isDisabled();
		console.log(`Button disabled attribute: ${isDisabledAttr}`);

		// Check if button is enabled (should be true)
		const isEnabled = await philosophiesButton.isEnabled();
		console.log(`Button enabled: ${isEnabled}`);

		// Try to click the button again
		console.log('\nStep 4: Trying to click button again...');
		await philosophiesButton.click();
		await page.waitForTimeout(500);

		// Take screenshot after second click
		await page.screenshot({path: '/tmp/after-second-click.png'});
		console.log('Screenshot saved: after-second-click.png');

		// Verify helper was added again
		const helpersAfterSecondClick = await helpers.count();
		console.log(`Helper count after second click: ${helpersAfterSecondClick}`);

		// This should be 1 if the button worked
		expect(helpersAfterSecondClick).toBe(1);
	});

	test('should verify clicking different button then first button', async ({page}) => {
		await page.goto('http://localhost:3000');
		await page.waitForLoadState('networkidle');

		// Step 1: Add Philosophies of Freedom
		console.log('Step 1: Adding Philosophies of Freedom...');
		const philosophiesButton = page.locator('input[value="TALENT.58"]');
		await philosophiesButton.click();
		await page.waitForTimeout(500);

		// Step 2: Remove it
		console.log('Step 2: Removing Philosophies of Freedom...');
		const removeButton = page.locator('button[aria-label*="remove"]').first();
		await removeButton.click();
		await page.waitForTimeout(500);

		// Step 3: Add a different item (Teachings of Ballad - second button)
		console.log('Step 3: Adding Teachings of Ballad...');
		const balladButton = page.locator('input[value="TALENT.61"]');
		await balladButton.click();
		await page.waitForTimeout(500);

		await page.screenshot({path: '/tmp/after-add-ballad.png'});

		// Step 4: Now try clicking Philosophies of Freedom again
		console.log('Step 4: Trying to click Philosophies of Freedom again...');
		await philosophiesButton.click();
		await page.waitForTimeout(500);

		await page.screenshot({path: '/tmp/after-click-philosophies-again.png'});

		// Check helper count - should be 2
		const helpers = page.locator('[data-testid="farm-helper"]');
		const helperCount = await helpers.count();
		console.log(`Helper count: ${helperCount}`);

		expect(helperCount).toBe(2);
	});
});
