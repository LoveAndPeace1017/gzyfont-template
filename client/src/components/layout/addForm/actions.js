import * as constant from "./actionsTypes";

export const fieldChange= ()=>({
   type: constant.FIELD_CHANGE
});

export const setInitFinished= (billType)=>({
   type: constant.SET_INIT_FINISHED,
   billType
});

export const resetInitFinished= (billType)=>({
   type: constant.RESET_INIT_FINISHED,
   billType
});

export const emptyFieldChange= ()=>({
   type: constant.EMPTY_FIELD_CHANGE
});