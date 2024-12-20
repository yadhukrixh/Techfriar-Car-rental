import { gql } from "@apollo/client";

export const DOWNLOAD_EXCEL_USER = gql `
    mutation downloadExcelByUser($id:Int!){
        downloadExcelByUser(id:$id){
            status
            message
            data{
                downloadUrl
            }
        }
    }
`;