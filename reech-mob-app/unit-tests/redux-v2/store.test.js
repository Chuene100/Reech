import { store } from '../../redux-v2/store'
import {
	rememberCredentials, getExistingUserCredentials
} from "../../redux-v2/features/tokens";
import {
	rememberActiveUSer, getExistingActiveUser
} from "../../redux-v2/features/activeUser";

describe('Root redux state tests', () => {
	console.log("store.getState() =", store.getState());
	it('Should initially set tokens to an empty object', () => {
		const reducerPath = store.getState().api.config.reducerPath
		expect(reducerPath).toBe("api")

		//initially load previous user tokens from async storage
		const loadSavedCredentials = () => {
			getExistingUserCredentials().then((previous) => {
				store.dispatch(rememberCredentials(previous))
			})
		};
		loadSavedCredentials()

		//TODO: initially load previous user details from async storage
		const loadSavedActiveUSer = () => {
			getExistingActiveUser().then((previous) => {
				store.dispatch(rememberActiveUSer(previous))
			})
		};
		loadSavedActiveUSer()
	})
})
