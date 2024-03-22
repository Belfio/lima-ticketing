import { useEffect } from "react";

export default function KeyboardController({
  children,
  setKey,
  shouldPreventDefault = () => false,
}: {
  children: React.ReactNode;
  setKey: (key: string) => void;
  shouldPreventDefault: (key: string) => boolean;
}) {
  useEffect(() => {
    console.log("running this?");
    const handleKey = (e: KeyboardEvent) => {
      if (shouldPreventDefault(e.key)) {
        console.log("preventing");
        e.preventDefault();
      }
      setKey(e.key);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  });

  return children;
}
