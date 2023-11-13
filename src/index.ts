import { Canister, query, text, update, Principal, Variant, Record, StableBTreeMap, Void, Vec, ic } from 'azle';

// Estructura de un proyecto universitario: Se define una estructura de datos llamada UniversityProject utilizando Record de Azle. Esta estructura representa cada proyecto universitario.
// La estructura UniversityProject incluye campos como projectId (identificador del proyecto), studentInfo (información del estudiante), description (descripción del proyecto) y isValidated
// (estado de validación del proyecto).

const UniversityProject = Record({
    projectId: Principal,
    studentInfo: text,
    description: text,
    isValidated: Variant({
        Yes: {},
        No: {}
    })
});

//

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

    // Obtener detalles de un proyecto específico
    getProjectDetails: query([Principal], UniversityProject, (projectId) => {
        const projectOpt = projects.get(projectId);
        if ('None' in projectOpt) {
            throw new Error('Project not found');
        }
        return projectOpt.Some;
    }),

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


