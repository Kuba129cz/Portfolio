import { useEffect, useState } from "react";
import { Box3, Vector3 } from "three";
import QuestionMark from "../ui/QuestionMark.jsx";
import useIsNear from  '../../hooks/useIsNear.jsx'
import InteractionPrompt from "../ui/InteractionPrompt.jsx";
import { usePopup } from "../../context/PopupContext.jsx";
import { useKeyboardControls } from "../../hooks/KeyboardContext.jsx";

const modules = import.meta.glob("/src/assets/bookcovers/*.{jpg,png,jpeg}", { eager: false });
const bookCovers = Object.values(modules).map((mod) => mod.default);

export default function Bookshelf({ target, playerRef }) {
  const [questionMarkPos, setQuestionMarkPos] = useState(null);
  const [interactionCenter, setInteractionCenter] = useState(null);
  const { isOpen, openPopup } = usePopup();
  const { interact } = useKeyboardControls();
  const [bookCovers, setBookCovers] = useState([]);

  useEffect(() => {
    const loadCovers = async () => {
      const promises = Object.values(modules).map(mod => mod());
      const results = await Promise.all(promises);
      setBookCovers(results.map(r => r.default));
    };
    loadCovers();
  }, []);

  useEffect(() => {
    if (!target) return;

    const box = new Box3().setFromObject(target);

    const center = new Vector3();
    const size = new Vector3();
    box.getCenter(center);
    box.getSize(size);

    center.z += 2 // offset

    const interactionCenter = center.clone();

    const questionMarkPos = interactionCenter.clone();
    questionMarkPos.y += size.y / 2 + 0.3;

    setQuestionMarkPos(questionMarkPos);
    setInteractionCenter(interactionCenter);

   // console.log("Center knihovny:", center);
   // console.log("otaznik pozice:", questionMarkPos);
  }, [target]);

  const isNear = useIsNear(playerRef, interactionCenter, 1.5);

  const { canOpen, setCanOpen } = usePopup();
  useEffect(() => {
    if (isNear && interact && !isOpen && canOpen) 
    {
      openPopup("books", bookCovers);
    }
  }, [isNear, interact, canOpen]);

    return (
    <>
      {questionMarkPos && (
        <QuestionMark position={questionMarkPos.toArray()} visible={true} />
      )}

      {interactionCenter && (
      <InteractionPrompt position={interactionCenter} visible={isNear} />
    )}
    </>
    )
}
