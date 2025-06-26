"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Eye, Info, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";


const VOTOS_HABILITADOS = 250;
const PARTIDOS = ["Partido A", "Partido B", "Partido C"];

const voteSchema = z.object({
  votos_partido_a_p: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_partido_a_d: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_partido_b_p: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_partido_b_d: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_partido_c_p: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_partido_c_d: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_nulos: z.coerce.number().min(0, "Debe ser un número positivo"),
  votos_blancos: z.coerce.number().min(0, "Debe ser un número positivo"),
}).superRefine((data, ctx) => {
    const presVotos = data.votos_partido_a_p + data.votos_partido_b_p + data.votos_partido_c_p;
    
    const totalEmitidos = presVotos + data.votos_nulos + data.votos_blancos;

    if (totalEmitidos > VOTOS_HABILITADOS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `El total de votos emitidos (${totalEmitidos}) no puede exceder los votantes habilitados (${VOTOS_HABILITADOS}).`,
        path: ["votos_blancos"],
      });
    }
});


type VoteFormValues = z.infer<typeof voteSchema>;

export default function DataEntryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { mesaDetails, photoUri, extractedText, setVoteData, voteData, isInitialized } = useAppContext();

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      votos_partido_a_p: voteData?.presidenteVotos[0] || 0,
      votos_partido_a_d: voteData?.diputadoVotos[0] || 0,
      votos_partido_b_p: voteData?.presidenteVotos[1] || 0,
      votos_partido_b_d: voteData?.diputadoVotos[1] || 0,
      votos_partido_c_p: voteData?.presidenteVotos[2] || 0,
      votos_partido_c_d: voteData?.diputadoVotos[2] || 0,
      votos_nulos: voteData?.votosNulos || 0,
      votos_blancos: voteData?.votosBlancos || 0,
    },
  });

  const watchedValues = form.watch();

  const getNumber = (value: unknown): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const totalPresidente = getNumber(watchedValues.votos_partido_a_p) + getNumber(watchedValues.votos_partido_b_p) + getNumber(watchedValues.votos_partido_c_p);
  const totalDiputado = getNumber(watchedValues.votos_partido_a_d) + getNumber(watchedValues.votos_partido_b_d) + getNumber(watchedValues.votos_partido_c_d);
  
  const totalValidos = totalPresidente; // Votos válidos se refiere a la elección presidencial
  const totalEmitidos = totalPresidente + getNumber(watchedValues.votos_nulos) + getNumber(watchedValues.votos_blancos);
  
  const isSpecialCircunscription = mesaDetails ? mesaDetails.numeroMesa.length >= 6 : false;

  useEffect(() => {
    if (isInitialized && !photoUri) {
      router.replace('/photo');
    }
  }, [isInitialized, photoUri, router]);

  function onSubmit(data: VoteFormValues) {
    const presVotos = [data.votos_partido_a_p, data.votos_partido_b_p, data.votos_partido_c_p];
    const dipVotos = [data.votos_partido_a_d, data.votos_partido_b_d, data.votos_partido_c_d];
    
    const totalPres = presVotos.reduce((sum, v) => sum + v, 0);

    const calculatedTotalValidos = totalPres;
    const calculatedTotalEmitidos = totalPres + data.votos_nulos + data.votos_blancos;

    const finalVoteData = {
      presidenteVotos: presVotos,
      diputadoVotos: dipVotos,
      votosNulos: data.votos_nulos,
      votosBlancos: data.votos_blancos,
      totalVotosValidos: calculatedTotalValidos,
      totalVotosEmitidos: calculatedTotalEmitidos,
      votantesHabilitados: VOTOS_HABILITADOS,
      isSpecialCircunscription,
    };
    setVoteData(finalVoteData);
    toast({ title: "Datos guardados", description: "Revisa la confirmación final." });
    router.push('/confirmation');
  }
  
  if (!isInitialized || !photoUri) return null;

  const validationError = form.formState.errors.votos_blancos;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Paso 4: Ingresar Datos del Acta</CardTitle>
        <CardDescription>
          Ingrese los votos tal como aparecen en el acta. Verifique contra la foto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {extractedText && (
          <Accordion type="single" collapsible className="w-full mb-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline">Ver Texto Extraído por IA</AccordionTrigger>
              <AccordionContent className="p-4 bg-secondary/30 rounded-md border text-sm max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono">{extractedText}</pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center font-headline font-bold text-sm text-muted-foreground px-2">
            <span className="flex-1">Partido</span>
            <span className="w-20 text-center">Presidente</span>
            <span className="w-20 text-center">{isSpecialCircunscription ? 'Dip. Especial' : 'Dip. Uninominal'}</span>
          </div>

          {PARTIDOS.map((partido, index) => {
            const pKey = `votos_partido_${String.fromCharCode(97 + index)}_p` as keyof VoteFormValues;
            const dKey = `votos_partido_${String.fromCharCode(97 + index)}_d` as keyof VoteFormValues;
            return (
              <div key={partido} className="flex justify-between items-center">
                <Label htmlFor={pKey} className="flex-1 font-bold">{partido}:</Label>
                <Input {...form.register(pKey)} type="number" min="0" className="w-20 text-center h-11" />
                <Input {...form.register(dKey)} type="number" min="0" className="w-20 text-center h-11 ml-2" />
              </div>
            );
          })}
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <Label htmlFor="votos_nulos" className="flex-1 font-bold">Votos Nulos:</Label>
            <Input {...form.register('votos_nulos')} type="number" min="0" className="w-20 text-center h-11" />
          </div>
          <div className="flex justify-between items-center">
            <Label htmlFor="votos_blancos" className="flex-1 font-bold">Votos Blancos:</Label>
            <Input {...form.register('votos_blancos')} type="number" min="0" className="w-20 text-center h-11" />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
              <Label>Total Votos Presidente:</Label>
              <Input value={totalPresidente} readOnly className="w-28 text-right bg-transparent font-mono border-none" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <Label>Total Votos {isSpecialCircunscription ? 'Dip. Especial' : 'Dip. Uninominal'}:</Label>
              <Input value={totalDiputado} readOnly className="w-28 text-right bg-transparent font-mono border-none" />
            </div>
            <div className="flex justify-between items-center font-bold">
              <Label>Total Votos Válidos:</Label>
              <Input value={totalValidos} readOnly className="w-28 text-right bg-secondary/50 font-bold border-none" />
            </div>
            <div className="flex justify-between items-center font-bold">
              <Label>Total Votos Emitidos:</Label>
              <Input value={totalEmitidos} readOnly className="w-28 text-right bg-secondary/50 font-bold border-none" />
            </div>
            <div className="flex justify-between items-center font-bold">
              <Label>Votantes Habilitados:</Label>
              <Input value={VOTOS_HABILITADOS} readOnly className="w-28 text-right bg-secondary/50 font-bold border-none" />
            </div>
          </div>
          
          {validationError && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>{validationError.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="h-12 font-headline">
                    <Eye className="mr-2 h-4 w-4" /> Ver Foto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg w-full">
                  <DialogHeader>
                    <DialogTitle className="font-headline">Foto del Acta</DialogTitle>
                  </DialogHeader>
                  <div className="relative aspect-video">
                    {photoUri && <Image src={photoUri} alt="Acta" layout="fill" objectFit="contain" />}
                  </div>
                </DialogContent>
              </Dialog>
              <Button type="submit" disabled={form.formState.isSubmitting} className="h-12 font-headline bg-green-600 hover:bg-green-700 text-white">
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enviar Datos"}
              </Button>
          </div>
          <Button onClick={() => router.push("/photo")} type="button" variant="ghost" className="w-full h-12 font-headline text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
