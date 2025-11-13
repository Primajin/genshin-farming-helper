export const presets = {
	characters: [
		{
			id: 10_000_005,
			name: 'Test Character',
			element: 'Anemo',
			rarity: 5,
			items: [
				{
					id: 104_101,
					name: 'Brilliant Diamond Sliver',
					count: 1,
				},
				{
					id: 104_102,
					name: 'Brilliant Diamond Fragment',
					count: 9,
				},
			],
			images: {
				// eslint-disable-next-line camelcase
				filename_icon: 'UI_AvatarIcon_PlayerBoy',
			},
		},
	],
	weapons: [
		{
			id: 11_101,
			name: 'Test Weapon',
			weaponType: 'Sword',
			rarity: 4,
			items: [
				{
					id: 114_017,
					name: 'Mist Veiled Lead Elixir',
					count: 3,
				},
			],
			images: {
				// eslint-disable-next-line camelcase
				filename_icon: 'UI_EquipIcon_Sword',
			},
		},
	],
	fishingRods: [
		{
			id: 201_001,
			name: 'Test Fishing Rod 1',
			items: [
				{
					id: 131_046,
					name: 'Common Axehead Fish',
					count: 20,
				},
				{
					id: 131_047,
					name: 'Veggie Mauler Shark',
					count: 20,
				},
			],
		},
		{
			id: 201_002,
			name: 'Test Fishing Rod 2',
			items: [
				{
					id: 131_046,
					name: 'Common Axehead Fish',
					count: 20,
				},
				{
					id: 131_048,
					name: 'Medaka',
					count: 20,
				},
			],
		},
	],
};
