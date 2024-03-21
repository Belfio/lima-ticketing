import { useEffect } from "react";

export default function KeyboardController({
  children,
  // keyActions,
  setKey,
  shouldPreventDefault = () => false,
}: {
  children: React.ReactNode;
  setKey: (key: string) => void;
  // keyActions?: {
  //   ArrowDown: (e: KeyboardEvent) => void;
  //   ArrowUp: (e: KeyboardEvent) => void;
  //   Enter: (e: KeyboardEvent) => void;
  //   Escape: (e: KeyboardEvent) => void;
  //   Tab: (e: KeyboardEvent) => void;
  //   a: (e: KeyboardEvent) => void;
  //   r: (e: KeyboardEvent) => void;
  //   u: (e: KeyboardEvent) => void;
  // };
  shouldPreventDefault: (key: string) => boolean;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (shouldPreventDefault(e.key)) {
        console.log("preventing");
        e.preventDefault();
      }

      // console.log(e.key);
      // if (e.key in keyActions) keyActions[e.key](e);

      setKey(e.key);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return children;
}
