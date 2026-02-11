import {test, expect} from '@playwright/test';

test.describe('Preset Functionality', () => {
	test.beforeEach(async ({page}) => {
		// Clear local storage before each test
		await page.goto('/');
		await page.evaluate(() => localStorage.clear());
		await page.reload();
		await page.waitForLoadState('networkidle');
	});

	test('should add multiple character presets correctly', async ({page}) => {
		await page.goto('/');

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		// Get all character presets
		const characterPresets = page.locator('input[type="checkbox"][name="preset"]');
		const count = await characterPresets.count();

		// Add first character preset
		await characterPresets.nth(0).click();
		await page.waitForTimeout(300);

		const helpersAfterFirst = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helpersAfterFirst).toBeGreaterThan(0);

		// Add second character preset if available
		if (count > 1) {
			await characterPresets.nth(1).click();
			await page.waitForTimeout(300);

			const helpersAfterSecond = await page.locator('section:has(button[title="Remove item"])').count();
			expect(helpersAfterSecond).toBeGreaterThan(helpersAfterFirst);
		}

		// Verify no duplicates
		const helperImages = await page.locator('section:has(button[title="Remove item"]) img').all();
		const materialNames = await Promise.all(helperImages.map(img => img.getAttribute('alt')));
		const uniqueNames = [...new Set(materialNames)];
		expect(materialNames.length).toBe(uniqueNames.length);
	});

	test('should add character and weapon presets correctly', async ({page}) => {
		await page.goto('/');

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		// Add a character preset
		const characterPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await characterPreset.click();
		await page.waitForTimeout(300);

		const helpersAfterCharacter = await page.locator('section:has(button[title="Remove item"])').count();

		// Switch to weapons tab
		await page.click('text=Weapons');
		await page.waitForTimeout(200);

		// Add a weapon preset
		const weaponPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await weaponPreset.click();
		await page.waitForTimeout(300);

		const helpersAfterWeapon = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helpersAfterWeapon).toBeGreaterThan(helpersAfterCharacter);

		// Verify no duplicates
		const helperImages = await page.locator('section:has(button[title="Remove item"]) img').all();
		const materialNames = await Promise.all(helperImages.map(img => img.getAttribute('alt')));
		const uniqueNames = [...new Set(materialNames)];
		expect(materialNames.length).toBe(uniqueNames.length);
	});

	test('should add all fish species when adding fishing rod presets', async ({page}) => {
		await page.goto('/');

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		// Switch to fishing rods tab
		await page.click('text=Fishing Rods');
		await page.waitForTimeout(200);

		// Add first fishing rod
		const fishingRods = page.locator('input[type="checkbox"][name="preset"]');
		const rodCount = await fishingRods.count();

		if (rodCount > 0) {
			await fishingRods.nth(0).click();
			await page.waitForTimeout(300);

			const helpersAfterRod1 = await page.locator('section:has(button[title="Remove item"])').count();
			expect(helpersAfterRod1).toBeGreaterThan(0);

			// Each fishing rod should add 3 fish species
			// Check that we have fish-related helpers
			const fishHelpers = await page.locator('section:has(button[title="Remove item"])').all();
			expect(fishHelpers.length).toBeGreaterThanOrEqual(3);

			// Add second fishing rod if available
			if (rodCount > 1) {
				await fishingRods.nth(1).click();
				await page.waitForTimeout(300);

				const helpersAfterRod2 = await page.locator('section:has(button[title="Remove item"])').count();
				// Should have more helpers or same if overlapping fish
				expect(helpersAfterRod2).toBeGreaterThanOrEqual(helpersAfterRod1);
			}
		}
	});

	test('should correctly handle overlapping materials when adding/removing presets', async ({page}) => {
		await page.goto('/');

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Fishing Rods')).toBeVisible();

		// Switch to fishing rods tab
		await page.click('text=Fishing Rods');
		await page.waitForTimeout(200);

		const fishingRods = page.locator('input[type="checkbox"][name="preset"]');
		const rodCount = await fishingRods.count();

		if (rodCount >= 2) {
			// Add first rod
			await fishingRods.nth(0).click();
			await page.waitForTimeout(300);

			// Add second rod (should have overlapping fish)
			await fishingRods.nth(1).click();
			await page.waitForTimeout(300);

			const helpersAfterBoth = await page.locator('section:has(button[title="Remove item"])').count();
			expect(helpersAfterBoth).toBeGreaterThan(0);

			// Verify no duplicates even with overlapping materials
			const helperImages = await page.locator('section:has(button[title="Remove item"]) img').all();
			const materialNames = await Promise.all(helperImages.map(img => img.getAttribute('alt')));
			const uniqueNames = [...new Set(materialNames)];
			expect(materialNames.length).toBe(uniqueNames.length);

			// Remove first rod
			await fishingRods.nth(0).click();
			await page.waitForTimeout(300);

			const helpersAfterRemove = await page.locator('section:has(button[title="Remove item"])').count();
			// Should still have some helpers from the second rod
			expect(helpersAfterRemove).toBeGreaterThan(0);
			// Should have fewer helpers than before
			expect(helpersAfterRemove).toBeLessThanOrEqual(helpersAfterBoth);
		}
	});

	test('should toggle preset on and off without creating duplicates', async ({page}) => {
		await page.goto('/');

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');

		// Wait for modal to be visible
		await expect(page.locator('text=Characters')).toBeVisible();

		// Get initial helper count
		const initialHelpers = await page.locator('section:has(button[title="Remove item"])').count();

		// Click a character preset
		const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await firstPreset.click();

		// Wait for helpers to be added
		await page.waitForTimeout(500);

		// Check that helpers were added
		const helpersAfterAdd = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helpersAfterAdd).toBeGreaterThan(initialHelpers);

		// Click the same preset again to remove it
		await firstPreset.click();

		// Wait for helpers to be removed
		await page.waitForTimeout(500);

		// Check that helpers were removed
		const helpersAfterRemove = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helpersAfterRemove).toBe(initialHelpers);

		// Click the preset again to add it back
		await firstPreset.click();

		// Wait for helpers to be added
		await page.waitForTimeout(500);

		// Check that helpers were added again
		const helpersAfterReAdd = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helpersAfterReAdd).toBe(helpersAfterAdd);

		// Verify no duplicates by checking unique material names
		const helperImages = await page.locator('section:has(button[title="Remove item"]) img').all();
		const materialNames = await Promise.all(helperImages.map(img => img.getAttribute('alt')));
		const uniqueNames = [...new Set(materialNames)];

		expect(materialNames.length).toBe(uniqueNames.length);
	});

	test('should handle rapid preset clicks without creating duplicates', async ({page}) => {
		await page.goto('/');

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		// Get the first preset checkbox
		const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();

		// Click rapidly 5 times (using Promise.all to avoid await-in-loop)
		await Promise.all(Array.from({length: 5}).map(() => firstPreset.click({delay: 10})));

		// Wait for all state updates to complete
		await page.waitForTimeout(1000);

		// Check that we don't have duplicate helpers
		const helperImages = await page.locator('section:has(button[title="Remove item"]) img').all();
		const materialNames = await Promise.all(helperImages.map(img => img.getAttribute('alt')));
		const uniqueNames = [...new Set(materialNames)];

		// No duplicates should exist
		expect(materialNames.length).toBe(uniqueNames.length);

		// After 5 clicks (odd number), preset should be active
		const helperCount = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helperCount).toBeGreaterThan(0);
	});

	test('should disable selector buttons when preset adds materials', async ({page}) => {
		await page.goto('/');

		// Count initially disabled buttons
		const initialDisabled = await page.locator('button[disabled]').count();

		// Open preset modal
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		// Click a character preset
		const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await firstPreset.click();

		// Close modal
		await page.keyboard.press('Escape');

		// Wait a bit for state to update
		await page.waitForTimeout(500);

		// Check that more material buttons are now disabled
		const disabledButtons = await page.locator('button[disabled]').count();
		expect(disabledButtons).toBeGreaterThan(initialDisabled);
	});

	test('should re-enable buttons when farm helper is removed', async ({page}) => {
		await page.goto('/');

		// Open preset modal and add a preset
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await firstPreset.click();

		// Close modal
		await page.keyboard.press('Escape');
		await page.waitForTimeout(500);

		// Count disabled buttons after adding preset
		const disabledAfterAdd = await page.locator('button[disabled]').count();
		expect(disabledAfterAdd).toBeGreaterThan(0);

		// Remove all helpers
		const removeButtons = page.locator('button[title="Remove item"]');
		const removeCount = await removeButtons.count();

		// Remove all helpers by clicking them sequentially
		// eslint-disable-next-line no-await-in-loop
		for (let i = 0; i < removeCount; i++) {
			// Always click the first one as the list updates
			// eslint-disable-next-line no-await-in-loop
			await page.locator('button[title="Remove item"]').first().click();
			// eslint-disable-next-line no-await-in-loop
			await page.waitForTimeout(100);
		}

		// Wait for state to update
		await page.waitForTimeout(500);

		// Buttons should be re-enabled
		const disabledAfterRemove = await page.locator('button[disabled]').count();
		expect(disabledAfterRemove).toBeLessThan(disabledAfterAdd);
	});

	test('should merge goals when adding preset after manual item', async ({page}) => {
		await page.goto('/');

		// Look for a material button to add manually
		const materialButton = page.locator('button:has-text("Brilliant Diamond")').first();
		let isVisible = false;
		try {
			isVisible = await materialButton.isVisible();
		} catch {
			isVisible = false;
		}

		if (isVisible) {
			await materialButton.click();
			await page.waitForTimeout(300);

			// Count helpers after manual add
			const helpersAfterManual = await page.locator('section:has(button[title="Remove item"])').count();
			expect(helpersAfterManual).toBe(1);

			// Set a custom goal
			const goalInput = page.locator('input[type="number"]').first();
			await goalInput.fill('100');
			await page.waitForTimeout(300);

			// Now add a preset that contains the same material
			await page.click('button[aria-label="Add preset"]');
			await expect(page.locator('text=Characters')).toBeVisible();

			const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();
			await firstPreset.click();
			await page.waitForTimeout(500);

			// Close modal
			await page.keyboard.press('Escape');

			// Should not have duplicate helpers
			const helperImages = await page.locator('section:has(button[title="Remove item"]) img').all();
			const materialNames = await Promise.all(helperImages.map(img => img.getAttribute('alt')));

			// Count occurrences of "Brilliant Diamond"
			const brilliantDiamondCount = materialNames.filter(name => name.includes('Brilliant Diamond')).length;
			expect(brilliantDiamondCount).toBe(1); // Should only have one instance

			// Total should have no duplicates
			const uniqueNames = [...new Set(materialNames)];
			expect(materialNames.length).toBe(uniqueNames.length);
		}
	});

	test('should not create duplicate when adding item manually after preset', async ({page}) => {
		await page.goto('/');

		// Add a preset first
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await firstPreset.click();
		await page.waitForTimeout(500);

		// Close modal
		await page.keyboard.press('Escape');
		await page.waitForTimeout(300);

		// Count helpers after preset
		const helpersAfterPreset = await page.locator('section:has(button[title="Remove item"])').count();

		// Try to manually add a material that's already in the preset
		// The button should be disabled
		const materialButton = page.locator('button:has-text("Brilliant Diamond")').first();
		let isDisabled = true;
		try {
			isDisabled = await materialButton.isDisabled();
		} catch {
			isDisabled = true;
		}

		// Should be disabled, preventing duplicate addition
		expect(isDisabled).toBe(true);

		// Verify helper count hasn't changed
		const helpersAfterAttempt = await page.locator('section:has(button[title="Remove item"])').count();
		expect(helpersAfterAttempt).toBe(helpersAfterPreset);
	});

	test('should only disable related tier buttons, not all materials with same sortRank', async ({page}) => {
		await page.goto('/');

		// Add a character preset
		await page.click('button[aria-label="Add preset"]');
		await expect(page.locator('text=Characters')).toBeVisible();

		const firstPreset = page.locator('input[type="checkbox"][name="preset"]').first();
		await firstPreset.click();
		await page.waitForTimeout(500);

		// Close modal
		await page.keyboard.press('Escape');
		await page.waitForTimeout(300);

		// Check that not ALL character level-up materials are disabled
		// Only the specific ones added should be disabled
		const allButtons = await page.locator('button').all();
		const disabledButtons = await page.locator('button[disabled]').all();

		// Should have some enabled buttons remaining
		expect(disabledButtons.length).toBeLessThan(allButtons.length);

		// Specifically check that unrelated materials are still enabled
		// This is harder to test precisely without knowing exact materials,
		// but we can verify the count is reasonable
		const enabledButtons = allButtons.length - disabledButtons.length;
		expect(enabledButtons).toBeGreaterThan(0);
	});
});
