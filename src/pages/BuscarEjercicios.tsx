import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Dumbbell, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  url: string;
}

const categorias = [
  "TODAS_LAS_PARTES",
  "BACK",
  "CARDIO", 
  "CHEST",
  "LOWER_ARMS",
  "LOWER_LEGS",
  "NECK",
  "SHOULDERS",
  "UPPER_ARMS",
  "UPPER_LEGS",
  "WAIST"
];

const categoriasNames: Record<string, string> = {
  "TODAS_LAS_PARTES": "Todas las Partes",
  "BACK": "Espalda",
  "CARDIO": "Cardio",
  "CHEST": "Pecho",
  "LOWER_ARMS": "Antebrazos",
  "LOWER_LEGS": "Piernas (Inferior)",
  "NECK": "Cuello",
  "SHOULDERS": "Hombros",
  "UPPER_ARMS": "Brazos (Superior)",
  "UPPER_LEGS": "Piernas (Superior)",
  "WAIST": "Cintura"
};

const BuscarEjercicios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [filteredEjercicios, setFilteredEjercicios] = useState<Ejercicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("TODAS_LAS_PARTES");

  useEffect(() => {
    fetchEjercicios();
  }, []);

  useEffect(() => {
    filterEjercicios();
  }, [ejercicios, searchTerm, selectedCategoria]);

  const fetchEjercicios = async () => {
    try {
      // TODO: Implementar fetch al backend /api/ejerciciosbusqueda
      const response = await fetch('/api/ejerciciosbusqueda');
      if (response.ok) {
        const data = await response.json();
        setEjercicios(data);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los ejercicios",
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

  const fetchEjerciciosByCategoria = async (categoria: string) => {
    if (categoria === "TODAS_LAS_PARTES") {
      setFilteredEjercicios(ejercicios.filter(ejercicio => 
        ejercicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ejercicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar fetch al backend /api/ejerciciosbusqueda/:categoria
      const response = await fetch(`/api/ejerciciosbusqueda/${categoria}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredEjercicios(data.filter((ejercicio: Ejercicio) => 
          ejercicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ejercicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los ejercicios de esta categoría",
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

  const filterEjercicios = () => {
    if (selectedCategoria === "TODAS_LAS_PARTES") {
      setFilteredEjercicios(ejercicios.filter(ejercicio => 
        ejercicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ejercicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      fetchEjerciciosByCategoria(selectedCategoria);
    }
  };

  const handleCategoriaChange = (categoria: string) => {
    setSelectedCategoria(categoria);
    setIsLoading(true);
    setTimeout(() => {
      fetchEjerciciosByCategoria(categoria);
    }, 100);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      "BACK": "bg-blue-100 text-blue-800",
      "CARDIO": "bg-red-100 text-red-800",
      "CHEST": "bg-green-100 text-green-800",
      "LOWER_ARMS": "bg-purple-100 text-purple-800",
      "LOWER_LEGS": "bg-orange-100 text-orange-800",
      "NECK": "bg-pink-100 text-pink-800",
      "SHOULDERS": "bg-indigo-100 text-indigo-800",
      "UPPER_ARMS": "bg-purple-100 text-purple-800",
      "UPPER_LEGS": "bg-orange-100 text-orange-800",
      "WAIST": "bg-yellow-100 text-yellow-800"
    };
    return colors[categoria] || "bg-gray-100 text-gray-800";
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
          
          <h1 className="text-4xl font-bold text-secondary mb-4">Buscar Ejercicios</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Explora nuestra amplia biblioteca de ejercicios organizados por categorías
          </p>

          {/* Filtros */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ejercicios por nombre o descripción..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategoria} onValueChange={handleCategoriaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoriasNames[categoria]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categorías rápidas */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categorias.slice(1).map((categoria) => (
              <Button
                key={categoria}
                variant={selectedCategoria === categoria ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoriaChange(categoria)}
                className="text-xs"
              >
                {categoriasNames[categoria]}
              </Button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {isLoading ? "Cargando..." : `${filteredEjercicios.length} ejercicios encontrados`}
            {selectedCategoria !== "TODAS_LAS_PARTES" && (
              <span> en {categoriasNames[selectedCategoria]}</span>
            )}
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
        ) : filteredEjercicios.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron ejercicios</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No hay ejercicios que coincidan con "${searchTerm}" en la categoría seleccionada`
                  : "No hay ejercicios disponibles en esta categoría"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEjercicios.map((ejercicio) => (
              <Card key={ejercicio.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <Badge className={getCategoriaColor(ejercicio.categoria)}>
                      {categoriasNames[ejercicio.categoria]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{ejercicio.nombre}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-3">
                    {ejercicio.descripcion}
                  </CardDescription>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(ejercicio.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Tutorial
                    </Button>
                    
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      Agregar a Rutina
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

export default BuscarEjercicios;