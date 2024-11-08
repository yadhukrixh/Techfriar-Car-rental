import ExcelJS from 'exceljs';
import Brands from '../modules/admin/models/brands-models.js';

export const parseExcelFile = async (stream) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(stream);

    const worksheet = workbook.getWorksheet(1); // Assuming data is in the first sheet
    const vehicles = [];

    // Loop through each row and extract values
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const [
        name,
        description,
        brandName,
        primaryImageFile, // Filename for primary image (not the file itself)
        secondaryImageFiles, // Comma-separated filenames for secondary images
        availableQuantity,
        year,
        fuelType,
        transmissionType,
        numberOfSeats,
        numberOfDoors,
        pricePerDay,
      ] = row.values.slice(1); // Skipping the first (index 0) empty cell


      // Check if brandName is missing or empty
      if (!brandName) {
        continue; // Skip the row if brandName is not provided
      }

      // Look up brandId based on brandName
      const brand = await Brands.findOne({ where: { name: brandName } });
      if (!brand) {
        throw new Error(`Brand not found for name: ${brandName}`);
      }

      const brandId = brand.id;

      // Handling image fields:
      // Ensure that image file names are being passed correctly
      const primaryImage = primaryImageFile;
      // Check if otherImageFiles is a string before splitting
      const secondaryImages = secondaryImageFiles.split(',').map((url)=>url);

      // Storing vehicle data without actual image files, just filenames (actual image files should be handled elsewhere)
      vehicles.push({
        name,
        description,
        brandId,
        primaryImageFile: primaryImage.text,  // Store the filename (image path should be handled in the controller)
        secondaryImageFiles: secondaryImages, // List of filenames
        availableQuantity: parseInt(availableQuantity),
        year: parseInt(year),
        fuelType,
        transmissionType,
        numberOfSeats: parseInt(numberOfSeats),
        numberOfDoors: parseInt(numberOfDoors),
        pricePerDay: parseInt(pricePerDay),
      });
    }

    // return vehicles data
    return vehicles;
  } catch (error) {
    console.error('Error parsing the Excel file:', error);
    throw new Error('Failed to parse the Excel file');
  }
};
