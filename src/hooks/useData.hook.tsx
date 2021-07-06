/**
 * Simple hook to centralize data
 * using the useApi and useCache hooks,
 * keeps a series of central states
 * and update suscribers as data flows.
 *
 * @format
 */

import { useState, useEffect } from 'react';
import useApi from './useApi.hook';
import useCache from './useCache.hook';

type Api = {
    list: (filters?: any, nonEmpty?: boolean) => Promise<Array<any>>,
    pick: (id: number) => Promise<any>,
    remove: (id: number) => Promise<any>,
    edit: (id: number, state: any) => Promise<any>,
    refetch: () => Promise<Array<any>>,
    clear: () => Promise<Array<any>>
}

type useDataHook = (dataName: string, dataInitialTranform?: Function) => {
    status: string,
    data: Array<any>,
    api: Api
}

let components: Array<Function> = [];
let data: any = {};

const useData: useDataHook = (dataName: string, dataInitialTranform?: Function) => {
    const [status, setStatus] = useState<string>('initial');
    const [, setNewComponent] = useState();
    const remoteData = useApi(`https://jsonplaceholder.typicode.com/${dataName}`);
    const localData = useCache(dataName);
    useEffect(() => {
        if (data[dataName] == undefined) data[dataName] = [];
        components.push(setNewComponent);
        return () => {
            components = components.filter(component => component !== setNewComponent);
        };
    }, []);
    const setState = (state: Array<any>) => {
        data[dataName] = state;
        components.forEach(component => {
            component(data[dataName]);
        });
        setStatus('idle');
    }
    const api: Api = {
        list: (filters?: any, nonEmpty?: boolean): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            localData.api.list(filters).then((localResponse: Array<any> | null) => {
                if (localResponse && !nonEmpty) {
                    setState(localResponse);
                    resolve(localResponse);
                } else {
                    remoteData.api.list(filters).then((remoteResponse: Array<any>) => {
                        if (dataInitialTranform != undefined) remoteResponse = dataInitialTranform(remoteResponse);
                        localData.api.override(remoteResponse).then((finalData: Array<any>) => {
                            setState(finalData);
                            resolve(finalData);
                        }, (finalError: Error) => {
                            reject(finalError);
                        });
                    }, (remoteError: Error) => {
                        reject(remoteError);
                    });
                }
            }, (localError: Error) => {
                reject(localError);
            });
        }),
        pick: (id: number): Promise<any> => new Promise((resolve, reject) => {
            setStatus('loading');
            const index = data[dataName].findIndex((entry: any) => entry.id == id);
            if (index != -1) {
                setStatus('idle');
                resolve(data[dataName][index]);
            } else {
                localData.api.pick(id).then((localResponse: any) => {
                    if (localResponse != null) {
                        setStatus('idle');
                        resolve(localResponse);
                    } else {
                        remoteData.api.pick(id).then((remoteResponse: any) => {
                            localData.api.add(remoteResponse).then((response: any) => {
                                setState([...data[dataName], response]);
                                resolve(response);
                            });
                        }, (remoteError: Error) => {
                            reject(remoteError);
                        });
                    }
                }, (localError: Error) => {
                    reject(localError);
                });
            }
        }),
        remove: (id: number): Promise<any> => new Promise((resolve, reject) => {
            setStatus('loading');
            remoteData.api.remove(id).then((remoteEntry: any) => {
                localData.api.remove(id).then((localEntry: any) => {
                    if (localEntry != null) setState(localEntry);
                    resolve(localEntry);
                }, (localError: Error) => {
                    reject(localError);
                });
            }, (remoteError: Error) => {
                reject(remoteError);
            });
        }),
        edit: (id: number, state: any): Promise<any> => new Promise((resolve, reject) => {
            setStatus('loading');
            const _data = [...data[dataName]];
            const index = _data.findIndex(entry => (entry as any).id == id);
            _data[index] = {..._data[index], ...state};
            remoteData.api.edit(id, _data[index]).then((remoteEntry: any) => {
                localData.api.edit(id, remoteEntry).then((localEntry: any) => {
                    setState(_data);
                    resolve(localEntry);
                }, (localError: Error) => {
                    reject(localError);
                });
            }, (remoteError: Error) => {
                reject(remoteError);
            });
        }),
        refetch: (): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            remoteData.api.list().then((remoteResponse: any) => {
                if (dataInitialTranform != undefined) remoteResponse = dataInitialTranform(remoteResponse);
                localData.api.override(remoteResponse).then((finalData: any) => {
                    setState(finalData);
                    resolve(finalData);
                }, (finalError: Error) => {
                    reject(finalError);
                });
            }, (remoteError: Error) => {
                reject(remoteError);
            });
        }),
        clear: (): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            localData.api.clear().then((finalData: any) => {
                setState(finalData);
                resolve(finalData);
            }, (finalError: Error) => {
                reject(finalError);
            });
        })
    }
    return {status, data: data[dataName] as Array<any>, api};
};

export default useData;