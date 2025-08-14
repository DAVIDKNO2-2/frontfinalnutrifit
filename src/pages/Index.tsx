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
            <div className="text-gym-orange font-semibold mb-2 tracking-wide">DESDE 2024</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              TRANSFORMA TU
              <br />
              <span className="text-primary">CUERPO</span>
            </h1>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Plataforma integral de fitness con entrenadores especializados,
              rutinas personalizadas y planes de alimentación diseñados para tu éxito.
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              Comenzar Ahora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
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

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-gym-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar tu transformación?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a miles de personas que ya están alcanzando sus metas fitness
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              Ver Entrenadores
            </Button>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Crear Cuenta Gratis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
