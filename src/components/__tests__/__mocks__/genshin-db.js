const mockCharacter = {
	costs: {
		ascend1: [{name: 'Material A', count: 1}],
		ascend2: [{name: 'Material B', count: 2}],
	},
};

const mockWeapon = {
	costs: {
		ascend1: [{name: 'Material C', count: 3}],
		ascend2: [{name: 'Material D', count: 4}],
	},
};

const mockFishingRod = {
	source: ['Fish A', 'Fish B'],
};

const genshinDb = {
	characters(name) {
		if (name === 'names') {
			return ['Character 1'];
		}

		if (name === 'Character 1') {
			return mockCharacter;
		}

		return [];
	},
	weapons(name) {
		if (name === 'names') {
			return ['Weapon 1'];
		}

		if (name === 'Weapon 1') {
			return mockWeapon;
		}

		return [];
	},
	materials(query) {
		if (query === 'names') {
			return ['Fishing Rod 1', 'Windtangler', 'Wishmaker'];
		}

		if (query === 'Fishing Rod 1') {
			return mockFishingRod;
		}

		return [];
	},
};

export default genshinDb;
