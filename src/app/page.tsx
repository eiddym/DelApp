"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Logo } from "@/components/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // **Simulación de autenticación**
    // En una aplicación real, esto validaría las credenciales
    // contra un servicio de backend donde el administrador habilita a los usuarios.
    if (cedula === "12345678" && celular === "76543210") {
      setError("");
      router.push("/mesa");
    } else {
      setError("Cédula o número de celular incorrectos o no habilitados.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <Logo className="h-20 w-20" />
          </div>
          <CardTitle className="text-3xl font-headline">ActaVeraz</CardTitle>
          <CardDescription>Iniciar Sesión</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cedula" className="font-headline font-semibold">Cédula de Identidad</Label>
                <Input
                  id="cedula"
                  type="number"
                  placeholder="Tu número de cédula"
                  required
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular" className="font-headline font-semibold">Contraseña (Nro. Celular)</Label>
                <Input
                  id="celular"
                  type="password"
                  placeholder="Tu número de celular"
                  required
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="h-12"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full h-12 text-lg font-bold font-headline">
                Entrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="mt-8 text-sm text-muted-foreground">
        Desarrollado por <span className="font-semibold text-primary">Tu Nombre Aquí</span>
      </p>
    </div>
  );
}
