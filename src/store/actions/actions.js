export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE = "UPDATE";
export const VISIT = "VISIT";


export function login(player) {
    return {
        type: LOGIN,
        payload: {
            player: player
        }
    }
}

export function logout() {
    return {
        type: LOGOUT,
        payload: {
            player: {}
        }
    }
}

export function update(player) {
    return {
        type: UPDATE,
        payload: {
            player: player
        }
    }
}

export function visit() {
    return {
        type: VISIT,
        payload: {
            player: {
                username: "Guest"
            }
        }
    }
}
