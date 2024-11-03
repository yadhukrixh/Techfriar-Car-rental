import { gql } from "@apollo/client";

export const DOWNLOAD_PDF_USER = gql `
    mutation downloadPdfByUser($id:Int!){
        downloadPdfByUser(id:$id){
            status
            message
            data{
                downloadUrl
            }
        }
    }
`;