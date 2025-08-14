import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Apple, Calendar, Plus, Eye, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Comida {
  id: number;
  tipo: string;
  hora?: string;
  descripcion: string;
}

interface Alimentacion {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  creadoEn: string;
  comidas: Comida[];
}

const Alimentacion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [planes, setPlanes] = useState<Alimentacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Alimentacion | null>(null);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      // TODO: Implementar fetch al backend /api/alimentacion
      const response = await fetch('/api/alimentacion');
      if (response.ok) {
        const data = await response.json();
        setPlanes(data);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los planes de alimentación",
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

  const getDaysRemaining = (fechaFin: string) => {
    const today = new Date();
    const endDate = new Date(fechaFin);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const groupComidasByTipo = (comidas: Comida[]) => {
    return comidas.reduce((acc, comida) => {
      if (!acc[comida.tipo]) {
        acc[comida.tipo] = [];
      }
      acc[comida.tipo].push(comida);
      return acc;
    }, {} as Record<string, Comida[]>);
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
              <h1 className="text-4xl font-bold text-secondary mb-4">Planes de Alimentación</h1>
              <p className="text-muted-foreground text-lg">
                Planes nutricionales balanceados diseñados para complementar tu entrenamiento
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Plan
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
        ) : planes.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <Apple className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay planes disponibles</h3>
              <p className="text-muted-foreground mb-4">
                Aún no se han creado planes de alimentación en la plataforma
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planes.map((plan) => {
              const daysRemaining = getDaysRemaining(plan.fechaFin);
              const isActive = daysRemaining > 0;
              
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Apple className="h-5 w-5 text-primary" />
                      <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {isActive ? `${daysRemaining} días restantes` : "Finalizado"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{plan.nombre}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {plan.descripcion || "Plan nutricional personalizado"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(plan.fechaInicio)} - {formatDate(plan.fechaFin)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Comidas incluidas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(plan.comidas.map(c => c.tipo))).map((tipo) => (
                          <Badge key={tipo} variant="outline" className="text-xs">
                            {tipo}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: {plan.comidas.length} comidas programadas
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedPlan(plan)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedPlan?.nombre}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {selectedPlan?.descripcion && (
                              <div>
                                <h3 className="font-semibold mb-2">Descripción</h3>
                                <p className="text-muted-foreground">{selectedPlan.descripcion}</p>
                              </div>
                            )}
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Fecha de inicio:</strong> {selectedPlan && formatDate(selectedPlan.fechaInicio)}
                              </div>
                              <div>
                                <strong>Fecha de fin:</strong> {selectedPlan && formatDate(selectedPlan.fechaFin)}
                              </div>
                            </div>
                            
                            {selectedPlan && (
                              <div>
                                <h3 className="font-semibold mb-4">Plan de Comidas</h3>
                                <div className="space-y-4">
                                  {Object.entries(groupComidasByTipo(selectedPlan.comidas)).map(([tipo, comidas]) => (
                                    <Card key={tipo}>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-primary">{tipo}</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        {comidas.map((comida) => (
                                          <div key={comida.id} className="border-l-2 border-primary/20 pl-4">
                                            {comida.hora && (
                                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{comida.hora}</span>
                                              </div>
                                            )}
                                            <p className="text-sm">{comida.descripcion}</p>
                                          </div>
                                        ))}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        {isActive ? "Seguir Plan" : "Ver Histórico"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alimentacion;