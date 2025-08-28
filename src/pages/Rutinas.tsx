import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Clock, Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AsignacionRutina from "./AsignacionRutina";

// Definimos las interfaces para los tipos de datos
interface Ejercicio {
  id?: number; // Hacemos el ID opcional para los ejercicios nuevos
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
  // Estados para la lista de rutinas, el estado de carga y el modal de creación
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRutina, setSelectedRutina] = useState<Rutina | null>(null);
  // Nuevos estados para la asignación
  const [showAssignRutinaDialog, setShowAssignRutinaDialog] = useState(false);
  const [selectedRutinaForAssignment, setSelectedRutinaForAssignment] = useState<Rutina | null>(null);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  // Estado para el formulario de la nueva rutina
  const [newRutinaForm, setNewRutinaForm] = useState({
    nombre: "",
    descripcion: "",
    ejercicios: [{ nombre: "", repeticiones: "", instrucciones: "" }]
  });

  // Estado para el formulario de edición
  const [editRutinaForm, setEditRutinaForm] = useState({
    nombre: "",
    descripcion: "",
    ejercicios: [] as Ejercicio[]
  });

  // Función para obtener las rutinas de la API
  const fetchRutinas = async () => {
    try {
      const response = await fetch("http://localhost:3010/api/rutinas");
      if (response.ok) {
        const data = await response.json();
        setRutinas(data);
      }
    } catch (error) {
      console.error("Failed to fetch routines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRutinas();
  }, []);

  // Función para manejar el envío del formulario de creación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validación del nombre de la rutina
    if (!newRutinaForm.nombre.trim()) {
      alert("El nombre de la rutina es requerido.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3010/api/rutinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRutinaForm),
      });

      if (response.ok) {
        // Si la creación fue exitosa, cerramos el modal y actualizamos la lista
        setIsModalOpen(false);
        setNewRutinaForm({
          nombre: "",
          descripcion: "",
          ejercicios: [{ nombre: "", repeticiones: "", instrucciones: "" }]
        });
        fetchRutinas(); // Refetch para ver la nueva rutina
      } else {
        const errorData = await response.json();
        console.error("Failed to create routine:", errorData);
        alert(`Error al crear la rutina: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Funciones para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRutinaForm({ ...newRutinaForm, [name]: value });
  };

  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const newExercises = [...newRutinaForm.ejercicios];
    newExercises[index] = { ...newExercises[index], [name]: value };
    setNewRutinaForm({ ...newRutinaForm, ejercicios: newExercises });
  };

  const addExercise = () => {
    setNewRutinaForm({
      ...newRutinaForm,
      ejercicios: [...newRutinaForm.ejercicios, { nombre: "", repeticiones: "", instrucciones: "" }]
    });
  };

  const removeExercise = (index) => {
    const newExercises = newRutinaForm.ejercicios.filter((_, i) => i !== index);
    setNewRutinaForm({ ...newRutinaForm, ejercicios: newExercises });
  };

  // ---- Lógica para editar y eliminar rutinas ----
  
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta rutina?")) {
      try {
        const response = await fetch(`http://localhost:3010/api/rutinas/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchRutinas(); // Actualiza la lista
        } else {
          console.error("Failed to delete routine:", await response.json());
          alert("Error al eliminar la rutina.");
        }
      } catch (error) {
        console.error("Failed to delete routine:", error);
        alert("Error de conexión. Intenta de nuevo.");
      }
    }
  };

  const openEditModal = (rutina: Rutina) => {
    setSelectedRutina(rutina);
    // Clonar los datos para poder editarlos sin afectar el estado original
    setEditRutinaForm({
      nombre: rutina.nombre,
      descripcion: rutina.descripcion || "",
      ejercicios: rutina.ejercicios
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditRutinaForm({ ...editRutinaForm, [name]: value });
  };

  const handleEditExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const newExercises = [...editRutinaForm.ejercicios];
    newExercises[index] = { ...newExercises[index], [name]: value };
    setEditRutinaForm({ ...editRutinaForm, ejercicios: newExercises });
  };

  const addEditExercise = () => {
    setEditRutinaForm({
      ...editRutinaForm,
      ejercicios: [...editRutinaForm.ejercicios, { nombre: "", repeticiones: "", instrucciones: "" }]
    });
  };

  const removeEditExercise = (index) => {
    const newExercises = editRutinaForm.ejercicios.filter((_, i) => i !== index);
    setEditRutinaForm({ ...editRutinaForm, ejercicios: newExercises });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedRutina) return;

    setIsSubmitting(true);
    
    // Simple validación del nombre de la rutina
    if (!editRutinaForm.nombre.trim()) {
      alert("El nombre de la rutina es requerido.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3010/api/rutinas/${selectedRutina.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editRutinaForm),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        setSelectedRutina(null);
        fetchRutinas(); // Actualiza la lista con los cambios
      } else {
        const errorData = await response.json();
        console.error("Failed to update routine:", errorData);
        alert(`Error al actualizar la rutina: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to update form:", error);
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // ---- Fin de la lógica de edición y eliminación ----


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Rutinas de Ejercicio</h1>
          {/* Botón que activa el modal de creación */}
          {usuario.rol !== "CLIENTE" && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Crear Rutina
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Rutina</DialogTitle>
                  <DialogDescription>
                    Completa los campos para añadir una nueva rutina de ejercicios.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Rutina</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={newRutinaForm.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej. Rutina de Pecho y Biceps"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      value={newRutinaForm.descripcion}
                      onChange={handleInputChange}
                      placeholder="Una breve descripción de la rutina."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Ejercicios</h3>
                      <Button type="button" onClick={addExercise} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Añadir Ejercicio
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {newRutinaForm.ejercicios.map((ejercicio, index) => (
                        <Card key={index}>
                          <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-md font-medium">Ejercicio #{index + 1}</h4>
                              {newRutinaForm.ejercicios.length > 1 && (
                                <Button type="button" onClick={() => removeExercise(index)} variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`nombre-${index}`}>Nombre</Label>
                              <Input
                                id={`nombre-${index}`}
                                name="nombre"
                                value={ejercicio.nombre}
                                onChange={(e) => handleExerciseChange(index, e)}
                                placeholder="Ej. Sentadilla"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`repeticiones-${index}`}>Repeticiones</Label>
                              <Input
                                id={`repeticiones-${index}`}
                                name="repeticiones"
                                value={ejercicio.repeticiones}
                                onChange={(e) => handleExerciseChange(index, e)}
                                placeholder="Ej. 4 series de 10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`instrucciones-${index}`}>Instrucciones</Label>
                              <Textarea
                                id={`instrucciones-${index}`}
                                name="instrucciones"
                                value={ejercicio.instrucciones}
                                onChange={(e) => handleExerciseChange(index, e)}
                                placeholder="Ej. Mantener la espalda recta."
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creando..." : "Crear Rutina"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-neutral-200 dark:bg-neutral-800">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rutinas.length === 0 ? (
          <Card className="text-center p-8 bg-neutral-100 dark:bg-neutral-800">
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
              <Card key={rutina.id} className="hover:shadow-lg transition-all duration-300 bg-neutral-100 dark:bg-neutral-800">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-500" />
                      <CardTitle className="text-xl">{rutina.nombre}</CardTitle>
                    </div>
                    {/* Botones de edición y eliminación */}
                    <div className="flex gap-2">
                      {usuario.rol !== "CLIENTE" && (
                        <Button onClick={() => {
                            setSelectedRutinaForAssignment(rutina);
                            setShowAssignRutinaDialog(true);
                        }} variant="outline" size="icon" className="h-8 w-8 text-neutral-500 hover:text-green-500">
                          Asignar
                        </Button>
                      )}
                      <Button onClick={() => openEditModal(rutina)} variant="outline" size="icon" className="h-8 w-8 text-neutral-500 hover:text-indigo-500">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(rutina.id)} variant="outline" size="icon" className="h-8 w-8 text-neutral-500 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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

        {/* Modal de edición */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Rutina</DialogTitle>
                <DialogDescription>
                  Modifica los campos para actualizar esta rutina.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre de la Rutina</Label>
                  <Input
                    id="edit-nombre"
                    name="nombre"
                    value={editRutinaForm.nombre}
                    onChange={handleEditInputChange}
                    placeholder="Ej. Rutina de Pecho y Biceps"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descripcion">Descripción</Label>
                  <Textarea
                    id="edit-descripcion"
                    name="descripcion"
                    value={editRutinaForm.descripcion}
                    onChange={handleEditInputChange}
                    placeholder="Una breve descripción de la rutina."
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Ejercicios</h3>
                    <Button type="button" onClick={addEditExercise} variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Añadir Ejercicio
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {editRutinaForm.ejercicios.map((ejercicio, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-medium">Ejercicio #{index + 1}</h4>
                            {editRutinaForm.ejercicios.length > 1 && (
                              <Button type="button" onClick={() => removeEditExercise(index)} variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-nombre-${index}`}>Nombre</Label>
                            <Input
                              id={`edit-nombre-${index}`}
                              name="nombre"
                              value={ejercicio.nombre}
                              onChange={(e) => handleEditExerciseChange(index, e)}
                              placeholder="Ej. Sentadilla"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-repeticiones-${index}`}>Repeticiones</Label>
                            <Input
                              id={`edit-repeticiones-${index}`}
                              name="repeticiones"
                              value={ejercicio.repeticiones}
                              onChange={(e) => handleEditExerciseChange(index, e)}
                              placeholder="Ej. 4 series de 10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-instrucciones-${index}`}>Instrucciones</Label>
                            <Textarea
                              id={`edit-instrucciones-${index}`}
                              name="instrucciones"
                              value={ejercicio.instrucciones}
                              onChange={(e) => handleEditExerciseChange(index, e)}
                              placeholder="Ej. Mantener la espalda recta."
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Actualizando..." : "Actualizar Rutina"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        {/* Assignment Dialog for Rutinas */}
        <Dialog open={showAssignRutinaDialog} onOpenChange={setShowAssignRutinaDialog}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Asignar Rutina a Cliente</DialogTitle>
              </DialogHeader>
              <AsignacionRutina 
                  rutina={selectedRutinaForAssignment}
                  onClose={() => setShowAssignRutinaDialog(false)}
                  onAssignSuccess={fetchRutinas}
              />
            </DialogContent>
          </Dialog>
      </div>
    </div>
  );
};

export default Rutinas;