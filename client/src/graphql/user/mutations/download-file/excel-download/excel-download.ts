import { gql } from "@apollo/client";

export const DOWNLOAD_EXCEL_USER = gql `
    downloadExcelByUser($id:Int!){
        downloadExcelByUser(id:$id){
            status
            message
            data{
                downloadUrl
            }
        }
    }
`;