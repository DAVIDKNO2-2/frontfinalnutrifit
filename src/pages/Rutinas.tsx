
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";

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
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/rutinas");
        if (response.ok) {
          const data = await response.json();
          setRutinas(data);
        }
      } catch (error) {
        // Manejo simple de error
      } finally {
        setIsLoading(false);
      }
    };
    fetchRutinas();
  }, []);

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
        <h1 className="text-4xl font-bold text-secondary mb-8">Rutinas de Ejercicio</h1>
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rutinas.map((rutina) => (
              <Card key={rutina.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
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