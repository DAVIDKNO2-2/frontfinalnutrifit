import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Apple, Plus, Trash2 } from "lucide-react"; // Se agregó Trash2 para el ícono de eliminar
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AssignPlanDialog from "./AssignPlanDialog"; // Added import for AssignPlanDialog

interface Comida {
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
  comidas: Comida[];
}

const Alimentacion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [planes, setPlanes] = useState<Alimentacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  // Estado para la asignación de planes
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedPlanForAssignment, setSelectedPlanForAssignment] = useState<Alimentacion | null>(null);

  // Estado para crear nuevo plan
  const [newPlan, setNewPlan] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    comidas: [] as Comida[],
  });
  const [newComida, setNewComida] = useState<Comida>({ tipo: "", hora: "", descripcion: "" });

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {

    const urlFetch = usuario.rol == "CLIENTE" ? 
    `http://localhost:3010/api/alimentacion?idCliente=${usuario.id}`
    : 
    "http://localhost:3010/api/alimentacion"
    try {
      const res = await fetch(
        urlFetch
      
      );
      if (res.ok) {
        setPlanes(await res.json());
      } else {
        toast({ title: "Error", description: "No se pudieron cargar los planes", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "No se pudo conectar con el servidor", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComida = () => {
    if (!newComida.tipo || !newComida.descripcion) return;
    setNewPlan({ ...newPlan, comidas: [...newPlan.comidas, newComida] });
    setNewComida({ tipo: "", hora: "", descripcion: "" });
  };

  const handleCreatePlan = async () => {
    try {
      const res = await fetch("http://localhost:3010/api/alimentacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlan),
      });
      if (res.ok) {
        toast({ title: "Plan creado correctamente" });
        fetchPlanes();
      } else {
        toast({ title: "Error", description: "No se pudo crear el plan", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "No se pudo conectar con el servidor", variant: "destructive" });
    }
  };
  
  // Nuevo manejador para eliminar un plan
  const handleDeletePlan = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este plan?")) {
      try {
        const res = await fetch(`http://localhost:3010/api/alimentacion/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast({ title: "Plan eliminado correctamente" });
          fetchPlanes(); // Vuelve a cargar la lista de planes
        } else {
          toast({ title: "Error", description: "No se pudo eliminar el plan", variant: "destructive" });
        }
      } catch {
        toast({ title: "Error de conexión", description: "No se pudo conectar con el servidor", variant: "destructive" });
      }
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-secondary">Planes de Alimentación</h1>
        {usuario.rol !== "CLIENTE" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Nuevo Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear nuevo plan</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <div>
                  <Label>Nombre</Label>
                  <Input value={newPlan.nombre} onChange={(e) => setNewPlan({ ...newPlan, nombre: e.target.value })} />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Input value={newPlan.descripcion} onChange={(e) => setNewPlan({ ...newPlan, descripcion: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Fecha inicio</Label>
                    <Input type="date" value={newPlan.fechaInicio} onChange={(e) => setNewPlan({ ...newPlan, fechaInicio: e.target.value })} />
                  </div>
                  <div>
                    <Label>Fecha fin</Label>
                    <Input type="date" value={newPlan.fechaFin} onChange={(e) => setNewPlan({ ...newPlan, fechaFin: e.target.value })} />
                  </div>
                </div>

                {/* Tabla de comidas */}
                <div className="border p-3 rounded-md">
                  <h4 className="font-semibold mb-2">Comidas</h4>
                  {newPlan.comidas.length > 0 && (
                    <ul className="mb-3 list-disc pl-4">
                      {newPlan.comidas.map((c, i) => (
                        <li key={i}>{c.tipo} - {c.hora} - {c.descripcion}</li>
                      ))}
                    </ul>
                  )}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input placeholder="Tipo" value={newComida.tipo} onChange={(e) => setNewComida({ ...newComida, tipo: e.target.value })} />
                    <Input type="time" value={newComida.hora} onChange={(e) => setNewComida({ ...newComida, hora: e.target.value })} />
                    <Input placeholder="Descripción" value={newComida.descripcion} onChange={(e) => setNewComida({ ...newComida, descripcion: e.target.value })} />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleAddComida}>Agregar comida</Button>
                </div>

                <Button className="w-full" onClick={handleCreatePlan}>Guardar Plan</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Asignar Plan a Cliente</DialogTitle>
          </DialogHeader>
          <AssignPlanDialog 
              plan={selectedPlanForAssignment}
              onClose={() => setShowAssignDialog(false)}
              onAssignSuccess={fetchPlanes}
          />
        </DialogContent>
      </Dialog>

      {/* Lista de planes existentes */}
      {isLoading ? (
        <p>Cargando...</p>
      ) : planes.length === 0 ? (
        <p>No hay planes creados</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <Apple className="h-5 w-5 text-primary" />
                <CardTitle>{plan.nombre}</CardTitle>
                <CardDescription>{plan.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Badge>{plan.comidas.length} comidas</Badge>
                <p>{plan.fechaInicio} - {plan.fechaFin}</p>
                <div className="mt-4 flex justify-end gap-2">
                    {/* Botón de eliminar */}
                    {usuario.rol !== "CLIENTE" && (
                      <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => {
                              setSelectedPlanForAssignment(plan);
                              setShowAssignDialog(true);
                          }}
                      >
                          Asignar
                      </Button>
                    )}
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeletePlan(plan.id)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alimentacion;