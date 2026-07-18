
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import React from "react";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import {
    useListMyProfilesQuery,
    selectMyProfilesFromState,
    selectUsersListFromState,
} from "../../redux-v2/features/user"
import { store } from "../../redux-v2/store"

import { profilesList } from "../mock/data/profiles";

const updateTimeout = 5000;

beforeEach(() => {
    fetchMock.resetMocks();
});

const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

describe('useListMyProfilesQuery', () => {
    it('Should render a list of profiles for the current/active user', async () => {
        fetchMock.mockResponse(JSON.stringify(profilesList));
        const { result, waitForNextUpdate } = renderHook(() => useListMyProfilesQuery("56356357egd1"), { wrapper });
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
