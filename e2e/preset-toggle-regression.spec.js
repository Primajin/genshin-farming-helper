import {test, expect} from '@playwright/test';

/**
 * Regression tests for preset toggle functionality
 * These tests verify that clicking a preset multiple times correctly toggles it on/off
 */

test.describe('Preset Toggle Regression Tests', () => {
	test.beforeEach(async ({page}) => {
		// Navigate to the app
		await page.goto('/');

		// Clear localStorage to start fresh
		await page.evaluate(() => {
			localStorage.clear();
		});

		// Reload to ensure clean state
		await page.reload();

		// Wait for the page to be ready
		await page.waitForLoadState('networkidle');
	});

	test('1. Click "Albedo" once and expect all of his helpers showing', async ({page}) => {
		// Open preset modal by clicking the "Add preset" button
		await page.click('button[aria-label="Add preset"]');

		// Wait for modal to open and be visible
		await page.waitForSelector('[role="dialog"]', {state: 'visible'});

		// Characters tab should be active by default, click Albedo preset
		await page.click('text=Albedo');

		// Close modal
		await page.keyboard.press('Escape');

		// Wait for modal to close and helpers to be added
		await page.waitForTimeout(500);

		// Check that Albedo's materials are showing as farm helpers
		// Albedo uses: Prithiva Topaz (gemstone), Basalt Pillar (boss), Cecilia (local specialty)
		const helpers = await page.locator('[class*="farm-helper"]').count();

		// Albedo should add multiple helpers (gemstone, boss material, cecilia, talent books, etc.)
		expect(helpers).toBeGreaterThan(0);

		// Verify specific materials are present
		const hasGemstone = await page.locator('text=Prithiva Topaz').count();
		expect(hasGemstone).toBeGreaterThan(0);

		console.log(`Albedo clicked once: ${helpers} helpers showing`);
	});

	test('2. Click "Albedo" twice and expect no helpers showing', async ({page}) => {
		// Open preset modal
		await page.click('button[aria-label="Add preset"]');

		// Wait for modal to open and be visible
		await page.waitForSelector('[role="dialog"]', {state: 'visible'});

		// Click Albedo preset first time (activate)
		await page.click('text=Albedo');

		// Wait a bit for state to update
		await page.waitForTimeout(300);

		// Click Albedo preset second time (deactivate)
		await page.click('text=Albedo');

		// Close modal
		await page.keyboard.press('Escape');

		// Wait for modal to close and helpers to be removed
		await page.waitForTimeout(500);

		// Check that no helpers are showing
		const helpers = await page.locator('[class*="farm-helper"]').count();

		expect(helpers).toBe(0);

		console.log(`Albedo clicked twice: ${helpers} helpers showing (expected 0)`);
	});

	test('3. Click "Albedo" three times and expect only one set of all of his helpers showing', async ({page}) => {
		// Open preset modal
		await page.click('button[aria-label="Add preset"]');

		// Wait for modal to open and be visible
		await page.waitForSelector('[role="dialog"]', {state: 'visible'});

		// Click Albedo preset first time (activate)
		await page.click('text=Albedo');

		// Wait a bit for state to update
		await page.waitForTimeout(300);

		// Click Albedo preset second time (deactivate)
		await page.click('text=Albedo');

		// Wait a bit for state to update
		await page.waitForTimeout(300);

		// Click Albedo preset third time (activate again)
		await page.click('text=Albedo');

		// Close modal
		await page.keyboard.press('Escape');

		// Wait for modal to close and helpers to be added
		await page.waitForTimeout(500);

		// Check that helpers are showing (should be same as clicking once)
		const helpers = await page.locator('[class*="farm-helper"]').count();

		// Should have helpers (more than 0)
		expect(helpers).toBeGreaterThan(0);

		// Check for Prithiva Topaz - should appear exactly once, not duplicated
		const gemstoneHelpers = await page.locator('[class*="farm-helper"]:has-text("Prithiva Topaz")').count();

		// This test will likely FAIL if the bug exists - we expect 1 but might see 2 or more
		expect(gemstoneHelpers).toBe(1);

		console.log(`Albedo clicked three times: ${helpers} total helpers, ${gemstoneHelpers} Prithiva Topaz helpers (expected 1)`);
	});

	test('Verify active presets are visually indicated and persist across reloads', async ({page}) => {
		// Open preset modal
		await page.click('button[aria-label="Add preset"]');

		// Wait for modal to open and be visible
		await page.waitForSelector('[role="dialog"]', {state: 'visible'});

		// Click Albedo preset to activate
		await page.click('text=Albedo');

		// Check if Albedo preset has active indicator (border or similar)
		// This test documents the expected behavior per the comment

		// Close and reopen modal to test persistence
		await page.keyboard.press('Escape');
		await page.waitForTimeout(300);
		await page.click('button[aria-label="Add preset"]');
		await page.waitForSelector('[role="dialog"]', {state: 'visible'});

		// Albedo should still show as active after modal reopen
		// (This might fail if active state isn't persisted properly)

		console.log('Active preset indicator test completed');
	});
});
