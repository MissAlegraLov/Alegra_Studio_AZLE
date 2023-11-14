import { Canister, query, text, update, Void } from 'azle';

// Esta es una variable global que se almacena en el montón (heap)
let alegraStudioMessage = '';

export default Canister({
    // Las llamadas de consulta se completan rápidamente porque no pasan por el consenso
    getAlegraStudioMessage: query([], text, () => {
        return alegraStudioMessage;
    }),

    // Las llamadas de actualización tardan unos segundos en completarse
    // Esto se debe a que persisten los cambios de estado y pasan por el consenso
    setAlegraStudioMessage: update([text], Void, (newMessage) => {
        alegraStudioMessage = newMessage; // Este cambio será persistido
    })
});
