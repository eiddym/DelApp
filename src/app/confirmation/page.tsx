"use client";

import { useEffect, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mesaDetails, voteData, resetState, isInitialized } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && (!mesaDetails || !voteData)) {
      router.replace("/mesa");
    }
  }, [isInitialized, mesaDetails, voteData, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch('/api/submit-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesaDetails, voteData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ocurrió un error en el servidor.");
      }

      toast({
        title: "Envío Exitoso",
        description: "Los datos del acta han sido enviados al servidor.",
      });

      resetState();
      router.replace("/");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudieron enviar los datos. Revisa tu conexión.";
      setSubmissionError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error de Envío',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized || !mesaDetails || !voteData) {
    return null; // or a loading skeleton
  }

  const { isSpecialCircunscription } = voteData;
  const PARTIDOS = ["Partido A", "Partido B", "Partido C"];

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-center font-headline text-2xl">Datos del Acta Cargados</CardTitle>
        <CardDescription className="text-center">
          Verifica la información final antes de enviarla. Mesa: <strong className="font-bold text-primary">{mesaDetails.numeroMesa}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-secondary/50 border space-y-2 text-sm">
            <h3 className="font-headline text-lg font-bold text-primary">Detalles de la Mesa</h3>
            <p><strong className="font-semibold">Departamento:</strong> {mesaDetails.departamento}</p>
            <p><strong className="font-semibold">Recinto:</strong> {mesaDetails.recinto}</p>
        </div>

        <div className="p-4 rounded-lg bg-secondary/50 border space-y-3 text-sm">
            <h3 className="font-headline text-lg font-bold text-primary">Votos Registrados</h3>
            
            <div>
                <p className="font-semibold">Votos Presidente:</p>
                {voteData.presidenteVotos.map((v, i) => <p key={i} className="pl-4">{PARTIDOS[i]}: <span className="font-mono">{v}</span></p>)}
            </div>

            <div>
                <p className="font-semibold">Votos {isSpecialCircunscription ? 'Dip. Especial' : 'Dip. Uninominal'}:</p>
                {voteData.diputadoVotos.map((v, i) => <p key={i} className="pl-4">{PARTIDOS[i]}: <span className="font-mono">{v}</span></p>)}
            </div>
            
            <p><strong className="font-semibold">Votos Nulos:</strong> <span className="font-mono">{voteData.votosNulos}</span></p>
            <p><strong className="font-semibold">Votos Blancos:</strong> <span className="font-mono">{voteData.votosBlancos}</span></p>

            <div className="pt-2 border-t">
                <p><strong className="font-semibold">Total Votos Válidos:</strong> <span className="font-mono">{voteData.totalVotosValidos}</span></p>
                <p><strong className="font-semibold">Total Votos Emitidos:</strong> <span className="font-mono">{voteData.totalVotosEmitidos}</span></p>
                <p><strong className="font-semibold">Votantes Habilitados:</strong> <span className="font-mono">{voteData.votantesHabilitados}</span></p>
            </div>
        </div>

        {submissionError && (
          <Alert variant="destructive">
            <AlertTitle>Error al Enviar</AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
            <Button onClick={() => router.push('/data-entry')} variant="outline" className="h-12 font-headline" disabled={isSubmitting}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            <Button onClick={handleSubmit} className="h-12 font-headline bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar y Enviar"}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
