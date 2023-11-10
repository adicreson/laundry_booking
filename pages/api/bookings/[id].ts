import {NextApiRequest, NextApiResponse} from "next"
import {connect} from "../../../utils/connection"
import {logRequest} from "../../../utils/backendLogger"
import {ERROR_MSG, ResponseFuncs} from "../../../utils/types"
import Booking from '../../../src/backend/mongooseModels/Booking'
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';
import {BackendPusher} from '../../../utils/pusherApi'
import {getBuilding} from "../../../utils/helperFunctions";

const backendPusher = new BackendPusher();

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({error: ERROR_MSG.GENERAL})
    const session = await getSession(req, res)
    const user = session?.user.name

    // GRAB ID FROM req.query (where next stores params)
    const id: string = req.query.id as string
    // connect to database
    await connect()

    // Potential Responses for /Bookings/:id
    const handleCase: ResponseFuncs = {

        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            res.json(await Booking.findById(id).catch(catcher))
        },
        // RESPONSE FOR DELETE REQUESTS WITH VALIDATION, CONFINED TO USER IN ACTIVE SESSION
        DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
            const queryResult = await Booking.find({_id: id, userName: user})
            if (!queryResult) {
                res.status(400).send({error: ERROR_MSG.NOBOOKING})
            } else {
                const {userName, date, timeSlot} = req.body
                const json = await Booking.findByIdAndDelete(id)
                await backendPusher.bookingUpdateTrigger(getBuilding(userName), {
                    userName,
                    date,
                    timeSlot,
                    method: backendPusher.bookingUpdateMethod.DELETE
                })
                res.status(200).json(json)
            }
        },
    }

    // Check if there is a response for the particular method, if so invoke it, if not response with an error
    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({error: ERROR_MSG.NOAPIRESPONSE})
});

export default handler