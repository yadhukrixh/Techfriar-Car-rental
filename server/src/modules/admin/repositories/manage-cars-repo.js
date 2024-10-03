import AllCars from "../models/cars-models.js";

class ManageCarsRepository{
    static async checkCarExist(name,year){
        try{
            const car = await AllCars.findOne({ where: { name,year } });
            if(car){
                return {
                    status:true,
                    message:"following car is already exist",
                }
            }
            else{
                return{
                    status:false
                }
            }

        }catch{
            throw new Error("Failed to fetch data from the database.")
        }
    };

    static async addCar(name,description,brandId,primaryImageUrl,otherImages,quantity,year,fuelType,transmissionType,numberOfSeats,numberOfDoors){
       
        try{
            const car = await AllCars.create({
                name:name,
                description:description,
                brandId:brandId,
                primaryImageUrl:primaryImageUrl,
                secondaryImages:otherImages,
                availableQuantity:quantity,
                year:year,
                fuelType:fuelType,
                transmissionType:transmissionType,
                numberOfSeats:numberOfSeats,
                numberOfDoors:numberOfDoors,
            });

            return{
                status:true,
                message:"Car added successfully",
                car
            }
        }catch(error){
            console.error(error);
            throw new Error("Failed to add car to database");
        }
    }
}

export default ManageCarsRepository