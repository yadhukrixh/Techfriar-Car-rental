import { gql } from "apollo-server-express";

const handleOrderTypeDefs = gql `
    type Query{
        fetchAllOrdersOfUser(id:Int!,timePeriod:String,searchQuery:String,orderStatus:String):OrdersResponse!
    }

    type OrdersResponse{
        status:Boolean!
        message:String!
        data:[OrderData]
    }

    type OrderData{
        orderId:Int!
        carName:String!
        image:String!
        registrationNumber:String!
        brandName:String!
        completionStatus:String!
        orderStatus:String!
        orderDate:String!
        bookedDates:[String]
    }
`;

export default handleOrderTypeDefs;