import { Button } from "@/components/ui/button";
import { Dumbbell, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-secondary text-secondary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">GymFit</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </Button>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <User className="w-4 h-4 mr-2" />
            Registrarse
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;