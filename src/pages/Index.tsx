import Header from "@/components/Header";
import ModuleCard from "@/components/ModuleCard";
import { Button } from "@/components/ui/button";
import { Users, Activity, Apple, Search, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-gym.jpg";

const Index = () => {

 
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-secondary to-gym-dark text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Fitness gym with equipment"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-gym-dark/80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="text-gym-orange font-semibold mb-2 tracking-wide">DESDE 2025</div>
            <h1 className="text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-red-600 drop-shadow-lg">NUTRIFIT</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Plataforma integral de fitness con entrenadores especializados,
              rutinas personalizadas y planes de alimentación diseñados para tu éxito.
            </p>
            {/* Botón "Comenzar Ahora" removido */}
            {/*
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              Comenzar Ahora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gym-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              ¿POR QUÉ ELEGIRNOS?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubre nuestros módulos especializados diseñados para llevarte al siguiente nivel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ModuleCard
              title="Entrenadores"
              description="Conecta con entrenadores certificados y crea tu perfil personalizado"
              icon={Users}
              route="/entrenadores"
            />
            
            <ModuleCard
              title="Rutinas"
              description="Rutinas de ejercicios personalizadas adaptadas a tus objetivos"
              icon={Activity}
              route="/rutinas"
              gradient={true}
            />
            
            <ModuleCard
              title="Alimentación"
              description="Planes nutricionales balanceados para complementar tu entrenamiento"
              icon={Apple}
              route="/alimentacion"
            />
            
            <ModuleCard
              title="Buscar Ejercicios"
              description="Amplia biblioteca de ejercicios organizados por categorías"
              icon={Search}
              route="/buscar-ejercicios"
            />
          </div>
        </div>
      </section>

      {/* Calculadoras */}
      <section className="py-16 bg-gym-light border-t mt-10">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          {/* IMC */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Calculadora de IMC</h3>
            <IMCCalculator />
          </div>
          {/* Calorías */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Calculadora de Calorías</h3>
            <CaloriasCalculator />
          </div>
          {/* Agua */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Calculadora de Agua</h3>
            <AguaCalculator />
          </div>
        </div>
      </section>
    </div>
  );
};

// Calculadora de IMC
import { useState } from "react";
function IMCCalculator() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  function calcularIMC(e) {
    e.preventDefault();
    setError("");
    if (!peso || !altura) {
      setError("Por favor ingresa peso y altura");
      setResultado(null);
      return;
    }
    const alturaM = parseFloat(altura) / 100;
    if (alturaM <= 0) {
      setError("Altura inválida");
      setResultado(null);
      return;
    }
    const imc = parseFloat(peso) / (alturaM * alturaM);
    setResultado(imc.toFixed(2));
  }

  return (
    <form onSubmit={calcularIMC} className="space-y-4">
      <input type="number" min="1" step="any" placeholder="Peso (kg)" value={peso} onChange={e => setPeso(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg" required />
      <input type="number" min="1" step="any" placeholder="Altura (cm)" value={altura} onChange={e => setAltura(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg" required />
      <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white text-lg font-bold hover:bg-primary/90 transition">Calcular</button>
      {error && <div className="mt-2 text-center text-lg font-semibold text-red-600 bg-red-100 rounded p-2">{error}</div>}
      {resultado && <div className="mt-2 text-center text-2xl font-bold text-white bg-primary rounded p-2">IMC: {resultado}</div>}
    </form>
  );
}

// Calculadora de Calorías (Harris-Benedict simplificada)
function CaloriasCalculator() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("masculino");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  function calcularCalorias(e) {
    e.preventDefault();
    setError("");
    if (!peso || !altura || !edad) {
      setError("Completa todos los campos");
      setResultado(null);
      return;
    }
    let calorias;
    if (sexo === "masculino") {
      calorias = 88.36 + (13.4 * parseFloat(peso)) + (4.8 * parseFloat(altura)) - (5.7 * parseFloat(edad));
    } else {
      calorias = 447.6 + (9.2 * parseFloat(peso)) + (3.1 * parseFloat(altura)) - (4.3 * parseFloat(edad));
    }
    setResultado(Math.round(calorias));
  }

  return (
    <form onSubmit={calcularCalorias} className="space-y-4">
      <input type="number" min="1" step="any" placeholder="Peso (kg)" value={peso} onChange={e => setPeso(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg" required />
      <input type="number" min="1" step="any" placeholder="Altura (cm)" value={altura} onChange={e => setAltura(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg" required />
      <input type="number" min="1" step="any" placeholder="Edad (años)" value={edad} onChange={e => setEdad(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg" required />
      <select value={sexo} onChange={e => setSexo(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg">
        <option value="masculino">Masculino</option>
        <option value="femenino">Femenino</option>
      </select>
      <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white text-lg font-bold hover:bg-primary/90 transition">Calcular</button>
      {error && <div className="mt-2 text-center text-lg font-semibold text-red-600 bg-red-100 rounded p-2">{error}</div>}
      {resultado && <div className="mt-2 text-center text-2xl font-bold text-white bg-primary rounded p-2">Calorías diarias: {resultado}</div>}
    </form>
  );
}

// Calculadora de Agua
function AguaCalculator() {
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  function calcularAgua(e) {
    e.preventDefault();
    setError("");
    if (!peso) {
      setError("Ingresa tu peso");
      setResultado(null);
      return;
    }
    // 35 ml por kg de peso
    const agua = parseFloat(peso) * 35;
    setResultado((agua / 1000).toFixed(2));
  }

  return (
    <form onSubmit={calcularAgua} className="space-y-4">
      <input type="number" min="1" step="any" placeholder="Peso (kg)" value={peso} onChange={e => setPeso(e.target.value)} className="w-full p-4 rounded-lg border-2 border-primary text-lg" required />
      <button type="submit" className="w-full py-3 rounded-lg bg-primary text-white text-lg font-bold hover:bg-primary/90 transition">Calcular</button>
      {error && <div className="mt-2 text-center text-lg font-semibold text-red-600 bg-red-100 rounded p-2">{error}</div>}
      {resultado && <div className="mt-2 text-center text-2xl font-bold text-white bg-primary rounded p-2">Agua recomendada: {resultado} L/día</div>}
    </form>
  );
}

export default Index;
