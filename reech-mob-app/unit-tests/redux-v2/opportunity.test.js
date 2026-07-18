
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import React from "react";
import { Provider } from "react-redux";
import { act, renderHook } from "@testing-library/react-hooks";
import fetchMock from "jest-fetch-mock";
import { useGetOpportunitysQuery, selectOpportunitiesFromState } from "../../redux-v2/features/opportunity"
import { store } from "../../redux-v2/store"

import { opportunitiesList } from "../mock/data/opportunity";
//import { loginResponseData } from "../mock/data/auth";

const updateTimeout = 5000;

beforeEach(() => {
  fetchMock.resetMocks();
});

const wrapper = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

describe('useGetOpportunitysQuery', () => {
  it('Should properly render opportunities listing query/hook', async () => {
    fetchMock.mockResponse(JSON.stringify(opportunitiesList));
    const { result, waitForNextUpdate } = renderHook(() => useGetOpportunitysQuery(undefined), { wrapper });
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

  /*
  it("Internal Server Error", async () => {
    fetchMock.mockReject(new Error("Internal Server Error"));
    const { result, waitForNextUpdate } = renderHook(() => useGetOpportunitysQuery(undefined), { wrapper });
    const initialResponse = result.current;
    expect(initialResponse.data).toBeUndefined();
    expect(initialResponse.isLoading).toBe(true);
    await waitForNextUpdate({ timeout: updateTimeout });
    const nextResponse = result.current;
    expect(nextResponse.data).toBeUndefined();
    expect(nextResponse.isLoading).toBe(false);
    expect(nextResponse.isError).toBe(true);
  });
  */

})


//TUTORIAL: Testing RTK Query with Jest
//REF: https://medium.com/@johnmcdowell0801/testing-rtk-query-with-jest-cdfa5aaf3dc1