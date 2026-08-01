import Image from "next/image";
import { designTokens } from "./constants/design-tokens";

export default function Home() {
  return (
    <div className={`flex flex-col flex-1 items-center justify-center ${designTokens.colors.bg.page} font-sans`}>

    </div>
  );
}