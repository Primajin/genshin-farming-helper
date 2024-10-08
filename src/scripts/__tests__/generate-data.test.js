import fs from 'node:fs';
import {describe, it, expect} from 'vitest';

import {materials, materialsRare} from '../generate-data.js';

describe('generate Data', () => {
	describe('materials', () => {
		it('should test that correct data is generated', () => {
			const keys = Object.keys(materials);
			expect(keys).toHaveLength(9);

			const {characterAscensionMaterials} = materials;
			expect(characterAscensionMaterials).toHaveLength(32);

			const firstItem = characterAscensionMaterials[0];
			expect(firstItem).toHaveProperty('name');
			expect(firstItem.name).toBe('Brilliant Diamond Sliver');
		});

		it('should test that data is written to file', () => {
			const file = fs.existsSync('src/data.json');
			expect(file).toBeTruthy();
		});
	});

	describe('materialsRare', () => {
		it('should test that correct data is generated', () => {
			const keys = Object.keys(materialsRare);
			expect(keys).toHaveLength(9);

			const {characterAscensionMaterials} = materialsRare;
			expect(characterAscensionMaterials).toHaveLength(8);

			const firstItem = characterAscensionMaterials[0];
			expect(firstItem).toHaveProperty('name');
			expect(firstItem.name).toBe('Brilliant Diamond Gemstone');
		});

		it('should test that data is written to file', () => {
			const file = fs.existsSync('src/data-rare.json');
			expect(file).toBeTruthy();
		});
	});
});
