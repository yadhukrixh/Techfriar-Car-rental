import { DOWNLOAD_PDF_USER } from "@/graphql/user/mutations/download-file/pdf-download/pdf-download";
import { FETCH_EACH_ORDER } from "@/graphql/user/queries/fetch-each-order/fetch-each-order";
import { DownloadPdfResponse, FetchEachOrderResponse, OrderDetails, UserData } from "@/interfaces/user/user-details";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { message } from "antd";

export class OrderDetailsService {
    private client: ApolloClient<NormalizedCacheObject>;

    constructor(client: ApolloClient<NormalizedCacheObject>) {
        this.client = client;
    }

    // Fetch order details
    public fetchOrderDetails = async (
        orderId: number | null,
        setUserData: (data: UserData) => void,
        setOrderDetails: (data: OrderDetails) => void
    ): Promise<void> => {
        try {
            const { data } = await this.client.query<FetchEachOrderResponse>({
                query: FETCH_EACH_ORDER,
                variables: { id: orderId }
            });

            if (data.fetchEachOrder.status) {
                setOrderDetails(data.fetchEachOrder.data.orderData);
                setUserData(data.fetchEachOrder.data.userData);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            message.error("Failed to fetch order details.");
        }
    }

    // Download PDF by user
    public downloadPdfByUser = async (id: number | undefined): Promise<void> => {
        try {
            const { data } = await this.client.mutate<DownloadPdfResponse>({
                mutation: DOWNLOAD_PDF_USER,
                variables: { id: id }
            });

            if (data?.downloadPdfByUser.status) {
                const pdfBase64 = data.downloadPdfByUser.data.downloadUrl; // Assuming this is the base64 string
                const blob = this.b64toBlob(pdfBase64, 'application/pdf'); // Convert base64 to blob
                const url = URL.createObjectURL(blob); // Create an object URL
                console.log(url);

                const link = document.createElement("a");
                link.href = url; // Use the object URL to download the file
                link.download = `invoice_${id}.pdf`; // Set the desired filename
                document.body.appendChild(link);
                link.click(); // Trigger the download
                document.body.removeChild(link); // Clean up
                URL.revokeObjectURL(url); // Clean up the object URL
            } else {
                message.error(data?.downloadPdfByUser.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error downloading PDF:", error);
            message.error("Failed to download PDF."); // Optional: handle download errors
        }
    }

    // Helper function to convert base64 string to Blob
    private b64toBlob(b64Data: string, contentType: string = '', sliceSize: number = 512): Blob {
        // Replace any invalid base64 characters
        b64Data = b64Data.replace(/[^A-Za-z0-9+/=]/g, '');
        
        // Check if the string length is a multiple of 4
        while (b64Data.length % 4 !== 0) {
            b64Data += '=';
        }
    
        const byteCharacters = atob(b64Data);
        const byteArrays: Uint8Array[] = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        return new Blob(byteArrays, { type: contentType });
    }
    
}
