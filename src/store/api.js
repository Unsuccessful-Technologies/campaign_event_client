import config from "../config"

const URL = config.api_url

export default {
    LoginURL: `${URL}/auth/login`,
    TokenValidateURL: (id) => `${URL}/auth/token/valid/${id}`
}