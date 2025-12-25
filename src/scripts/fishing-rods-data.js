// Manual fishing rod recipe data based on game requirements
// Each rod requires 20 of each specified fish type
// This data is not available in genshin-db, so we maintain it manually
// Using fish IDs for reliable matching
export const fishingRodRecipes = {
	200_901: [ // Windtangler
		131_000, // Medaka
		131_003, // Aizen Medaka
		131_008, // Venomspine Fish
		131_015, // Tea-Colored Shirakodai
	],
	200_902: [ // Wishmaker
		131_000, // Medaka
		131_002, // Sweet-Flower Medaka
		131_007, // Betta
		131_013, // Brown Shirakodai
	],
	200_903: [ // Narukawa Ukai
		131_000, // Medaka
		131_001, // Glaze Medaka
		131_006, // Lunged Stickleback
		131_014, // Purple Shirakodai
	],
	200_904: [ // Moonstringer
		// obtained from event, no recipe
	],
	200_905: [ // Serendipity
		131_000, // Medaka
		131_023, // True Fruit Angler
		131_025, // Sandstorm Angler
		131_026, // Sunset Cloud Angler
	],
	200_906: [ // Wavepiercer
		131_029, // Streaming Axe Marlin
		131_032, // Maintenance Mek: Initial Configuration
		131_033, // Maintenance Mek: Water Body Cleaner
		131_034, // Maintenance Mek: Situation Controller
	],
	200_907: [ // Flowhorn Flounderfinder
		131_040, // Magma Rapidfighting Fish
		131_041, // Greenwave Sunfish
		131_042, // Dusk Sunfish
		131_043, // Phony Phlogiston Unihornfish
	],
	200_908: [ // Moongleam Sapling
		131_046, // Common Axehead Fish
		131_049, // Veggie Mauler Shark
		131_051, // Azuregaze Crystal-Eye
		131_052, // Nightgaze Crystal-Eye
	],
};
