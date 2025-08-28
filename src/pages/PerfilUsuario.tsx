import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Estado inicial del formulario con todos los campos vacíos
const initialState = {
  fotoPerfil: "",
  genero: "",
  edad: "",
  telefono: "",
  ciudad: "",
  pais: "",
  alturaCm: "",
  pesoActualKg: "",
  pesoObjetivoKg: "",
  condicionesMedicas: "",
  alergias: "",
  nivelActividad: "",
  objetivoGeneral: "",
  tipoAlimentacion: "",
  alimentosPreferidos: "",
  alimentosNoPreferidos: "",
  restriccionesDieteticas: "",
  plan: "",
};

const PerfilUsuario = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Estados para gestionar el componente
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialState);
  const [perfil, setPerfil] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileFetched, setIsProfileFetched] = useState(false);

  // Obtener el usuario de localStorage al inicio
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  // Función para cargar los datos del perfil desde el backend
  const fetchPerfil = useCallback(async () => {
    if (!usuario?.id) {
      setIsLoading(false);
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3010/api/cliente/usuario/${usuario.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setPerfil(data);
        setForm(data);
      } else if (res.status === 404) {
        setPerfil(null);
        toast({
          title: "Bienvenido",
          description: "Completa tu perfil para empezar.",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsProfileFetched(true);
    }
  }, [usuario?.id, navigate, toast]);

  // Ejecuta la carga del perfil al montar el componente o cuando el usuario cambia
  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario?.id) {
      toast({
        title: "Error",
        description: "No hay usuario logueado.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cleanForm = {};
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          if (
            ["edad", "alturaCm", "pesoActualKg", "pesoObjetivoKg"].includes(key)
          ) {
            cleanForm[key] = Number(value);
          } else {
            cleanForm[key] = value;
          }
        }
      });
      cleanForm.usuarioId = Number(usuario.id);

      const method = perfil ? "PUT" : "POST";
      const url = perfil
        ? `http://localhost:3010/api/clientes/${perfil.id}`
        : "http://localhost:3010/api/clientes";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanForm),
      });

      if (res.ok) {
        const data = await res.json();
        setPerfil(data);
        setForm(data);
        setShowForm(false);
        toast({ title: "Perfil guardado correctamente." });
      } else {
        const errorMsg = await res.text();
        toast({
          title: "Error",
          description: errorMsg || "No se pudo guardar el perfil.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor.",
        variant: "destructive",
      });
    }
  };

  // Función para mostrar el formulario de edición
  const handleEditClick = () => {
    setForm(perfil);
    setShowForm(true);
  };

  if (isLoading || !isProfileFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  const FormCliente = () => {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Panel Izquierdo - Información de Perfil */}
          <div className="md:w-1/4 p-8 bg-gray-50 flex flex-col items-center border-r border-gray-200">
            <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden shadow-lg mb-4">
              {perfil?.fotoPerfil ? (
                <img
                  src={perfil.fotoPerfil}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl text-gray-400">👤</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {perfil?.nombreCompleto || "Usuario"}
            </h2>
            <p className="text-gray-500 text-center">{usuario?.correo}</p>
            <div className="mt-8 w-full flex flex-col gap-4">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-transform"
                onClick={handleEditClick}
              >
                Editar Perfil
              </Button>
              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-xl transition-transform"
                onClick={async () => {
                  localStorage.removeItem("usuario");
                  try {
                    await fetch("http://localhost:3010/api/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                  } catch (error) {
                    // continue with local logout regardless of backend error
                  }
                  navigate("/");
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Panel Derecho - Detalles del Perfil */}
          <div className="md:w-3/4 p-8">
            {perfil && !showForm ? (
              <div className="space-y-8">
                {/* Sección de Información de Contacto */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Teléfono
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.telefono}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Ciudad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.ciudad}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          País
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.pais}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          E-mail
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{usuario.correo}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sección de Medidas Físicas */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Medidas Físicas y Objetivos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Edad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.edad}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Género
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.genero}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Altura
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.alturaCm} cm
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Peso Actual
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.pesoActualKg} kg
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Peso Objetivo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.pesoObjetivoKg} kg
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Nivel Actividad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.nivelActividad}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Objetivo General
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.objetivoGeneral}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.plan}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sección de Dieta y Salud */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Dieta y Salud
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Tipo de Alimentación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.tipoAlimentacion}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Alimentos Preferidos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.alimentosPreferidos}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          No Preferidos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.alimentosNoPreferidos}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Restricciones
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.restriccionesDieteticas}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Condiciones Médicas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.condicionesMedicas}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Alergias
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.alergias}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="flex flex-col gap-4 bg-gray-50 rounded-xl p-4 shadow-inner">
                  {/* Formulario con todos los campos */}
                  <div>
                    <Label>Foto de Perfil (URL)</Label>
                    <Input
                      name="fotoPerfil"
                      value={form.fotoPerfil}
                      onChange={handleChange}
                      placeholder="URL de la foto"
                      className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Género</Label>
                      <select
                        name="genero"
                        value={form.genero}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600"
                      >
                        <option value="">Selecciona</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <Label>Edad</Label>
                      <Input
                        name="edad"
                        value={form.edad}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Ciudad</Label>
                      <Input
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>País</Label>
                      <Input
                        name="pais"
                        value={form.pais}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Altura (cm)</Label>
                      <Input
                        name="alturaCm"
                        value={form.alturaCm}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Peso Actual (kg)</Label>
                      <Input
                        name="pesoActualKg"
                        value={form.pesoActualKg}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Peso Objetivo (kg)</Label>
                      <Input
                        name="pesoObjetivoKg"
                        value={form.pesoObjetivoKg}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Condiciones Médicas</Label>
                      <textarea
                        name="condicionesMedicas"
                        value={form.condicionesMedicas}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600 resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Alergias</Label>
                      <textarea
                        name="alergias"
                        value={form.alergias}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nivel de Actividad</Label>
                      <select
                        name="nivelActividad"
                        value={form.nivelActividad}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600"
                      >
                        <option value="">Selecciona</option>
                        <option value="Bajo">Bulo</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                    <div>
                      <Label>Objetivo General</Label>
                      <Input
                        name="objetivoGeneral"
                        value={form.objetivoGeneral}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentación</Label>
                      <Input
                        name="tipoAlimentacion"
                        value={form.tipoAlimentacion}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Alimentos Preferidos</Label>
                      <Input
                        name="alimentosPreferidos"
                        value={form.alimentosPreferidos}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Alimentos No Preferidos</Label>
                      <Input
                        name="alimentosNoPreferidos"
                        value={form.alimentosNoPreferidos}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Restricciones Dietéticas</Label>
                      <Input
                        name="restriccionesDieteticas"
                        value={form.restriccionesDieteticas}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Plan</Label>
                    <Input
                      name="plan"
                      value={form.plan}
                      onChange={handleChange}
                      className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl shadow-lg transition-transform"
                >
                  Guardar Perfil
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FormEntrenador = () => {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
        <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Panel Izquierdo - Información de Perfil */}
          <div className="md:w-1/4 p-8 bg-gray-50 flex flex-col items-center border-r border-gray-200">
            <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden shadow-lg mb-4">
              {perfil?.fotoPerfil ? (
                <img
                  src={perfil.fotoPerfil}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl text-gray-400">👤</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {perfil?.nombreCompleto || "Usuario"}{" "}
            </h2>
            <p className="text-gray-500 text-center">{usuario?.correo}</p>
            <div className="mt-8 w-full flex flex-col gap-4">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-transform"
                onClick={handleEditClick}
              >
                Editar Perfil
              </Button>
              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-xl transition-transform"
                onClick={async () => {
                  localStorage.removeItem("usuario");
                  try {
                    await fetch("http://localhost:3010/api/logout", {
                      method: "POST",
                      credentials: "include",
                    });
                  } catch (error) {
                    // continue with local logout regardless of backend error
                  }
                  navigate("/");
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Panel Derecho - Detalles del Perfil */}
          <div className="md:w-3/4 p-8">
            {perfil && !showForm ? (
              <div className="space-y-8">
                {/* Sección de Información de Contacto */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Información de Contacto entrenador
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Teléfono
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.telefono}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Ciudad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.ciudad}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          País
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.pais}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          E-mail
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{usuario.correo}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sección de Medidas Físicas */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Medidas Físicas y Objetivos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Edad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.edad}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Género
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.genero}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Altura
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.alturaCm} cm
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Peso Actual
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.pesoActualKg} kg
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Peso Objetivo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.pesoObjetivoKg} kg
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Nivel Actividad
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.nivelActividad}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Objetivo General
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.objetivoGeneral}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Plan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.plan}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sección de Dieta y Salud */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Dieta y Salud
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Tipo de Alimentación
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.tipoAlimentacion}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Alimentos Preferidos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.alimentosPreferidos}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          No Preferidos
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.alimentosNoPreferidos}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Restricciones
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.restriccionesDieteticas}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Condiciones Médicas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">
                          {perfil.condicionesMedicas}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-semibold text-gray-500 uppercase">
                          Alergias
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-lg font-medium">{perfil.alergias}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="flex flex-col gap-4 bg-gray-50 rounded-xl p-4 shadow-inner">
                  {/* Formulario con todos los campos */}
                  <div>
                    <Label>Foto de Perfil (URL)</Label>
                    <Input
                      name="fotoPerfil"
                      value={form.fotoPerfil}
                      onChange={handleChange}
                      placeholder="URL de la foto"
                      className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Género</Label>
                      <select
                        name="genero"
                        value={form.genero}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600"
                      >
                        <option value="">Selecciona</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div>
                      <Label>Edad</Label>
                      <Input
                        name="edad"
                        value={form.edad}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Ciudad</Label>
                      <Input
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>País</Label>
                      <Input
                        name="pais"
                        value={form.pais}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Altura (cm)</Label>
                      <Input
                        name="alturaCm"
                        value={form.alturaCm}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Peso Actual (kg)</Label>
                      <Input
                        name="pesoActualKg"
                        value={form.pesoActualKg}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Peso Objetivo (kg)</Label>
                      <Input
                        name="pesoObjetivoKg"
                        value={form.pesoObjetivoKg}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Condiciones Médicas</Label>
                      <textarea
                        name="condicionesMedicas"
                        value={form.condicionesMedicas}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600 resize-none"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Alergias</Label>
                      <textarea
                        name="alergias"
                        value={form.alergias}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nivel de Actividad</Label>
                      <select
                        name="nivelActividad"
                        value={form.nivelActividad}
                        onChange={handleChange}
                        className="rounded-lg bg-white border border-gray-300 px-3 py-2 w-full focus:ring-2 focus:ring-red-600"
                      >
                        <option value="">Selecciona</option>
                        <option value="Bajo">Bulo</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>
                    <div>
                      <Label>Objetivo General</Label>
                      <Input
                        name="objetivoGeneral"
                        value={form.objetivoGeneral}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Alimentación</Label>
                      <Input
                        name="tipoAlimentacion"
                        value={form.tipoAlimentacion}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Alimentos Preferidos</Label>
                      <Input
                        name="alimentosPreferidos"
                        value={form.alimentosPreferidos}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Alimentos No Preferidos</Label>
                      <Input
                        name="alimentosNoPreferidos"
                        value={form.alimentosNoPreferidos}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <Label>Restricciones Dietéticas</Label>
                      <Input
                        name="restriccionesDieteticas"
                        value={form.restriccionesDieteticas}
                        onChange={handleChange}
                        className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Plan</Label>
                    <Input
                      name="plan"
                      value={form.plan}
                      onChange={handleChange}
                      className="rounded-lg bg-white focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl shadow-lg transition-transform"
                >
                  Guardar Perfil
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <FormCliente />
      {/* { usuario?.rol === 'ENTRENADOR' ? <FormEntrenador /> :  <FormCliente /> } */}
    </div>
  );
};

export default PerfilUsuario;
