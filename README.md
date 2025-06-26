# ActaVeraz

ActaVeraz es una aplicación web progresiva (PWA) diseñada para que los delegados de partido puedan registrar y transmitir de forma rápida y segura los resultados de las actas de votación el día de las elecciones. La aplicación guía al usuario a través de un flujo de trabajo sencillo, utiliza IA para la extracción de datos y garantiza la integridad de la información antes de enviarla a un sistema central.

## ✨ Características Principales

- **Flujo de Trabajo Guiado**: Navegación paso a paso: Inicio de Sesión, Confirmación de Mesa, Captura de Foto, Ingreso de Datos y Confirmación final.
- **Extracción de Datos con IA**: Utiliza una herramienta de OCR para extraer automáticamente los datos de la foto del acta, minimizando errores de transcripción.
- **Validación de Datos en Tiempo Real**: El sistema realiza cálculos y validaciones al instante para resaltar discrepancias (ej. si la suma de votos de presidente y diputado no coincide).
- **Persistencia de Sesión**: Los datos se guardan localmente en el navegador, permitiendo al usuario reanudar su sesión si la aplicación se cierra inesperadamente.
- **Interfaz Limpia y Moderna**: Diseñada con ShadCN y Tailwind CSS, ofreciendo una experiencia de usuario clara y accesible.
- **API para Centralización**: Incluye un endpoint listo para enviar los datos recopilados a una aplicación de administración central.

## 🚀 Puesta en Marcha (Desarrollo Local)

Para ejecutar este proyecto en tu entorno local, sigue estos pasos.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 20 o superior)
- [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:9003`. El servidor también es accesible en tu red local, lo que te permite probarla en un dispositivo móvil visitando `http://<IP-de-tu-computadora>:9003`.

## ⚙️ Flujo de la Aplicación (Usabilidad)

1.  **Inicio de Sesión**: El usuario ingresa su Cédula de Identidad como usuario y su número de celular como contraseña. Estos deben ser habilitados previamente desde una aplicación de administración. Para pruebas, puede usar la cédula `12345678` y la contraseña `76543210`.
2.  **Ingresar Mesa**: Se introduce el número de la mesa electoral.
3.  **Verificar Datos de Mesa**: La aplicación muestra los detalles de la mesa (recinto, circunscripción, etc.) para que el usuario confirme que son correctos.
4.  **Tomar Foto del Acta**: Se solicita al usuario que tome o suba una foto clara y completa del acta de votación. Un modelo de IA procesa la imagen para extraer el texto.
5.  **Ingresar Datos del Acta**: Se presenta un formulario para ingresar los votos de cada partido, así como los votos nulos y blancos.
    - El texto extraído por la IA se puede consultar para agilizar el llenado.
    - El sistema valida en tiempo real que la suma de votos de Presidente y Diputado sea idéntica.
    - Los totales se calculan automáticamente.
6.  **Confirmación Final**: Se muestra un resumen completo de todos los datos ingresados.
7.  **Envío de Datos**: Al hacer clic en "Confirmar y Enviar", los datos se envían al endpoint `/api/submit-data` y la sesión del usuario se reinicia.

## 📡 API de Conexión

El proyecto incluye un endpoint API para facilitar la integración con un sistema de administración central.

- **Ruta**: `POST /api/submit-data`
- **Propósito**: Recibe los datos finales del acta desde la aplicación cliente.
- **Cuerpo (Body) esperado**: Un objeto JSON con la siguiente estructura:
  ```json
  {
    "mesaDetails": { ... },
    "voteData": { ... }
  }
  ```
- **Implementación Actual**: En el estado actual, el endpoint recibe los datos, los imprime en la consola del servidor y devuelve una respuesta de éxito. Está diseñado para que puedas añadir fácilmente la lógica de envío a tu propio backend o servicio.

## 📦 Despliegue

Este proyecto está preconfigurado para un despliegue sencillo en **Firebase App Hosting**.

1.  **Crea un proyecto en Firebase**: Si aún no tienes uno, ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
2.  **Instala Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```
3.  **Inicia sesión y conecta tu proyecto**:
    ```bash
    firebase login
    firebase init hosting
    ```
    Sigue los pasos y selecciona el proyecto de Firebase que creaste.
4.  **Despliega la aplicación**:
    ```bash
    firebase deploy
    ```
El archivo `apphosting.yaml` contiene la configuración básica para el despliegue.

## 🛠️ Pila Tecnológica

- **Framework**: [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Componentes**: [ShadCN UI](https://ui.shadcn.com/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Inteligencia Artificial**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Validación de Formularios**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
