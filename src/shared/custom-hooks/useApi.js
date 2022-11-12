import {useState} from 'react';
import axios from 'axios';

export default function useApi() {
    const [progress, setProgress] = useState(0);
    const HandleProgressUpload = ({loaded, total}) => {
        let percentage = Math.floor((loaded*100)/total);
        setProgress(percentage);
        // dispatch(setUploadingVideoProgrees({id:uuidv4(), progress:percentage}))
    }
    const postRequest = ({url, data, options}) => {
        if(options)
        options.onUploadProgress = HandleProgressUpload;
        const ENDPOINT = process.env.NODE_ENV === "production" ? process.env.REACT_APP_URL_LIVE : process.env.REACT_APP_URL 
        
        return axios.post(ENDPOINT+url, data, options).then((response)=>{
            if (response && response.data) {
                return response.data;
            } else {
                return response;
            }
        })
        .catch(function (error) {
          if (error.response) {
            throw error.response.data;
          } else {
            throw error.message;
          }
        });
    }
    
    return {
        progress,
        postRequest
    }
}
