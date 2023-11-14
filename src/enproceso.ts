import { Canister, query, text, update, Principal, Variant, Record, StableBTreeMap, Void, Vec, ic } from 'azle';

// Estructura de un proyecto universitario
const UniversityProject = Record({
    projectId: Principal,
    studentInfo: text,
    description: text,
    isValidated: Variant({
        Yes: {},
        No: {}
    })
});

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

    // Listar todos los proyectos
    listAllProjects: query([], Vec(UniversityProject), () => {
        return projects.values();
    })
});


