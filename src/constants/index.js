function importAll(context) {
	const images = {};
	for (const item of context.keys()) {
		images[item.replace(/\.\/[^/]+\//, '')] = context(item);
	}

	return images;
}

// eslint-disable-next-line unicorn/prefer-module
const images = importAll(require.context('../images/materials', true, /\.(png|jpe?g)$/));

const ascensionMaterials = {
	AgnidusAgate: [images['ascMat_pyro_AgnidusAgateSliver.png'], images['ascMat_pyro_AgnidusAgateFragment.png'], images['ascMat_pyro_AgnidusAgateChunk.png'], images['ascMat_pyro_AgnidusAgateGemstone.png']],
	ShivadaJade: [images['ascMat_anemo_ShivadaJadeSliver.png'], images['ascMat_anemo_ShivadaJadeFragment.png'], images['ascMat_anemo_ShivadaJadeChunk.png'], images['ascMat_anemo_ShivadaJadeGemstone.png']],
	VayudaTurquoise: [images['ascMat_cryo_VayudaTurquoiseSliver.png'], images['ascMat_cryo_VayudaTurquoiseFragment.png'], images['ascMat_cryo_VayudaTurquoiseChunk.png'], images['ascMat_cryo_VayudaTurquoiseGemstone.png']],
	VajradaAmethyst: [images['ascMat_electro_VajradaAmethystSliver.png'], images['ascMat_electro_VajradaAmethystFragment.png'], images['ascMat_electro_VajradaAmethystChunk.png'], images['ascMat_electro_VajradaAmethystGemstone.png']],
	PrithivaTopaz: [images['ascMat_geo_PrithivaTopazSliver.png'], images['ascMat_geo_PrithivaTopazFragment.png'], images['ascMat_geo_PrithivaTopazChunk.png'], images['ascMat_geo_PrithivaTopazGemstone.png']],
	VarunadaLazurite: [images['ascMat_hydro_VarunadaLazuriteSliver.png'], images['ascMat_hydro_VarunadaLazuriteFragment.png'], images['ascMat_hydro_VarunadaLazuriteChunk.png'], images['ascMat_hydro_VarunadaLazuriteGemstone.png']],
	BrilliantDiamond: [images['ascMat_traveler_BrilliantDiamondSliver.png'], images['ascMat_traveler_BrilliantDiamondFragment.png'], images['ascMat_traveler_BrilliantDiamondChunk.png'], images['ascMat_traveler_BrilliantDiamondGemstone.png']],
	// Dendro

	BasaltPillar: [images['ascDrop_geo_BasaltPillar.png']],
	CleansingHeart: [images['ascDrop_hydro_CleansingHeart.png']],
	CrystallineBloom: [images['ascDrop_cryo_CrystallineBloom.png']],
	DewOfRepudiation: [images['ascDrop_hydro_DewOfRepudiation.png']],
	DragonheirsFalseFin: [images['ascDrop_versatile_DragonheirsFalseFin.png']],
	EverflameSeed: [images['ascDrop_pyro_EverflameSeed.png']],
	HoarfrostCore: [images['ascDrop_cryo_HoarfrostCore.png']],
	HurricaneSeed: [images['ascDrop_anemo_HurricaneSeed.png']],
	JuvenileJade: [images['ascDrop_versatile_JuvenileJade.png']],
	LightningPrism: [images['ascDrop_electro_LightningPrism.png']],
	MarionetteCore: [images['ascDrop_anemo_MarionetteCore.png']],
	PerpetualHeart: [images['ascDrop_versatile_PerpetualHeart.png']],
	SmolderingPearl: [images['ascDrop_pyro_SmolderingPearl.png']],
	StormBeads: [images['ascDrop_electro_StormBeads.png']],
	RiftbornRegalia: [images['ascDrop_geo_riftbornRegalia.png']],
};

const generalMaterials = {
	Slime: [images['commonMat_slime_SlimeCondensate.png'], images['commonMat_slime_SlimeSecretions.png'], images['commonMat_slime_SlimeConcentrate.png']],
	Mask: [images['commonMat_mask_DamagedMask.png'], images['commonMat_mask_StainedMask.png'], images['commonMat_mask_OmiunousMask.png']],
	Scroll: [images['commonMat_scroll_DiviningScroll.png'], images['commonMat_scroll_SealedScroll.png'], images['commonMat_scroll_ForbiddenCurseScroll.png']],
	Arrowhead: [images['commonMat_arrowhead_FirmArrowhead.png'], images['commonMat_arrowhead_SharpArrowhead.png'], images['commonMat_arrowhead_WeatheredArrowhead.png']],
	FatuiInsignia: [images['commonMat_fatuiInsignia_RecruitsInsignia.png'], images['commonMat_fatuiInsignia_SergeantsInsignia.png'], images['commonMat_fatuiInsignia_LieutenantsInsignia.png']],
	HoarderInsignia: [images['commonMat_hoarderInsignia_TreasureHoarderInsignia.png'], images['commonMat_hoarderInsignia_SilverRavenInsignia.png'], images['commonMat_hoarderInsignia_GoldenRavenInsignia.png']],
	Nectar: [images['commonMat_nectar_EnergyNectar.png'], images['commonMat_nectar_ShimmeringNectar.png'], images['commonMat_nectar_WhopperflowerNectar.png']],
	Handguard: [images['commonMat_handguard_OldHandguard.png'], images['commonMat_handguard_KageuchiHandguard.png'], images['commonMat_handguard_FamedHandguard.png']],
	// FungalSpores
};

const eliteMaterials = {
	Spectral: [images['commonMat_spectral_SpectralHusk.png'], images['commonMat_spectral_SpectralHeart.png'], images['commonMat_spectral_SpectralNucleus.png']],
	Horn: [images['commonMat_horn_HeavyHorn.png'], images['commonMat_horn_BlackBronzeHorn.png'], images['commonMat_horn_BlackCrystalHorn.png']],
	LeyLine: [images['commonMat_leyLine_DeadLeyLineBranch.png'], images['commonMat_leyLine_DeadLeyLineLeaves.png'], images['commonMat_leyLine_LeyLineSprout.png']],
	ChaosPartA: [images['commonMat_chaosPartA_ChaosDevice.png'], images['commonMat_chaosPartA_ChaosCircuit.png'], images['commonMat_chaosPartA_ChaosCore.png']],
	MistGrass: [images['commonMat_mistGrass_MistGrassPollen.png'], images['commonMat_mistGrass_MistGrass.png'], images['commonMat_mistGrass_MistGrassWick.png']],
	Knife: [images['commonMat_knife_HuntersSacrificialKnife.png'], images['commonMat_knife_AgentsSacrificialKnife.png'], images['commonMat_knife_InspectorsSacrificialKnife.png']],
	Bone: [images['commonMat_bone_FragileBoneShard.png'], images['commonMat_bone_SturdyBoneShard.png'], images['commonMat_bone_FossilizedBoneShard.png']],
	ChaosPartB: [images['commonMat_chaosPartB_ChaosGear.png'], images['commonMat_chaosPartB_ChaosAxis.png'], images['commonMat_chaosPartB_ChaosOculus.png']],
	Prism: [images['commonMat_prism_DismalPrism.png'], images['commonMat_prism_CrystalPrism.png'], images['commonMat_prism_PolarizingPrism.png']],
	RiftClaw: [images['commonMat_riftClaw_concealedClaw.png'], images['commonMat_riftClaw_concealedUnguis.png'], images['commonMat_riftClaw_concealedTalon.png']],
	// Statuette
};

const materials = {
	Ascension: ascensionMaterials,
	General: generalMaterials,
	Elite: eliteMaterials,
};

export default materials;
