import { ReactSession } from 'react-client-session';

ReactSession.setStoreType("sessionStorage");

export const setUserData = (data) => {
    ReactSession.set("sessionUser", JSON.stringify(data));
}

export const rmDataUser = () => {
    ReactSession.remove("sessionUser");
}

export const getDataUser = () => {
    const dataUser = ReactSession.get("sessionUser")
    return dataUser ? JSON.parse(dataUser) : null;
}