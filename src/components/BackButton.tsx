import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
      className="absolute top-4 left-4 z-10 text-foreground hover:bg-primary/10"
    >
      <ArrowLeft size={24} />
    </Button>
  );
}
