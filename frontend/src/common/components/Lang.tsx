import { useEffect, useRef, FC } from "react";

interface LangProps {
  ruText: string;
  enText: string;
  userLang: any;
}

const Lang: FC<LangProps> = ({ ruText, enText, userLang }) => {
  const enRef = useRef<HTMLSpanElement>(null);
  const ruRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const enNode = enRef.current;
    const ruNode = ruRef.current;

    if (enNode && ruNode) {
      if (userLang === "EN") {
        enNode.style.transform = "translateY(60px)";
        ruNode.style.transform = "none";
      } else if (userLang === "RU") {
        enNode.style.transform = "none";
        ruNode.style.transform = "translateY(60px)";
      }
    }
  }, [userLang]);

  return (
    <div className="lang">
      <span className="en" ref={enRef}>
        {enText}
      </span>
      <span className="ru" ref={ruRef}>
        {ruText}
      </span>
    </div>
  );
};

export default Lang;
