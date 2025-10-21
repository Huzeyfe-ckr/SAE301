import {getRequest} from "../lib/api-request";

let UserData = {};

let fakeUsers = [
    {
        id: 1,
        username: "johndoe",
        email: "johndoe@example.com"
    },
    {
        id: 2,
        username: "janedoe",
        email: "janedoe@example.com"
    }
];

UserData.fetch = async function() {
    let data = await getRequest('/users');
    return data == false ? fakeUsers : data;
};
UserData.fetchAll = async function(id) {
    let data = await getRequest(`/users/${id}`);
    return data == false ? fakeUsers.find(user => user.id === id) : data;
};

export { UserData };
