"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MesaDetailsPage() {
  const router = useRouter();
  const { mesaDetails, isInitialized } = useAppContext();

  useEffect(() => {
    if (isInitialized && !mesaDetails) {
      router.replace("/mesa");
    }
  }, [isInitialized, mesaDetails, router]);

  if (!isInitialized || !mesaDetails) {
    return null; // Or a loading component
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Paso 2: Verificar Datos</CardTitle>
        <CardDescription>
          Confirme que los datos de la mesa son correctos antes de continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-secondary/50 border space-y-2 text-sm">
            <p><strong className="text-primary font-headline">Departamento:</strong> {mesaDetails?.departamento}</p>
            <p><strong className="text-primary font-headline">Provincia:</strong> {mesaDetails?.provincia}</p>
            <p><strong className="text-primary font-headline">Municipio:</strong> {mesaDetails?.municipio}</p>
            <p><strong className="text-primary font-headline">Circunscripción:</strong> {mesaDetails?.circunscripcion}</p>
            <p><strong className="text-primary font-headline">Recinto:</strong> {mesaDetails?.recinto}</p>
            <p><strong className="text-primary font-headline">Número de Mesa:</strong> {mesaDetails?.numeroMesa}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button onClick={() => router.push("/mesa")} variant="outline" className="h-12 font-headline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
          <Button onClick={() => router.push("/photo")} className="h-12 font-headline bg-green-600 hover:bg-green-700 text-white">
            Continuar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
