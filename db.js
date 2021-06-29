let usersList = [
    {
    "id": 1,
    "firstName": "Krystian",
    "lastName": "Nowak"
    },
    {
    "id": 2,
    "firstName": "Maciej",
    "lastName": "Kowalski"
    },
    {
    "id": 3,
    "firstName": "Zbigniew",
    "lastName": "Czajka"
    }
]
const LOCAL_STORAGE_USER_KEY = 'user.list';
localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(usersList));

