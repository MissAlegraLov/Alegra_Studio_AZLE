# Alegra_Studio


Se utiliza una combinación de estructuras de datos y métodos query para gestionar y consultar información sobre proyectos universitarios en un canister desarrollado con Azle para la Internet Computer. Aquí desgloso cómo se utilizan estos elementos:
Estructura de Datos: UniversityProject

    Se define una estructura de datos llamada UniversityProject utilizando Record de Azle. Esta estructura representa cada proyecto universitario.
    La estructura UniversityProject incluye campos como projectId (identificador del proyecto), studentInfo (información del estudiante), description (descripción del proyecto) y isValidated (estado de validación del proyecto).

Almacenamiento de Proyectos: projects

    Se crea una variable projects que es un mapa estable (StableBTreeMap) para almacenar los proyectos. Este mapa asocia cada Principal (identificador único de un proyecto) con su correspondiente UniversityProject.

Métodos del Canister

    Método enrollProject (Función de Actualización):
        Este método utiliza update para inscribir un nuevo proyecto.
        La función toma información del estudiante y descripción del proyecto como argumentos y almacena un nuevo UniversityProject en el mapa projects.
        Retorna el Principal del proyecto inscrito.

    Método getProjectDetails (Función de Consulta - Query):
        Utiliza query para obtener detalles de un proyecto específico.
        Esta función de consulta accede al mapa projects para buscar un proyecto por su Principal.
        Devuelve la estructura del proyecto si existe o lanza un error si el proyecto no se encuentra.

    Método validateProject (Función de Actualización):
        Aunque este método modifica el estado de un proyecto (validándolo), es una función de actualización (update) y no una consulta (query), ya que altera el estado del canister.

    Método listAllProjects (Función de Consulta - Query):
        Utiliza query para listar todos los proyectos.
        Esta función no modifica el estado del canister y devuelve una lista de todos los UniversityProject almacenados en projects.

Conclusión Técnica

El código combina hábilmente estructuras de datos con funciones de consulta y actualización para crear un sistema eficiente de gestión de proyectos universitarios en un canister. Los métodos query (getProjectDetails y listAllProjects) son esenciales para acceder a la información almacenada sin modificarla, mientras que las funciones de actualización (enrollProject y validateProject) cambian el estado del canister. Esta combinación permite un manejo robusto y eficiente de los datos dentro del canister, aprovechando las capacidades de la plataforma Internet Computer.


__________________________


Primero, definiremos la estructura de datos de un proyecto universitario. Esta estructura incluirá detalles como el identificador del proyecto, información sobre el estudiante, descripción del proyecto, y un estado que indica si el proyecto ha sido validado o no.

En este código:

- Definimos la estructura `UniversityProject` para representar un proyecto universitario.
- `enrollProject` es una función de actualización que inscribe un nuevo proyecto.
- `getProjectDetails` es una función de consulta que devuelve los detalles de un proyecto específico.
- `validateProject` es una función de actualización que cambia el estado de un proyecto a validado.
- `listAllProjects` es una función de consulta que devuelve una lista de todos los proyectos inscritos.

Este código proporciona una base sólida para un canister que maneja proyectos universitarios, permitiendo su inscripción, consulta de detalles, validación y listado. Asegúrate de ajustar este código según las necesidades específicas de tu proyecto y el entorno en el que estás trabajando.


__________________-
proyecto sencillo 

`dfx` is the tool you will use to interact with the IC locally and on mainnet. If you don't already have it installed:

```bash
npm run dfx_install
```

Next you will want to start a replica, which is a local instance of the IC that you can deploy your canisters to:

```bash
npm run dfx_install
```

If you ever want to stop the replica:

```bash
npm run replica_stop
```

Now you can deploy your canister locally:

```bash
npm install
npm run AlegraStudio_deploy_local
```

To call the methods on your canister:

```bash
npm run AlegraStudio_call_get_message
npm run AlegraStudio_call_set_message
```

If you run the above commands and then call `npm run ALegraStudio_call_get_message` you should see:

```bash
("BIenvenido a alegra studio!")
```

Assuming you have [created a cycles wallet](https://internetcomputer.org/docs/current/developer-docs/quickstart/network-quickstart) and funded it with cycles, you can deploy to mainnet like this:

```bash
npm run AlegraStudio_deploy_mainnet
```

