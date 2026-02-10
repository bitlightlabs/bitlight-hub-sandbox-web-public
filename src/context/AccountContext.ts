import type { RgbLdkNode } from "@/lib/rgbsdk/ILightning";
import { createContext } from "react";

const AccountContext = createContext<{
  account: RgbLdkNode | null,
  selectNode: (node: RgbLdkNode) => void,
  reset: () => void} | null
>(null);

export default AccountContext
