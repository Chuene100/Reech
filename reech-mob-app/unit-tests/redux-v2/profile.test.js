
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import React from "react";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import {
    useListApplicationsByProfileQuery,
    selectPosterProfilesFromState,
    selectSeekerProfilesFromState,
    selectApplicationsByProfileFromState,
} from "../../redux-v2/features/profile"
import { store } from "../../redux-v2/store"

import { applications } from "../mock/data/opportunity";

const updateTimeout = 5000;

beforeEach(() => {
    fetchMock.resetMocks();
});

const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

describe('useListApplicationsByProfileQuery', () => {
    it('Should render a list of job applications submitted by a specific profile', async () => {
        fetchMock.mockResponse(JSON.stringify(applications));
        const { result, waitForNextUpdate } = renderHook(() => useListApplicationsByProfileQuery("21747d83d22a3e34c331"), { wrapper });
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
