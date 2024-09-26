import { ADMIN_LOGIN_MUTATION } from "@/graphql/admin/login-mutation";
import { AdminLoginResponse, LoginFormState } from "@/interfaces/admin";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Cookies from 'js-cookie';

export class AdminLoginService {
    private client: ApolloClient<NormalizedCacheObject>;
    private router: AppRouterInstance;
    private setError: (error: string | null) => void;
    private setFormState: (state: LoginFormState) => void;
    private formState: LoginFormState;
  
    constructor(
      client: ApolloClient<NormalizedCacheObject>,
      router: AppRouterInstance,
      setError: (error: string | null) => void,
      setFormState: (state: LoginFormState) => void,
      formState: LoginFormState
    ) {
      this.client = client;
      this.router = router;
      this.setError = setError;
      this.setFormState = setFormState;
      this.formState = formState;
    }
  
    // Method to handle input changes
    public handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      this.setFormState({
        ...this.formState,
        [name]: value,
      });
    };
  
    // Method to handle form submission
    public handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        this.setError(null);
        try {
          const { data } = await this.client.mutate<AdminLoginResponse>({
            mutation: ADMIN_LOGIN_MUTATION,
            variables: {
              email: this.formState.email,
              password: this.formState.password,
            },
          });
    
          if (data?.adminLogin.success) {
            
            Cookies.set('adminToken', data.adminLogin.token || '', { expires: 7, path: '/' });

            localStorage.setItem('adminToken', data.adminLogin.token || '');
            this.router.push('/admin/dashboard');
          } else {
            this.setError(data?.adminLogin.message || 'Invalid email or password');
          }
        } catch (error: any) {
          this.setError(error.message || 'Error logging in. Please try again.');
        }
      };
  }