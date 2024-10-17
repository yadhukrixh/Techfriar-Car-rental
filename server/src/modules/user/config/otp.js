// Import dependencies
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the API key from the environment variables
const apiKey = process.env.MOBILE_OTP_API_KEY;

// Function to send OTP SMS
export const sendOtpSms = async (phoneNumber) => {
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumber}/AUTOGEN2/rentalia`;

  // Axios config object
  const config = {
    method: "get",
    maxBodyLength: Infinity, // Optional: You can keep this or remove it if not needed
    url: url,
    headers: {},
  };

  // Send the GET request with axios
  try {
    const response = await axios(config);
    console.log("SMS sent successfully:", response.data); // Log success message with response data Had to remove
    return{
        status:true,
        message:"OTP Sent successfully"
    }
  } catch (error) {
    console.error("Error sending SMS:", error); // Log any error that occurs
    return{
        status:false,
        message:error
    }
  }
};

export const verifyOtpApi = async (phoneNumber, otp) => {
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${phoneNumber}/${otp}`;

  // Axios config object
  const config = {
    method: "get",
    maxBodyLength: Infinity, // Optional, depending on the request payload
    url: url,
    headers: {},
  };

  // Send the GET request with axios to verify OTP
  try {
    const response = await axios(config);
    console.log("OTP verification response:", response.data); // Log the verification result
    if(response.data.Status === "Success"){
        return{
            status:true,
            message:"OTP validated successfullt"
        }
    }else{
        return{
            status:false,
            message:"OTP mismatched, please try again"
        }
    }

  } catch (error) {
    console.error("Error verifying OTP:", error); // Log any error that occurs during verification
    return{
        status:false,
        message:error
    }
  }
};


