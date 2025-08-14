import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  gradient?: boolean;
}

const ModuleCard = ({ title, description, icon: Icon, route, gradient = false }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 hover:scale-105 ${
      gradient ? 'bg-gradient-to-br from-primary to-gym-orange text-primary-foreground' : 'bg-card'
    }`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Icon className={`h-8 w-8 ${gradient ? 'text-white' : 'text-primary'}`} />
        </div>
        <CardTitle className={`text-xl ${gradient ? 'text-white' : 'text-foreground'}`}>
          {title}
        </CardTitle>
        <CardDescription className={gradient ? 'text-white/90' : 'text-muted-foreground'}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={() => navigate(route)}
          className={`w-full ${
            gradient 
              ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          variant={gradient ? "outline" : "default"}
        >
          Acceder
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;