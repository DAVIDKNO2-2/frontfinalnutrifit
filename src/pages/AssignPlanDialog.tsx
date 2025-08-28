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

interface Alimentacion {
  id: number;
  nombre: string;
}

interface AssignPlanDialogProps {
  plan: Alimentacion | null;
  onClose: () => void;
  onAssignSuccess: () => void;
}

const AssignPlanDialog = ({ plan, onClose, onAssignSuccess }: AssignPlanDialogProps) => {
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

  const handleAssignPlan = async () => {
    if (!selectedClientId || !plan) {
      toast({ title: "Error", description: "Selecciona un cliente y un plan válido", variant: "destructive" });
      return;
    }

    setIsAssigning(true);
    try {
      const res = await fetch("http://localhost:3010/api/alimentacion/asignar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: selectedClientId,
          alimentacionId: plan.id,
        }),
      });

      if (res.ok) {
        toast({ title: "Plan asignado correctamente" });
        onAssignSuccess();
        onClose();
      } else {
        toast({ title: "Error", description: "No se pudo asignar el plan", variant: "destructive" });
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

      <Button onClick={handleAssignPlan} disabled={!selectedClientId || isAssigning || !plan}>
        {isAssigning ? "Asignando..." : "Asignar Plan"}
      </Button>
    </div>
  );
};

export default AssignPlanDialog;
