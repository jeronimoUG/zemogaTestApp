/**
 * Wrapper hook to encapsulate
 * fetch functionality
 *
 * @format
 */

import { useState } from 'react';

type Api = {
    list: Function,
    pick: Function,
    add: Function,
    remove: Function,
    edit: Function
}

type useApiHook = (url: string) => {
    status: string,
    api: Api
}

const useApi: useApiHook = (url) => {
    const [status, setStatus] = useState<string>('idle');
    const api = {
        list: (filter?: any): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            let _filter = '';
            if (filter != undefined) _filter = '?' + Object.keys(filter).map(key => key + '=' + filter[key]).join('&');
            fetch(url + _filter).then(response => {
                response.json().then(data => {
                    setStatus('idle');
                    resolve(data);
                });
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        pick: (id: number): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            fetch(`${url}/${id}`).then(response => {
                response.json().then(data => {
                    setStatus('idle');
                    resolve(data);
                });
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        add: (data: any): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }).then(response => {
                response.json().then(data => {
                    setStatus('idle');
                    resolve(data);
                });
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        remove: (id: number): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            fetch(`${url}/${id}`, {
                method: 'DELETE'
            }).then(response => {
                response.json().then(data => {
                    setStatus('idle');
                    resolve(data);
                });
            }, error => {
                setStatus('idle');
                reject(error);
            });
        }),
        edit: (id: number, data: any): Promise<Array<any>> => new Promise((resolve, reject) => {
            setStatus('loading');
            fetch(`${url}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }).then(response => {
                response.json().then(data => {
                    setStatus('idle');
                    resolve(data);
                });
            }, error => {
                setStatus('idle');
                reject(error);
            });
        })
    }
    return {status, api}
}

export default useApi;