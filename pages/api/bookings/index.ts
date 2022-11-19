import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired } from "@auth0/nextjs-auth0"

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })
  await connect()

  
  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      res.json(await Booking.find({}).catch(catcher))
      res.status(200).send({ success: true })
      logRequest('GET');
    },
    // RESPONSE POST REQUESTS WITH VALIDATION, ONLY UNIQUE DATES CAN BE ADDED
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const {date, userName} = req.body
      let query = await Booking.findOne({date}).catch(catcher)
      if(!query){
        res.json(await Booking.create(req.body).catch(catcher))
        res.status(200).send({ success: true })
      }
      else{
        res.status(500).send({ success: false })
      }
      logRequest('POST');
      
      
    },
  }



  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler