import config from "../config"

const URL = config.api_url

export default {
    LoginURL: `${URL}/auth/login`,
    JoinURL: `${URL}/auth/join`,
    EventsURL: `${URL}/events`,
    TokenValidateURL: (id) => `${URL}/auth/token/valid/${id}`
}