import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Activity, Clock, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Ejercicio {
  id: number;
  nombre: string;
  repeticiones?: string;
  instrucciones?: string;
}

interface Rutina {
  id: number;
  nombre: string;
  descripcion?: string;
  creadoEn: string;
  ejercicios: Ejercicio[];
}

const Rutinas = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);

  useEffect(() => {
    fetchRutinas();
  }, []);

  const fetchRutinas = async () => {
    try {
      // TODO: Implementar fetch al backend /api/rutinas
      const response = await fetch('/api/rutinas');
      if (response.ok) {
        const data = await response.json();
        setRutinas(data);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar las rutinas",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gym-light">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-secondary mb-4">Rutinas de Ejercicios</h1>
              <p className="text-muted-foreground text-lg">
                Descubre rutinas diseñadas por profesionales para alcanzar tus objetivos fitness
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Rutina
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rutinas.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay rutinas disponibles</h3>
              <p className="text-muted-foreground mb-4">
                Aún no se han creado rutinas en la plataforma
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Rutina
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rutinas.map((rutina) => (
              <Card key={rutina.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {rutina.ejercicios.length} ejercicios
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{rutina.nombre}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {rutina.descripcion || "Rutina de ejercicios personalizada"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Creada el {formatDate(rutina.creadoEn)}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Ejercicios incluidos:</h4>
                    <div className="space-y-1">
                      {rutina.ejercicios.slice(0, 3).map((ejercicio) => (
                        <div key={ejercicio.id} className="text-sm text-muted-foreground">
                          • {ejercicio.nombre}
                          {ejercicio.repeticiones && (
                            <span className="text-xs ml-2">({ejercicio.repeticiones})</span>
                          )}
                        </div>
                      ))}
                      {rutina.ejercicios.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          ... y {rutina.ejercicios.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setSelectedRutina(rutina)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedRutina?.nombre}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {selectedRutina?.descripcion && (
                            <div>
                              <h3 className="font-semibold mb-2">Descripción</h3>
                              <p className="text-muted-foreground">{selectedRutina.descripcion}</p>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="font-semibold mb-4">Ejercicios ({selectedRutina?.ejercicios.length})</h3>
                            <div className="space-y-4">
                              {selectedRutina?.ejercicios.map((ejercicio, index) => (
                                <Card key={ejercicio.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="text-xs">
                                        {index + 1}
                                      </Badge>
                                      <h4 className="font-semibold">{ejercicio.nombre}</h4>
                                    </div>
                                    {ejercicio.repeticiones && (
                                      <p className="text-sm text-muted-foreground mb-2">
                                        <strong>Repeticiones:</strong> {ejercicio.repeticiones}
                                      </p>
                                    )}
                                    {ejercicio.instrucciones && (
                                      <p className="text-sm text-muted-foreground">
                                        <strong>Instrucciones:</strong> {ejercicio.instrucciones}
                                      </p>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Usar Rutina
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rutinas;