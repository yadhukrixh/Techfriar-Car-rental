

// Interface fpor login form
export interface LoginFormState {
    email: string;
    password: string;
}


// interface for the admin response
export interface AdminLoginResponse {
    adminLogin: {
        success: boolean;
        message?: string;
        token?: string;
    };
}