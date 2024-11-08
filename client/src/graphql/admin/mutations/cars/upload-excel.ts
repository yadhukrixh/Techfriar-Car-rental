import { gql } from "@apollo/client";

export const UPLOAD_EXCEL_MUTATION = gql`
    mutation excelUpload($excelFile:Upload!){
        excelUpload(excelFile:$excelFile){
            status
            message
        }
    }
`;