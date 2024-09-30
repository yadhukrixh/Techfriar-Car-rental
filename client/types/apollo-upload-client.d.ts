declare module 'apollo-upload-client' {
    import { ApolloLink } from '@apollo/client';
    
    interface UploadOptions {
      uri: string;
      fetch?: any;
      fetchOptions?: Record<string, any>;
      credentials?: string;
      headers?: Record<string, string>;
    }
  
    export function createUploadLink(options: UploadOptions): ApolloLink;
  }
  