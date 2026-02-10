import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function CopyText(props: {text: string, size?: "xs" | "sm" | "lg"}) {
  const size = props.size || "xs"

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.text);
      toast.success('Copy successful');
    } catch(e) {}
  }
  
  return (
    <Button size={size} variant="ghost" onClick={copy}>
      <Copy />
    </Button>
  )
}
    