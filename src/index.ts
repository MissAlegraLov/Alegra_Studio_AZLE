import { Canister, query, text, update, Principal, Variant, Record, StableBTreeMap, Void, Vec, ic } from 'azle';

//Análisis del Código:
//Importaciones de Módulos de Azle:
//Canister: Es probablemente un constructor o una función que ayuda a definir y configurar el canister.
//query y update: Estas son funciones que se utilizan para definir métodos de consulta (query) y actualización (update) en el canister. Los métodos de consulta son para leer datos 
//sin modificar el estado, mientras que los métodos de actualización pueden cambiar el estado del canister.
//text: Tipo de dato utilizado para representar cadenas de texto.
//Principal: Tipo de dato que representa un identificador único en la ICP, como un usuario o un canister.
//Variant y Record: Utilizados para definir tipos de datos complejos, donde Variant es para tipos que pueden tomar diferentes formas y Record es para estructuras de datos con campos nombrados.
//StableBTreeMap: Una estructura de datos que puede ser utilizada para almacenar pares clave-valor de manera eficiente. Es probable que sea utilizada para persistir datos en el canister.
//Void: Representa la ausencia de un valor, comúnmente utilizada en funciones que no devuelven nada.
//Vec: Tipo de dato para representar arreglos o listas.
//ic: Objeto que proporciona acceso a funcionalidades específicas del entorno de ejecución del canister, como obtener el identificador del llamador.


// Definimos una Estructura de un proyecto universitario:
Se define una estructura de datos llamada UniversityProject utilizando Record de Azle. Esta estructura representa cada proyecto universitario.

const UniversityProject = Record({
    projectId: Principal,
    studentInfo: text,
    description: text,
    isValidated: Variant({
        Yes: {},
        No: {}
    })
});

//Análisis del Código:
//Definición de Estructura con Record: Se está utilizando Record para definir una estructura de datos, que es una característica común en la programación con Azle. 
//Record permite definir un conjunto de campos con sus respectivos tipos, similar a cómo se definirían las estructuras o registros en otros lenguajes de programación.
//Campos de la Estructura:
//projectId: Principal: Define un campo projectId que utiliza el tipo Principal. En el contexto de la ICP, Principal es un identificador único que puede representar usuarios, canisters u otros entes. Este campo probablemente actúa como un identificador único para cada proyecto.
//studentInfo: text: Un campo para almacenar información del estudiante, probablemente su nombre o identificador, como una cadena de texto (text).
//description: text: Un campo para la descripción del proyecto, también almacenado como texto.
//isValidated: Variant({ Yes: {}, No: {} }): Este campo utiliza Variant para representar un tipo que puede tener diferentes formas. Aquí, isValidated puede estar en uno de dos estados: Yes o No, representando si el proyecto ha sido validado o no.
//Uso de Variant para Estados: El uso de Variant es una forma efectiva de modelar estados o categorías que pueden tomar diferentes formas. En este caso, se utiliza para representar un estado binario (validado o no validado). Esto es útil en sistemas donde el estado puede cambiar y es necesario reflejarlo en la estructura de datos.
//Aplicaciones Potenciales:
        
//Esta estructura podría ser utilizada para almacenar y gestionar información sobre proyectos universitarios en un canister en la ICP.
//Los campos definidos permiten registrar información esencial sobre cada proyecto, como quién lo presenta, de qué trata y si ha cumplido con ciertos criterios o procesos de validación.


// Almacenamiento de proyectos
let projects = StableBTreeMap(Principal, UniversityProject, 0);

export default Canister({
    // Inscribir un nuevo proyecto
    enrollProject: update([text, text], Principal, (studentInfo, description) => {
        const projectId = ic.caller();
        const project = {
            projectId,
            studentInfo,
            description,
            isValidated: { No: {} }
        };
        projects.insert(projectId, project);
        return projectId;
    }),
    
//Análisis del Código
//Almacenamiento de Proyectos: let projects = StableBTreeMap(Principal, UniversityProject, 0);: Aquí se está creando un mapa estable (StableBTreeMap) para almacenar proyectos. Este mapa asocia una clave de tipo Principal (que puede representar identificadores únicos de usuarios o canisters en la ICP) con valores de tipo UniversityProject. El número 0 puede indicar una configuración inicial para el mapa.
//Definición del Canister:
//export default Canister({...}): Esta línea indica la exportación de la configuración del canister. La función Canister se utiliza para definir el comportamiento y las capacidades del canister.
//Función para Inscribir Proyectos:
//enrollProject: update([text, text], Principal, (studentInfo, description) => {...}): Esta es una función de actualización (update) llamada enrollProject.
//La función toma dos parámetros de tipo text (probablemente información del estudiante y descripción del proyecto) y devuelve un Principal (probablemente el identificador único del proyecto).
//Dentro de la función, se obtiene el identificador del llamador (ic.caller()) que actúa como el projectId.
//Se crea un objeto project con el projectId, la información del estudiante (studentInfo), la descripción (description) y un estado de validación inicializado en { No: {} } (indicando que el proyecto aún no ha sido validado).
//El proyecto se inserta en el mapa projects.
//La función devuelve el projectId, permitiendo al usuario conocer el identificador único del proyecto que acaba de inscribir.

    
    // Obtener detalles de un proyecto específico
    getProjectDetails: query([Principal], UniversityProject, (projectId) => {
        const projectOpt = projects.get(projectId);
        if ('None' in projectOpt) {
            throw new Error('Project not found');
        }
        return projectOpt.Some;
    }),

//Análisis del Código:
//Función para Obtener Detalles de un Proyecto Específico:
//getProjectDetails: query([Principal], UniversityProject, (projectId) => {...}): Esta es una función de consulta (query), lo que significa que no altera el estado del canister y se ejecuta rápidamente porque no requiere consenso en la red ICP.
//La función toma un parámetro de tipo Principal, que se espera que sea el identificador único del proyecto (projectId).
//La función devuelve un objeto de tipo UniversityProject.
//Lógica de la Función:
//const projectOpt = projects.get(projectId);: Aquí se intenta obtener el proyecto del mapa projects utilizando el projectId proporcionado. El resultado (projectOpt) es un objeto de tipo opción, lo que significa que puede contener un proyecto (Some) o ser nulo (None).
//if ('None' in projectOpt) { throw new Error('Project not found'); }: Si no se encuentra el proyecto (es decir, projectOpt es None), se lanza un error indicando que el proyecto no se encontró.
//return projectOpt.Some;: Si se encuentra el proyecto, se devuelve el proyecto (projectOpt.Some).

    
    // Validar un proyecto
    validateProject: update([Principal], Void, (projectId) => {
        const projectOpt = projects.get(projectId);
        if ('None' in projectOpt) {
            throw new Error('Project not found');
        }
        const project = projectOpt.Some;
        project.isValidated = { Yes: {} };
        projects.insert(projectId, project);
    }),
    
    //Análisis del Código: 
    //Tipo de Función: validateProject es una función de actualización (update). Esto es correcto, ya que modifica el estado del canister al validar un proyecto. Las funciones de actualización son necesarias cuando se cambia el estado del canister. 
    //Parámetros: La función toma un Principal como parámetro, lo cual es adecuado si projectId se espera que sea un identificador único del tipo Principal.  
    //Manejo de Opciones: projectOpt se obtiene del mapa projects usando get(projectId). Se verifica si projectOpt es 'None', lo cual es una buena práctica para manejar la posibilidad de que el proyecto no exista. Si no se encuentra, se lanza un error.
    //Modificación del Estado del Proyecto: Si se encuentra el proyecto, se cambia su estado a validado (project.isValidated = { Yes: {} };). Esto es consistente con la funcionalidad descrita.
    //Reinserción en el Mapa: Finalmente, el proyecto modificado se vuelve a insertar en el mapa projects. Esto es necesario para persistir los cambios en el estado del canister.


    
    // Listar todos los proyectos
    listAllProjects: query([], Vec(UniversityProject), () => {
        return projects.values();
    })
});

//Análisis del Código
//Función para Listar Todos los Proyectos:
//listAllProjects: query([], Vec(UniversityProject), () => {...}): Esta es una función de consulta (query), lo que significa que no altera el estado del canister y se ejecuta rápidamente porque no requiere consenso en la red ICP.
//La función no toma parámetros, indicado por [].
//Retorna un vector (Vec) de objetos del tipo UniversityProject.
//Lógica de la Función:
//return projects.values();: La función devuelve todos los valores almacenados en el mapa projects. Este mapa, como se define en otras partes del código, asocia identificadores únicos de tipo Principal con proyectos de tipo UniversityProject.
//Dado que la función utiliza el método .values() del mapa StableBTreeMap, se espera que devuelva una lista de todos los proyectos universitarios almacenados en el canister.

