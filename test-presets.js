import genshinDb from 'genshin-db';

const defaultOptions = {matchCategories: true, verboseCategories: true};

// Test character
const char = genshinDb.characters('amber', defaultOptions);
console.log('Amber:', {
	id: char.id,
	name: char.name,
	hasCosts: Boolean(char.costs),
	costKeys: Object.keys(char.costs || {}),
});

if (char.costs) {
	console.log('First cost:', JSON.stringify(char.costs.ascend1, null, 2));
}

// Test character names
const charNames = genshinDb.characters('names', defaultOptions);
console.log('\nTotal characters:', charNames.length);
console.log('First 5 characters:', charNames.slice(0, 5));
