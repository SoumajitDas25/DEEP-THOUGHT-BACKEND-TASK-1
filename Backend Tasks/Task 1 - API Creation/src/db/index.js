import { MongoClient,ServerApiVersion } from "mongodb";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DATABASE_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

let db;
//method to create connection with mongoDB cluster
const connectDB= async ()=>{
    try
    {
        //connect to the mongoDB cluster
        await client.connect();
        //get the database reference in the cluster
        db = client.db(process.env.DATABASE_NAME)
        console.log(`\nDATABASE succecssfully connected !`);
    }
    catch(error)
    {
        console.error("DATABASE connection FAILED: ",error);
        process.exit(1);
    }
}

//method to return a collection reference by its name
const getDBCollection = async(name)=>{
    
    //check whether the database reference is present or not
    if(!db)
    {
        throw new Error("Database not connected, first connect to Database");
    }

    //get the collection reference
    const collection=await db.collection(name);
    if(collection)
        return collection;
    else
    {
        const server_error=`Something went wrong while accessing ${name} Collection`;
        //log the server error
        console.log(server_error)
        //send the server error message to the client
        res.status(500).json({
            error:server_error,
            success:false
        });
    }
}

export {connectDB,getDBCollection};