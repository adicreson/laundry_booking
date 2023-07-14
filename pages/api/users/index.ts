import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import Auth0 from "../../../src/classes/Auth0";
import { AxiosResponse } from "axios";

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })
    const userFetcher = new getUsers()
    const userSession = await getSession(req, res)

    if (userSession?.user.app_metadata.roles.indexOf("admin") > -1) {
        return res.status(403).json({ error: ERROR_MSG.NOTAUTHORIZED })
    }

    const handleCase: ResponseFuncs = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('GET_ALL_USERS')
            const data = await Auth0.getUsers().catch(catcher)
            res.status(200).json(data)
            return
        },

        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('POST_USER')
            const user = req.body
            const response = await Auth0.postUser(user).catch(catcher) as AxiosResponse
            if (response.statusText === "OK") {
                res.status(200).json({ message: "User created" })
                return
            }
            res.status(500).json({ error: "Kunde inte skapa användaren" })
            return
        },
    }

    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler