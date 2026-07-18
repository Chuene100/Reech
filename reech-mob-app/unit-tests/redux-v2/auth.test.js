
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import React from "react";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { useLoginMutation } from "../../redux-v2/features/auth"
import { selectActiveUserFromState } from "../../redux-v2/features/activeUser"
import {
    selectAccessToken,
    selectRefreshToken,
} from "../../redux-v2/features/tokens"
import { store } from "../../redux-v2/store"

import { loginResponseData } from "../mock/data/auth";

const updateTimeout = 5000;

beforeEach(() => {
    fetchMock.resetMocks();
});

const wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

describe('useLoginMutation', () => {
    it('Should return successful login response', async () => {
        fetchMock.mockResponse(JSON.stringify(loginResponseData));
        const { result, waitForNextUpdate } = renderHook(() => useLoginMutation(undefined), { wrapper });
        const [submitLogin, initialResponse] = result.current;
        expect(initialResponse.data).toBeUndefined();
        expect(initialResponse.isLoading).toBe(false);
        act(() => {
            void submitLogin({ email: "robert@gmail.com", password: "robert" });
        });
        const loadingResponse = result.current[1];
        expect(loadingResponse.data).toBeUndefined();
        expect(loadingResponse.isLoading).toBe(true);

        await waitForNextUpdate({ timeout: updateTimeout });
        const loadedResponse = result.current[1];
        expect(loadedResponse).not.toBeUndefined();
        //console.log("loadedResponse =", loadedResponse);
        console.log("store.getState() =", store.getState());
        expect(typeof selectActiveUserFromState(store.getState().current_user)).toBe("object");
        const tokensState = store.getState().auth;
        expect(typeof selectAccessToken(tokensState)).toBe("string");
        expect(typeof selectRefreshToken(tokensState)).toBe("string");
    })


})

