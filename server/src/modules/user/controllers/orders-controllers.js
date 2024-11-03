import axios from "axios";
import { buildOrderQuery } from "../../../config/typesense.js";
import typesenseClient from "../../../config/typesense.js";
import { FormatImageUrl } from "../../../utils/format-image-url.js";
import { OrdersRepository } from "../repositories/orders-repo.js";
import ExcelJs from "exceljs";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import { fileURLToPath } from "url"; // Import for ES module URL handling
import { dirname } from "path"; // Import for path handling

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class OrdersControllers {
  // fetch all orders by the user
  static async fetchAllOrdersOfUser(id, timePeriod, searchQuery, orderStatus) {
    try {
      // Build the filter query based on provided filters
      const orderFilters = buildOrderQuery({
        selectedTimePeriod: timePeriod,
        selectedStatus: orderStatus,
        searchQuery: searchQuery,
      });

      // Perform the search on Typesense "orders" collection
      const response = await typesenseClient
        .collections("orders")
        .documents()
        .search({
          q: searchQuery || "*", // Use '*' if search query is empty
          query_by:
            "userId, method, orderStatus, brandName, carName, bookedDates, completionStatus, registrationNumber",
          filter_by: orderFilters,
        });

      // Extract order IDs from the response and return them
      const orderIds = response.hits.map((hit) => parseInt(hit.document.id));

      //fetch orders from the database
      const usersOrders = await OrdersRepository.fetchAllOrdersOfUser(id);
      if (usersOrders.length > 0) {
        const formattedOrders = await Promise.all(
          usersOrders.map(async (order) => ({
            ...order,
            image: await FormatImageUrl.formatImageUrl(order.image),
          }))
        );

        const orders = formattedOrders.filter((order) =>
          orderIds.includes(order.orderId)
        );

        return {
          status: true,
          message: "Orders fetched successfully",
          data: orders,
        };
      }

      return {
        status: false,
        message: "No Orders found!",
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        status: false,
        message: "Server Error",
      };
    }
  }

  // download excel sheet to the user
  static async downloadExcelByUser(id) {
    try {
      const orders = await OrdersRepository.fetchAllOrdersOfUser(id);
      const formattedOrders = await Promise.all(
        orders.map(async (order) => ({
          ...order,
          image: await FormatImageUrl.formatImageUrl(order.image),
        }))
      );

      const workbook = new ExcelJs.Workbook();
      const worksheet = workbook.addWorksheet("User Orders");

      // Define the headers, including an "Image" column
      worksheet.columns = [
        { header: "Order ID", key: "orderId", width: 15 },
        { header: "Car Name", key: "carName", width: 20 },
        { header: "Brand Name", key: "brandName", width: 20 },
        { header: "Registration Number", key: "registrationNumber", width: 20 },
        { header: "Order Status", key: "orderStatus", width: 15 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Completion Status", key: "completionStatus", width: 20 },
        { header: "Order Date", key: "orderDate", width: 20 },
        { header: "Booked Dates", key: "bookedDates", width: 30 },
        { header: "Image", key: "image", width: 30 }, // Column for images
      ];

      // Loop through orders and add each order's data to the worksheet
      for (const order of formattedOrders) {
        // Download the image as a buffer
        const imageBuffer = (
          await axios.get(order.image, { responseType: "arraybuffer" })
        ).data;

        // Add a new row for each order (without the image)
        const row = worksheet.addRow({
          orderId: order.orderId,
          carName: order.carName,
          brandName: order.brandName,
          registrationNumber: order.registrationNumber,
          orderStatus: order.orderStatus,
          amount: order.amount,
          completionStatus: order.completionStatus,
          orderDate: order.orderDate.toString(),
          bookedDates: order.bookedDates.join(", "),
        });

        // Add the image to the workbook and get the image ID
        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: "jpeg", // or 'png', based on image format
        });

        // Position the image in the cell next to the row
        worksheet.addImage(imageId, {
          tl: { col: 9, row: row.number - 1 }, // 'Image' column index (0-based)
          ext: { width: 100, height: 60 }, // Set dimensions
        });
      }

      // Prepare the workbook for download
      const buffer = await workbook.xlsx.writeBuffer();

      const excelUrl = buffer.toString("base64");

      return {
        status: true,
        message: "Excel file generated successfully",
        data: {
          downloadUrl: excelUrl,
        },
      };
    } catch (error) {
      console.error("Error generating Excel file:", error);
      return {
        status: false,
        message: "Error generating Excel file",
      };
    }
  }

  // fetch each order details
  static async fetchEachOrder(id) {
    try {
      const orderData = await OrdersRepository.fetchEachOrder(id);
      const formattedOrder = {
        userData: {
          ...orderData.userData,
        },
        orderData: {
          ...orderData.orderedData,
          carImage: await FormatImageUrl.formatImageUrl(
            orderData.orderedData.carImage
          ),
        },
      };

      return {
        status: true,
        message: "Order data fetched successfully",
        data: formattedOrder,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        message: error.message || "An error occurred while fetching order data",
      };
    }
  }

  // download pdf by user
  static async downloadPdfByUser(id) {
    try {
      // Helper function to load and compile the template
      const loadTemplate = (data) => {
        const filePath = path.join(
          __dirname,
          "../../../templates/invoice.html"
        );
        const source = fs.readFileSync(filePath, "utf8");
        const template = handlebars.compile(source);
        return template(data);
      };

      // Ensure the pdfDirectory is defined
      const pdfDirectory = path.join(__dirname, "pdfs");
      if (!fs.existsSync(pdfDirectory)) {
        fs.mkdirSync(pdfDirectory); // Create the directory if it doesn't exist
      }

      // Helper function to generate the PDF
      const generatePDF = async (data, fileName) => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Render the HTML template with data
        const html = loadTemplate(data);
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Save the PDF to a specified path
        const pdfPath = path.join(pdfDirectory, `${fileName}.pdf`);
        await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

        await browser.close();

        const pdfBuffer = fs.readFileSync(pdfPath); // Read the PDF file
        const base64String = pdfBuffer.toString("base64"); // Convert buffer to base64

        // Optionally remove the PDF file after conversion
        fs.unlinkSync(pdfPath); // Clean up the generated PDF file

        return base64String;
      };

      // Fetch order data from the database
      const orderData = await OrdersRepository.fetchEachOrder(id);

      // Prepare data for the invoice template
      const invoiceData = {
        orderId: id,
        orderDate: new Date(
          orderData.orderedData.orderedDate
        ).toLocaleDateString(),
        userName: orderData.userData.name,
        userCity: orderData.userData.city,
        userState: orderData.userData.state,
        userPhoneNumber: orderData.userData.phoneNumber,
        paymentStatus: orderData.orderedData.status,
        paymentMethod: orderData.orderedData.method,
        paymentId: orderData.orderedData.paymentId,
        carName: orderData.orderedData.carName,
        bookedDates: orderData.orderedData.bookedDates.length,
        totalAmount: orderData.orderedData.amount,
        pricePerDay: orderData.orderedData.pricePerDay,
      };

      // Generate PDF file and get base64 string
      const base64String = await generatePDF(invoiceData, `invoice_${id}`);

      return {
        status: true,
        message: "PDF generated successfully",
        data: {
          downloadUrl: base64String, // Return the base64 string to the frontend
        },
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      return {
        status: false,
        message: "Error generating PDF",
      };
    }
  }
}
