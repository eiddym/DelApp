"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function MesaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setMesaDetails, isInitialized } = useAppContext();
  const [mesaNumber, setMesaNumber] = useState("");

  const handleConfirm = () => {
    if (!mesaNumber) {
      toast({
        title: "Error",
        description: "Por favor, introduce el número de mesa.",
        variant: "destructive",
      });
      return;
    }
    const newMesaDetails = {
      departamento: "La Paz",
      provincia: "Murillo",
      municipio: "La Paz",
      recinto: 'Unidad Educativa "Bolivia"',
      circunscripcion: "12",
      numeroMesa: mesaNumber,
    };
    setMesaDetails(newMesaDetails);
    toast({
      title: "Mesa Ingresada",
      description: `Por favor, confirme los detalles para la mesa ${mesaNumber}.`,
    });
    router.push("/mesa-details");
  };

  const handleReportError = () => {
    toast({
      title: "Reporte Enviado",
      description: "Se enviará un incidente al equipo de control.",
    });
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Paso 1: Ingresar Mesa</CardTitle>
        <CardDescription>
          Por favor, ingresa el número de mesa para cargar sus datos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mesaNumber" className="font-headline">Número de Mesa</Label>
            <Input
              id="mesaNumber"
              type="number"
              placeholder="Ej: 12345"
              value={mesaNumber}
              onChange={(e) => setMesaNumber(e.target.value)}
              className="h-12"
            />
          </div>
          <Button onClick={handleConfirm} className="w-full h-12 font-headline bg-green-600 hover:bg-green-700 text-white">
            Confirmar Mesa
          </Button>
          <Button
            onClick={handleReportError}
            variant="outline"
            className="w-full h-12 font-headline"
          >
            Reportar Error
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
