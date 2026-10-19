import type { Translation } from "@/i18n";
import type { KeyFeatureLabels } from "@/modules/home/KeyFeaturesScenes";

/** Everything a product page's scenes write: the home's scene labels, and their own (`p`). */
export interface ProductSceneLabels extends KeyFeatureLabels {
    p: Translation["productScenes"];
}

export function productSceneLabels(t: Translation): ProductSceneLabels {
    const items = t.wallOfFeatures.items;
    return {
        ui: t.homeScenes,
        controlPanel: items.controlPanel,
        billing: items.billing,
        assessments: items.assessments,
        crm: items.crm,
        forms: t.features.keyFeaturesTabs[5].title,
        communication: items.communication,
        verifactu: items.verifactu,
        reportCards: items.reportCards,
        crmStat: t.erpStats.cases[1].stat,
        p: t.productScenes,
    };
}
