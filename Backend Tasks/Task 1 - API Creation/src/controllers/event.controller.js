import { ObjectId } from "mongodb";
import { getDBCollection } from "../db/index.js";

const collection_name="events";

//req handler method to create a new event entry
const createEvent = async (req,res)=>{
    try
    {
        // fetch event details from req body
        let {name,tagline,schedule,description,moderator,category,sub_category,rigor_rank,uid} = req.body;

        //validation - not empty
        const requiredFields = [name, tagline, schedule, description, moderator, category, sub_category, rigor_rank];
        if(requiredFields.some(
            field=>!field || String(field).trim()===""
        ))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"All Fields are required",
                success:false
            });
            return; //exit the control from the handler method
        }

        //check if the file field is present or not
        if(!(req.file && req.file.path))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Image File is required",
                success:false
            });
            return; //exit the control from the handler method
        }

        //if uid is not passed, generate a unique id 
        if(!uid)
        {
            uid = new ObjectId();
        }

        //get the collection reference
        const collection = await getDBCollection(collection_name);

        //insert the document into the collection
        const createdEvent=await collection.insertOne({
            type: "event",
            uid,
            name, 
            tagline, 
            schedule, 
            description,
            files:{
                image:req.file.path
            }, 
            moderator, 
            category, 
            sub_category, 
            rigor_rank,
            attendees:[]
        });
        if(createdEvent)
        {
            //send the eventId in response
            res.status(201).json({
                data: {
                    eventId:createdEvent.insertedId
                },
                message:"Event Successfully Created",
                success: true
            })
        }
        else
        {
            const server_error="Something went wrong while Inserting entry in db";
            //log the server error
            console.log("Error: ",server_error)
            //send the server error message to the client
            res.status(500).json({
                error:server_error,
                success:false
            });
        }

    }
    catch(err)
    {
        //log the error
        console.log("Error: ",err);
        //send a error reponse to the client
        res.status(500).json({
            error: "Something went wrong",
            success:false
        });
    }
}

//req handler method to get an event by its id
const getEventById = async (req,res,next)=>{
    try
    {
        //get eventId from req query
        if(! req.query.id)
        {
            // If no ID query parameter is passed, pass control to the next handler
            next();
            return;
            console.log("hello");
        }
        const eventId=req.query.id;

        //check whether eventId is valid ObjectId or not
        if(!ObjectId.isValid(eventId))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Invalid Event ID - Incorrect ObjectId format",
                success:false
            });
            return; //exit the control from the handler method
        }

        //get the collection reference
        const collection = await getDBCollection(collection_name);

        //get the event by its id
        const event = await collection.findOne({ 
            _id: new ObjectId(String(eventId)) 
        });
        if(event)
        {
            //send the event document in response
            res.status(200).json({
                data: {
                    event
                },
                message:"Event Successfully Fetched",
                success: true
            });
        }
        else
        {
            const server_error="Something went wrong while fetching event document";
            //log the server error
            console.log("Error: ",server_error)
            //send the server error message to the client
            res.status(500).json({
                error:server_error,
                success:false
            });
        }
    }
    catch(err)
    {
         //log the error
         console.log("Error: ",err);
         //send a error reponse to the client
         res.status(500).json({
             error: "Something went wrong",
             success:false
         });
    }
}

//req handler method to get paginated events based on its recency
const getPaginatedEvents = async (req,res)=>{
    try
    {
        //get details from req query
        if (!(req.query && req.query.type))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Event Type is required",
                success:false
            });
            return; //exit the control from the handler method        
        } 
        const { type, limit = 5, page = 1 } = req.query;

        //get the collection reference
        const collection = await getDBCollection(collection_name);

        //get all events
        const totalEvents = await collection.countDocuments();
        if(!totalEvents)
        {
            const server_error="Something went wrong while fetching event documents";
            //log the server error
            console.log("Error: ",server_error)
            //send the server error message to the client
            res.status(500).json({
                error:server_error,
                success:false
            });
            return; //exit the control from the handler method 
        }

        //check if page no. exceeds max page no.
        let totalPages = Math.ceil(Number(totalEvents) / Number(limit));
        if(totalPages < Number(page))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Current Page no. exceeds Maximum page no.",
                success:false
            });
            return; //exit the control from the handler method 
        }

        //get paginated events based on its recency
        const paginatedEvents = await collection.aggregate([
            {
                // Add a field with the ISODate format of the schedule
                $addFields: {
                    scheduleDate: {
                        $dateFromString: {
                            dateString: "$schedule",
                            format: "%d %b, %Y %H:%M"  // Specify the format of the date string
                        }
                    }
                }
            },
            {
                // Sort by the new scheduleDate field
                $sort: {
                    scheduleDate: 1  // sort in asscending order(most recent first)
                }
            },
            {   //No of docs to skip
                $skip: (Number(page) - 1) * Number(limit)
            },
            {   //Max No of docs to be fetched
                $limit: Number(limit)
            },
            {
                // Project to include only necessary fields
                $project: {
                    _id: 1,
                    name: 1,
                    tagline: 1,
                    schedule: 1,
                    description: 1,
                    files: 1,
                    moderator: 1,
                    category: 1,
                    sub_category: 1,
                    rigor_rank: 1,
                    attendees: 1
                }
            }
        ]).toArray();

        if(paginatedEvents)
        {
            //send paginated event documents in response
            res.status(200).json({
                data: {
                    totalEvents,
                    currentPage: Number(page),
                    totalPages,
                    paginatedEvents
                },
                message:"Paginated Events Successfully Fetched",
                success: true
            });
        }
        else
        {
            const server_error="Something went wrong while fetching paginated event documents";
            //log the server error
            console.log("Error: ",server_error)
            //send the server error message to the client
            res.status(500).json({
                error:server_error,
                success:false
            });
        }
    }
    catch(err)
    {
        //log the error
        console.log("Error: ",err);
        //send a error reponse to the client
        res.status(500).json({
            error: "Something went wrong",
            success:false
        });
    }
}

//req handler method to update an event by its id
const updateEventById = async (req,res)=>{
    try
    {
        //get eventId from req params
        if(!(req.params && req.params.id))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Event Id is required",
                success:false
            });
            return; //exit the control from the handler method
        }
        const eventId=req.params.id;
    
        //check whether eventId is valid ObjectId or not
        if(!ObjectId.isValid(eventId))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Invalid Event ID - Incorrect ObjectId format",
                success:false
            });
            return; //exit the control from the handler method
        }

         // fetch event details from req body
         const {name,tagline,schedule,description,moderator,category,sub_category,rigor_rank} = req.body;

         //validation - not empty
         const requiredFields = [name, tagline, schedule, description, moderator, category, sub_category, rigor_rank];
         if(requiredFields.some(
             field=>!field || String(field).trim()===""
         ))
         {
             //send the client error message to the client
             res.status(400).json({
                 error:"All Fields are required in order to update",
                 success:false
             });
             return; //exit the control from the handler method
         }

         //check if the file field is present or not
        if(!(req.file && req.file.path))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Image File is required",
                success:false
            });
            return; //exit the control from the handler method
        }
    
        //get the collection reference
        const collection = await getDBCollection(collection_name);

        const updateFields={
            name,
            tagline,
            schedule,
            description,
            files:{
                image:req.file.path
            }, 
            moderator,
            category,
            sub_category,
            rigor_rank};

        //update the event by its id
        const updatedEvent = await collection.updateOne(
            { _id: new ObjectId(String(eventId)) },  
            { $set: updateFields }       
        );
        if(updatedEvent.modifiedCount > 0)
        {
            res.status(200).json({
                message:"Event Successfully Updated",
                success: true
            });
        }
        else
        {
            const server_error="Something went wrong while updating event document";
            //log the server error
            console.log("Error: ",server_error)
            //send the server error message to the client
            res.status(500).json({
                error:server_error,
                success:false
            });
        }

    }
    catch(err)
    {
        //log the error
        console.log("Error: ",err);
        //send a error reponse to the client
        res.status(500).json({
            error: "Something went wrong",
            success:false
        });
    }
}

//req handler method to delete an event by its id
const deleteEventById = async (req,res)=>{
    try
    {
        //get eventId from req params
        if(!(req.params && req.params.id))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Event Id is required",
                success:false
            });
            return; //exit the control from the handler method
        }
        const eventId=req.params.id;
        
        //check whether eventId is valid ObjectId or not
        if(!ObjectId.isValid(eventId))
        {
            //send the client error message to the client
            res.status(400).json({
                error:"Invalid Event ID - Incorrect ObjectId format",
                success:false
            });
            return; //exit the control from the handler method
        }

        //get the collection reference
        const collection = await getDBCollection(collection_name);

        //delete the event by its id
        const result = await collection.deleteOne(
            { _id: new ObjectId(String(eventId)) }        
        );
        if(result.deletedCount > 0)
        {
            res.status(200).json({
                message:"Event Successfully Deleted",
                success: true
            });
        }
        else
        {
            const server_error="Something went wrong while deleting event document";
            //log the server error
            console.log("Error: ",server_error)
            //send the server error message to the client
            res.status(500).json({
                error:server_error,
                success:false
            });
        }

    }
    catch(err)
    {
        //log the error
        console.log("Error: ",err);
        //send a error reponse to the client
        res.status(500).json({
            error: "Something went wrong",
            success:false
        });
    }
}

export {
    createEvent,
    getEventById,
    updateEventById,
    deleteEventById,
    getPaginatedEvents
};