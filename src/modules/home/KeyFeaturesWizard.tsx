import {
    BookOpenText,
    LayoutDashboard,
    Rows3,
    Smartphone,
    SquareUser,
    WalletCards,
    type LucideIcon,
} from "lucide-react";

import { CROP_STAGE, GlassPane, SceneBoard, SceneContent } from "@/components/wizard/glass-stage";
import { Wizard, type WizardCopy } from "@/components/wizard/Wizard";
import { KEY_FEATURE_SCENES, type KeyFeatureLabels } from "./KeyFeaturesScenes";

const ICONS: LucideIcon[] = [LayoutDashboard, WalletCards, BookOpenText, SquareUser, Rows3, Smartphone];
const DURATIONS = KEY_FEATURE_SCENES.map((scene) => scene.duration);

interface Props {
    /** In play order (`KEY_FEATURE_SCENES`), not in the dictionary's. */
    steps: { title: string; description: string; href: string }[];
    labels: KeyFeatureLabels;
    copy: WizardCopy;
    locale: string;
}

/**
 * "Las 6 claves de nuestra plataforma": one animation through the six features, on a pane of
 * glass that stays while the scenes on it dissolve from one feature to the next. The pane stands
 * centred and larger than its card, which cuts it at the foot.
 */
export default function KeyFeaturesWizard({ steps, labels, copy, locale }: Props) {
    return (
        <Wizard
            steps={steps.map((step, index) => ({ key: String(index), icon: ICONS[index], ...step }))}
            durations={DURATIONS}
            copy={copy}
            sceneMotion="fade"
            stageClassName={CROP_STAGE}
            backdrop={() => (
                <SceneBoard crop>
                    <GlassPane />
                </SceneBoard>
            )}
            renderScene={(index, t) => {
                const { Scene } = KEY_FEATURE_SCENES[index];
                return (
                    <SceneBoard crop>
                        <SceneContent>
                            <Scene t={t} labels={labels} locale={locale} />
                        </SceneContent>
                    </SceneBoard>
                );
            }}
        />
    );
}
