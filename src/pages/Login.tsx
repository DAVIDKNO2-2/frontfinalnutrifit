import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3010/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        // Si el backend responde con error (ej: 401), mostrar mensaje
        const errorMsg = await res.text();
        toast({
          title: "Contraseña incorrecta",
          description: "La contraseña no es correcta. Intente de nuevo o vaya a 'Olvidé mi contraseña'.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const response = await res.json();
      if (response && response.data) {
        localStorage.setItem("usuario", JSON.stringify(response.data));
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de vuelta",
        });
        navigate("/");
        location.reload();
      } else {
        toast({
          title: "Contraseña incorrecta",
          description: "La contraseña no es correcta. Intente de nuevo o vaya a 'Olvidé mi contraseña'.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gym-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede a tu cuenta de GymFit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              <Button
                variant="link"
                onClick={() => navigate("/forgot-password")}
                className="text-primary"
              >
                ¿Olvidaste tu contraseña?
              </Button>
              <br />
              <Button
                variant="link"
                onClick={() => navigate("/forgot-username")}
                className="text-primary"
              >
                ¿Olvidaste tu usuario?
              </Button>
              <br />
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Button
                variant="link"
                onClick={() => navigate("/register")}
                className="text-primary p-0"
              >
                Regístrate aquí
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;