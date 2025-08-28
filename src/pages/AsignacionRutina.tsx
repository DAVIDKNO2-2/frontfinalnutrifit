import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
}

interface Rutina {
  id: number;
  nombre: string;
}

interface AsignacionRutinaProps {
  rutina: Rutina | null;
  onClose: () => void;
  onAssignSuccess: () => void;
}

const AsignacionRutina = ({ rutina, onClose, onAssignSuccess }: AsignacionRutinaProps) => {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:3010/api/cliente/all");
      if (res.ok) {
        setClientes(await res.json());
      } else {
        toast({ title: "Error", description: "No se pudieron cargar los clientes", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "No se pudo conectar con el servidor", variant: "destructive" });
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleAssignRutina = async () => {
    if (!selectedClientId || !rutina) {
      toast({ title: "Error", description: "Selecciona un cliente y una rutina válida", variant: "destructive" });
      return;
    }

    setIsAssigning(true);
    try {
      const res = await fetch("http://localhost:3010/api/rutinas/asignar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: selectedClientId,
          rutinaId: rutina.id,
        }),
      });

      if (res.ok) {
        toast({ title: "Rutina asignada correctamente" });
        onAssignSuccess();
        onClose();
      } else {
        toast({ title: "Error", description: "No se pudo asignar la rutina", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "No se pudo conectar con el servidor", variant: "destructive" });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-4">
      {isLoadingClients ? (
        <p>Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p>No hay clientes disponibles.</p>
      ) : (
        <RadioGroup onValueChange={(value) => setSelectedClientId(Number(value))}>
          {clientes.map((cliente) => (
            <div key={cliente.id} className="flex items-center space-x-2">
              <RadioGroupItem value={String(cliente.id)} id={`cliente-${cliente.id}`} />
              <Label htmlFor={`cliente-${cliente.id}`}>{cliente.nombreCompleto} ({cliente.correoElectronico})</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      <Button onClick={handleAssignRutina} disabled={!selectedClientId || isAssigning || !rutina}>
        {isAssigning ? "Asignando..." : "Asignar Rutina"}
      </Button>
    </div>
  );
};

export default AsignacionRutina;
