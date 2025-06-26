"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { extractActaData } from "@/ai/flows/extract-acta-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, ArrowLeft } from "lucide-react";

export default function PhotoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { photoUri, setPhotoUri, setExtractedText, mesaDetails, isInitialized } = useAppContext();
  const [preview, setPreview] = useState<string | null>(photoUri);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInitialized && !mesaDetails) {
      router.replace('/mesa');
    }
  }, [isInitialized, mesaDetails, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsePhoto = async () => {
    if (!preview) {
      toast({
        title: "Error",
        description: "Debe tomar una foto antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setPhotoUri(preview);
    
    try {
      const result = await extractActaData({ photoDataUri: preview });
      setExtractedText(result.extractedData);
      toast({
        title: "Éxito",
        description: "Datos del acta extraídos con IA. Continúe para verificar.",
      });
      router.push("/data-entry");
    } catch (error) {
      console.error("AI extraction failed:", error);
      toast({
        title: "Error de IA",
        description: "No se pudieron extraer los datos. Por favor, ingréselos manualmente.",
        variant: "destructive",
      });
       // Still navigate, but user will have to do manual entry
      router.push("/data-entry");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setPreview(null);
    setPhotoUri(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isInitialized || !mesaDetails) {
    return null; // Or a loading component
  }
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Paso 3: Foto del Acta</CardTitle>
        <CardDescription>
          Tome una foto clara y completa del acta de votación.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full aspect-video rounded-lg border-2 border-dashed flex items-center justify-center bg-secondary/30 overflow-hidden">
          {preview ? (
            <Image src={preview} alt="Vista previa del acta" layout="fill" objectFit="contain" />
          ) : (
            <div className="text-center text-muted-foreground p-4">
              <Camera className="mx-auto h-12 w-12 mb-2" />
              <p className="font-headline">Vista de Cámara (simulada)</p>
              <p className="text-xs mt-2">Asegúrate de que toda el acta quepa en el recuadro.</p>
            </div>
          )}
        </div>

        {!preview ? (
          <Button onClick={() => fileInputRef.current?.click()} className="w-full h-12 font-headline">
            <Camera className="mr-2 h-5 w-5" />
            Tomar Foto
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleRetry} variant="outline" className="h-12 font-headline">
              Reintentar
            </Button>
            <Button onClick={handleUsePhoto} disabled={isLoading} className="h-12 font-headline bg-green-600 hover:bg-green-700 text-white">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Usar esta Foto"
              )}
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <Button onClick={() => router.push("/mesa-details")} variant="ghost" className="w-full h-12 font-headline text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Detalles de Mesa
        </Button>
      </CardContent>
    </Card>
  );
}
