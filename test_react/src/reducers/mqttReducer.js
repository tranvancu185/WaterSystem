export const mqttReducer = (state,action) =>
    {const {type,payload}=action;
    switch(type){
        case "MQTTS_LOADED_SUCCESS":
            return {
                ...state,
                mqtts: payload,
                mqttsLoading: false

            }
        default:
            return state

    }}