
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import React from "react";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { useHomeFeedQuery, selectHomeFeedFromState } from "../../redux-v2/features/home"
import { store } from "../../redux-v2/store"

import { opportunitiesList } from "../mock/data/feeds";

const updateTimeout = 5000;

beforeEach(() => {
    fetchMock.resetMocks();
});

const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

describe('useHomeFeedQuery', () => {
    it('Should render home feed (opportunities)', async () => {
        fetchMock.mockResponse(JSON.stringify(opportunitiesList));
        const { result, waitForNextUpdate } = renderHook(() => useHomeFeedQuery({ sortField: "fieldx", sortDirection: "desc" }), { wrapper });
        expect(result.current).toBeDefined();
        const initialResponse = result.current;
        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(true);
        await waitForNextUpdate({ timeout: updateTimeout });
        const nextResponse = result.current;
        console.log("nextResponse =", nextResponse);
        expect(nextResponse.data).not.toBeUndefined();
        expect(nextResponse.isLoading).toBe(false);
        expect(nextResponse.isSuccess).toBe(true);
    })

})
