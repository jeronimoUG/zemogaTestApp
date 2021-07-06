import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import useData from '../src/hooks/useData.hook';

const useDataMock = [{ title: 'Hello' }, { title: 'World' }];

global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
    json: () => Promise.resolve(useDataMock),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
    return {
        useAsyncStorage: jest.fn(storage => {
            return ({
                getItem: () => Promise.resolve(JSON.stringify([{ title: 'Hello' }, { title: 'World' }])),
                setItem: () => Promise.resolve()
            })
        }),
    }
});

describe('useData Hook', () => {
    it('initial state and list data', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useData('test'));
        expect(result.current).toEqual(expect.objectContaining({
            status: 'initial',
            data: undefined,
        }));
        act(() => {
            result.current.api.list();
        });
        await waitForNextUpdate();
        expect(result.current).toEqual(expect.objectContaining({
            status: 'idle',
            data: useDataMock,
        }));
    });
});