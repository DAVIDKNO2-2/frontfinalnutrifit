import { Button } from "@/components/ui/button";
import { Dumbbell, User, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-secondary text-secondary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}> 
          <Dumbbell className="h-8 w-8 text-red-600 stroke-black" style={{ strokeWidth: 2 }} />
          <h1 className="text-2xl font-extrabold text-red-600 border-2 border-black rounded px-2 py-0.5 shadow-md">NUTRIFIT</h1>
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
          <div
            className="ml-2 cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 border-2 border-primary hover:shadow-lg transition"
            onClick={() => navigate("/perfilusuario")}
            title="Perfil de usuario"
          >
            <User className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;