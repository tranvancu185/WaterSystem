import {createContext,useReducer} from 'react'
import {mqttReducer} from '../reducers/mqttReducer'
import { apiUrl } from '../context/constants'
import axios from 'axios'


export const MqttContext = createContext()

const MqttContextProvider=({ children})=>{
    //State 
    const [mqttState,dispatch] = useReducer(mqttReducer,{
        mqtts:[],
        mqttsLoading:true,
    })
    ///Get mqtt state
    const getMqtts= async()=>{
        try{
            const response = await axios.get(`${apiUrl}/mqtts`)
            if (response.data.success){
                dispatch({type:'MQTTS_LOADED_SUCCESS',payload:response.data.SimData});///// Data từ backend
            }
        } catch(error){
            return error.response.data
            ? error.response.data
            :{success:false,message:'server error'}

        }
    }
    //// Mqtt context data
    const mqttContextData ={mqttState,getMqtts}
    return (
        <MqttContext.Provider value={mqttContextData}>
            {children}
        </MqttContext.Provider>
    )
}
export default MqttContextProvider