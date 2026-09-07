export const initialState={
    user:null,
    token:null,
    loading:false,
    initializing: true,
    error:null
};

export const authReducer=(state, action)=>{
    switch (action.type) {
        case "LOGIN_START":
            return{
                ...state,
                loading:true,
                error:null
            };

            case "LOGIN_SUCCESS":
            return{
                ...state,
                user:action.payload.user,
                token:action.payload.token,
                loading:false,
                error:null
            };

            case "LOGIN_FAILURE":
            return{
                ...state,
                user:null,
                token:null,
                loading:false,
                error:action.payload.error
            };

            case "SIGNUP_START":
                return {
                    ...state,
                    loading: true,
                    error: null
                };

            case "SIGNUP_SUCCESS":
                return {
                    ...state,
                    loading: false,
                    error: null
                };

            case "SIGNUP_FAILURE":
                return {
                    ...state,
                    loading: false,
                    error: action.payload.error
                };

                 case "RESTORE_SESSION":
                return {
                    ...state,
                    user: action.payload.user,
                    token: action.payload.token,
                    loading: false,
                    initializing: false,
                    error: null,
                };

                case "RESTORE_SESSION_COMPLETE":
                return {
                    ...state,
                    initializing: false,
                };

            case "LOGOUT":
            return{
                ...state,
                user:null,
                token:null,
                loading:false,
                error:null
            };

            case "UPDATE_USER":
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };
    
        default:
            return state;
    }

};