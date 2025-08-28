import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MapPin, Star, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Entrenador {
  id: number;
  nombreCompleto: string;
  fotoPerfil?: string;
  edad?: number;
  telefono?: string;
  ciudad?: string;
  pais?: string;
  biografia?: string;
  nivelAcademico?: string;
  certificaciones?: string;
  aniosExperiencia?: number;
  especialidades?: string;
}

const Entrenadores = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Datos quemados de entrenadores para mostrar en el frontend
  const dummyEntrenadores: Entrenador[] = [
    {
      id: 1,
      nombreCompleto: "Ana García",
      fotoPerfil: "https://via.placeholder.com/150/FF6347/FFFFFF?text=AG",
      edad: 28,
      telefono: "+34 600 123 456",
      ciudad: "Madrid",
      pais: "España",
      biografia: "Entrenadora personal con 8 años de experiencia, especializada en entrenamiento de fuerza y pérdida de peso. Ayudo a mis clientes a alcanzar sus metas de forma efectiva y sostenible.",
      nivelAcademico: "Licenciatura en Ciencias del Deporte",
      certificaciones: "NSCA-CPT, Especialista en Nutrición Deportiva",
      aniosExperiencia: 8,
      especialidades: "Fuerza, Pérdida de Peso, HIIT",
    },
    {
      id: 2,
      nombreCompleto: "Carlos Rodríguez",
      fotoPerfil: "https://via.placeholder.com/150/4682B4/FFFFFF?text=CR",
      edad: 35,
      telefono: "+34 611 987 654",
      ciudad: "Barcelona",
      pais: "España",
      biografia: "Experto en culturismo y preparación física. Con 15 años de trayectoria, he guiado a numerosos atletas a competiciones exitosas. Mi enfoque es la disciplina y la técnica perfecta.",
      nivelAcademico: "Grado Superior en Acondicionamiento Físico",
      certificaciones: "IFBB Pro, Entrenador de Culturismo",
      aniosExperiencia: 15,
      especialidades: "Culturismo, Aumento de Masa Muscular, Preparación para Competición",
    },
    {
      id: 3,
      nombreCompleto: "Sofía López",
      fotoPerfil: "https://via.placeholder.com/150/3CB371/FFFFFF?text=SL",
      edad: 30,
      telefono: "+34 622 345 678",
      ciudad: "Valencia",
      pais: "España",
      biografia: "Entrenadora holística, fusiono el entrenamiento físico con el bienestar mental. Mis 10 años de experiencia me permiten crear planes personalizados para una vida equilibrada.",
      nivelAcademico: "Máster en Psicología del Deporte",
      certificaciones: "Yoga Alliance RYT-200, Coach de Bienestar",
      aniosExperiencia: 10,
      especialidades: "Yoga, Pilates, Bienestar, Flexibilidad",
    },
    {
      id: 4,
      nombreCompleto: "Juan Pérez",
      fotoPerfil: "https://via.placeholder.com/150/FFD700/000000?text=JP",
      edad: 40,
      telefono: "+34 633 789 012",
      ciudad: "Sevilla",
      pais: "España",
      biografia: "Especialista en entrenamiento funcional y rehabilitación. Ayudo a mis clientes a recuperar la movilidad y fuerza después de lesiones, con un enfoque seguro y progresivo.",
      nivelAcademico: "Fisioterapeuta y Entrenador Deportivo",
      certificaciones: "Certificación en Entrenamiento Funcional, Kinesiotaping",
      aniosExperiencia: 18,
      especialidades: "Rehabilitación, Entrenamiento Funcional, Tercera Edad",
    },
    {
      id: 5,
      nombreCompleto: "María Fernández",
      fotoPerfil: "https://via.placeholder.com/150/DA70D6/FFFFFF?text=MF",
      edad: 25,
      telefono: "+34 644 102 304",
      ciudad: "Bilbao",
      pais: "España",
      biografia: "Joven y dinámica entrenadora, apasionada por el fitness y la vida saludable. Mi objetivo es motivar a mis clientes a través de rutinas divertidas y desafiantes para alcanzar su mejor versión.",
      nivelAcademico: "Técnico en Actividades Físicas y Deportivas",
      certificaciones: "Zumba Instructor, TRX Certified",
      aniosExperiencia: 5,
      especialidades: "Fitness Grupal, Cardio, Tonificación, Zumba",
    },
    {
      id: 6,
      nombreCompleto: "Pedro Sánchez",
      fotoPerfil: "https://via.placeholder.com/150/87CEFA/FFFFFF?text=PS",
      edad: 32,
      telefono: "+34 655 432 109",
      ciudad: "Zaragoza",
      pais: "España",
      biografia: "Entrenador de alto rendimiento y preparador físico para deportes específicos. Con 12 años de experiencia, maximizo el potencial atlético de mis clientes para superar límites.",
      nivelAcademico: "Grado en Ciencias de la Actividad Física y del Deporte",
      certificaciones: "Certificación en Entrenamiento de Alto Rendimiento, Levantamiento Olímpico",
      aniosExperiencia: 12,
      especialidades: "Deportes de Equipo, Resistencia, Potencia, Crossfit",
    },
  ];

  useEffect(() => {
    // Simular la carga de datos con un retardo para mostrar el estado de carga
    const timer = setTimeout(() => {
      setEntrenadores(dummyEntrenadores);
      setIsLoading(false);
    }, 1000); // Retardo de 1 segundo
    return () => clearTimeout(timer);
  }, []);

  // Removido: fetchEntrenadores ya no es necesario
  /*
  const fetchEntrenadores = async () => {
    try {
  // Consumir la API local para entrenadores
  const response = await fetch('http://localhost:3010/api/entrenadortodos');
      if (response.ok) {
        const data = await response.json();
        setEntrenadores(data);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los entrenadores",
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
  */

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
          
          <h1 className="text-4xl font-bold text-secondary mb-4">Entrenadores</h1>
          <p className="text-muted-foreground text-lg">
            Conecta con nuestros entrenadores certificados y encuentra el que mejor se adapte a tus objetivos
          </p>
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
        ) : entrenadores.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay entrenadores disponibles</h3>
              <p className="text-muted-foreground">
                Aún no se han registrado entrenadores en la plataforma
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entrenadores.map((entrenador) => (
              <Card key={entrenador.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {entrenador.fotoPerfil ? (
                      <img 
                        src={entrenador.fotoPerfil} 
                        alt={entrenador.nombreCompleto}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{entrenador.nombreCompleto}</CardTitle>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    {entrenador.ciudad && entrenador.pais && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{entrenador.ciudad}, {entrenador.pais}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {entrenador.especialidades && (
                    <div>
                      <h4 className="font-semibold mb-2">Especialidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {entrenador.especialidades.split(',').map((especialidad, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {especialidad.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {entrenador.aniosExperiencia && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{entrenador.aniosExperiencia} años de experiencia</span>
                    </div>
                  )}

                  {entrenador.biografia && (
                    <div>
                      <h4 className="font-semibold mb-2">Biografía</h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {entrenador.biografia}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Ver Perfil
                    </Button>
                    {entrenador.telefono && (
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
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

export default Entrenadores;