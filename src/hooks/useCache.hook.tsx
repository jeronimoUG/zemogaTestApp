/**
 * Wrapper hook to encapsulate
 * Async Storage functionality
 * and serve it as a simple cache.
 *
 * @format
 */

import { useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

type Api = {
    list: Function,
    pick: Function,
    add: Function,
    remove: Function,
    edit: Function,
    override: Function,
    clear: Function
}

type useCacheHook = (name: string) => {
    status: string,
    api: Api
}

const useCache: useCacheHook = (name) => {
    const [status, setStatus] = useState<string>('idle');
    const storage = useAsyncStorage(`@${name}`);
    const api = {
        list: (filters?: any): Promise<Array<any> | null> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.getItem().then(response => {
                let data: Array<any> | null = null;
                if (response != null) {
                    data = JSON.parse(response) as Array<any>;
                    if (filters != undefined) {
                        data = data.filter(entry => {
                            return Object.keys(filters).every(filter => {
                                return filters[filter] === entry[filter]    
                            });
                        });
                    }
                }
                setStatus('idle');
                resolve(data);            
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        pick: (id: number): Promise<Array<any> | null> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.getItem().then(response => {
                let data: Array<any> = [];
                if (response != null) data = JSON.parse(response);
                let item = null;
                const index = data.findIndex(entry => (entry as any).id == id);
                if (index != -1) item = data[index];
                setStatus('idle');
                resolve(item);            
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        add: (data: any): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.getItem().then(response => {
                let _data: Array<any> = [];
                if (response != null) _data = JSON.parse(response);
                _data.push(data);
                storage.setItem(JSON.stringify(_data)).then(response => {
                    setStatus('idle');
                    resolve(data);
                }, error => {
                    setStatus('idle');
                    reject(error);
                })          
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        remove: (id: number): Promise<Array<any> | null> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.getItem().then(response => {
                let data: Array<any> = [];
                if (response != null) data = JSON.parse(response);
                const index = data.findIndex(entry => (entry as any).id == id);
                if (index != -1) {
                    data.splice(index, 1);
                    storage.setItem(JSON.stringify(data)).then(response => {
                        setStatus('idle');
                        resolve(data);
                    }, error => {
                        setStatus('idle');
                        reject(error);
                    })  
                } else {
                    setStatus('idle');
                    resolve(null);
                }    
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        edit: (id: number, data: any): Promise<Array<any> | null> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.getItem().then(response => {
                let _data: Array<any> = [];
                if (response != null) _data = JSON.parse(response);
                const index = _data.findIndex(entry => (entry as any).id == id);
                if (index != -1) {
                    _data[index] = {..._data[index], ...data};
                    storage.setItem(JSON.stringify(_data)).then(response => {
                        setStatus('idle');
                        resolve(_data[index]);
                    }, error => {
                        setStatus('idle');
                        reject(error);
                    })  
                } else {
                    setStatus('idle');
                    resolve(null);
                }         
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        override: (data: any): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.setItem(JSON.stringify(data)).then(response => {
                setStatus('idle');
                resolve(data);
            }, error => {
                setStatus('idle');
                reject(error);
            }) 
        }),
        clear: (): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            storage.setItem(JSON.stringify([])).then(response => {
                setStatus('idle');
                resolve([]);
            }, error => {
                setStatus('idle');
                reject(error);
            })
        })
    }
    return {status, api}
}

export default useCache;