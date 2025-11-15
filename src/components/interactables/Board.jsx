import { useEffect, useState } from "react";
import { Box3, Vector3 } from "three";
import QuestionMark from "../ui/QuestionMark.jsx";
import useIsNear from '../../hooks/useIsNear.jsx';
import InteractionPrompt from "../ui/InteractionPrompt.jsx";
import { usePopup } from "../../context/PopupContext.jsx";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";

export default function Board({ target, playerRef }) 
{
    const [questionMarkPos, setQuestionMarkPos] = useState(null);
    const [interactionCenter, setInteractionCenter] = useState(null);
    const { isOpen, openPopup } = usePopup();
    const { keys, resetKeys } = useKeyboardControls();
    const { interact } = keys;

    const modules = import.meta.glob("/src/assets/diplomas/*.{jpg,png,jpeg}", { eager: false });
    const [certificates, setCertificates] = useState([]);

    useEffect(() => 
    {
    const loadCertificates = async () => 
        {
        const results = await Promise.all(Object.values(modules).map(mod => mod()));
        setCertificates(results.map(r => r.default));
        };
    loadCertificates();
    }, []);

    useEffect(() => 
    {
        if (!target) return;

        const box = new Box3().setFromObject(target);
        const center = new Vector3();
        const size = new Vector3();
        box.getCenter(center);
        box.getSize(size);

        center.z += 0.2; // offset
        const interactionCenter = center.clone();
        const questionMarkPos = interactionCenter.clone();
        questionMarkPos.y += size.y / 2;

        setQuestionMarkPos(questionMarkPos);
        setInteractionCenter(interactionCenter);
    }, [target]);

    const isNear = useIsNear(playerRef, interactionCenter, 3);

    useEffect(() => {
    if (isNear && interact && !isOpen && certificates.length > 0) 
    {
        console.log("Otevírám popup s certifikáty:", certificates);
        openPopup("certificates", certificates);
        resetKeys()
    }
    }, [isNear, interact, isOpen]);

    return (
    <>
        {questionMarkPos && <QuestionMark position={questionMarkPos.toArray()} visible={true} />}
        {interactionCenter && <InteractionPrompt position={interactionCenter} visible={isNear} />}
    </>
    );
}
