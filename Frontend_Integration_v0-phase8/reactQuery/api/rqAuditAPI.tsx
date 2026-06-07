

import { RQ_GET_AUDITS } from "./constants/rqAuditsAPIConstants";

import { rqCreateRequest } from "./rqHttpsUtils";




export const RQGetAllAudits = ({tokenData, signal}: any) => {
   // console.log("token to be pass: ",tokenData)
    return rqCreateRequest({
        api: RQ_GET_AUDITS,
        params: null,
        token: tokenData,
        signal,
    });
};

