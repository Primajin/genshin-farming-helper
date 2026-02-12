/**
 * Debug test for preset removal issue
 *
 * Issue: Clicking an active preset does not remove helpers or lower targets to 0
 */

import {test, expect} from '@playwright/test';

test.describe('Preset Removal Debug', () => {
	test('should remove helpers when deactivating preset', async ({page}) => {
		await page.goto('http://localhost:3000');
		await page.waitForLoadState('networkidle');

		// Step 1: Open preset modal
		console.log('Step 1: Opening preset modal...');
		const addButton = page.locator('button[aria-label="add preset"]');
		await addButton.click();
		await page.waitForTimeout(500);

		// Step 2: Click Albedo preset
		console.log('Step 2: Clicking Albedo preset...');
		const albedoPreset = page.locator('input[value="character.0"]');
		await albedoPreset.click();
		await page.waitForTimeout(1000); // Wait for helpers to be added

		// Take screenshot after adding preset
		await page.screenshot({path: '/tmp/preset-added.png'});
		console.log('Screenshot saved: preset-added.png');

		// Close modal
		const closeButton = page.locator('button[aria-label="close dialog"]');
		await closeButton.click();
		await page.waitForTimeout(500);

		// Check helper count
		const helpers = page.locator('[data-testid="farm-helper"]');
		const helperCount = await helpers.count();
		console.log(`Helper count after adding preset: ${helperCount}`);

		// Albedo should have 7 materials (based on preset data)
		expect(helperCount).toBeGreaterThan(0);

		// Step 3: Reopen preset modal
		console.log('\nStep 3: Reopening preset modal...');
		await addButton.click();
		await page.waitForTimeout(500);

		// Verify Albedo preset has active indicator (green border)
		const albedoPresetDiv = await albedoPreset.evaluate(element => {
			const div = element.nextElementSibling;
			const styles = globalThis.getComputedStyle(div);
			return {
				borderColor: styles.borderColor,
				boxShadow: styles.boxShadow,
			};
		});
		console.log('Albedo preset styles:', albedoPresetDiv);

		// Step 4: Click Albedo preset again to deactivate
		console.log('\nStep 4: Clicking Albedo preset again to deactivate...');
		await albedoPreset.click();
		await page.waitForTimeout(1000); // Wait for helpers to be removed

		// Take screenshot after removing preset
		await page.screenshot({path: '/tmp/preset-removed.png'});
		console.log('Screenshot saved: preset-removed.png');

		// Close modal
		await closeButton.click();
		await page.waitForTimeout(500);

		// Step 5: Check helper count
		console.log('\nStep 5: Checking helper count...');
		const helperCountAfterRemoval = await helpers.count();
		console.log(`Helper count after removing preset: ${helperCountAfterRemoval}`);

		// Take final screenshot
		await page.screenshot({path: '/tmp/after-preset-removal-final.png'});
		console.log('Screenshot saved: after-preset-removal-final.png');

		// Helpers should be removed (count should be 0)
		expect(helperCountAfterRemoval).toBe(0);
	});

	test('should show goals as 0 when preset is removed', async ({page}) => {
		await page.goto('http://localhost:3000');
		await page.waitForLoadState('networkidle');

		// Add Albedo preset
		console.log('Adding Albedo preset...');
		await page.locator('button[aria-label="add preset"]').click();
		await page.waitForTimeout(500);
		await page.locator('input[value="character.0"]').click();
		await page.waitForTimeout(1000);
		await page.locator('button[aria-label="close dialog"]').click();
		await page.waitForTimeout(500);

		// Get a helper and check its goal
		const firstHelper = page.locator('[data-testid="farm-helper"]').first();
		const goalBefore = await firstHelper.locator('input[aria-label*="goal"]').first().inputValue();
		console.log(`Goal before removal: ${goalBefore}`);

		// Remove preset
		console.log('\nRemoving Albedo preset...');
		await page.locator('button[aria-label="add preset"]').click();
		await page.waitForTimeout(500);
		await page.locator('input[value="character.0"]').click();
		await page.waitForTimeout(1000);

		// Take screenshot
		await page.screenshot({path: '/tmp/goals-after-removal.png'});
		console.log('Screenshot saved: goals-after-removal.png');

		await page.locator('button[aria-label="close dialog"]').click();
		await page.waitForTimeout(500);

		// Check if helpers exist
		const helperCount = await page.locator('[data-testid="farm-helper"]').count();
		console.log(`Helpers remaining: ${helperCount}`);

		if (helperCount > 0) {
			// If helpers still exist, check their goals
			const goalAfter = await firstHelper.locator('input[aria-label*="goal"]').first().inputValue();
			console.log(`Goal after removal: ${goalAfter}`);

			// Goal should be empty or 0
			expect(goalAfter).toBe('');
		} else {
			console.log('Helpers correctly removed');
		}
	});
});
